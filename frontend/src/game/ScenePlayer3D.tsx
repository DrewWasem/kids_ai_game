/**
 * ScenePlayer3D — Executes Claude-generated scene scripts in the 3D world.
 *
 * Core game engine component that:
 * - Takes SceneScript from Claude API
 * - Spawns/moves/animates characters and props in 3D space
 * - Plays effects and emotes as HTML overlays
 * - Manages sequential action execution with delays
 * - Handles legacy 2D actor names → 3D character mapping
 * - Environment backdrop props per task
 * - Synthesized sound effects via SoundManager3D
 * - Bullet-proof error tolerance: one bad action never kills the sequence
 */

import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Character3D, type Character3DHandle } from './Character3D'
import { Prop3D, type Prop3DHandle } from './Prop3D'
import AnimalCharacter3D from './AnimalCharacter3D'
import ProceduralBalloon from './ProceduralBalloon'
import { SoundManager3D } from './SoundManager3D'
import type { SceneScript, Action, Position, SpawnGroupAction } from '../types/scene-script'
import type { VignetteStep } from '../types/madlibs'
import { CHARACTERS, ANIMAL_MODELS, type CharacterKey } from '../data/asset-manifest'
import { useGameStore, ZONE_CENTERS } from '../stores/gameStore'

// Compute character facing for a zone — face toward village center (0,0,0)
let _zoneCharRotationCache: Record<string, [number, number, number]> | null = null
function getZoneCharRotation(zoneId: string): [number, number, number] | undefined {
  if (!_zoneCharRotationCache) {
    _zoneCharRotationCache = {}
    for (const [id, center] of Object.entries(ZONE_CENTERS)) {
      _zoneCharRotationCache[id] = [0, Math.atan2(-center[0], -center[2]), 0]
    }
  }
  return _zoneCharRotationCache[zoneId]
}

// Mini error boundary: renders nothing if a child (e.g. GLTF load) throws
class SafeModel extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err: Error) { console.warn('[SafeModel] Skipping bad model:', err.message) }
  render() { return this.state.hasError ? null : this.props.children }
}

// ============================================================================
// POSITION MAPPING
// ============================================================================

// Characters spawn in the FRONT half (positive Z = closer to camera).
// Props sit in the BACK half (negative Z = backdrop behind characters).
// This prevents characters from clipping into environment objects.
const LOCAL_POSITION_MAP: Record<string, [number, number, number]> = {
  // Legacy positions — mapped onto the 15-mark stage grid
  left: [-4.5, 0, 1.5],      // = ds-far-left
  center: [0, 0, 0],          // = cs-center
  right: [4.5, 0, 1.5],       // = ds-far-right
  top: [0, 0, -1.5],          // = us-center
  bottom: [0, 0, 1.5],        // = ds-center (audience front)
  'off-left': [-7, 0, 0],     // wing entrance left
  'off-right': [7, 0, 0],     // wing entrance right
  'off-top': [0, 5, 0],

  // Downstage (front row, Z=1.5 — closest to camera)
  'ds-far-left':  [-4.5, 0, 1.5],
  'ds-left':      [-2.0, 0, 1.5],
  'ds-center':    [0, 0, 1.5],
  'ds-right':     [2.0, 0, 1.5],
  'ds-far-right': [4.5, 0, 1.5],

  // Center stage (mid row, Z=0)
  'cs-far-left':  [-4.5, 0, 0],
  'cs-left':      [-2.0, 0, 0],
  'cs-center':    [0, 0, 0],
  'cs-right':     [2.0, 0, 0],
  'cs-far-right': [4.5, 0, 0],

  // Upstage (back row, Z=-1.5 — furthest from camera)
  'us-far-left':  [-4.5, 0, -1.5],
  'us-left':      [-2.0, 0, -1.5],
  'us-center':    [0, 0, -1.5],
  'us-right':     [2.0, 0, -1.5],
  'us-far-right': [4.5, 0, -1.5],
}

/** Exported as STAGE_MARKS for use in blocking-templates.ts */
export { LOCAL_POSITION_MAP as STAGE_MARKS }

// Kept for backward compatibility — resolves to zone-relative positions at runtime
const POSITION_MAP = LOCAL_POSITION_MAP

// Lazy-cached per-zone rotation angles (zone faces toward village center)
let _zoneAngles: Record<string, number> | null = null
function getZoneAngle(zoneId: string): number {
  if (!_zoneAngles) {
    _zoneAngles = {}
    for (const [id, center] of Object.entries(ZONE_CENTERS)) {
      // Angle from zone center toward village origin [0,0,0]
      _zoneAngles[id] = Math.atan2(-center[0], -center[2])
    }
  }
  return _zoneAngles[zoneId] ?? 0
}

/**
 * Rotate a local position by the zone's facing angle, then offset by zone center.
 * Local coords: +Z = toward camera (front), -Z = away from camera (back),
 * +X = stage-right, -X = stage-left.
 * This ensures "front" always faces the camera regardless of zone orientation.
 */
function zonePosition(
  zoneId: string | null,
  localPos: [number, number, number]
): [number, number, number] {
  if (!zoneId) return localPos
  const center = ZONE_CENTERS[zoneId]
  if (!center) return localPos
  const angle = getZoneAngle(zoneId)
  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)
  // Rotate local XZ by zone facing angle
  const rx = localPos[0] * cosA - localPos[2] * sinA
  const rz = localPos[0] * sinA + localPos[2] * cosA
  return [center[0] + rx, localPos[1], center[2] + rz]
}

// ============================================================================
// ACTOR MAPPING (legacy 2D → 3D character IDs)
// ============================================================================

const ACTOR_TO_CHARACTER: Record<string, CharacterKey> = {
  // Legacy 2D names → 3D characters
  monster: 'barbarian',
  dog: 'rogue',
  trex: 'knight',
  octopus: 'mage',
  robot: 'robot',
  wizard: 'mage',
  kid: 'ranger',
  fish: 'ninja',
  squirrel: 'rogue',
  // Direct 3D character IDs pass through (handled in resolveCharacter)
}

function resolveCharacterId(actorId: string): CharacterKey | null {
  // Check if it's a direct character ID
  if (actorId in CHARACTERS) {
    return actorId as CharacterKey
  }
  // Map legacy 2D actor names
  if (actorId in ACTOR_TO_CHARACTER) {
    return ACTOR_TO_CHARACTER[actorId]
  }
  // Unknown actor — return null for error tolerance
  return null
}

// ============================================================================
// PROP PATH MAPPING
// ============================================================================

const PROP_PATHS: Record<string, string> = {
  // === Baked Goods (Tiny Treats) — CAKES ===
  cake: 'tiny-treats/baked-goods/cake_birthday.gltf',
  cake_birthday: 'tiny-treats/baked-goods/cake_birthday.gltf',
  cake_chocolate: 'tiny-treats/baked-goods/cake_chocolate.gltf',
  'cake-giant': 'tiny-treats/baked-goods/cake_birthday.gltf',
  cupcake: 'tiny-treats/baked-goods/cupcake.gltf',
  pie: 'tiny-treats/baked-goods/cake_strawberry.gltf',
  pie_apple: 'tiny-treats/baked-goods/cake_strawberry.gltf',
  pie_cherry: 'tiny-treats/baked-goods/cake_strawberry.gltf',
  cookie: 'kaykit/packs/holiday/cookie.gltf',

  // === Holiday Pack — PRESENTS ===
  present: 'kaykit/packs/holiday/present_A_red.gltf',
  present_A_red: 'kaykit/packs/holiday/present_A_red.gltf',
  present_B_blue: 'kaykit/packs/holiday/present_B_blue.gltf',
  present_C_green: 'kaykit/packs/holiday/present_C_green.gltf',
  balloon: 'kaykit/packs/holiday/present_sphere_A_red.gltf',
  candle: 'kaykit/packs/holiday/candycane_small.gltf',
  stars: 'kaykit/packs/holiday/bell_decorated.gltf',

  // === Dungeon Pack ===
  bone: 'kaykit/packs/halloween/bone_A.gltf',
  torch: 'kaykit/packs/dungeon/torch_lit.gltf',
  barrel: 'kaykit/packs/dungeon/barrel_large.gltf',
  crate: 'kaykit/packs/dungeon/barrel_small.gltf',
  chest: 'kaykit/packs/dungeon/barrel_large_decorated.gltf',
  banner_blue: 'kaykit/packs/dungeon/banner_blue.gltf',
  banner_red: 'kaykit/packs/dungeon/banner_patternA_red.gltf',
  table_long: 'kaykit/packs/dungeon/table_long_decorated_A.gltf',
  book: 'kaykit/packs/dungeon/book_brown.gltf',
  book_stack: 'kaykit/packs/furniture/book_set.gltf',

  // === Restaurant Pack — PIZZA & FOOD ===
  pizza: 'kaykit/packs/restaurant/food_pizza_pepperoni_plated.gltf',
  pizza_pepperoni: 'kaykit/packs/restaurant/food_pizza_pepperoni_plated.gltf',
  pizza_cheese: 'kaykit/packs/restaurant/food_pizza_cheese_plated.gltf',
  plate: 'kaykit/packs/restaurant/plate.gltf',
  plates: 'kaykit/packs/restaurant/dishrack_plates.gltf',
  'soup-bowl': 'kaykit/packs/restaurant/bowl.gltf',
  oven: 'kaykit/packs/restaurant/oven.gltf',
  pan: 'kaykit/packs/restaurant/pan_A.gltf',
  pot: 'kaykit/packs/restaurant/pot_A.gltf',
  stove: 'kaykit/packs/restaurant/stove_multi.gltf',
  chair_restaurant: 'kaykit/packs/restaurant/chair_A.gltf',
  chair_A: 'kaykit/packs/restaurant/chair_A.gltf',
  sandwich: 'kaykit/packs/restaurant/food_burger.gltf',
  fish: 'kaykit/packs/restaurant/food_dinner.gltf',
  teapot: 'kaykit/packs/restaurant/pot_B.gltf',

  // === Space Base Pack ===
  rocket: 'kaykit/packs/space_base/basemodule_A.gltf',
  basemodule_A: 'kaykit/packs/space_base/basemodule_A.gltf',
  basemodule_B: 'kaykit/packs/space_base/basemodule_B.gltf',
  basemodule_garage: 'kaykit/packs/space_base/basemodule_garage.gltf',
  cargo_A: 'kaykit/packs/space_base/cargo_A.gltf',
  solarpanel: 'kaykit/packs/space_base/solarpanel.gltf',
  dome: 'kaykit/packs/space_base/dome.gltf',
  moon: 'kaykit/packs/space_base/dome.gltf',
  flag: 'kaykit/packs/dungeon/banner_blue.gltf',
  spacesuit: 'kaykit/packs/space_base/cargo_A.gltf',

  // === Kitchen extras ===
  sink: 'tiny-treats/charming-kitchen/stove.gltf',

  // === Furniture Pack ===
  desk: 'kaykit/packs/furniture/desk.gltf',
  table: 'kaykit/packs/furniture/desk.gltf',
  table_round: 'kaykit/packs/restaurant/chair_stool.gltf',
  chair: 'kaykit/packs/furniture/chair_A.gltf',
  fridge: 'tiny-treats/charming-kitchen/fridge.gltf',
  toaster: 'tiny-treats/charming-kitchen/stove.gltf',

  // === RPG Tools / Weapons ===
  sword: 'kaykit/packs/dungeon/sword_shield.gltf',
  shield: 'kaykit/packs/dungeon/banner_shield_blue.gltf',
  pencil: 'kaykit/packs/rpg_tools/pencil_A_long.gltf',
  hammer: 'kaykit/packs/rpg_tools/hammer.gltf',
  saw: 'kaykit/packs/rpg_tools/saw.gltf',
  anvil: 'kaykit/packs/rpg_tools/anvil.gltf',
  magnifying_glass: 'kaykit/packs/rpg_tools/magnifying_glass.gltf',
  lantern: 'kaykit/packs/rpg_tools/lantern.gltf',
  key: 'kaykit/packs/rpg_tools/key_A.gltf',
  scissors: 'kaykit/packs/rpg_tools/scissors.gltf',
  pickaxe: 'kaykit/packs/rpg_tools/pickaxe.gltf',
  shovel: 'kaykit/packs/rpg_tools/shovel.gltf',
  bucket: 'kaykit/packs/rpg_tools/bucket_metal.gltf',

  // === Real Musical Instruments (Poly-Pizza Coffeehouse) ===
  guitar: 'poly-pizza/interior/coffeehouse-lounge/Electric guitar.glb',
  guitar_amp: 'poly-pizza/interior/coffeehouse-lounge/Guitar Amp.glb',
  drums: 'poly-pizza/interior/coffeehouse-lounge/Drum Set.glb',
  drumstick: 'poly-pizza/interior/coffeehouse-lounge/Drum stick.glb',
  keyboard: 'poly-pizza/interior/coffeehouse-lounge/Cash register.glb',
  microphone: 'poly-pizza/interior/coffeehouse-lounge/Microphone.glb',
  bass_speakers: 'poly-pizza/interior/coffeehouse-lounge/Bass Speakers.glb',
  speaker: 'poly-pizza/interior/coffeehouse-lounge/Speaker.glb',
  floor_monitor: 'poly-pizza/interior/coffeehouse-lounge/Floor Monitor.glb',
  effects_pedal: 'poly-pizza/interior/coffeehouse-lounge/Electric Guitar Effects Pedal.glb',
  headphones: 'poly-pizza/interior/coffeehouse-lounge/Headphones.glb',

  // === School / Learning Props ===
  journal: 'kaykit/packs/rpg_tools/journal_open.gltf',
  journal_closed: 'kaykit/packs/rpg_tools/journal_closed.gltf',
  map: 'kaykit/packs/rpg_tools/map.gltf',
  map_rolled: 'kaykit/packs/rpg_tools/map_rolled.gltf',
  blueprint: 'kaykit/packs/rpg_tools/blueprint.gltf',
  compass: 'kaykit/packs/rpg_tools/drafting_compass.gltf',
  chisel: 'kaykit/packs/rpg_tools/chisel.gltf',

  // === Medieval Props (Quaternius) ===
  bookcase: 'quaternius/medieval-props/Bookcase_2.gltf',
  book_stack_medieval: 'quaternius/medieval-props/Book_Stack_2.gltf',
  scroll_ancient: 'quaternius/medieval-props/Scroll_1.gltf',
  scroll_2: 'quaternius/medieval-props/Scroll_2.gltf',
  potion_bottle: 'quaternius/medieval-props/Potion_2.gltf',
  potion_flask: 'quaternius/medieval-props/Potion_4.gltf',
  cauldron_medieval: 'quaternius/medieval-props/Cauldron.gltf',
  candle_medieval: 'quaternius/medieval-props/Candle_1.gltf',
  candlestick: 'quaternius/medieval-props/CandleStick.gltf',
  candlestick_triple: 'quaternius/medieval-props/CandleStick_Triple.gltf',
  lantern_wall: 'quaternius/medieval-props/Lantern_Wall.gltf',
  coin_pile: 'quaternius/medieval-props/Coin_Pile_2.gltf',
  mug_medieval: 'quaternius/medieval-props/Mug.gltf',
  workbench: 'quaternius/medieval-props/Workbench.gltf',
  bookstand: 'quaternius/medieval-props/BookStand.gltf',
  chest_wood: 'quaternius/medieval-props/Chest_Wood.gltf',
  barrel_medieval: 'quaternius/medieval-props/Barrel.gltf',
  table_large: 'quaternius/medieval-props/Table_Large.gltf',
  stool: 'quaternius/medieval-props/Stool.gltf',
  shelf: 'quaternius/medieval-props/Shelf_Simple.gltf',

  // === Halloween (KayKit) ===
  candy_bucket: 'kaykit/packs/halloween/candy_bucket_B_decorated.gltf',
  lollipop: 'kaykit/packs/halloween/lollipop_blue.gltf',
  lollipop_pink: 'kaykit/packs/halloween/lollipop_pink.gltf',
  lollipop_orange: 'kaykit/packs/halloween/lollipop_orange.gltf',
  candy_blue: 'kaykit/packs/halloween/candy_blue_A.gltf',
  candy_orange: 'kaykit/packs/halloween/candy_orange_A.gltf',
  candy_pink: 'kaykit/packs/halloween/candy_pink_A.gltf',
  candycorn: 'kaykit/packs/halloween/candycorn.gltf',
  coffin: 'kaykit/packs/halloween/coffin_decorated.gltf',
  grave: 'kaykit/packs/halloween/grave_A.gltf',
  scarecrow: 'kaykit/packs/halloween/scarecrow.gltf',
  pitchfork: 'kaykit/packs/halloween/pitchfork.gltf',
  pumpkin: 'kaykit/packs/halloween/pumpkin_orange.gltf',
  pumpkin_jackolantern: 'kaykit/packs/halloween/pumpkin_orange_jackolantern.gltf',
  skull_candle: 'kaykit/packs/halloween/skull_candle.gltf',
  wagon: 'kaykit/packs/halloween/wagon.gltf',
  lantern_hanging: 'kaykit/packs/halloween/lantern_hanging.gltf',
  lantern_standing: 'kaykit/packs/halloween/lantern_standing.gltf',

  // === Bakery Interior (Tiny Treats) ===
  bread_oven: 'tiny-treats/bakery-interior/bread_oven.gltf',
  coffee_machine: 'tiny-treats/bakery-interior/coffee_machine.gltf',
  stand_mixer: 'tiny-treats/bakery-interior/stand_mixer.gltf',
  mixing_bowl: 'tiny-treats/bakery-interior/mixing_bowl.gltf',
  dough_roller: 'tiny-treats/bakery-interior/dough_roller.gltf',
  dough_ball: 'tiny-treats/bakery-interior/dough_ball.gltf',
  flour_sack: 'tiny-treats/bakery-interior/flour_sack_open.gltf',
  cookie_jar: 'tiny-treats/bakery-interior/cookie_jar.gltf',
  counter_table: 'tiny-treats/bakery-interior/counter_table.gltf',
  display_case: 'tiny-treats/bakery-interior/display_case_long.gltf',
  pastry_stand: 'tiny-treats/bakery-interior/pastry_stand_A_decorated.gltf',
  serving_tray: 'tiny-treats/bakery-interior/serving_tray.gltf',
  whisk: 'tiny-treats/bakery-interior/whisk.gltf',
  scale: 'tiny-treats/bakery-interior/scale.gltf',
  cream_puff: 'tiny-treats/bakery-interior/cream_puff.gltf',
  pretzel: 'tiny-treats/bakery-interior/pretzel.gltf',
  macaron: 'tiny-treats/bakery-interior/macaron_pink.gltf',
  macaron_blue: 'tiny-treats/bakery-interior/macaron_blue.gltf',
  macaron_yellow: 'tiny-treats/bakery-interior/macaron_yellow.gltf',
  egg: 'tiny-treats/bakery-interior/egg_A.gltf',
  milk: 'tiny-treats/bakery-interior/milk.gltf',
  cash_register: 'tiny-treats/bakery-interior/cash_register.gltf',
  mug_bakery: 'tiny-treats/bakery-interior/mug_A_blue.gltf',

  // === Outdoors (Tiny Treats + Dungeon) ===
  tree: 'tiny-treats/pretty-park/tree.gltf',
  tree_large: 'tiny-treats/pretty-park/tree_large.gltf',
  rock: 'kaykit/packs/forest_nature/Rock_1_A_Color1.gltf',
  bush: 'tiny-treats/pretty-park/bush.gltf',
  bench: 'tiny-treats/pretty-park/bench.gltf',
  fountain: 'tiny-treats/pretty-park/fountain.gltf',
  river: 'tiny-treats/pretty-park/bench.gltf',
  lamp: 'kaykit/packs/dungeon/torch.gltf',
  fence: 'kaykit/packs/halloween/fence.gltf',
  sign: 'kaykit/packs/dungeon/banner_blue.gltf',

  // === Picnic & Food (Tiny Treats) ===
  apple: 'tiny-treats/pleasant-picnic/apple.gltf',
  picnic_basket: 'tiny-treats/pleasant-picnic/cooler.gltf',
  picnic_basket_round: 'tiny-treats/pleasant-picnic/cooler.gltf',
  picnic_blanket: 'tiny-treats/pleasant-picnic/picnic_blanket_red.gltf',
  basket: 'tiny-treats/pleasant-picnic/cooler.gltf',
  blanket: 'tiny-treats/pleasant-picnic/picnic_blanket_red.gltf',
  bread: 'tiny-treats/pleasant-picnic/cheese_A.gltf',
  bottle: 'tiny-treats/pleasant-picnic/drink_can.gltf',
  cup: 'tiny-treats/pleasant-picnic/mug.gltf',

  // === Playground (Tiny Treats) ===
  slide: 'tiny-treats/fun-playground/slide_A.gltf',
  swing: 'tiny-treats/fun-playground/swing_A_large.gltf',
  seesaw: 'tiny-treats/fun-playground/seesaw_large.gltf',
  sandbox: 'tiny-treats/fun-playground/sandbox_square_decorated.gltf',
  merry_go_round: 'tiny-treats/fun-playground/merry_go_round.gltf',

  // === Food (Quaternius GLB) ===
  burger: 'quaternius/food/burger_001.glb',
  carrot: 'quaternius/food/carrot_001.glb',
  chips: 'quaternius/food/chips_001.glb',
  coffee: 'quaternius/food/coffee_001.glb',
  donut_food: 'quaternius/food/donut_001.glb',
  drink: 'quaternius/food/drink_001.glb',
  fish_food: 'quaternius/food/fish_001.glb',
  ice_cream: 'quaternius/food/ice_cream_dish_001.glb',
  banana: 'quaternius/food/banana_001.glb',
  sandwich_food: 'quaternius/food/sandwich_001.glb',
  sausages: 'quaternius/food/sausages_001.glb',
  sushi: 'quaternius/food/sushi_dish_001.glb',
  tomato: 'quaternius/food/tomato_001.glb',
  yogurt: 'quaternius/food/yogurt_001.glb',
  peach: 'quaternius/food/peach_001.glb',
  eggplant: 'quaternius/food/eggplant_001.glb',

  // === Christmas (Quaternius GLB) ===
  christmas_tree: 'quaternius/christmas/Christmass_tree_indoor_001.glb',
  snowman: 'quaternius/christmas/Snowman_001.glb',
  present_xmas: 'quaternius/christmas/Present_001.glb',
  candy_cane: 'quaternius/christmas/Shugar_cane_001.glb',
  wreath: 'quaternius/christmas/Advent_Wreath_001.glb',
  garland: 'quaternius/christmas/Garland_001.glb',
  stocking: 'quaternius/christmas/Christmass_sock_001.glb',
  fireplace_xmas: 'quaternius/christmas/Fireplace_001.glb',
  cookie_xmas: 'quaternius/christmas/Cookie_001.glb',
  teapot_xmas: 'quaternius/christmas/Teapot_001.glb',
  armchair: 'quaternius/christmas/Armchair_001.glb',
  couch: 'quaternius/christmas/Couch_001.glb',

  // === Misc ===
  lunchbox: 'tiny-treats/pleasant-picnic/cooler.gltf',
  'fire-extinguisher': 'kaykit/packs/restaurant/pot_large.gltf',
  'pillow-fort': 'kaykit/packs/dungeon/barrel_large.gltf',
  potion: 'quaternius/medieval-props/Potion_1.gltf',
  scroll: 'quaternius/medieval-props/Scroll_1.gltf',
  bow: 'kaykit/packs/rpg_tools/fishing_rod.gltf',

  // =========================================================================
  // EXTENDED PROP LIBRARY — For Level 4/5 freeform text support
  // =========================================================================

  // === Animals (Quaternius GLB — animated) ===
  cat: 'quaternius/animals/kitty_001.glb',
  dog: 'quaternius/animals/dog_001.glb',
  horse: 'quaternius/animals/horse_001.glb',
  chicken: 'quaternius/animals/chicken_001.glb',
  deer: 'quaternius/animals/deer_001.glb',
  penguin: 'quaternius/animals/pinguin_001.glb',
  tiger: 'quaternius/animals/tiger_001.glb',

  // === Animals (Poly-Pizza — static) ===
  bear: 'poly-pizza/animals/animal-kit/Bear.glb',
  fox: 'poly-pizza/animals/animal-kit/Fox.glb',
  rabbit: 'poly-pizza/animals/animal-kit/Rabbit.glb',
  sheep: 'poly-pizza/animals/animal-kit/Sheep.glb',
  cow: 'poly-pizza/animals/animal-kit/Cow.glb',
  pig: 'poly-pizza/animals/animal-kit/Penguin.glb',
  duck: 'poly-pizza/animals/animal-kit/Duck.glb',
  frog: 'poly-pizza/animals/animal-kit/Frog.glb',
  bird: 'poly-pizza/animals/animal-kit/Bird.glb',
  giraffe: 'poly-pizza/animals/animal-kit/Giraffe.glb',
  shark: 'poly-pizza/animals/animal-kit/Shark.glb',
  lizard: 'poly-pizza/animals/animal-kit/Lizard.glb',
  corgi: 'poly-pizza/animals/animal-kit/Corgi.glb',
  chick: 'poly-pizza/animals/animal-kit/Chick.glb',

  // === Creatures (Quaternius — animated fantasy creatures) ===
  dragon: 'quaternius/creatures/Dragon.gltf',
  ghost: 'quaternius/creatures/Ghost.gltf',
  goblin: 'quaternius/creatures/Goblin.gltf',
  skeleton_creature: 'quaternius/creatures/Skeleton.gltf',
  zombie: 'quaternius/creatures/Zombie.gltf',
  bat: 'quaternius/creatures/Bat.gltf',
  bee: 'quaternius/creatures/Bee.gltf',
  crab: 'quaternius/creatures/Crab.gltf',
  wolf: 'quaternius/creatures/Wolf.gltf',
  orc: 'quaternius/creatures/Orc.gltf',
  panda: 'quaternius/creatures/Panda.gltf',
  mushroom_creature: 'quaternius/creatures/Mushroom.gltf',
  hedgehog: 'quaternius/creatures/Hedgehog.gltf',
  yeti: 'quaternius/creatures/Yeti.gltf',
  raccoon: 'quaternius/creatures/Raccoon.gltf',
  slime: 'quaternius/creatures/GreenBlob.gltf',
  demon: 'quaternius/creatures/Demon.gltf',
  cyclops: 'quaternius/creatures/Cyclops.gltf',
  giant: 'quaternius/creatures/Giant.gltf',
  alien: 'quaternius/creatures/Alien.gltf',
  fish_creature: 'quaternius/creatures/Fish.gltf',
  dino: 'quaternius/creatures/Dino.gltf',
  ninja: 'quaternius/creatures/Ninja.gltf',
  cactus_creature: 'quaternius/creatures/Cactus.gltf',
  pigeon: 'quaternius/creatures/Pigeon.gltf',

  // === Nature (Quaternius) ===
  birch_tree: 'quaternius/nature/BirchTree_1.gltf',
  common_tree: 'quaternius/nature/CommonTree_1.gltf',
  pine_tree: 'quaternius/nature/Pine_1.gltf',
  dead_tree: 'quaternius/nature/DeadTree_1.gltf',
  flower: 'quaternius/nature/Flower_1.gltf',
  flower_clump: 'quaternius/nature/Flower_1_Clump.gltf',
  flower_group: 'quaternius/nature/Flower_3_Group.gltf',
  fern: 'quaternius/nature/Fern_1.gltf',
  clover: 'quaternius/nature/Clover_1.gltf',
  mushroom: 'quaternius/nature/Mushroom_Common.gltf',
  fruit_tree: 'quaternius/nature/Tree_Fruit.gltf',
  bush_flowers: 'quaternius/nature/Bush_Flowers.gltf',
  bush_fruit: 'quaternius/nature/Bush_Fruit.gltf',
  cloud: 'quaternius/nature/Cloud_1.gltf',
  pebble: 'quaternius/nature/Pebble_Round_1.gltf',
  rock_platform: 'quaternius/nature/RockPlatforms_1.gltf',

  // === Decorations / Japanese Kitchen (Quaternius) ===
  bamboo: 'quaternius/decorations/Decoration_Bamboo.gltf',
  bell: 'quaternius/decorations/Decoration_Bell.gltf',
  carpet: 'quaternius/decorations/Decoration_Carpet.gltf',
  painting: 'quaternius/decorations/Decoration_Painting.gltf',
  plant_decor: 'quaternius/decorations/Decoration_Plant1.gltf',
  sakura_tree: 'quaternius/decorations/Decoration_SakuraTree.gltf',
  sakura_flower: 'quaternius/decorations/Decoration_SakuraFlower.gltf',
  torii_gate: 'quaternius/decorations/Environment_ToriiGate.gltf',
  sofa: 'quaternius/decorations/Environment_Sofa.gltf',
  cutting_table: 'quaternius/decorations/Environment_CuttingTable.gltf',
  kitchen_knives: 'quaternius/decorations/Environment_KitchenKnives.gltf',
  japanese_bowl: 'quaternius/decorations/Environment_Bowl.gltf',
  japanese_cabinet: 'quaternius/decorations/Environment_Cabinet_Doors.gltf',
  japanese_fridge: 'quaternius/decorations/Environment_Fridge.gltf',
  japanese_oven: 'quaternius/decorations/Environment_Oven.gltf',
  truck: 'quaternius/decorations/Truck.gltf',

  // === Fantasy Cards & Ships (Quaternius) ===
  fireball: 'quaternius/fantasy/1_Fireball.gltf',
  wizard_card: 'quaternius/fantasy/30_Wizard.gltf',
  king_card: 'quaternius/fantasy/6_King.gltf',
  ship_large: 'quaternius/fantasy/Ship_Large.gltf',
  ship_small: 'quaternius/fantasy/Ship_Small.gltf',
  dice: 'quaternius/fantasy/28_RollDice.gltf',

  // === Items & Collectibles (Quaternius) ===
  gem_blue: 'quaternius/items/Gem_Blue.gltf',
  gem_green: 'quaternius/items/Gem_Green.gltf',
  gem_pink: 'quaternius/items/Gem_Pink.gltf',
  heart: 'quaternius/items/Heart.gltf',
  star: 'quaternius/items/Star.gltf',
  coin_item: 'quaternius/items/Coin.gltf',
  gold_bag: 'quaternius/items/Prop_GoldBag.gltf',
  thunder: 'quaternius/items/Thunder.gltf',
  chest_closed: 'quaternius/items/Prop_Chest_Closed.gltf',
  chest_gold_item: 'quaternius/items/Prop_Chest_Gold.gltf',

  // === Vehicles (Quaternius — spaceships + cars) ===
  spaceship: 'quaternius/vehicles/Spaceship_BarbaraTheBee.gltf',
  spaceship_frog: 'quaternius/vehicles/Spaceship_FinnTheFrog.gltf',
  rover: 'quaternius/vehicles/Rover_1.gltf',
  pickup_truck: 'quaternius/vehicles/Vehicle_Pickup.gltf',
  sports_car: 'quaternius/vehicles/Vehicle_Sports.gltf',
  big_truck: 'quaternius/vehicles/Vehicle_Truck.gltf',
  tank: 'quaternius/vehicles/Striker.gltf',

  // === Game Mechanics (Quaternius) ===
  cannon: 'quaternius/game-mechanics/Cannon.gltf',
  cannonball: 'quaternius/game-mechanics/Cannonball.gltf',
  bridge: 'quaternius/game-mechanics/Bridge_Small.gltf',
  lever: 'quaternius/game-mechanics/Lever.gltf',
  spikes: 'quaternius/game-mechanics/Spikes.gltf',
  crystal_big: 'quaternius/game-mechanics/Crystal_Big.gltf',
  crystal_small: 'quaternius/game-mechanics/Crystal_Small.gltf',
  door_game: 'quaternius/game-mechanics/Door.gltf',
  stairs: 'quaternius/game-mechanics/Stairs.gltf',
  tower: 'quaternius/game-mechanics/Tower.gltf',
  goal_flag: 'quaternius/game-mechanics/Goal_Flag.gltf',
  cart: 'quaternius/game-mechanics/Cart.gltf',
  pipe: 'quaternius/game-mechanics/Pipe_Straight.gltf',

  // === Poly-Pizza Food Kit (massive — kid-friendly names) ===
  bacon: 'poly-pizza/food/food-kit/Bacon.glb',
  broccoli: 'poly-pizza/food/food-kit/Broccoli.glb',
  cheese: 'poly-pizza/food/food-kit/Cheese Cut.glb',
  cherries: 'poly-pizza/food/food-kit/Cherries.glb',
  chocolate: 'poly-pizza/food/food-kit/Chocolate.glb',
  cocktail: 'poly-pizza/food/food-kit/Cocktail.glb',
  corn: 'poly-pizza/food/food-kit/Corn.glb',
  corn_dog: 'poly-pizza/food/food-kit/Corn Dog.glb',
  croissant: 'poly-pizza/food/food-kit/Croissant.glb',
  cutting_board: 'poly-pizza/food/food-kit/Cutting Board.glb',
  donut_chocolate: 'poly-pizza/food/food-kit/Donut Chocolate.glb',
  donut_sprinkles: 'poly-pizza/food/food-kit/Donut Sprinkles.glb',
  egg_cooked: 'poly-pizza/food/food-kit/Egg Cooked.glb',
  fish_bones: 'poly-pizza/food/food-kit/Fish Bones.glb',
  fries: 'poly-pizza/food/food-kit/Fries.glb',
  frying_pan: 'poly-pizza/food/food-kit/Frying Pan.glb',
  gingerbread: 'poly-pizza/food/food-kit/Ginger Bread.glb',
  grapes: 'poly-pizza/food/food-kit/Grapes.glb',
  honey: 'poly-pizza/food/food-kit/Honey.glb',
  hot_dog: 'poly-pizza/food/food-kit/Hot Dog.glb',
  knife_block: 'poly-pizza/food/food-kit/Knife Block.glb',
  lemon: 'poly-pizza/food/food-kit/Lemon.glb',
  loaf: 'poly-pizza/food/food-kit/Loaf.glb',
  baguette: 'poly-pizza/food/food-kit/Loaf Baguette.glb',
  lollypop_food: 'poly-pizza/food/food-kit/Lollypop.glb',
  meat_ribs: 'poly-pizza/food/food-kit/Meat Ribs.glb',
  muffin: 'poly-pizza/food/food-kit/Muffin.glb',
  onion: 'poly-pizza/food/food-kit/Onion.glb',
  orange: 'poly-pizza/food/food-kit/Orange.glb',
  pancakes: 'poly-pizza/food/food-kit/Pancakes.glb',
  peanut_butter: 'poly-pizza/food/food-kit/Peanut Butter.glb',
  pear: 'poly-pizza/food/food-kit/Pear.glb',
  pepper: 'poly-pizza/food/food-kit/Pepper.glb',
  pie_food: 'poly-pizza/food/food-kit/Pie.glb',
  pineapple: 'poly-pizza/food/food-kit/Pineapple.glb',
  pizza_box: 'poly-pizza/food/food-kit/Pizza Box.glb',
  pizza_food: 'poly-pizza/food/food-kit/Pizza.glb',
  popsicle: 'poly-pizza/food/food-kit/Popsicle.glb',
  pudding: 'poly-pizza/food/food-kit/Pudding.glb',
  pumpkin_food: 'poly-pizza/food/food-kit/Pumpkin.glb',
  rice_ball: 'poly-pizza/food/food-kit/Rice Ball.glb',
  rolling_pin: 'poly-pizza/food/food-kit/Rolling Pin.glb',
  salad: 'poly-pizza/food/food-kit/Salad.glb',
  soda: 'poly-pizza/food/food-kit/Soda.glb',
  soda_can: 'poly-pizza/food/food-kit/Soda Can.glb',
  strawberry: 'poly-pizza/food/food-kit/Strawberry.glb',
  sub_sandwich: 'poly-pizza/food/food-kit/Sub.glb',
  sundae: 'poly-pizza/food/food-kit/Sundae.glb',
  sushi_egg: 'poly-pizza/food/food-kit/Sushi Egg.glb',
  sushi_salmon: 'poly-pizza/food/food-kit/Sushi Salmon.glb',
  taco: 'poly-pizza/food/food-kit/Taco.glb',
  turkey: 'poly-pizza/food/food-kit/Turkey.glb',
  waffle: 'poly-pizza/food/food-kit/Waffle.glb',
  watermelon: 'poly-pizza/food/food-kit/Watermelon.glb',
  whipped_cream: 'poly-pizza/food/food-kit/Whipped Cream.glb',
  whole_ham: 'poly-pizza/food/food-kit/Whole Ham.glb',
  wine: 'poly-pizza/food/food-kit/Wine Red.glb',
  cabbage: 'poly-pizza/food/food-kit/Cabbage.glb',
  avocado: 'poly-pizza/food/food-kit/Avocado Half.glb',

  // === Concert / Stage (Poly-Pizza) ===
  concert_stage: 'poly-pizza/misc/concert-pack/Concert Stage.glb',
  stage: 'poly-pizza/misc/concert-pack/Stage.glb',
  spotlight: 'poly-pizza/misc/concert-pack/Spotlight.glb',
  motorised_spotlight: 'poly-pizza/misc/concert-pack/Motorised Spotlight.glb',
  barricade: 'poly-pizza/misc/concert-pack/Barricade.glb',
  mic: 'poly-pizza/misc/concert-pack/Mic.glb',

  // === Space (Poly-Pizza) ===
  astronaut: 'poly-pizza/space/ultimate-space-kit/Astronaut.glb',
  geodesic_dome: 'poly-pizza/space/ultimate-space-kit/Geodesic Dome.glb',
  space_house: 'poly-pizza/space/ultimate-space-kit/House Single.glb',
  planet: 'poly-pizza/space/ultimate-space-kit/Planet.glb',
  mech: 'poly-pizza/space/ultimate-space-kit/Mech.glb',

  // === House Plants (Tiny Treats) ===
  cactus: 'tiny-treats/house-plants/cactus_A.gltf',
  monstera: 'tiny-treats/house-plants/monstera_plant_medium_potted.gltf',
  potted_plant: 'tiny-treats/house-plants/pothos_plant_medium_potted.gltf',
  succulent: 'tiny-treats/house-plants/succulent_plant_pot_small.gltf',
  watering_can: 'tiny-treats/house-plants/watering_can_A.gltf',
  yucca: 'tiny-treats/house-plants/yucca_plant_medium_potted.gltf',

  // === Bathroom (Tiny Treats — comedy props) ===
  rubber_duck: 'tiny-treats/bubbly-bathroom/ducky.gltf',
  bathtub: 'tiny-treats/bubbly-bathroom/bath.gltf',
  toilet: 'tiny-treats/bubbly-bathroom/toilet.gltf',
  shower: 'tiny-treats/bubbly-bathroom/shower.gltf',
  mirror: 'tiny-treats/bubbly-bathroom/mirror.gltf',
  slippers: 'tiny-treats/bubbly-bathroom/slippers.gltf',
  soap: 'tiny-treats/bubbly-bathroom/soap_dish_blue.gltf',
  towel: 'tiny-treats/bubbly-bathroom/towel_blue.gltf',
  toothbrush: 'tiny-treats/bubbly-bathroom/toothbrush_blue.gltf',

  // === Bedroom (Tiny Treats — party/school props) ===
  bed: 'tiny-treats/playful-bedroom/bed_blue.gltf',
  alarm_clock: 'tiny-treats/playful-bedroom/alarm_clock.gltf',
  computer: 'tiny-treats/playful-bedroom/computer.gltf',
  teddy_bear: 'tiny-treats/playful-bedroom/teddy_bear.gltf',
  piggybank: 'tiny-treats/playful-bedroom/piggybank.gltf',
  soccer_ball: 'tiny-treats/playful-bedroom/soccer_ball.gltf',
  rubiks_cube: 'tiny-treats/playful-bedroom/rubicks_cube_A.gltf',
  play_blocks: 'tiny-treats/playful-bedroom/play_block_A.gltf',
  poster: 'tiny-treats/playful-bedroom/poster.gltf',
  lamp_desk: 'tiny-treats/playful-bedroom/lamp_A.gltf',
  closet: 'tiny-treats/playful-bedroom/closet_blue.gltf',
  nightstand: 'tiny-treats/playful-bedroom/nightstand_blue.gltf',

  // === Bakery Exterior (Tiny Treats) ===
  parasol: 'tiny-treats/bakery-building/parasol_blue.gltf',
  shop_cart: 'tiny-treats/bakery-building/shop_cart.gltf',
  newspaper: 'tiny-treats/bakery-building/newspaper.gltf',
  street_lantern: 'tiny-treats/bakery-building/street_lantern.gltf',
  cafe_table: 'tiny-treats/bakery-building/table_round_A.gltf',
  cafe_chair: 'tiny-treats/bakery-building/chair_A.gltf',
  open_sign: 'tiny-treats/bakery-building/open_close_sign.gltf',
  flower_box: 'tiny-treats/bakery-building/flower_box_straight.gltf',

  // === Homely House (Tiny Treats) ===
  mailbox: 'tiny-treats/homely-house/mailbox.gltf',
  boots: 'tiny-treats/homely-house/boots.gltf',
  doormat: 'tiny-treats/homely-house/doormat.gltf',
  gate: 'tiny-treats/homely-house/gate_single.gltf',
  package: 'tiny-treats/homely-house/package.gltf',
  letter: 'tiny-treats/homely-house/letter.gltf',

  // === Living Room (full furniture set) ===
  aquarium: 'living-room/aquarium.gltf',
  rocking_chair: 'living-room/rocking_chair_brown.gltf',
  record_player: 'living-room/record_player_brown.gltf',
  radio: 'living-room/radio_brown.gltf',
  tv: 'living-room/tv_B_standing.gltf',
  clock: 'living-room/clock_wall_A.gltf',
  clock_standing: 'living-room/clock_standing.gltf',
  calendar: 'living-room/calendar.gltf',
  candles_lr: 'living-room/candles.gltf',
  pillow: 'living-room/pillow_A_blue.gltf',
  rug: 'living-room/rug_A_large.gltf',
  couch_blue: 'living-room/couch_A_blue.gltf',
  lamp_floor: 'living-room/lamp_standing_A.gltf',
  picture_frame: 'living-room/picture_frame_A_blue.gltf',
  flower_vase: 'living-room/flower_vase_A.gltf',
  tray: 'living-room/tray_decorated.gltf',

  // === Cartoon City ===
  car: 'cartoon-city/Car_06.glb',
  van: 'cartoon-city/Van.glb',
  bus_stop: 'cartoon-city/Bus_Stop_02.glb',
  futuristic_car: 'cartoon-city/Futuristic_Car_1.glb',
  fountain_city: 'cartoon-city/Fountain_03.glb',
  billboard: 'cartoon-city/Billboard_2x1_03.glb',
  traffic_light: 'cartoon-city/traffic_light_001.glb',
  trash_can: 'cartoon-city/Trash_Can_04.glb',
  palm_tree: 'cartoon-city/Palm_03.glb',
  spotlight_city: 'cartoon-city/Spotlight_01.glb',
}

/** Scale overrides for spawned props — Tiny Treats models are miniature and need scaling up */
const PROP_SCALE: Record<string, number> = {
  // Baked goods (tiny — need ~3x to be visible next to 2.6u characters)
  cake: 3.0, cake_birthday: 3.0, cake_chocolate: 3.0, 'cake-giant': 4.0,
  cupcake: 3.0, pie: 3.0, pie_apple: 3.0, pie_cherry: 3.0, cookie: 2.5, bread: 3.0,
  // Picnic items
  picnic_basket: 2.5, picnic_basket_round: 2.5, picnic_blanket: 3.0,
  sandwich: 3.0, teapot: 3.0, apple: 3.0, basket: 2.5, blanket: 3.0,
  bottle: 2.5, cup: 2.5, lunchbox: 2.5,
  // Kitchen
  stove: 2.0, fridge: 2.0, pot: 2.5, pan: 2.5, oven: 2.0,
  // Restaurant food
  pizza: 2.5, pizza_pepperoni: 2.5, pizza_cheese: 2.5, plate: 2.5, plates: 2.0,
  // Park
  bench: 2.0, tree: 2.0, tree_large: 2.0, bush: 2.0,
  // Playground
  slide: 2.0, swing: 2.0, seesaw: 2.0, sandbox: 2.0, merry_go_round: 2.0,
  // Holiday
  present: 2.5, present_A_red: 2.5, present_B_blue: 2.5, present_C_green: 2.5,
  balloon: 2.5, candle: 2.5,
  // Food (Quaternius GLB)
  burger: 2.5, carrot: 2.5, chips: 2.5, coffee: 2.5, donut_food: 2.5,
  drink: 2.5, fish_food: 2.5, ice_cream: 2.5, banana: 2.5, sandwich_food: 2.5,
  sausages: 2.5, sushi: 2.5, tomato: 2.5, yogurt: 2.5, peach: 2.5, eggplant: 2.5,
  // Christmas (Quaternius GLB)
  christmas_tree: 1.5, snowman: 1.5, present_xmas: 2.0, candy_cane: 2.0,
  wreath: 2.0, garland: 1.5, stocking: 2.0, fireplace_xmas: 1.2,
  cookie_xmas: 2.5, teapot_xmas: 2.5, armchair: 1.2, couch: 1.2,
  // Musical instruments (Poly-Pizza GLB — life-size, scale down to match scene)
  guitar: 1.5, guitar_amp: 1.2, drums: 1.0, drumstick: 2.0,
  keyboard: 1.5, microphone: 2.0, bass_speakers: 1.0, speaker: 1.2,
  floor_monitor: 1.2, effects_pedal: 2.0, headphones: 2.0,
  // Medieval props (Quaternius GLTF — slightly large)
  bookcase: 1.0, book_stack_medieval: 1.5, scroll_ancient: 2.0, scroll_2: 2.0,
  potion_bottle: 2.0, potion_flask: 2.0, potion: 2.0,
  cauldron_medieval: 1.2, candle_medieval: 2.0,
  candlestick: 1.5, candlestick_triple: 1.5, lantern_wall: 1.5,
  coin_pile: 2.0, mug_medieval: 2.0, workbench: 1.0,
  bookstand: 1.2, chest_wood: 1.2, table_large: 1.0, stool: 1.2, shelf: 1.0,
  // RPG Tools (KayKit — small items need scaling up)
  pencil: 2.5, hammer: 2.0, saw: 2.0, anvil: 1.5,
  magnifying_glass: 2.5, lantern: 2.0, key: 2.5,
  scissors: 2.5, pickaxe: 1.5, shovel: 1.5, bucket: 1.5,
  journal: 2.0, journal_closed: 2.0, map: 2.0, map_rolled: 2.0,
  blueprint: 2.0, compass: 2.5, chisel: 2.5,
  // Halloween (KayKit)
  candy_bucket: 2.0, lollipop: 2.0, lollipop_pink: 2.0, lollipop_orange: 2.0,
  candy_blue: 2.0, candy_orange: 2.0, candy_pink: 2.0, candycorn: 2.5,
  coffin: 1.0, grave: 1.0, scarecrow: 1.0, pitchfork: 1.5,
  pumpkin: 1.5, pumpkin_jackolantern: 1.5, skull_candle: 2.0,
  wagon: 1.0, lantern_hanging: 1.5, lantern_standing: 1.5,
  // Bakery Interior (Tiny Treats — miniature, need scaling up)
  bread_oven: 2.0, coffee_machine: 2.5, stand_mixer: 2.5, mixing_bowl: 3.0,
  dough_roller: 3.0, dough_ball: 3.0, flour_sack: 2.5, cookie_jar: 2.5,
  counter_table: 2.0, display_case: 2.0, pastry_stand: 2.5,
  serving_tray: 3.0, whisk: 3.0, scale: 2.5,
  cream_puff: 3.0, pretzel: 3.0, macaron: 3.0, macaron_blue: 3.0, macaron_yellow: 3.0,
  egg: 3.0, milk: 2.5, cash_register: 2.5, mug_bakery: 2.5,
  // Outdoors
  rock: 1.5, fence: 1.5,
  // Extended library — Animals (Quaternius animated — scale varies)
  cat: 1.0, dog: 1.0, horse: 0.8, chicken: 1.0, deer: 0.8, penguin: 1.0, tiger: 0.8,
  // Animals (Poly-Pizza static — generally small)
  bear: 1.5, fox: 1.5, rabbit: 1.5, sheep: 1.5, cow: 1.2, pig: 1.5,
  duck: 1.5, frog: 2.0, bird: 1.5, giraffe: 0.8, shark: 1.0, lizard: 2.0,
  corgi: 1.5, chick: 2.0,
  // Creatures (Quaternius — variable sizes)
  dragon: 0.8, ghost: 1.0, goblin: 1.0, skeleton_creature: 1.0, zombie: 1.0,
  bat: 1.5, bee: 1.5, crab: 1.5, wolf: 1.0, orc: 0.8, panda: 1.0,
  mushroom_creature: 1.0, hedgehog: 1.5, yeti: 0.8, raccoon: 1.0, slime: 1.5,
  demon: 0.8, cyclops: 0.8, giant: 0.6, alien: 1.0, fish_creature: 1.5,
  dino: 0.8, ninja: 1.0, cactus_creature: 1.0, pigeon: 1.5,
  // Nature (Quaternius)
  birch_tree: 1.0, common_tree: 1.0, pine_tree: 1.0, dead_tree: 1.0,
  flower: 2.0, flower_clump: 1.5, flower_group: 1.5, fern: 1.5, clover: 2.0,
  mushroom: 1.5, fruit_tree: 1.0, bush_flowers: 1.0, bush_fruit: 1.0,
  cloud: 1.0, pebble: 2.0, rock_platform: 1.0,
  // Decorations (Quaternius)
  bamboo: 1.0, bell: 2.0, carpet: 1.0, painting: 1.5, plant_decor: 1.5,
  sakura_tree: 1.0, sakura_flower: 2.0, torii_gate: 0.8, sofa: 1.0,
  cutting_table: 1.0, kitchen_knives: 2.0, japanese_bowl: 2.0,
  japanese_cabinet: 1.0, japanese_fridge: 1.0, japanese_oven: 1.0, truck: 0.8,
  // Fantasy (Quaternius)
  fireball: 2.0, wizard_card: 2.0, king_card: 2.0,
  ship_large: 0.6, ship_small: 0.8, dice: 2.0,
  // Items (Quaternius — small collectibles)
  gem_blue: 2.5, gem_green: 2.5, gem_pink: 2.5, heart: 2.0, star: 2.0,
  coin_item: 2.5, gold_bag: 1.5, thunder: 2.0, chest_closed: 1.5, chest_gold_item: 1.5,
  // Vehicles (Quaternius)
  spaceship: 0.8, spaceship_frog: 0.8, rover: 1.0,
  pickup_truck: 0.8, sports_car: 0.8, big_truck: 0.6, tank: 0.8,
  // Game Mechanics (Quaternius)
  cannon: 1.0, cannonball: 2.0, bridge: 1.0, lever: 1.5, spikes: 1.5,
  crystal_big: 1.0, crystal_small: 1.5, door_game: 1.0, stairs: 1.0,
  tower: 0.8, goal_flag: 1.5, cart: 1.0, pipe: 1.5,
  // Poly-Pizza Food Kit
  bacon: 2.0, broccoli: 2.0, cheese: 2.0, cherries: 2.5, chocolate: 2.0,
  cocktail: 2.0, corn: 2.0, corn_dog: 2.0, croissant: 2.0, cutting_board: 1.5,
  donut_chocolate: 2.0, donut_sprinkles: 2.0, egg_cooked: 2.0, fish_bones: 2.0,
  fries: 2.0, frying_pan: 1.5, gingerbread: 2.0, grapes: 2.0, honey: 2.0,
  hot_dog: 2.0, knife_block: 1.5, lemon: 2.0, loaf: 2.0, baguette: 2.0,
  lollypop_food: 2.0, meat_ribs: 2.0, muffin: 2.0, onion: 2.0, orange: 2.0,
  pancakes: 2.0, peanut_butter: 2.0, pear: 2.0, pepper: 2.0, pie_food: 2.0,
  pineapple: 1.5, pizza_box: 1.5, pizza_food: 1.5, popsicle: 2.0, pudding: 2.0,
  pumpkin_food: 1.5, rice_ball: 2.0, rolling_pin: 2.0, salad: 2.0, soda: 2.0,
  soda_can: 2.0, strawberry: 2.5, sub_sandwich: 2.0, sundae: 2.0,
  sushi_egg: 2.0, sushi_salmon: 2.0, taco: 2.0, turkey: 1.5,
  waffle: 2.0, watermelon: 1.5, whipped_cream: 2.0, whole_ham: 1.5,
  wine: 2.0, cabbage: 2.0, avocado: 2.0,
  // Concert/Stage (Poly-Pizza)
  concert_stage: 0.5, stage: 0.5, spotlight: 1.5, motorised_spotlight: 1.0,
  barricade: 1.0, mic: 2.0,
  // Space (Poly-Pizza)
  astronaut: 1.5, geodesic_dome: 0.8, space_house: 0.8, planet: 0.5, mech: 0.8,
  // House Plants (Tiny Treats — miniature)
  cactus: 2.5, monstera: 2.0, potted_plant: 2.0, succulent: 2.5,
  watering_can: 2.5, yucca: 2.0,
  // Bathroom (Tiny Treats)
  rubber_duck: 3.0, bathtub: 2.0, toilet: 2.0, shower: 2.0,
  mirror: 2.0, slippers: 3.0, soap: 3.0, towel: 2.5, toothbrush: 3.0,
  // Bedroom (Tiny Treats)
  bed: 2.0, alarm_clock: 3.0, computer: 2.5, teddy_bear: 2.5,
  piggybank: 2.5, soccer_ball: 2.5, rubiks_cube: 3.0, play_blocks: 2.5,
  poster: 2.0, lamp_desk: 2.5, closet: 2.0, nightstand: 2.0,
  // Bakery Exterior (Tiny Treats)
  parasol: 2.0, shop_cart: 2.0, newspaper: 3.0, street_lantern: 2.0,
  cafe_table: 2.0, cafe_chair: 2.0, open_sign: 2.5, flower_box: 2.0,
  // Homely House (Tiny Treats)
  mailbox: 2.0, boots: 2.5, doormat: 2.5, gate: 2.0, package: 2.5, letter: 3.0,
  // Living Room
  aquarium: 1.5, rocking_chair: 1.5, record_player: 2.0, radio: 2.0,
  tv: 1.5, clock: 2.0, clock_standing: 1.5, calendar: 2.0, candles_lr: 2.0,
  pillow: 2.5, rug: 1.5, couch_blue: 1.2, lamp_floor: 1.5,
  picture_frame: 2.0, flower_vase: 2.0, tray: 2.5,
  // Cartoon City
  car: 1.0, van: 0.8, bus_stop: 0.8, futuristic_car: 0.8,
  fountain_city: 1.0, billboard: 0.8, traffic_light: 1.0,
  trash_can: 1.5, palm_tree: 1.0, spotlight_city: 1.5,
}

function resolvePropScale(propId: string): number {
  if (PROP_SCALE[propId]) return PROP_SCALE[propId]
  const base = propId.split('_')[0]
  if (base !== propId && PROP_SCALE[base]) return PROP_SCALE[base]
  return 1.0
}

function resolvePropPath(propId: string): string | null {
  // Exact match
  if (PROP_PATHS[propId]) return PROP_PATHS[propId]
  // Try stripping underscored suffixes: cake_birthday → cake, present_A_red → present
  const base = propId.split('_')[0]
  if (base !== propId && PROP_PATHS[base]) return PROP_PATHS[base]
  // Try hyphenated version
  const hyphenated = propId.replace(/_/g, '-')
  if (PROP_PATHS[hyphenated]) return PROP_PATHS[hyphenated]
  return null
}

// ============================================================================
// ENVIRONMENT BACKDROPS — static props spawned per task
// ============================================================================

interface EnvironmentProp {
  id: string
  path: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

// Environment props form a BACKDROP behind characters.
// Props live at Z ≤ -3 (back). Characters live at Z ≥ 0 (front).
// Side-dressing can go at large |X| (≥ 6) at any Z.
export const TASK_ENVIRONMENTS: Record<string, EnvironmentProp[]> = {
  'skeleton-birthday': [],  // Set dressing in VillageWorld DungeonZone
  'knight-space': [],  // Set dressing in VillageWorld ZoneLandmarks
  'mage-kitchen': [],  // Set dressing in VillageWorld ZoneLandmarks
  'barbarian-school': [],  // Set dressing in VillageWorld ZoneLandmarks
  'dungeon-concert': [],  // Set dressing in VillageWorld ZoneLandmarks
  'skeleton-pizza': [],  // Set dressing in VillageWorld ZoneLandmarks
  'adventurers-picnic': [
    { id: 'env-campfire', path: 'poly-pizza/misc/small-camping-bundle/Campfire.glb', position: [0, 0, -3.5], scale: 2.0 },
    { id: 'env-crystal-l', path: 'poly-pizza/nature/crystal-pack/Crystal.glb', position: [-3, 0, -4], scale: 0.25 },
    { id: 'env-crystal-c', path: 'poly-pizza/nature/crystal-pack/Crystal-dxCmHfpqc5.glb', position: [0, 0, -5], scale: 0.3 },
    { id: 'env-crystal-r', path: 'poly-pizza/nature/crystal-pack/Crystal-WzWPKHFMkL.glb', position: [3, 0, -4], scale: 0.25 },
    { id: 'env-torch-l', path: 'kaykit/packs/dungeon/torch_lit.gltf', position: [-6, 0, -3], scale: 2.0 },
    { id: 'env-torch-r', path: 'kaykit/packs/dungeon/torch_lit.gltf', position: [6, 0, -3], scale: 2.0 },
    { id: 'env-stump-l', path: 'tiny-treats/fun-playground/stepping_stumps_B_large.gltf', position: [-7, 0, 0], scale: 1.5 },
    { id: 'env-stump-r', path: 'tiny-treats/fun-playground/stepping_stumps_B.gltf', position: [7, 0, 0], scale: 1.5 },
    { id: 'env-mushroom', path: 'quaternius/nature/Mushroom_Common.gltf', position: [-6, 0, -5], scale: 2.0 },
  ],
}

// ============================================================================
// HERO CHARACTERS — idle characters visible before user submits a prompt
// ============================================================================

interface HeroCharacter {
  id: string
  characterId: CharacterKey
  position: Position
  rotation?: [number, number, number]
}

const TASK_HERO_CHARACTERS: Record<string, HeroCharacter[]> = {
  'skeleton-birthday': [
    { id: 'hero-skeleton', characterId: 'skeleton_warrior', position: 'center' },
  ],
  'knight-space': [
    { id: 'hero-ranger', characterId: 'space_ranger', position: 'left' },
    { id: 'hero-robot', characterId: 'robot', position: 'right' },
  ],
  'mage-kitchen': [
    { id: 'hero-mage', characterId: 'mage', position: 'left' },
    { id: 'hero-witch', characterId: 'witch', position: 'right' },
  ],
  'barbarian-school': [
    { id: 'hero-barbarian', characterId: 'barbarian', position: 'left' },
    { id: 'hero-clown', characterId: 'clown', position: 'right' },
  ],
  'dungeon-concert': [
    { id: 'hero-knight', characterId: 'knight', position: 'left' },
    { id: 'hero-rogue', characterId: 'rogue', position: 'right' },
  ],
  'skeleton-pizza': [
    { id: 'hero-skeleton', characterId: 'skeleton_warrior', position: 'left' },
    { id: 'hero-clown', characterId: 'clown', position: 'right' },
  ],
  'adventurers-picnic': [
    { id: 'hero-ranger', characterId: 'ranger', position: 'left' },
    { id: 'hero-druid', characterId: 'druid', position: 'right' },
  ],
}

// ============================================================================
// EASING FUNCTIONS (exported for testing)
// ============================================================================

export function applyEasing(t: number, style: string): number {
  switch (style) {
    case 'bounce': return easeOutBounce(t)
    case 'arc': return easeInOutQuad(t)  // arc Y handled separately
    case 'float': return easeInOutSine(t)
    default: return t // linear
  }
}

export function easeOutBounce(t: number): number {
  const n1 = 7.5625, d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
  return n1 * (t -= 2.625 / d1) * t + 0.984375
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

// ============================================================================
// AUTO-SPREAD — prevent actors from overlapping at the same stage mark
// ============================================================================

/**
 * When multiple actors spawn at the same position mark, each subsequent actor
 * gets a small offset so they stand side-by-side instead of clipping through
 * each other. Offsets are in local stage space (X = stage-left/right, Z = up/downstage).
 *
 * Layout: actors fan out in a 2-row grid around the mark center.
 * Offset magnitude stays < 1.0 so actors remain "near" their mark
 * without encroaching on adjacent marks (2.0 units apart on X, 1.5 on Z).
 */
const SPREAD_OFFSETS: [number, number][] = [
  [0, 0],            // 1st actor: exact mark position
  [0.9, 0.15],       // 2nd: stage-right, slightly downstage
  [-0.9, 0.15],      // 3rd: stage-left, slightly downstage
  [0, -0.7],         // 4th: upstage (behind)
  [0.9, -0.7],       // 5th: upstage-right
  [-0.9, -0.7],      // 6th: upstage-left
]

/** Wing/entrance positions where actors are transient — skip spread */
const WING_POSITIONS = new Set(['off-left', 'off-right', 'off-top'])

/** Build a coordinate key for occupancy tracking (local space, XZ only) */
function positionKey(localPos: [number, number, number]): string {
  return `${localPos[0].toFixed(1)},${localPos[2].toFixed(1)}`
}

// ============================================================================
// STATE TYPES
// ============================================================================

interface ActiveActor {
  id: string
  type: 'character' | 'prop' | 'animal' | 'procedural'
  characterId?: CharacterKey
  modelPath?: string
  proceduralType?: string  // "balloon"
  position: [number, number, number]
  rotation?: [number, number, number]
  animation?: string
  scale?: number
  color?: string           // for procedural items
}

interface ActiveEffect {
  id: string
  type: string
  position: [number, number, number]
  emojis: string[] // Multiple emojis for particle burst
  startTime: number
}

interface ActiveEmote {
  id: string
  actorId: string
  emoji?: string
  text?: string
  startTime: number
}

interface ActiveTextPopup {
  id: string
  text: string
  position: 'top' | 'center' | 'bottom'
  size: 'small' | 'large' | 'huge'
  startTime: number
}

interface ActiveScreenFlash {
  id: string
  color: string
  duration: number
  startTime: number
}

interface ActiveTween {
  id: string
  actorId: string
  startPos: [number, number, number]
  endPos: [number, number, number]
  style: string
  startTime: number
  duration: number
  resolve: () => void
}

// ============================================================================
// EFFECT EMOJI PARTICLES
// ============================================================================

function getEffectEmojis(effect: string): string[] {
  const emojiMap: Record<string, string[]> = {
    'confetti-burst': ['🎉', '🎊', '✨', '🌟', '🎉', '🎊', '✨'],
    'explosion-cartoon': ['💥', '💫', '⭐', '💥', '💫', '⭐', '💥'],
    'hearts-float': ['💕', '❤️', '💖', '💝', '💕', '❤️', '💖'],
    'stars-spin': ['✨', '⭐', '🌟', '💫', '✨', '⭐', '🌟'],
    'question-marks': ['❓', '❔', '🤔', '❓', '❔', '🤔'],
    'laugh-tears': ['😂', '🤣', '😂', '🤣', '😂', '🤣'],
    'fire-sneeze': ['🔥', '💨', '🔥', '💨', '🔥', '💨'],
    splash: ['💦', '🌊', '💧', '💦', '🌊', '💧'],
    'sparkle-magic': ['✨', '💜', '🔮', '✨', '💜', '🔮', '✨'],
    'sad-cloud': ['☁️', '💧', '😢', '☁️', '💧', '😢'],
    // Extended effects for vignettes
    dust: ['💨', '🌫️', '💨', '🌫️', '💨', '🌫️'],
    fire: ['🔥', '🔥', '🔥', '🔥', '🔥', '🔥'],
    smoke: ['💨', '🌫️', '💨', '🌫️', '💨', '🌫️'],
    steam: ['♨️', '☁️', '♨️', '☁️', '♨️', '☁️'],
    magic_circle: ['🔮', '✨', '💜', '🔮', '✨', '💜', '🔮'],
    bubbles: ['🫧', '🫧', '🫧', '🫧', '🫧', '🫧'],
    'glow-pulse': ['✨', '💛', '✨', '💛', '✨', '💛'],
    'skull-burst': ['💀', '☠️', '💀', '☠️', '💀', '☠️'],
  }
  return emojiMap[effect] || ['✨', '⭐', '💫', '✨', '⭐']
}

// ============================================================================
// TWEEN RUNNER
// ============================================================================

function TweenRunner({
  tweens,
  setActors,
  setTweens
}: {
  tweens: ActiveTween[]
  setActors: React.Dispatch<React.SetStateAction<ActiveActor[]>>
  setTweens: React.Dispatch<React.SetStateAction<ActiveTween[]>>
}) {
  useFrame(() => {
    const now = Date.now()
    const activeTweens = [...tweens]
    let changed = false

    for (const tween of activeTweens) {
      const elapsed = now - tween.startTime
      const progress = Math.min(elapsed / tween.duration, 1)
      const eased = applyEasing(progress, tween.style)

      // Interpolate position
      const x = tween.startPos[0] + (tween.endPos[0] - tween.startPos[0]) * eased
      let y = tween.startPos[1] + (tween.endPos[1] - tween.startPos[1]) * eased
      const z = tween.startPos[2] + (tween.endPos[2] - tween.startPos[2]) * eased

      // Arc style: add parabolic Y curve
      if (tween.style === 'arc') {
        y += Math.sin(progress * Math.PI) * 2.0
      }

      // Update actor position
      setActors(prev => prev.map(a =>
        a.id === tween.actorId ? { ...a, position: [x, y, z] as [number, number, number] } : a
      ))

      if (progress >= 1) {
        tween.resolve()
        changed = true
      }
    }

    if (changed) {
      setTweens(prev => prev.filter(t => {
        const elapsed = now - t.startTime
        return elapsed / t.duration < 1
      }))
    }
  })

  return null
}

// ============================================================================
// STAGE FLOOR — visible platform showing the 15-mark performance area
// ============================================================================

/** The 15 stage marks organized by row for rendering */
const STAGE_MARK_ROWS = [
  { label: 'ds', z: 1.5,  xs: [-4.5, -2.0, 0, 2.0, 4.5], color: '#4ade80' },  // downstage — green
  { label: 'cs', z: 0,    xs: [-4.5, -2.0, 0, 2.0, 4.5], color: '#facc15' },  // center stage — yellow
  { label: 'us', z: -1.5, xs: [-4.5, -2.0, 0, 2.0, 4.5], color: '#60a5fa' },  // upstage — blue
]

/** Wing positions for entrance arrows */
const WING_MARKS = [
  { x: -7, z: 1, color: '#f87171' },  // off-left — red
  { x: 7,  z: 1, color: '#f87171' },  // off-right — red
]

export function StageFloor({ zoneId }: { zoneId: string }) {
  // Convert local stage center [0, 0, 0] to world position
  const stageCenter = zonePosition(zoneId, [0, 0.3, 0])
  const angle = getZoneAngle(zoneId)

  return (
    <group position={stageCenter} rotation={[0, angle, 0]}>
      {/* Solid stage platform base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial
          color="#3a2f25"
          side={2}
        />
      </mesh>

      {/* Border lines — 4 edges of the stage rectangle */}
      {/* Top edge (upstage) */}
      <mesh position={[0, 0.01, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.05]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.8} />
      </mesh>
      {/* Bottom edge (downstage) */}
      <mesh position={[0, 0.01, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.05]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.8} />
      </mesh>
      {/* Left edge */}
      <mesh position={[-5, 0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[4, 0.05]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} />
      </mesh>
      {/* Right edge */}
      <mesh position={[5, 0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[4, 0.05]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} />
      </mesh>

      {/* Row separator lines */}
      <mesh position={[0, 0.01, -0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.03]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.01, 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.03]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
      </mesh>

      {/* Stage mark dots — solid circles at each of the 15 positions */}
      {STAGE_MARK_ROWS.map((row) =>
        row.xs.map((x) => (
          <mesh
            key={`mark-${row.label}-${x}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.02, row.z]}
          >
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial
              color={row.color}
              emissive={row.color}
              emissiveIntensity={1.0}
            />
          </mesh>
        ))
      )}

      {/* Wing entrance markers — solid red diamonds at off-left and off-right */}
      {WING_MARKS.map((wing) => (
        <mesh
          key={`wing-${wing.x}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 4]}
          position={[wing.x, 0.02, wing.z]}
        >
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial
            color={wing.color}
            emissive={wing.color}
            emissiveIntensity={1.0}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================================
// COMPONENT
// ============================================================================

export interface ScenePlayer3DProps {
  script: SceneScript | null
  vignetteSteps?: VignetteStep[] | null
  taskId: string
  onComplete?: () => void
}

export default function ScenePlayer3D({ script, vignetteSteps, taskId, onComplete }: ScenePlayer3DProps) {
  const [actors, setActors] = useState<ActiveActor[]>([])
  const [envProps, setEnvProps] = useState<EnvironmentProp[]>([])
  const [effects, setEffects] = useState<ActiveEffect[]>([])
  const [emotes, setEmotes] = useState<ActiveEmote[]>([])
  const [tweens, setTweens] = useState<ActiveTween[]>([])
  const [textPopups, setTextPopups] = useState<ActiveTextPopup[]>([])
  const [screenFlash, setScreenFlash] = useState<ActiveScreenFlash | null>(null)

  const actorRefs = useRef<Map<string, Character3DHandle | Prop3DHandle>>(new Map())
  const spawnedIds = useRef<Set<string>>(new Set()) // Track spawned actors (avoids stale closure)
  const actorPositionsRef = useRef<Map<string, [number, number, number]>>(new Map())
  const markOccupancy = useRef<Map<string, number>>(new Map()) // Track actors per position for auto-spread
  const actorMarkRef = useRef<Map<string, string>>(new Map()) // actorId → posKey (for decrement on move/remove)
  const playingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Current zone for position offsets
  const currentZone = useGameStore((s) => s.currentZone)

  // Sync mute state with sound manager
  const isMuted = useGameStore((s) => s.isMuted)
  useEffect(() => {
    SoundManager3D.setMuted(isMuted)
  }, [isMuted])

  // ============================================================================
  // ENVIRONMENT SETUP — spawn backdrop props + hero characters on task change
  // ============================================================================

  useEffect(() => {
    // Only set up environment and heroes when inside a zone
    if (!currentZone) {
      setEnvProps([])
      setActors([])
      spawnedIds.current.clear()
      actorPositionsRef.current.clear()
      markOccupancy.current.clear()
      actorMarkRef.current.clear()
      return
    }

    const env = TASK_ENVIRONMENTS[taskId] || []
    // Offset environment props to zone center
    const offsetEnv = env.map((e) => ({
      ...e,
      position: zonePosition(currentZone, e.position) as [number, number, number],
    }))
    setEnvProps(offsetEnv)

    // Spawn hero characters (idle before prompt) at zone-relative positions
    const heroes = TASK_HERO_CHARACTERS[taskId] || []
    const heroActors: ActiveActor[] = heroes.map((hero) => ({
      id: hero.id,
      type: 'character' as const,
      characterId: hero.characterId,
      position: zonePosition(currentZone, POSITION_MAP[hero.position] || [0, 0, 0]),
      rotation: hero.rotation || (currentZone ? getZoneCharRotation(currentZone) : undefined),
      animation: 'Idle_A',
    }))
    setActors(heroActors)
    spawnedIds.current.clear()
    heroes.forEach((h) => spawnedIds.current.add(h.id))
  }, [taskId, currentZone])

  // ============================================================================
  // SCRIPT EXECUTION
  // ============================================================================

  useEffect(() => {
    // When script is null, keep hero actors visible (set by env setup effect)
    if (!script) {
      setEffects([])
      setEmotes([])
      playingRef.current = false
      return
    }

    // Intro scripts (empty actions) — display narration only, keep hero actors
    if (script.actions.length === 0) {
      playingRef.current = false
      return
    }

    // Prevent re-execution if already playing
    if (playingRef.current) return
    playingRef.current = true

    // Clear previous scene actors (keep env props)
    setEffects([])
    setEmotes([])
    spawnedIds.current.clear()
    actorPositionsRef.current.clear()
    markOccupancy.current.clear()
    actorMarkRef.current.clear()

    // Inject player knight into the scene (facing camera, with a reaction anim)
    const playerKnight: ActiveActor = {
      id: 'player-knight',
      type: 'character',
      characterId: 'knight',
      position: zonePosition(currentZone, POSITION_MAP['bottom'] || [0, 0, 2]),
      rotation: currentZone ? getZoneCharRotation(currentZone) : undefined,
      animation: 'Idle_A',
    }
    setActors([playerKnight])
    spawnedIds.current.add('player-knight')

    // Pick a player animation based on success level
    const playerAnim = script.success_level === 'FULL_SUCCESS' ? 'Cheering'
      : script.success_level === 'PARTIAL_SUCCESS' ? 'Waving'
      : 'Interact'

    // Create abort controller for cleanup
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Play result sound based on success level
    if (script.success_level === 'FULL_SUCCESS') {
      SoundManager3D.play('success')
    } else if (script.success_level === 'PARTIAL_SUCCESS') {
      SoundManager3D.play('partial')
    } else if (script.success_level === 'FUNNY_FAIL') {
      SoundManager3D.play('fail')
    }

    // Animate the player knight after a brief delay
    setTimeout(() => {
      handleAnimate('player-knight', playerAnim)
    }, 300)

    // Execute action queue
    executeActions(script.actions, abortController.signal)
      .then(() => {
        if (!abortController.signal.aborted) {
          console.log(`[ScenePlayer3D] Scene complete: ${taskId}`)
          if (onComplete) onComplete()
        }
      })
      .catch((err) => {
        if (!abortController.signal.aborted) {
          console.error('[ScenePlayer3D] Execution error:', err)
        }
      })
      .finally(() => {
        playingRef.current = false
      })

    // Cleanup on unmount or script change
    return () => {
      abortController.abort()
      playingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script, taskId])

  // ============================================================================
  // VIGNETTE STEPS EXECUTION (parallel playback from Mad Libs system)
  // ============================================================================

  useEffect(() => {
    if (!vignetteSteps || vignetteSteps.length === 0) return
    if (playingRef.current) return
    playingRef.current = true

    // Clear previous scene (including stale actors from prior vignettes)
    setActors([])
    setEffects([])
    setEmotes([])
    setTextPopups([])
    setScreenFlash(null)
    spawnedIds.current.clear()
    actorPositionsRef.current.clear()
    markOccupancy.current.clear()
    actorMarkRef.current.clear()

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    executeVignetteSteps(vignetteSteps, abortController.signal)
      .then(() => {
        if (!abortController.signal.aborted) {
          console.log(`[ScenePlayer3D] Vignette playback complete: ${taskId}`)
          if (onComplete) onComplete()
        }
      })
      .catch((err) => {
        if (!abortController.signal.aborted) {
          console.error('[ScenePlayer3D] Vignette execution error:', err)
        }
      })
      .finally(() => {
        playingRef.current = false
      })

    return () => {
      abortController.abort()
      playingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vignetteSteps, taskId])

  // ============================================================================
  // ACTION EXECUTOR (with error tolerance)
  // ============================================================================

  async function executeActions(actions: Action[], signal: AbortSignal) {
    for (const action of actions) {
      if (signal.aborted) break

      // Delay before action
      const delay = action.delay_ms || 0
      if (delay > 0) {
        await sleep(delay, signal)
      }

      if (signal.aborted) break

      // Execute action with error tolerance — one bad action never kills the sequence
      try {
        await executeAction(action, signal)
      } catch (err) {
        console.warn('[ScenePlayer3D] Action failed (skipping):', action.type, err)
      }

      // Duration after action (default 800ms)
      const duration = 'duration_ms' in action ? action.duration_ms || 800 : 800
      await sleep(duration, signal)
    }
  }

  async function executeAction(action: Action, signal: AbortSignal): Promise<void> {
    if (signal.aborted) return

    switch (action.type) {
      case 'spawn':
        handleSpawn(action.target, action.position, action.resolvedPosition)
        break

      case 'move':
        await handleMove(action.target, action.to, action.style, action.resolvedPosition, action.duration_ms)
        break

      case 'animate':
        handleAnimate(action.target, action.anim)
        break

      case 'react':
        handleReact(action.effect, action.position, action.resolvedPosition)
        break

      case 'emote':
        handleEmote(action.target, action.emoji, action.text)
        break

      case 'sfx':
        handleSfx(action.sound)
        break

      case 'wait':
        // Already handled by duration_ms
        break

      case 'remove':
        handleRemove(action.target)
        break

      case 'spawn_group':
        await handleSpawnGroup(action as SpawnGroupAction, signal)
        break

      case 'camera_shake':
        handleCameraShake(action as any)
        break

      case 'camera_zoom':
        // Camera zoom is a no-op for now (handled via store if needed)
        break

      case 'text_popup':
        handleTextPopup(action as any)
        break

      case 'screen_flash':
        handleScreenFlash(action as any)
        break

      case 'crowd_react':
        handleCrowdReact(action as any)
        break

      case 'spawn_rain':
        handleSpawnRain(action as any, signal)
        break

      case 'grow':
        handleGrow(action as any)
        break

      case 'shrink_pop':
        handleShrinkPop(action as any)
        break

      case 'delay':
        await sleep(((action as any).duration_ms ?? 1000), signal)
        break

      default:
        console.warn('[ScenePlayer3D] Unknown action type:', action)
    }
  }

  // ============================================================================
  // PARALLEL VIGNETTE STEP EXECUTION
  // ============================================================================

  async function executeVignetteSteps(steps: VignetteStep[], signal: AbortSignal) {
    for (const step of steps) {
      if (signal.aborted) break

      // Execute all actions in parallel within a step
      const actionPromises = step.parallel.map(async (va) => {
        if (signal.aborted) return
        try {
          // Convert VignetteAction to engine action inline
          const action = vignetteActionToEngineAction(va)
          if (action) {
            await executeAction(action, signal)
          }
        } catch (err) {
          console.warn('[ScenePlayer3D] Vignette action failed (skipping):', va.action, err)
        }
      })

      await Promise.all(actionPromises)

      // Delay before next step
      const delayMs = (step.delayAfter ?? 0.5) * 1000
      if (delayMs > 0 && !signal.aborted) {
        await sleep(delayMs, signal)
      }
    }
  }

  /** Convert a VignetteAction to a scene-engine Action for executeAction */
  function vignetteActionToEngineAction(va: any): Action | null {
    switch (va.action) {
      case 'spawn':
      case 'spawn_character':
        return {
          type: 'spawn',
          target: (va.character ?? va.asset ?? 'mystery_crate') as any,
          position: (va.position ?? 'center') as any,
        }
      case 'move':
        return {
          type: 'move',
          target: (va.character ?? va.asset ?? '') as any,
          to: (va.to ?? va.position ?? 'center') as any,
          style: va.style ?? 'linear',
          duration_ms: va.duration ? va.duration * 1000 : undefined,
        }
      case 'animate':
        return {
          type: 'animate',
          target: (va.character ?? '') as any,
          anim: va.anim ?? 'Idle_A',
        }
      case 'react':
        return {
          type: 'react',
          effect: (va.effect ?? 'confetti-burst') as any,
          position: (va.position ?? 'center') as any,
        }
      case 'emote':
        return {
          type: 'emote',
          target: (va.character ?? '') as any,
          emoji: va.emoji ?? va.text,
          text: va.text,
        }
      case 'sfx':
        return {
          type: 'sfx',
          sound: va.sound ?? 'react',
        }
      case 'camera_shake':
        return {
          type: 'camera_shake' as any,
          intensity: typeof va.intensity === 'number' ? va.intensity : 0.5,
          duration: va.duration ?? 0.5,
        }
      case 'text_popup':
        return {
          type: 'text_popup' as any,
          text: va.text ?? '',
          position: va.position ?? 'center',
          size: va.size ?? 'large',
          duration_ms: 2000,
        }
      case 'screen_flash':
        return {
          type: 'screen_flash' as any,
          color: va.color ?? 'white',
          duration: va.duration ?? 0.2,
        }
      case 'crowd_react':
        return {
          type: 'crowd_react' as any,
          characters: va.characters ?? 'all',
          anim: va.anim ?? 'Cheering',
        }
      case 'spawn_rain':
        return {
          type: 'spawn_rain' as any,
          asset: va.asset ?? 'mystery_crate',
          count: va.quantity ?? 8,
          area: (va.position ?? 'wide') as any,
        }
      case 'grow':
        return {
          type: 'grow' as any,
          target: va.target ?? va.asset ?? '',
          scale: va.scale ?? 2.0,
          duration_ms: 800,
        }
      case 'shrink_pop':
        return {
          type: 'shrink_pop' as any,
          target: va.target ?? va.asset ?? '',
          duration_ms: 500,
        }
      case 'delay':
        return {
          type: 'delay' as any,
          duration_ms: (va.duration ?? 1) * 1000,
        }
      default:
        return null
    }
  }

  // ============================================================================
  // ACTION HANDLERS (error-tolerant)
  // ============================================================================

  function handleSpawn(target: string, position: Position, resolvedPosition?: [number, number, number]) {
    const localPos = resolvedPosition || POSITION_MAP[position] || [0, 0, 0]

    // Auto-spread: offset actors at occupied marks so they don't clip
    const posKey = positionKey(localPos)
    const isWing = WING_POSITIONS.has(position)
    const occupancy = isWing ? 0 : (markOccupancy.current.get(posKey) || 0)

    let finalLocalPos = localPos
    if (occupancy > 0) {
      const [ox, oz] = SPREAD_OFFSETS[Math.min(occupancy, SPREAD_OFFSETS.length - 1)]
      finalLocalPos = [localPos[0] + ox, localPos[1], localPos[2] + oz]
    }
    if (!isWing) {
      markOccupancy.current.set(posKey, occupancy + 1)
    }

    const pos = zonePosition(currentZone, finalLocalPos)
    const actorId = target

    // Strip numeric suffix for model resolution (cat_1 → cat) but keep full ID for tracking
    const baseId = actorId.replace(/_\d+$/, '')

    // Resolve target type: character → animal → procedural → prop
    const characterId = resolveCharacterId(actorId) ?? resolveCharacterId(baseId)
    const isCharacter = characterId !== null
    const isAnimal = !isCharacter && (isAnimalModel(actorId) || isAnimalModel(baseId))
    const isProcedural = !isCharacter && !isAnimal && (actorId === 'balloon' || baseId === 'balloon')
    const propPath = !isCharacter && !isAnimal && !isProcedural
      ? (resolvePropPath(actorId) ?? resolvePropPath(baseId)) : null

    // Skip if we can't resolve the target at all
    if (!isCharacter && !isAnimal && !isProcedural && !propPath) {
      console.warn(`[ScenePlayer3D] Unknown target "${actorId}" — skipping spawn`)
      return
    }

    let newActor: ActiveActor
    if (isCharacter) {
      newActor = {
        id: actorId,
        type: 'character',
        characterId: characterId!,
        position: pos,
        rotation: currentZone ? getZoneCharRotation(currentZone) : undefined,
        animation: 'Spawn_Ground',
      }
    } else if (isAnimal) {
      newActor = {
        id: actorId,
        type: 'animal',
        modelPath: ANIMAL_MODELS[actorId] ?? ANIMAL_MODELS[baseId],
        position: pos,
        scale: 0.8,
      }
    } else if (isProcedural) {
      newActor = {
        id: actorId,
        type: 'procedural',
        proceduralType: 'balloon',
        position: pos,
        scale: 1.0,
      }
    } else {
      newActor = {
        id: actorId,
        type: 'prop',
        modelPath: propPath!,
        position: pos,
        scale: resolvePropScale(actorId) || resolvePropScale(baseId),
      }
    }

    setActors((prev) => {
      // Replace if already exists
      const filtered = prev.filter((a) => a.id !== actorId)
      return [...filtered, newActor]
    })

    // Sound effect on spawn
    SoundManager3D.play('spawn')

    // Start with spawn animation for characters, then crossfade to idle
    if (isCharacter) {
      setTimeout(() => {
        handleAnimate(target, 'Idle_A')
      }, 500)
    }

    spawnedIds.current.add(actorId)
    actorPositionsRef.current.set(actorId, pos)
    if (!isWing) actorMarkRef.current.set(actorId, posKey)
    console.log(`[ScenePlayer3D] Spawned ${actorId} at ${position}${resolvedPosition ? ` [${resolvedPosition.join(', ')}]` : ''}`)
  }

  function handleMove(target: string, to: Position, style?: string, resolvedPosition?: [number, number, number], durationMs?: number): Promise<void> {
    const localPos = resolvedPosition || POSITION_MAP[to] || [0, 0, 0]

    // Auto-spread: decrement old mark, apply spread at new mark
    const isWingDest = WING_POSITIONS.has(to)
    const newPosKey = positionKey(localPos)
    const oldPosKey = actorMarkRef.current.get(target)
    if (oldPosKey) {
      const oldCount = markOccupancy.current.get(oldPosKey) || 0
      if (oldCount > 1) markOccupancy.current.set(oldPosKey, oldCount - 1)
      else markOccupancy.current.delete(oldPosKey)
    }
    const destOccupancy = isWingDest ? 0 : (markOccupancy.current.get(newPosKey) || 0)
    let finalLocalPos = localPos
    if (destOccupancy > 0) {
      const [ox, oz] = SPREAD_OFFSETS[Math.min(destOccupancy, SPREAD_OFFSETS.length - 1)]
      finalLocalPos = [localPos[0] + ox, localPos[1], localPos[2] + oz]
    }
    if (!isWingDest) {
      markOccupancy.current.set(newPosKey, destOccupancy + 1)
      actorMarkRef.current.set(target, newPosKey)
    }

    const newPos = zonePosition(currentZone, finalLocalPos)
    let currentActor = actors.find(a => a.id === target)

    // Auto-spawn if actor doesn't exist yet
    if (!currentActor && !spawnedIds.current.has(target)) {
      const characterId = resolveCharacterId(target)
      if (characterId) {
        console.log(`[ScenePlayer3D] Auto-spawning "${target}" for move`)
        handleSpawn(target, 'center')
        currentActor = { id: target, type: 'character', characterId, position: zonePosition(currentZone, [0, 0, 0]), animation: 'Idle_A' }
      }
    }

    if (!currentActor) {
      console.warn(`[ScenePlayer3D] Cannot move unknown actor "${target}" — skipping`)
      return Promise.resolve()
    }

    // Use ref for start position to avoid stale closure
    const startPos = actorPositionsRef.current.get(target) || currentActor.position || [0, 0, 0]

    // Distance-based tween duration: ~4 units/sec, clamped 600-2500ms
    const dx = newPos[0] - startPos[0]
    const dz = newPos[2] - startPos[2]
    const distance = Math.sqrt(dx * dx + dz * dz)
    const duration = durationMs || Math.round(Math.min(Math.max(distance / 4.0 * 1000, 600), 2500))

    // Face movement direction + trigger walking animation for characters
    if (currentActor.type === 'character') {
      const moveAngle = Math.atan2(
        newPos[0] - startPos[0],
        newPos[2] - startPos[2]
      )
      setActors(prev => prev.map(a =>
        a.id === target ? { ...a, rotation: [0, moveAngle, 0] as [number, number, number] } : a
      ))
      handleAnimate(target, 'Walking_A')
    }

    // Sound effect
    SoundManager3D.play('move')

    return new Promise<void>((resolve) => {
      const tween: ActiveTween = {
        id: `tween-${Date.now()}-${Math.random()}`,
        actorId: target,
        startPos: startPos as [number, number, number],
        endPos: newPos,
        style: style || 'linear',
        startTime: Date.now(),
        duration,
        resolve: () => {
          // Update position ref when tween completes
          actorPositionsRef.current.set(target, newPos)
          // Return to idle + face camera after move
          if (currentActor.type === 'character') {
            const cameraRotation = currentZone ? getZoneCharRotation(currentZone) : undefined
            setActors(prev => prev.map(a =>
              a.id === target ? { ...a, rotation: cameraRotation, animation: 'Idle_A' } : a
            ))
          }
          resolve()
        },
      }
      setTweens(prev => [...prev, tween])

      console.log(`[ScenePlayer3D] Moving ${target} to ${to} (${duration}ms, style: ${style || 'linear'})`)
    })
  }

  function handleAnimate(target: string, anim: string) {
    // Auto-spawn if actor doesn't exist yet (scripts may skip spawn)
    if (!spawnedIds.current.has(target)) {
      const characterId = resolveCharacterId(target)
      if (characterId) {
        console.log(`[ScenePlayer3D] Auto-spawning "${target}" for animate`)
        handleSpawn(target, 'center')
      }
    }

    setActors((prev) =>
      prev.map((actor) =>
        actor.id === target && actor.type === 'character'
          ? { ...actor, animation: anim }
          : actor,
      ),
    )

    // Also try imperative ref API
    const ref = actorRefs.current.get(target) as Character3DHandle | undefined
    if (ref && 'play' in ref) {
      ref.play(anim)
    }

    console.log(`[ScenePlayer3D] Animated ${target}: ${anim}`)
  }

  function handleReact(effect: string, position: Position, resolvedPosition?: [number, number, number]) {
    const localPos = resolvedPosition || POSITION_MAP[position] || [0, 0, 0]
    const pos = zonePosition(currentZone, localPos)
    const effectId = `effect-${Date.now()}-${Math.random()}`

    const newEffect: ActiveEffect = {
      id: effectId,
      type: effect,
      position: pos,
      emojis: getEffectEmojis(effect),
      startTime: Date.now(),
    }

    setEffects((prev) => [...prev, newEffect])

    // Sound effect
    SoundManager3D.play('react')

    // Auto-remove after 2s
    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== effectId))
    }, 2000)

    console.log(`[ScenePlayer3D] React effect ${effect} at ${position}`)
  }

  function handleEmote(target: string, emoji?: string, text?: string) {
    // Auto-spawn if actor doesn't exist yet (scripts may skip spawn)
    if (!spawnedIds.current.has(target)) {
      const characterId = resolveCharacterId(target)
      if (characterId) {
        console.log(`[ScenePlayer3D] Auto-spawning "${target}" for emote`)
        handleSpawn(target, 'center')
      }
    }

    const emoteId = `emote-${Date.now()}-${Math.random()}`

    const newEmote: ActiveEmote = {
      id: emoteId,
      actorId: target,
      emoji,
      text,
      startTime: Date.now(),
    }

    setEmotes((prev) => [...prev, newEmote])

    // Auto-remove after 2s
    setTimeout(() => {
      setEmotes((prev) => prev.filter((e) => e.id !== emoteId))
    }, 2000)

    console.log(`[ScenePlayer3D] Emote on ${target}: ${emoji || text || '(none)'}`)
  }

  function handleSfx(sound: string) {
    // Map SceneScript sound names to SoundManager3D names
    const sfxMap: Record<string, Parameters<typeof SoundManager3D.play>[0]> = {
      pop: 'spawn',
      whoosh: 'move',
      sparkle: 'react',
      celebrate: 'success',
      fail: 'fail',
      click: 'click',
    }
    SoundManager3D.play(sfxMap[sound] || 'click')
    console.log(`[ScenePlayer3D] SFX: ${sound}`)
  }

  function handleRemove(target: string) {
    setActors((prev) => prev.filter((a) => a.id !== target))
    actorRefs.current.delete(target)
    // Decrement occupancy at the actor's mark
    const oldPosKey = actorMarkRef.current.get(target)
    if (oldPosKey) {
      const count = markOccupancy.current.get(oldPosKey) || 0
      if (count > 1) markOccupancy.current.set(oldPosKey, count - 1)
      else markOccupancy.current.delete(oldPosKey)
      actorMarkRef.current.delete(target)
    }
    SoundManager3D.play('remove')
    console.log(`[ScenePlayer3D] Removed ${target}`)
  }

  // ============================================================================
  // NEW ACTION HANDLERS (Mad Libs Pivot)
  // ============================================================================

  function handleCameraShake(action: { intensity?: number; duration?: number }) {
    const intensity = action.intensity ?? 0.5
    const duration = (action.duration ?? 0.5) * 1000
    const startTime = Date.now()

    // Use requestAnimationFrame loop for camera shake
    const shakeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      if (elapsed >= duration) {
        clearInterval(shakeInterval)
        // Reset camera (would need ref — for now just log)
        return
      }
      const decay = 1 - elapsed / duration
      const offsetX = (Math.random() - 0.5) * intensity * decay * 0.3
      const offsetY = (Math.random() - 0.5) * intensity * decay * 0.2
      // Apply via CSS transform on canvas container for simplicity
      const canvas = document.querySelector('canvas')
      if (canvas) {
        canvas.style.transform = `translate(${offsetX * 20}px, ${offsetY * 20}px)`
      }
    }, 16)

    // Cleanup
    setTimeout(() => {
      clearInterval(shakeInterval)
      const canvas = document.querySelector('canvas')
      if (canvas) canvas.style.transform = ''
    }, duration + 50)

    console.log(`[ScenePlayer3D] Camera shake: intensity=${intensity}, duration=${action.duration}s`)
  }

  function handleTextPopup(action: { text?: string; position?: string; size?: string; duration_ms?: number }) {
    const popupId = `popup-${Date.now()}-${Math.random()}`
    const popup: ActiveTextPopup = {
      id: popupId,
      text: action.text ?? '',
      position: (action.position as 'top' | 'center' | 'bottom') ?? 'center',
      size: (action.size as 'small' | 'large' | 'huge') ?? 'large',
      startTime: Date.now(),
    }
    setTextPopups(prev => [...prev, popup])

    // Auto-remove after duration
    setTimeout(() => {
      setTextPopups(prev => prev.filter(p => p.id !== popupId))
    }, action.duration_ms ?? 2000)

    console.log(`[ScenePlayer3D] Text popup: "${action.text}" at ${action.position}`)
  }

  function handleScreenFlash(action: { color?: string; duration?: number }) {
    const flashId = `flash-${Date.now()}`
    setScreenFlash({
      id: flashId,
      color: action.color ?? 'white',
      duration: action.duration ?? 0.2,
      startTime: Date.now(),
    })

    setTimeout(() => {
      setScreenFlash(prev => prev?.id === flashId ? null : prev)
    }, (action.duration ?? 0.2) * 1000)

    console.log(`[ScenePlayer3D] Screen flash: ${action.color}`)
  }

  function handleCrowdReact(action: { characters?: string | string[]; anim?: string }) {
    const animName = action.anim ?? 'Cheering'
    // Apply animation to all spawned character actors
    setActors(prev => prev.map(actor => {
      if (actor.type !== 'character') return actor
      if (action.characters === 'all' || action.characters === 'all_background' || action.characters === 'all_others') {
        return { ...actor, animation: animName }
      }
      if (Array.isArray(action.characters) && action.characters.includes(actor.id)) {
        return { ...actor, animation: animName }
      }
      return actor
    }))

    console.log(`[ScenePlayer3D] Crowd react: ${action.characters} → ${animName}`)
  }

  async function handleSpawnRain(action: { asset?: string; count?: number; area?: string }, signal: AbortSignal) {
    const count = action.count ?? 8
    const asset = action.asset ?? 'mystery_crate'

    for (let i = 0; i < count; i++) {
      if (signal.aborted) break

      // Random X position based on area
      let xRange = 8 // wide
      if (action.area === 'center') xRange = 3
      else if (action.area === 'left') xRange = 4
      else if (action.area === 'right') xRange = 4

      let xOffset = (Math.random() - 0.5) * xRange * 2
      if (action.area === 'left') xOffset -= 3
      if (action.area === 'right') xOffset += 3

      const rainId = `rain-${i}-${Date.now()}`
      const startPos: [number, number, number] = [xOffset, 8, (Math.random() - 0.5) * 4]
      const worldPos = zonePosition(currentZone, startPos)

      const propPath = resolvePropPath(asset)
      if (!propPath) continue

      const actor: ActiveActor = {
        id: rainId,
        type: 'prop',
        modelPath: propPath,
        position: worldPos,
        scale: resolvePropScale(asset) * 0.6,
      }

      setActors(prev => [...prev, actor])

      // Tween down
      const endPos = zonePosition(currentZone, [xOffset, 0, startPos[2]])
      setTweens(prev => [...prev, {
        id: `tween-rain-${rainId}`,
        actorId: rainId,
        startPos: worldPos,
        endPos: endPos,
        style: 'bounce',
        startTime: Date.now(),
        duration: 1000 + Math.random() * 500,
        resolve: () => {
          // Remove after settling
          setTimeout(() => {
            setActors(prev => prev.filter(a => a.id !== rainId))
          }, 2000)
        },
      }])

      // Stagger spawns
      await sleep(80, signal).catch(() => {})
    }

    console.log(`[ScenePlayer3D] Spawn rain: ${count}x ${asset}`)
  }

  function handleGrow(action: { target?: string; scale?: number; duration_ms?: number }) {
    const targetId = action.target ?? ''
    const targetScale = action.scale ?? 2.0

    // Animate scale from 0 to target
    setActors(prev => prev.map(a =>
      a.id === targetId ? { ...a, scale: 0.01 } : a
    ))

    // Animate up over duration
    const duration = action.duration_ms ?? 800
    const startTime = Date.now()
    const growInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOutQuad(progress)
      const currentScale = eased * targetScale

      setActors(prev => prev.map(a =>
        a.id === targetId ? { ...a, scale: currentScale } : a
      ))

      if (progress >= 1) clearInterval(growInterval)
    }, 16)

    console.log(`[ScenePlayer3D] Grow: ${targetId} to scale ${targetScale}`)
  }

  function handleShrinkPop(action: { target?: string; effect?: string; duration_ms?: number }) {
    const targetId = action.target ?? ''
    const duration = action.duration_ms ?? 500
    const startTime = Date.now()

    // Get current scale
    const actor = actors.find(a => a.id === targetId)
    const startScale = actor?.scale ?? 1.0

    const shrinkInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentScale = startScale * (1 - easeInOutQuad(progress))

      setActors(prev => prev.map(a =>
        a.id === targetId ? { ...a, scale: Math.max(currentScale, 0.01) } : a
      ))

      if (progress >= 1) {
        clearInterval(shrinkInterval)
        // Remove and pop effect
        handleRemove(targetId)
        if (action.effect) {
          handleReact(action.effect, 'center' as Position)
        } else {
          handleReact('confetti-burst', 'center' as Position)
        }
      }
    }, 16)

    console.log(`[ScenePlayer3D] Shrink pop: ${targetId}`)
  }

  async function handleSpawnGroup(action: SpawnGroupAction, signal: AbortSignal) {
    const stagger = action.stagger_ms || 150

    for (let i = 0; i < action.targets.length; i++) {
      if (signal.aborted) break
      const target = action.targets[i]

      const localPos = POSITION_MAP[target.position] || [0, 0, 0]
      const basePos = zonePosition(currentZone, localPos)
      const offset = target.offset || [0, 0, 0]
      const pos: [number, number, number] = [
        basePos[0] + offset[0],
        basePos[1] + offset[1],
        basePos[2] + offset[2],
      ]

      const actor = resolveGroupTarget(target.id, target.target, pos)
      if (actor) {
        setActors((prev) => [...prev, actor])
        spawnedIds.current.add(target.id)
        SoundManager3D.play('spawn')
        console.log(`[ScenePlayer3D] Group spawned ${target.id} at [${pos.join(', ')}]`)
      }

      // Stagger between spawns
      if (i < action.targets.length - 1 && stagger > 0) {
        await sleep(stagger, signal)
      }
    }
  }

  /** Resolve a group target to an ActiveActor (character, prop, animal, or procedural) */
  function resolveGroupTarget(
    id: string,
    targetKey: string,
    position: [number, number, number],
  ): ActiveActor | null {
    // Check if it's an animal model
    if (isAnimalModel(targetKey)) {
      return {
        id,
        type: 'animal',
        modelPath: ANIMAL_MODELS[targetKey],
        position,
        scale: 0.8,
      }
    }

    // Check if it's a procedural type (balloon)
    if (targetKey === 'balloon') {
      return {
        id,
        type: 'procedural',
        proceduralType: 'balloon',
        position,
        scale: 1.0,
      }
    }

    // Check if it's a character
    const characterId = resolveCharacterId(targetKey)
    if (characterId) {
      return {
        id,
        type: 'character',
        characterId,
        position,
        animation: 'Spawn_Ground',
      }
    }

    // Check if it's a prop
    const propPath = resolvePropPath(targetKey)
    if (propPath) {
      return {
        id,
        type: 'prop',
        modelPath: propPath,
        position,
        scale: resolvePropScale(targetKey),
      }
    }

    console.warn(`[ScenePlayer3D] Cannot resolve group target "${targetKey}" — skipping`)
    return null
  }

  function isAnimalModel(key: string): boolean {
    return key in ANIMAL_MODELS
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  function sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, ms)
      signal.addEventListener('abort', () => {
        clearTimeout(timeout)
        reject(new Error('Aborted'))
      })
    })
  }

  function getActorPosition(actorId: string): [number, number, number] {
    const actor = actors.find((a) => a.id === actorId)
    return actor?.position || [0, 0, 0]
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      {/* Tween Runner (animates moves) */}
      <TweenRunner tweens={tweens} setActors={setActors} setTweens={setTweens} />

      {/* Stage floor — visible platform showing the 15-mark performance area */}
      {currentZone && <StageFloor zoneId={currentZone} />}

      {/* Environment backdrop props (SafeModel prevents one bad load from crashing) */}
      {envProps.map((env) => (
        <SafeModel key={env.id}>
          <Prop3D
            modelPath={env.path}
            position={env.position}
            rotation={env.rotation}
            scale={env.scale || 1}
          />
        </SafeModel>
      ))}

      {/* Actors (Characters + Props + Animals + Procedural) */}
      {actors.map((actor) => {
        if (actor.type === 'character' && actor.characterId) {
          return (
            <SafeModel key={actor.id}>
              <Character3D
                characterId={actor.characterId}
                position={actor.position}
                rotation={actor.rotation}
                currentAnimation={actor.animation}
                ref={(ref) => {
                  if (ref) actorRefs.current.set(actor.id, ref)
                }}
              />
            </SafeModel>
          )
        }

        if (actor.type === 'animal' && actor.modelPath) {
          return (
            <SafeModel key={actor.id}>
              <AnimalCharacter3D
                modelPath={actor.modelPath}
                position={actor.position}
                scale={actor.scale || 0.8}
                animation={actor.animation}
              />
            </SafeModel>
          )
        }

        if (actor.type === 'procedural' && actor.proceduralType === 'balloon') {
          return (
            <SafeModel key={actor.id}>
              <ProceduralBalloon
                position={actor.position}
                color={actor.color}
                scale={actor.scale || 1}
              />
            </SafeModel>
          )
        }

        if (actor.type === 'prop' && actor.modelPath) {
          return (
            <SafeModel key={actor.id}>
              <Prop3D
                modelPath={actor.modelPath}
                position={actor.position}
                scale={actor.scale || 1}
                animate
                ref={(ref) => {
                  if (ref) actorRefs.current.set(actor.id, ref)
                }}
              />
            </SafeModel>
          )
        }

        return null
      })}

      {/* Effects — particle burst emojis */}
      {effects.map((effect) => (
        <Html key={effect.id} position={effect.position} center>
          <div className="particle-burst select-none pointer-events-none" style={{ position: 'relative', width: 120, height: 120 }}>
            {effect.emojis.map((emoji, i) => {
              const angle = (i / effect.emojis.length) * 360
              const distance = 30 + Math.random() * 20
              const dx = Math.cos((angle * Math.PI) / 180) * distance
              const dy = -Math.abs(Math.sin((angle * Math.PI) / 180) * distance) - 20
              const delay = i * 0.05
              return (
                <span
                  key={i}
                  className="absolute text-3xl"
                  style={{
                    left: '50%',
                    top: '50%',
                    animation: `particle-float 1.5s ease-out ${delay}s both`,
                    ['--dx' as string]: `${dx}px`,
                    ['--dy' as string]: `${dy}px`,
                  }}
                >
                  {emoji}
                </span>
              )
            })}
          </div>
          <style>{`
            @keyframes particle-float {
              0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
              20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
              100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.5); opacity: 0; }
            }
          `}</style>
        </Html>
      ))}

      {/* Emotes (speech bubbles above actors) */}
      {emotes.map((emote) => {
        const actorPos = getActorPosition(emote.actorId)
        const emotePos: [number, number, number] = [actorPos[0], actorPos[1] + 2, actorPos[2]]

        return (
          <Html key={emote.id} position={emotePos} center>
            <div
              className="bg-white/90 rounded-full px-4 py-2 shadow-lg text-xl select-none pointer-events-none"
              style={{ animation: 'emote-pop 0.3s ease-out, emote-fade 2s ease-in-out' }}
            >
              {emote.emoji && <span className="text-2xl">{emote.emoji}</span>}
              {emote.text && <span className="ml-2 text-gray-800 font-semibold">{emote.text}</span>}
            </div>
            <style>{`
              @keyframes emote-pop {
                0% { transform: scale(0); }
                70% { transform: scale(1.1); }
                100% { transform: scale(1); }
              }
              @keyframes emote-fade {
                0%, 70% { opacity: 1; }
                100% { opacity: 0; }
              }
            `}</style>
          </Html>
        )
      })}

      {/* Text Popups (floating text overlays) */}
      {textPopups.map((popup) => {
        const yPos = popup.position === 'top' ? 4 : popup.position === 'bottom' ? -1 : 2
        const popupPos = zonePosition(currentZone, [0, yPos, 0])
        const fontSize = popup.size === 'huge' ? '2.5rem' : popup.size === 'large' ? '1.8rem' : '1.2rem'

        return (
          <Html key={popup.id} position={popupPos} center>
            <div
              className="select-none pointer-events-none text-center whitespace-nowrap"
              style={{
                fontSize,
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.3)',
                animation: 'text-popup-anim 2s ease-out forwards',
              }}
            >
              {popup.text}
            </div>
            <style>{`
              @keyframes text-popup-anim {
                0% { transform: scale(0) translateY(0); opacity: 0; }
                15% { transform: scale(1.2) translateY(0); opacity: 1; }
                25% { transform: scale(1) translateY(0); opacity: 1; }
                80% { transform: scale(1) translateY(-20px); opacity: 1; }
                100% { transform: scale(0.8) translateY(-40px); opacity: 0; }
              }
            `}</style>
          </Html>
        )
      })}

      {/* Screen Flash (full-canvas overlay — rendered as Html at origin) */}
      {screenFlash && (
        <Html fullscreen>
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              backgroundColor: screenFlash.color,
              animation: `screen-flash-anim ${screenFlash.duration}s ease-out forwards`,
              zIndex: 9999,
            }}
          />
          <style>{`
            @keyframes screen-flash-anim {
              0% { opacity: 0.8; }
              100% { opacity: 0; }
            }
          `}</style>
        </Html>
      )}
    </>
  )
}
