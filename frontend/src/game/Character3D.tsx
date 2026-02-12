/**
 * Character3D — Reusable 3D character component for KayKit characters in Quest AI.
 *
 * Features:
 * - Loads character GLB from asset manifest
 * - Clones skeleton for independent animation instances
 * - Loads and applies shared Rig_Medium animations
 * - Smooth crossfade between animations (0.25s default)
 * - Idle breathing effect (subtle scale pulse)
 * - Imperative ref API for external control
 *
 * Usage:
 *   <Character3D
 *     characterId="knight"
 *     position={[0, 0, 0]}
 *     currentAnimation="Cheering"
 *     animationPacks={['general', 'simulation']}
 *     onReady={() => console.log('Character loaded')}
 *   />
 */

import { useRef, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import {
  CHARACTERS,
  ASSET_BASE,
  type CharacterKey,
  type AnimationPackKey,
} from '../data/asset-manifest'
import { useAnimationClips } from './AnimationController'

const DEFAULT_FADE_DURATION = 0.25
const BREATHING_SCALE_MIN = 1.0
const BREATHING_SCALE_MAX = 1.015
const BREATHING_PERIOD = 2.5 // seconds

export interface Character3DProps {
  characterId: CharacterKey
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  currentAnimation?: string
  animationPacks?: AnimationPackKey[]
  onReady?: () => void
}

export interface Character3DHandle {
  play: (animationName: string, fadeDuration?: number) => void
  getPosition: () => THREE.Vector3
}

const Character3DInner = forwardRef<Character3DHandle, Character3DProps>(
  (
    {
      characterId,
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = 1,
      currentAnimation = 'Idle_A',
      animationPacks = [
        'general',
        'movement_basic',
        'movement_advanced',
        'combat_melee',
        'combat_ranged',
        'simulation',
        'special',
        'tools',
      ],
      onReady,
    },
    ref,
  ) => {
    const groupRef = useRef<THREE.Group>(null!)
    const breathingPhaseRef = useRef(0)

    // Load character GLB
    const characterPath = `${ASSET_BASE}${CHARACTERS[characterId]}`
    const { scene: originalScene } = useGLTF(characterPath)

    // Clone the scene for independent skeleton instances
    const clonedScene = useMemo(() => {
      const clone = SkeletonUtils.clone(originalScene) as THREE.Group
      // Enable shadow casting on all mesh children
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      return clone
    }, [originalScene, characterId])

    // Load animation clips
    const animationClips = useAnimationClips(animationPacks)

    // Apply animations
    const { actions, mixer } = useAnimations(animationClips, groupRef)

    const currentAnimRef = useRef<string | null>(null)

    // Play animation helper
    const playAnimation = (animName: string, fadeDuration = DEFAULT_FADE_DURATION) => {
      const targetAction = actions[animName]
      if (!targetAction) {
        console.warn(
          `[Character3D] Animation "${animName}" not found for "${characterId}". Available:`,
          Object.keys(actions).slice(0, 10),
          '...',
        )
        // Try fallback
        if (animName !== 'Idle_A' && actions['Idle_A']) {
          playAnimation('Idle_A', fadeDuration)
        }
        return
      }

      // Crossfade from current to target
      const previousAnim = currentAnimRef.current
      if (previousAnim && previousAnim !== animName && actions[previousAnim]) {
        actions[previousAnim]!.fadeOut(fadeDuration)
      }

      targetAction.reset().fadeIn(fadeDuration).play()
      currentAnimRef.current = animName
    }

    // Expose imperative API
    useImperativeHandle(ref, () => ({
      play: playAnimation,
      getPosition: () => {
        if (!groupRef.current) return new THREE.Vector3(...position)
        return groupRef.current.position.clone()
      },
    }))

    // Play initial animation on mount
    useEffect(() => {
      playAnimation(currentAnimation, 0.3)
      // Signal ready after first animation loads
      if (onReady) onReady()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // React to currentAnimation prop changes
    useEffect(() => {
      if (currentAnimation && currentAnimation !== currentAnimRef.current) {
        playAnimation(currentAnimation, DEFAULT_FADE_DURATION)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAnimation])

    // Idle breathing effect
    useFrame((_state, delta) => {
      if (!groupRef.current) return

      // Update animation mixer
      if (mixer) mixer.update(delta)

      // Breathing effect (subtle scale pulse)
      breathingPhaseRef.current += delta / BREATHING_PERIOD
      const phase = (breathingPhaseRef.current % 1.0) * Math.PI * 2 // 0 to 2π
      const breathScale = THREE.MathUtils.lerp(
        BREATHING_SCALE_MIN,
        BREATHING_SCALE_MAX,
        (Math.sin(phase) + 1) * 0.5, // sine wave 0 to 1
      )
      groupRef.current.scale.setScalar(scale * breathScale)
    })

    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <primitive object={clonedScene} />
      </group>
    )
  },
)

Character3DInner.displayName = 'Character3D'

export const Character3D = Character3DInner
