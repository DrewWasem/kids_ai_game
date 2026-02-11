/**
 * VillageCamera — Camera controller for the medieval village world.
 *
 * Handles:
 * - Smooth camera transitions between village center and quest zones
 * - Different camera distances for overview vs zone views
 * - Limited orbit controls within current zone
 * - Camera fly animation using useFrame with ease-out cubic
 */

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../stores/gameStore'

// Camera offsets: village overview shows the whole 7x-scale village, zones zoom in
const VILLAGE_CAMERA_OFFSET = new THREE.Vector3(0, 40, 60)
const ZONE_CAMERA_OFFSET = new THREE.Vector3(0, 18, 28)

// Orbit settings
const MIN_POLAR_ANGLE = 0.3
const MAX_POLAR_ANGLE = 1.2
const MIN_DISTANCE = 12
const MAX_DISTANCE = 120

// Ease-out cubic for smooth deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const TRANSITION_DURATION = 2.0 // seconds

export function VillageCamera() {
  const cameraTarget = useGameStore((s) => s.cameraTarget)
  const currentZone = useGameStore((s) => s.currentZone)
  const isTransitioning = useGameStore((s) => s.isTransitioning)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const controlsRef = useRef<any>(null)

  // Animation state
  const transitionRef = useRef({
    active: false,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    elapsed: 0,
    duration: TRANSITION_DURATION,
  })

  // Start transition when cameraTarget or zone changes
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return

    const cam = cameraRef.current
    const controls = controlsRef.current
    const t = transitionRef.current

    // Pick offset based on whether we're going to a zone or back to village
    const offset = currentZone ? ZONE_CAMERA_OFFSET : VILLAGE_CAMERA_OFFSET

    // Calculate destination
    const endTarget = new THREE.Vector3(...cameraTarget)
    endTarget.y = 1
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

  // Animate camera position + target
  useFrame((_, delta) => {
    const t = transitionRef.current
    if (!t.active || !cameraRef.current || !controlsRef.current) return

    t.elapsed += delta
    const progress = Math.min(t.elapsed / t.duration, 1)
    const eased = easeOutCubic(progress)

    cameraRef.current.position.lerpVectors(t.startPos, t.endPos, eased)
    controlsRef.current.target.lerpVectors(t.startTarget, t.endTarget, eased)
    controlsRef.current.update()

    if (progress >= 1) {
      t.active = false
      controlsRef.current.enabled = true
      if (isTransitioning) {
        useGameStore.setState({ isTransitioning: false })
      }
    }
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={45}
        position={[0, 40, 60]}
        near={0.1}
        far={500}
      />
      <OrbitControls
        ref={controlsRef}
        target={[0, 1, 0]}
        minPolarAngle={MIN_POLAR_ANGLE}
        maxPolarAngle={MAX_POLAR_ANGLE}
        minDistance={MIN_DISTANCE}
        maxDistance={MAX_DISTANCE}
        enablePan={false}
      />
    </>
  )
}
