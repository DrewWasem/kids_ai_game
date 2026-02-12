/**
 * SceneEnvironment3D — Per-task 3D environment built from existing assets.
 *
 * Renders 15-30 curated GLTF models per task arranged into cohesive "sets":
 * dungeon walls, kitchen counters, playground equipment, park trees, etc.
 *
 * Architecture: Pure data-driven (like TaskAtmosphere). TASK_ENVIRONMENTS
 * defines every piece. R3FGame.tsx renders <SceneEnvironment3D /> inside Canvas.
 *
 * All paths are relative to ASSET_BASE (/assets/3d/).
 */

import { memo, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { ASSET_BASE } from '../data/asset-manifest'

// ============================================================================
// TYPES
// ============================================================================

interface EnvironmentPiece {
  /** Path relative to /assets/3d/ */
  model: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

// ============================================================================
// SINGLE ENVIRONMENT PIECE (memoized)
// ============================================================================

const EnvPiece = memo(({ model, position, rotation, scale = 1 }: EnvironmentPiece) => {
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

EnvPiece.displayName = 'EnvPiece'

// ============================================================================
// PER-TASK ENVIRONMENT CONFIGS
// ============================================================================

const TASK_ENVIRONMENTS: Record<string, EnvironmentPiece[]> = {

  // ─── T1: Skeleton's Surprise Birthday — Dungeon Hall ───────────────────────
  'skeleton-birthday': [
    // Back wall (U-shape)
    { model: 'kaykit/packs/dungeon/wall_arched.gltf', position: [-4, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_archedwindow_gated.gltf', position: [-2, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_arched.gltf', position: [0, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_archedwindow_gated.gltf', position: [2, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_arched.gltf', position: [4, 0, -4], rotation: [0, 0, 0] },
    // Side walls
    { model: 'kaykit/packs/dungeon/wall_corner.gltf', position: [-5, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_inset_candles.gltf', position: [-5, 0, -2], rotation: [0, Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/wall_corner.gltf', position: [5, 0, -4], rotation: [0, -Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/wall_inset_candles.gltf', position: [5, 0, -2], rotation: [0, -Math.PI / 2, 0] },
    // Pillars
    { model: 'kaykit/packs/dungeon/pillar_decorated.gltf', position: [-3, 0, -1], scale: 1.2 },
    { model: 'kaykit/packs/dungeon/pillar_decorated.gltf', position: [3, 0, -1], scale: 1.2 },
    // Floor
    { model: 'kaykit/packs/dungeon/floor_tile_large.gltf', position: [0, 0.01, -2] },
    { model: 'kaykit/packs/dungeon/floor_tile_large.gltf', position: [-2, 0.01, -2] },
    { model: 'kaykit/packs/dungeon/floor_tile_large.gltf', position: [2, 0.01, -2] },
    // Torches on walls
    { model: 'kaykit/packs/dungeon/torch_mounted.gltf', position: [-5, 2.5, -3], rotation: [0, Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/torch_mounted.gltf', position: [5, 2.5, -3], rotation: [0, -Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/torch_lit.gltf', position: [-1, 0, -3.5] },
    { model: 'kaykit/packs/dungeon/torch_lit.gltf', position: [1, 0, -3.5] },
    // Props and decoration
    { model: 'kaykit/packs/dungeon/barrel_large.gltf', position: [-4.5, 0, 0] },
    { model: 'kaykit/packs/dungeon/barrel_small.gltf', position: [-4.2, 0, 0.6] },
    { model: 'kaykit/packs/dungeon/crate_large.gltf', position: [4.5, 0, 0.5] },
    { model: 'kaykit/packs/dungeon/chest_large_gold.gltf', position: [4, 0, -3.5], rotation: [0, Math.PI, 0] },
    { model: 'kaykit/packs/dungeon/bookcase_double_decoratedA.gltf', position: [-4.5, 0, -3.5], rotation: [0, Math.PI / 2, 0] },
    // Banners for party atmosphere
    { model: 'kaykit/packs/dungeon/banner_patternA_blue.gltf', position: [-2, 2.5, -3.9] },
    { model: 'kaykit/packs/dungeon/banner_patternB_red.gltf', position: [0, 2.5, -3.9] },
    { model: 'kaykit/packs/dungeon/banner_patternA_green.gltf', position: [2, 2.5, -3.9] },
  ],

  // ─── T2: Knight's Space Mission — Space Station ────────────────────────────
  'knight-space': [
    // Central base modules
    { model: 'kaykit/packs/space_base/basemodule_A.gltf', position: [0, 0, -5], scale: 0.8 },
    { model: 'kaykit/packs/space_base/basemodule_B.gltf', position: [-4, 0, -5], scale: 0.8 },
    { model: 'kaykit/packs/space_base/basemodule_C.gltf', position: [4, 0, -5], scale: 0.8 },
    // Tunnels connecting modules
    { model: 'kaykit/packs/space_base/tunnel_straight_A.gltf', position: [-2, 0, -5], scale: 0.8 },
    { model: 'kaykit/packs/space_base/tunnel_straight_B.gltf', position: [2, 0, -5], scale: 0.8 },
    // Landing pad area
    { model: 'kaykit/packs/space_base/landingpad_large.gltf', position: [0, 0.01, -1], scale: 0.6 },
    // Dropship
    { model: 'kaykit/packs/space_base/dropship.gltf', position: [5, 0, -2], rotation: [0, -Math.PI / 4, 0], scale: 0.7 },
    // Terrain and rocks
    { model: 'kaykit/packs/space_base/terrain_low.gltf', position: [-6, 0, -3], scale: 0.8 },
    { model: 'kaykit/packs/space_base/terrain_tall.gltf', position: [6, 0, -4], scale: 0.6 },
    { model: 'kaykit/packs/space_base/rock_A.gltf', position: [-5, 0, 1] },
    { model: 'kaykit/packs/space_base/rock_B.gltf', position: [5, 0, 2] },
    { model: 'kaykit/packs/space_base/rocks_A.gltf', position: [-3, 0, 3] },
    // Cargo and containers
    { model: 'kaykit/packs/space_base/cargo_A.gltf', position: [-4, 0, -1] },
    { model: 'kaykit/packs/space_base/cargo_B_stacked.gltf', position: [-5, 0, -1] },
    { model: 'kaykit/packs/space_base/containers_A.gltf', position: [4, 0, 1] },
    // Infrastructure
    { model: 'kaykit/packs/space_base/structure_tall.gltf', position: [-7, 0, -5], scale: 0.6 },
    { model: 'kaykit/packs/space_base/windturbine_tall.gltf', position: [7, 0, -6], scale: 0.5 },
    { model: 'kaykit/packs/space_base/solarpanel.gltf', position: [-3, 0, -7], scale: 0.7, rotation: [0, Math.PI / 6, 0] },
    { model: 'kaykit/packs/space_base/solarpanel.gltf', position: [3, 0, -7], scale: 0.7, rotation: [0, -Math.PI / 6, 0] },
    // Lights
    { model: 'kaykit/packs/space_base/lights.gltf', position: [-2, 0, 0] },
    { model: 'kaykit/packs/space_base/lights.gltf', position: [2, 0, 0] },
    // Dome
    { model: 'kaykit/packs/space_base/dome.gltf', position: [0, 0, -7], scale: 0.6 },
  ],

  // ─── T3: Mage vs. Kitchen — Charming Kitchen Interior ─────────────────────
  'mage-kitchen': [
    // Back wall — kitchen tiles
    { model: 'tiny-treats/charming-kitchen/wall_modular_tiles_kitchen_straight_A.gltf', position: [-3, 0, -3] },
    { model: 'tiny-treats/charming-kitchen/wall_modular_tiles_kitchen_straight_B.gltf', position: [-1, 0, -3] },
    { model: 'tiny-treats/charming-kitchen/wall_modular_tiles_kitchen_straight_A.gltf', position: [1, 0, -3] },
    { model: 'tiny-treats/charming-kitchen/wall_modular_tiles_kitchen_straight_B.gltf', position: [3, 0, -3] },
    // Side walls
    { model: 'tiny-treats/charming-kitchen/wall_modular_plain_kitchen_corner_inner_A.gltf', position: [-4, 0, -3] },
    { model: 'tiny-treats/charming-kitchen/wall_modular_plain_kitchen_straight_A.gltf', position: [-4, 0, -1] },
    { model: 'tiny-treats/charming-kitchen/wall_modular_plain_kitchen_corner_inner_A.gltf', position: [4, 0, -3], rotation: [0, -Math.PI / 2, 0] },
    { model: 'tiny-treats/charming-kitchen/wall_modular_plain_kitchen_straight_A.gltf', position: [4, 0, -1], rotation: [0, Math.PI, 0] },
    // Floor
    { model: 'tiny-treats/charming-kitchen/floor_tiles_kitchen.gltf', position: [0, 0.01, -1] },
    { model: 'tiny-treats/charming-kitchen/floor_tiles_kitchen.gltf', position: [-2, 0.01, -1] },
    { model: 'tiny-treats/charming-kitchen/floor_tiles_kitchen.gltf', position: [2, 0.01, -1] },
    // Kitchen counter along back wall
    { model: 'tiny-treats/charming-kitchen/countertop_straight_A.gltf', position: [-2, 0, -2.5] },
    { model: 'tiny-treats/charming-kitchen/countertop_sink.gltf', position: [0, 0, -2.5] },
    { model: 'tiny-treats/charming-kitchen/countertop_straight_B.gltf', position: [2, 0, -2.5] },
    // Appliances
    { model: 'tiny-treats/charming-kitchen/stove.gltf', position: [-3.5, 0, -2.5] },
    { model: 'tiny-treats/charming-kitchen/fridge.gltf', position: [3.5, 0, -2.5] },
    { model: 'tiny-treats/charming-kitchen/extractor_hood.gltf', position: [-3.5, 2, -2.8] },
    // Wall fixtures
    { model: 'tiny-treats/charming-kitchen/wall_cabinet_straight.gltf', position: [-1, 1.8, -2.8] },
    { model: 'tiny-treats/charming-kitchen/wall_cabinet_straight.gltf', position: [1, 1.8, -2.8] },
    { model: 'tiny-treats/charming-kitchen/wall_shelf_kitchen_hooks.gltf', position: [0, 1.5, -2.8] },
    { model: 'tiny-treats/charming-kitchen/wall_knife_rack.gltf', position: [-2.5, 1.5, -2.8] },
    // Table area
    { model: 'tiny-treats/charming-kitchen/table_A.gltf', position: [-2, 0, 1] },
    { model: 'tiny-treats/charming-kitchen/chair.gltf', position: [-3, 0, 1], rotation: [0, Math.PI / 2, 0] },
    { model: 'tiny-treats/charming-kitchen/chair.gltf', position: [-1, 0, 1], rotation: [0, -Math.PI / 2, 0] },
    // Kitchen props on counter
    { model: 'tiny-treats/charming-kitchen/pot.gltf', position: [-3.5, 0.9, -2.5] },
    { model: 'tiny-treats/charming-kitchen/pan.gltf', position: [2, 0.9, -2.5] },
    { model: 'tiny-treats/charming-kitchen/kettle.gltf', position: [-0.5, 0.9, -2.5] },
    // Side props
    { model: 'tiny-treats/charming-kitchen/dishrack_plates.gltf', position: [1, 0.9, -2.5] },
  ],

  // ─── T4: Barbarian's School — Playground ───────────────────────────────────
  'barbarian-school': [
    // Playground equipment in semicircle behind action area
    { model: 'tiny-treats/fun-playground/swing_A_large.gltf', position: [-5, 0, -3], scale: 1.2 },
    { model: 'tiny-treats/fun-playground/slide_A.gltf', position: [-2, 0, -4], rotation: [0, Math.PI / 6, 0], scale: 1.2 },
    { model: 'tiny-treats/fun-playground/merry_go_round.gltf', position: [0, 0, -5], scale: 1.2 },
    { model: 'tiny-treats/fun-playground/seesaw_large.gltf', position: [3, 0, -4], rotation: [0, -Math.PI / 6, 0], scale: 1.2 },
    { model: 'tiny-treats/fun-playground/monkeybar_A.gltf', position: [5.5, 0, -3], scale: 1.0 },
    // Sandbox area
    { model: 'tiny-treats/fun-playground/sandbox_square_decorated.gltf', position: [-5, 0, 1], scale: 1.2 },
    { model: 'tiny-treats/fun-playground/sandcastle_A.gltf', position: [-4.5, 0.1, 1] },
    // Spring horses
    { model: 'tiny-treats/fun-playground/spring_horse_A.gltf', position: [5, 0, 0] },
    { model: 'tiny-treats/fun-playground/spring_horse_B.gltf', position: [5.5, 0, 1.5] },
    // Fence along the back and sides
    { model: 'tiny-treats/fun-playground/fence_straight_long.gltf', position: [-4, 0, -6], rotation: [0, 0, 0] },
    { model: 'tiny-treats/fun-playground/fence_straight_long.gltf', position: [0, 0, -6], rotation: [0, 0, 0] },
    { model: 'tiny-treats/fun-playground/fence_straight_long.gltf', position: [4, 0, -6], rotation: [0, 0, 0] },
    { model: 'tiny-treats/fun-playground/fence_corner.gltf', position: [-6.5, 0, -6] },
    { model: 'tiny-treats/fun-playground/fence_straight.gltf', position: [-6.5, 0, -4], rotation: [0, Math.PI / 2, 0] },
    { model: 'tiny-treats/fun-playground/fence_corner.gltf', position: [6.5, 0, -6], rotation: [0, -Math.PI / 2, 0] },
    { model: 'tiny-treats/fun-playground/fence_straight.gltf', position: [6.5, 0, -4], rotation: [0, -Math.PI / 2, 0] },
    // Trees scattered
    { model: 'tiny-treats/fun-playground/tree_large.gltf', position: [-7, 0, -2], scale: 1.3 },
    { model: 'tiny-treats/fun-playground/tree_small.gltf', position: [7, 0, -1] },
    { model: 'tiny-treats/fun-playground/tree_large.gltf', position: [7, 0, -5], scale: 1.1 },
    // Picnic table
    { model: 'tiny-treats/fun-playground/picnic_table.gltf', position: [5, 0, -5] },
    // Desk + chair for "school" element
    { model: 'kaykit/packs/furniture/desk_decorated.gltf', position: [2, 0, 1] },
    { model: 'kaykit/packs/furniture/chair_A_wood.gltf', position: [2, 0, 2], rotation: [0, Math.PI, 0] },
    // Stepping stones path
    { model: 'tiny-treats/fun-playground/stepping_stumps_A_blue.gltf', position: [-1, 0, 2] },
    { model: 'tiny-treats/fun-playground/stepping_stumps_A_yellow.gltf', position: [0, 0, 3] },
    { model: 'tiny-treats/fun-playground/stepping_stumps_A_pink.gltf', position: [1, 0, 2.5] },
    // Colorful tires
    { model: 'tiny-treats/fun-playground/tire_blue.gltf', position: [-3, 0, 2] },
    { model: 'tiny-treats/fun-playground/tire_pink.gltf', position: [-3.5, 0, 3] },
  ],

  // ─── T5: Dungeon Rock Concert — Smoky Stage ───────────────────────────────
  'dungeon-concert': [
    // Back wall (stage backdrop)
    { model: 'kaykit/packs/dungeon/wall_arched.gltf', position: [-4, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_arched.gltf', position: [-2, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_doorway.gltf', position: [0, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_arched.gltf', position: [2, 0, -4], rotation: [0, 0, 0] },
    { model: 'kaykit/packs/dungeon/wall_arched.gltf', position: [4, 0, -4], rotation: [0, 0, 0] },
    // Side walls
    { model: 'kaykit/packs/dungeon/wall_corner.gltf', position: [-5, 0, -4] },
    { model: 'kaykit/packs/dungeon/wall_inset_shelves_decoratedB.gltf', position: [-5, 0, -2], rotation: [0, Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/wall_half.gltf', position: [-5, 0, 0], rotation: [0, Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/wall_corner.gltf', position: [5, 0, -4], rotation: [0, -Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/wall_inset_shelves_decoratedA.gltf', position: [5, 0, -2], rotation: [0, -Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/wall_half.gltf', position: [5, 0, 0], rotation: [0, -Math.PI / 2, 0] },
    // Stage floor (raised tiles)
    { model: 'kaykit/packs/dungeon/floor_wood_large.gltf', position: [-2, 0.01, -2] },
    { model: 'kaykit/packs/dungeon/floor_wood_large.gltf', position: [0, 0.01, -2] },
    { model: 'kaykit/packs/dungeon/floor_wood_large.gltf', position: [2, 0.01, -2] },
    // Pillars framing the stage
    { model: 'kaykit/packs/dungeon/pillar.gltf', position: [-3.5, 0, -1], scale: 1.3 },
    { model: 'kaykit/packs/dungeon/pillar.gltf', position: [3.5, 0, -1], scale: 1.3 },
    // Torches (stage lighting)
    { model: 'kaykit/packs/dungeon/torch_lit.gltf', position: [-3.5, 0, -3] },
    { model: 'kaykit/packs/dungeon/torch_lit.gltf', position: [3.5, 0, -3] },
    { model: 'kaykit/packs/dungeon/torch_mounted.gltf', position: [-5, 2.5, -1], rotation: [0, Math.PI / 2, 0] },
    { model: 'kaykit/packs/dungeon/torch_mounted.gltf', position: [5, 2.5, -1], rotation: [0, -Math.PI / 2, 0] },
    // Concert banners (colorful mix)
    { model: 'kaykit/packs/dungeon/banner_patternB_red.gltf', position: [-3, 2.5, -3.9] },
    { model: 'kaykit/packs/dungeon/banner_patternA_blue.gltf', position: [-1, 2.5, -3.9] },
    { model: 'kaykit/packs/dungeon/banner_patternC_green.gltf', position: [1, 2.5, -3.9] },
    { model: 'kaykit/packs/dungeon/banner_patternB_yellow.gltf', position: [3, 2.5, -3.9] },
    // Audience area props
    { model: 'kaykit/packs/dungeon/barrel_large.gltf', position: [-4.5, 0, 1] },
    { model: 'kaykit/packs/dungeon/barrel_small.gltf', position: [-4, 0, 2] },
    { model: 'kaykit/packs/dungeon/barrel_large.gltf', position: [4.5, 0, 1] },
    { model: 'kaykit/packs/dungeon/crate_large.gltf', position: [4, 0, 2] },
    { model: 'kaykit/packs/dungeon/stool_round.gltf', position: [-2, 0, 2] },
    { model: 'kaykit/packs/dungeon/stool_round.gltf', position: [0, 0, 3] },
    { model: 'kaykit/packs/dungeon/stool_round.gltf', position: [2, 0, 2] },
  ],

  // ─── T6: Skeleton Pizza Delivery — Restaurant/Street ───────────────────────
  'skeleton-pizza': [
    // Restaurant back wall
    { model: 'kaykit/packs/restaurant/wall_tiles_A.gltf', position: [-3, 0, -3] },
    { model: 'kaykit/packs/restaurant/wall_orderwindow.gltf', position: [-1, 0, -3] },
    { model: 'kaykit/packs/restaurant/wall_tiles_B.gltf', position: [1, 0, -3] },
    { model: 'kaykit/packs/restaurant/wall_decorated.gltf', position: [3, 0, -3] },
    // Kitchen counter (pizza making area)
    { model: 'kaykit/packs/restaurant/kitchencounter_straight_A.gltf', position: [-3, 0, -2] },
    { model: 'kaykit/packs/restaurant/kitchencounter_straight_A_decorated.gltf', position: [-1, 0, -2] },
    { model: 'kaykit/packs/restaurant/kitchencounter_sink.gltf', position: [1, 0, -2] },
    { model: 'kaykit/packs/restaurant/kitchencounter_straight_B.gltf', position: [3, 0, -2] },
    // Pizza oven
    { model: 'kaykit/packs/restaurant/oven.gltf', position: [4, 0, -2.5], rotation: [0, -Math.PI / 2, 0] },
    { model: 'kaykit/packs/restaurant/stove_multi.gltf', position: [-4, 0, -2.5] },
    // Kitchen floor
    { model: 'kaykit/packs/restaurant/floor_kitchen.gltf', position: [0, 0.01, -1.5] },
    { model: 'kaykit/packs/restaurant/floor_kitchen.gltf', position: [-2, 0.01, -1.5] },
    { model: 'kaykit/packs/restaurant/floor_kitchen.gltf', position: [2, 0.01, -1.5] },
    // Dining tables (delivery pickup area)
    { model: 'kaykit/packs/restaurant/table_round_A.gltf', position: [-3, 0, 1] },
    { model: 'kaykit/packs/restaurant/chair_A.gltf', position: [-4, 0, 1], rotation: [0, Math.PI / 2, 0] },
    { model: 'kaykit/packs/restaurant/chair_A.gltf', position: [-2, 0, 1], rotation: [0, -Math.PI / 2, 0] },
    { model: 'kaykit/packs/restaurant/table_round_B_tablecloth_red.gltf', position: [3, 0, 1.5] },
    { model: 'kaykit/packs/restaurant/chair_A.gltf', position: [2, 0, 1.5], rotation: [0, Math.PI / 2, 0] },
    { model: 'kaykit/packs/restaurant/chair_A.gltf', position: [4, 0, 1.5], rotation: [0, -Math.PI / 2, 0] },
    // Menu board
    { model: 'kaykit/packs/restaurant/menu.gltf', position: [4.5, 0, -1], rotation: [0, -Math.PI / 4, 0] },
    // Door
    { model: 'kaykit/packs/restaurant/door_A.gltf', position: [-4.5, 0, -0.5], rotation: [0, Math.PI / 2, 0] },
    // Street lanterns (delivery route)
    { model: 'tiny-treats/pretty-park/street_lantern.gltf', position: [-5, 0, 2] },
    { model: 'tiny-treats/pretty-park/street_lantern.gltf', position: [5, 0, 2] },
    // Bench (customers waiting)
    { model: 'tiny-treats/pretty-park/bench.gltf', position: [0, 0, 3], rotation: [0, Math.PI, 0] },
  ],

  // ─── T7: Adventurers' Picnic — Forest Park ────────────────────────────────
  'adventurers-picnic': [
    // Ring of trees (surrounding the clearing)
    { model: 'tiny-treats/pretty-park/tree_large.gltf', position: [-6, 0, -4], scale: 1.4 },
    { model: 'kaykit/packs/forest_nature/Tree_1_A_Color1.gltf', position: [-4, 0, -5], scale: 1.2 },
    { model: 'tiny-treats/pretty-park/tree.gltf', position: [-2, 0, -6], scale: 1.3 },
    { model: 'kaykit/packs/forest_nature/Tree_2_A_Color1.gltf', position: [0, 0, -6], scale: 1.0 },
    { model: 'tiny-treats/pretty-park/tree_large.gltf', position: [2, 0, -5.5], scale: 1.5 },
    { model: 'kaykit/packs/forest_nature/Tree_3_A_Color1.gltf', position: [4, 0, -5], scale: 1.1 },
    { model: 'tiny-treats/pretty-park/tree.gltf', position: [6, 0, -3], scale: 1.3 },
    { model: 'kaykit/packs/forest_nature/Tree_1_B_Color1.gltf', position: [7, 0, 0], scale: 1.0 },
    { model: 'tiny-treats/pretty-park/tree_large.gltf', position: [-7, 0, 0], scale: 1.2 },
    // Bushes filling gaps
    { model: 'tiny-treats/pretty-park/bush.gltf', position: [-5, 0, -3] },
    { model: 'tiny-treats/pretty-park/bush_large.gltf', position: [5, 0, -4] },
    { model: 'kaykit/packs/forest_nature/Bush_1_A_Color1.gltf', position: [-3, 0, -4.5] },
    { model: 'kaykit/packs/forest_nature/Bush_2_A_Color1.gltf', position: [3, 0, -4.5] },
    // Flowers scattered
    { model: 'tiny-treats/pretty-park/flower_A.gltf', position: [-4, 0, -2] },
    { model: 'tiny-treats/pretty-park/flower_B.gltf', position: [4, 0, -1.5] },
    { model: 'tiny-treats/pretty-park/flower_A.gltf', position: [-2, 0, 3] },
    // Rocks
    { model: 'kaykit/packs/forest_nature/Rock_1_A_Color1.gltf', position: [-5, 0, 1] },
    { model: 'kaykit/packs/forest_nature/Rock_1_C_Color1.gltf', position: [5.5, 0, 1.5] },
    // Grass patches
    { model: 'tiny-treats/pretty-park/grass_A.gltf', position: [-3, 0, 0] },
    { model: 'tiny-treats/pretty-park/grass_B.gltf', position: [3, 0, 0] },
    { model: 'tiny-treats/pretty-park/grass_A.gltf', position: [0, 0, 2.5] },
    // Hedges along sides
    { model: 'tiny-treats/pretty-park/hedge_straight_long.gltf', position: [-6, 0, 3], rotation: [0, Math.PI / 2, 0] },
    { model: 'tiny-treats/pretty-park/hedge_straight_long.gltf', position: [6, 0, 3], rotation: [0, -Math.PI / 2, 0] },
    // Park bench (fountain is in VillageWorld ParkZone — no duplicate needed)
    { model: 'tiny-treats/pretty-park/bench.gltf', position: [-4, 0, 2], rotation: [0, Math.PI / 4, 0] },
    // Street lantern
    { model: 'tiny-treats/pretty-park/street_lantern.gltf', position: [-5, 0, 0] },
  ],
}

// ============================================================================
// PRELOAD — Collect all unique model paths for useGLTF.preload()
// ============================================================================

const ALL_MODEL_PATHS = new Set<string>()
for (const pieces of Object.values(TASK_ENVIRONMENTS)) {
  for (const piece of pieces) {
    ALL_MODEL_PATHS.add(ASSET_BASE + piece.model)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface SceneEnvironment3DProps {
  taskId: string
}

export function SceneEnvironment3D({ taskId }: SceneEnvironment3DProps) {
  const pieces = TASK_ENVIRONMENTS[taskId]

  if (!pieces) return null

  return (
    <group name={`environment-${taskId}`}>
      {pieces.map((piece, i) => (
        <EnvPiece key={`env-${taskId}-${i}`} {...piece} />
      ))}
    </group>
  )
}

// ============================================================================
// PRELOAD — Per-task preloading (call when task is selected)
// ============================================================================

export function preloadTaskEnvironment(taskId: string) {
  const pieces = TASK_ENVIRONMENTS[taskId]
  if (!pieces) return
  for (const piece of pieces) {
    useGLTF.preload(ASSET_BASE + piece.model)
  }
}

export { TASK_ENVIRONMENTS }
