/**
 * VillageWorld — Persistent medieval village with quest zones.
 *
 * Renders a hex-tile village connecting quest zones. The village is always
 * visible. Zones are areas within it hosting different quests.
 *
 * Layout (top-down, ring at R≈48-53, dungeon at Z=-70):
 *   North (Z=-70):     Dungeon Zone (skeleton-birthday) — via grand boulevard
 *   Northeast:         Space Zone (knight-space) [38, -38]
 *   East (X=+48):      School Zone (barbarian-school) [48, 5]
 *   Southeast:         Pizza Zone (skeleton-pizza) [38, 38]
 *   South (Z=+48):     Park Zone (adventurers-picnic) [0, 48]
 *   Southwest:         Concert Zone (dungeon-concert) [-38, 38]
 *   West (X=-48):      Kitchen Zone (mage-kitchen) [-48, 5]
 *   Center (Z=0):      Village Center (tavern, market, well, etc.)
 *
 * Uses KayKit Medieval Hexagon Pack for terrain + buildings,
 * plus existing task environment pieces offset to zone positions.
 */

import { memo, useMemo, useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'
import { ASSET_BASE } from '../data/asset-manifest'
import { ZONE_CENTERS, ZONE_META } from '../stores/gameStore'
import { registerCollision, unregisterCollision, getCollisionBoxes, getGeneration, type CollisionBox } from './collision-registry'
import { QuestZoneCircle } from './QuestZoneCircle'
import { StageFloor } from './ScenePlayer3D'

// ============================================================================
// HEX GRID HELPERS
// ============================================================================

const HEX_SIZE = 2 // KayKit hex tiles are ~2 units wide (flat-top)
const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3) / 2

/** Convert hex grid coords (col, row) to world position (flat-top hex layout) */
function hexToWorld(col: number, row: number): [number, number, number] {
  const x = col * HEX_SIZE * 0.75
  const z = row * HEX_HEIGHT + (col % 2 !== 0 ? HEX_HEIGHT / 2 : 0)
  return [x, 0, z]
}

// ============================================================================
// MEDIEVAL HEX ASSET PATHS
// ============================================================================

const HEX = 'kaykit/packs/medieval_hex/'

const TILES = {
  grass: HEX + 'tiles/base/hex_grass_bottom.gltf',
  road_A: 'tiny-treats/pretty-park/cobble_stones.gltf',
  road_B: 'tiny-treats/pretty-park/cobble_stones.gltf',
  road_C: 'tiny-treats/pretty-park/cobble_stones.gltf',
  road_D: 'tiny-treats/pretty-park/cobble_stones.gltf',
  water: HEX + 'tiles/base/hex_water.gltf',
  coast_A: HEX + 'tiles/coast/hex_coast_A.gltf',
  coast_B: HEX + 'tiles/coast/hex_coast_B.gltf',
  coast_C: HEX + 'tiles/coast/hex_coast_C.gltf',
  coast_D: HEX + 'tiles/coast/hex_coast_D.gltf',
  coast_E: HEX + 'tiles/coast/hex_coast_E.gltf',
  transition: HEX + 'tiles/base/hex_transition.gltf',
}

const BUILDINGS = {
  tavern: HEX + 'buildings/blue/building_tavern_blue.gltf',
  market: HEX + 'buildings/blue/building_market_blue.gltf',
  townhall: HEX + 'buildings/blue/building_townhall_blue.gltf',
  well: HEX + 'buildings/blue/building_well_blue.gltf',
  blacksmith: HEX + 'buildings/blue/building_blacksmith_blue.gltf',
  home_A: HEX + 'buildings/blue/building_home_A_blue.gltf',
  home_B: HEX + 'buildings/blue/building_home_B_blue.gltf',
  church: HEX + 'buildings/blue/building_church_blue.gltf',
  windmill: HEX + 'buildings/blue/building_windmill_blue.gltf',
  watchtower: HEX + 'buildings/blue/building_watchtower_blue.gltf',
  stables: HEX + 'buildings/blue/building_stables_blue.gltf',
  // Colored building variants (landmarks)
  castle_red: HEX + 'buildings/red/building_castle_red.gltf',
  tower_A_blue: HEX + 'buildings/blue/building_tower_A_blue.gltf',
  tower_B_red: HEX + 'buildings/red/building_tower_B_red.gltf',
  shrine_yellow: HEX + 'buildings/yellow/building_shrine_yellow.gltf',
  watchtower_green: HEX + 'buildings/green/building_watchtower_green.gltf',
  tower_A_yellow: HEX + 'buildings/yellow/building_tower_A_yellow.gltf',
  tower_B_green: HEX + 'buildings/green/building_tower_B_green.gltf',
  // Neutral
  bridge_A: HEX + 'buildings/neutral/building_bridge_A.gltf',
  stage_A: HEX + 'buildings/neutral/building_stage_A.gltf',
  fence_stone: HEX + 'buildings/neutral/fence_stone_straight.gltf',
  fence_stone_gate: HEX + 'buildings/neutral/fence_stone_straight_gate.gltf',
  wall_straight: HEX + 'buildings/neutral/wall_straight.gltf',
  wall_corner_outside: HEX + 'buildings/neutral/wall_corner_A_outside.gltf',
  wall_gate: HEX + 'buildings/neutral/wall_straight_gate.gltf',
}

const DECORATION = {
  // Nature
  tree_A: HEX + 'decoration/nature/tree_single_A.gltf',
  tree_B: HEX + 'decoration/nature/tree_single_B.gltf',
  trees_large: HEX + 'decoration/nature/trees_A_large.gltf',
  trees_medium: HEX + 'decoration/nature/trees_A_medium.gltf',
  trees_small: HEX + 'decoration/nature/trees_A_small.gltf',
  trees_B_large: HEX + 'decoration/nature/trees_B_large.gltf',
  trees_B_medium: HEX + 'decoration/nature/trees_B_medium.gltf',
  trees_B_small: HEX + 'decoration/nature/trees_B_small.gltf',
  mountain_A: HEX + 'decoration/nature/mountain_A_grass_trees.gltf',
  mountain_B: HEX + 'decoration/nature/mountain_B_grass.gltf',
  mountain_C: HEX + 'decoration/nature/mountain_C_grass_trees.gltf',
  hill_A: HEX + 'decoration/nature/hill_single_A.gltf',
  hill_B: HEX + 'decoration/nature/hill_single_B.gltf',
  hill_C: HEX + 'decoration/nature/hill_single_C.gltf',
  hills_trees: HEX + 'decoration/nature/hills_A_trees.gltf',
  hills_B_trees: HEX + 'decoration/nature/hills_B_trees.gltf',
  hills_C_trees: HEX + 'decoration/nature/hills_C_trees.gltf',
  rock_A: HEX + 'decoration/nature/rock_single_A.gltf',
  rock_B: HEX + 'decoration/nature/rock_single_B.gltf',
  rock_C: HEX + 'decoration/nature/rock_single_C.gltf',
  rock_D: HEX + 'decoration/nature/rock_single_D.gltf',
  rock_E: HEX + 'decoration/nature/rock_single_E.gltf',
  // Props
  barrel: HEX + 'decoration/props/barrel.gltf',
  crate_A: HEX + 'decoration/props/crate_A_big.gltf',
  crate_B: HEX + 'decoration/props/crate_B_small.gltf',
  haybale: HEX + 'decoration/props/haybale.gltf',
  weaponrack: HEX + 'decoration/props/weaponrack.gltf',
  wheelbarrow: HEX + 'decoration/props/wheelbarrow.gltf',
  sack: HEX + 'decoration/props/sack.gltf',
  bucket_water: HEX + 'decoration/props/bucket_water.gltf',
  trough: HEX + 'decoration/props/trough.gltf',
  target: HEX + 'decoration/props/target.gltf',
  tent: HEX + 'decoration/props/tent.gltf',
  bucket_arrows: HEX + 'decoration/props/bucket_arrows.gltf',
  // Water decoration
  waterlily_A: HEX + 'decoration/nature/waterlily_A.gltf',
  waterlily_B: HEX + 'decoration/nature/waterlily_B.gltf',
  waterplant_A: HEX + 'decoration/nature/waterplant_A.gltf',
  waterplant_B: HEX + 'decoration/nature/waterplant_B.gltf',
  // Lantern (tiny-treats)
  street_lantern: 'tiny-treats/pretty-park/street_lantern.gltf',
  // Park flowers (for approach decor)
  flower_A: 'tiny-treats/pretty-park/flower_A.gltf',
  flower_B: 'tiny-treats/pretty-park/flower_B.gltf',
}

// ============================================================================
// SPAWN AVOIDANCE — approximate building positions for scatter/forest placement
// Runtime player collision uses auto-measured GLTF bounding boxes (collision-registry.ts)
// ============================================================================

const SPAWN_EXCLUSIONS: [number, number, number][] = [
  // Village center buildings (approx center x, z, radius)
  [12, -5, 6],    // Town Hall
  [-16, -7, 5],   // Tavern
  [16, 5, 4],     // Market
  [0, 0, 3],      // Well
  [-9.3, 25.2, 5],  // Blacksmith
  [20, -12, 4],   // Home A
  [-10, -12, 4],  // Home B
  [-22, 10, 4],   // Home A (small)
  [22, 10, 4],    // Home B (small)
  [24, 5, 5],     // Church
  [-24, 5, 5],    // Windmill
  [8, -12, 5],    // Stables
  [26, -3, 3],    // Watchtower
  [-8, -10, 4],   // Stage
  // Pond
  [8, 18, 4],
  // Zone landmarks (new positions)
  [-12, -75, 5],  [44, -42, 3],  [54, 1, 3],  [44, 42, 3],
  [6, 53, 3],     [-44, 42, 3],  [-54, 1, 3],
]

/** Check if position is too close to a known structure (scatter/forest avoidance only) */
function isNearObject(x: number, z: number, padding: number = 0): boolean {
  for (const [ox, oz, r] of SPAWN_EXCLUSIONS) {
    const dx = x - ox
    const dz = z - oz
    if (dx * dx + dz * dz < (r + padding) * (r + padding)) return true
  }
  return false
}

// ============================================================================
// REUSABLE PIECE COMPONENT
// ============================================================================

interface PieceProps {
  model: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  noCollision?: boolean
}

const Piece = memo(({ model, position, rotation, scale = 1, noCollision }: PieceProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(ASSET_BASE + model)
  const boxesRef = useRef<CollisionBox[]>([])

  const cloned = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  const scaleArr: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale]

  // Auto-register ground-level footprint for player collision.
  // Per-mesh boxes, with grid subdivision for large single-mesh models
  // (e.g. stables where building+horses+fences are baked into one mesh).
  useEffect(() => {
    if (noCollision || !groupRef.current) return

    groupRef.current.updateWorldMatrix(true, true)

    // Full bounding box to find ground level and total height
    const fullBox = new THREE.Box3().setFromObject(groupRef.current)
    const fullSize = fullBox.getSize(new THREE.Vector3())

    // Skip nearly flat objects (floor tiles, ground decals)
    if (fullSize.y < 0.2) return

    // Ground slice: bottom 20% of height, clamped to [0.5, 2.0] world units
    const sliceHeight = Math.max(0.5, Math.min(fullSize.y * 0.2, 2.0))
    const groundThreshold = fullBox.min.y + sliceHeight

    const registered: CollisionBox[] = []
    const vtx = new THREE.Vector3()
    const GRID_CELL = 2.0 // grid cell size for subdividing large meshes

    const registerBox = (minX: number, maxX: number, minZ: number, maxZ: number) => {
      const w = maxX - minX
      const d = maxZ - minZ
      if (w < 0.2 && d < 0.2) return
      const cb: CollisionBox = {
        cx: (minX + maxX) / 2,
        cz: (minZ + maxZ) / 2,
        halfW: w / 2 * 0.7,
        halfD: d / 2 * 0.7,
        minY: fullBox.min.y,
        maxY: fullBox.max.y,
      }
      registerCollision(cb)
      registered.push(cb)
    }

    // Per-mesh collision
    groupRef.current.traverse((child: any) => {
      if (!child.isMesh || !child.geometry) return
      const posAttr = child.geometry.attributes.position
      if (!posAttr) return

      // Collect ground-level vertices
      const groundVerts: { x: number; z: number }[] = []
      const matrix = child.matrixWorld
      for (let i = 0; i < posAttr.count; i++) {
        vtx.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
        vtx.applyMatrix4(matrix)
        if (vtx.y <= groundThreshold) {
          groundVerts.push({ x: vtx.x, z: vtx.z })
        }
      }

      if (groundVerts.length === 0) return

      // Compute overall extent
      let minX = Infinity, maxX = -Infinity
      let minZ = Infinity, maxZ = -Infinity
      for (const v of groundVerts) {
        if (v.x < minX) minX = v.x
        if (v.x > maxX) maxX = v.x
        if (v.z < minZ) minZ = v.z
        if (v.z > maxZ) maxZ = v.z
      }

      const w = maxX - minX
      const d = maxZ - minZ
      if (w < 0.3 && d < 0.3) return

      // Small footprint → one box
      if (w <= 4 && d <= 4) {
        registerBox(minX, maxX, minZ, maxZ)
        return
      }

      // Large footprint → subdivide into grid cells so gaps between
      // sub-objects (horses vs building vs fences) become walkable
      const cells = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>()
      for (const v of groundVerts) {
        const gx = Math.floor(v.x / GRID_CELL)
        const gz = Math.floor(v.z / GRID_CELL)
        const key = `${gx},${gz}`
        const cell = cells.get(key)
        if (cell) {
          if (v.x < cell.minX) cell.minX = v.x
          if (v.x > cell.maxX) cell.maxX = v.x
          if (v.z < cell.minZ) cell.minZ = v.z
          if (v.z > cell.maxZ) cell.maxZ = v.z
        } else {
          cells.set(key, { minX: v.x, maxX: v.x, minZ: v.z, maxZ: v.z })
        }
      }

      for (const cell of cells.values()) {
        registerBox(cell.minX, cell.maxX, cell.minZ, cell.maxZ)
      }
    })

    boxesRef.current = registered

    return () => {
      for (const cb of boxesRef.current) {
        unregisterCollision(cb)
      }
      boxesRef.current = []
    }
  }, [noCollision])

  return (
    <group ref={groupRef} position={position} rotation={rotation || [0, 0, 0]} scale={scaleArr}>
      <primitive object={cloned} />
    </group>
  )
})
Piece.displayName = 'Piece'

// ============================================================================
// HEX TERRAIN — Grass tiles covering the village area
// ============================================================================

// Spoke road targets (from origin to each zone center, excluding N/S which are on main road)
const SPOKE_TARGETS: [number, number][] = [
  [38, -38],   // NE → knight-space
  [48, 5],     // E  → barbarian-school
  [38, 38],    // SE → skeleton-pizza
  [-38, 38],   // SW → dungeon-concert
  [-48, 5],    // W  → mage-kitchen
]

/** Check if world position (x,z) is within `halfWidth` of a line from origin to (tx,tz) */
function isOnSpoke(x: number, z: number, halfWidth: number): boolean {
  for (const [tx, tz] of SPOKE_TARGETS) {
    const len = Math.sqrt(tx * tx + tz * tz)
    // Project point onto spoke line — t=0 at origin, t=1 at target
    const t = (x * tx + z * tz) / (len * len)
    if (t < -0.05 || t > 1.05) continue // Not along this spoke
    // Perpendicular distance from point to line
    const dist = Math.abs(x * tz - z * tx) / len
    if (dist < halfWidth) return true
  }
  return false
}

/** Check if world position is inside the kitchen zone (used to filter out lanterns) */
function isInKitchenZone(wx: number, wz: number): boolean {
  // Kitchen center [-48, 5], structure spans X:-6..+4, Z:-5..+5 relative
  return wx >= -55 && wx <= -43 && wz >= -1 && wz <= 11
}

/** Check if world position is on the ring road (circle at radius ~42) */
function isOnRingRoad(x: number, z: number, halfWidth: number): boolean {
  if (z < -45) return false // Skip ring in dungeon approach area
  const dist = Math.sqrt(x * x + z * z)
  return Math.abs(dist - 42) < halfWidth
}

function HexTerrain() {
  // Generate a grid of hex tiles covering the larger world
  const tiles = useMemo(() => {
    const result: { model: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number }[] = []
    const roadPositions = new Set<string>()

    // 1. Grass tiles everywhere — DO NOT add zone-based transition tiles here.
    //    Grass must remain uniform across the entire map. (Locked by design.)
    for (let col = -55; col <= 55; col++) {
      for (let row = -60; row <= 50; row++) {
        const [wx, , wz] = hexToWorld(col, row)
        result.push({ model: TILES.grass, position: [wx, 0, wz] })
      }
    }

    // 2. Road tiles layered on top
    const ROAD_SCALE = 1.8
    const addRoad = (col: number, row: number, model: string) => {
      const key = `${col},${row}`
      if (roadPositions.has(key)) return
      roadPositions.add(key)
      const [wx, , wz] = hexToWorld(col, row)
      result.push({ model, position: [wx, 0.05, wz], scale: ROAD_SCALE })
    }

    // Grand Boulevard — 5 columns wide (col -2 to +2), Z ≈ -52 to +52
    const boulevardCols = [-2, -1, 0, 1, 2]
    for (let row = -30; row <= 30; row++) {
      for (const col of boulevardCols) {
        addRoad(col, row, TILES.road_A)
      }
    }

    // Spoke roads + ring road (halfWidth 3.5)
    for (let col = -55; col <= 55; col++) {
      for (let row = -60; row <= 50; row++) {
        const [wx, , wz] = hexToWorld(col, row)
        const onSpoke = isOnSpoke(wx, wz, 3.5)
        const onRing = isOnRingRoad(wx, wz, 3.5)
        if (onSpoke || onRing) {
          addRoad(col, row, TILES.road_A)
        }
      }
    }

    return result
  }, [])

  return (
    <group name="hex-terrain">
      {tiles.map((tile, i) => (
        <Piece key={`tile-${i}`} model={tile.model} position={tile.position} rotation={tile.rotation} scale={tile.scale} noCollision />
      ))}
    </group>
  )
}

// ============================================================================
// VILLAGE CENTER — Buildings, decoration, atmosphere
// ============================================================================

function VillageCenter() {
  // Village center: compact town square X[-25,25] × Z[-12,12]
  const s = 7.0  // Standard building scale
  const d = 7.0  // Decoration prop scale
  return (
    <group name="village-center" position={[0, 0, 0]}>
      {/* Well — village center landmark */}
      <Piece model={BUILDINGS.well} position={[0, 0, 0]} scale={2.5} />

      {/* Town hall — focal point near center */}
      <Piece model={BUILDINGS.townhall} position={[8.9, 0, -27.6]} rotation={[0, -Math.PI / 2, 0]} scale={7.7} />

      {/* === NW sector (between W spoke and N boulevard) === */}
      <Piece model={BUILDINGS.tavern} position={[-14, 0, -14]} rotation={[0, Math.PI / 4, 0]} scale={s} />
      <Piece model={BUILDINGS.home_B} position={[-12, 0, -20]} rotation={[0, Math.PI / 3, 0]} scale={s} />
      <Piece model={BUILDINGS.stage_A} position={[-18, 0, -18]} scale={5.6} />

      {/* === NE sector (between N boulevard and NE spoke) === */}
      <Piece model={BUILDINGS.stables} position={[-22.7, 0, -8.3]} rotation={[0, Math.PI / 2, 0]} scale={s} />

      {/* === E sector (between NE and E spokes) === */}
      <Piece model={BUILDINGS.home_A} position={[28, 0, -8]} rotation={[0, -Math.PI / 2, 0]} scale={s} />
      <Piece model={BUILDINGS.watchtower} position={[26, 0, -3]} rotation={[0, -Math.PI / 4, 0]} scale={s} />

      {/* === SE sector (between E and SE spokes) === */}
      <Piece model={BUILDINGS.market} position={[22, 0, 14]} rotation={[0, -Math.PI / 3, 0]} scale={s} />
      <Piece model={BUILDINGS.home_B} position={[22, 0, 10]} rotation={[0, -Math.PI / 6, 0]} scale={6.3} />

      {/* === S sector (between SE spoke and S boulevard) === */}
      <Piece model={BUILDINGS.church} position={[14, 0, 24]} rotation={[0, -Math.PI / 2, 0]} scale={7.7} />

      {/* === SW sector (between S boulevard and SW spoke) === */}
      <Piece model={BUILDINGS.blacksmith} position={[-9.3, 0, 25.2]} rotation={[0, Math.PI / 2, 0]} scale={s} />

      {/* === W sector (between SW and W spokes) === */}
      <Piece model={BUILDINGS.home_A} position={[-22, 0, 10]} rotation={[0, Math.PI / 6, 0]} scale={6.3} />
      <Piece model={BUILDINGS.windmill} position={[-24, 0, 16]} rotation={[0, Math.PI / 6, 0]} scale={7.7} />

      {/* Decoration props — positioned between spoke roads */}
      <Piece model={DECORATION.barrel} position={[-8, 0, -5]} scale={d} />
      <Piece model={DECORATION.crate_A} position={[9, 0, -4]} scale={d} />
      <Piece model={DECORATION.haybale} position={[-14, 0, 7]} scale={d} />
      <Piece model={DECORATION.wheelbarrow} position={[10, 0, -4]} scale={d} />
      <Piece model={DECORATION.sack} position={[-8, 0, 14]} scale={d} />
      <Piece model={DECORATION.bucket_water} position={[-11, 0, -3]} scale={d} />
      <Piece model={DECORATION.trough} position={[13, 0, 5]} scale={d} />
      {/* Trees around the village edges */}
      <Piece model={DECORATION.tree_A} position={[-26, 0, -2]} scale={d} />
      <Piece model={DECORATION.tree_B} position={[28, 0, -2]} scale={d} />
      <Piece model={DECORATION.trees_small} position={[-26, 0, 10]} scale={d * 0.8} />
      <Piece model={DECORATION.trees_small} position={[26, 0, -10]} scale={d * 0.8} />
    </group>
  )
}

// ============================================================================
// PERIMETER — Mountains, trees, hills around the village edges
// ============================================================================

function VillagePerimeter() {
  // Dense cliff/hill wall around the world edge.
  // Player bounds: X [-55,55], Z [-80,55]. Place cliffs just outside.
  return (
    <group name="village-perimeter">
      {/* ══════════ EAST WALL (X ≈ 58-68, Z from -75 to 55) ══════════ */}
      <Piece model={DECORATION.mountain_C} position={[62, 0, -70]} rotation={[0, Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.hill_A} position={[58, 0, -62]} scale={6.5} />
      <Piece model={DECORATION.rock_A} position={[60, 0, -55]} scale={7.0} />
      <Piece model={DECORATION.mountain_A} position={[64, 0, -48]} rotation={[0, Math.PI / 6, 0]} scale={8.0} />
      <Piece model={DECORATION.hills_trees} position={[60, 0, -40]} scale={6.0} />
      <Piece model={DECORATION.hill_C} position={[62, 0, -32]} scale={6.5} />
      <Piece model={DECORATION.mountain_B} position={[66, 0, -24]} rotation={[0, Math.PI / 3, 0]} scale={7.5} />
      <Piece model={DECORATION.rock_D} position={[68, 0, -16]} scale={6.0} />
      <Piece model={DECORATION.hill_A} position={[72, 0, -8]} scale={6.5} />
      <Piece model={DECORATION.mountain_C} position={[70, 0, 0]} rotation={[0, -Math.PI / 5, 0]} scale={8.0} />
      <Piece model={DECORATION.hills_B_trees} position={[68, 0, 8]} scale={6.0} />
      <Piece model={DECORATION.rock_B} position={[70, 0, 16]} scale={7.0} />
      <Piece model={DECORATION.mountain_A} position={[64, 0, 24]} rotation={[0, Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.hill_B} position={[60, 0, 32]} scale={6.0} />
      <Piece model={DECORATION.mountain_B} position={[62, 0, 40]} rotation={[0, Math.PI / 4, 0]} scale={7.5} />
      <Piece model={DECORATION.rock_E} position={[58, 0, 48]} scale={6.0} />
      <Piece model={DECORATION.mountain_C} position={[64, 0, 55]} rotation={[0, Math.PI / 3, 0]} scale={8.0} />

      {/* ══════════ WEST WALL (X ≈ -58 to -68, Z from -75 to 55) ══════════ */}
      <Piece model={DECORATION.mountain_A} position={[-62, 0, -70]} rotation={[0, -Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.hill_B} position={[-58, 0, -62]} scale={6.5} />
      <Piece model={DECORATION.rock_C} position={[-60, 0, -55]} scale={7.0} />
      <Piece model={DECORATION.mountain_B} position={[-64, 0, -48]} rotation={[0, -Math.PI / 6, 0]} scale={8.0} />
      <Piece model={DECORATION.hills_B_trees} position={[-60, 0, -40]} scale={6.0} />
      <Piece model={DECORATION.hill_A} position={[-62, 0, -32]} scale={6.5} />
      <Piece model={DECORATION.mountain_C} position={[-66, 0, -24]} rotation={[0, -Math.PI / 3, 0]} scale={7.5} />
      <Piece model={DECORATION.rock_E} position={[-60, 0, -16]} scale={6.0} />
      <Piece model={DECORATION.hill_C} position={[-64, 0, -8]} scale={6.5} />
      <Piece model={DECORATION.mountain_A} position={[-62, 0, 0]} rotation={[0, Math.PI / 5, 0]} scale={8.0} />
      <Piece model={DECORATION.hills_trees} position={[-60, 0, 8]} scale={6.0} />
      <Piece model={DECORATION.rock_A} position={[-62, 0, 16]} scale={7.0} />
      <Piece model={DECORATION.mountain_B} position={[-64, 0, 24]} rotation={[0, -Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.hill_B} position={[-60, 0, 32]} scale={6.0} />
      <Piece model={DECORATION.mountain_A} position={[-62, 0, 40]} rotation={[0, -Math.PI / 4, 0]} scale={7.5} />
      <Piece model={DECORATION.rock_D} position={[-58, 0, 48]} scale={6.0} />
      <Piece model={DECORATION.mountain_C} position={[-64, 0, 55]} rotation={[0, -Math.PI / 3, 0]} scale={8.0} />

      {/* ══════════ SOUTH WALL (Z ≈ 58-72, X from -55 to 55) ══════════ */}
      <Piece model={DECORATION.mountain_A} position={[-50, 0, 62]} rotation={[0, Math.PI / 3, 0]} scale={8.0} />
      <Piece model={DECORATION.hill_A} position={[-40, 0, 60]} scale={6.0} />
      <Piece model={DECORATION.rock_B} position={[-30, 0, 62]} scale={7.0} />
      <Piece model={DECORATION.mountain_B} position={[-20, 0, 64]} scale={8.0} />
      <Piece model={DECORATION.hills_trees} position={[-10, 0, 62]} scale={6.0} />
      <Piece model={DECORATION.hill_C} position={[0, 0, 64]} scale={6.5} />
      <Piece model={DECORATION.mountain_C} position={[10, 0, 62]} rotation={[0, -Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.rock_D} position={[20, 0, 60]} scale={6.5} />
      <Piece model={DECORATION.hill_B} position={[30, 0, 62]} scale={6.0} />
      <Piece model={DECORATION.mountain_A} position={[40, 0, 64]} rotation={[0, -Math.PI / 3, 0]} scale={8.0} />
      <Piece model={DECORATION.rock_E} position={[50, 0, 60]} scale={6.0} />
      {/* South wall — second row for depth */}
      <Piece model={DECORATION.mountain_B} position={[-45, 0, 72]} scale={9.0} />
      <Piece model={DECORATION.mountain_A} position={[-15, 0, 74]} scale={9.0} />
      <Piece model={DECORATION.mountain_C} position={[15, 0, 72]} rotation={[0, Math.PI / 5, 0]} scale={9.0} />
      <Piece model={DECORATION.mountain_B} position={[45, 0, 72]} scale={8.5} />

      {/* ══════════ NORTH WALL (Z ≈ -85 to -95, behind dungeon) ══════════ */}
      <Piece model={DECORATION.mountain_A} position={[0, 0, -95]} scale={10.0} />
      <Piece model={DECORATION.mountain_B} position={[-30, 0, -92]} scale={9.0} />
      <Piece model={DECORATION.mountain_A} position={[30, 0, -92]} scale={9.0} />
      <Piece model={DECORATION.mountain_C} position={[-55, 0, -88]} rotation={[0, Math.PI / 5, 0]} scale={8.5} />
      <Piece model={DECORATION.mountain_C} position={[55, 0, -88]} rotation={[0, -Math.PI / 5, 0]} scale={8.5} />
      {/* Fill gaps between dungeon cliffs and east/west walls */}
      <Piece model={DECORATION.hill_A} position={[-45, 0, -82]} scale={7.0} />
      <Piece model={DECORATION.rock_C} position={[-52, 0, -78]} scale={7.0} />
      <Piece model={DECORATION.mountain_B} position={[-58, 0, -82]} rotation={[0, Math.PI / 4, 0]} scale={7.5} />
      <Piece model={DECORATION.hill_B} position={[45, 0, -82]} scale={7.0} />
      <Piece model={DECORATION.rock_A} position={[52, 0, -78]} scale={7.0} />
      <Piece model={DECORATION.mountain_A} position={[58, 0, -82]} rotation={[0, -Math.PI / 4, 0]} scale={7.5} />

      {/* ══════════ CORNERS ══════════ */}
      <Piece model={DECORATION.mountain_C} position={[62, 0, -75]} rotation={[0, Math.PI / 3, 0]} scale={8.0} />
      <Piece model={DECORATION.hill_C} position={[60, 0, -68]} scale={6.0} />
      <Piece model={DECORATION.mountain_B} position={[-62, 0, -75]} rotation={[0, -Math.PI / 3, 0]} scale={8.0} />
      <Piece model={DECORATION.hill_A} position={[-60, 0, -68]} scale={6.0} />
      <Piece model={DECORATION.mountain_A} position={[60, 0, 58]} rotation={[0, -Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.hills_B_trees} position={[58, 0, 65]} scale={6.5} />
      <Piece model={DECORATION.mountain_B} position={[-60, 0, 58]} rotation={[0, Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.hills_trees} position={[-58, 0, 65]} scale={6.5} />
    </group>
  )
}

// ============================================================================
// IMPENETRABLE FOREST — Dense tree ring hiding the world edge
// ============================================================================

function ImpenetrableForest() {
  // Tree models to mix for visual variety
  const treeModels = [
    DECORATION.tree_A,
    DECORATION.tree_B,
    DECORATION.trees_large,
    DECORATION.trees_medium,
    DECORATION.trees_small,
    DECORATION.trees_B_large,
    DECORATION.trees_B_medium,
    DECORATION.trees_B_small,
  ]

  // Deterministic pseudo-random from index (avoids Math.random for consistency)
  const pick = (i: number, arr: string[]) => arr[i % arr.length]
  const rot = (i: number) => ((i * 137.5) % 360) * (Math.PI / 180) // golden angle

  // Skip trees in road corridors — all 7 directions (N, S, NE, E, SE, SW, W)
  // Angles computed from spoke targets + N/S main road
  const corridors = [
    { angle: 3 * Math.PI / 2,        half: 0.50 },  // N → dungeon (wide)
    { angle: Math.PI / 2,            half: 0.26 },   // S → park
    { angle: Math.atan2(-38, 38),    half: 0.22 },   // NE → space [38,-38]
    { angle: Math.atan2(5, 48),      half: 0.22 },   // E → school [48,5]
    { angle: Math.atan2(38, 38),     half: 0.22 },   // SE → pizza [38,38]
    { angle: Math.atan2(38, -38),    half: 0.22 },   // SW → concert [-38,38]
    { angle: Math.atan2(5, -48),     half: 0.22 },   // W → kitchen [-48,5]
  ]
  const isInCorridor = (angle: number): boolean => {
    const TWO_PI = 2 * Math.PI
    const normalize = (a: number) => ((a % TWO_PI) + TWO_PI) % TWO_PI
    const a = normalize(angle)
    for (const { angle: ca, half } of corridors) {
      const diff = Math.abs(a - ca)
      if (Math.min(diff, TWO_PI - diff) < half) return true
    }
    return false
  }

  // Skip trees that are too close to any quest zone center (would block camera view)
  const ZONE_CLEARANCE = 15 // units — enough for camera to see zone props
  const zoneCentersArr = Object.values(ZONE_CENTERS)
  const isNearZone = (x: number, z: number): boolean => {
    for (const [cx, , cz] of zoneCentersArr) {
      const dx = x - cx
      const dz = z - cz
      if (dx * dx + dz * dz < ZONE_CLEARANCE * ZONE_CLEARANCE) return true
    }
    return false
  }

  const trees = useMemo(() => {
    const result: { model: string; position: [number, number, number]; rotation: [number, number, number]; scale: number }[] = []

    // === Inner ring (R=52-56): First tree wall ===
    const innerAngles = 18
    for (let i = 0; i < innerAngles; i++) {
      const angle = (i / innerAngles) * Math.PI * 2 + 0.2
      if (isInCorridor(angle)) continue
      const r = 52 + (i % 3) * 2.0
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (isNearZone(x, z)) continue
      if (isNearObject(x, z, 2.0)) continue
      result.push({
        model: pick(i, [DECORATION.trees_large, DECORATION.trees_B_large, DECORATION.trees_medium, DECORATION.tree_A]),
        position: [x, 0, z],
        rotation: [0, rot(i), 0],
        scale: 7.0 + (i % 3) * 0.5,
      })
    }

    // === Middle ring (R=52-62): Dense forest wall — the main barrier ===
    const midAngles = 24
    for (let i = 0; i < midAngles; i++) {
      const angle = (i / midAngles) * Math.PI * 2
      if (isInCorridor(angle)) continue
      const r = 52 + (i % 4) * 3
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (isNearZone(x, z)) continue
      if (isNearObject(x, z, 2.0)) continue
      result.push({
        model: pick(i + 3, treeModels),
        position: [x, 0, z],
        rotation: [0, rot(i + 50), 0],
        scale: 7.5 + (i % 4) * 0.5,
      })
      // Double up every other position for density
      if (i % 2 === 0) {
        const offset = 2.5 + (i % 3)
        const x2 = x + offset
        const z2 = z + offset
        if (!isNearZone(x2, z2) && !isNearObject(x2, z2, 2.0)) {
          result.push({
            model: pick(i + 7, treeModels),
            position: [x2, 0, z2],
            rotation: [0, rot(i + 100), 0],
            scale: 7.0 + (i % 3) * 0.8,
          })
        }
      }
    }

    // === Outer ring (R=65-75): Sparse large trees behind mountains ===
    const outerAngles = 20
    for (let i = 0; i < outerAngles; i++) {
      const angle = (i / outerAngles) * Math.PI * 2 + 0.3
      if (isInCorridor(angle)) continue
      const r = 65 + (i % 3) * 5
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (isNearZone(x, z)) continue
      if (isNearObject(x, z, 2.0)) continue
      result.push({
        model: pick(i + 5, [DECORATION.trees_large, DECORATION.trees_B_large, DECORATION.tree_A, DECORATION.tree_B]),
        position: [x, 0, z],
        rotation: [0, rot(i + 200), 0],
        scale: 8.5 + (i % 3) * 1.0,
      })
    }

    return result
  }, [])

  return (
    <group name="impenetrable-forest">
      {trees.map((t, i) => (
        <Piece key={`forest-${i}`} model={t.model} position={t.position} rotation={t.rotation} scale={t.scale} />
      ))}
    </group>
  )
}

// ============================================================================
// TREE BORDER — 3 dense rows of trees just inside the world edge
// ============================================================================

function TreeBorder() {
  const treeModels = [
    DECORATION.tree_A,
    DECORATION.tree_B,
    DECORATION.trees_large,
    DECORATION.trees_medium,
    DECORATION.trees_B_large,
    DECORATION.trees_B_medium,
  ]

  const trees = useMemo(() => {
    const result: { model: string; position: [number, number, number]; rotation: [number, number, number]; scale: number }[] = []
    const pick = (i: number) => treeModels[i % treeModels.length]
    const rot = (i: number) => ((i * 137.5) % 360) * (Math.PI / 180)
    let idx = 0

    const SPACING = 5
    const ROWS = [0, 4, 8] // offset from innermost row (all beyond player bounds)
    const SCALE = 8.0

    // Slight jitter so rows don't look perfectly aligned
    const jitter = (i: number) => ((i * 17) % 5) * 0.6 - 1.5

    // ── EAST EDGE (X = 70 → 78) ──
    for (const rowOff of ROWS) {
      const x = 70 + rowOff
      for (let z = -95; z <= 75; z += SPACING) {
        result.push({
          model: pick(idx),
          position: [x, 0, z + jitter(idx)],
          rotation: [0, rot(idx), 0],
          scale: SCALE + (idx % 3) * 0.8,
        })
        idx++
      }
    }

    // ── WEST EDGE (X = -70 → -78) ──
    for (const rowOff of ROWS) {
      const x = -(70 + rowOff)
      for (let z = -95; z <= 75; z += SPACING) {
        result.push({
          model: pick(idx),
          position: [x, 0, z + jitter(idx)],
          rotation: [0, rot(idx), 0],
          scale: SCALE + (idx % 3) * 0.8,
        })
        idx++
      }
    }

    // ── SOUTH EDGE (Z = 70 → 78) ──
    for (const rowOff of ROWS) {
      const z = 70 + rowOff
      for (let x = -80; x <= 80; x += SPACING) {
        result.push({
          model: pick(idx),
          position: [x + jitter(idx), 0, z],
          rotation: [0, rot(idx), 0],
          scale: SCALE + (idx % 3) * 0.8,
        })
        idx++
      }
    }

    // ── NORTH EDGE (Z = -92 → -100) ──
    for (const rowOff of ROWS) {
      const z = -(92 + rowOff)
      for (let x = -80; x <= 80; x += SPACING) {
        result.push({
          model: pick(idx),
          position: [x + jitter(idx), 0, z],
          rotation: [0, rot(idx), 0],
          scale: SCALE + (idx % 3) * 0.8,
        })
        idx++
      }
    }

    return result
  }, [])

  return (
    <group name="tree-border">
      {trees.map((t, i) => (
        <Piece key={`tborder-${i}`} model={t.model} position={t.position} rotation={t.rotation} scale={t.scale} />
      ))}
    </group>
  )
}

// ============================================================================
// DUNGEON CLIFFS — Mountain/cliff bowl enclosing the dungeon from all sides
// ============================================================================

function DungeonCliffs() {
  // Cliff bowl wraps around the dungeon (centered at Z=-70)
  // Open only at the south (Z≈-63) where the road enters
  return (
    <group name="dungeon-cliffs">
      {/* ── Back wall (north, behind dungeon Z=-84 to -92) ── */}
      <Piece model={DECORATION.mountain_A} position={[0, 0, -92]} scale={13.0} />
      <Piece model={DECORATION.mountain_B} position={[-18, 0, -90]} scale={11.0} />
      <Piece model={DECORATION.mountain_C} position={[18, 0, -90]} scale={11.0} />
      <Piece model={DECORATION.hill_C} position={[-9, 0, -86]} scale={9.0} />
      <Piece model={DECORATION.hill_A} position={[9, 0, -86]} scale={9.0} />
      <Piece model={DECORATION.rock_C} position={[-4, 0, -84]} scale={7.0} />
      <Piece model={DECORATION.rock_D} position={[4, 0, -84]} scale={7.0} />

      {/* ── Left wall (west, X=-18 to -30) ── */}
      <Piece model={DECORATION.mountain_A} position={[-25, 0, -76]} rotation={[0, Math.PI / 4, 0]} scale={11.0} />
      <Piece model={DECORATION.mountain_C} position={[-28, 0, -72]} rotation={[0, Math.PI / 3, 0]} scale={10.0} />
      <Piece model={DECORATION.hill_B} position={[-26, 0, -68]} scale={9.0} />
      <Piece model={DECORATION.rock_A} position={[-22, 0, -65]} scale={8.0} />
      <Piece model={DECORATION.hills_trees} position={[-20, 0, -74]} scale={9.0} />
      <Piece model={DECORATION.rock_E} position={[-18, 0, -62]} scale={7.5} />

      {/* ── Right wall (east, X=+18 to +30) ── */}
      <Piece model={DECORATION.mountain_B} position={[25, 0, -76]} rotation={[0, -Math.PI / 4, 0]} scale={11.0} />
      <Piece model={DECORATION.mountain_C} position={[28, 0, -72]} rotation={[0, -Math.PI / 3, 0]} scale={10.0} />
      <Piece model={DECORATION.hill_A} position={[26, 0, -68]} scale={9.0} />
      <Piece model={DECORATION.rock_B} position={[22, 0, -65]} scale={8.0} />
      <Piece model={DECORATION.hills_B_trees} position={[20, 0, -74]} scale={9.0} />
      <Piece model={DECORATION.rock_D} position={[18, 0, -62]} scale={7.5} />

      {/* ── Approach cliffs (Z=-50 to Z=-63) — flanking the path to dungeon ── */}
      {/* Left side — starts small, grows toward dungeon */}
      <Piece model={DECORATION.rock_C} position={[-8, 0, -50]} scale={4.5} />
      <Piece model={DECORATION.rock_A} position={[-10, 0, -52]} scale={5.0} />
      <Piece model={DECORATION.hill_A} position={[-11, 0, -54]} scale={5.0} />
      <Piece model={DECORATION.rock_E} position={[-9, 0, -56]} scale={5.5} />
      <Piece model={DECORATION.hill_C} position={[-12, 0, -58]} scale={5.5} />
      <Piece model={DECORATION.rock_A} position={[-13, 0, -60]} scale={6.0} />
      <Piece model={DECORATION.hill_C} position={[-16, 0, -62]} scale={5.5} />

      {/* Right side — mirrors left */}
      <Piece model={DECORATION.rock_D} position={[8, 0, -50]} scale={4.5} />
      <Piece model={DECORATION.rock_B} position={[10, 0, -52]} scale={5.0} />
      <Piece model={DECORATION.hill_B} position={[11, 0, -54]} scale={5.0} />
      <Piece model={DECORATION.rock_C} position={[9, 0, -56]} scale={5.5} />
      <Piece model={DECORATION.hill_A} position={[12, 0, -58]} scale={5.5} />
      <Piece model={DECORATION.rock_B} position={[13, 0, -60]} scale={6.0} />
      <Piece model={DECORATION.hill_B} position={[16, 0, -62]} scale={5.5} />

      {/* Entrance narrows — boulders where approach meets the bowl */}
      <Piece model={DECORATION.rock_A} position={[-12, 0, -63]} scale={6.5} />
      <Piece model={DECORATION.rock_B} position={[12, 0, -63]} scale={6.5} />

      {/* ── Trees on cliff tops for silhouette ── */}
      <Piece model={DECORATION.tree_A} position={[-22, 0, -78]} scale={10.0} />
      <Piece model={DECORATION.tree_B} position={[22, 0, -78]} scale={10.0} />
      <Piece model={DECORATION.tree_A} position={[-30, 0, -70]} scale={9.0} />
      <Piece model={DECORATION.tree_B} position={[30, 0, -70]} scale={9.0} />
      <Piece model={DECORATION.tree_A} position={[0, 0, -94]} scale={10.0} />
      <Piece model={DECORATION.tree_B} position={[-12, 0, -92]} scale={9.0} />
      <Piece model={DECORATION.tree_A} position={[12, 0, -92]} scale={9.0} />
    </group>
  )
}

// ============================================================================
// DUNGEON ZONE — Northern area (skeleton-birthday quest)
// ============================================================================

function DungeonZone() {
  const center = ZONE_CENTERS['skeleton-birthday']
  // Stage angle=0: camera from +Z, stage back at Z=-2, sides at X=±5
  // Back wall at Z=-4 (just behind stage), side walls at X=±6, wings at X=±7

  return (
    <group name="dungeon-zone" position={center}>
      {/* ── Back wall (Z=-4, spanning X=-7 to +7) — right behind stage back ── */}
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-6, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-4, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-2, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_doorway.gltf" position={[0, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[2, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[4, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[6, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[8, 0, -4]} />

      {/* Left side wall (X=-7, from back wall to downstage) */}
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-7, 0, -3]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-7, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-7, 0, 1]} rotation={[0, Math.PI / 2, 0]} />

      {/* Right side wall (X=+7) */}
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[7, 0, -3]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[7, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[7, 0, 1]} rotation={[0, Math.PI / 2, 0]} />

      {/* Columns connecting walls at the back — where back wall meets side walls + center */}
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[-7, 0, -4]} scale={1.3} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[7, 0, -4]} scale={1.3} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[0, 0, -4]} scale={1.3} />
      {/* Wing-edge pillars */}
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[-7, 0, 2]} scale={1.3} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[7, 0, 2]} scale={1.3} />

      {/* Floor tiles — behind and around the stage */}
      {[-4, -2, 0, 2, 4].map(x =>
        [-3, -2, -1, 0, 1].map(z => (
          <Piece key={`floor-${x}-${z}`} model="kaykit/packs/dungeon/floor_tile_large.gltf" position={[x, 0.01, z]} noCollision />
        ))
      )}

      {/* Props — against walls, not on stage */}
      <Piece model="kaykit/packs/dungeon/barrel_large.gltf" position={[-6.5, 0, 1]} scale={0.4} />
      <Piece model="kaykit/packs/dungeon/barrel_small.gltf" position={[-6.5, 0, 0]} scale={0.5} />
      <Piece model="kaykit/packs/dungeon/barrel_large.gltf" position={[6.5, 0, 0.5]} scale={0.4} />
      <Piece model="kaykit/packs/dungeon/barrel_small.gltf" position={[6.5, 0, -0.5]} scale={0.5} />
      <Piece model="kaykit/packs/dungeon/chest_large_gold.gltf" position={[5, 0, -3.5]} rotation={[0, Math.PI, 0]} scale={0.35} />
      <Piece model="kaykit/packs/dungeon/chest_gold.gltf" position={[-5, 0, -3.5]} scale={0.4} />

      {/* Banners on back wall */}
      <Piece model="kaykit/packs/dungeon/banner_patternA_blue.gltf" position={[-4, 1.5, -3.8]} scale={0.7} />
      <Piece model="kaykit/packs/dungeon/banner_patternB_red.gltf" position={[0, 1.5, -3.8]} scale={0.7} />
      <Piece model="kaykit/packs/dungeon/banner_patternA_green.gltf" position={[4, 1.5, -3.8]} scale={0.7} />

      {/* Torch glow */}
      <pointLight color="#ff6600" intensity={3} distance={12} decay={2} position={[-5, 3, -3]} />
      <pointLight color="#ff6600" intensity={3} distance={12} decay={2} position={[5, 3, -3]} />
      <pointLight color="#ff4400" intensity={2} distance={10} decay={2} position={[0, 3, -3.5]} />
      <pointLight color="#ff6600" intensity={2} distance={10} decay={2} position={[0, 2, 0]} />

      {/* Approach decoration — moved further out */}
      <Piece model={DECORATION.weaponrack} position={[-10, 0, 6]} scale={7.0} />
      <Piece model={DECORATION.target} position={[10, 0, 6]} scale={7.0} />
    </group>
  )
}

// ============================================================================
// PARK ZONE — Southern area (adventurers-picnic quest)
// ============================================================================

function ParkZone() {
  const center = ZONE_CENTERS['adventurers-picnic']

  return (
    <group name="park-zone" position={center}>
      {/* Central campfire — focal point of the clearing */}
      <Piece model="poly-pizza/misc/small-camping-bundle/Campfire.glb" position={[0, 0, 0]} scale={2.0} />

      {/* Crystal arc behind campfire (south side, visible from center camera) */}
      <Piece model="poly-pizza/nature/crystal-pack/Crystal.glb" position={[-3, 0, 3]} scale={0.25} rotation={[0, 0.4, 0]} />
      <Piece model="poly-pizza/nature/crystal-pack/Crystal-dxCmHfpqc5.glb" position={[0, 0, 4]} scale={0.3} />
      <Piece model="poly-pizza/nature/crystal-pack/Crystal-WzWPKHFMkL.glb" position={[3, 0, 3]} scale={0.25} rotation={[0, -0.3, 0]} />

      {/* Lit torches flanking the clearing */}
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[-5, 0, -1]} scale={2.0} />
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[5, 0, -1]} scale={2.0} />

      {/* Stumps for seating around the fire */}
      <Piece model="tiny-treats/fun-playground/stepping_stumps_B_large.gltf" position={[-2.5, 0, -2]} scale={1.5} />
      <Piece model="tiny-treats/fun-playground/stepping_stumps_B.gltf" position={[2.5, 0, -2]} scale={1.5} />

      {/* Mushrooms scattered around the clearing */}
      <Piece model="quaternius/nature/Mushroom_Common.gltf" position={[-4, 0, 2]} scale={2.0} />
      <Piece model="quaternius/nature/Mushroom_Common.gltf" position={[4.5, 0, 1.5]} scale={1.5} />
      <Piece model="quaternius/nature/Mushroom_Laetiporus.gltf" position={[-6, 0, 0]} scale={1.8} />

      {/* Rocks framing the edges */}
      <Piece model="kaykit/packs/forest_nature/Rock_1_C_Color1.gltf" position={[-6, 0, 3]} scale={1.2} />
      <Piece model="kaykit/packs/forest_nature/Rock_3_A_Color2.gltf" position={[6, 0, 2.5]} scale={1.0} />
    </group>
  )
}

// ============================================================================
// SPACE ZONE — Northeast area (knight-space quest)
// ============================================================================

function SpaceZone() {
  const center = ZONE_CENTERS['knight-space']

  // Scale 2.5 = objects visible from village (dropship ~3.2u, modules ~2.5u)
  const sp = 2.5
  return (
    <group name="space-zone" position={center}>
      {/* Landing pad */}
      <Piece model="kaykit/packs/space_base/landingpad_large.gltf" position={[9.3, 0, 7.1]} scale={sp} />
      {/* Base modules — spread out to prevent overlap at 2.5x */}
      <Piece model="kaykit/packs/space_base/basemodule_A.gltf" position={[-7, 0, -5]} scale={sp} />
      <Piece model="kaykit/packs/space_base/basemodule_B.gltf" position={[7, 0, -5]} scale={sp} />
      {/* Tunnel connecting modules */}
      <Piece model="kaykit/packs/space_base/tunnel_straight_A.gltf" position={[0, 0, -5]} scale={sp} />
      {/* Dropship on the pad */}
      <Piece model="kaykit/packs/space_base/dropship.gltf" position={[2, 0, 8]} scale={sp} />
      {/* Cargo and containers */}
      <Piece model="kaykit/packs/space_base/containers_A.gltf" position={[-8, 0, 3]} scale={sp} />
      <Piece model="kaykit/packs/space_base/cargo_A.gltf" position={[8, 0, 2]} scale={sp} />
      {/* Solar panel */}
      <Piece model="kaykit/packs/space_base/solarpanel.gltf" position={[-9, 0, -8]} scale={sp} />
      {/* Dome */}
      <Piece model="kaykit/packs/space_base/dome.gltf" position={[0, 0, -9]} scale={sp} />
      {/* Accent lights — raised and wider for bigger objects */}
      <pointLight color="#38BDF8" intensity={3} distance={15} decay={2} position={[0, 5, 0]} />
      <pointLight color="#7C3AED" intensity={2} distance={12} decay={2} position={[-6, 4, -5]} />
    </group>
  )
}

// ============================================================================
// SCHOOL ZONE — East area (barbarian-school quest)
// ============================================================================

function SchoolZone() {
  const center = ZONE_CENTERS['barbarian-school']

  return (
    <group name="school-zone" position={center}>
      {/* Playground equipment — pushed off the glowing circle (r≈3) */}
      <Piece model="tiny-treats/fun-playground/swing_A_large.gltf" position={[-5, 0, -5]} />
      <Piece model="tiny-treats/fun-playground/slide_A.gltf" position={[5, 0, -4]} />
      <Piece model="tiny-treats/fun-playground/merry_go_round.gltf" position={[5, 0, 4]} />
      <Piece model="tiny-treats/fun-playground/seesaw_large.gltf" position={[-5, 0, 4]} />
      <Piece model="tiny-treats/fun-playground/sandbox_round_decorated.gltf" position={[0, 0, 6]} />
      {/* Picnic table (schoolyard) */}
      <Piece model="tiny-treats/fun-playground/picnic_table.gltf" position={[0, 0, -6]} />
    </group>
  )
}

// ============================================================================
// PIZZA ZONE — Southeast area (skeleton-pizza quest)
// ============================================================================

function PizzaZone() {
  const center = ZONE_CENTERS['skeleton-pizza']

  return (
    <group name="pizza-zone" position={center} rotation={[0, -3 * Math.PI / 4, 0]}>
      {/* Restaurant walls */}
      <Piece model="kaykit/packs/restaurant/wall.gltf" position={[-3, 0, -4]} />
      <Piece model="kaykit/packs/restaurant/wall_doorway.gltf" position={[0, 0, -4]} />
      <Piece model="kaykit/packs/restaurant/wall.gltf" position={[3, 0, -4]} />
      {/* Kitchen counter */}
      <Piece model="kaykit/packs/restaurant/kitchencounter_straight_A.gltf" position={[-2, 0, -2]} />
      <Piece model="kaykit/packs/restaurant/kitchencounter_straight_decorated.gltf" position={[0, 0, -2]} />
      <Piece model="kaykit/packs/restaurant/kitchencounter_straight_B.gltf" position={[2, 0, -2]} />
      {/* Food crates */}
      <Piece model="kaykit/packs/restaurant/crate_cheese.gltf" position={[-4, 0, -1]} />
      <Piece model="kaykit/packs/restaurant/crate_tomatoes.gltf" position={[-4, 0, 1]} />
      {/* Dining area */}
      <Piece model="kaykit/packs/restaurant/chair_A.gltf" position={[3, 0, 1]} />
      <Piece model="kaykit/packs/restaurant/chair_A.gltf" position={[3, 0, 3]} />
      <Piece model="kaykit/packs/restaurant/plate_small.gltf" position={[2, 0.8, 2]} />
      {/* Distinguishing feature: tent canopy visible from distance */}
      <Piece model={DECORATION.tent} position={[0, 0, -6]} scale={7.0} />
      {/* Warm pizza shop lighting — orange accent visible from afar */}
      <pointLight color="#FF8C42" intensity={4} distance={15} decay={2} position={[0, 5, 0]} />
      <pointLight color="#FBBF24" intensity={2} distance={8} decay={2} position={[0, 2, 2]} />
    </group>
  )
}

// ============================================================================
// CONCERT ZONE — Southwest area (dungeon-concert / Dungeon Escape quest)
// ============================================================================

function ConcertZone() {
  const center = ZONE_CENTERS['dungeon-concert']
  // Rotate group to match stage orientation — local -Z = upstage (back), +Z = downstage (front/camera)
  const angle = Math.atan2(-center[0], -center[2]) // ≈ 2.356 rad (135°)
  const d = 'kaykit/packs/dungeon/'

  return (
    <group name="concert-zone" position={center} rotation={[0, angle, 0]}>
      {/* ── Back wall (Z=-4, behind stage) — gated prison walls with doorway ── */}
      <Piece model={d + 'wall_gated.gltf'} position={[-6, 0, -4]} />
      <Piece model={d + 'wall_half.gltf'} position={[-4, 0, -4]} />
      <Piece model={d + 'wall_half.gltf'} position={[-2, 0, -4]} />
      <Piece model={d + 'wall_doorway.gltf'} position={[0, 0, -4]} />
      <Piece model={d + 'wall_half.gltf'} position={[2, 0, -4]} />
      <Piece model={d + 'wall_half.gltf'} position={[4, 0, -4]} />
      <Piece model={d + 'wall_gated.gltf'} position={[6, 0, -4]} />

      {/* ── Left side wall (X=-7) ── */}
      <Piece model={d + 'wall_archedwindow_gated.gltf'} position={[-7, 0, -3]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={d + 'wall_half.gltf'} position={[-7, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={d + 'wall_archedwindow_gated.gltf'} position={[-7, 0, 1]} rotation={[0, Math.PI / 2, 0]} />

      {/* ── Right side wall (X=+7) ── */}
      <Piece model={d + 'wall_archedwindow_gated.gltf'} position={[7, 0, -3]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={d + 'wall_half.gltf'} position={[7, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={d + 'wall_archedwindow_gated.gltf'} position={[7, 0, 1]} rotation={[0, Math.PI / 2, 0]} />

      {/* ── Pillars at wall junctions ── */}
      <Piece model={d + 'pillar_decorated.gltf'} position={[-7, 0, -4]} scale={1.3} />
      <Piece model={d + 'pillar_decorated.gltf'} position={[7, 0, -4]} scale={1.3} />
      <Piece model={d + 'pillar_decorated.gltf'} position={[0, 0, -4]} scale={1.3} />
      {/* Wing-edge pillars */}
      <Piece model={d + 'pillar_decorated.gltf'} position={[-7, 0, 2]} scale={1.3} />
      <Piece model={d + 'pillar_decorated.gltf'} position={[7, 0, 2]} scale={1.3} />

      {/* ── Floor tiles ── */}
      {[-4, -2, 0, 2, 4].map(x =>
        [-3, -2, -1, 0, 1].map(z => (
          <Piece key={`cf-${x}-${z}`} model={d + 'floor_tile_large.gltf'} position={[x, 0.01, z]} noCollision />
        ))
      )}

      {/* ── Escape-themed props — against walls, clear of stage ── */}
      <Piece model={d + 'crates_stacked.gltf'} position={[-6.5, 0, 1]} scale={0.5} />
      <Piece model={d + 'barrel_large.gltf'} position={[-6.5, 0, -0.5]} scale={0.4} />
      <Piece model={d + 'crate_large.gltf'} position={[6.5, 0, 0.5]} scale={0.5} />
      <Piece model={d + 'barrel_small_stack.gltf'} position={[6.5, 0, -1]} scale={0.5} />
      <Piece model={d + 'chest_mimic.gltf'} position={[5, 0, -3.5]} rotation={[0, Math.PI, 0]} scale={0.4} />
      <Piece model={d + 'chest_large.gltf'} position={[-5, 0, -3.5]} scale={0.4} />
      {/* Scaffold against back wall */}
      <Piece model={d + 'scaffold_frame_large.gltf'} position={[-4, 0, -3.7]} scale={0.8} />
      <Piece model={d + 'scaffold_frame_small.gltf'} position={[4, 0, -3.7]} scale={0.8} />

      {/* ── Banners on back wall ── */}
      <Piece model={d + 'banner_shield_blue.gltf'} position={[-2, 1.8, -3.8]} scale={0.7} />
      <Piece model={d + 'banner_shield_red.gltf'} position={[2, 1.8, -3.8]} scale={0.7} />

      {/* ── Key + keyring escape details ── */}
      <Piece model={d + 'keyring_hanging.gltf'} position={[-6.8, 1.5, -1]} noCollision />
      <Piece model={d + 'torch_mounted.gltf'} position={[6.8, 1.5, -1]} noCollision />

      {/* ── Torch glow (point lights only) ── */}
      <pointLight color="#ff6600" intensity={3} distance={12} decay={2} position={[-5, 3, -3]} />
      <pointLight color="#ff6600" intensity={3} distance={12} decay={2} position={[5, 3, -3]} />
      <pointLight color="#ff4400" intensity={2} distance={10} decay={2} position={[0, 3, -3.5]} />
      <pointLight color="#ff6600" intensity={2} distance={10} decay={2} position={[0, 2, 0]} />
    </group>
  )
}

// ============================================================================
// KITCHEN ZONE — West area (mage-kitchen quest)
// ============================================================================

function KitchenZone() {
  const center = ZONE_CENTERS['mage-kitchen']
  // Camera from east (+X), looking west. L-shape: back wall (west) + side wall (south).
  // North and east walls removed — diorama cutaway so camera sees in.
  const k = 'tiny-treats/charming-kitchen/'
  const b = 'tiny-treats/baked-goods/'
  const bi = 'tiny-treats/bakery-interior/'
  const hp = 'tiny-treats/house-plants/'
  return (
    <group name="kitchen-zone" position={center}>
      {/* ── BACK WALL (west, X=-6) — single straight line ── */}
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, -6]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, -4]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, -2]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, 2]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, 4]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'wall_modular_tiles_kitchen_straight_A.gltf'} position={[-6, 0, 6]} rotation={[0, Math.PI / 2, 0]} />

      {/* NO north wall, NO east wall — diorama cutaway for camera */}

      {/* ── COUNTERS — L-shape run ── */}
      {/* Long run along back wall (X=-5) */}
      <Piece model={k + 'countertop_straight_A.gltf'} position={[-5, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'countertop_sink.gltf'} position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'countertop_straight_B.gltf'} position={[-5, 0, 1]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model={k + 'countertop_straight_C.gltf'} position={[-5, 0, 3]} rotation={[0, Math.PI / 2, 0]} />
      {/* L-arm along south wall (Z=-6) with corner connector */}
      <Piece model={k + 'countertop_corner_inner.gltf'} position={[-5, 0, -5]} rotation={[0, Math.PI, 0]} />
      <Piece model={k + 'countertop_straight_A.gltf'} position={[-4, 0, -6]} />
      <Piece model={k + 'countertop_straight_B.gltf'} position={[-3, 0, -6]} />

      {/* ── WALL CABINETS (above back-wall counters) ── */}
      <Piece model={k + 'wall_cabinet_straight.gltf'} position={[-5.8, 1.8, -1]} rotation={[0, Math.PI / 2, 0]} noCollision />
      <Piece model={k + 'wall_cabinet_straight.gltf'} position={[-5.8, 1.8, 1]} rotation={[0, Math.PI / 2, 0]} noCollision />
      <Piece model={k + 'wall_cabinet_straight.gltf'} position={[-5.8, 1.8, 3]} rotation={[0, Math.PI / 2, 0]} noCollision />
      {/* Wall shelf with hooks + knife rack for variety */}
      <Piece model={k + 'wall_shelf_kitchen_hooks_decorated.gltf'} position={[-5.8, 1.5, -5]} rotation={[0, Math.PI / 2, 0]} noCollision />
      <Piece model={k + 'wall_knife_rack.gltf'} position={[-5.8, 1.5, 3.8]} rotation={[0, Math.PI / 2, 0]} noCollision />
      {/* Paper towel holder on south wall */}
      <Piece model={k + 'papertowel_holder.gltf'} position={[-3.5, 1.2, -6.8]} noCollision />

      {/* ── APPLIANCES ── */}
      {/* Stove at end of L-arm (facing into kitchen) with extractor hood */}
      <Piece model={k + 'stove.gltf'} position={[-2, 0, -6]} />
      <Piece model={k + 'extractor_hood.gltf'} position={[-2, 2.2, -6.3]} noCollision />
      {/* Fridge at far right of back wall (tallest item, anchors corner) */}
      <Piece model={k + 'fridge.gltf'} position={[-5, 0, 4.5]} rotation={[0, Math.PI / 2, 0]} />
      {/* Toaster on L-arm counter */}
      <Piece model={k + 'toaster.gltf'} position={[-4, 0.9, -6]} noCollision />

      {/* ── COUNTER CLUTTER (on surfaces, Y≈0.9) ── */}
      {/* Back wall counters */}
      <Piece model={k + 'dishrack_plates.gltf'} position={[-5, 0.9, -0.5]} noCollision />
      <Piece model={k + 'utensils_cup.gltf'} position={[-4.8, 0.9, 1.3]} noCollision />
      <Piece model={k + 'kettle.gltf'} position={[-5, 0.9, 3.2]} noCollision />
      <Piece model={k + 'container_kitchen_A_blue.gltf'} position={[-4.8, 0.9, 0.6]} noCollision />
      <Piece model={k + 'container_kitchen_B_red.gltf'} position={[-4.7, 0.9, 1.8]} noCollision />
      <Piece model={k + 'mug_blue.gltf'} position={[-4.9, 0.9, 2.5]} noCollision />
      <Piece model={k + 'mug_red.gltf'} position={[-5.1, 0.9, -1.3]} noCollision />
      {/* L-arm counters */}
      <Piece model={k + 'cuttingboard.gltf'} position={[-3.2, 0.9, -5.8]} noCollision />
      <Piece model={k + 'pan.gltf'} position={[-4.3, 0.9, -5.8]} noCollision />
      <Piece model={k + 'pot.gltf'} position={[-2.2, 0.9, -5.8]} noCollision />
      <Piece model={k + 'lid.gltf'} position={[-2.5, 0.9, -6.2]} noCollision />
      {/* Food on counters */}
      <Piece model={b + 'bread.gltf'} position={[-5, 0.9, 0.8]} noCollision />
      <Piece model={b + 'pie_apple.gltf'} position={[-5, 0.9, 2.8]} noCollision />

      {/* ── CENTER ISLAND — magical prep table (focal point) ── */}
      <Piece model={k + 'table_B.gltf'} position={[-1.5, 0, 1]} />
      <Piece model={bi + 'mixing_bowl.gltf'} position={[-1.8, 0.9, 1.3]} noCollision />
      <Piece model={k + 'spoon.gltf'} position={[-1.2, 0.9, 0.7]} noCollision />
      <Piece model={b + 'cake_birthday.gltf'} position={[-1.5, 0.9, 1]} noCollision />
      <Piece model={k + 'mug_yellow.gltf'} position={[-1, 0.9, 1.5]} noCollision />

      {/* ── MAGICAL FLOOR MESS (cooking gone wrong!) ── */}
      <Piece model={bi + 'flour_sack_open.gltf'} position={[-3.5, 0, -1]} rotation={[0, 0.5, 0]} noCollision />
      <Piece model={bi + 'dough_ball.gltf'} position={[-2.8, 0, -0.5]} noCollision />
      <Piece model={bi + 'egg_A.gltf'} position={[0, 0, -2]} noCollision />
      <Piece model={bi + 'egg_B.gltf'} position={[0.5, 0, 2]} noCollision />
      <Piece model={bi + 'basket_A.gltf'} position={[1, 0, -3]} noCollision />
      <Piece model={b + 'bread_roll.gltf'} position={[1, 0, -2.5]} noCollision />
      <Piece model={k + 'oven_glove.gltf'} position={[-4, 0, -1.5]} noCollision />
      <Piece model={k + 'plate.gltf'} position={[0.5, 0, 3]} noCollision />
      <Piece model={k + 'spatula.gltf'} position={[-0.5, 0, -0.5]} noCollision />

      {/* ── DECORATIVE TOUCHES ── */}
      <Piece model={hp + 'monstera_plant_small_potted.gltf'} position={[-5.5, 0, 4.8]} noCollision />

      {/* ── MAGICAL KITCHEN ATMOSPHERE ── */}
      {/* Warm amber over cooking L-arm */}
      <pointLight color="#FBBF24" intensity={5} distance={12} decay={2} position={[-3, 3, -3]} />
      {/* Purple magical glow from center island (the magic is loose!) */}
      <pointLight color="#A855F7" intensity={6} distance={16} decay={2} position={[-1, 4, 1]} />
      {/* Cool blue accent from the open side */}
      <pointLight color="#38BDF8" intensity={3} distance={10} decay={2} position={[2, 3, 3]} />
      {/* Soft warm fill light overhead */}
      <pointLight color="#FDE68A" intensity={2} distance={20} decay={2} position={[-2, 6, 0]} />
    </group>
  )
}

// ============================================================================
// ROAD DECORATION — Props along the road between zones
// ============================================================================

function RoadDecoration() {
  const d = 7.0

  // Road-edge props along spoke roads (rocks, flowers, small hills every ~8u)
  const roadEdgeProps = useMemo(() => {
    const EDGE_MODELS = [
      { model: DECORATION.rock_A, scale: 4.0 },
      { model: DECORATION.rock_B, scale: 4.0 },
      { model: DECORATION.rock_C, scale: 4.0 },
      { model: DECORATION.rock_D, scale: 4.0 },
      { model: DECORATION.rock_E, scale: 4.0 },
      { model: DECORATION.flower_A, scale: 5.0 },
      { model: DECORATION.flower_B, scale: 5.0 },
      { model: DECORATION.hill_A, scale: 3.0 },
      { model: DECORATION.hill_B, scale: 3.0 },
    ]
    const result: { model: string; position: [number, number, number]; scale: number }[] = []
    let seed = 42

    // Simple seeded random
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }

    for (const [tx, tz] of SPOKE_TARGETS) {
      const len = Math.sqrt(tx * tx + tz * tz)
      const dx = tx / len
      const dz = tz / len
      const px = -dz // perpendicular
      const pz = dx

      for (let t = 12; t < len - 8; t += 8) {
        const wx = dx * t
        const wz = dz * t
        // Skip if inside kitchen zone
        if (isInKitchenZone(wx, wz)) continue
        // Skip if near village center buildings
        if (isNearObject(wx, wz, 2)) continue

        const side = rand() > 0.5 ? 5 : -5
        const pick = EDGE_MODELS[Math.floor(rand() * EDGE_MODELS.length)]
        result.push({
          model: pick.model,
          position: [wx + px * side, 0, wz + pz * side],
          scale: pick.scale,
        })
      }
    }

    // Also along the grand boulevard (N-S)
    for (let z = -45; z <= 45; z += 8) {
      if (isNearObject(0, z, 2)) continue
      const pick = EDGE_MODELS[Math.floor(rand() * EDGE_MODELS.length)]
      const side = rand() > 0.5 ? 8 : -8
      result.push({
        model: pick.model,
        position: [side, 0, z],
        scale: pick.scale,
      })
    }

    return result
  }, [])

  // Generate lanterns along each spoke road
  const lanterns = useMemo(() => {
    const result: { position: [number, number, number]; rotation: [number, number, number] }[] = []

    // Lanterns along grand boulevard (N-S)
    for (let z = -40; z <= 40; z += 8) {
      result.push({ position: [6, 0, z], rotation: [0, 0, 0] })
      result.push({ position: [-6, 0, z + 4], rotation: [0, Math.PI, 0] })
    }

    // Lanterns along each spoke road (every ~10u, alternating sides)
    for (const [tx, tz] of SPOKE_TARGETS) {
      const len = Math.sqrt(tx * tx + tz * tz)
      const dx = tx / len
      const dz = tz / len
      const px = -dz
      const pz = dx
      for (let t = 10; t < len - 5; t += 10) {
        const side = (t / 10) % 2 === 0 ? 4 : -4
        result.push({
          position: [dx * t + px * side, 0, dz * t + pz * side],
          rotation: [0, Math.atan2(dz, dx), 0],
        })
      }
    }

    // Remove lamp posts within 6 units of each other, keeping the one closer to center
    // Also remove any lanterns inside the kitchen zone
    const MIN_DIST = 6
    const filtered: typeof result = []
    for (const lamp of result) {
      const [lx, , lz] = lamp.position
      if (isInKitchenZone(lx, lz)) continue
      // Remove the lamp post near village center at approx (-6.3, 3.2)
      if (Math.abs(lx - (-6)) < 1.5 && Math.abs(lz - 4) < 2) continue
      const lDistSq = lx * lx + lz * lz
      let tooClose = false
      for (let i = filtered.length - 1; i >= 0; i--) {
        const [fx, , fz] = filtered[i].position
        const dx2 = lx - fx
        const dz2 = lz - fz
        const distSq = dx2 * dx2 + dz2 * dz2
        if (distSq < MIN_DIST * MIN_DIST) {
          const fDistSq = fx * fx + fz * fz
          if (lDistSq < fDistSq) {
            // New lamp is closer to center — replace the existing one
            filtered.splice(i, 1)
          } else {
            // Existing lamp is closer to center — skip this one
            tooClose = true
            break
          }
        }
      }
      if (!tooClose) filtered.push(lamp)
    }

    return filtered
  }, [])

  return (
    <group name="road-decoration">
      {/* Props along the boulevard — offset to grass beside road */}
      <Piece model={DECORATION.crate_B} position={[-8, 0, 20]} scale={d} />
      <Piece model={DECORATION.haybale} position={[12, 0, -6]} scale={d} />
      <Piece model={DECORATION.trough} position={[-6, 0, 14]} scale={d} />
      <Piece model={DECORATION.barrel} position={[-7, 0, -18]} scale={d} />

      {/* Trees along the boulevard */}
      <Piece model={DECORATION.tree_A} position={[-9, 0, 20]} scale={d} />
      <Piece model={DECORATION.tree_B} position={[9, 0, 28]} scale={d} />

      {/* Lanterns along all roads */}
      {lanterns.map((l, i) => (
        <Piece key={`lantern-${i}`} model={DECORATION.street_lantern} position={l.position} rotation={l.rotation} scale={1.5} />
      ))}

      {/* Road-edge decoration — rocks, flowers, hills along spoke roads */}
      {roadEdgeProps.map((p, i) => (
        <Piece key={`road-edge-${i}`} model={p.model} position={p.position} scale={p.scale} noCollision />
      ))}

    </group>
  )
}

// ============================================================================
// ZONE LANDMARKS — Tall colored buildings visible from village center
// ============================================================================

function ZoneLandmarks() {
  const SPACE = 'kaykit/packs/space_base/'

  return (
    <group name="zone-landmarks">
      {/* ── skeleton-birthday: Red castle (kept as-is) ── */}
      <Piece model={BUILDINGS.castle_red} position={[0, 0, -84]} scale={8.0} />

      {/* ── knight-space [38, 0, -38]: Large space landmark (replaces old tower) ──
          Detail handled by SpaceZone() function */}
      <Piece model={SPACE + 'spacetruck_large.gltf'} position={[44, 0, -46]} scale={3.0} />
      <Piece model={SPACE + 'terrain_tall.gltf'} position={[50, 0, -46]} scale={3.0} />
      <Piece model={SPACE + 'terrain_tall.gltf'} position={[30, 0, -46]} scale={2.5} />

      {/* ── barbarian-school [48, 0, 5]: Landmark (replaces old tower) ──
          Detail handled by SchoolZone() function */}

      {/* ── skeleton-pizza [38, 0, 38]: Landmark (replaces old tower) ──
          Detail handled by PizzaZone() — tent at scale 7.0 serves as landmark */}

      {/* ── adventurers-picnic: Dense forest behind zone ── */}
      {/* Green watchtowers flanking road */}
      <Piece model={BUILDINGS.watchtower_green} position={[11, 0, 53]} scale={10.0} />
      <Piece model={BUILDINGS.watchtower_green} position={[-11, 0, 53]} scale={10.0} />
      {/* Trees within 10u of mountain_B [-20,0,64] removed for cinematic intro clearance */}
      {/* Player starts at [-16.5, 17.5, 63] on this mountain */}
      <Piece model={DECORATION.trees_large} position={[0, 0, 56]} scale={5.0} />
      <Piece model={DECORATION.trees_B_large} position={[-8, 0, 58]} scale={5.5} />
      {/* removed: trees_large [8,0,58] — within intro clearance */}
      {/* removed: tree_A [-16,0,56] — within 10u of player start */}
      {/* removed: tree_B [16,0,56] — within intro clearance */}
      {/* removed: trees_B_medium [-22,0,58] — within 10u of player start */}
      <Piece model={DECORATION.trees_medium} position={[22, 0, 58]} scale={5.0} />
      <Piece model={DECORATION.trees_B_large} position={[-4, 0, 62]} scale={6.0} />
      {/* removed: trees_large [4,0,62] — within intro clearance */}
      {/* removed: tree_A [-14,0,62] — within 10u of player start */}
      {/* removed: tree_B [14,0,62] — within intro clearance */}
      {/* removed: trees_medium [-24,0,62] — within 10u of player start */}
      <Piece model={DECORATION.trees_B_medium} position={[24, 0, 62]} scale={5.5} />
      <Piece model={DECORATION.trees_B_large} position={[0, 0, 66]} scale={6.5} />
      {/* removed: trees_large [-12,0,66] — within 10u of player start */}
      {/* removed: trees_large [12,0,66] — within intro clearance */}

      {/* ── dungeon-concert [-35, 0, 35]: Landmark (replaces old tower) ──
          Detail handled by ConcertZone() — stage at scale 7.0 serves as landmark */}

      {/* ── mage-kitchen [-48, 0, 5]: Landmark (replaces old tower) ──
          Detail handled by KitchenZone() function */}
    </group>
  )
}

// ============================================================================
// EXPLORATION AREAS — 6 themed terrain features between village and zones
// ============================================================================

function ExplorationAreas() {
  const d = 7.0
  return (
    <group name="exploration-areas">
      {/* ── Stargazer Hill (NE quadrant, far from center) ── */}
      <Piece model={DECORATION.hills_trees} position={[45, 0, -18]} scale={6.5} />
      <Piece model={DECORATION.hills_B_trees} position={[49, 0, -17]} scale={7.0} />
      <Piece model={DECORATION.rock_A} position={[43, 0, -15]} scale={5.0} />
      <Piece model={DECORATION.rock_C} position={[48, 0, -22]} scale={4.5} />
      <Piece model={DECORATION.rock_E} position={[51, 0, -15]} scale={4.0} />

      {/* ── Rocky Pass (N corridor, X=-10 to 10, Z=-30 to -48) ── */}
      {/* Rocks grow larger approaching the dungeon */}
      <Piece model={DECORATION.rock_A} position={[-8, 0, -32]} scale={3.5} />
      <Piece model={DECORATION.rock_B} position={[8, 0, -34]} scale={4.0} />
      <Piece model={DECORATION.hill_A} position={[-6, 0, -36]} scale={4.0} />
      <Piece model={DECORATION.rock_C} position={[8, 0, -36]} scale={4.5} />
      <Piece model={DECORATION.hill_B} position={[-9, 0, -36]} scale={5.0} />
      <Piece model={DECORATION.rock_D} position={[11, 0, -46]} scale={5.5} />
      <Piece model={DECORATION.hill_C} position={[-9, 0, -46]} scale={5.5} />
      <Piece model={DECORATION.rock_E} position={[8, 0, -46]} scale={6.0} />

      {/* ── Flower Meadow (W quadrant, X=-25 to -15, Z=5 to 20) ── */}
      <Piece model={DECORATION.flower_A} position={[-20, 0, 8]} scale={d} />
      <Piece model={DECORATION.flower_B} position={[-18, 0, 12]} scale={d} />
      <Piece model={DECORATION.flower_A} position={[-22, 0, 15]} scale={d} />
      <Piece model={DECORATION.flower_B} position={[-12, 0, 22]} scale={d} />
      <Piece model={DECORATION.trees_small} position={[-24, 0, 16]} scale={5.0} />
      <Piece model={DECORATION.tree_A} position={[-10, 0, 20]} scale={5.5} />
      <Piece model={DECORATION.hill_A} position={[-15, 0, 24]} scale={4.0} />

      {/* ── Training Grounds (E quadrant, X=25-35, Z=-5 to 10) ── */}
      <Piece model={DECORATION.haybale} position={[28, 0, -2]} scale={d} />
      <Piece model={DECORATION.haybale} position={[32, 0, -3]} scale={d} />
      <Piece model={DECORATION.target} position={[30, 0, -6]} rotation={[0, Math.PI / 4, 0]} scale={d} />
      <Piece model={DECORATION.target} position={[26, 0, 10]} rotation={[0, -Math.PI / 4, 0]} scale={d} />
      <Piece model={DECORATION.weaponrack} position={[34, 0, 0]} scale={d} />

      {/* ── Market Road (SE quadrant, X=15-25, Z=20-30) ── */}
      <Piece model={DECORATION.barrel} position={[18, 0, 26]} scale={d} />
      <Piece model={DECORATION.crate_A} position={[30, 0, 22]} scale={d} />
      <Piece model={DECORATION.sack} position={[24, 0, 31]} scale={d} />
      <Piece model={DECORATION.wheelbarrow} position={[14, 0, 30]} scale={d} />
      <Piece model={DECORATION.trough} position={[36, 0, 30]} scale={d} />

      {/* ── Extra scatter for variety ── */}
      <Piece model={DECORATION.hills_C_trees} position={[-18, 0, -22]} scale={5.0} />
      <Piece model={DECORATION.rock_B} position={[10, 0, 17]} scale={4.0} />
      <Piece model={DECORATION.trees_B_small} position={[-12, 0, 28]} scale={5.0} />
      <Piece model={DECORATION.hill_B} position={[30, 0, 15]} scale={4.5} />
      <Piece model={DECORATION.rock_D} position={[-28, 0, -15]} scale={4.0} />
    </group>
  )
}

// ============================================================================
// VILLAGE POND — Water feature between S and SE spokes
// ============================================================================

function VillagePond() {
  const pondCenter: [number, number, number] = [8, 0, 18]
  return (
    <group name="village-pond" position={pondCenter}>
      {/* Water hex tiles (slightly above ground to prevent z-fighting) */}
      <Piece model={TILES.water} position={[0, 0.02, 0]} />
      <Piece model={TILES.water} position={[1.5, 0.02, 0]} />
      <Piece model={TILES.water} position={[-1.5, 0.02, 0]} />
      {/* Coast border tiles */}
      <Piece model={TILES.coast_A} position={[0, 0.01, -1.8]} />
      <Piece model={TILES.coast_B} position={[1.5, 0.01, -1.5]} />
      <Piece model={TILES.coast_C} position={[-1.5, 0.01, -1.5]} />
      <Piece model={TILES.coast_D} position={[2.5, 0.01, 0.5]} />
      <Piece model={TILES.coast_E} position={[-2.5, 0.01, 0.5]} />
      {/* Water lilies and plants */}
      <Piece model={DECORATION.waterlily_A} position={[0.5, 0.05, 0.2]} scale={7.0} />
      <Piece model={DECORATION.waterlily_B} position={[-0.8, 0.05, -0.3]} scale={7.0} />
      <Piece model={DECORATION.waterplant_A} position={[1.8, 0.03, 0.5]} scale={7.0} />
      <Piece model={DECORATION.waterplant_B} position={[-1.8, 0.03, -0.2]} scale={7.0} />
      {/* Bridge crossing the pond */}
      <Piece model={BUILDINGS.bridge_A} position={[0, 0, 0.8]} rotation={[0, Math.PI / 2, 0]} scale={7.0} />
    </group>
  )
}

// ============================================================================
// ZONE APPROACH DECOR — Themed props near each zone entrance
// ============================================================================

function ZoneApproachDecor() {
  const d = 7.0

  // Helper: compute position along a spoke road at given distance from zone, with perpendicular offset
  const along = (target: [number, number], distFromZone: number, perpOffset: number): [number, number, number] => {
    const len = Math.sqrt(target[0] ** 2 + target[1] ** 2)
    const dx = target[0] / len
    const dz = target[1] / len
    const t = (len - distFromZone) / len
    return [target[0] * t + (-dz) * perpOffset, 0, target[1] * t + dx * perpOffset]
  }

  return (
    <group name="zone-approach-decor">
      {/* ── Space Zone (NE) — adventure/combat ── */}
      <Piece model={DECORATION.crate_A} position={along([38, -38], 20, -6)} scale={d} />
      <Piece model={DECORATION.target} position={along([38, -38], 20, 6)} scale={d} />
      <Piece model={DECORATION.barrel} position={along([38, -38], 8, -6)} scale={d} />
      <Piece model={DECORATION.bucket_arrows} position={along([38, -38], 8, 6)} scale={d} />
      {/* ── School Zone (E) — training ── */}
      <Piece model={DECORATION.haybale} position={along([48, 5], 20, -6)} scale={d} />
      <Piece model={DECORATION.target} position={along([48, 5], 20, 6)} scale={d} />
      <Piece model={DECORATION.bucket_arrows} position={along([48, 5], 22, -6)} scale={d} />
      <Piece model={DECORATION.crate_B} position={along([48, 5], 22, 6)} scale={d} />
      {/* ── Pizza Zone (SE) — delivery/food ── */}
      <Piece model={DECORATION.barrel} position={along([38, 38], 20, -6)} scale={d} />
      <Piece model={DECORATION.crate_A} position={along([38, 38], 20, 6)} scale={d} />
      <Piece model={DECORATION.sack} position={along([38, 38], 8, -6)} scale={d} />
      <Piece model={DECORATION.wheelbarrow} position={along([38, 38], 8, 6)} scale={d} />
      {/* ── Park Zone (S) — nature/picnic ── */}
      <Piece model={DECORATION.flower_A} position={[-7, 0, 35]} scale={d} />
      <Piece model={DECORATION.flower_B} position={[7, 0, 35]} scale={d} />
      <Piece model={DECORATION.trees_small} position={[-7, 0, 37]} scale={5.0} />
      <Piece model={DECORATION.rock_B} position={[7, 0, 37]} scale={5.0} />
      {/* ── Concert Zone (SW) — gathering/camp ── */}
      <Piece model={DECORATION.tent} position={along([-38, 38], 20, -6)} scale={d} />
      <Piece model={DECORATION.weaponrack} position={along([-38, 38], 20, 6)} scale={d} />
      <Piece model={DECORATION.barrel} position={along([-38, 38], 8, -6)} scale={d} />
      <Piece model={DECORATION.crate_B} position={along([-38, 38], 8, 6)} scale={d} />
      {/* ── Kitchen Zone (W) — cooking supplies ── */}
      <Piece model={DECORATION.sack} position={along([-48, 5], 20, -6)} scale={d} />
      <Piece model={DECORATION.bucket_water} position={along([-48, 5], 20, 6)} scale={d} />
      <Piece model={DECORATION.barrel} position={along([-48, 5], 22, -6)} scale={d} />
      <Piece model={DECORATION.crate_A} position={along([-48, 5], 22, 6)} scale={d} />
      {/* ── Dungeon approach (N boulevard) — flanking props on grass ── */}
      <Piece model={DECORATION.rock_C} position={[-7, 0, -50]} scale={5.0} />
      <Piece model={DECORATION.rock_D} position={[7, 0, -50]} scale={5.0} />
      <Piece model={DECORATION.hill_A} position={[-7, 0, -55]} scale={5.5} />
      <Piece model={DECORATION.hill_B} position={[7, 0, -55]} scale={5.5} />
      <Piece model={DECORATION.rock_E} position={[-7, 0, -60]} scale={6.0} />
      <Piece model={DECORATION.rock_A} position={[7, 0, -60]} scale={6.0} />
    </group>
  )
}

// ============================================================================
// JUNCTION PLAZAS — Decorated intersections where spokes meet ring road
// ============================================================================

function JunctionPlazas() {
  const junctions: [number, number, number][] = [
    [40, 0, -29],   // NE
    [49, 0, 10],    // E
    [29, 0, 40],    // SE
    [-29, 0, 40],   // SW
    // W junction [-49, 0, 10] omitted — inside kitchen zone
  ]

  return (
    <group name="junction-plazas">
      {junctions.map((pos, i) => (
        <group key={`junction-${i}`} position={pos}>
          <Piece model={DECORATION.street_lantern} position={[-3, 0, 0]} scale={1.5} />
          <Piece model={DECORATION.street_lantern} position={[3, 0, 0]} scale={1.5} />
          <Piece model={DECORATION.barrel} position={[2, 0, 2]} scale={7.0} />
        </group>
      ))}
    </group>
  )
}

// ============================================================================
// VILLAGE ATMOSPHERE — Global lighting and effects
// ============================================================================

function VillageAtmosphere() {
  return (
    <>
      {/* Solid sky-blue background */}
      <color attach="background" args={['#87CEEB']} />

      {/* Fog — matches sky blue so edges blend into the sky */}
      <fog attach="fog" args={['#87CEEB', 150, 400]} />

      {/* Hemisphere light — warm village afternoon */}
      <hemisphereLight
        color="#87CEEB"
        groundColor="#556B2F"
        intensity={0.8}
      />

      {/* Main directional light (sun) — fixed at 2 PM */}
      <directionalLight
        color="#fff8e0"
        intensity={1.5}
        position={[-20, 25, 10]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-130}
        shadow-camera-right={130}
        shadow-camera-top={130}
        shadow-camera-bottom={-130}
        shadow-camera-far={300}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        color="#aaccff"
        intensity={0.3}
        position={[-8, 5, -5]}
      />


      <VillageClouds />
    </>
  )
}

/** Clouds auto-hide when camera rises above them (e.g. during intro Act 3 logo reveal) */
function VillageClouds() {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.visible = camera.position.y < 95
    }
  })
  return (
    <group ref={groupRef}>
      <Clouds limit={400} material={THREE.MeshBasicMaterial}>
        {/* ── Main cloud layer (y≈60-80) — camera flies through this ── */}
        <Cloud
          seed={1}
          segments={22}
          bounds={[45, 8, 35] as [number, number, number]}
          volume={10}
          growth={6}
          color="#ffffff"
          opacity={0.9}
          speed={0.08}
          position={[0, 65, 0] as [number, number, number]}
        />
        <Cloud
          seed={7}
          segments={18}
          bounds={[28, 6, 40] as [number, number, number]}
          volume={8}
          growth={4}
          color="#ffffff"
          opacity={0.85}
          speed={0.06}
          position={[-30, 70, -20] as [number, number, number]}
        />
        <Cloud
          seed={13}
          segments={16}
          bounds={[38, 5, 22] as [number, number, number]}
          volume={7}
          growth={5}
          color="#ffffff"
          opacity={0.85}
          speed={0.1}
          position={[25, 68, 15] as [number, number, number]}
        />
        <Cloud
          seed={29}
          segments={14}
          bounds={[20, 5, 30] as [number, number, number]}
          volume={6}
          growth={4}
          color="#ffffff"
          opacity={0.8}
          speed={0.07}
          position={[40, 75, -40] as [number, number, number]}
        />
        <Cloud
          seed={42}
          segments={15}
          bounds={[32, 4, 18] as [number, number, number]}
          volume={6}
          growth={5}
          color="#ffffff"
          opacity={0.8}
          speed={0.09}
          position={[-40, 72, 30] as [number, number, number]}
        />
        <Cloud
          seed={53}
          segments={12}
          bounds={[22, 5, 28] as [number, number, number]}
          volume={5}
          growth={3}
          color="#ffffff"
          opacity={0.75}
          speed={0.05}
          position={[15, 74, -50] as [number, number, number]}
        />
        <Cloud
          seed={67}
          segments={10}
          bounds={[18, 4, 24] as [number, number, number]}
          volume={5}
          growth={4}
          color="#ffffff"
          opacity={0.75}
          speed={0.07}
          position={[-50, 67, -10] as [number, number, number]}
        />
        {/* ── Wispy high clouds above the main layer ── */}
        <Cloud
          seed={81}
          segments={8}
          bounds={[18, 3, 8] as [number, number, number]}
          volume={4}
          growth={6}
          color="#ffffff"
          opacity={0.5}
          speed={0.05}
          position={[0, 90, -30] as [number, number, number]}
        />
        <Cloud
          seed={97}
          segments={8}
          bounds={[10, 2, 16] as [number, number, number]}
          volume={3}
          growth={5}
          color="#ffffff"
          opacity={0.5}
          speed={0.04}
          position={[-30, 85, 20] as [number, number, number]}
        />
      </Clouds>
    </group>
  )
}

// ============================================================================
// DEBUG: COLLISION BOX VISUALIZER — toggle with . (period) key
// Shows auto-measured bounding boxes from collision registry
// ============================================================================

function DebugStageGrids() {
  const [visible, setVisible] = useState(false)

  const toggle = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Slash') setVisible(v => !v)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', toggle)
    return () => window.removeEventListener('keydown', toggle)
  }, [toggle])

  if (!visible) return null

  return (
    <group name="debug-stage-grids">
      {Object.keys(ZONE_CENTERS).map(zoneId => (
        <StageFloor key={zoneId} zoneId={zoneId} />
      ))}
    </group>
  )
}

function DebugClearanceRings() {
  const [visible, setVisible] = useState(false)

  const toggle = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Period') setVisible(v => !v)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', toggle)
    return () => window.removeEventListener('keydown', toggle)
  }, [toggle])

  if (!visible) return null

  return <DebugCollisionBoxes />
}

function DebugCollisionBoxes() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const lastGenRef = useRef(-1)

  const [geo] = useState(() => new THREE.PlaneGeometry(1, 1))
  const [mat] = useState(() => new THREE.MeshBasicMaterial({
    color: 0xff3333,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    depthWrite: false,
  }))

  useFrame(() => {
    if (!meshRef.current) return
    const gen = getGeneration()
    if (gen === lastGenRef.current) return
    lastGenRef.current = gen

    const boxes = getCollisionBoxes()
    const count = Math.min(boxes.length, 2000)
    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      const box = boxes[i]
      dummy.position.set(box.cx, 0.15, box.cz)
      dummy.rotation.set(-Math.PI / 2, 0, 0)
      dummy.scale.set(box.halfW * 2, box.halfD * 2, 1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.count = count
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geo, mat, 2000]} />
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VillageWorld() {
  return (
    <group name="village-world">
      {/* Global atmosphere (replaces per-task TaskAtmosphere) */}
      <VillageAtmosphere />

      {/* Hex tile terrain */}
      <Suspense fallback={null}>
        <HexTerrain />
      </Suspense>

      {/* Village center buildings */}
      <Suspense fallback={null}>
        <VillageCenter />
      </Suspense>

      {/* Perimeter mountains and trees */}
      <Suspense fallback={null}>
        <VillagePerimeter />
      </Suspense>

      {/* Dense forest ring hiding world edges */}
      <Suspense fallback={null}>
        <ImpenetrableForest />
      </Suspense>

      {/* 3 rows of trees along each world edge */}
      <Suspense fallback={null}>
        <TreeBorder />
      </Suspense>

      {/* Cliff bowl enclosing the dungeon */}
      <Suspense fallback={null}>
        <DungeonCliffs />
      </Suspense>

      {/* Zone landmarks — tall colored buildings per zone */}
      <Suspense fallback={null}>
        <ZoneLandmarks />
      </Suspense>


      {/* Road decoration (lanterns, flags, props) */}
      <Suspense fallback={null}>
        <RoadDecoration />
      </Suspense>

      {/* Exploration areas — 6 themed terrain features between village and zones */}
      <Suspense fallback={null}>
        <ExplorationAreas />
      </Suspense>

      {/* Junction plazas — decorated spoke-ring intersections */}
      <Suspense fallback={null}>
        <JunctionPlazas />
      </Suspense>

      {/* Village pond — water feature */}
      <Suspense fallback={null}>
        <VillagePond />
      </Suspense>

      {/* Zone approach decorations — themed props near entrances */}
      <Suspense fallback={null}>
        <ZoneApproachDecor />
      </Suspense>

      {/* Quest zone: Dungeon (north) */}
      <Suspense fallback={null}>
        <DungeonZone />
      </Suspense>

      {/* Quest zone: Park (south) */}
      <Suspense fallback={null}>
        <ParkZone />
      </Suspense>

      {/* Quest zone: Space Station (northeast) */}
      <Suspense fallback={null}>
        <SpaceZone />
      </Suspense>

      {/* Quest zone: School (east) */}
      <Suspense fallback={null}>
        <SchoolZone />
      </Suspense>

      {/* Quest zone: Pizza Shop (southeast) */}
      <Suspense fallback={null}>
        <PizzaZone />
      </Suspense>

      {/* Quest zone: Concert Hall (southwest) */}
      <Suspense fallback={null}>
        <ConcertZone />
      </Suspense>

      {/* Quest zone: Kitchen (west) */}
      <Suspense fallback={null}>
        <KitchenZone />
      </Suspense>

      {/* Quest zone circles — glowing ground rings at each zone entrance */}
      {Object.entries(ZONE_CENTERS).map(([zoneId, center]) => {
        const meta = ZONE_META[zoneId]
        if (!meta) return null
        return (
          <QuestZoneCircle
            key={zoneId}
            zoneId={zoneId}
            position={center}
            label={meta.label}
            emoji={meta.emoji}
            color={meta.color}
          />
        )
      })}

      {/* Debug: stage grids at all zones — press / to toggle */}
      <DebugStageGrids />
      {/* Debug: collision radius rings — press . to toggle */}
      <DebugClearanceRings />
    </group>
  )
}
