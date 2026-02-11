/**
 * VillageCamera — Camera controller for the medieval village world.
 *
 * Two modes:
 * 1. Village mode (no currentZone): third-person follow behind player
 *    - Camera follows at FOLLOW_OFFSET, rotated by cameraYaw
 *    - Right-click drag or Q/E keys rotate the camera horizontally
 *    - Polar angle (elevation) stays fixed
 * 2. Zone mode (currentZone set): fly-to zone center + orbit controls
 *    - Camera flies to zone with ease-out cubic
 *    - OrbitControls enabled after arrival
 */

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../stores/gameStore'

// Follow offset for third-person village walking (before yaw rotation)
const FOLLOW_DISTANCE = 14
const FOLLOW_HEIGHT = 8
const ZONE_CAMERA_OFFSET = new THREE.Vector3(0, 8, 14)

// Orbit settings (zone mode only)
const MIN_POLAR_ANGLE = 0.3
const MAX_POLAR_ANGLE = 1.2
const MIN_DISTANCE = 12
const MAX_DISTANCE = 60

// Camera rotation
const MOUSE_SENSITIVITY = 0.005
const KEY_ROTATE_SPEED = 2.0 // radians/sec

// Ease-out cubic for smooth deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const TRANSITION_DURATION = 2.0 // seconds
const FOLLOW_SMOOTHING = 3.0 // exponential smoothing factor

// Reusable vectors to avoid GC pressure
const _targetPos = new THREE.Vector3()
const _targetLook = new THREE.Vector3()
const _followOffset = new THREE.Vector3()

export function VillageCamera() {
  const cameraTarget = useGameStore((s) => s.cameraTarget)
  const currentZone = useGameStore((s) => s.currentZone)
  const isTransitioning = useGameStore((s) => s.isTransitioning)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const cameraYaw = useGameStore((s) => s.cameraYaw)
  const rotateCameraYaw = useGameStore((s) => s.rotateCameraYaw)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const controlsRef = useRef<any>(null)

  // Track right-mouse drag for rotation
  const isDraggingRef = useRef(false)
  // Track rotation keys
  const rotateKeysRef = useRef(new Set<string>())

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

  const { gl } = useThree()

  // Mouse drag handlers for camera rotation (right-click or middle-click)
  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      // Right-click (2) or middle-click (1)
      if (e.button === 2 || e.button === 1) {
        isDraggingRef.current = true
        canvas.setPointerCapture(e.pointerId)
        e.preventDefault()
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      if (currentZone) return // Let orbit controls handle zone mode
      rotateCameraYaw(-e.movementX * MOUSE_SENSITIVITY)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 2 || e.button === 1) {
        isDraggingRef.current = false
        canvas.releasePointerCapture(e.pointerId)
      }
    }

    const onContextMenu = (e: Event) => {
      e.preventDefault() // Prevent right-click context menu on canvas
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyQ' || e.code === 'KeyE') {
        rotateKeysRef.current.add(e.code)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      rotateKeysRef.current.delete(e.code)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [gl, currentZone, rotateCameraYaw])

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

    // Calculate destination
    const endTarget = new THREE.Vector3(...cameraTarget)
    endTarget.y = currentZone ? 1 : 0

    let endPos: THREE.Vector3
    if (currentZone) {
      endPos = endTarget.clone().add(ZONE_CAMERA_OFFSET)
    } else {
      // Returning to village — use yaw-rotated offset
      _followOffset.set(
        Math.sin(cameraYaw) * FOLLOW_DISTANCE,
        FOLLOW_HEIGHT,
        Math.cos(cameraYaw) * FOLLOW_DISTANCE,
      )
      endPos = endTarget.clone().add(_followOffset)
    }

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

    // --- Q/E key rotation (village mode only) ---
    if (!currentZone && !t.active) {
      const rotateKeys = rotateKeysRef.current
      if (rotateKeys.has('KeyQ')) rotateCameraYaw(KEY_ROTATE_SPEED * delta)
      if (rotateKeys.has('KeyE')) rotateCameraYaw(-KEY_ROTATE_SPEED * delta)
    }

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

      // Compute yaw-rotated follow offset
      _followOffset.set(
        Math.sin(cameraYaw) * FOLLOW_DISTANCE,
        FOLLOW_HEIGHT,
        Math.cos(cameraYaw) * FOLLOW_DISTANCE,
      )

      // Target: camera at rotated offset from player
      _targetPos.set(
        playerPosition[0] + _followOffset.x,
        playerPosition[1] + _followOffset.y,
        playerPosition[2] + _followOffset.z,
      )
      _targetLook.set(playerPosition[0], playerPosition[1], playerPosition[2])

      // Exponential smoothing
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
