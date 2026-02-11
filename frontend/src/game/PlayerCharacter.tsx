/**
 * PlayerCharacter — WASD/arrow-key controlled Knight that walks around the village.
 *
 * - Wraps Character3D with knight model + general/movement_basic packs
 * - Keyboard: WASD or arrows to move, Shift to run
 * - Animations: Idle_A (stopped), Walking_A (moving), Running_A (shift)
 * - Faces movement direction via atan2
 * - Boundary clamp: x [-40, 40], z [-45, 45]
 * - Disabled when inside a quest zone
 */

import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Character3D, type Character3DHandle } from './Character3D'

const WALK_SPEED = 8
const RUN_SPEED = 14
const BOUNDS = { minX: -40, maxX: 40, minZ: -65, maxZ: 45 }

interface PlayerCharacterProps {
  enabled: boolean
  onPositionUpdate: (pos: [number, number, number]) => void
}

export function PlayerCharacter({ enabled, onPositionUpdate }: PlayerCharacterProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const characterRef = useRef<Character3DHandle>(null!)
  const keysRef = useRef(new Set<string>())
  const currentAnimRef = useRef('Idle_A')

  // Track pressed keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.code)
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.code)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // When disabled (entering a zone): clear keys, reset to idle (keep visible)
  useEffect(() => {
    if (!enabled) {
      keysRef.current.clear()
      if (characterRef.current && currentAnimRef.current !== 'Idle_A') {
        characterRef.current.play('Idle_A', 0.2)
        currentAnimRef.current = 'Idle_A'
      }
    }
  }, [enabled])

  useFrame((_, delta) => {
    if (!enabled || !groupRef.current) return

    const keys = keysRef.current
    const dir = { x: 0, z: 0 }

    if (keys.has('KeyW') || keys.has('ArrowUp')) dir.z -= 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) dir.z += 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) dir.x -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) dir.x += 1

    const moving = dir.x !== 0 || dir.z !== 0
    const running = moving && (keys.has('ShiftLeft') || keys.has('ShiftRight'))
    const speed = running ? RUN_SPEED : WALK_SPEED

    if (moving) {
      // Normalize diagonal movement
      const len = Math.sqrt(dir.x * dir.x + dir.z * dir.z)
      dir.x /= len
      dir.z /= len

      // Move position
      const pos = groupRef.current.position
      pos.x += dir.x * speed * delta
      pos.z += dir.z * speed * delta

      // Clamp to bounds
      pos.x = THREE.MathUtils.clamp(pos.x, BOUNDS.minX, BOUNDS.maxX)
      pos.z = THREE.MathUtils.clamp(pos.z, BOUNDS.minZ, BOUNDS.maxZ)

      // Face movement direction
      const angle = Math.atan2(dir.x, dir.z)
      groupRef.current.rotation.y = angle

      // Report position
      onPositionUpdate([pos.x, pos.y, pos.z])
    }

    // Animation state transitions
    const targetAnim = !moving ? 'Idle_A' : running ? 'Running_A' : 'Walking_A'
    if (targetAnim !== currentAnimRef.current && characterRef.current) {
      characterRef.current.play(targetAnim, 0.2)
      currentAnimRef.current = targetAnim
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Character3D
        ref={characterRef}
        characterId="knight"
        animationPacks={['general', 'movement_basic']}
        currentAnimation="Idle_A"
      />
    </group>
  )
}
