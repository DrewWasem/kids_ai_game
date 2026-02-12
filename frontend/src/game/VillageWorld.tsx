/**
 * VillageWorld — Persistent medieval village with quest zones.
 *
 * Renders a hex-tile village connecting quest zones. The village is always
 * visible. Zones are areas within it hosting different quests.
 *
 * Layout (top-down, circular ring at radius ~35):
 *   North (Z=-55):     Dungeon Zone (skeleton-birthday) — reached via canyon pass
 *   Northeast:         Space Zone (knight-space)
 *   East (X=+35):      School Zone (barbarian-school)
 *   Southeast:         Pizza Zone (skeleton-pizza)
 *   South (Z=+35):     Park Zone (adventurers-picnic)
 *   Southwest:         Concert Zone (dungeon-concert)
 *   West (X=-35):      Kitchen Zone (mage-kitchen)
 *   Center (Z=0):      Village Center (tavern, market, well, etc.)
 *
 * Uses KayKit Medieval Hexagon Pack for terrain + buildings,
 * plus existing task environment pieces offset to zone positions.
 */

import { memo, useMemo, Suspense } from 'react'
import { useGLTF, Sky, Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'
import { ASSET_BASE } from '../data/asset-manifest'
import { ZONE_CENTERS, ZONE_META } from '../stores/gameStore'
import { QuestZoneCircle } from './QuestZoneCircle'

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
  grass: HEX + 'tiles/base/hex_grass.gltf',
  road_A: HEX + 'tiles/roads/hex_road_A.gltf',
  road_B: HEX + 'tiles/roads/hex_road_B.gltf',
  road_C: HEX + 'tiles/roads/hex_road_C.gltf',
  road_D: HEX + 'tiles/roads/hex_road_D.gltf',
  water: HEX + 'tiles/base/hex_water.gltf',
  coast_A: HEX + 'tiles/coast/hex_coast_A.gltf',
  coast_B: HEX + 'tiles/coast/hex_coast_B.gltf',
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
  flag_blue: HEX + 'decoration/props/flag_blue.gltf',
  flag_red: HEX + 'decoration/props/flag_red.gltf',
  weaponrack: HEX + 'decoration/props/weaponrack.gltf',
  wheelbarrow: HEX + 'decoration/props/wheelbarrow.gltf',
  sack: HEX + 'decoration/props/sack.gltf',
  bucket_water: HEX + 'decoration/props/bucket_water.gltf',
  trough: HEX + 'decoration/props/trough.gltf',
  target: HEX + 'decoration/props/target.gltf',
}

// ============================================================================
// REUSABLE PIECE COMPONENT
// ============================================================================

interface PieceProps {
  model: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

const Piece = memo(({ model, position, rotation, scale = 1 }: PieceProps) => {
  const { scene } = useGLTF(ASSET_BASE + model)

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

  return (
    <group position={position} rotation={rotation || [0, 0, 0]} scale={scaleArr}>
      <primitive object={cloned} />
    </group>
  )
})
Piece.displayName = 'Piece'

// ============================================================================
// HEX TERRAIN — Grass tiles covering the village area
// ============================================================================

function HexTerrain() {
  // Generate a grid of hex tiles covering the village area
  const tiles = useMemo(() => {
    const result: { model: string; position: [number, number, number]; rotation?: [number, number, number] }[] = []

    // Road tiles — 3 columns wide (col -1, 0, +1) for a visible road
    // Extended north to row -36 (Z≈-62) to reach the relocated dungeon
    // Ends at row 18 (Z≈31) so road stops before the Park Zone at Z=35
    const roadCols = new Set([-1, 0, 1])
    const roadRows = new Set<string>()
    for (let row = -36; row <= 18; row++) {
      for (const col of roadCols) {
        roadRows.add(`${col},${row}`)
        const pos = hexToWorld(col, row)
        // Use different road pieces for variety
        const model = col === 0 ? TILES.road_A : TILES.road_B
        result.push({ model, position: pos })
      }
    }

    // Wide grass area — extended to cover perimeter forest + mountain ring
    for (let col = -45; col <= 45; col++) {
      for (let row = -55; row <= 50; row++) {
        if (roadRows.has(`${col},${row}`)) continue // Road already placed
        const pos = hexToWorld(col, row)
        result.push({ model: TILES.grass, position: pos })
      }
    }

    return result
  }, [])

  return (
    <group name="hex-terrain">
      {tiles.map((tile, i) => (
        <Piece key={`tile-${i}`} model={tile.model} position={tile.position} rotation={tile.rotation} />
      ))}
    </group>
  )
}

// ============================================================================
// VILLAGE CENTER — Buildings, decoration, atmosphere
// ============================================================================

function VillageCenter() {
  // Scale 7.0 = buildings at real-world proportions vs character (2.61u tall)
  // Townhall: 14.6u (5.6x char), Home_A: 5.9u (2.3x char), Stables: 4.3u (1.6x char)
  const s = 7.0
  // Decoration props need same scale to match buildings (hex props are strategy-game scale)
  const d = 7.0
  return (
    <group name="village-center" position={[0, 0, 0]}>
      {/* Town hall — center-right, biggest building and focal point */}
      <Piece model={BUILDINGS.townhall} position={[18, 0, -5]} rotation={[0, -Math.PI / 2, 0]} scale={s * 1.1} />

      {/* Tavern — left of center */}
      <Piece model={BUILDINGS.tavern} position={[-18, 0, -7]} rotation={[0, Math.PI / 4, 0]} scale={s} />

      {/* Market stall — right side, facing road */}
      <Piece model={BUILDINGS.market} position={[14, 0, 9]} rotation={[0, -Math.PI / 3, 0]} scale={s} />

      {/* Well — village square center */}
      <Piece model={BUILDINGS.well} position={[-8, 0, 2]} scale={s} />

      {/* Blacksmith — left side */}
      <Piece model={BUILDINGS.blacksmith} position={[-24, 0, 7]} rotation={[0, Math.PI / 2, 0]} scale={s} />

      {/* Homes — spread around the village */}
      <Piece model={BUILDINGS.home_A} position={[24, 0, -12]} rotation={[0, -Math.PI / 2, 0]} scale={s} />
      <Piece model={BUILDINGS.home_B} position={[-24, 0, -10]} rotation={[0, Math.PI / 3, 0]} scale={s} />
      <Piece model={BUILDINGS.home_A} position={[-28, 0, 14]} rotation={[0, Math.PI / 6, 0]} scale={s * 0.9} />
      <Piece model={BUILDINGS.home_B} position={[28, 0, 12]} rotation={[0, -Math.PI / 6, 0]} scale={s * 0.9} />

      {/* Church — right side, tall spire visible from afar */}
      <Piece model={BUILDINGS.church} position={[28, 0, 2]} rotation={[0, -Math.PI / 2, 0]} scale={s * 1.1} />

      {/* Windmill — left, tall and distinctive */}
      <Piece model={BUILDINGS.windmill} position={[-30, 0, 0]} rotation={[0, Math.PI / 6, 0]} scale={s * 1.1} />

      {/* Stables — near the road */}
      <Piece model={BUILDINGS.stables} position={[10, 0, -12]} rotation={[0, 0, 0]} scale={s} />

      {/* Watchtower — far right, guards the village */}
      <Piece model={BUILDINGS.watchtower} position={[32, 0, -8]} rotation={[0, -Math.PI / 4, 0]} scale={s} />

      {/* Stage — near the center for performances */}
      <Piece model={BUILDINGS.stage_A} position={[-6, 0, -10]} scale={s * 0.8} />

      {/* Decoration props at matching scale */}
      <Piece model={DECORATION.barrel} position={[-12, 0, -2]} scale={d} />
      <Piece model={DECORATION.crate_A} position={[8, 0, 2]} scale={d} />
      <Piece model={DECORATION.haybale} position={[-12, 0, 12]} scale={d} />
      <Piece model={DECORATION.wheelbarrow} position={[6, 0, -7]} scale={d} />
      <Piece model={DECORATION.sack} position={[-9, 0, 7]} scale={d} />
      <Piece model={DECORATION.bucket_water} position={[-6, 0, 1]} scale={d} />
      <Piece model={DECORATION.trough} position={[6, 0, 6]} scale={d} />
      <Piece model={DECORATION.flag_blue} position={[2, 0, -12]} scale={d} />

      {/* Trees around the village edges — also scaled up */}
      <Piece model={DECORATION.tree_A} position={[-32, 0, -2]} scale={d} />
      <Piece model={DECORATION.tree_B} position={[32, 0, -2]} scale={d} />
      <Piece model={DECORATION.trees_small} position={[-30, 0, 12]} scale={d * 0.8} />
      <Piece model={DECORATION.trees_small} position={[30, 0, -10]} scale={d * 0.8} />
      <Piece model={DECORATION.tree_A} position={[-18, 0, -14]} scale={d * 0.9} />
      <Piece model={DECORATION.tree_B} position={[20, 0, 15]} scale={d * 0.9} />
    </group>
  )
}

// ============================================================================
// PERIMETER — Mountains, trees, hills around the village edges
// ============================================================================

function VillagePerimeter() {
  // Perimeter pushed far out for the 7x-scale village (~65u wide)
  // North mountains pushed to Z=-80+ to sit behind the dungeon cliff bowl
  return (
    <group name="village-perimeter">
      {/* Mountains — large backdrop ring */}
      {/* North backdrop — pushed behind dungeon cliff bowl */}
      <Piece model={DECORATION.mountain_A} position={[0, 0, -85]} scale={10.0} />
      <Piece model={DECORATION.mountain_B} position={[-35, 0, -82]} scale={8.0} />
      <Piece model={DECORATION.mountain_A} position={[35, 0, -82]} scale={9.0} />
      <Piece model={DECORATION.mountain_C} position={[-55, 0, -75]} rotation={[0, Math.PI / 5, 0]} scale={8.0} />
      <Piece model={DECORATION.mountain_C} position={[55, 0, -75]} rotation={[0, -Math.PI / 5, 0]} scale={8.0} />
      {/* East/west flanks */}
      <Piece model={DECORATION.mountain_C} position={[65, 0, -20]} rotation={[0, Math.PI / 4, 0]} scale={8.0} />
      <Piece model={DECORATION.mountain_C} position={[-65, 0, -20]} rotation={[0, -Math.PI / 3, 0]} scale={7.5} />
      <Piece model={DECORATION.mountain_A} position={[65, 0, 10]} rotation={[0, Math.PI / 6, 0]} scale={8.5} />
      <Piece model={DECORATION.mountain_B} position={[-65, 0, 10]} rotation={[0, -Math.PI / 5, 0]} scale={7.0} />
      <Piece model={DECORATION.mountain_A} position={[-60, 0, -40]} rotation={[0, Math.PI / 5, 0]} scale={9.0} />
      <Piece model={DECORATION.mountain_B} position={[60, 0, -40]} rotation={[0, -Math.PI / 6, 0]} scale={8.0} />
      {/* South backdrop */}
      <Piece model={DECORATION.mountain_A} position={[-55, 0, 30]} scale={7.0} />
      <Piece model={DECORATION.mountain_B} position={[55, 0, 40]} scale={8.0} />
      <Piece model={DECORATION.mountain_B} position={[-50, 0, 65]} scale={7.0} />
      <Piece model={DECORATION.mountain_A} position={[50, 0, 70]} scale={8.0} />
      <Piece model={DECORATION.mountain_B} position={[0, 0, 75]} scale={9.0} />
      <Piece model={DECORATION.mountain_C} position={[-40, 0, 72]} rotation={[0, Math.PI / 3, 0]} scale={8.0} />

      {/* Hills — medium distance ring (pushed away from zone centers) */}
      <Piece model={DECORATION.hills_trees} position={[45, 0, 30]} scale={6.0} />
      <Piece model={DECORATION.hill_A} position={[-38, 0, 45]} scale={5.0} />
      <Piece model={DECORATION.hills_trees} position={[-50, 0, 5]} scale={6.0} />
      <Piece model={DECORATION.hill_A} position={[50, 0, -5]} scale={5.0} />
      <Piece model={DECORATION.hill_C} position={[48, 0, 38]} scale={5.0} />
      <Piece model={DECORATION.hills_B_trees} position={[-48, 0, 50]} scale={6.0} />
      <Piece model={DECORATION.hill_B} position={[45, 0, 55]} scale={5.5} />
      <Piece model={DECORATION.hill_A} position={[50, 0, -20]} scale={5.5} />
      <Piece model={DECORATION.hills_trees} position={[-55, 0, -12]} scale={6.0} />
      <Piece model={DECORATION.hills_B_trees} position={[25, 0, 58]} scale={5.5} />

      {/* Dense tree clusters — pushed behind zone areas */}
      <Piece model={DECORATION.trees_medium} position={[42, 0, 45]} scale={6.0} />
      <Piece model={DECORATION.trees_B_large} position={[-42, 0, 38]} scale={6.0} />
      <Piece model={DECORATION.trees_medium} position={[40, 0, -35]} scale={6.0} />
      <Piece model={DECORATION.trees_large} position={[-50, 0, -10]} scale={6.0} />
      <Piece model={DECORATION.trees_B_large} position={[50, 0, 10]} scale={6.0} />
      <Piece model={DECORATION.trees_large} position={[-32, 0, 55]} scale={5.0} />

      {/* Rocks scattered around edges (away from zones) */}
      <Piece model={DECORATION.rock_B} position={[38, 0, 42]} scale={7.0} />
      <Piece model={DECORATION.rock_A} position={[-32, 0, 58]} scale={6.0} />
      <Piece model={DECORATION.rock_D} position={[-45, 0, 42]} scale={5.5} />
      <Piece model={DECORATION.rock_D} position={[50, 0, 18]} scale={5.0} />
      <Piece model={DECORATION.rock_E} position={[-50, 0, 25]} scale={5.5} />
      <Piece model={DECORATION.rock_A} position={[15, 0, 60]} scale={6.0} />
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

  // Skip trees in north/south road corridors
  // North corridor wider (~58°) because scale-7 trees are huge and crowd the dungeon road
  const isInCorridor = (angle: number): boolean => {
    const north = 3 * Math.PI / 2  // 270° = negative Z direction
    const south = Math.PI / 2       // 90° = positive Z direction
    const northHalf = 0.50           // ~29° each side → ~58° corridor (wide for dungeon road)
    const southHalf = 0.26           // ~15° each side → ~30° corridor
    const normalize = (a: number) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const a = normalize(angle)
    const diffN = Math.abs(a - north)
    const diffS = Math.abs(a - south)
    return Math.min(diffN, 2 * Math.PI - diffN) < northHalf
        || Math.min(diffS, 2 * Math.PI - diffS) < southHalf
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

    // === Inner ring (R=38-42): Pulled back from village buildings (outermost at R=33) ===
    const innerAngles = 14
    for (let i = 0; i < innerAngles; i++) {
      const angle = (i / innerAngles) * Math.PI * 2 + 0.2
      if (isInCorridor(angle)) continue
      const r = 38 + (i % 3) * 2.0
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (isNearZone(x, z)) continue
      result.push({
        model: pick(i, [DECORATION.trees_large, DECORATION.trees_B_large, DECORATION.trees_medium, DECORATION.tree_A]),
        position: [x, 0, z],
        rotation: [0, rot(i), 0],
        scale: 7.0 + (i % 3) * 0.5,
      })
    }

    // === Middle ring (R=38-48): Dense forest wall — the main barrier ===
    const midAngles = 20
    for (let i = 0; i < midAngles; i++) {
      const angle = (i / midAngles) * Math.PI * 2
      if (isInCorridor(angle)) continue
      const r = 38 + (i % 4) * 3
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (isNearZone(x, z)) continue
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
        if (!isNearZone(x2, z2)) {
          result.push({
            model: pick(i + 7, treeModels),
            position: [x2, 0, z2],
            rotation: [0, rot(i + 100), 0],
            scale: 7.0 + (i % 3) * 0.8,
          })
        }
      }
    }

    // === Outer ring (R=50-62): Sparse large trees behind mountains ===
    const outerAngles = 16
    for (let i = 0; i < outerAngles; i++) {
      const angle = (i / outerAngles) * Math.PI * 2 + 0.3
      if (isInCorridor(angle)) continue
      const r = 52 + (i % 3) * 4
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (isNearZone(x, z)) continue
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
// DUNGEON CLIFFS — Mountain/cliff bowl enclosing the dungeon from all sides
// ============================================================================

function DungeonCliffs() {
  // Cliff bowl wraps tight around the dungeon (centered at Z=-55)
  // Open only at the south (Z≈-45) where the road enters
  return (
    <group name="dungeon-cliffs">
      {/* ── Back wall (north, behind dungeon Z=-68 to -72) ── */}
      <Piece model={DECORATION.mountain_A} position={[0, 0, -72]} scale={13.0} />
      <Piece model={DECORATION.mountain_B} position={[-18, 0, -70]} scale={11.0} />
      <Piece model={DECORATION.mountain_C} position={[18, 0, -70]} scale={11.0} />
      <Piece model={DECORATION.hill_C} position={[-9, 0, -68]} scale={9.0} />
      <Piece model={DECORATION.hill_A} position={[9, 0, -68]} scale={9.0} />
      <Piece model={DECORATION.rock_C} position={[-4, 0, -67]} scale={7.0} />
      <Piece model={DECORATION.rock_D} position={[4, 0, -67]} scale={7.0} />

      {/* ── Left wall (west, X=-18 to -28) ── */}
      <Piece model={DECORATION.mountain_A} position={[-25, 0, -64]} rotation={[0, Math.PI / 4, 0]} scale={11.0} />
      <Piece model={DECORATION.mountain_C} position={[-28, 0, -58]} rotation={[0, Math.PI / 3, 0]} scale={10.0} />
      <Piece model={DECORATION.hill_B} position={[-26, 0, -52]} scale={9.0} />
      <Piece model={DECORATION.rock_A} position={[-22, 0, -49]} scale={8.0} />
      <Piece model={DECORATION.hills_trees} position={[-20, 0, -60]} scale={9.0} />
      <Piece model={DECORATION.rock_E} position={[-18, 0, -46]} scale={7.5} />

      {/* ── Right wall (east, X=+18 to +28) ── */}
      <Piece model={DECORATION.mountain_B} position={[25, 0, -64]} rotation={[0, -Math.PI / 4, 0]} scale={11.0} />
      <Piece model={DECORATION.mountain_C} position={[28, 0, -58]} rotation={[0, -Math.PI / 3, 0]} scale={10.0} />
      <Piece model={DECORATION.hill_A} position={[26, 0, -52]} scale={9.0} />
      <Piece model={DECORATION.rock_B} position={[22, 0, -49]} scale={8.0} />
      <Piece model={DECORATION.hills_B_trees} position={[20, 0, -60]} scale={9.0} />
      <Piece model={DECORATION.rock_D} position={[18, 0, -46]} scale={7.5} />

      {/* ── Approach cliffs (Z=-27 to Z=-45) — flanking the path from village to dungeon ── */}
      {/* Left side — starts small, grows toward dungeon */}
      <Piece model={DECORATION.rock_C} position={[-8, 0, -27]} scale={4.5} />
      <Piece model={DECORATION.rock_A} position={[-10, 0, -30]} scale={5.0} />
      <Piece model={DECORATION.hill_A} position={[-11, 0, -34]} scale={5.0} />
      <Piece model={DECORATION.rock_E} position={[-9, 0, -37]} scale={5.5} />
      <Piece model={DECORATION.hill_C} position={[-12, 0, -40]} scale={5.5} />
      <Piece model={DECORATION.rock_A} position={[-13, 0, -43]} scale={6.0} />
      <Piece model={DECORATION.hill_C} position={[-16, 0, -46]} scale={5.5} />

      {/* Right side — mirrors left */}
      <Piece model={DECORATION.rock_D} position={[8, 0, -27]} scale={4.5} />
      <Piece model={DECORATION.rock_B} position={[10, 0, -30]} scale={5.0} />
      <Piece model={DECORATION.hill_B} position={[11, 0, -34]} scale={5.0} />
      <Piece model={DECORATION.rock_C} position={[9, 0, -37]} scale={5.5} />
      <Piece model={DECORATION.hill_A} position={[12, 0, -40]} scale={5.5} />
      <Piece model={DECORATION.rock_B} position={[13, 0, -43]} scale={6.0} />
      <Piece model={DECORATION.hill_B} position={[16, 0, -46]} scale={5.5} />

      {/* Entrance narrows — boulders where approach meets the bowl */}
      <Piece model={DECORATION.rock_A} position={[-12, 0, -45]} scale={6.5} />
      <Piece model={DECORATION.rock_B} position={[12, 0, -45]} scale={6.5} />

      {/* ── Trees on cliff tops for silhouette ── */}
      <Piece model={DECORATION.tree_A} position={[-22, 0, -66]} scale={10.0} />
      <Piece model={DECORATION.tree_B} position={[22, 0, -66]} scale={10.0} />
      <Piece model={DECORATION.tree_A} position={[-30, 0, -56]} scale={9.0} />
      <Piece model={DECORATION.tree_B} position={[30, 0, -56]} scale={9.0} />
      <Piece model={DECORATION.tree_A} position={[0, 0, -74]} scale={10.0} />
      <Piece model={DECORATION.tree_B} position={[-12, 0, -72]} scale={9.0} />
      <Piece model={DECORATION.tree_A} position={[12, 0, -72]} scale={9.0} />
    </group>
  )
}

// ============================================================================
// DUNGEON ZONE — Northern area (skeleton-birthday quest)
// ============================================================================

function DungeonZone() {
  const center = ZONE_CENTERS['skeleton-birthday']

  return (
    <group name="dungeon-zone" position={center}>
      {/* ── Expanded dungeon courtyard — larger footprint ── */}

      {/* Back wall (wider, spanning -8 to +8) */}
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-8, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-6, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-4, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-2, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_doorway.gltf" position={[0, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[2, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[4, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[6, 0, -8]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[8, 0, -8]} />

      {/* Left side wall */}
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-9, 0, -6]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-9, 0, -4]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-9, 0, -2]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-9, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Right side wall */}
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[9, 0, -6]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[9, 0, -4]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[9, 0, -2]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[9, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Decorated pillars — entrance and interior */}
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[-9, 0, 2]} scale={1.3} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[9, 0, 2]} scale={1.3} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[-5, 0, -2]} scale={1.0} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[5, 0, -2]} scale={1.0} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[-5, 0, -6]} scale={1.0} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[5, 0, -6]} scale={1.0} />

      {/* Floor tiles — expanded grid covering the full courtyard */}
      {[-6, -4, -2, 0, 2, 4, 6].map(x =>
        [-6, -4, -2, 0, 2].map(z => (
          <Piece key={`floor-${x}-${z}`} model="kaykit/packs/dungeon/floor_tile_large.gltf" position={[x, 0.01, z]} />
        ))
      )}

      {/* Torches along the walls */}
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[-8, 0, -6]} />
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[8, 0, -6]} />
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[-8, 0, -2]} />
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[8, 0, -2]} />
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[-4, 0, -7.5]} />
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[4, 0, -7.5]} />

      {/* Props — barrels, chests, crates */}
      <Piece model="kaykit/packs/dungeon/barrel_large.gltf" position={[-8, 0, 0]} scale={0.4} />
      <Piece model="kaykit/packs/dungeon/barrel_small.gltf" position={[-7.5, 0, 0.8]} scale={0.5} />
      <Piece model="kaykit/packs/dungeon/barrel_small.gltf" position={[-7, 0, 0.3]} scale={0.5} />
      <Piece model="kaykit/packs/dungeon/barrel_large.gltf" position={[8, 0, -1]} scale={0.4} />
      <Piece model="kaykit/packs/dungeon/barrel_small.gltf" position={[7.5, 0, -0.3]} scale={0.5} />
      <Piece model="kaykit/packs/dungeon/chest_large_gold.gltf" position={[7, 0, -7]} rotation={[0, Math.PI, 0]} scale={0.35} />
      <Piece model="kaykit/packs/dungeon/chest_gold.gltf" position={[-7, 0, -7]} scale={0.4} />
      <Piece model="kaykit/packs/dungeon/chest_gold.gltf" position={[6, 0, 1]} scale={0.4} />

      {/* Banners across the back wall */}
      <Piece model="kaykit/packs/dungeon/banner_patternA_blue.gltf" position={[-6, 1.5, -7.8]} scale={0.7} />
      <Piece model="kaykit/packs/dungeon/banner_patternB_red.gltf" position={[-2, 1.5, -7.8]} scale={0.7} />
      <Piece model="kaykit/packs/dungeon/banner_patternA_green.gltf" position={[2, 1.5, -7.8]} scale={0.7} />
      <Piece model="kaykit/packs/dungeon/banner_patternB_red.gltf" position={[6, 1.5, -7.8]} scale={0.7} />

      {/* Torch glow — warm orange light */}
      <pointLight color="#ff6600" intensity={3} distance={12} decay={2} position={[-7, 3, -5]} />
      <pointLight color="#ff6600" intensity={3} distance={12} decay={2} position={[7, 3, -5]} />
      <pointLight color="#ff4400" intensity={2} distance={10} decay={2} position={[0, 3, -7]} />
      <pointLight color="#ff6600" intensity={2} distance={10} decay={2} position={[0, 2, 0]} />

      {/* Approach decoration — entrance markers (hex props at 7x) */}
      <Piece model={DECORATION.flag_red} position={[-8, 0, 4]} scale={7.0} />
      <Piece model={DECORATION.flag_red} position={[8, 0, 4]} scale={7.0} />
      <Piece model={DECORATION.weaponrack} position={[-6, 0, 3]} scale={7.0} />
      <Piece model={DECORATION.target} position={[6, 0, 3]} scale={7.0} />
    </group>
  )
}

// ============================================================================
// PARK ZONE — Southern area (adventurers-picnic quest)
// ============================================================================

function ParkZone() {
  const center = ZONE_CENTERS['adventurers-picnic']
  const ts = 0.8 // tree scale — smaller than close-up view

  return (
    <group name="park-zone" position={center}>
      {/* Tree ring (scaled down from original scene - these are viewed from above now) */}
      <Piece model="tiny-treats/pretty-park/tree_large.gltf" position={[-6, 0, -4]} scale={ts} />
      <Piece model={DECORATION.tree_A} position={[-4, 0, -5]} scale={0.9} />
      <Piece model="tiny-treats/pretty-park/tree.gltf" position={[-2, 0, -6]} scale={ts} />
      <Piece model={DECORATION.tree_B} position={[0, 0, -6]} scale={0.9} />
      <Piece model="tiny-treats/pretty-park/tree_large.gltf" position={[2, 0, -5.5]} scale={ts} />
      <Piece model={DECORATION.tree_A} position={[4, 0, -5]} scale={0.9} />
      <Piece model="tiny-treats/pretty-park/tree.gltf" position={[6, 0, -3]} scale={ts} />
      <Piece model={DECORATION.tree_B} position={[7, 0, 0]} scale={0.9} />
      <Piece model="tiny-treats/pretty-park/tree_large.gltf" position={[-7, 0, 0]} scale={ts} />

      {/* Bushes */}
      <Piece model="tiny-treats/pretty-park/bush.gltf" position={[-5, 0, -3]} scale={0.8} />
      <Piece model="tiny-treats/pretty-park/bush_large.gltf" position={[5, 0, -4]} scale={0.7} />

      {/* Flowers */}
      <Piece model="tiny-treats/pretty-park/flower_A.gltf" position={[-3, 0, -2]} />
      <Piece model="tiny-treats/pretty-park/flower_B.gltf" position={[3, 0, -1.5]} />

      {/* Park benches and fountain (fountain offset right so it doesn't block play area) */}
      <Piece model="tiny-treats/pretty-park/bench.gltf" position={[-4, 0, 2]} rotation={[0, Math.PI / 4, 0]} />
      <Piece model="tiny-treats/pretty-park/bench.gltf" position={[4, 0, 1]} rotation={[0, -Math.PI / 4, 0]} />
      <Piece model="tiny-treats/pretty-park/fountain.gltf" position={[4, 0, -3]} scale={0.8} />
      <Piece model="tiny-treats/pretty-park/street_lantern.gltf" position={[-5, 0, 0]} />
      <Piece model="tiny-treats/pretty-park/street_lantern.gltf" position={[5, 0, 0]} />

      {/* Hedges along sides */}
      <Piece model="tiny-treats/pretty-park/hedge_straight_long.gltf" position={[-6, 0, 3]} rotation={[0, Math.PI / 2, 0]} />
      <Piece model="tiny-treats/pretty-park/hedge_straight_long.gltf" position={[6, 0, 3]} rotation={[0, -Math.PI / 2, 0]} />

    </group>
  )
}

// ============================================================================
// SPACE ZONE — Northeast area (knight-space quest)
// ============================================================================

function SpaceZone() {
  const center = ZONE_CENTERS['knight-space']

  return (
    <group name="space-zone" position={center}>
      {/* Landing pad */}
      <Piece model="kaykit/packs/space_base/landingpad_large.gltf" position={[0, 0, 0]} />
      {/* Base modules */}
      <Piece model="kaykit/packs/space_base/basemodule_A.gltf" position={[-4, 0, -3]} />
      <Piece model="kaykit/packs/space_base/basemodule_B.gltf" position={[4, 0, -3]} />
      {/* Tunnel connecting modules */}
      <Piece model="kaykit/packs/space_base/tunnel_straight_A.gltf" position={[0, 0, -3]} />
      {/* Dropship on the pad */}
      <Piece model="kaykit/packs/space_base/dropship.gltf" position={[0, 0, 2]} />
      {/* Cargo and containers */}
      <Piece model="kaykit/packs/space_base/containers_A.gltf" position={[-5, 0, 2]} />
      <Piece model="kaykit/packs/space_base/cargo_A.gltf" position={[5, 0, 1]} />
      {/* Solar panel */}
      <Piece model="kaykit/packs/space_base/solarpanel.gltf" position={[-6, 0, -5]} />
      {/* Dome */}
      <Piece model="kaykit/packs/space_base/dome.gltf" position={[0, 0, -6]} />
      {/* Accent lights */}
      <pointLight color="#38BDF8" intensity={3} distance={10} decay={2} position={[0, 3, 0]} />
      <pointLight color="#7C3AED" intensity={2} distance={8} decay={2} position={[-4, 2, -3]} />
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
      {/* Playground equipment */}
      <Piece model="tiny-treats/fun-playground/swing_A_large.gltf" position={[-4, 0, -3]} />
      <Piece model="tiny-treats/fun-playground/slide_A.gltf" position={[4, 0, -2]} />
      <Piece model="tiny-treats/fun-playground/merry_go_round.gltf" position={[0, 0, 0]} />
      <Piece model="tiny-treats/fun-playground/seesaw_large.gltf" position={[-3, 0, 3]} />
      <Piece model="tiny-treats/fun-playground/sandbox_round_decorated.gltf" position={[3, 0, 3]} />
      {/* Trees */}
      <Piece model="tiny-treats/fun-playground/tree_large.gltf" position={[-6, 0, -1]} />
      <Piece model="tiny-treats/fun-playground/tree_small.gltf" position={[6, 0, -1]} />
      {/* Fence ring */}
      <Piece model="tiny-treats/fun-playground/fence_straight_long.gltf" position={[-5, 0, -5]} />
      <Piece model="tiny-treats/fun-playground/fence_straight_long.gltf" position={[5, 0, -5]} />
      <Piece model="tiny-treats/fun-playground/fence_straight_long.gltf" position={[-5, 0, 5]} />
      <Piece model="tiny-treats/fun-playground/fence_straight_long.gltf" position={[5, 0, 5]} />
      {/* Picnic table (schoolyard) */}
      <Piece model="tiny-treats/fun-playground/picnic_table.gltf" position={[0, 0, -5]} />
    </group>
  )
}

// ============================================================================
// PIZZA ZONE — Southeast area (skeleton-pizza quest)
// ============================================================================

function PizzaZone() {
  const center = ZONE_CENTERS['skeleton-pizza']

  return (
    <group name="pizza-zone" position={center}>
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
      {/* Warm pizza shop lighting */}
      <pointLight color="#FF8C42" intensity={3} distance={10} decay={2} position={[0, 3, -2]} />
      <pointLight color="#FBBF24" intensity={2} distance={8} decay={2} position={[0, 2, 2]} />
    </group>
  )
}

// ============================================================================
// CONCERT ZONE — Southwest area (dungeon-concert quest)
// ============================================================================

function ConcertZone() {
  const center = ZONE_CENTERS['dungeon-concert']

  return (
    <group name="concert-zone" position={center}>
      {/* Stage area — dungeon stone walls as backdrop */}
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-4, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[-2, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[0, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[2, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/wall_half.gltf" position={[4, 0, -4]} />
      {/* Stage platform (hex pack) */}
      <Piece model={BUILDINGS.stage_A} position={[0, 0, -2]} scale={7.0} />
      {/* Decorated pillars as "speaker stacks" */}
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[-5, 0, -2]} scale={1.3} />
      <Piece model="kaykit/packs/dungeon/pillar_decorated.gltf" position={[5, 0, -2]} scale={1.3} />
      {/* Banners as concert decorations */}
      <Piece model="kaykit/packs/dungeon/banner_patternA_blue.gltf" position={[-3, 1.5, -3.8]} scale={0.7} />
      <Piece model="kaykit/packs/dungeon/banner_patternB_red.gltf" position={[0, 1.5, -3.8]} scale={0.7} />
      <Piece model="kaykit/packs/dungeon/banner_patternA_green.gltf" position={[3, 1.5, -3.8]} scale={0.7} />
      {/* Torches for atmosphere */}
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[-5, 0, -4]} />
      <Piece model="kaykit/packs/dungeon/torch_lit.gltf" position={[5, 0, -4]} />
      {/* Concert stage lights — colorful! */}
      <pointLight color="#7C3AED" intensity={4} distance={12} decay={2} position={[-3, 4, -2]} />
      <pointLight color="#EC4899" intensity={4} distance={12} decay={2} position={[3, 4, -2]} />
      <pointLight color="#38BDF8" intensity={3} distance={10} decay={2} position={[0, 5, -3]} />
    </group>
  )
}

// ============================================================================
// KITCHEN ZONE — West area (mage-kitchen quest)
// ============================================================================

function KitchenZone() {
  const center = ZONE_CENTERS['mage-kitchen']

  return (
    <group name="kitchen-zone" position={center}>
      {/* Kitchen walls (L-shape) */}
      <Piece model="tiny-treats/charming-kitchen/wall_tiles_kitchen_straight.gltf" position={[-3, 0, -4]} />
      <Piece model="tiny-treats/charming-kitchen/wall_tiles_kitchen_doorway.gltf" position={[0, 0, -4]} />
      <Piece model="tiny-treats/charming-kitchen/wall_tiles_kitchen_straight.gltf" position={[3, 0, -4]} />
      {/* Countertops */}
      <Piece model="tiny-treats/charming-kitchen/countertop_straight_A.gltf" position={[-3, 0, -3]} />
      <Piece model="tiny-treats/charming-kitchen/countertop_sink.gltf" position={[-1, 0, -3]} />
      <Piece model="tiny-treats/charming-kitchen/countertop_straight_B.gltf" position={[1, 0, -3]} />
      {/* Stove and fridge */}
      <Piece model="tiny-treats/charming-kitchen/stove.gltf" position={[3, 0, -3]} />
      <Piece model="tiny-treats/charming-kitchen/fridge.gltf" position={[-5, 0, -3]} />
      {/* Table and chairs */}
      <Piece model="tiny-treats/charming-kitchen/table_A.gltf" position={[0, 0, 1]} />
      <Piece model="tiny-treats/charming-kitchen/chair.gltf" position={[-1.5, 0, 1]} />
      <Piece model="tiny-treats/charming-kitchen/chair.gltf" position={[1.5, 0, 1]} rotation={[0, Math.PI, 0]} />
      {/* Kitchen props */}
      <Piece model="tiny-treats/charming-kitchen/pot.gltf" position={[3, 0.9, -3]} />
      <Piece model="tiny-treats/charming-kitchen/kettle.gltf" position={[-3, 0.9, -3]} />
      {/* Warm kitchen light */}
      <pointLight color="#FBBF24" intensity={3} distance={10} decay={2} position={[0, 3, -1]} />
    </group>
  )
}

// ============================================================================
// ROAD DECORATION — Props along the road between zones
// ============================================================================

function RoadDecoration() {
  const d = 7.0 // Scale hex decoration to match 7x building scale
  return (
    <group name="road-decoration">
      {/* Signposts along the road — village section only (canyon has its own walls) */}
      <Piece model={DECORATION.flag_blue} position={[5, 0, -10]} scale={d} />
      <Piece model={DECORATION.flag_blue} position={[5, 0, 14]} scale={d} />
      <Piece model={DECORATION.flag_blue} position={[5, 0, 26]} scale={d} />

      {/* Props along the road */}
      <Piece model={DECORATION.crate_B} position={[-5, 0, 18]} scale={d} />
      <Piece model={DECORATION.haybale} position={[5, 0, -8]} scale={d} />
      <Piece model={DECORATION.trough} position={[-5, 0, 8]} scale={d} />
      <Piece model={DECORATION.barrel} position={[-4, 0, -12]} scale={d} />

      {/* Trees along the road */}
      <Piece model={DECORATION.tree_A} position={[-8, 0, 18]} scale={d} />
      <Piece model={DECORATION.tree_B} position={[8, 0, 22]} scale={d} />
    </group>
  )
}

// ============================================================================
// VILLAGE ATMOSPHERE — Global lighting and effects
// ============================================================================

function VillageAtmosphere() {
  return (
    <>
      {/* Procedural sky — eliminates black void */}
      <Sky
        distance={450000}
        sunPosition={[8, 15, 5]}
        turbidity={6}
        rayleigh={1.5}
      />

      {/* Global fog — soft edges, pushed far for the 7x-scale village */}
      <fog attach="fog" args={['#b8d8e8', 80, 350]} />

      {/* Hemisphere light — warm village afternoon */}
      <hemisphereLight
        color="#87CEEB"
        groundColor="#556B2F"
        intensity={0.8}
      />

      {/* Main directional light (sun) */}
      <directionalLight
        color="#fff8e0"
        intensity={1.5}
        position={[10, 15, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-far={250}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        color="#aaccff"
        intensity={0.3}
        position={[-8, 5, -5]}
      />

      {/* Clouds — scattered across sky at varying heights */}
      <Clouds limit={400} material={THREE.MeshLambertMaterial}>
        <Cloud
          segments={20}
          bounds={[15, 2, 8] as [number, number, number]}
          volume={8}
          color="#ffffff"
          opacity={0.4}
          speed={0.15}
          position={[-15, 30, -50] as [number, number, number]}
        />
        <Cloud
          segments={15}
          bounds={[10, 2, 5] as [number, number, number]}
          volume={6}
          color="#ffffff"
          opacity={0.35}
          speed={0.1}
          position={[20, 35, -40] as [number, number, number]}
        />
        <Cloud
          segments={18}
          bounds={[12, 2, 7] as [number, number, number]}
          volume={7}
          color="#ffffff"
          opacity={0.3}
          speed={0.08}
          position={[45, 40, 20] as [number, number, number]}
        />
        <Cloud
          segments={22}
          bounds={[18, 3, 10] as [number, number, number]}
          volume={9}
          color="#ffffff"
          opacity={0.25}
          speed={0.12}
          position={[-40, 45, 30] as [number, number, number]}
        />
        <Cloud
          segments={12}
          bounds={[8, 2, 5] as [number, number, number]}
          volume={5}
          color="#ffffff"
          opacity={0.35}
          speed={0.18}
          position={[30, 28, 55] as [number, number, number]}
        />
        <Cloud
          segments={16}
          bounds={[14, 2, 6] as [number, number, number]}
          volume={7}
          color="#ffffff"
          opacity={0.3}
          speed={0.06}
          position={[-50, 38, -20] as [number, number, number]}
        />
        <Cloud
          segments={10}
          bounds={[9, 2, 4] as [number, number, number]}
          volume={5}
          color="#ffffff"
          opacity={0.4}
          speed={0.2}
          position={[10, 25, 65] as [number, number, number]}
        />
      </Clouds>
    </>
  )
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

      {/* Cliff bowl enclosing the dungeon */}
      <Suspense fallback={null}>
        <DungeonCliffs />
      </Suspense>

      {/* Road decoration */}
      <Suspense fallback={null}>
        <RoadDecoration />
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
    </group>
  )
}
