/**
 * TaskIntro — Fog walk-through intro animation for task transitions.
 *
 * Plays a 5-second sequence when a task is selected:
 *   0-0.5s  Dense fog wall (nothing visible)
 *   0.5-2s  "Quest AI" title fades in, sparkles swirl
 *   2-3s    Title scales up + disperses, camera begins dolly
 *   3-4.5s  Fog clears, camera pushes forward, silhouettes emerge
 *   4.5-5s  Settle at final position, unmount
 *
 * Rendered inside the R3F Canvas alongside TaskAtmosphere and ScenePlayer3D.
 * Parent controls lifecycle via `introPlaying` state + `onComplete` callback.
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { getConfig } from './TaskAtmosphere'
import { SoundManager3D } from './SoundManager3D'

const INTRO_DURATION = 5.0 // seconds total
const FONT_URL = '/assets/raw-packs/kenney_ui-pack/Font/Kenney Future.ttf'

// Camera positions
const CAMERA_START: [number, number, number] = [0, 4, 20]
const CAMERA_END: [number, number, number] = [0, 4, 8]

// Phase breakpoints (normalized 0-1 over INTRO_DURATION)
const TITLE_FADE_IN = 0.10   // t=0.5s — title begins appearing
const TITLE_HOLD = 0.35      // t=1.75s — title fully visible
const TITLE_DISSOLVE = 0.45  // t=2.25s — title begins dispersing
const TITLE_GONE = 0.55      // t=2.75s — title fully gone
const REVEAL_START = 0.50    // t=2.5s — fog starts clearing, camera starts moving
const SETTLE = 1.0           // t=5s — animation complete

interface TaskIntroProps {
  taskId: string
  onComplete: () => void
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function TaskIntro({ taskId, onComplete }: TaskIntroProps) {
  const progressRef = useRef(0)
  const completedRef = useRef(false)
  const textRef = useRef<any>(null)
  const initializedRef = useRef(false)
  const [done, setDone] = useState(false)

  const { scene, camera } = useThree()
  const targetConfig = getConfig(taskId)

  // Play intro sound on mount
  useEffect(() => {
    SoundManager3D.play('intro')
  }, [])

  // Skip intro on click/tap
  const skipIntro = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true

    // Snap to final values
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.near = targetConfig.fog.near
      scene.fog.far = targetConfig.fog.far
    }
    camera.position.set(...CAMERA_END)

    setDone(true)
    onComplete()
  }, [scene, camera, targetConfig, onComplete])

  useFrame((_state, delta) => {
    if (completedRef.current) return

    // First frame: snap camera and fog to intro start values
    if (!initializedRef.current) {
      initializedRef.current = true
      camera.position.set(...CAMERA_START)
      if (scene.fog && scene.fog instanceof THREE.Fog) {
        scene.fog.near = 0
        scene.fog.far = 3
      }
    }

    // Advance progress
    progressRef.current = Math.min(progressRef.current + delta / INTRO_DURATION, 1.0)
    const t = progressRef.current

    // === FOG ANIMATION ===
    // Fog stays extremely dense until reveal, then clears to task values
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      if (t < REVEAL_START) {
        // Keep dense — slight easing from near=0 to near=1 for subtle depth
        const earlyT = t / REVEAL_START
        scene.fog.near = THREE.MathUtils.lerp(0, 1, earlyT * 0.3)
        scene.fog.far = THREE.MathUtils.lerp(3, 5, earlyT * 0.3)
      } else {
        // Reveal: animate from dense to task values
        const revealT = (t - REVEAL_START) / (SETTLE - REVEAL_START)
        const eased = easeOutCubic(revealT)
        scene.fog.near = THREE.MathUtils.lerp(1, targetConfig.fog.near, eased)
        scene.fog.far = THREE.MathUtils.lerp(5, targetConfig.fog.far, eased)
      }
    }

    // === CAMERA DOLLY ===
    if (t >= REVEAL_START) {
      const cameraT = (t - REVEAL_START) / (SETTLE - REVEAL_START)
      const eased = easeOutCubic(Math.min(cameraT, 1.0))
      camera.position.z = THREE.MathUtils.lerp(CAMERA_START[2], CAMERA_END[2], eased)
      camera.position.y = CAMERA_START[1]
    }

    // === TITLE TEXT ===
    if (textRef.current) {
      let opacity = 0
      let scale = 1

      if (t < TITLE_FADE_IN) {
        // Not yet visible
        opacity = 0
      } else if (t < TITLE_HOLD) {
        // Fade in
        const fadeT = (t - TITLE_FADE_IN) / (TITLE_HOLD - TITLE_FADE_IN)
        opacity = easeOutCubic(fadeT) * 0.9
      } else if (t < TITLE_DISSOLVE) {
        // Hold
        opacity = 0.9
      } else if (t < TITLE_GONE) {
        // Dissolve — scale up + fade out
        const dissolveT = (t - TITLE_DISSOLVE) / (TITLE_GONE - TITLE_DISSOLVE)
        const eased = easeOutCubic(dissolveT)
        opacity = 0.9 * (1 - eased)
        scale = 1 + 0.5 * eased
      } else {
        opacity = 0
      }

      textRef.current.fillOpacity = opacity
      textRef.current.scale.setScalar(scale)
    }

    // === COMPLETE ===
    if (t >= 1.0 && !completedRef.current) {
      completedRef.current = true

      // Snap to exact final values
      if (scene.fog && scene.fog instanceof THREE.Fog) {
        scene.fog.near = targetConfig.fog.near
        scene.fog.far = targetConfig.fog.far
      }
      camera.position.set(...CAMERA_END)

      setDone(true)
      onComplete()
    }
  })

  if (done) return null

  return (
    <>
      {/* Clickable overlay to skip intro */}
      <mesh
        position={[0, 2, CAMERA_START[2] - 1]}
        onClick={skipIntro}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Title text floating in fog */}
      <Text
        ref={textRef}
        position={[0, 3.5, 12]}
        fontSize={1.6}
        color="#ffffff"
        font={FONT_URL}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0}
        outlineWidth={0.05}
        outlineColor="#aa88ff"
        outlineOpacity={0}
      >
        Quest AI
      </Text>

      {/* Dense intro sparkles — more particles, faster, bigger */}
      <Sparkles
        count={200}
        speed={1.5}
        opacity={0.8}
        color={targetConfig.sparkles.color}
        size={4}
        scale={[15, 8, 15]}
        noise={2}
      />
    </>
  )
}
