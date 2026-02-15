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
import { EMOJI_MAP, getEmojiBubblePath, getEmojiOutlinePath } from '../data/emoji-map'

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

// Resolve an emoji string (semantic name, number, or Unicode) to a pixel-art image path
function resolveEmojiImage(emoji: string): string | null {
  if (EMOJI_MAP[emoji]) return getEmojiBubblePath(emoji)
  const num = parseInt(emoji, 10)
  if (!isNaN(num) && num >= 1 && num <= 127) return getEmojiBubblePath(num)
  return null // Unicode fallback — no image available
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

  // === FoodMegaPack (3D textured food — fruits, veg, bread, cheese, meat, fish, dessert, drinks, cutlery) ===
  // Fruits
  apple_fmp: 'food-mega-pack/Fruits/Apple/Apple_01.glb',
  apple_slice: 'food-mega-pack/Fruits/Apple/Apple_Slice_01.glb',
  banana_fmp: 'food-mega-pack/Fruits/Banana/Banana_01.glb',
  banana_slice: 'food-mega-pack/Fruits/Banana/Banana_Slice_01.glb',
  grapefruit: 'food-mega-pack/Fruits/Grapefruit/Grapefruit_01.glb',
  grapefruit_slice: 'food-mega-pack/Fruits/Grapefruit/Grapefruit_Slice_01.glb',
  lemon_fmp: 'food-mega-pack/Fruits/Lemon/Lemon_01.glb',
  lemon_slice: 'food-mega-pack/Fruits/Lemon/Lemon_Slice_01.glb',
  mango: 'food-mega-pack/Fruits/Mango/Mango_01.glb',
  mango_slice: 'food-mega-pack/Fruits/Mango/Mango_Slice_01.glb',
  melon: 'food-mega-pack/Fruits/Melon/Melon_01.glb',
  melon_slice: 'food-mega-pack/Fruits/Melon/Melon_Slice_01.glb',
  orange_fmp: 'food-mega-pack/Fruits/Orange/Orange_01.glb',
  orange_slice: 'food-mega-pack/Fruits/Orange/Orange_Slice_01.glb',
  pear_fmp: 'food-mega-pack/Fruits/Pear/Pear_01.glb',
  pear_slice: 'food-mega-pack/Fruits/Pear/Pear_Slice_01.glb',
  pineapple_fmp: 'food-mega-pack/Fruits/Pineapple/Pineapple_01.glb',
  pineapple_slice: 'food-mega-pack/Fruits/Pineapple/Pineapple_Slice_01.glb',
  // Vegetables
  bell_pepper: 'food-mega-pack/Vegetables/Bell_Pepper/Bell_Pepper_01.glb',
  bell_pepper_slice: 'food-mega-pack/Vegetables/Bell_Pepper/Bell_Pepper_Slice_01.glb',
  broccoli_fmp: 'food-mega-pack/Vegetables/Broccoli/Broccoli.glb',
  broccoli_piece: 'food-mega-pack/Vegetables/Broccoli/Broccoli_Piece.glb',
  cabbage_fmp: 'food-mega-pack/Vegetables/Cabbage/Cabbage_01.glb',
  cabbage_slice: 'food-mega-pack/Vegetables/Cabbage/Cabbage_Slice_01.glb',
  carrot_fmp: 'food-mega-pack/Vegetables/Carrot/Carrot_01.glb',
  carrot_slice: 'food-mega-pack/Vegetables/Carrot/Carrot_Slice_01.glb',
  cauliflower: 'food-mega-pack/Vegetables/Cauliflower/Cauliflower.glb',
  cauliflower_piece: 'food-mega-pack/Vegetables/Cauliflower/Cauliflower_Piece.glb',
  chili_pepper: 'food-mega-pack/Vegetables/Chili_Pepper/Chili_Pepper_01.glb',
  chili_pepper_slice: 'food-mega-pack/Vegetables/Chili_Pepper/Chili_Pepper_Slice_01.glb',
  cucumber: 'food-mega-pack/Vegetables/Cucumber/Cucumber_01.glb',
  cucumber_slice: 'food-mega-pack/Vegetables/Cucumber/Cucumber_Slice_01.glb',
  garlic: 'food-mega-pack/Vegetables/Garlic/Garlic_01.glb',
  garlic_slice: 'food-mega-pack/Vegetables/Garlic/Garlic_Slice_01.glb',
  onion_fmp: 'food-mega-pack/Vegetables/Onion/Onion_01.glb',
  onion_slice: 'food-mega-pack/Vegetables/Onion/Onion_Slice_01.glb',
  potato: 'food-mega-pack/Vegetables/Potato/Potato_01.glb',
  potato_slice: 'food-mega-pack/Vegetables/Potato/Potato_Slice_01.glb',
  pumpkin_fmp: 'food-mega-pack/Vegetables/Pumpkin/Pumpkin.glb',
  pumpkin_slice_fmp: 'food-mega-pack/Vegetables/Pumpkin/Pumpkin_Slice.glb',
  spring_onion: 'food-mega-pack/Vegetables/Spring_Onion/Spring_Onion_01.glb',
  spring_onion_slice: 'food-mega-pack/Vegetables/Spring_Onion/Spring_Onion_Slice_01.glb',
  tomato_fmp: 'food-mega-pack/Vegetables/Tomato/Tomato_01.glb',
  tomato_slice: 'food-mega-pack/Vegetables/Tomato/Tomato_Slice_01.glb',
  turnip: 'food-mega-pack/Vegetables/Turnip/Turnip_01.glb',
  // Bread
  baguette_fmp: 'food-mega-pack/Bread/Baguette/Baguette.glb',
  baguette_half: 'food-mega-pack/Bread/Baguette/Baguette_Half.glb',
  baguette_slice: 'food-mega-pack/Bread/Baguette/Baguette_Slice.glb',
  croissant_fmp: 'food-mega-pack/Bread/Misc/Croissant.glb',
  loaf_fmp: 'food-mega-pack/Bread/Loaf/Loaf_01.glb',
  loaf_half: 'food-mega-pack/Bread/Loaf/Loaf_Half_01.glb',
  loaf_slice: 'food-mega-pack/Bread/Loaf/Loaf_Slice_01.glb',
  bread_round: 'food-mega-pack/Bread/Round/Bread_Round_01.glb',
  bread_round_half: 'food-mega-pack/Bread/Round/Bread_Round_Half_01.glb',
  bread_round_slice: 'food-mega-pack/Bread/Round/Bread_Round_Slice_01.glb',
  // Cheese
  cheddar: 'food-mega-pack/Cheese/Cheddar_Cheese/Cheddar_Cheese.glb',
  cheddar_slice: 'food-mega-pack/Cheese/Cheddar_Cheese/Cheddar_Cheese_Slice.glb',
  hole_cheese: 'food-mega-pack/Cheese/Hole_Cheese/Hole_Cheese_01.glb',
  hole_cheese_slice: 'food-mega-pack/Cheese/Hole_Cheese/Hole_Cheese_Slice_01.glb',
  white_cheese: 'food-mega-pack/Cheese/White_Cheese/White_Cheese_01.glb',
  yellow_cheese: 'food-mega-pack/Cheese/Yellow_Cheese/Yellow_Cheese_01.glb',
  // Meat
  bacon_fmp: 'food-mega-pack/Meat/Bacon/Bacon_01.glb',
  bacon_slice_fmp: 'food-mega-pack/Meat/Bacon/Bacon_Slice_01.glb',
  ham: 'food-mega-pack/Meat/Ham/Ham_01.glb',
  ham_slice: 'food-mega-pack/Meat/Ham/Ham_Slice_01.glb',
  sausage: 'food-mega-pack/Meat/Sausage/Sausage_01.glb',
  sausage_slice: 'food-mega-pack/Meat/Sausage/Sausage_Slice_01.glb',
  // Fish
  halibut: 'food-mega-pack/Fish/Halibut/Halibut_01.glb',
  halibut_meat: 'food-mega-pack/Fish/Halibut/Halibut_Meat_01.glb',
  salmon: 'food-mega-pack/Fish/Salmon/Salmon_01.glb',
  salmon_meat: 'food-mega-pack/Fish/Salmon/Salmon_Meat_01.glb',
  // Dessert
  cake_fmp: 'food-mega-pack/Dessert/Cake/Cake_01.glb',
  cake_slice_fmp: 'food-mega-pack/Dessert/Cake/Cake_Slice_01.glb',
  jelly: 'food-mega-pack/Dessert/Jelly/Jelly_01.glb',
  jelly_slice: 'food-mega-pack/Dessert/Jelly/Jelly_Slice_01.glb',
  // Mushroom
  bell_mushroom: 'food-mega-pack/Mushrooms/Bell_Mushroom/Bell_Mushroom_01.glb',
  bell_mushroom_slice: 'food-mega-pack/Mushrooms/Bell_Mushroom/Bell_Mushroom_Slice_01.glb',
  // Drinks
  bottle_fmp: 'food-mega-pack/Drinks/Bottle/Bottle_01.glb',
  can: 'food-mega-pack/Drinks/Can/Can_01.glb',
  carton: 'food-mega-pack/Drinks/Carton/Carton_01.glb',
  // Cutlery
  fork: 'food-mega-pack/Cutlery/Fork_01.glb',
  knife_fmp: 'food-mega-pack/Cutlery/Knife_01.glb',
  spoon_big: 'food-mega-pack/Cutlery/Spoon_Big_01.glb',
  spoon_small: 'food-mega-pack/Cutlery/Spoon_Small_01.glb',
  // Utensils
  big_spoon: 'food-mega-pack/Utensils/BigSpoon.glb',
  kitchen_knife: 'food-mega-pack/Utensils/Kitchen_Knife_01.glb',
  ladle: 'food-mega-pack/Utensils/Ladle.glb',
  spatula: 'food-mega-pack/Utensils/Spatula.glb',
  // Jars
  honey_jar: 'food-mega-pack/Jars/Honey/Honey_02.glb',
  jam_hex: 'food-mega-pack/Jars/Jam_Hex/Jam_Hex_01.glb',
  jam_round: 'food-mega-pack/Jars/Jam_Round/Jam_Round_01.glb',

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

  // === Kenney: Castle Kit (76 models) ===
  'bridge-draw': 'kenney/castle-kit/bridge-draw.glb',
  'bridge-straight-pillar': 'kenney/castle-kit/bridge-straight-pillar.glb',
  'bridge-straight': 'kenney/castle-kit/bridge-straight.glb',
  'door': 'kenney/castle-kit/door.glb',
  'flag-banner-long': 'kenney/castle-kit/flag-banner-long.glb',
  'flag-banner-short': 'kenney/castle-kit/flag-banner-short.glb',
  'flag-pennant': 'kenney/castle-kit/flag-pennant.glb',
  'flag-wide': 'kenney/castle-kit/flag-wide.glb',
  'flag_kn': 'kenney/castle-kit/flag.glb',
  'gate_kn': 'kenney/castle-kit/gate.glb',
  'ground-hills': 'kenney/castle-kit/ground-hills.glb',
  'ground': 'kenney/castle-kit/ground.glb',
  'metal-gate': 'kenney/castle-kit/metal-gate.glb',
  'rocks-large': 'kenney/castle-kit/rocks-large.glb',
  'rocks-small': 'kenney/castle-kit/rocks-small.glb',
  'siege-ballista-demolished': 'kenney/castle-kit/siege-ballista-demolished.glb',
  'siege-ballista': 'kenney/castle-kit/siege-ballista.glb',
  'siege-catapult-demolished': 'kenney/castle-kit/siege-catapult-demolished.glb',
  'siege-catapult': 'kenney/castle-kit/siege-catapult.glb',
  'siege-ram-demolished': 'kenney/castle-kit/siege-ram-demolished.glb',
  'siege-ram': 'kenney/castle-kit/siege-ram.glb',
  'siege-tower-demolished': 'kenney/castle-kit/siege-tower-demolished.glb',
  'siege-tower': 'kenney/castle-kit/siege-tower.glb',
  'siege-trebuchet-demolished': 'kenney/castle-kit/siege-trebuchet-demolished.glb',
  'siege-trebuchet': 'kenney/castle-kit/siege-trebuchet.glb',
  'stairs-stone-square': 'kenney/castle-kit/stairs-stone-square.glb',
  'stairs-stone': 'kenney/castle-kit/stairs-stone.glb',
  'tower-base': 'kenney/castle-kit/tower-base.glb',
  'tower-hexagon-base': 'kenney/castle-kit/tower-hexagon-base.glb',
  'tower-hexagon-mid': 'kenney/castle-kit/tower-hexagon-mid.glb',
  'tower-hexagon-roof-secondary': 'kenney/castle-kit/tower-hexagon-roof-secondary.glb',
  'tower-hexagon-roof': 'kenney/castle-kit/tower-hexagon-roof.glb',
  'tower-hexagon-top-wood': 'kenney/castle-kit/tower-hexagon-top-wood.glb',
  'tower-hexagon-top': 'kenney/castle-kit/tower-hexagon-top.glb',
  'tower-slant-roof': 'kenney/castle-kit/tower-slant-roof.glb',
  'tower-square-arch': 'kenney/castle-kit/tower-square-arch.glb',
  'tower-square-base-border': 'kenney/castle-kit/tower-square-base-border.glb',
  'tower-square-base-color': 'kenney/castle-kit/tower-square-base-color.glb',
  'tower-square-base': 'kenney/castle-kit/tower-square-base.glb',
  'tower-square-mid-color': 'kenney/castle-kit/tower-square-mid-color.glb',
  'tower-square-mid-door': 'kenney/castle-kit/tower-square-mid-door.glb',
  'tower-square-mid-open-simple': 'kenney/castle-kit/tower-square-mid-open-simple.glb',
  'tower-square-mid-open': 'kenney/castle-kit/tower-square-mid-open.glb',
  'tower-square-mid-windows': 'kenney/castle-kit/tower-square-mid-windows.glb',
  'tower-square-mid': 'kenney/castle-kit/tower-square-mid.glb',
  'tower-square-roof': 'kenney/castle-kit/tower-square-roof.glb',
  'tower-square-top-color': 'kenney/castle-kit/tower-square-top-color.glb',
  'tower-square-top-roof-high-windows': 'kenney/castle-kit/tower-square-top-roof-high-windows.glb',
  'tower-square-top-roof-high': 'kenney/castle-kit/tower-square-top-roof-high.glb',
  'tower-square-top-roof-rounded': 'kenney/castle-kit/tower-square-top-roof-rounded.glb',
  'tower-square-top-roof': 'kenney/castle-kit/tower-square-top-roof.glb',
  'tower-square-top': 'kenney/castle-kit/tower-square-top.glb',
  'tower-square': 'kenney/castle-kit/tower-square.glb',
  'tower-top': 'kenney/castle-kit/tower-top.glb',
  'tree-large': 'kenney/castle-kit/tree-large.glb',
  'tree-log': 'kenney/castle-kit/tree-log.glb',
  'tree-small': 'kenney/castle-kit/tree-small.glb',
  'tree-trunk': 'kenney/castle-kit/tree-trunk.glb',
  'wall-corner-half-tower': 'kenney/castle-kit/wall-corner-half-tower.glb',
  'wall-corner-half': 'kenney/castle-kit/wall-corner-half.glb',
  'wall-corner-slant': 'kenney/castle-kit/wall-corner-slant.glb',
  'wall-corner': 'kenney/castle-kit/wall-corner.glb',
  'wall-doorway': 'kenney/castle-kit/wall-doorway.glb',
  'wall-half-modular': 'kenney/castle-kit/wall-half-modular.glb',
  'wall-half': 'kenney/castle-kit/wall-half.glb',
  'wall-narrow-corner': 'kenney/castle-kit/wall-narrow-corner.glb',
  'wall-narrow-gate': 'kenney/castle-kit/wall-narrow-gate.glb',
  'wall-narrow-stairs-rail': 'kenney/castle-kit/wall-narrow-stairs-rail.glb',
  'wall-narrow-stairs': 'kenney/castle-kit/wall-narrow-stairs.glb',
  'wall-narrow-wood-fence': 'kenney/castle-kit/wall-narrow-wood-fence.glb',
  'wall-narrow-wood': 'kenney/castle-kit/wall-narrow-wood.glb',
  'wall-narrow': 'kenney/castle-kit/wall-narrow.glb',
  'wall-pillar': 'kenney/castle-kit/wall-pillar.glb',
  'wall-stud': 'kenney/castle-kit/wall-stud.glb',
  'wall-to-narrow': 'kenney/castle-kit/wall-to-narrow.glb',
  'wall': 'kenney/castle-kit/wall.glb',
  // === Kenney: Fantasy Town (167 models) ===
  'balcony-wall-fence': 'kenney/fantasy-town/balcony-wall-fence.glb',
  'balcony-wall': 'kenney/fantasy-town/balcony-wall.glb',
  'banner-green': 'kenney/fantasy-town/banner-green.glb',
  'banner-red': 'kenney/fantasy-town/banner-red.glb',
  'blade': 'kenney/fantasy-town/blade.glb',
  'cart-high': 'kenney/fantasy-town/cart-high.glb',
  'cart_kn': 'kenney/fantasy-town/cart.glb',
  'chimney-base': 'kenney/fantasy-town/chimney-base.glb',
  'chimney-top': 'kenney/fantasy-town/chimney-top.glb',
  'chimney': 'kenney/fantasy-town/chimney.glb',
  'fence-broken': 'kenney/fantasy-town/fence-broken.glb',
  'fence-curved': 'kenney/fantasy-town/fence-curved.glb',
  'fence-gate': 'kenney/fantasy-town/fence-gate.glb',
  'fence_kn': 'kenney/fantasy-town/fence.glb',
  'fountain-center': 'kenney/fantasy-town/fountain-center.glb',
  'fountain-corner-inner-square': 'kenney/fantasy-town/fountain-corner-inner-square.glb',
  'fountain-corner-inner': 'kenney/fantasy-town/fountain-corner-inner.glb',
  'fountain-corner': 'kenney/fantasy-town/fountain-corner.glb',
  'fountain-curved': 'kenney/fantasy-town/fountain-curved.glb',
  'fountain-edge': 'kenney/fantasy-town/fountain-edge.glb',
  'fountain-round-detail': 'kenney/fantasy-town/fountain-round-detail.glb',
  'fountain-round': 'kenney/fantasy-town/fountain-round.glb',
  'fountain-square-detail': 'kenney/fantasy-town/fountain-square-detail.glb',
  'fountain-square': 'kenney/fantasy-town/fountain-square.glb',
  'hedge-curved': 'kenney/fantasy-town/hedge-curved.glb',
  'hedge-gate': 'kenney/fantasy-town/hedge-gate.glb',
  'hedge-large-curved': 'kenney/fantasy-town/hedge-large-curved.glb',
  'hedge-large-gate': 'kenney/fantasy-town/hedge-large-gate.glb',
  'hedge-large': 'kenney/fantasy-town/hedge-large.glb',
  'hedge': 'kenney/fantasy-town/hedge.glb',
  'lantern_kn': 'kenney/fantasy-town/lantern.glb',
  'overhang': 'kenney/fantasy-town/overhang.glb',
  'pillar-stone': 'kenney/fantasy-town/pillar-stone.glb',
  'pillar-wood': 'kenney/fantasy-town/pillar-wood.glb',
  'planks-half': 'kenney/fantasy-town/planks-half.glb',
  'planks-opening': 'kenney/fantasy-town/planks-opening.glb',
  'planks': 'kenney/fantasy-town/planks.glb',
  'poles-horizontal': 'kenney/fantasy-town/poles-horizontal.glb',
  'poles': 'kenney/fantasy-town/poles.glb',
  'road-bend': 'kenney/fantasy-town/road-bend.glb',
  'road-corner-inner': 'kenney/fantasy-town/road-corner-inner.glb',
  'road-corner': 'kenney/fantasy-town/road-corner.glb',
  'road-curb-end': 'kenney/fantasy-town/road-curb-end.glb',
  'road-curb': 'kenney/fantasy-town/road-curb.glb',
  'road-edge-slope': 'kenney/fantasy-town/road-edge-slope.glb',
  'road-edge': 'kenney/fantasy-town/road-edge.glb',
  'road-slope': 'kenney/fantasy-town/road-slope.glb',
  'road': 'kenney/fantasy-town/road.glb',
  'rock-large': 'kenney/fantasy-town/rock-large.glb',
  'rock-small': 'kenney/fantasy-town/rock-small.glb',
  'rock-wide': 'kenney/fantasy-town/rock-wide.glb',
  'roof-corner-inner': 'kenney/fantasy-town/roof-corner-inner.glb',
  'roof-corner-round': 'kenney/fantasy-town/roof-corner-round.glb',
  'roof-corner': 'kenney/fantasy-town/roof-corner.glb',
  'roof-flat': 'kenney/fantasy-town/roof-flat.glb',
  'roof-gable-detail': 'kenney/fantasy-town/roof-gable-detail.glb',
  'roof-gable-end': 'kenney/fantasy-town/roof-gable-end.glb',
  'roof-gable-top': 'kenney/fantasy-town/roof-gable-top.glb',
  'roof-gable': 'kenney/fantasy-town/roof-gable.glb',
  'roof-high-corner-round': 'kenney/fantasy-town/roof-high-corner-round.glb',
  'roof-high-corner': 'kenney/fantasy-town/roof-high-corner.glb',
  'roof-high-cornerinner': 'kenney/fantasy-town/roof-high-cornerinner.glb',
  'roof-high-flat': 'kenney/fantasy-town/roof-high-flat.glb',
  'roof-high-gable-detail': 'kenney/fantasy-town/roof-high-gable-detail.glb',
  'roof-high-gable-end': 'kenney/fantasy-town/roof-high-gable-end.glb',
  'roof-high-gable-top': 'kenney/fantasy-town/roof-high-gable-top.glb',
  'roof-high-gable': 'kenney/fantasy-town/roof-high-gable.glb',
  'roof-high-left': 'kenney/fantasy-town/roof-high-left.glb',
  'roof-high-point': 'kenney/fantasy-town/roof-high-point.glb',
  'roof-high-right': 'kenney/fantasy-town/roof-high-right.glb',
  'roof-high-window': 'kenney/fantasy-town/roof-high-window.glb',
  'roof-high': 'kenney/fantasy-town/roof-high.glb',
  'roof-left': 'kenney/fantasy-town/roof-left.glb',
  'roof-point': 'kenney/fantasy-town/roof-point.glb',
  'roof-right': 'kenney/fantasy-town/roof-right.glb',
  'roof-window': 'kenney/fantasy-town/roof-window.glb',
  'roof': 'kenney/fantasy-town/roof.glb',
  'stairs-full-corner-inner': 'kenney/fantasy-town/stairs-full-corner-inner.glb',
  'stairs-full-corner-outer': 'kenney/fantasy-town/stairs-full-corner-outer.glb',
  'stairs-full': 'kenney/fantasy-town/stairs-full.glb',
  'stairs-stone-corner': 'kenney/fantasy-town/stairs-stone-corner.glb',
  'stairs-stone-handrail': 'kenney/fantasy-town/stairs-stone-handrail.glb',
  'stairs-stone-round': 'kenney/fantasy-town/stairs-stone-round.glb',
  'stairs-stone_kn': 'kenney/fantasy-town/stairs-stone.glb',
  'stairs-wide-stone-handrail': 'kenney/fantasy-town/stairs-wide-stone-handrail.glb',
  'stairs-wide-stone': 'kenney/fantasy-town/stairs-wide-stone.glb',
  'stairs-wide-wood-handrail': 'kenney/fantasy-town/stairs-wide-wood-handrail.glb',
  'stairs-wide-wood': 'kenney/fantasy-town/stairs-wide-wood.glb',
  'stairs-wood-handrail': 'kenney/fantasy-town/stairs-wood-handrail.glb',
  'stairs-wood': 'kenney/fantasy-town/stairs-wood.glb',
  'stall-bench': 'kenney/fantasy-town/stall-bench.glb',
  'stall-green': 'kenney/fantasy-town/stall-green.glb',
  'stall-red': 'kenney/fantasy-town/stall-red.glb',
  'stall-stool': 'kenney/fantasy-town/stall-stool.glb',
  'stall': 'kenney/fantasy-town/stall.glb',
  'tree-crooked': 'kenney/fantasy-town/tree-crooked.glb',
  'tree-high-crooked': 'kenney/fantasy-town/tree-high-crooked.glb',
  'tree-high-round': 'kenney/fantasy-town/tree-high-round.glb',
  'tree-high': 'kenney/fantasy-town/tree-high.glb',
  'tree_kn': 'kenney/fantasy-town/tree.glb',
  'wall-arch-top-detail': 'kenney/fantasy-town/wall-arch-top-detail.glb',
  'wall-arch-top': 'kenney/fantasy-town/wall-arch-top.glb',
  'wall-arch': 'kenney/fantasy-town/wall-arch.glb',
  'wall-block-half': 'kenney/fantasy-town/wall-block-half.glb',
  'wall-block': 'kenney/fantasy-town/wall-block.glb',
  'wall-broken': 'kenney/fantasy-town/wall-broken.glb',
  'wall-corner-detail': 'kenney/fantasy-town/wall-corner-detail.glb',
  'wall-corner-diagonal-half': 'kenney/fantasy-town/wall-corner-diagonal-half.glb',
  'wall-corner-diagonal': 'kenney/fantasy-town/wall-corner-diagonal.glb',
  'wall-corner-edge': 'kenney/fantasy-town/wall-corner-edge.glb',
  'wall-corner_kn': 'kenney/fantasy-town/wall-corner.glb',
  'wall-curved': 'kenney/fantasy-town/wall-curved.glb',
  'wall-detail-cross': 'kenney/fantasy-town/wall-detail-cross.glb',
  'wall-detail-diagonal': 'kenney/fantasy-town/wall-detail-diagonal.glb',
  'wall-detail-horizontal': 'kenney/fantasy-town/wall-detail-horizontal.glb',
  'wall-diagonal': 'kenney/fantasy-town/wall-diagonal.glb',
  'wall-door': 'kenney/fantasy-town/wall-door.glb',
  'wall-doorway-base': 'kenney/fantasy-town/wall-doorway-base.glb',
  'wall-doorway-round': 'kenney/fantasy-town/wall-doorway-round.glb',
  'wall-doorway-square-wide-curved': 'kenney/fantasy-town/wall-doorway-square-wide-curved.glb',
  'wall-doorway-square-wide': 'kenney/fantasy-town/wall-doorway-square-wide.glb',
  'wall-doorway-square': 'kenney/fantasy-town/wall-doorway-square.glb',
  'wall-half_kn': 'kenney/fantasy-town/wall-half.glb',
  'wall-rounded': 'kenney/fantasy-town/wall-rounded.glb',
  'wall-side': 'kenney/fantasy-town/wall-side.glb',
  'wall-slope': 'kenney/fantasy-town/wall-slope.glb',
  'wall-window-glass': 'kenney/fantasy-town/wall-window-glass.glb',
  'wall-window-round': 'kenney/fantasy-town/wall-window-round.glb',
  'wall-window-shutters': 'kenney/fantasy-town/wall-window-shutters.glb',
  'wall-window-small': 'kenney/fantasy-town/wall-window-small.glb',
  'wall-window-stone': 'kenney/fantasy-town/wall-window-stone.glb',
  'wall-wood-arch-top-detail': 'kenney/fantasy-town/wall-wood-arch-top-detail.glb',
  'wall-wood-arch-top': 'kenney/fantasy-town/wall-wood-arch-top.glb',
  'wall-wood-arch': 'kenney/fantasy-town/wall-wood-arch.glb',
  'wall-wood-block-half': 'kenney/fantasy-town/wall-wood-block-half.glb',
  'wall-wood-block': 'kenney/fantasy-town/wall-wood-block.glb',
  'wall-wood-broken': 'kenney/fantasy-town/wall-wood-broken.glb',
  'wall-wood-corner-diagonal-half': 'kenney/fantasy-town/wall-wood-corner-diagonal-half.glb',
  'wall-wood-corner-diagonal': 'kenney/fantasy-town/wall-wood-corner-diagonal.glb',
  'wall-wood-corner-edge': 'kenney/fantasy-town/wall-wood-corner-edge.glb',
  'wall-wood-corner': 'kenney/fantasy-town/wall-wood-corner.glb',
  'wall-wood-curved': 'kenney/fantasy-town/wall-wood-curved.glb',
  'wall-wood-detail-cross': 'kenney/fantasy-town/wall-wood-detail-cross.glb',
  'wall-wood-detail-diagonal': 'kenney/fantasy-town/wall-wood-detail-diagonal.glb',
  'wall-wood-detail-horizontal': 'kenney/fantasy-town/wall-wood-detail-horizontal.glb',
  'wall-wood-diagonal': 'kenney/fantasy-town/wall-wood-diagonal.glb',
  'wall-wood-door': 'kenney/fantasy-town/wall-wood-door.glb',
  'wall-wood-doorway-base': 'kenney/fantasy-town/wall-wood-doorway-base.glb',
  'wall-wood-doorway-round': 'kenney/fantasy-town/wall-wood-doorway-round.glb',
  'wall-wood-doorway-square-wide-curved': 'kenney/fantasy-town/wall-wood-doorway-square-wide-curved.glb',
  'wall-wood-doorway-square-wide': 'kenney/fantasy-town/wall-wood-doorway-square-wide.glb',
  'wall-wood-doorway-square': 'kenney/fantasy-town/wall-wood-doorway-square.glb',
  'wall-wood-half': 'kenney/fantasy-town/wall-wood-half.glb',
  'wall-wood-rounded': 'kenney/fantasy-town/wall-wood-rounded.glb',
  'wall-wood-side': 'kenney/fantasy-town/wall-wood-side.glb',
  'wall-wood-slope': 'kenney/fantasy-town/wall-wood-slope.glb',
  'wall-wood-window-glass': 'kenney/fantasy-town/wall-wood-window-glass.glb',
  'wall-wood-window-round': 'kenney/fantasy-town/wall-wood-window-round.glb',
  'wall-wood-window-shutters': 'kenney/fantasy-town/wall-wood-window-shutters.glb',
  'wall-wood-window-small': 'kenney/fantasy-town/wall-wood-window-small.glb',
  'wall-wood-window-stone': 'kenney/fantasy-town/wall-wood-window-stone.glb',
  'wall-wood': 'kenney/fantasy-town/wall-wood.glb',
  'wall_kn': 'kenney/fantasy-town/wall.glb',
  'watermill-wide': 'kenney/fantasy-town/watermill-wide.glb',
  'watermill': 'kenney/fantasy-town/watermill.glb',
  'wheel': 'kenney/fantasy-town/wheel.glb',
  'windmill': 'kenney/fantasy-town/windmill.glb',
  // === Kenney: Food Kit (200 models) ===
  'advocado-half': 'kenney/food-kit/advocado-half.glb',
  'apple-half': 'kenney/food-kit/apple-half.glb',
  'apple_kn': 'kenney/food-kit/apple.glb',
  'avocado_kn': 'kenney/food-kit/avocado.glb',
  'bacon-raw': 'kenney/food-kit/bacon-raw.glb',
  'bacon_kn': 'kenney/food-kit/bacon.glb',
  'bag-flat': 'kenney/food-kit/bag-flat.glb',
  'bag': 'kenney/food-kit/bag.glb',
  'banana_kn': 'kenney/food-kit/banana.glb',
  'barrel_kn': 'kenney/food-kit/barrel.glb',
  'beet': 'kenney/food-kit/beet.glb',
  'bottle-ketchup': 'kenney/food-kit/bottle-ketchup.glb',
  'bottle-musterd': 'kenney/food-kit/bottle-musterd.glb',
  'bottle-oil': 'kenney/food-kit/bottle-oil.glb',
  'bowl-broth': 'kenney/food-kit/bowl-broth.glb',
  'bowl-cereal': 'kenney/food-kit/bowl-cereal.glb',
  'bowl-soup': 'kenney/food-kit/bowl-soup.glb',
  'bowl': 'kenney/food-kit/bowl.glb',
  'bread_kn': 'kenney/food-kit/bread.glb',
  'broccoli_kn': 'kenney/food-kit/broccoli.glb',
  'burger-cheese-double': 'kenney/food-kit/burger-cheese-double.glb',
  'burger-cheese': 'kenney/food-kit/burger-cheese.glb',
  'burger-double': 'kenney/food-kit/burger-double.glb',
  'burger_kn': 'kenney/food-kit/burger.glb',
  'cabbage_kn': 'kenney/food-kit/cabbage.glb',
  'cake-birthday': 'kenney/food-kit/cake-birthday.glb',
  'cake-slicer': 'kenney/food-kit/cake-slicer.glb',
  'cake_kn': 'kenney/food-kit/cake.glb',
  'can-open': 'kenney/food-kit/can-open.glb',
  'can-small': 'kenney/food-kit/can-small.glb',
  'can_kn': 'kenney/food-kit/can.glb',
  'candy-bar-wrapper': 'kenney/food-kit/candy-bar-wrapper.glb',
  'candy-bar': 'kenney/food-kit/candy-bar.glb',
  'carrot_kn': 'kenney/food-kit/carrot.glb',
  'carton-small': 'kenney/food-kit/carton-small.glb',
  'carton_kn': 'kenney/food-kit/carton.glb',
  'cauliflower_kn': 'kenney/food-kit/cauliflower.glb',
  'celery-stick': 'kenney/food-kit/celery-stick.glb',
  'cheese-cut': 'kenney/food-kit/cheese-cut.glb',
  'cheese-slicer': 'kenney/food-kit/cheese-slicer.glb',
  'cheese_kn': 'kenney/food-kit/cheese.glb',
  'cherries_kn': 'kenney/food-kit/cherries.glb',
  'chinese': 'kenney/food-kit/chinese.glb',
  'chocolate-wrapper': 'kenney/food-kit/chocolate-wrapper.glb',
  'chocolate_kn': 'kenney/food-kit/chocolate.glb',
  'chopstic-decorative': 'kenney/food-kit/chopstic-decorative.glb',
  'chopstick': 'kenney/food-kit/chopstick.glb',
  'cocktail_kn': 'kenney/food-kit/cocktail.glb',
  'coconut-half': 'kenney/food-kit/coconut-half.glb',
  'coconut': 'kenney/food-kit/coconut.glb',
  'cookie-chocolate': 'kenney/food-kit/cookie-chocolate.glb',
  'cookie_kn': 'kenney/food-kit/cookie.glb',
  'cooking-fork': 'kenney/food-kit/cooking-fork.glb',
  'cooking-knife-chopping': 'kenney/food-kit/cooking-knife-chopping.glb',
  'cooking-knife': 'kenney/food-kit/cooking-knife.glb',
  'cooking-spatula': 'kenney/food-kit/cooking-spatula.glb',
  'cooking-spoon': 'kenney/food-kit/cooking-spoon.glb',
  'corn-dog': 'kenney/food-kit/corn-dog.glb',
  'corn_kn': 'kenney/food-kit/corn.glb',
  'croissant_kn': 'kenney/food-kit/croissant.glb',
  'cup-coffee': 'kenney/food-kit/cup-coffee.glb',
  'cup-saucer': 'kenney/food-kit/cup-saucer.glb',
  'cup-tea': 'kenney/food-kit/cup-tea.glb',
  'cup_kn': 'kenney/food-kit/cup.glb',
  'cupcake_kn': 'kenney/food-kit/cupcake.glb',
  'cutting-board-japanese': 'kenney/food-kit/cutting-board-japanese.glb',
  'cutting-board-round': 'kenney/food-kit/cutting-board-round.glb',
  'cutting-board': 'kenney/food-kit/cutting-board.glb',
  'dim-sum': 'kenney/food-kit/dim-sum.glb',
  'donut-chocolate': 'kenney/food-kit/donut-chocolate.glb',
  'donut-sprinkles': 'kenney/food-kit/donut-sprinkles.glb',
  'donut': 'kenney/food-kit/donut.glb',
  'egg-cooked': 'kenney/food-kit/egg-cooked.glb',
  'egg-cup': 'kenney/food-kit/egg-cup.glb',
  'egg-half': 'kenney/food-kit/egg-half.glb',
  'egg_kn': 'kenney/food-kit/egg.glb',
  'eggplant_kn': 'kenney/food-kit/eggplant.glb',
  'fish-bones': 'kenney/food-kit/fish-bones.glb',
  'fish_kn': 'kenney/food-kit/fish.glb',
  'frappe': 'kenney/food-kit/frappe.glb',
  'fries-empty': 'kenney/food-kit/fries-empty.glb',
  'fries_kn': 'kenney/food-kit/fries.glb',
  'frikandel-speciaal': 'kenney/food-kit/frikandel-speciaal.glb',
  'frying-pan-lid': 'kenney/food-kit/frying-pan-lid.glb',
  'frying-pan': 'kenney/food-kit/frying-pan.glb',
  'ginger-bread-cutter': 'kenney/food-kit/ginger-bread-cutter.glb',
  'ginger-bread': 'kenney/food-kit/ginger-bread.glb',
  'glass-wine': 'kenney/food-kit/glass-wine.glb',
  'glass': 'kenney/food-kit/glass.glb',
  'grapes_kn': 'kenney/food-kit/grapes.glb',
  'honey_kn': 'kenney/food-kit/honey.glb',
  'hot-dog-raw': 'kenney/food-kit/hot-dog-raw.glb',
  'hot-dog': 'kenney/food-kit/hot-dog.glb',
  'ice-cream-cne': 'kenney/food-kit/ice-cream-cne.glb',
  'ice-cream-cup': 'kenney/food-kit/ice-cream-cup.glb',
  'ice-cream-scoop-chocolate': 'kenney/food-kit/ice-cream-scoop-chocolate.glb',
  'ice-cream-scoop-mint': 'kenney/food-kit/ice-cream-scoop-mint.glb',
  'ice-cream': 'kenney/food-kit/ice-cream.glb',
  'knife-block': 'kenney/food-kit/knife-block.glb',
  'leek': 'kenney/food-kit/leek.glb',
  'lemon-half': 'kenney/food-kit/lemon-half.glb',
  'lemon_kn': 'kenney/food-kit/lemon.glb',
  'loaf-baguette': 'kenney/food-kit/loaf-baguette.glb',
  'loaf-round': 'kenney/food-kit/loaf-round.glb',
  'loaf_kn': 'kenney/food-kit/loaf.glb',
  'lollypop': 'kenney/food-kit/lollypop.glb',
  'maki-roe': 'kenney/food-kit/maki-roe.glb',
  'maki-salmon': 'kenney/food-kit/maki-salmon.glb',
  'maki-vegetable': 'kenney/food-kit/maki-vegetable.glb',
  'meat-cooked': 'kenney/food-kit/meat-cooked.glb',
  'meat-patty': 'kenney/food-kit/meat-patty.glb',
  'meat-raw': 'kenney/food-kit/meat-raw.glb',
  'meat-ribs': 'kenney/food-kit/meat-ribs.glb',
  'meat-sausage': 'kenney/food-kit/meat-sausage.glb',
  'meat-tenderizer': 'kenney/food-kit/meat-tenderizer.glb',
  'mincemeat-pie': 'kenney/food-kit/mincemeat-pie.glb',
  'mortar-pestle': 'kenney/food-kit/mortar-pestle.glb',
  'mortar': 'kenney/food-kit/mortar.glb',
  'muffin_kn': 'kenney/food-kit/muffin.glb',
  'mug': 'kenney/food-kit/mug.glb',
  'mushroom-half': 'kenney/food-kit/mushroom-half.glb',
  'mushroom_kn': 'kenney/food-kit/mushroom.glb',
  'mussel-open': 'kenney/food-kit/mussel-open.glb',
  'mussel': 'kenney/food-kit/mussel.glb',
  'onion-half': 'kenney/food-kit/onion-half.glb',
  'onion_kn': 'kenney/food-kit/onion.glb',
  'orange_kn': 'kenney/food-kit/orange.glb',
  'pan-stew': 'kenney/food-kit/pan-stew.glb',
  'pan_kn': 'kenney/food-kit/pan.glb',
  'pancakes_kn': 'kenney/food-kit/pancakes.glb',
  'paprika-slice': 'kenney/food-kit/paprika-slice.glb',
  'paprika': 'kenney/food-kit/paprika.glb',
  'peanut-butter': 'kenney/food-kit/peanut-butter.glb',
  'pear-half': 'kenney/food-kit/pear-half.glb',
  'pear_kn': 'kenney/food-kit/pear.glb',
  'pepper-mill': 'kenney/food-kit/pepper-mill.glb',
  'pepper_kn': 'kenney/food-kit/pepper.glb',
  'pie_kn': 'kenney/food-kit/pie.glb',
  'pineapple_kn': 'kenney/food-kit/pineapple.glb',
  'pizza-box': 'kenney/food-kit/pizza-box.glb',
  'pizza-cutter': 'kenney/food-kit/pizza-cutter.glb',
  'pizza_kn': 'kenney/food-kit/pizza.glb',
  'plate-broken': 'kenney/food-kit/plate-broken.glb',
  'plate-deep': 'kenney/food-kit/plate-deep.glb',
  'plate-dinner': 'kenney/food-kit/plate-dinner.glb',
  'plate-rectangle': 'kenney/food-kit/plate-rectangle.glb',
  'plate-sauerkraut': 'kenney/food-kit/plate-sauerkraut.glb',
  'plate_kn': 'kenney/food-kit/plate.glb',
  'popsicle-chocolate': 'kenney/food-kit/popsicle-chocolate.glb',
  'popsicle-stick': 'kenney/food-kit/popsicle-stick.glb',
  'popsicle_kn': 'kenney/food-kit/popsicle.glb',
  'pot-lid': 'kenney/food-kit/pot-lid.glb',
  'pot-stew-lid': 'kenney/food-kit/pot-stew-lid.glb',
  'pot-stew': 'kenney/food-kit/pot-stew.glb',
  'pot_kn': 'kenney/food-kit/pot.glb',
  'pudding_kn': 'kenney/food-kit/pudding.glb',
  'pumpkin-basic': 'kenney/food-kit/pumpkin-basic.glb',
  'pumpkin_kn': 'kenney/food-kit/pumpkin.glb',
  'radish': 'kenney/food-kit/radish.glb',
  'rice-ball': 'kenney/food-kit/rice-ball.glb',
  'rollingpin': 'kenney/food-kit/rollingPin.glb',
  'salad_kn': 'kenney/food-kit/salad.glb',
  'sandwich_kn': 'kenney/food-kit/sandwich.glb',
  'sausage-half': 'kenney/food-kit/sausage-half.glb',
  'sausage_kn': 'kenney/food-kit/sausage.glb',
  'shaker-pepper': 'kenney/food-kit/shaker-pepper.glb',
  'shaker-salt': 'kenney/food-kit/shaker-salt.glb',
  'skewer-vegetables': 'kenney/food-kit/skewer-vegetables.glb',
  'skewer': 'kenney/food-kit/skewer.glb',
  'soda-bottle': 'kenney/food-kit/soda-bottle.glb',
  'soda-can-crushed': 'kenney/food-kit/soda-can-crushed.glb',
  'soda-can': 'kenney/food-kit/soda-can.glb',
  'soda-glass': 'kenney/food-kit/soda-glass.glb',
  'soda_kn': 'kenney/food-kit/soda.glb',
  'soy': 'kenney/food-kit/soy.glb',
  'steamer': 'kenney/food-kit/steamer.glb',
  'strawberry_kn': 'kenney/food-kit/strawberry.glb',
  'styrofoam-dinner': 'kenney/food-kit/styrofoam-dinner.glb',
  'styrofoam': 'kenney/food-kit/styrofoam.glb',
  'sub': 'kenney/food-kit/sub.glb',
  'sundae_kn': 'kenney/food-kit/sundae.glb',
  'sushi-egg': 'kenney/food-kit/sushi-egg.glb',
  'sushi-salmon': 'kenney/food-kit/sushi-salmon.glb',
  'taco_kn': 'kenney/food-kit/taco.glb',
  'tajine-lid': 'kenney/food-kit/tajine-lid.glb',
  'tajine': 'kenney/food-kit/tajine.glb',
  'tomato-slice': 'kenney/food-kit/tomato-slice.glb',
  'tomato_kn': 'kenney/food-kit/tomato.glb',
  'turkey_kn': 'kenney/food-kit/turkey.glb',
  'utensil-fork': 'kenney/food-kit/utensil-fork.glb',
  'utensil-knife': 'kenney/food-kit/utensil-knife.glb',
  'utensil-spoon': 'kenney/food-kit/utensil-spoon.glb',
  'waffle_kn': 'kenney/food-kit/waffle.glb',
  'watermelon_kn': 'kenney/food-kit/watermelon.glb',
  'whipped-cream': 'kenney/food-kit/whipped-cream.glb',
  'whisk_kn': 'kenney/food-kit/whisk.glb',
  'whole-ham': 'kenney/food-kit/whole-ham.glb',
  'wholer-ham': 'kenney/food-kit/wholer-ham.glb',
  'wine-red': 'kenney/food-kit/wine-red.glb',
  'wine-white': 'kenney/food-kit/wine-white.glb',
  // === Kenney: Furniture Kit (140 models) ===
  'bathroomcabinet': 'kenney/furniture-kit/bathroomCabinet.glb',
  'bathroomcabinetdrawer': 'kenney/furniture-kit/bathroomCabinetDrawer.glb',
  'bathroommirror': 'kenney/furniture-kit/bathroomMirror.glb',
  'bathroomsink': 'kenney/furniture-kit/bathroomSink.glb',
  'bathroomsinksquare': 'kenney/furniture-kit/bathroomSinkSquare.glb',
  'bathtub_kn': 'kenney/furniture-kit/bathtub.glb',
  'bear_kn': 'kenney/furniture-kit/bear.glb',
  'bedbunk': 'kenney/furniture-kit/bedBunk.glb',
  'beddouble': 'kenney/furniture-kit/bedDouble.glb',
  'bedsingle': 'kenney/furniture-kit/bedSingle.glb',
  'bench_kn': 'kenney/furniture-kit/bench.glb',
  'benchcushion': 'kenney/furniture-kit/benchCushion.glb',
  'benchcushionlow': 'kenney/furniture-kit/benchCushionLow.glb',
  'bookcaseclosed': 'kenney/furniture-kit/bookcaseClosed.glb',
  'bookcasecloseddoors': 'kenney/furniture-kit/bookcaseClosedDoors.glb',
  'bookcaseclosedwide': 'kenney/furniture-kit/bookcaseClosedWide.glb',
  'bookcaseopen': 'kenney/furniture-kit/bookcaseOpen.glb',
  'bookcaseopenlow': 'kenney/furniture-kit/bookcaseOpenLow.glb',
  'books': 'kenney/furniture-kit/books.glb',
  'cabinetbed': 'kenney/furniture-kit/cabinetBed.glb',
  'cabinetbeddrawer': 'kenney/furniture-kit/cabinetBedDrawer.glb',
  'cabinetbeddrawertable': 'kenney/furniture-kit/cabinetBedDrawerTable.glb',
  'cabinettelevision': 'kenney/furniture-kit/cabinetTelevision.glb',
  'cabinettelevisiondoors': 'kenney/furniture-kit/cabinetTelevisionDoors.glb',
  'cardboardboxclosed': 'kenney/furniture-kit/cardboardBoxClosed.glb',
  'cardboardboxopen': 'kenney/furniture-kit/cardboardBoxOpen.glb',
  'ceilingfan': 'kenney/furniture-kit/ceilingFan.glb',
  'chair_kn': 'kenney/furniture-kit/chair.glb',
  'chaircushion': 'kenney/furniture-kit/chairCushion.glb',
  'chairdesk': 'kenney/furniture-kit/chairDesk.glb',
  'chairmoderncushion': 'kenney/furniture-kit/chairModernCushion.glb',
  'chairmodernframecushion': 'kenney/furniture-kit/chairModernFrameCushion.glb',
  'chairrounded': 'kenney/furniture-kit/chairRounded.glb',
  'coatrack': 'kenney/furniture-kit/coatRack.glb',
  'coatrackstanding': 'kenney/furniture-kit/coatRackStanding.glb',
  'computerkeyboard': 'kenney/furniture-kit/computerKeyboard.glb',
  'computermouse': 'kenney/furniture-kit/computerMouse.glb',
  'computerscreen': 'kenney/furniture-kit/computerScreen.glb',
  'desk_kn': 'kenney/furniture-kit/desk.glb',
  'deskcorner': 'kenney/furniture-kit/deskCorner.glb',
  'doorway': 'kenney/furniture-kit/doorway.glb',
  'doorwayfront': 'kenney/furniture-kit/doorwayFront.glb',
  'doorwayopen': 'kenney/furniture-kit/doorwayOpen.glb',
  'dryer': 'kenney/furniture-kit/dryer.glb',
  'floorcorner': 'kenney/furniture-kit/floorCorner.glb',
  'floorcornerround': 'kenney/furniture-kit/floorCornerRound.glb',
  'floorfull': 'kenney/furniture-kit/floorFull.glb',
  'floorhalf': 'kenney/furniture-kit/floorHalf.glb',
  'hoodlarge': 'kenney/furniture-kit/hoodLarge.glb',
  'hoodmodern': 'kenney/furniture-kit/hoodModern.glb',
  'kitchenbar': 'kenney/furniture-kit/kitchenBar.glb',
  'kitchenbarend': 'kenney/furniture-kit/kitchenBarEnd.glb',
  'kitchenblender': 'kenney/furniture-kit/kitchenBlender.glb',
  'kitchencabinet': 'kenney/furniture-kit/kitchenCabinet.glb',
  'kitchencabinetcornerinner': 'kenney/furniture-kit/kitchenCabinetCornerInner.glb',
  'kitchencabinetcornerround': 'kenney/furniture-kit/kitchenCabinetCornerRound.glb',
  'kitchencabinetdrawer': 'kenney/furniture-kit/kitchenCabinetDrawer.glb',
  'kitchencabinetupper': 'kenney/furniture-kit/kitchenCabinetUpper.glb',
  'kitchencabinetuppercorner': 'kenney/furniture-kit/kitchenCabinetUpperCorner.glb',
  'kitchencabinetupperdouble': 'kenney/furniture-kit/kitchenCabinetUpperDouble.glb',
  'kitchencabinetupperlow': 'kenney/furniture-kit/kitchenCabinetUpperLow.glb',
  'kitchencoffeemachine': 'kenney/furniture-kit/kitchenCoffeeMachine.glb',
  'kitchenfridge': 'kenney/furniture-kit/kitchenFridge.glb',
  'kitchenfridgebuiltin': 'kenney/furniture-kit/kitchenFridgeBuiltIn.glb',
  'kitchenfridgelarge': 'kenney/furniture-kit/kitchenFridgeLarge.glb',
  'kitchenfridgesmall': 'kenney/furniture-kit/kitchenFridgeSmall.glb',
  'kitchenmicrowave': 'kenney/furniture-kit/kitchenMicrowave.glb',
  'kitchensink': 'kenney/furniture-kit/kitchenSink.glb',
  'kitchenstove': 'kenney/furniture-kit/kitchenStove.glb',
  'kitchenstoveelectric': 'kenney/furniture-kit/kitchenStoveElectric.glb',
  'lamproundfloor': 'kenney/furniture-kit/lampRoundFloor.glb',
  'lamproundtable': 'kenney/furniture-kit/lampRoundTable.glb',
  'lampsquareceiling': 'kenney/furniture-kit/lampSquareCeiling.glb',
  'lampsquarefloor': 'kenney/furniture-kit/lampSquareFloor.glb',
  'lampsquaretable': 'kenney/furniture-kit/lampSquareTable.glb',
  'lampwall': 'kenney/furniture-kit/lampWall.glb',
  'laptop': 'kenney/furniture-kit/laptop.glb',
  'loungechair': 'kenney/furniture-kit/loungeChair.glb',
  'loungechairrelax': 'kenney/furniture-kit/loungeChairRelax.glb',
  'loungedesignchair': 'kenney/furniture-kit/loungeDesignChair.glb',
  'loungedesignsofa': 'kenney/furniture-kit/loungeDesignSofa.glb',
  'loungedesignsofacorner': 'kenney/furniture-kit/loungeDesignSofaCorner.glb',
  'loungesofa': 'kenney/furniture-kit/loungeSofa.glb',
  'loungesofacorner': 'kenney/furniture-kit/loungeSofaCorner.glb',
  'loungesofalong': 'kenney/furniture-kit/loungeSofaLong.glb',
  'loungesofaottoman': 'kenney/furniture-kit/loungeSofaOttoman.glb',
  'paneling': 'kenney/furniture-kit/paneling.glb',
  'pillow_kn': 'kenney/furniture-kit/pillow.glb',
  'pillowblue': 'kenney/furniture-kit/pillowBlue.glb',
  'pillowbluelong': 'kenney/furniture-kit/pillowBlueLong.glb',
  'pillowlong': 'kenney/furniture-kit/pillowLong.glb',
  'plantsmall1': 'kenney/furniture-kit/plantSmall1.glb',
  'plantsmall2': 'kenney/furniture-kit/plantSmall2.glb',
  'plantsmall3': 'kenney/furniture-kit/plantSmall3.glb',
  'pottedplant': 'kenney/furniture-kit/pottedPlant.glb',
  'radio_kn': 'kenney/furniture-kit/radio.glb',
  'rugdoormat': 'kenney/furniture-kit/rugDoormat.glb',
  'rugrectangle': 'kenney/furniture-kit/rugRectangle.glb',
  'ruground': 'kenney/furniture-kit/rugRound.glb',
  'rugrounded': 'kenney/furniture-kit/rugRounded.glb',
  'rugsquare': 'kenney/furniture-kit/rugSquare.glb',
  'shower_kn': 'kenney/furniture-kit/shower.glb',
  'showerround': 'kenney/furniture-kit/showerRound.glb',
  'sidetable': 'kenney/furniture-kit/sideTable.glb',
  'sidetabledrawers': 'kenney/furniture-kit/sideTableDrawers.glb',
  'speaker_kn': 'kenney/furniture-kit/speaker.glb',
  'speakersmall': 'kenney/furniture-kit/speakerSmall.glb',
  'stairs_kn': 'kenney/furniture-kit/stairs.glb',
  'stairscorner': 'kenney/furniture-kit/stairsCorner.glb',
  'stairsopen': 'kenney/furniture-kit/stairsOpen.glb',
  'stairsopensingle': 'kenney/furniture-kit/stairsOpenSingle.glb',
  'stoolbar': 'kenney/furniture-kit/stoolBar.glb',
  'stoolbarsquare': 'kenney/furniture-kit/stoolBarSquare.glb',
  'table_kn': 'kenney/furniture-kit/table.glb',
  'tablecloth': 'kenney/furniture-kit/tableCloth.glb',
  'tablecoffee': 'kenney/furniture-kit/tableCoffee.glb',
  'tablecoffeeglass': 'kenney/furniture-kit/tableCoffeeGlass.glb',
  'tablecoffeeglasssquare': 'kenney/furniture-kit/tableCoffeeGlassSquare.glb',
  'tablecoffeesquare': 'kenney/furniture-kit/tableCoffeeSquare.glb',
  'tablecross': 'kenney/furniture-kit/tableCross.glb',
  'tablecrosscloth': 'kenney/furniture-kit/tableCrossCloth.glb',
  'tableglass': 'kenney/furniture-kit/tableGlass.glb',
  'tableround': 'kenney/furniture-kit/tableRound.glb',
  'televisionantenna': 'kenney/furniture-kit/televisionAntenna.glb',
  'televisionmodern': 'kenney/furniture-kit/televisionModern.glb',
  'televisionvintage': 'kenney/furniture-kit/televisionVintage.glb',
  'toaster_kn': 'kenney/furniture-kit/toaster.glb',
  'toilet_kn': 'kenney/furniture-kit/toilet.glb',
  'toiletsquare': 'kenney/furniture-kit/toiletSquare.glb',
  'trashcan': 'kenney/furniture-kit/trashcan.glb',
  'wall_furniture': 'kenney/furniture-kit/wall.glb',
  'wallcorner': 'kenney/furniture-kit/wallCorner.glb',
  'wallcornerrond': 'kenney/furniture-kit/wallCornerRond.glb',
  'walldoorway': 'kenney/furniture-kit/wallDoorway.glb',
  'walldoorwaywide': 'kenney/furniture-kit/wallDoorwayWide.glb',
  'wallhalf': 'kenney/furniture-kit/wallHalf.glb',
  'wallwindow': 'kenney/furniture-kit/wallWindow.glb',
  'wallwindowslide': 'kenney/furniture-kit/wallWindowSlide.glb',
  'washer': 'kenney/furniture-kit/washer.glb',
  'washerdryerstacked': 'kenney/furniture-kit/washerDryerStacked.glb',
  // === Kenney: Graveyard Kit (91 models) ===
  'altar-stone': 'kenney/graveyard-kit/altar-stone.glb',
  'altar-wood': 'kenney/graveyard-kit/altar-wood.glb',
  'bench-damaged': 'kenney/graveyard-kit/bench-damaged.glb',
  'bench_graveyard': 'kenney/graveyard-kit/bench.glb',
  'border-pillar': 'kenney/graveyard-kit/border-pillar.glb',
  'brick-wall-curve-small': 'kenney/graveyard-kit/brick-wall-curve-small.glb',
  'brick-wall-curve': 'kenney/graveyard-kit/brick-wall-curve.glb',
  'brick-wall-end': 'kenney/graveyard-kit/brick-wall-end.glb',
  'brick-wall': 'kenney/graveyard-kit/brick-wall.glb',
  'candle-multiple': 'kenney/graveyard-kit/candle-multiple.glb',
  'candle_kn': 'kenney/graveyard-kit/candle.glb',
  'character-ghost': 'kenney/graveyard-kit/character-ghost.glb',
  'character-keeper': 'kenney/graveyard-kit/character-keeper.glb',
  'character-skeleton': 'kenney/graveyard-kit/character-skeleton.glb',
  'character-vampire': 'kenney/graveyard-kit/character-vampire.glb',
  'character-zombie': 'kenney/graveyard-kit/character-zombie.glb',
  'coffin-old': 'kenney/graveyard-kit/coffin-old.glb',
  'coffin_kn': 'kenney/graveyard-kit/coffin.glb',
  'column-large': 'kenney/graveyard-kit/column-large.glb',
  'cross-column': 'kenney/graveyard-kit/cross-column.glb',
  'cross-wood': 'kenney/graveyard-kit/cross-wood.glb',
  'cross': 'kenney/graveyard-kit/cross.glb',
  'crypt-a': 'kenney/graveyard-kit/crypt-a.glb',
  'crypt-b': 'kenney/graveyard-kit/crypt-b.glb',
  'crypt-door': 'kenney/graveyard-kit/crypt-door.glb',
  'crypt-large-door': 'kenney/graveyard-kit/crypt-large-door.glb',
  'crypt-large-roof': 'kenney/graveyard-kit/crypt-large-roof.glb',
  'crypt-large': 'kenney/graveyard-kit/crypt-large.glb',
  'crypt-small-roof': 'kenney/graveyard-kit/crypt-small-roof.glb',
  'crypt-small': 'kenney/graveyard-kit/crypt-small.glb',
  'crypt': 'kenney/graveyard-kit/crypt.glb',
  'debris-wood': 'kenney/graveyard-kit/debris-wood.glb',
  'debris': 'kenney/graveyard-kit/debris.glb',
  'detail-bowl': 'kenney/graveyard-kit/detail-bowl.glb',
  'detail-chalice': 'kenney/graveyard-kit/detail-chalice.glb',
  'detail-plate': 'kenney/graveyard-kit/detail-plate.glb',
  'fence-damaged': 'kenney/graveyard-kit/fence-damaged.glb',
  'fence-gate_kn': 'kenney/graveyard-kit/fence-gate.glb',
  'fence_graveyard': 'kenney/graveyard-kit/fence.glb',
  'fire-basket': 'kenney/graveyard-kit/fire-basket.glb',
  'grave-border': 'kenney/graveyard-kit/grave-border.glb',
  'grave_kn': 'kenney/graveyard-kit/grave.glb',
  'gravestone-bevel': 'kenney/graveyard-kit/gravestone-bevel.glb',
  'gravestone-broken': 'kenney/graveyard-kit/gravestone-broken.glb',
  'gravestone-cross-large': 'kenney/graveyard-kit/gravestone-cross-large.glb',
  'gravestone-cross': 'kenney/graveyard-kit/gravestone-cross.glb',
  'gravestone-debris': 'kenney/graveyard-kit/gravestone-debris.glb',
  'gravestone-decorative': 'kenney/graveyard-kit/gravestone-decorative.glb',
  'gravestone-roof': 'kenney/graveyard-kit/gravestone-roof.glb',
  'gravestone-round': 'kenney/graveyard-kit/gravestone-round.glb',
  'gravestone-wide': 'kenney/graveyard-kit/gravestone-wide.glb',
  'hay-bale-bundled': 'kenney/graveyard-kit/hay-bale-bundled.glb',
  'hay-bale': 'kenney/graveyard-kit/hay-bale.glb',
  'iron-fence-bar': 'kenney/graveyard-kit/iron-fence-bar.glb',
  'iron-fence-border-column': 'kenney/graveyard-kit/iron-fence-border-column.glb',
  'iron-fence-border-curve': 'kenney/graveyard-kit/iron-fence-border-curve.glb',
  'iron-fence-border-gate': 'kenney/graveyard-kit/iron-fence-border-gate.glb',
  'iron-fence-border': 'kenney/graveyard-kit/iron-fence-border.glb',
  'iron-fence-curve': 'kenney/graveyard-kit/iron-fence-curve.glb',
  'iron-fence-damaged': 'kenney/graveyard-kit/iron-fence-damaged.glb',
  'iron-fence': 'kenney/graveyard-kit/iron-fence.glb',
  'lantern-candle': 'kenney/graveyard-kit/lantern-candle.glb',
  'lantern-glass': 'kenney/graveyard-kit/lantern-glass.glb',
  'lightpost-all': 'kenney/graveyard-kit/lightpost-all.glb',
  'lightpost-double': 'kenney/graveyard-kit/lightpost-double.glb',
  'lightpost-single': 'kenney/graveyard-kit/lightpost-single.glb',
  'pillar-large': 'kenney/graveyard-kit/pillar-large.glb',
  'pillar-obelisk': 'kenney/graveyard-kit/pillar-obelisk.glb',
  'pillar-small': 'kenney/graveyard-kit/pillar-small.glb',
  'pillar-square': 'kenney/graveyard-kit/pillar-square.glb',
  'pine-crooked': 'kenney/graveyard-kit/pine-crooked.glb',
  'pine-fall-crooked': 'kenney/graveyard-kit/pine-fall-crooked.glb',
  'pine-fall': 'kenney/graveyard-kit/pine-fall.glb',
  'pine': 'kenney/graveyard-kit/pine.glb',
  'pumpkin-carved': 'kenney/graveyard-kit/pumpkin-carved.glb',
  'pumpkin-tall-carved': 'kenney/graveyard-kit/pumpkin-tall-carved.glb',
  'pumpkin-tall': 'kenney/graveyard-kit/pumpkin-tall.glb',
  'pumpkin_graveyard': 'kenney/graveyard-kit/pumpkin.glb',
  'road_kn': 'kenney/graveyard-kit/road.glb',
  'rocks-tall': 'kenney/graveyard-kit/rocks-tall.glb',
  'rocks': 'kenney/graveyard-kit/rocks.glb',
  'shovel-dirt': 'kenney/graveyard-kit/shovel-dirt.glb',
  'shovel_kn': 'kenney/graveyard-kit/shovel.glb',
  'stone-wall-column': 'kenney/graveyard-kit/stone-wall-column.glb',
  'stone-wall-curve': 'kenney/graveyard-kit/stone-wall-curve.glb',
  'stone-wall-damaged': 'kenney/graveyard-kit/stone-wall-damaged.glb',
  'stone-wall': 'kenney/graveyard-kit/stone-wall.glb',
  'trunk-long': 'kenney/graveyard-kit/trunk-long.glb',
  'trunk': 'kenney/graveyard-kit/trunk.glb',
  'urn-round': 'kenney/graveyard-kit/urn-round.glb',
  'urn-square': 'kenney/graveyard-kit/urn-square.glb',
  // === Kenney: Holiday Kit (99 models) ===
  'bench-short': 'kenney/holiday-kit/bench-short.glb',
  'bench_holiday': 'kenney/holiday-kit/bench.glb',
  'cabin-corner-bottom': 'kenney/holiday-kit/cabin-corner-bottom.glb',
  'cabin-corner-logs': 'kenney/holiday-kit/cabin-corner-logs.glb',
  'cabin-corner': 'kenney/holiday-kit/cabin-corner.glb',
  'cabin-door-rotate': 'kenney/holiday-kit/cabin-door-rotate.glb',
  'cabin-doorway-center': 'kenney/holiday-kit/cabin-doorway-center.glb',
  'cabin-doorway-left': 'kenney/holiday-kit/cabin-doorway-left.glb',
  'cabin-doorway-right': 'kenney/holiday-kit/cabin-doorway-right.glb',
  'cabin-doorway': 'kenney/holiday-kit/cabin-doorway.glb',
  'cabin-fence': 'kenney/holiday-kit/cabin-fence.glb',
  'cabin-overhang-door-rotate': 'kenney/holiday-kit/cabin-overhang-door-rotate.glb',
  'cabin-overhang-doorway': 'kenney/holiday-kit/cabin-overhang-doorway.glb',
  'cabin-roof-chimney': 'kenney/holiday-kit/cabin-roof-chimney.glb',
  'cabin-roof-corner': 'kenney/holiday-kit/cabin-roof-corner.glb',
  'cabin-roof-dormer': 'kenney/holiday-kit/cabin-roof-dormer.glb',
  'cabin-roof-point': 'kenney/holiday-kit/cabin-roof-point.glb',
  'cabin-roof-snow-chimney': 'kenney/holiday-kit/cabin-roof-snow-chimney.glb',
  'cabin-roof-snow-corner': 'kenney/holiday-kit/cabin-roof-snow-corner.glb',
  'cabin-roof-snow-dormer': 'kenney/holiday-kit/cabin-roof-snow-dormer.glb',
  'cabin-roof-snow-point': 'kenney/holiday-kit/cabin-roof-snow-point.glb',
  'cabin-roof-snow': 'kenney/holiday-kit/cabin-roof-snow.glb',
  'cabin-roof-top': 'kenney/holiday-kit/cabin-roof-top.glb',
  'cabin-roof': 'kenney/holiday-kit/cabin-roof.glb',
  'cabin-wall-low': 'kenney/holiday-kit/cabin-wall-low.glb',
  'cabin-wall-roof-center': 'kenney/holiday-kit/cabin-wall-roof-center.glb',
  'cabin-wall-roof': 'kenney/holiday-kit/cabin-wall-roof.glb',
  'cabin-wall-wreath': 'kenney/holiday-kit/cabin-wall-wreath.glb',
  'cabin-wall': 'kenney/holiday-kit/cabin-wall.glb',
  'cabin-window-a': 'kenney/holiday-kit/cabin-window-a.glb',
  'cabin-window-b': 'kenney/holiday-kit/cabin-window-b.glb',
  'cabin-window-c': 'kenney/holiday-kit/cabin-window-c.glb',
  'cabin-window-large': 'kenney/holiday-kit/cabin-window-large.glb',
  'candy-cane-green': 'kenney/holiday-kit/candy-cane-green.glb',
  'candy-cane-red': 'kenney/holiday-kit/candy-cane-red.glb',
  'festivus-pole': 'kenney/holiday-kit/festivus-pole.glb',
  'floor-stone': 'kenney/holiday-kit/floor-stone.glb',
  'floor-wood-snow': 'kenney/holiday-kit/floor-wood-snow.glb',
  'floor-wood': 'kenney/holiday-kit/floor-wood.glb',
  'gingerbread-man': 'kenney/holiday-kit/gingerbread-man.glb',
  'gingerbread-woman': 'kenney/holiday-kit/gingerbread-woman.glb',
  'hanukkah-dreidel': 'kenney/holiday-kit/hanukkah-dreidel.glb',
  'hanukkah-menorah-candles': 'kenney/holiday-kit/hanukkah-menorah-candles.glb',
  'hanukkah-menorah': 'kenney/holiday-kit/hanukkah-menorah.glb',
  'kwanzaa-kikombe': 'kenney/holiday-kit/kwanzaa-kikombe.glb',
  'kwanzaa-kinara-alternative': 'kenney/holiday-kit/kwanzaa-kinara-alternative.glb',
  'kwanzaa-kinara': 'kenney/holiday-kit/kwanzaa-kinara.glb',
  'lantern-hanging': 'kenney/holiday-kit/lantern-hanging.glb',
  'lantern_holiday': 'kenney/holiday-kit/lantern.glb',
  'lights-colored': 'kenney/holiday-kit/lights-colored.glb',
  'lights-green': 'kenney/holiday-kit/lights-green.glb',
  'lights-red': 'kenney/holiday-kit/lights-red.glb',
  'nutcracker': 'kenney/holiday-kit/nutcracker.glb',
  'present-a-cube': 'kenney/holiday-kit/present-a-cube.glb',
  'present-a-rectangle': 'kenney/holiday-kit/present-a-rectangle.glb',
  'present-a-round': 'kenney/holiday-kit/present-a-round.glb',
  'present-b-cube': 'kenney/holiday-kit/present-b-cube.glb',
  'present-b-rectangle': 'kenney/holiday-kit/present-b-rectangle.glb',
  'present-b-round': 'kenney/holiday-kit/present-b-round.glb',
  'reindeer': 'kenney/holiday-kit/reindeer.glb',
  'rocks-large_kn': 'kenney/holiday-kit/rocks-large.glb',
  'rocks-medium': 'kenney/holiday-kit/rocks-medium.glb',
  'rocks-small_kn': 'kenney/holiday-kit/rocks-small.glb',
  'sled-long': 'kenney/holiday-kit/sled-long.glb',
  'sled': 'kenney/holiday-kit/sled.glb',
  'snow-bunker': 'kenney/holiday-kit/snow-bunker.glb',
  'snow-flat-large': 'kenney/holiday-kit/snow-flat-large.glb',
  'snow-flat': 'kenney/holiday-kit/snow-flat.glb',
  'snow-pile': 'kenney/holiday-kit/snow-pile.glb',
  'snowflake-a': 'kenney/holiday-kit/snowflake-a.glb',
  'snowflake-b': 'kenney/holiday-kit/snowflake-b.glb',
  'snowflake-c': 'kenney/holiday-kit/snowflake-c.glb',
  'snowman-hat': 'kenney/holiday-kit/snowman-hat.glb',
  'snowman_kn': 'kenney/holiday-kit/snowman.glb',
  'sock-green-cane': 'kenney/holiday-kit/sock-green-cane.glb',
  'sock-green': 'kenney/holiday-kit/sock-green.glb',
  'sock-red-cane': 'kenney/holiday-kit/sock-red-cane.glb',
  'sock-red': 'kenney/holiday-kit/sock-red.glb',
  'train-locomotive': 'kenney/holiday-kit/train-locomotive.glb',
  'train-tender': 'kenney/holiday-kit/train-tender.glb',
  'train-wagon-flat-short': 'kenney/holiday-kit/train-wagon-flat-short.glb',
  'train-wagon-flat': 'kenney/holiday-kit/train-wagon-flat.glb',
  'train-wagon-logs': 'kenney/holiday-kit/train-wagon-logs.glb',
  'train-wagon-short': 'kenney/holiday-kit/train-wagon-short.glb',
  'train-wagon': 'kenney/holiday-kit/train-wagon.glb',
  'trainset-rail-bend': 'kenney/holiday-kit/trainset-rail-bend.glb',
  'trainset-rail-corner': 'kenney/holiday-kit/trainset-rail-corner.glb',
  'trainset-rail-detailed-bend': 'kenney/holiday-kit/trainset-rail-detailed-bend.glb',
  'trainset-rail-detailed-corner': 'kenney/holiday-kit/trainset-rail-detailed-corner.glb',
  'trainset-rail-detailed-straight': 'kenney/holiday-kit/trainset-rail-detailed-straight.glb',
  'trainset-rail-straight': 'kenney/holiday-kit/trainset-rail-straight.glb',
  'tree-decorated-snow': 'kenney/holiday-kit/tree-decorated-snow.glb',
  'tree-decorated': 'kenney/holiday-kit/tree-decorated.glb',
  'tree-snow-a': 'kenney/holiday-kit/tree-snow-a.glb',
  'tree-snow-b': 'kenney/holiday-kit/tree-snow-b.glb',
  'tree-snow-c': 'kenney/holiday-kit/tree-snow-c.glb',
  'tree_holiday': 'kenney/holiday-kit/tree.glb',
  'wreath-decorated': 'kenney/holiday-kit/wreath-decorated.glb',
  'wreath_kn': 'kenney/holiday-kit/wreath.glb',
  // === Kenney: Mini Dungeon (21 models) ===
  'banner': 'kenney/mini-dungeon/banner.glb',
  'barrel_mini-dungeon': 'kenney/mini-dungeon/barrel.glb',
  'character-human': 'kenney/mini-dungeon/character-human.glb',
  'character-orc': 'kenney/mini-dungeon/character-orc.glb',
  'chest_kn': 'kenney/mini-dungeon/chest.glb',
  'coin': 'kenney/mini-dungeon/coin.glb',
  'column': 'kenney/mini-dungeon/column.glb',
  'dirt': 'kenney/mini-dungeon/dirt.glb',
  'floor-detail': 'kenney/mini-dungeon/floor-detail.glb',
  'floor': 'kenney/mini-dungeon/floor.glb',
  'gate_mini-dungeon': 'kenney/mini-dungeon/gate.glb',
  'rocks_kn': 'kenney/mini-dungeon/rocks.glb',
  'stairs_mini-dungeon': 'kenney/mini-dungeon/stairs.glb',
  'stones': 'kenney/mini-dungeon/stones.glb',
  'trap': 'kenney/mini-dungeon/trap.glb',
  'wall-half_mini-dungeon': 'kenney/mini-dungeon/wall-half.glb',
  'wall-narrow_kn': 'kenney/mini-dungeon/wall-narrow.glb',
  'wall-opening': 'kenney/mini-dungeon/wall-opening.glb',
  'wall_mini-dungeon': 'kenney/mini-dungeon/wall.glb',
  'wood-structure': 'kenney/mini-dungeon/wood-structure.glb',
  'wood-support': 'kenney/mini-dungeon/wood-support.glb',
  // === Kenney: Nature Kit (329 models) ===
  'bed_kn': 'kenney/nature-kit/bed.glb',
  'bed_floor': 'kenney/nature-kit/bed_floor.glb',
  'bridge_center_stone': 'kenney/nature-kit/bridge_center_stone.glb',
  'bridge_center_stoneround': 'kenney/nature-kit/bridge_center_stoneRound.glb',
  'bridge_center_wood': 'kenney/nature-kit/bridge_center_wood.glb',
  'bridge_center_woodround': 'kenney/nature-kit/bridge_center_woodRound.glb',
  'bridge_side_stone': 'kenney/nature-kit/bridge_side_stone.glb',
  'bridge_side_stoneround': 'kenney/nature-kit/bridge_side_stoneRound.glb',
  'bridge_side_wood': 'kenney/nature-kit/bridge_side_wood.glb',
  'bridge_side_woodround': 'kenney/nature-kit/bridge_side_woodRound.glb',
  'bridge_stone': 'kenney/nature-kit/bridge_stone.glb',
  'bridge_stonenarrow': 'kenney/nature-kit/bridge_stoneNarrow.glb',
  'bridge_stoneround': 'kenney/nature-kit/bridge_stoneRound.glb',
  'bridge_stoneroundnarrow': 'kenney/nature-kit/bridge_stoneRoundNarrow.glb',
  'bridge_wood': 'kenney/nature-kit/bridge_wood.glb',
  'bridge_woodnarrow': 'kenney/nature-kit/bridge_woodNarrow.glb',
  'bridge_woodround': 'kenney/nature-kit/bridge_woodRound.glb',
  'bridge_woodroundnarrow': 'kenney/nature-kit/bridge_woodRoundNarrow.glb',
  'cactus_short': 'kenney/nature-kit/cactus_short.glb',
  'cactus_tall': 'kenney/nature-kit/cactus_tall.glb',
  'campfire_bricks': 'kenney/nature-kit/campfire_bricks.glb',
  'campfire_logs': 'kenney/nature-kit/campfire_logs.glb',
  'campfire_planks': 'kenney/nature-kit/campfire_planks.glb',
  'campfire_stones': 'kenney/nature-kit/campfire_stones.glb',
  'canoe': 'kenney/nature-kit/canoe.glb',
  'canoe_paddle': 'kenney/nature-kit/canoe_paddle.glb',
  'cliff_blockcave_rock': 'kenney/nature-kit/cliff_blockCave_rock.glb',
  'cliff_blockcave_stone': 'kenney/nature-kit/cliff_blockCave_stone.glb',
  'cliff_blockdiagonal_rock': 'kenney/nature-kit/cliff_blockDiagonal_rock.glb',
  'cliff_blockdiagonal_stone': 'kenney/nature-kit/cliff_blockDiagonal_stone.glb',
  'cliff_blockhalf_rock': 'kenney/nature-kit/cliff_blockHalf_rock.glb',
  'cliff_blockhalf_stone': 'kenney/nature-kit/cliff_blockHalf_stone.glb',
  'cliff_blockquarter_rock': 'kenney/nature-kit/cliff_blockQuarter_rock.glb',
  'cliff_blockquarter_stone': 'kenney/nature-kit/cliff_blockQuarter_stone.glb',
  'cliff_blockslopehalfwalls_rock': 'kenney/nature-kit/cliff_blockSlopeHalfWalls_rock.glb',
  'cliff_blockslopehalfwalls_stone': 'kenney/nature-kit/cliff_blockSlopeHalfWalls_stone.glb',
  'cliff_blockslopewalls_rock': 'kenney/nature-kit/cliff_blockSlopeWalls_rock.glb',
  'cliff_blockslopewalls_stone': 'kenney/nature-kit/cliff_blockSlopeWalls_stone.glb',
  'cliff_blockslope_rock': 'kenney/nature-kit/cliff_blockSlope_rock.glb',
  'cliff_blockslope_stone': 'kenney/nature-kit/cliff_blockSlope_stone.glb',
  'cliff_block_rock': 'kenney/nature-kit/cliff_block_rock.glb',
  'cliff_block_stone': 'kenney/nature-kit/cliff_block_stone.glb',
  'cliff_cave_rock': 'kenney/nature-kit/cliff_cave_rock.glb',
  'cliff_cave_stone': 'kenney/nature-kit/cliff_cave_stone.glb',
  'cliff_cornerinnerlarge_rock': 'kenney/nature-kit/cliff_cornerInnerLarge_rock.glb',
  'cliff_cornerinnerlarge_stone': 'kenney/nature-kit/cliff_cornerInnerLarge_stone.glb',
  'cliff_cornerinnertop_rock': 'kenney/nature-kit/cliff_cornerInnerTop_rock.glb',
  'cliff_cornerinnertop_stone': 'kenney/nature-kit/cliff_cornerInnerTop_stone.glb',
  'cliff_cornerinner_rock': 'kenney/nature-kit/cliff_cornerInner_rock.glb',
  'cliff_cornerinner_stone': 'kenney/nature-kit/cliff_cornerInner_stone.glb',
  'cliff_cornerlarge_rock': 'kenney/nature-kit/cliff_cornerLarge_rock.glb',
  'cliff_cornerlarge_stone': 'kenney/nature-kit/cliff_cornerLarge_stone.glb',
  'cliff_cornertop_rock': 'kenney/nature-kit/cliff_cornerTop_rock.glb',
  'cliff_cornertop_stone': 'kenney/nature-kit/cliff_cornerTop_stone.glb',
  'cliff_corner_rock': 'kenney/nature-kit/cliff_corner_rock.glb',
  'cliff_corner_stone': 'kenney/nature-kit/cliff_corner_stone.glb',
  'cliff_diagonal_rock': 'kenney/nature-kit/cliff_diagonal_rock.glb',
  'cliff_diagonal_stone': 'kenney/nature-kit/cliff_diagonal_stone.glb',
  'cliff_halfcornerinner_rock': 'kenney/nature-kit/cliff_halfCornerInner_rock.glb',
  'cliff_halfcornerinner_stone': 'kenney/nature-kit/cliff_halfCornerInner_stone.glb',
  'cliff_halfcorner_rock': 'kenney/nature-kit/cliff_halfCorner_rock.glb',
  'cliff_halfcorner_stone': 'kenney/nature-kit/cliff_halfCorner_stone.glb',
  'cliff_half_rock': 'kenney/nature-kit/cliff_half_rock.glb',
  'cliff_half_stone': 'kenney/nature-kit/cliff_half_stone.glb',
  'cliff_large_rock': 'kenney/nature-kit/cliff_large_rock.glb',
  'cliff_large_stone': 'kenney/nature-kit/cliff_large_stone.glb',
  'cliff_rock': 'kenney/nature-kit/cliff_rock.glb',
  'cliff_stepscornerinner_rock': 'kenney/nature-kit/cliff_stepsCornerInner_rock.glb',
  'cliff_stepscornerinner_stone': 'kenney/nature-kit/cliff_stepsCornerInner_stone.glb',
  'cliff_stepscorner_rock': 'kenney/nature-kit/cliff_stepsCorner_rock.glb',
  'cliff_stepscorner_stone': 'kenney/nature-kit/cliff_stepsCorner_stone.glb',
  'cliff_steps_rock': 'kenney/nature-kit/cliff_steps_rock.glb',
  'cliff_steps_stone': 'kenney/nature-kit/cliff_steps_stone.glb',
  'cliff_stone': 'kenney/nature-kit/cliff_stone.glb',
  'cliff_topdiagonal_rock': 'kenney/nature-kit/cliff_topDiagonal_rock.glb',
  'cliff_topdiagonal_stone': 'kenney/nature-kit/cliff_topDiagonal_stone.glb',
  'cliff_top_rock': 'kenney/nature-kit/cliff_top_rock.glb',
  'cliff_top_stone': 'kenney/nature-kit/cliff_top_stone.glb',
  'cliff_waterfalltop_rock': 'kenney/nature-kit/cliff_waterfallTop_rock.glb',
  'cliff_waterfalltop_stone': 'kenney/nature-kit/cliff_waterfallTop_stone.glb',
  'cliff_waterfall_rock': 'kenney/nature-kit/cliff_waterfall_rock.glb',
  'cliff_waterfall_stone': 'kenney/nature-kit/cliff_waterfall_stone.glb',
  'crop_carrot': 'kenney/nature-kit/crop_carrot.glb',
  'crop_melon': 'kenney/nature-kit/crop_melon.glb',
  'crop_pumpkin': 'kenney/nature-kit/crop_pumpkin.glb',
  'crop_turnip': 'kenney/nature-kit/crop_turnip.glb',
  'crops_bamboostagea': 'kenney/nature-kit/crops_bambooStageA.glb',
  'crops_bamboostageb': 'kenney/nature-kit/crops_bambooStageB.glb',
  'crops_cornstagea': 'kenney/nature-kit/crops_cornStageA.glb',
  'crops_cornstageb': 'kenney/nature-kit/crops_cornStageB.glb',
  'crops_cornstagec': 'kenney/nature-kit/crops_cornStageC.glb',
  'crops_cornstaged': 'kenney/nature-kit/crops_cornStageD.glb',
  'crops_dirtdoublerow': 'kenney/nature-kit/crops_dirtDoubleRow.glb',
  'crops_dirtdoublerowcorner': 'kenney/nature-kit/crops_dirtDoubleRowCorner.glb',
  'crops_dirtdoublerowend': 'kenney/nature-kit/crops_dirtDoubleRowEnd.glb',
  'crops_dirtrow': 'kenney/nature-kit/crops_dirtRow.glb',
  'crops_dirtrowcorner': 'kenney/nature-kit/crops_dirtRowCorner.glb',
  'crops_dirtrowend': 'kenney/nature-kit/crops_dirtRowEnd.glb',
  'crops_dirtsingle': 'kenney/nature-kit/crops_dirtSingle.glb',
  'crops_leafsstagea': 'kenney/nature-kit/crops_leafsStageA.glb',
  'crops_leafsstageb': 'kenney/nature-kit/crops_leafsStageB.glb',
  'crops_wheatstagea': 'kenney/nature-kit/crops_wheatStageA.glb',
  'crops_wheatstageb': 'kenney/nature-kit/crops_wheatStageB.glb',
  'fence_bend': 'kenney/nature-kit/fence_bend.glb',
  'fence_bendcenter': 'kenney/nature-kit/fence_bendCenter.glb',
  'fence_corner': 'kenney/nature-kit/fence_corner.glb',
  'fence_gate': 'kenney/nature-kit/fence_gate.glb',
  'fence_planks': 'kenney/nature-kit/fence_planks.glb',
  'fence_planksdouble': 'kenney/nature-kit/fence_planksDouble.glb',
  'fence_simple': 'kenney/nature-kit/fence_simple.glb',
  'fence_simplecenter': 'kenney/nature-kit/fence_simpleCenter.glb',
  'fence_simplediagonal': 'kenney/nature-kit/fence_simpleDiagonal.glb',
  'fence_simplediagonalcenter': 'kenney/nature-kit/fence_simpleDiagonalCenter.glb',
  'fence_simplehigh': 'kenney/nature-kit/fence_simpleHigh.glb',
  'fence_simplelow': 'kenney/nature-kit/fence_simpleLow.glb',
  'flower_purplea': 'kenney/nature-kit/flower_purpleA.glb',
  'flower_purpleb': 'kenney/nature-kit/flower_purpleB.glb',
  'flower_purplec': 'kenney/nature-kit/flower_purpleC.glb',
  'flower_reda': 'kenney/nature-kit/flower_redA.glb',
  'flower_redb': 'kenney/nature-kit/flower_redB.glb',
  'flower_redc': 'kenney/nature-kit/flower_redC.glb',
  'flower_yellowa': 'kenney/nature-kit/flower_yellowA.glb',
  'flower_yellowb': 'kenney/nature-kit/flower_yellowB.glb',
  'flower_yellowc': 'kenney/nature-kit/flower_yellowC.glb',
  'grass': 'kenney/nature-kit/grass.glb',
  'grass_large': 'kenney/nature-kit/grass_large.glb',
  'grass_leafs': 'kenney/nature-kit/grass_leafs.glb',
  'grass_leafslarge': 'kenney/nature-kit/grass_leafsLarge.glb',
  'ground_grass': 'kenney/nature-kit/ground_grass.glb',
  'ground_pathbend': 'kenney/nature-kit/ground_pathBend.glb',
  'ground_pathbendbank': 'kenney/nature-kit/ground_pathBendBank.glb',
  'ground_pathcorner': 'kenney/nature-kit/ground_pathCorner.glb',
  'ground_pathcornersmall': 'kenney/nature-kit/ground_pathCornerSmall.glb',
  'ground_pathcross': 'kenney/nature-kit/ground_pathCross.glb',
  'ground_pathend': 'kenney/nature-kit/ground_pathEnd.glb',
  'ground_pathendclosed': 'kenney/nature-kit/ground_pathEndClosed.glb',
  'ground_pathopen': 'kenney/nature-kit/ground_pathOpen.glb',
  'ground_pathrocks': 'kenney/nature-kit/ground_pathRocks.glb',
  'ground_pathside': 'kenney/nature-kit/ground_pathSide.glb',
  'ground_pathsideopen': 'kenney/nature-kit/ground_pathSideOpen.glb',
  'ground_pathsplit': 'kenney/nature-kit/ground_pathSplit.glb',
  'ground_pathstraight': 'kenney/nature-kit/ground_pathStraight.glb',
  'ground_pathtile': 'kenney/nature-kit/ground_pathTile.glb',
  'ground_riverbend': 'kenney/nature-kit/ground_riverBend.glb',
  'ground_riverbendbank': 'kenney/nature-kit/ground_riverBendBank.glb',
  'ground_rivercorner': 'kenney/nature-kit/ground_riverCorner.glb',
  'ground_rivercornersmall': 'kenney/nature-kit/ground_riverCornerSmall.glb',
  'ground_rivercross': 'kenney/nature-kit/ground_riverCross.glb',
  'ground_riverend': 'kenney/nature-kit/ground_riverEnd.glb',
  'ground_riverendclosed': 'kenney/nature-kit/ground_riverEndClosed.glb',
  'ground_riveropen': 'kenney/nature-kit/ground_riverOpen.glb',
  'ground_riverrocks': 'kenney/nature-kit/ground_riverRocks.glb',
  'ground_riverside': 'kenney/nature-kit/ground_riverSide.glb',
  'ground_riversideopen': 'kenney/nature-kit/ground_riverSideOpen.glb',
  'ground_riversplit': 'kenney/nature-kit/ground_riverSplit.glb',
  'ground_riverstraight': 'kenney/nature-kit/ground_riverStraight.glb',
  'ground_rivertile': 'kenney/nature-kit/ground_riverTile.glb',
  'hanging_moss': 'kenney/nature-kit/hanging_moss.glb',
  'lily_large': 'kenney/nature-kit/lily_large.glb',
  'lily_small': 'kenney/nature-kit/lily_small.glb',
  'log': 'kenney/nature-kit/log.glb',
  'log_large': 'kenney/nature-kit/log_large.glb',
  'log_stack': 'kenney/nature-kit/log_stack.glb',
  'log_stacklarge': 'kenney/nature-kit/log_stackLarge.glb',
  'mushroom_red': 'kenney/nature-kit/mushroom_red.glb',
  'mushroom_redgroup': 'kenney/nature-kit/mushroom_redGroup.glb',
  'mushroom_redtall': 'kenney/nature-kit/mushroom_redTall.glb',
  'mushroom_tan': 'kenney/nature-kit/mushroom_tan.glb',
  'mushroom_tangroup': 'kenney/nature-kit/mushroom_tanGroup.glb',
  'mushroom_tantall': 'kenney/nature-kit/mushroom_tanTall.glb',
  'path_stone': 'kenney/nature-kit/path_stone.glb',
  'path_stonecircle': 'kenney/nature-kit/path_stoneCircle.glb',
  'path_stonecorner': 'kenney/nature-kit/path_stoneCorner.glb',
  'path_stoneend': 'kenney/nature-kit/path_stoneEnd.glb',
  'path_wood': 'kenney/nature-kit/path_wood.glb',
  'path_woodcorner': 'kenney/nature-kit/path_woodCorner.glb',
  'path_woodend': 'kenney/nature-kit/path_woodEnd.glb',
  'plant_bush': 'kenney/nature-kit/plant_bush.glb',
  'plant_bushdetailed': 'kenney/nature-kit/plant_bushDetailed.glb',
  'plant_bushlarge': 'kenney/nature-kit/plant_bushLarge.glb',
  'plant_bushlargetriangle': 'kenney/nature-kit/plant_bushLargeTriangle.glb',
  'plant_bushsmall': 'kenney/nature-kit/plant_bushSmall.glb',
  'plant_bushtriangle': 'kenney/nature-kit/plant_bushTriangle.glb',
  'plant_flatshort': 'kenney/nature-kit/plant_flatShort.glb',
  'plant_flattall': 'kenney/nature-kit/plant_flatTall.glb',
  'platform_beach': 'kenney/nature-kit/platform_beach.glb',
  'platform_grass': 'kenney/nature-kit/platform_grass.glb',
  'platform_stone': 'kenney/nature-kit/platform_stone.glb',
  'pot_large': 'kenney/nature-kit/pot_large.glb',
  'pot_small': 'kenney/nature-kit/pot_small.glb',
  'rock_largea': 'kenney/nature-kit/rock_largeA.glb',
  'rock_largeb': 'kenney/nature-kit/rock_largeB.glb',
  'rock_largec': 'kenney/nature-kit/rock_largeC.glb',
  'rock_larged': 'kenney/nature-kit/rock_largeD.glb',
  'rock_largee': 'kenney/nature-kit/rock_largeE.glb',
  'rock_largef': 'kenney/nature-kit/rock_largeF.glb',
  'rock_smalla': 'kenney/nature-kit/rock_smallA.glb',
  'rock_smallb': 'kenney/nature-kit/rock_smallB.glb',
  'rock_smallc': 'kenney/nature-kit/rock_smallC.glb',
  'rock_smalld': 'kenney/nature-kit/rock_smallD.glb',
  'rock_smalle': 'kenney/nature-kit/rock_smallE.glb',
  'rock_smallf': 'kenney/nature-kit/rock_smallF.glb',
  'rock_smallflata': 'kenney/nature-kit/rock_smallFlatA.glb',
  'rock_smallflatb': 'kenney/nature-kit/rock_smallFlatB.glb',
  'rock_smallflatc': 'kenney/nature-kit/rock_smallFlatC.glb',
  'rock_smallg': 'kenney/nature-kit/rock_smallG.glb',
  'rock_smallh': 'kenney/nature-kit/rock_smallH.glb',
  'rock_smalli': 'kenney/nature-kit/rock_smallI.glb',
  'rock_smalltopa': 'kenney/nature-kit/rock_smallTopA.glb',
  'rock_smalltopb': 'kenney/nature-kit/rock_smallTopB.glb',
  'rock_talla': 'kenney/nature-kit/rock_tallA.glb',
  'rock_tallb': 'kenney/nature-kit/rock_tallB.glb',
  'rock_tallc': 'kenney/nature-kit/rock_tallC.glb',
  'rock_talld': 'kenney/nature-kit/rock_tallD.glb',
  'rock_talle': 'kenney/nature-kit/rock_tallE.glb',
  'rock_tallf': 'kenney/nature-kit/rock_tallF.glb',
  'rock_tallg': 'kenney/nature-kit/rock_tallG.glb',
  'rock_tallh': 'kenney/nature-kit/rock_tallH.glb',
  'rock_talli': 'kenney/nature-kit/rock_tallI.glb',
  'rock_tallj': 'kenney/nature-kit/rock_tallJ.glb',
  'sign_kn': 'kenney/nature-kit/sign.glb',
  'statue_block': 'kenney/nature-kit/statue_block.glb',
  'statue_column': 'kenney/nature-kit/statue_column.glb',
  'statue_columndamaged': 'kenney/nature-kit/statue_columnDamaged.glb',
  'statue_head': 'kenney/nature-kit/statue_head.glb',
  'statue_obelisk': 'kenney/nature-kit/statue_obelisk.glb',
  'statue_ring': 'kenney/nature-kit/statue_ring.glb',
  'stone_largea': 'kenney/nature-kit/stone_largeA.glb',
  'stone_largeb': 'kenney/nature-kit/stone_largeB.glb',
  'stone_largec': 'kenney/nature-kit/stone_largeC.glb',
  'stone_larged': 'kenney/nature-kit/stone_largeD.glb',
  'stone_largee': 'kenney/nature-kit/stone_largeE.glb',
  'stone_largef': 'kenney/nature-kit/stone_largeF.glb',
  'stone_smalla': 'kenney/nature-kit/stone_smallA.glb',
  'stone_smallb': 'kenney/nature-kit/stone_smallB.glb',
  'stone_smallc': 'kenney/nature-kit/stone_smallC.glb',
  'stone_smalld': 'kenney/nature-kit/stone_smallD.glb',
  'stone_smalle': 'kenney/nature-kit/stone_smallE.glb',
  'stone_smallf': 'kenney/nature-kit/stone_smallF.glb',
  'stone_smallflata': 'kenney/nature-kit/stone_smallFlatA.glb',
  'stone_smallflatb': 'kenney/nature-kit/stone_smallFlatB.glb',
  'stone_smallflatc': 'kenney/nature-kit/stone_smallFlatC.glb',
  'stone_smallg': 'kenney/nature-kit/stone_smallG.glb',
  'stone_smallh': 'kenney/nature-kit/stone_smallH.glb',
  'stone_smalli': 'kenney/nature-kit/stone_smallI.glb',
  'stone_smalltopa': 'kenney/nature-kit/stone_smallTopA.glb',
  'stone_smalltopb': 'kenney/nature-kit/stone_smallTopB.glb',
  'stone_talla': 'kenney/nature-kit/stone_tallA.glb',
  'stone_tallb': 'kenney/nature-kit/stone_tallB.glb',
  'stone_tallc': 'kenney/nature-kit/stone_tallC.glb',
  'stone_talld': 'kenney/nature-kit/stone_tallD.glb',
  'stone_talle': 'kenney/nature-kit/stone_tallE.glb',
  'stone_tallf': 'kenney/nature-kit/stone_tallF.glb',
  'stone_tallg': 'kenney/nature-kit/stone_tallG.glb',
  'stone_tallh': 'kenney/nature-kit/stone_tallH.glb',
  'stone_talli': 'kenney/nature-kit/stone_tallI.glb',
  'stone_tallj': 'kenney/nature-kit/stone_tallJ.glb',
  'stump_old': 'kenney/nature-kit/stump_old.glb',
  'stump_oldtall': 'kenney/nature-kit/stump_oldTall.glb',
  'stump_round': 'kenney/nature-kit/stump_round.glb',
  'stump_rounddetailed': 'kenney/nature-kit/stump_roundDetailed.glb',
  'stump_square': 'kenney/nature-kit/stump_square.glb',
  'stump_squaredetailed': 'kenney/nature-kit/stump_squareDetailed.glb',
  'stump_squaredetailedwide': 'kenney/nature-kit/stump_squareDetailedWide.glb',
  'tent_detailedclosed': 'kenney/nature-kit/tent_detailedClosed.glb',
  'tent_detailedopen': 'kenney/nature-kit/tent_detailedOpen.glb',
  'tent_smallclosed': 'kenney/nature-kit/tent_smallClosed.glb',
  'tent_smallopen': 'kenney/nature-kit/tent_smallOpen.glb',
  'tree_blocks': 'kenney/nature-kit/tree_blocks.glb',
  'tree_blocks_dark': 'kenney/nature-kit/tree_blocks_dark.glb',
  'tree_blocks_fall': 'kenney/nature-kit/tree_blocks_fall.glb',
  'tree_cone': 'kenney/nature-kit/tree_cone.glb',
  'tree_cone_dark': 'kenney/nature-kit/tree_cone_dark.glb',
  'tree_cone_fall': 'kenney/nature-kit/tree_cone_fall.glb',
  'tree_default': 'kenney/nature-kit/tree_default.glb',
  'tree_default_dark': 'kenney/nature-kit/tree_default_dark.glb',
  'tree_default_fall': 'kenney/nature-kit/tree_default_fall.glb',
  'tree_detailed': 'kenney/nature-kit/tree_detailed.glb',
  'tree_detailed_dark': 'kenney/nature-kit/tree_detailed_dark.glb',
  'tree_detailed_fall': 'kenney/nature-kit/tree_detailed_fall.glb',
  'tree_fat': 'kenney/nature-kit/tree_fat.glb',
  'tree_fat_darkh': 'kenney/nature-kit/tree_fat_darkh.glb',
  'tree_fat_fall': 'kenney/nature-kit/tree_fat_fall.glb',
  'tree_oak': 'kenney/nature-kit/tree_oak.glb',
  'tree_oak_dark': 'kenney/nature-kit/tree_oak_dark.glb',
  'tree_oak_fall': 'kenney/nature-kit/tree_oak_fall.glb',
  'tree_palm': 'kenney/nature-kit/tree_palm.glb',
  'tree_palmbend': 'kenney/nature-kit/tree_palmBend.glb',
  'tree_palmdetailedshort': 'kenney/nature-kit/tree_palmDetailedShort.glb',
  'tree_palmdetailedtall': 'kenney/nature-kit/tree_palmDetailedTall.glb',
  'tree_palmshort': 'kenney/nature-kit/tree_palmShort.glb',
  'tree_palmtall': 'kenney/nature-kit/tree_palmTall.glb',
  'tree_pinedefaulta': 'kenney/nature-kit/tree_pineDefaultA.glb',
  'tree_pinedefaultb': 'kenney/nature-kit/tree_pineDefaultB.glb',
  'tree_pinegrounda': 'kenney/nature-kit/tree_pineGroundA.glb',
  'tree_pinegroundb': 'kenney/nature-kit/tree_pineGroundB.glb',
  'tree_pinerounda': 'kenney/nature-kit/tree_pineRoundA.glb',
  'tree_pineroundb': 'kenney/nature-kit/tree_pineRoundB.glb',
  'tree_pineroundc': 'kenney/nature-kit/tree_pineRoundC.glb',
  'tree_pineroundd': 'kenney/nature-kit/tree_pineRoundD.glb',
  'tree_pinerounde': 'kenney/nature-kit/tree_pineRoundE.glb',
  'tree_pineroundf': 'kenney/nature-kit/tree_pineRoundF.glb',
  'tree_pinesmalla': 'kenney/nature-kit/tree_pineSmallA.glb',
  'tree_pinesmallb': 'kenney/nature-kit/tree_pineSmallB.glb',
  'tree_pinesmallc': 'kenney/nature-kit/tree_pineSmallC.glb',
  'tree_pinesmalld': 'kenney/nature-kit/tree_pineSmallD.glb',
  'tree_pinetalla': 'kenney/nature-kit/tree_pineTallA.glb',
  'tree_pinetalla_detailed': 'kenney/nature-kit/tree_pineTallA_detailed.glb',
  'tree_pinetallb': 'kenney/nature-kit/tree_pineTallB.glb',
  'tree_pinetallb_detailed': 'kenney/nature-kit/tree_pineTallB_detailed.glb',
  'tree_pinetallc': 'kenney/nature-kit/tree_pineTallC.glb',
  'tree_pinetallc_detailed': 'kenney/nature-kit/tree_pineTallC_detailed.glb',
  'tree_pinetalld': 'kenney/nature-kit/tree_pineTallD.glb',
  'tree_pinetalld_detailed': 'kenney/nature-kit/tree_pineTallD_detailed.glb',
  'tree_plateau': 'kenney/nature-kit/tree_plateau.glb',
  'tree_plateau_dark': 'kenney/nature-kit/tree_plateau_dark.glb',
  'tree_plateau_fall': 'kenney/nature-kit/tree_plateau_fall.glb',
  'tree_simple': 'kenney/nature-kit/tree_simple.glb',
  'tree_simple_dark': 'kenney/nature-kit/tree_simple_dark.glb',
  'tree_simple_fall': 'kenney/nature-kit/tree_simple_fall.glb',
  'tree_small': 'kenney/nature-kit/tree_small.glb',
  'tree_small_dark': 'kenney/nature-kit/tree_small_dark.glb',
  'tree_small_fall': 'kenney/nature-kit/tree_small_fall.glb',
  'tree_tall': 'kenney/nature-kit/tree_tall.glb',
  'tree_tall_dark': 'kenney/nature-kit/tree_tall_dark.glb',
  'tree_tall_fall': 'kenney/nature-kit/tree_tall_fall.glb',
  'tree_thin': 'kenney/nature-kit/tree_thin.glb',
  'tree_thin_dark': 'kenney/nature-kit/tree_thin_dark.glb',
  'tree_thin_fall': 'kenney/nature-kit/tree_thin_fall.glb',
  // === Kenney: Pirate Kit (66 models) ===
  'barrel_pirate': 'kenney/pirate-kit/barrel.glb',
  'boat-row-large': 'kenney/pirate-kit/boat-row-large.glb',
  'boat-row-small': 'kenney/pirate-kit/boat-row-small.glb',
  'bottle-large': 'kenney/pirate-kit/bottle-large.glb',
  'bottle_kn': 'kenney/pirate-kit/bottle.glb',
  'cannon-ball': 'kenney/pirate-kit/cannon-ball.glb',
  'cannon-mobile': 'kenney/pirate-kit/cannon-mobile.glb',
  'cannon_kn': 'kenney/pirate-kit/cannon.glb',
  'chest_pirate': 'kenney/pirate-kit/chest.glb',
  'crate-bottles': 'kenney/pirate-kit/crate-bottles.glb',
  'crate_kn': 'kenney/pirate-kit/crate.glb',
  'flag-high-pennant': 'kenney/pirate-kit/flag-high-pennant.glb',
  'flag-high': 'kenney/pirate-kit/flag-high.glb',
  'flag-pennant_kn': 'kenney/pirate-kit/flag-pennant.glb',
  'flag-pirate-high-pennant': 'kenney/pirate-kit/flag-pirate-high-pennant.glb',
  'flag-pirate-high': 'kenney/pirate-kit/flag-pirate-high.glb',
  'flag-pirate-pennant': 'kenney/pirate-kit/flag-pirate-pennant.glb',
  'flag-pirate': 'kenney/pirate-kit/flag-pirate.glb',
  'flag_pirate': 'kenney/pirate-kit/flag.glb',
  'grass-patch': 'kenney/pirate-kit/grass-patch.glb',
  'grass-plant': 'kenney/pirate-kit/grass-plant.glb',
  'grass_kn': 'kenney/pirate-kit/grass.glb',
  'hole': 'kenney/pirate-kit/hole.glb',
  'palm-bend': 'kenney/pirate-kit/palm-bend.glb',
  'palm-detailed-bend': 'kenney/pirate-kit/palm-detailed-bend.glb',
  'palm-detailed-straight': 'kenney/pirate-kit/palm-detailed-straight.glb',
  'palm-straight': 'kenney/pirate-kit/palm-straight.glb',
  'patch-grass-foliage': 'kenney/pirate-kit/patch-grass-foliage.glb',
  'patch-grass': 'kenney/pirate-kit/patch-grass.glb',
  'patch-sand-foliage': 'kenney/pirate-kit/patch-sand-foliage.glb',
  'patch-sand': 'kenney/pirate-kit/patch-sand.glb',
  'platform-planks': 'kenney/pirate-kit/platform-planks.glb',
  'platform': 'kenney/pirate-kit/platform.glb',
  'rocks-a': 'kenney/pirate-kit/rocks-a.glb',
  'rocks-b': 'kenney/pirate-kit/rocks-b.glb',
  'rocks-c': 'kenney/pirate-kit/rocks-c.glb',
  'rocks-sand-a': 'kenney/pirate-kit/rocks-sand-a.glb',
  'rocks-sand-b': 'kenney/pirate-kit/rocks-sand-b.glb',
  'rocks-sand-c': 'kenney/pirate-kit/rocks-sand-c.glb',
  'ship-ghost': 'kenney/pirate-kit/ship-ghost.glb',
  'ship-large': 'kenney/pirate-kit/ship-large.glb',
  'ship-medium': 'kenney/pirate-kit/ship-medium.glb',
  'ship-pirate-large': 'kenney/pirate-kit/ship-pirate-large.glb',
  'ship-pirate-medium': 'kenney/pirate-kit/ship-pirate-medium.glb',
  'ship-pirate-small': 'kenney/pirate-kit/ship-pirate-small.glb',
  'ship-small': 'kenney/pirate-kit/ship-small.glb',
  'ship-wreck': 'kenney/pirate-kit/ship-wreck.glb',
  'structure-fence-sides': 'kenney/pirate-kit/structure-fence-sides.glb',
  'structure-fence': 'kenney/pirate-kit/structure-fence.glb',
  'structure-platform-dock-small': 'kenney/pirate-kit/structure-platform-dock-small.glb',
  'structure-platform-dock': 'kenney/pirate-kit/structure-platform-dock.glb',
  'structure-platform-small': 'kenney/pirate-kit/structure-platform-small.glb',
  'structure-platform': 'kenney/pirate-kit/structure-platform.glb',
  'structure-roof': 'kenney/pirate-kit/structure-roof.glb',
  'structure': 'kenney/pirate-kit/structure.glb',
  'tool-paddle': 'kenney/pirate-kit/tool-paddle.glb',
  'tool-shovel': 'kenney/pirate-kit/tool-shovel.glb',
  'tower-base-door': 'kenney/pirate-kit/tower-base-door.glb',
  'tower-base_kn': 'kenney/pirate-kit/tower-base.glb',
  'tower-complete-large': 'kenney/pirate-kit/tower-complete-large.glb',
  'tower-complete-small': 'kenney/pirate-kit/tower-complete-small.glb',
  'tower-middle-windows': 'kenney/pirate-kit/tower-middle-windows.glb',
  'tower-middle': 'kenney/pirate-kit/tower-middle.glb',
  'tower-roof': 'kenney/pirate-kit/tower-roof.glb',
  'tower-top_kn': 'kenney/pirate-kit/tower-top.glb',
  'tower-watch': 'kenney/pirate-kit/tower-watch.glb',
  // === Kenney: Space Kit (153 models) ===
  'alien_kn': 'kenney/space-kit/alien.glb',
  'astronauta': 'kenney/space-kit/astronautA.glb',
  'astronautb': 'kenney/space-kit/astronautB.glb',
  'barrel_space': 'kenney/space-kit/barrel.glb',
  'barrels': 'kenney/space-kit/barrels.glb',
  'barrels_rail': 'kenney/space-kit/barrels_rail.glb',
  'bones': 'kenney/space-kit/bones.glb',
  'chimney_kn': 'kenney/space-kit/chimney.glb',
  'chimney_detailed': 'kenney/space-kit/chimney_detailed.glb',
  'corridor': 'kenney/space-kit/corridor.glb',
  'corridor_corner': 'kenney/space-kit/corridor_corner.glb',
  'corridor_cornerround': 'kenney/space-kit/corridor_cornerRound.glb',
  'corridor_cornerroundwindow': 'kenney/space-kit/corridor_cornerRoundWindow.glb',
  'corridor_cross': 'kenney/space-kit/corridor_cross.glb',
  'corridor_detailed': 'kenney/space-kit/corridor_detailed.glb',
  'corridor_end': 'kenney/space-kit/corridor_end.glb',
  'corridor_open': 'kenney/space-kit/corridor_open.glb',
  'corridor_roof': 'kenney/space-kit/corridor_roof.glb',
  'corridor_split': 'kenney/space-kit/corridor_split.glb',
  'corridor_wall': 'kenney/space-kit/corridor_wall.glb',
  'corridor_wallcorner': 'kenney/space-kit/corridor_wallCorner.glb',
  'corridor_window': 'kenney/space-kit/corridor_window.glb',
  'corridor_windowclosed': 'kenney/space-kit/corridor_windowClosed.glb',
  'craft_cargoa': 'kenney/space-kit/craft_cargoA.glb',
  'craft_cargob': 'kenney/space-kit/craft_cargoB.glb',
  'craft_miner': 'kenney/space-kit/craft_miner.glb',
  'craft_racer': 'kenney/space-kit/craft_racer.glb',
  'craft_speedera': 'kenney/space-kit/craft_speederA.glb',
  'craft_speederb': 'kenney/space-kit/craft_speederB.glb',
  'craft_speederc': 'kenney/space-kit/craft_speederC.glb',
  'craft_speederd': 'kenney/space-kit/craft_speederD.glb',
  'crater': 'kenney/space-kit/crater.glb',
  'craterlarge': 'kenney/space-kit/craterLarge.glb',
  'desk_chair': 'kenney/space-kit/desk_chair.glb',
  'desk_chairarms': 'kenney/space-kit/desk_chairArms.glb',
  'desk_chairstool': 'kenney/space-kit/desk_chairStool.glb',
  'desk_computer': 'kenney/space-kit/desk_computer.glb',
  'desk_computercorner': 'kenney/space-kit/desk_computerCorner.glb',
  'desk_computerscreen': 'kenney/space-kit/desk_computerScreen.glb',
  'gate_complex': 'kenney/space-kit/gate_complex.glb',
  'gate_simple': 'kenney/space-kit/gate_simple.glb',
  'hangar_largea': 'kenney/space-kit/hangar_largeA.glb',
  'hangar_largeb': 'kenney/space-kit/hangar_largeB.glb',
  'hangar_rounda': 'kenney/space-kit/hangar_roundA.glb',
  'hangar_roundb': 'kenney/space-kit/hangar_roundB.glb',
  'hangar_roundglass': 'kenney/space-kit/hangar_roundGlass.glb',
  'hangar_smalla': 'kenney/space-kit/hangar_smallA.glb',
  'hangar_smallb': 'kenney/space-kit/hangar_smallB.glb',
  'machine_barrel': 'kenney/space-kit/machine_barrel.glb',
  'machine_barrellarge': 'kenney/space-kit/machine_barrelLarge.glb',
  'machine_generator': 'kenney/space-kit/machine_generator.glb',
  'machine_generatorlarge': 'kenney/space-kit/machine_generatorLarge.glb',
  'machine_wireless': 'kenney/space-kit/machine_wireless.glb',
  'machine_wirelesscable': 'kenney/space-kit/machine_wirelessCable.glb',
  'meteor': 'kenney/space-kit/meteor.glb',
  'meteor_detailed': 'kenney/space-kit/meteor_detailed.glb',
  'meteor_half': 'kenney/space-kit/meteor_half.glb',
  'monorail_trackcornerlarge': 'kenney/space-kit/monorail_trackCornerLarge.glb',
  'monorail_trackcornersmall': 'kenney/space-kit/monorail_trackCornerSmall.glb',
  'monorail_trackslope': 'kenney/space-kit/monorail_trackSlope.glb',
  'monorail_trackstraight': 'kenney/space-kit/monorail_trackStraight.glb',
  'monorail_tracksupport': 'kenney/space-kit/monorail_trackSupport.glb',
  'monorail_tracksupportcorner': 'kenney/space-kit/monorail_trackSupportCorner.glb',
  'monorail_trainbox': 'kenney/space-kit/monorail_trainBox.glb',
  'monorail_traincargo': 'kenney/space-kit/monorail_trainCargo.glb',
  'monorail_trainend': 'kenney/space-kit/monorail_trainEnd.glb',
  'monorail_trainflat': 'kenney/space-kit/monorail_trainFlat.glb',
  'monorail_trainfront': 'kenney/space-kit/monorail_trainFront.glb',
  'monorail_trainpassenger': 'kenney/space-kit/monorail_trainPassenger.glb',
  'pipe_corner': 'kenney/space-kit/pipe_corner.glb',
  'pipe_cornerdiagonal': 'kenney/space-kit/pipe_cornerDiagonal.glb',
  'pipe_cornerround': 'kenney/space-kit/pipe_cornerRound.glb',
  'pipe_cornerroundlarge': 'kenney/space-kit/pipe_cornerRoundLarge.glb',
  'pipe_cross': 'kenney/space-kit/pipe_cross.glb',
  'pipe_end': 'kenney/space-kit/pipe_end.glb',
  'pipe_entrance': 'kenney/space-kit/pipe_entrance.glb',
  'pipe_open': 'kenney/space-kit/pipe_open.glb',
  'pipe_ramplarge': 'kenney/space-kit/pipe_rampLarge.glb',
  'pipe_rampsmall': 'kenney/space-kit/pipe_rampSmall.glb',
  'pipe_ring': 'kenney/space-kit/pipe_ring.glb',
  'pipe_ringhigh': 'kenney/space-kit/pipe_ringHigh.glb',
  'pipe_ringhighend': 'kenney/space-kit/pipe_ringHighEnd.glb',
  'pipe_ringsupport': 'kenney/space-kit/pipe_ringSupport.glb',
  'pipe_split': 'kenney/space-kit/pipe_split.glb',
  'pipe_straight': 'kenney/space-kit/pipe_straight.glb',
  'pipe_supporthigh': 'kenney/space-kit/pipe_supportHigh.glb',
  'pipe_supportlow': 'kenney/space-kit/pipe_supportLow.glb',
  'platform_center': 'kenney/space-kit/platform_center.glb',
  'platform_corner': 'kenney/space-kit/platform_corner.glb',
  'platform_corneropen': 'kenney/space-kit/platform_cornerOpen.glb',
  'platform_cornerround': 'kenney/space-kit/platform_cornerRound.glb',
  'platform_end': 'kenney/space-kit/platform_end.glb',
  'platform_high': 'kenney/space-kit/platform_high.glb',
  'platform_large': 'kenney/space-kit/platform_large.glb',
  'platform_long': 'kenney/space-kit/platform_long.glb',
  'platform_low': 'kenney/space-kit/platform_low.glb',
  'platform_side': 'kenney/space-kit/platform_side.glb',
  'platform_small': 'kenney/space-kit/platform_small.glb',
  'platform_smalldiagonal': 'kenney/space-kit/platform_smallDiagonal.glb',
  'platform_straight': 'kenney/space-kit/platform_straight.glb',
  'rail': 'kenney/space-kit/rail.glb',
  'rail_corner': 'kenney/space-kit/rail_corner.glb',
  'rail_end': 'kenney/space-kit/rail_end.glb',
  'rail_middle': 'kenney/space-kit/rail_middle.glb',
  'rock_kn': 'kenney/space-kit/rock.glb',
  'rock_crystals': 'kenney/space-kit/rock_crystals.glb',
  'rock_crystalslargea': 'kenney/space-kit/rock_crystalsLargeA.glb',
  'rock_crystalslargeb': 'kenney/space-kit/rock_crystalsLargeB.glb',
  'rock_largea_kn': 'kenney/space-kit/rock_largeA.glb',
  'rock_largeb_kn': 'kenney/space-kit/rock_largeB.glb',
  'rocket_basea': 'kenney/space-kit/rocket_baseA.glb',
  'rocket_baseb': 'kenney/space-kit/rocket_baseB.glb',
  'rocket_finsa': 'kenney/space-kit/rocket_finsA.glb',
  'rocket_finsb': 'kenney/space-kit/rocket_finsB.glb',
  'rocket_fuela': 'kenney/space-kit/rocket_fuelA.glb',
  'rocket_fuelb': 'kenney/space-kit/rocket_fuelB.glb',
  'rocket_sidesa': 'kenney/space-kit/rocket_sidesA.glb',
  'rocket_sidesb': 'kenney/space-kit/rocket_sidesB.glb',
  'rocket_topa': 'kenney/space-kit/rocket_topA.glb',
  'rocket_topb': 'kenney/space-kit/rocket_topB.glb',
  'rocks_smalla': 'kenney/space-kit/rocks_smallA.glb',
  'rocks_smallb': 'kenney/space-kit/rocks_smallB.glb',
  'rover_kn': 'kenney/space-kit/rover.glb',
  'satellitedish': 'kenney/space-kit/satelliteDish.glb',
  'satellitedish_detailed': 'kenney/space-kit/satelliteDish_detailed.glb',
  'satellitedish_large': 'kenney/space-kit/satelliteDish_large.glb',
  'stairs_space': 'kenney/space-kit/stairs.glb',
  'stairs_corner': 'kenney/space-kit/stairs_corner.glb',
  'stairs_short': 'kenney/space-kit/stairs_short.glb',
  'structure_kn': 'kenney/space-kit/structure.glb',
  'structure_closed': 'kenney/space-kit/structure_closed.glb',
  'structure_detailed': 'kenney/space-kit/structure_detailed.glb',
  'structure_diagonal': 'kenney/space-kit/structure_diagonal.glb',
  'supports_high': 'kenney/space-kit/supports_high.glb',
  'supports_low': 'kenney/space-kit/supports_low.glb',
  'terrain': 'kenney/space-kit/terrain.glb',
  'terrain_ramp': 'kenney/space-kit/terrain_ramp.glb',
  'terrain_ramplarge': 'kenney/space-kit/terrain_rampLarge.glb',
  'terrain_ramplarge_detailed': 'kenney/space-kit/terrain_rampLarge_detailed.glb',
  'terrain_roadcorner': 'kenney/space-kit/terrain_roadCorner.glb',
  'terrain_roadcross': 'kenney/space-kit/terrain_roadCross.glb',
  'terrain_roadend': 'kenney/space-kit/terrain_roadEnd.glb',
  'terrain_roadsplit': 'kenney/space-kit/terrain_roadSplit.glb',
  'terrain_roadstraight': 'kenney/space-kit/terrain_roadStraight.glb',
  'terrain_side': 'kenney/space-kit/terrain_side.glb',
  'terrain_sidecliff': 'kenney/space-kit/terrain_sideCliff.glb',
  'terrain_sidecorner': 'kenney/space-kit/terrain_sideCorner.glb',
  'terrain_sidecornerinner': 'kenney/space-kit/terrain_sideCornerInner.glb',
  'terrain_sideend': 'kenney/space-kit/terrain_sideEnd.glb',
  'turret_double': 'kenney/space-kit/turret_double.glb',
  'turret_single': 'kenney/space-kit/turret_single.glb',
  'weapon_gun': 'kenney/space-kit/weapon_gun.glb',
  'weapon_rifle': 'kenney/space-kit/weapon_rifle.glb',
  // === Kenney: Space Station (177 models) ===
  'balcony-floor-center': 'kenney/space-station/balcony-floor-center.glb',
  'balcony-floor-corner': 'kenney/space-station/balcony-floor-corner.glb',
  'balcony-floor': 'kenney/space-station/balcony-floor.glb',
  'balcony-rail-center': 'kenney/space-station/balcony-rail-center.glb',
  'balcony-rail-corner': 'kenney/space-station/balcony-rail-corner.glb',
  'balcony-rail': 'kenney/space-station/balcony-rail.glb',
  'bed-double-cover': 'kenney/space-station/bed-double-cover.glb',
  'bed-double': 'kenney/space-station/bed-double.glb',
  'bed-single-cover': 'kenney/space-station/bed-single-cover.glb',
  'bed-single': 'kenney/space-station/bed-single.glb',
  'chair-armrest-headrest': 'kenney/space-station/chair-armrest-headrest.glb',
  'chair-armrest': 'kenney/space-station/chair-armrest.glb',
  'chair-cushion-headrest': 'kenney/space-station/chair-cushion-headrest.glb',
  'chair-cushion': 'kenney/space-station/chair-cushion.glb',
  'chair-headrest': 'kenney/space-station/chair-headrest.glb',
  'chair_space-station': 'kenney/space-station/chair.glb',
  'computer-screen': 'kenney/space-station/computer-screen.glb',
  'computer-system': 'kenney/space-station/computer-system.glb',
  'computer-wide': 'kenney/space-station/computer-wide.glb',
  'computer_kn': 'kenney/space-station/computer.glb',
  'container-flat-open': 'kenney/space-station/container-flat-open.glb',
  'container-flat': 'kenney/space-station/container-flat.glb',
  'container-tall': 'kenney/space-station/container-tall.glb',
  'container-wide': 'kenney/space-station/container-wide.glb',
  'container': 'kenney/space-station/container.glb',
  'display-wall-wide': 'kenney/space-station/display-wall-wide.glb',
  'display-wall': 'kenney/space-station/display-wall.glb',
  'door-double-closed': 'kenney/space-station/door-double-closed.glb',
  'door-double-half': 'kenney/space-station/door-double-half.glb',
  'door-double': 'kenney/space-station/door-double.glb',
  'door-single-closed': 'kenney/space-station/door-single-closed.glb',
  'door-single-half': 'kenney/space-station/door-single-half.glb',
  'door-single': 'kenney/space-station/door-single.glb',
  'floor-corner': 'kenney/space-station/floor-corner.glb',
  'floor-detail_kn': 'kenney/space-station/floor-detail.glb',
  'floor-panel-corner': 'kenney/space-station/floor-panel-corner.glb',
  'floor-panel-end': 'kenney/space-station/floor-panel-end.glb',
  'floor-panel-straight': 'kenney/space-station/floor-panel-straight.glb',
  'floor-panel': 'kenney/space-station/floor-panel.glb',
  'floor_kn': 'kenney/space-station/floor.glb',
  'object': 'kenney/space-station/object.glb',
  'object_001': 'kenney/space-station/object_001.glb',
  'object_002': 'kenney/space-station/object_002.glb',
  'object_003': 'kenney/space-station/object_003.glb',
  'object_004': 'kenney/space-station/object_004.glb',
  'object_005': 'kenney/space-station/object_005.glb',
  'object_006': 'kenney/space-station/object_006.glb',
  'object_007': 'kenney/space-station/object_007.glb',
  'object_008': 'kenney/space-station/object_008.glb',
  'object_009': 'kenney/space-station/object_009.glb',
  'object_010': 'kenney/space-station/object_010.glb',
  'object_011': 'kenney/space-station/object_011.glb',
  'object_012': 'kenney/space-station/object_012.glb',
  'object_013': 'kenney/space-station/object_013.glb',
  'object_014': 'kenney/space-station/object_014.glb',
  'object_015': 'kenney/space-station/object_015.glb',
  'object_016': 'kenney/space-station/object_016.glb',
  'object_017': 'kenney/space-station/object_017.glb',
  'object_018': 'kenney/space-station/object_018.glb',
  'object_019': 'kenney/space-station/object_019.glb',
  'object_020': 'kenney/space-station/object_020.glb',
  'object_021': 'kenney/space-station/object_021.glb',
  'object_022': 'kenney/space-station/object_022.glb',
  'object_023': 'kenney/space-station/object_023.glb',
  'object_024': 'kenney/space-station/object_024.glb',
  'object_025': 'kenney/space-station/object_025.glb',
  'object_026': 'kenney/space-station/object_026.glb',
  'object_027': 'kenney/space-station/object_027.glb',
  'object_028': 'kenney/space-station/object_028.glb',
  'object_029': 'kenney/space-station/object_029.glb',
  'object_030': 'kenney/space-station/object_030.glb',
  'object_031': 'kenney/space-station/object_031.glb',
  'object_032': 'kenney/space-station/object_032.glb',
  'object_033': 'kenney/space-station/object_033.glb',
  'object_034': 'kenney/space-station/object_034.glb',
  'object_035': 'kenney/space-station/object_035.glb',
  'object_036': 'kenney/space-station/object_036.glb',
  'object_037': 'kenney/space-station/object_037.glb',
  'object_038': 'kenney/space-station/object_038.glb',
  'object_039': 'kenney/space-station/object_039.glb',
  'object_040': 'kenney/space-station/object_040.glb',
  'object_041': 'kenney/space-station/object_041.glb',
  'object_042': 'kenney/space-station/object_042.glb',
  'object_043': 'kenney/space-station/object_043.glb',
  'object_044': 'kenney/space-station/object_044.glb',
  'object_045': 'kenney/space-station/object_045.glb',
  'object_046': 'kenney/space-station/object_046.glb',
  'object_047': 'kenney/space-station/object_047.glb',
  'object_048': 'kenney/space-station/object_048.glb',
  'object_049': 'kenney/space-station/object_049.glb',
  'object_050': 'kenney/space-station/object_050.glb',
  'object_051': 'kenney/space-station/object_051.glb',
  'object_052': 'kenney/space-station/object_052.glb',
  'object_053': 'kenney/space-station/object_053.glb',
  'object_054': 'kenney/space-station/object_054.glb',
  'object_055': 'kenney/space-station/object_055.glb',
  'object_056': 'kenney/space-station/object_056.glb',
  'object_057': 'kenney/space-station/object_057.glb',
  'object_058': 'kenney/space-station/object_058.glb',
  'object_059': 'kenney/space-station/object_059.glb',
  'object_060': 'kenney/space-station/object_060.glb',
  'object_061': 'kenney/space-station/object_061.glb',
  'object_062': 'kenney/space-station/object_062.glb',
  'object_063': 'kenney/space-station/object_063.glb',
  'object_064': 'kenney/space-station/object_064.glb',
  'object_065': 'kenney/space-station/object_065.glb',
  'object_066': 'kenney/space-station/object_066.glb',
  'object_067': 'kenney/space-station/object_067.glb',
  'object_068': 'kenney/space-station/object_068.glb',
  'object_069': 'kenney/space-station/object_069.glb',
  'object_070': 'kenney/space-station/object_070.glb',
  'object_071': 'kenney/space-station/object_071.glb',
  'object_072': 'kenney/space-station/object_072.glb',
  'object_073': 'kenney/space-station/object_073.glb',
  'object_074': 'kenney/space-station/object_074.glb',
  'object_075': 'kenney/space-station/object_075.glb',
  'object_076': 'kenney/space-station/object_076.glb',
  'object_077': 'kenney/space-station/object_077.glb',
  'object_078': 'kenney/space-station/object_078.glb',
  'object_079': 'kenney/space-station/object_079.glb',
  'pipe-bend-diagonal': 'kenney/space-station/pipe-bend-diagonal.glb',
  'pipe-bend': 'kenney/space-station/pipe-bend.glb',
  'pipe-end-colored': 'kenney/space-station/pipe-end-colored.glb',
  'pipe-end': 'kenney/space-station/pipe-end.glb',
  'pipe-ring-colored': 'kenney/space-station/pipe-ring-colored.glb',
  'pipe-ring': 'kenney/space-station/pipe-ring.glb',
  'pipe_kn': 'kenney/space-station/pipe.glb',
  'rail-narrow': 'kenney/space-station/rail-narrow.glb',
  'rail_kn': 'kenney/space-station/rail.glb',
  'rocks_space-station': 'kenney/space-station/rocks.glb',
  'skip-rocks': 'kenney/space-station/skip-rocks.glb',
  'skip': 'kenney/space-station/skip.glb',
  'stairs-corner-inner': 'kenney/space-station/stairs-corner-inner.glb',
  'stairs-corner': 'kenney/space-station/stairs-corner.glb',
  'stairs-handrail-single': 'kenney/space-station/stairs-handrail-single.glb',
  'stairs-handrail': 'kenney/space-station/stairs-handrail.glb',
  'stairs-ramp': 'kenney/space-station/stairs-ramp.glb',
  'stairs-small-center': 'kenney/space-station/stairs-small-center.glb',
  'stairs-small-corner-inner': 'kenney/space-station/stairs-small-corner-inner.glb',
  'stairs-small-corner': 'kenney/space-station/stairs-small-corner.glb',
  'stairs-small-edge-handrail': 'kenney/space-station/stairs-small-edge-handrail.glb',
  'stairs-small-edge': 'kenney/space-station/stairs-small-edge.glb',
  'stairs-small-edges-handrail': 'kenney/space-station/stairs-small-edges-handrail.glb',
  'stairs-small-edges': 'kenney/space-station/stairs-small-edges.glb',
  'stairs_space-station': 'kenney/space-station/stairs.glb',
  'structure-barrier-high': 'kenney/space-station/structure-barrier-high.glb',
  'structure-barrier': 'kenney/space-station/structure-barrier.glb',
  'structure-panel': 'kenney/space-station/structure-panel.glb',
  'structure_space-station': 'kenney/space-station/structure.glb',
  'table-display-planet': 'kenney/space-station/table-display-planet.glb',
  'table-display-small': 'kenney/space-station/table-display-small.glb',
  'table-display': 'kenney/space-station/table-display.glb',
  'table-inset-small': 'kenney/space-station/table-inset-small.glb',
  'table-inset': 'kenney/space-station/table-inset.glb',
  'table-large': 'kenney/space-station/table-large.glb',
  'table_space-station': 'kenney/space-station/table.glb',
  'wall-banner': 'kenney/space-station/wall-banner.glb',
  'wall-corner-banner': 'kenney/space-station/wall-corner-banner.glb',
  'wall-corner-round-banner': 'kenney/space-station/wall-corner-round-banner.glb',
  'wall-corner-round': 'kenney/space-station/wall-corner-round.glb',
  'wall-corner_space-station': 'kenney/space-station/wall-corner.glb',
  'wall-detail': 'kenney/space-station/wall-detail.glb',
  'wall-door-banner': 'kenney/space-station/wall-door-banner.glb',
  'wall-door-center': 'kenney/space-station/wall-door-center.glb',
  'wall-door-edge-banner': 'kenney/space-station/wall-door-edge-banner.glb',
  'wall-door-edge': 'kenney/space-station/wall-door-edge.glb',
  'wall-door-wide-banner': 'kenney/space-station/wall-door-wide-banner.glb',
  'wall-door-wide': 'kenney/space-station/wall-door-wide.glb',
  'wall-door_kn': 'kenney/space-station/wall-door.glb',
  'wall-pillar-banner': 'kenney/space-station/wall-pillar-banner.glb',
  'wall-pillar_kn': 'kenney/space-station/wall-pillar.glb',
  'wall-switch': 'kenney/space-station/wall-switch.glb',
  'wall-window-banner': 'kenney/space-station/wall-window-banner.glb',
  'wall-window-frame': 'kenney/space-station/wall-window-frame.glb',
  'wall-window-shutters_kn': 'kenney/space-station/wall-window-shutters.glb',
  'wall-window': 'kenney/space-station/wall-window.glb',
  'wall_space-station': 'kenney/space-station/wall.glb',
  // === Kenney: Survival Kit (80 models) ===
  'barrel-open': 'kenney/survival-kit/barrel-open.glb',
  'barrel_survival': 'kenney/survival-kit/barrel.glb',
  'bedroll-frame': 'kenney/survival-kit/bedroll-frame.glb',
  'bedroll-packed': 'kenney/survival-kit/bedroll-packed.glb',
  'bedroll': 'kenney/survival-kit/bedroll.glb',
  'bottle-large_kn': 'kenney/survival-kit/bottle-large.glb',
  'bottle_survival': 'kenney/survival-kit/bottle.glb',
  'box-large-open': 'kenney/survival-kit/box-large-open.glb',
  'box-large': 'kenney/survival-kit/box-large.glb',
  'box-open': 'kenney/survival-kit/box-open.glb',
  'box': 'kenney/survival-kit/box.glb',
  'bucket_kn': 'kenney/survival-kit/bucket.glb',
  'campfire-fishing-stand': 'kenney/survival-kit/campfire-fishing-stand.glb',
  'campfire-pit': 'kenney/survival-kit/campfire-pit.glb',
  'campfire-stand': 'kenney/survival-kit/campfire-stand.glb',
  'chest_survival': 'kenney/survival-kit/chest.glb',
  'fence-doorway': 'kenney/survival-kit/fence-doorway.glb',
  'fence-fortified': 'kenney/survival-kit/fence-fortified.glb',
  'fence_survival': 'kenney/survival-kit/fence.glb',
  'fish-large': 'kenney/survival-kit/fish-large.glb',
  'fish_survival': 'kenney/survival-kit/fish.glb',
  'floor-hole': 'kenney/survival-kit/floor-hole.glb',
  'floor-old': 'kenney/survival-kit/floor-old.glb',
  'floor_survival': 'kenney/survival-kit/floor.glb',
  'grass-large': 'kenney/survival-kit/grass-large.glb',
  'grass_survival': 'kenney/survival-kit/grass.glb',
  'metal-panel-narrow': 'kenney/survival-kit/metal-panel-narrow.glb',
  'metal-panel-screws-half': 'kenney/survival-kit/metal-panel-screws-half.glb',
  'metal-panel-screws-narrow': 'kenney/survival-kit/metal-panel-screws-narrow.glb',
  'metal-panel-screws': 'kenney/survival-kit/metal-panel-screws.glb',
  'metal-panel': 'kenney/survival-kit/metal-panel.glb',
  'patch-grass-large': 'kenney/survival-kit/patch-grass-large.glb',
  'patch-grass_kn': 'kenney/survival-kit/patch-grass.glb',
  'resource-planks': 'kenney/survival-kit/resource-planks.glb',
  'resource-stone-large': 'kenney/survival-kit/resource-stone-large.glb',
  'resource-stone': 'kenney/survival-kit/resource-stone.glb',
  'resource-wood': 'kenney/survival-kit/resource-wood.glb',
  'rock-a': 'kenney/survival-kit/rock-a.glb',
  'rock-b': 'kenney/survival-kit/rock-b.glb',
  'rock-c': 'kenney/survival-kit/rock-c.glb',
  'rock-flat-grass': 'kenney/survival-kit/rock-flat-grass.glb',
  'rock-flat': 'kenney/survival-kit/rock-flat.glb',
  'rock-sand-a': 'kenney/survival-kit/rock-sand-a.glb',
  'rock-sand-b': 'kenney/survival-kit/rock-sand-b.glb',
  'rock-sand-c': 'kenney/survival-kit/rock-sand-c.glb',
  'signpost-single': 'kenney/survival-kit/signpost-single.glb',
  'signpost': 'kenney/survival-kit/signpost.glb',
  'structure-canvas': 'kenney/survival-kit/structure-canvas.glb',
  'structure-floor': 'kenney/survival-kit/structure-floor.glb',
  'structure-metal-doorway': 'kenney/survival-kit/structure-metal-doorway.glb',
  'structure-metal-floor': 'kenney/survival-kit/structure-metal-floor.glb',
  'structure-metal-roof': 'kenney/survival-kit/structure-metal-roof.glb',
  'structure-metal-wall': 'kenney/survival-kit/structure-metal-wall.glb',
  'structure-metal': 'kenney/survival-kit/structure-metal.glb',
  'structure-roof_kn': 'kenney/survival-kit/structure-roof.glb',
  'structure_survival': 'kenney/survival-kit/structure.glb',
  'tent-canvas-half': 'kenney/survival-kit/tent-canvas-half.glb',
  'tent-canvas': 'kenney/survival-kit/tent-canvas.glb',
  'tent': 'kenney/survival-kit/tent.glb',
  'tool-axe-upgraded': 'kenney/survival-kit/tool-axe-upgraded.glb',
  'tool-axe': 'kenney/survival-kit/tool-axe.glb',
  'tool-hammer-upgraded': 'kenney/survival-kit/tool-hammer-upgraded.glb',
  'tool-hammer': 'kenney/survival-kit/tool-hammer.glb',
  'tool-hoe-upgraded': 'kenney/survival-kit/tool-hoe-upgraded.glb',
  'tool-hoe': 'kenney/survival-kit/tool-hoe.glb',
  'tool-pickaxe-upgraded': 'kenney/survival-kit/tool-pickaxe-upgraded.glb',
  'tool-pickaxe': 'kenney/survival-kit/tool-pickaxe.glb',
  'tool-shovel-upgraded': 'kenney/survival-kit/tool-shovel-upgraded.glb',
  'tool-shovel_kn': 'kenney/survival-kit/tool-shovel.glb',
  'tree-autumn-tall': 'kenney/survival-kit/tree-autumn-tall.glb',
  'tree-autumn-trunk': 'kenney/survival-kit/tree-autumn-trunk.glb',
  'tree-autumn': 'kenney/survival-kit/tree-autumn.glb',
  'tree-log-small': 'kenney/survival-kit/tree-log-small.glb',
  'tree-log_kn': 'kenney/survival-kit/tree-log.glb',
  'tree-tall': 'kenney/survival-kit/tree-tall.glb',
  'tree-trunk_kn': 'kenney/survival-kit/tree-trunk.glb',
  'tree_survival': 'kenney/survival-kit/tree.glb',
  'workbench-anvil': 'kenney/survival-kit/workbench-anvil.glb',
  'workbench-grind': 'kenney/survival-kit/workbench-grind.glb',
  'workbench_kn': 'kenney/survival-kit/workbench.glb',
  // === Kenney: Weapon Pack (37 models) ===
  'ammo_machinegun': 'kenney/weapon-pack/ammo_machinegun.glb',
  'ammo_machinegunlauncher': 'kenney/weapon-pack/ammo_machinegunLauncher.glb',
  'ammo_machinegunlaunchergreen': 'kenney/weapon-pack/ammo_machinegunLauncherGreen.glb',
  'ammo_rocket': 'kenney/weapon-pack/ammo_rocket.glb',
  'ammo_rocketmodern': 'kenney/weapon-pack/ammo_rocketModern.glb',
  'ammo_shotgun': 'kenney/weapon-pack/ammo_shotgun.glb',
  'ammo_sniper': 'kenney/weapon-pack/ammo_sniper.glb',
  'ammo_uzi': 'kenney/weapon-pack/ammo_uzi.glb',
  'flamethrower_long': 'kenney/weapon-pack/flamethrower_long.glb',
  'flamethrower_short': 'kenney/weapon-pack/flamethrower_short.glb',
  'grenade': 'kenney/weapon-pack/grenade.glb',
  'grenadeflash': 'kenney/weapon-pack/grenadeFlash.glb',
  'grenadesmoke': 'kenney/weapon-pack/grenadeSmoke.glb',
  'grenadevintage': 'kenney/weapon-pack/grenadeVintage.glb',
  'kniferound_sharp': 'kenney/weapon-pack/knifeRound_sharp.glb',
  'kniferound_smooth': 'kenney/weapon-pack/knifeRound_smooth.glb',
  'knife_sharp': 'kenney/weapon-pack/knife_sharp.glb',
  'knife_smooth': 'kenney/weapon-pack/knife_smooth.glb',
  'machinegun': 'kenney/weapon-pack/machinegun.glb',
  'machinegunlauncher': 'kenney/weapon-pack/machinegunLauncher.glb',
  'pistol': 'kenney/weapon-pack/pistol.glb',
  'pistolsilencer': 'kenney/weapon-pack/pistolSilencer.glb',
  'rocketlauncher': 'kenney/weapon-pack/rocketlauncher.glb',
  'rocketlaunchermodern': 'kenney/weapon-pack/rocketlauncherModern.glb',
  'rocketlauncherside': 'kenney/weapon-pack/rocketlauncherSide.glb',
  'shotgun': 'kenney/weapon-pack/shotgun.glb',
  'shotgunshort': 'kenney/weapon-pack/shotgunShort.glb',
  'sniper': 'kenney/weapon-pack/sniper.glb',
  'snipersand': 'kenney/weapon-pack/sniperSand.glb',
  'uzi': 'kenney/weapon-pack/uzi.glb',
  'uzigold': 'kenney/weapon-pack/uziGold.glb',
  'uzilong': 'kenney/weapon-pack/uziLong.glb',
  'uzilonggold': 'kenney/weapon-pack/uziLongGold.glb',
  'uzilongsilencer': 'kenney/weapon-pack/uziLongSilencer.glb',
  'uzilongsilencergold': 'kenney/weapon-pack/uziLongSilencerGold.glb',
  'uzisilencer': 'kenney/weapon-pack/uziSilencer.glb',
  'uzisilencergold': 'kenney/weapon-pack/uziSilencerGold.glb',
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
  // FoodMegaPack — Fruits (small, need 3.0x)
  apple_fmp: 3.0, apple_slice: 3.0, banana_fmp: 3.0, banana_slice: 3.0,
  grapefruit: 3.0, grapefruit_slice: 3.0, lemon_fmp: 3.0, lemon_slice: 3.0,
  mango: 3.0, mango_slice: 3.0, melon: 2.5, melon_slice: 3.0,
  orange_fmp: 3.0, orange_slice: 3.0, pear_fmp: 3.0, pear_slice: 3.0,
  pineapple_fmp: 2.5, pineapple_slice: 3.0,
  // FoodMegaPack — Vegetables (small, 3.0x)
  bell_pepper: 3.0, bell_pepper_slice: 3.0, broccoli_fmp: 3.0, broccoli_piece: 3.0,
  cabbage_fmp: 2.5, cabbage_slice: 3.0, carrot_fmp: 3.0, carrot_slice: 3.0,
  cauliflower: 2.5, cauliflower_piece: 3.0, chili_pepper: 3.0, chili_pepper_slice: 3.0,
  cucumber: 3.0, cucumber_slice: 3.0, garlic: 3.0, garlic_slice: 3.0,
  onion_fmp: 3.0, onion_slice: 3.0, potato: 3.0, potato_slice: 3.0,
  pumpkin_fmp: 2.5, pumpkin_slice_fmp: 3.0, spring_onion: 3.0, spring_onion_slice: 3.0,
  tomato_fmp: 3.0, tomato_slice: 3.0, turnip: 3.0,
  // FoodMegaPack — Bread/Cheese/Meat (2.5x)
  baguette_fmp: 2.5, baguette_half: 2.5, baguette_slice: 3.0,
  croissant_fmp: 2.5, loaf_fmp: 2.5, loaf_half: 2.5, loaf_slice: 3.0,
  bread_round: 2.5, bread_round_half: 2.5, bread_round_slice: 3.0,
  cheddar: 2.5, cheddar_slice: 3.0, hole_cheese: 2.5, hole_cheese_slice: 3.0,
  white_cheese: 2.5, yellow_cheese: 2.5,
  bacon_fmp: 2.5, bacon_slice_fmp: 3.0, ham: 2.5, ham_slice: 3.0,
  sausage: 2.5, sausage_slice: 3.0,
  // FoodMegaPack — Fish (2.0x)
  halibut: 2.0, halibut_meat: 2.5, salmon: 2.0, salmon_meat: 2.5,
  // FoodMegaPack — Dessert (2.5x)
  cake_fmp: 2.5, cake_slice_fmp: 3.0, jelly: 2.5, jelly_slice: 3.0,
  // FoodMegaPack — Mushroom (3.0x)
  bell_mushroom: 3.0, bell_mushroom_slice: 3.0,
  // FoodMegaPack — Drinks (2.5x)
  bottle_fmp: 2.5, can: 2.5, carton: 2.5,
  // FoodMegaPack — Cutlery/Utensils (3.0x)
  fork: 3.0, knife_fmp: 3.0, spoon_big: 3.0, spoon_small: 3.0,
  big_spoon: 3.0, kitchen_knife: 3.0, ladle: 3.0, spatula: 3.0,
  // FoodMegaPack — Jars (2.5x)
  honey_jar: 2.5, jam_hex: 2.5, jam_round: 2.5,
  // Cartoon City
  car: 1.0, van: 0.8, bus_stop: 0.8, futuristic_car: 0.8,
  fountain_city: 1.0, billboard: 0.8, traffic_light: 1.0,
  trash_can: 1.5, palm_tree: 1.0, spotlight_city: 1.5,
}

/** Default scales by Kenney pack path prefix */
const KENNEY_PACK_SCALE: Record<string, number> = {
  'kenney/castle-kit': 2.5,
  'kenney/fantasy-town': 3.0,
  'kenney/food-kit': 3.0,
  'kenney/furniture-kit': 2.5,
  'kenney/graveyard-kit': 2.5,
  'kenney/holiday-kit': 3.0,
  'kenney/mini-dungeon': 2.0,
  'kenney/nature-kit': 2.5,
  'kenney/pirate-kit': 2.5,
  'kenney/space-kit': 2.0,
  'kenney/space-station': 2.0,
  'kenney/survival-kit': 2.5,
  'kenney/weapon-pack': 2.5,
}

function resolvePropScale(propId: string): number {
  if (PROP_SCALE[propId]) return PROP_SCALE[propId]
  const base = propId.split('_')[0]
  if (base !== propId && PROP_SCALE[base]) return PROP_SCALE[base]
  // Check Kenney pack prefix for default scale
  const path = resolvePropPath(propId)
  if (path) {
    for (const [prefix, scale] of Object.entries(KENNEY_PACK_SCALE)) {
      if (path.startsWith(prefix)) return scale
    }
  }
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

interface EffectParticle {
  type: 'unicode' | 'image'
  content: string // Unicode char or image path
}

interface ActiveEffect {
  id: string
  type: string
  position: [number, number, number]
  emojis: string[] // Legacy: Unicode emojis for backwards compat
  particles: EffectParticle[] // Enhanced: pixel-art + unicode mix
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

/** Enhanced particle system: pixel-art emoji images for select effects, Unicode fallback for rest */
function getEffectParticles(effect: string): EffectParticle[] {
  // Effects that use pixel-art emoji faces for extra expressiveness
  const pixelArtEffects: Record<string, string[]> = {
    'confetti-burst': ['party', 'happy', 'star_eyes', 'excited', 'love_eyes', 'cool', 'laughing'],
    'hearts-float': ['love_eyes', 'love_eyes', 'happy', 'love_eyes', 'blushing', 'love_eyes', 'happy'],
    'laugh-tears': ['laughing', 'silly', 'laughing', 'tongue_out', 'laughing', 'mischievous'],
    'sad-cloud': ['sad', 'crying', 'sad', 'worried', 'sad', 'crying'],
    'sparkle-magic': ['star_eyes', 'happy', 'mind_blown', 'star_eyes', 'excited', 'star_eyes', 'cool'],
    'explosion-cartoon': ['shocked', 'dizzy', 'surprised', 'mind_blown', 'shocked', 'dizzy', 'surprised'],
    'glow-pulse': ['star_eyes', 'happy', 'excited', 'star_eyes', 'happy', 'excited'],
    'skull-burst': ['ghost', 'scared', 'ghost', 'dizzy', 'ghost', 'scared'],
  }

  const emojiNames = pixelArtEffects[effect]
  if (emojiNames) {
    return emojiNames.map(name => {
      const path = getEmojiOutlinePath(name)
      return path ? { type: 'image' as const, content: path } : { type: 'unicode' as const, content: '✨' }
    })
  }

  // Fall back to Unicode emojis for effects without pixel-art mapping
  return getEffectEmojis(effect).map(emoji => ({ type: 'unicode' as const, content: emoji }))
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
      particles: getEffectParticles(effect),
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

      {/* Effects — enhanced particle burst with pixel-art emoji images */}
      {effects.map((effect) => (
        <Html key={effect.id} position={effect.position} center>
          <div className="particle-burst select-none pointer-events-none" style={{ position: 'relative', width: 140, height: 140 }}>
            {effect.particles.map((particle, i) => {
              const count = effect.particles.length
              const angle = (i / count) * 360 + (Math.random() * 15 - 7.5)
              const distance = 35 + Math.random() * 25
              const dx = Math.cos((angle * Math.PI) / 180) * distance
              const dy = -Math.abs(Math.sin((angle * Math.PI) / 180) * distance) - 15
              const gravity = 20 // drift down
              const delay = i * 0.07
              const rot = Math.random() * 360
              return particle.type === 'image' ? (
                <img
                  key={i}
                  src={particle.content}
                  alt=""
                  className="absolute"
                  style={{
                    width: 28, height: 28,
                    imageRendering: 'pixelated',
                    left: '50%', top: '50%',
                    animation: `particle-pop 1.8s ease-out ${delay}s both`,
                    ['--dx' as string]: `${dx}px`,
                    ['--dy' as string]: `${dy}px`,
                    ['--gravity' as string]: `${gravity}px`,
                    ['--rot' as string]: `${rot}deg`,
                  }}
                />
              ) : (
                <span
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: '50%', top: '50%',
                    animation: `particle-pop 1.8s ease-out ${delay}s both`,
                    ['--dx' as string]: `${dx}px`,
                    ['--dy' as string]: `${dy}px`,
                    ['--gravity' as string]: `${gravity}px`,
                    ['--rot' as string]: `${rot}deg`,
                  }}
                >
                  {particle.content}
                </span>
              )
            })}
          </div>
          <style>{`
            @keyframes particle-pop {
              0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
              15% { transform: translate(-50%, -50%) scale(1.4) rotate(calc(var(--rot) * 0.3)); opacity: 1; }
              50% { transform: translate(calc(-50% + var(--dx) * 0.6), calc(-50% + var(--dy) * 0.6)) scale(1.1) rotate(calc(var(--rot) * 0.7)); opacity: 1; }
              100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy) + var(--gravity))) scale(0.3) rotate(var(--rot)); opacity: 0; }
            }
          `}</style>
        </Html>
      ))}

      {/* Emotes (speech bubbles above actors) — pixel-art bubble images with Unicode fallback */}
      {emotes.map((emote) => {
        const actorPos = getActorPosition(emote.actorId)
        const emotePos: [number, number, number] = [actorPos[0], actorPos[1] + 2, actorPos[2]]
        const emojiImagePath = emote.emoji ? resolveEmojiImage(emote.emoji) : null

        return (
          <Html key={emote.id} position={emotePos} center>
            <div
              className="bg-white/90 rounded-full px-3 py-2 shadow-lg select-none pointer-events-none flex items-center gap-1"
              style={{ animation: 'emote-pop 0.3s ease-out, emote-fade 2s ease-in-out' }}
            >
              {emote.emoji && (
                emojiImagePath ? (
                  <img
                    src={emojiImagePath}
                    alt={emote.emoji}
                    style={{ width: 48, height: 48, imageRendering: 'pixelated' }}
                  />
                ) : (
                  <span className="text-2xl">{emote.emoji}</span>
                )
              )}
              {emote.text && <span className="text-gray-800 font-semibold text-base">{emote.text}</span>}
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
