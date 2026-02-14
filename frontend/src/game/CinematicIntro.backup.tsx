/**
 * CinematicIntro — Camera flyover when the game starts.
 *
 * Path: fly past character on hill → along the main street looking at
 *       center → teleport player to village → descend to character waving.
 *
 * Spacebar pauses between acts (toggle PAUSE_BETWEEN_ACTS).
 * Click anywhere to skip entirely.
 */
import { useRef, useEffect, useCallback, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../stores/gameStore'

interface CinematicIntroProps {
  onComplete: () => void
}

// ── Set to false for production / demo (skips all act pauses) ──
const PAUSE_BETWEEN_ACTS = true

// Player starts on the cliff near mountain_B [-20, 0, 64] — moved 0.5 down from original.
// After Act 1 fly-by, teleports to village spawn during Act 2 ring road tour.
export const PLAYER_START: [number, number, number] = [-16.5, 17.0, 63]
const PLAYER_SPAWN: [number, number, number] = [0, 0, 5]

// 15 waypoints (indices 0-14), divisor = 14
// ACT 1→2 after waypoint 2, ACT 2→4 after waypoint 10
const ACT_BREAK_POINTS = [3 / 14, 11 / 14]

// Per-act speed multiplier — <1 slows down, >1 speeds up
const ACT_SPEED = [1.0, 0.6, 1.0]
const ACT_BOUNDS = [0, 3 / 14, 11 / 14, 1.0]

// Camera waypoints: [position, lookAt]
// ACT 1: Player on cliff at (-16.5, 17, 63). ACT 4: Player at spawn (0, 0, 5).
// Ring road radius ≈ 42; camera orbits at r≈46 for clearance.
const WAYPOINTS: [THREE.Vector3, THREE.Vector3][] = [
  // ── ACT 1: Fly past character on the cliff, stop at ring road ──
  // 0. Start: further away, in front of character
  [new THREE.Vector3(-16.5, 24, 80),   new THREE.Vector3(-16.5, 17.0, 63)],
  // 1. Sweeping past, lookAt transitions toward village
  [new THREE.Vector3(-14, 20, 64),     new THREE.Vector3(-10, 15, 45)],
  // 2. Arrive at ring road, now looking toward village center
  [new THREE.Vector3(-10, 15, 46),     new THREE.Vector3(0, 2, 0)],

  // ── ACT 2: Clockwise along ring road, passing all zones, looking inward (high + slow) ──
  // 3. South — pass Adventurers' Picnic
  [new THREE.Vector3(0, 24, 46),       new THREE.Vector3(0, 2, 0)],
  // 4. Southeast — pass Pizza Pandemonium
  [new THREE.Vector3(32, 24, 32),      new THREE.Vector3(0, 2, 0)],
  // 5. East — pass Monster Recess
  [new THREE.Vector3(46, 24, 4),       new THREE.Vector3(0, 2, 0)],
  // 6. Northeast — pass Space Station
  [new THREE.Vector3(32, 24, -32),     new THREE.Vector3(0, 2, 0)],
  // 7. North edge of ring
  [new THREE.Vector3(0, 24, -42),      new THREE.Vector3(0, 2, 0)],
  // 8. West — pass Cooking Catastrophe
  [new THREE.Vector3(-46, 24, 4),      new THREE.Vector3(0, 2, 0)],
  // 9. Southwest — pass Dungeon Escape
  [new THREE.Vector3(-30, 24, 30),     new THREE.Vector3(0, 2, 0)],
  // 10. Back to south — where spoke road meets Act 4
  [new THREE.Vector3(0, 24, 44),       new THREE.Vector3(0, 2, 0)],

  // ── ACT 4: Down the street to see character waving at spawn ──
  // 11. Rise above south end
  [new THREE.Vector3(0, 20, 35),       new THREE.Vector3(0, 1.5, 5)],
  // 12. Descending toward street
  [new THREE.Vector3(0, 12, 22),       new THREE.Vector3(0, 1.5, 5)],
  // 13. Street level approach — player waving ahead
  [new THREE.Vector3(0, 5, 16),        new THREE.Vector3(0, 1.5, 5)],
  // 14. Settle at VillageCamera start position
  [new THREE.Vector3(0, 6, 12),        new THREE.Vector3(0, 0, 0)],
]

const TOTAL_DURATION = 28.0 // seconds

// Animation triggers: [normalized time, animation name, player yaw]
const ANIM_TRIGGERS: [number, string, number][] = [
  [0.00, 'Waving',  0],               // On cliff: wave at fly-by camera
  [0.15, 'Idle_A',  0],               // Camera past, stop waving
  [0.78, 'Waving',  0],               // At spawn: wave as camera descends
]

// Normalized time at which we teleport the player from the hill to the spawn point
// Fires as Act 2 begins (camera is on ring road, player no longer visible)
const TELEPORT_TIME = 3 / 14 + 0.01

function createSpline(points: THREE.Vector3[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5)
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const { camera, gl } = useThree()
  const elapsed = useRef(0)
  const done = useRef(false)
  const lastTriggerIdx = useRef(-1)
  const setIntroAnimation = useGameStore((s) => s.setIntroAnimation)
  const setIntroPlayerPosition = useGameStore((s) => s.setIntroPlayerPosition)

  // Act-break pause state
  const paused = useRef(false)
  const nextBreakIdx = useRef(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const lastEased = useRef(0)
  const teleported = useRef(false)

  // Build splines once
  const posSpline = useRef(createSpline(WAYPOINTS.map(w => w[0])))
  const lookSpline = useRef(createSpline(WAYPOINTS.map(w => w[1])))

  // Set initial animation and position on mount
  useEffect(() => {
    setIntroAnimation('Waving', 0)
    setIntroPlayerPosition(PLAYER_START)
    return () => {
      setIntroAnimation(null)
      setIntroPlayerPosition(null)
    }
  }, [setIntroAnimation, setIntroPlayerPosition])

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    paused.current = false
    setShowPrompt(false)
    // Always teleport player to spawn (handles click-skip during ACT 1)
    setIntroPlayerPosition(PLAYER_SPAWN)
    // Clear intro animation (position cleared by unmount cleanup)
    setIntroAnimation(null)
    // Snap camera to exact final position
    const last = WAYPOINTS[WAYPOINTS.length - 1]
    camera.position.copy(last[0])
    camera.lookAt(last[1])
    onComplete()
  }, [camera, onComplete, setIntroAnimation, setIntroPlayerPosition])

  // Click/tap to skip — delay listener so the Play button click doesn't immediately skip
  useEffect(() => {
    const canvas = gl.domElement
    const skip = () => finish()
    const timer = setTimeout(() => {
      canvas.addEventListener('pointerdown', skip, { once: true })
    }, 500)
    return () => {
      clearTimeout(timer)
      canvas.removeEventListener('pointerdown', skip)
    }
  }, [gl, finish])

  // Spacebar to resume from act break
  useEffect(() => {
    if (!PAUSE_BETWEEN_ACTS) return
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && paused.current) {
        e.preventDefault()
        paused.current = false
        nextBreakIdx.current++
        setShowPrompt(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useFrame((_, delta) => {
    if (done.current || paused.current) return

    // Per-act speed: use last frame's position to determine this frame's speed
    let speedMult = ACT_SPEED[0]
    for (let i = ACT_BOUNDS.length - 2; i >= 0; i--) {
      if (lastEased.current >= ACT_BOUNDS[i]) { speedMult = ACT_SPEED[i]; break }
    }

    elapsed.current += delta * speedMult
    const t = Math.min(elapsed.current / TOTAL_DURATION, 1)

    // Ease: smooth start and end
    const eased = t * t * (3 - 2 * t)
    lastEased.current = eased

    // Check for act break pause
    if (PAUSE_BETWEEN_ACTS && nextBreakIdx.current < ACT_BREAK_POINTS.length) {
      if (eased >= ACT_BREAK_POINTS[nextBreakIdx.current]) {
        paused.current = true
        setShowPrompt(true)
        // Still update camera to exact break position before freezing
        const pos = posSpline.current.getPoint(eased)
        const look = lookSpline.current.getPoint(eased)
        camera.position.copy(pos)
        camera.lookAt(look)
        return
      }
    }

    // Teleport player from hill to spawn point once camera is high enough
    if (!teleported.current && eased >= TELEPORT_TIME) {
      teleported.current = true
      setIntroPlayerPosition(PLAYER_SPAWN)
    }

    // Check animation triggers
    for (let i = ANIM_TRIGGERS.length - 1; i >= 0; i--) {
      if (t >= ANIM_TRIGGERS[i][0] && lastTriggerIdx.current < i) {
        lastTriggerIdx.current = i
        setIntroAnimation(ANIM_TRIGGERS[i][1], ANIM_TRIGGERS[i][2])
        break
      }
    }

    // Sample position and look-at from splines
    const pos = posSpline.current.getPoint(eased)
    const look = lookSpline.current.getPoint(eased)

    camera.position.copy(pos)
    camera.lookAt(look)

    if (t >= 1) {
      finish()
    }
  })

  return showPrompt ? (
    <Html center style={{ pointerEvents: 'none' }}>
      <style>{`@keyframes cinematic-pulse { 0%,100% { opacity:.6 } 50% { opacity:1 } }`}</style>
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '10px 24px',
        borderRadius: 12,
        fontFamily: 'Fredoka, sans-serif',
        fontSize: 18,
        whiteSpace: 'nowrap',
        animation: 'cinematic-pulse 2s ease-in-out infinite',
      }}>
        Press Space to continue
      </div>
    </Html>
  ) : null
}
