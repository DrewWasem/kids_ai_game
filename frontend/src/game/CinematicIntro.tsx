/**
 * CinematicIntro — Title sequence when the game starts.
 *
 * Path: smooth fly-by past character at spawn (camera looks forward, no tracking)
 *       → curve up into the sky → through cloud layer → pan down →
 *       logo reveal above village.
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
const PAUSE_BETWEEN_ACTS = false

// Player starts at village spawn.
export const PLAYER_START: [number, number, number] = [0, 0, 5]
const PLAYER_SPAWN: [number, number, number] = [0, 0, 5]

// 13 waypoints (indices 0-12), divisor = 12
// ACT 1→2 after waypoint 4, ACT 2→3 after waypoint 9
const ACT_BREAK_POINTS = [5 / 12, 10 / 12]

// Per-act speed multiplier — <1 slows down, >1 speeds up
const ACT_SPEED = [1.0, 1.4, 1.2]
const ACT_BOUNDS = [0, 5 / 12, 10 / 12, 1.0]

// Camera waypoints: [position, lookAt]
// Act 1: camera looks forward (north) the entire time — no tracking.
// Character at spawn [0, 0, 5] passes through frame naturally.
const WAYPOINTS: [THREE.Vector3, THREE.Vector3][] = [
  // ── ACT 1: Smooth fly-by from picnic, curve into sky ──
  // 0. Start at Adventurers' Picnic area, looking forward
  [new THREE.Vector3(3, 4, 48),        new THREE.Vector3(0, 4, 20)],
  // 1. Gliding north through village
  [new THREE.Vector3(2, 3.5, 28),      new THREE.Vector3(0, 4, 5)],
  // 2. Past the character (they're at z=5, camera at z=10)
  [new THREE.Vector3(1, 3, 10),        new THREE.Vector3(0, 4, -10)],
  // 3. Past character, beginning to curve upward
  [new THREE.Vector3(0, 8, -2),        new THREE.Vector3(0, 12, -10)],
  // 4. Ascending — smooth curve into the sky
  [new THREE.Vector3(0, 30, -2),       new THREE.Vector3(0, 40, -5)],

  // ── ACT 2: Through the clouds, then smooth pan down ──
  // Even vertical spacing (~30u per waypoint) for consistent speed.
  // Castle at Z=-70 (north). LookAt Z stays negative so castle is always in front.
  // 5. Into the cloud layer — looking north and up
  [new THREE.Vector3(0, 60, 2),        new THREE.Vector3(0, 70, -15)],
  // 6. Through the clouds
  [new THREE.Vector3(0, 100, 3),       new THREE.Vector3(0, 110, -10)],
  // 7. Above clouds — beginning to arc over
  [new THREE.Vector3(0, 135, 4),       new THREE.Vector3(0, 100, -8)],
  // 8. High up — panning down smoothly
  [new THREE.Vector3(0, 155, 6),       new THREE.Vector3(0, 50, -6)],
  // 9. Pan down complete — looking at village
  [new THREE.Vector3(0, 160, 8),       new THREE.Vector3(0, 0, -5)],

  // ── ACT 3: Logo reveal above village ──
  // 10. Settling high, logo in view — still facing north
  [new THREE.Vector3(0, 158, 8),       new THREE.Vector3(0, 60, -3)],
  // 11. Looking down at logo / village
  [new THREE.Vector3(0, 150, 8),       new THREE.Vector3(0, 0, -2)],
  // 12. Final frame — logo centered
  [new THREE.Vector3(0, 145, 10),      new THREE.Vector3(0, 0, -2)],
]

const TOTAL_DURATION = 22.0 // seconds

// Animation triggers: [normalized time, animation name, player yaw]
const ANIM_TRIGGERS: [number, string, number][] = [
  [0.00, 'Waving',  0],               // At spawn: wave as camera flies past
]

// No teleport needed — player stays at spawn
const TELEPORT_TIME = 2.0 // > 1.0 = never triggers

// Normalized time at which the logo fades in (Act 3 start)
const LOGO_FADE_TIME = 10 / 12

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
  const [showLogo, setShowLogo] = useState(false)
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
    setShowLogo(false)
    setIntroPlayerPosition(PLAYER_SPAWN)
    setIntroAnimation(null)
    // Snap camera to gameplay position
    camera.position.set(0, 6, 12)
    camera.lookAt(0, 0, 0)
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
        const pos = posSpline.current.getPoint(eased)
        const look = lookSpline.current.getPoint(eased)
        camera.position.copy(pos)
        camera.lookAt(look)
        return
      }
    }

    // Teleport player (no-op in this version)
    if (!teleported.current && eased >= TELEPORT_TIME) {
      teleported.current = true
      setIntroPlayerPosition(PLAYER_SPAWN)
    }

    // Show logo when entering Act 3
    if (!showLogo && eased >= LOGO_FADE_TIME) {
      setShowLogo(true)
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

  return (
    <>
      {/* Logo floating above town center — matches TitleScreen design */}
      {showLogo && (
        <Html
          position={[0, 60, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <style>{`
            @keyframes intro-sparkle {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.1); }
            }
            @keyframes intro-fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'intro-fade-in 1.5s ease-out',
            filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 60px rgba(255, 140, 66, 0.3))',
          }}>
            <div style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: 80,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                fontSize: 68,
                animation: 'intro-sparkle 1.5s ease-in-out infinite',
              }}>{'\u2728'}</span>
              <span style={{
                background: 'linear-gradient(to right, #7C3AED, #FF8C42, #FBBF24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Quest AI
              </span>
            </div>
            <div style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: 22,
              color: 'rgba(255, 255, 255, 0.85)',
              marginTop: 4,
              letterSpacing: 1,
            }}>
              Learn to talk to AI through play
            </div>
          </div>
        </Html>
      )}

      {/* Act-break prompt */}
      {showPrompt && (
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
      )}
    </>
  )
}
