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
import { useGameStore } from '../stores/gameStore'
import { collidesWithAny } from './collision-registry'

const WALK_SPEED = 8
const RUN_SPEED = 14
const BOUNDS = { minX: -55, maxX: 55, minZ: -80, maxZ: 55 }
const PLAYER_RADIUS = 0.5 // character collision radius

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

  // Read cameraYaw from store via ref to avoid re-renders every frame
  const cameraYawRef = useRef(0)
  useFrame(() => {
    cameraYawRef.current = useGameStore.getState().cameraYaw
  })

  useFrame((_, delta) => {
    if (!enabled || !groupRef.current) return

    const keys = keysRef.current
    let dirX = 0
    let dirZ = 0

    if (keys.has('KeyW') || keys.has('ArrowUp')) dirZ -= 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) dirZ += 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) dirX -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) dirX += 1

    const moving = dirX !== 0 || dirZ !== 0
    const running = moving && (keys.has('ShiftLeft') || keys.has('ShiftRight'))
    const speed = running ? RUN_SPEED : WALK_SPEED

    if (moving) {
      // Normalize diagonal movement
      const len = Math.sqrt(dirX * dirX + dirZ * dirZ)
      dirX /= len
      dirZ /= len

      // Rotate movement direction by camera yaw so WASD is always camera-relative
      const yaw = cameraYawRef.current
      const cosYaw = Math.cos(yaw)
      const sinYaw = Math.sin(yaw)
      const worldX = dirX * cosYaw + dirZ * sinYaw
      const worldZ = -dirX * sinYaw + dirZ * cosYaw

      // Move position with collision detection
      const pos = groupRef.current.position
      const newX = pos.x + worldX * speed * delta
      const newZ = pos.z + worldZ * speed * delta

      // Try full movement first
      if (!collidesWithAny(newX, newZ, PLAYER_RADIUS)) {
        pos.x = newX
        pos.z = newZ
      } else {
        // Wall-slide: try each axis independently
        if (!collidesWithAny(newX, pos.z, PLAYER_RADIUS)) {
          pos.x = newX
        } else if (!collidesWithAny(pos.x, newZ, PLAYER_RADIUS)) {
          pos.z = newZ
        }
        // Both blocked = stop (player is stuck against a corner)
      }

      // Clamp to bounds
      pos.x = THREE.MathUtils.clamp(pos.x, BOUNDS.minX, BOUNDS.maxX)
      pos.z = THREE.MathUtils.clamp(pos.z, BOUNDS.minZ, BOUNDS.maxZ)

      // Face movement direction (world space)
      const angle = Math.atan2(worldX, worldZ)
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
    <group ref={groupRef} position={[0, 0, 5]}>
      <Character3D
        ref={characterRef}
        characterId="knight"
        animationPacks={['general', 'movement_basic']}
        currentAnimation="Idle_A"
      />
    </group>
  )
}
