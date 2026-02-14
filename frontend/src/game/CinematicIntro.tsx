/**
 * CinematicIntro — Epic sky-to-village camera flyover when the game starts.
 *
 * Path: south of village looking at player waving → sweep toward castle →
 *       launch up the castle into the clouds → slow at the peak →
 *       swoop back down clockwise past every zone → turn the corner
 *       down the street toward the player who is now dancing → settle.
 *
 * Click anywhere to skip.
 */
import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../stores/gameStore'

interface CinematicIntroProps {
  onComplete: () => void
}

// Camera waypoints: [position, lookAt]
// Zone positions: Castle(0,-70) SpaceStation(38,-38) MonsterRecess(48,5)
//   Pizza(38,38) ForestMystery(0,48) DungeonEscape(-38,38) CookingCatastrophe(-48,5)
// Player at (0, 0, 5)
const WAYPOINTS: [THREE.Vector3, THREE.Vector3][] = [
  // ── ACT 1: Start in front of the character, castle in background ──
  // 1. Start: close and low, facing the character with the castle behind them
  [new THREE.Vector3(0, 3, 12),       new THREE.Vector3(0, 1.5, -40)],
  // 2. Hold the shot — character waving, castle visible behind
  [new THREE.Vector3(1, 3.5, 11),     new THREE.Vector3(0, 1.5, -40)],
  // 3. Rise up and fly past the character toward the castle
  [new THREE.Vector3(2, 10, -5),      new THREE.Vector3(0, 5, -40)],

  // ── ACT 2: Rise up alongside the castle, smooth turn toward space ──
  // 4. Approaching the castle, looking ahead at the wall
  [new THREE.Vector3(5, 10, -50),     new THREE.Vector3(5, 25, -70)],
  // 5. Rising up alongside the castle — looking up along the wall
  [new THREE.Vector3(5, 25, -65),     new THREE.Vector3(5, 45, -75)],
  // 6. Cresting the castle top — looking out over the horizon
  [new THREE.Vector3(5, 42, -68),     new THREE.Vector3(20, 35, -50)],
  // 7. Smooth arc turning toward the Space Station
  [new THREE.Vector3(15, 38, -55),    new THREE.Vector3(30, 20, -38)],
  // 8. Continuing the turn — Space Station coming into view
  [new THREE.Vector3(22, 34, -42),    new THREE.Vector3(38, 5, -30)],

  // ── ACT 3: Fly high above the streets, seeing all zones below ──
  // 9. Above NE road — Space Station visible below
  [new THREE.Vector3(28, 30, -30),    new THREE.Vector3(0, 0, 0)],
  // 11. Between Space Station and Monster Recess
  [new THREE.Vector3(35, 30, -15),    new THREE.Vector3(0, 0, 0)],
  // 12. Above eastern road — Monster Recess below
  [new THREE.Vector3(38, 30, 0),      new THREE.Vector3(0, 0, 0)],
  // 13. Between Monster Recess and Pizza
  [new THREE.Vector3(35, 30, 15),     new THREE.Vector3(0, 0, 0)],
  // 14. Curving SE — Pizza Pandemonium below
  [new THREE.Vector3(28, 30, 28),     new THREE.Vector3(0, 0, 0)],
  // 15. Between Pizza and Forest Mystery
  [new THREE.Vector3(15, 30, 35),     new THREE.Vector3(0, 0, 0)],
  // 16. Above southern road — Forest Mystery / Adventurer's Picnic below
  [new THREE.Vector3(0, 30, 38),      new THREE.Vector3(0, 0, 0)],

  // ── ACT 4: Descend from the south toward the waving player ──
  // 17. Dropping down toward the player from the south
  [new THREE.Vector3(0, 15, 28),      new THREE.Vector3(0, 1.5, 5)],
  // 18. Coming in low — player waving ahead
  [new THREE.Vector3(0, 4, 14),       new THREE.Vector3(0, 1.5, 5)],
  // 19. Settle at VillageCamera start position
  [new THREE.Vector3(0, 6, 12),       new THREE.Vector3(0, 0, 0)],
]

const TOTAL_DURATION = 32.0 // seconds

// Animation triggers: [normalized time threshold, animation name, player yaw]
// Yaw: 0 = face +Z (south), Math.PI = face -Z (north), -Math.PI/2 = face -X (west)
const ANIM_TRIGGERS: [number, string, number][] = [
  [0.00, 'Waving',  0],               // Start: face south, wave at incoming camera
  [0.25, 'Idle_A',  0],              // Stop waving once camera reaches castle, stay facing south
  [0.80, 'Waving', 0],               // Face south, wave as camera descends from adventure zone
]

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

  // Build splines once
  const posSpline = useRef(createSpline(WAYPOINTS.map(w => w[0])))
  const lookSpline = useRef(createSpline(WAYPOINTS.map(w => w[1])))

  // Set initial animation and position on mount
  useEffect(() => {
    setIntroAnimation('Waving', 0)
    if (setIntroPlayerPosition) {
      setIntroPlayerPosition([0, 0, 5])
    }
    return () => {
      setIntroAnimation(null)
      if (setIntroPlayerPosition) {
        setIntroPlayerPosition(null)
      }
    }
  }, [setIntroAnimation, setIntroPlayerPosition])

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    // Clear intro animation override
    setIntroAnimation(null)
    if (setIntroPlayerPosition) {
      setIntroPlayerPosition([0, 0, 5])
    }
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

  useFrame((_, delta) => {
    if (done.current) return

    elapsed.current += delta
    const t = Math.min(elapsed.current / TOTAL_DURATION, 1)

    // Ease: smooth start and end
    const eased = t * t * (3 - 2 * t)

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

  return null
}
