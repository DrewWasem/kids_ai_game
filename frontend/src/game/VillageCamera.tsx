/**
 * VillageCamera — Camera controller for the medieval village world.
 *
 * Two modes:
 * 1. Village mode (no currentZone): third-person follow behind player
 *    - Disables OrbitControls
 *    - Camera lerps to playerPos + FOLLOW_OFFSET
 *    - Look-target lerps to playerPos
 * 2. Zone mode (currentZone set): fly-to zone center + orbit controls
 *    - Camera flies to zone with ease-out cubic
 *    - OrbitControls enabled after arrival
 */

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../stores/gameStore'

// Follow offset for third-person village walking (close enough to see character detail)
const FOLLOW_OFFSET = new THREE.Vector3(0, 8, 14)
const ZONE_CAMERA_OFFSET = new THREE.Vector3(0, 8, 14)

// Orbit settings (zone mode only)
const MIN_POLAR_ANGLE = 0.3
const MAX_POLAR_ANGLE = 1.2
const MIN_DISTANCE = 12
const MAX_DISTANCE = 60

// Ease-out cubic for smooth deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const TRANSITION_DURATION = 2.0 // seconds
const FOLLOW_SMOOTHING = 3.0 // exponential smoothing factor

// Reusable vectors to avoid GC pressure
const _targetPos = new THREE.Vector3()
const _targetLook = new THREE.Vector3()

export function VillageCamera() {
  const cameraTarget = useGameStore((s) => s.cameraTarget)
  const currentZone = useGameStore((s) => s.currentZone)
  const isTransitioning = useGameStore((s) => s.isTransitioning)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const controlsRef = useRef<any>(null)

  // Animation state for fly-to transitions
  const transitionRef = useRef({
    active: false,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    elapsed: 0,
    duration: TRANSITION_DURATION,
  })

  // Skip fly-to on initial mount — follow mode handles it
  const mountedRef = useRef(false)

  // Start fly-to transition when entering/exiting a zone
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    if (!cameraRef.current || !controlsRef.current) return

    const cam = cameraRef.current
    const controls = controlsRef.current
    const t = transitionRef.current

    // Pick offset: zone = orbit view, village = follow offset from player
    const offset = currentZone ? ZONE_CAMERA_OFFSET : FOLLOW_OFFSET

    // Calculate destination
    const endTarget = new THREE.Vector3(...cameraTarget)
    endTarget.y = currentZone ? 1 : 0
    const endPos = endTarget.clone().add(offset)

    t.active = true
    t.startPos.copy(cam.position)
    t.endPos.copy(endPos)
    t.startTarget.copy(controls.target)
    t.endTarget.copy(endTarget)
    t.elapsed = 0

    // Disable orbit during transition
    controls.enabled = false
  }, [cameraTarget, currentZone])

  // Main frame loop: handles transitions + follow mode
  useFrame((_, delta) => {
    if (!cameraRef.current || !controlsRef.current) return

    const cam = cameraRef.current
    const controls = controlsRef.current
    const t = transitionRef.current

    // --- Fly-to transition (entering or exiting zone) ---
    if (t.active) {
      t.elapsed += delta
      const progress = Math.min(t.elapsed / t.duration, 1)
      const eased = easeOutCubic(progress)

      cam.position.lerpVectors(t.startPos, t.endPos, eased)
      controls.target.lerpVectors(t.startTarget, t.endTarget, eased)
      controls.update()

      if (progress >= 1) {
        t.active = false
        // Only enable orbit in zone mode
        controls.enabled = !!currentZone
        if (isTransitioning) {
          useGameStore.setState({ isTransitioning: false })
        }
      }
      return
    }

    // --- Village follow mode (no zone, no transition) ---
    if (!currentZone) {
      controls.enabled = false

      // Target: camera behind and above player
      _targetPos.set(
        playerPosition[0] + FOLLOW_OFFSET.x,
        playerPosition[1] + FOLLOW_OFFSET.y,
        playerPosition[2] + FOLLOW_OFFSET.z,
      )
      _targetLook.set(playerPosition[0], playerPosition[1], playerPosition[2])

      // Exponential smoothing: 1 - exp(-factor * delta)
      const smoothing = 1 - Math.exp(-FOLLOW_SMOOTHING * delta)
      cam.position.lerp(_targetPos, smoothing)
      controls.target.lerp(_targetLook, smoothing)
      controls.update()
    }
    // Zone mode: orbit controls handle it
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={45}
        position={[0, 8, 14]}
        near={0.1}
        far={500}
      />
      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        minPolarAngle={MIN_POLAR_ANGLE}
        maxPolarAngle={MAX_POLAR_ANGLE}
        minDistance={MIN_DISTANCE}
        maxDistance={MAX_DISTANCE}
        enablePan={false}
        enabled={false}
      />
    </>
  )
}
