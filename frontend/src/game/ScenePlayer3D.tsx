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
import { CHARACTERS, ANIMAL_MODELS, type CharacterKey } from '../data/asset-manifest'
import { useGameStore, ZONE_CENTERS } from '../stores/gameStore'

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

const LOCAL_POSITION_MAP: Record<Position, [number, number, number]> = {
  left: [-3, 0, 0],
  center: [0, 0, 0],
  right: [3, 0, 0],
  top: [0, 2, -2],
  bottom: [0, 0, 2],
  'off-left': [-6, 0, 0],
  'off-right': [6, 0, 0],
  'off-top': [0, 5, 0],
}

// Kept for backward compatibility — resolves to zone-relative positions at runtime
const POSITION_MAP = LOCAL_POSITION_MAP

/** Offset a local position by the current zone center */
function zonePosition(
  zoneId: string | null,
  localPos: [number, number, number]
): [number, number, number] {
  if (!zoneId) return localPos
  const center = ZONE_CENTERS[zoneId]
  if (!center) return localPos
  return [center[0] + localPos[0], localPos[1], center[2] + localPos[2]]
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

  // === RPG Tools / Instruments ===
  sword: 'kaykit/packs/dungeon/sword_shield.gltf',
  shield: 'kaykit/packs/dungeon/banner_shield_blue.gltf',
  guitar: 'kaykit/packs/rpg_tools/axe.gltf',
  drums: 'kaykit/packs/dungeon/barrel_small.gltf',
  keyboard: 'kaykit/packs/furniture/desk.gltf',
  microphone: 'kaykit/packs/dungeon/torch.gltf',
  pencil: 'kaykit/packs/rpg_tools/chisel.gltf',

  // === Outdoors (Tiny Treats + Dungeon) ===
  tree: 'tiny-treats/pretty-park/tree.gltf',
  tree_large: 'tiny-treats/pretty-park/tree_large.gltf',
  rock: 'kaykit/packs/dungeon/barrel_small.gltf',
  bush: 'tiny-treats/pretty-park/bush.gltf',
  bench: 'tiny-treats/pretty-park/bench.gltf',
  fountain: 'tiny-treats/pretty-park/bench.gltf',
  river: 'tiny-treats/pretty-park/bench.gltf',
  lamp: 'kaykit/packs/dungeon/torch.gltf',
  fence: 'kaykit/packs/dungeon/barrel_small.gltf',
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
  potion: 'kaykit/packs/dungeon/barrel_small.gltf',
  scroll: 'kaykit/packs/dungeon/book_tan.gltf',
  bow: 'kaykit/packs/rpg_tools/fishing_rod.gltf',
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

export const TASK_ENVIRONMENTS: Record<string, EnvironmentProp[]> = {
  'skeleton-birthday': [
    { id: 'env-torch-l', path: 'kaykit/packs/dungeon/torch_lit.gltf', position: [-5, 0, -3], scale: 2.0 },
    { id: 'env-torch-r', path: 'kaykit/packs/dungeon/torch_lit.gltf', position: [5, 0, -3], scale: 2.0 },
    { id: 'env-barrel', path: 'kaykit/packs/dungeon/barrel_large.gltf', position: [-4, 0, -2], scale: 0.8 },
    { id: 'env-banner', path: 'kaykit/packs/dungeon/banner_blue.gltf', position: [0, 0, -4], scale: 0.6 },
  ],
  'knight-space': [
    { id: 'env-module', path: 'kaykit/packs/space_base/basemodule_A.gltf', position: [0, 0, -4], scale: 0.8 },
    { id: 'env-panel', path: 'kaykit/packs/space_base/solarpanel.gltf', position: [-4, 0, -2], scale: 0.8 },
    { id: 'env-cargo', path: 'kaykit/packs/space_base/cargo_A.gltf', position: [4, 0, -2], scale: 0.8 },
  ],
  'mage-kitchen': [
    { id: 'env-stove', path: 'tiny-treats/charming-kitchen/stove.gltf', position: [-3, 0, -3], scale: 1.5 },
    { id: 'env-fridge', path: 'tiny-treats/charming-kitchen/fridge.gltf', position: [3, 0, -3], scale: 1.5 },
    { id: 'env-cabinet', path: 'tiny-treats/charming-kitchen/wall_cabinet_straight.gltf', position: [0, 0, -4], scale: 1.5 },
  ],
  'barbarian-school': [
    { id: 'env-slide', path: 'tiny-treats/fun-playground/slide_A.gltf', position: [-4, 0, -3], scale: 1.2 },
    { id: 'env-seesaw', path: 'tiny-treats/fun-playground/seesaw_large.gltf', position: [4, 0, -3], scale: 1.2 },
    { id: 'env-sandbox', path: 'tiny-treats/fun-playground/sandbox_square_decorated.gltf', position: [0, 0, -4], scale: 1.0 },
  ],
  'dungeon-concert': [
    { id: 'env-torch-l', path: 'kaykit/packs/dungeon/torch_lit.gltf', position: [-5, 0, -3], scale: 2.0 },
    { id: 'env-torch-r', path: 'kaykit/packs/dungeon/torch_lit.gltf', position: [5, 0, -3], scale: 2.0 },
    { id: 'env-table', path: 'kaykit/packs/dungeon/table_long.gltf', position: [0, 0, -4], scale: 0.8 },
    { id: 'env-barrel-l', path: 'kaykit/packs/dungeon/barrel_large.gltf', position: [-3, 0, -2], scale: 0.8 },
    { id: 'env-barrel-r', path: 'kaykit/packs/dungeon/barrel_large.gltf', position: [3, 0, -2], scale: 0.8 },
  ],
  'skeleton-pizza': [
    { id: 'env-stove', path: 'tiny-treats/charming-kitchen/stove.gltf', position: [-4, 0, -3], scale: 1.5 },
    { id: 'env-oven', path: 'kaykit/packs/restaurant/oven.gltf', position: [4, 0, -3], scale: 0.8 },
    { id: 'env-table', path: 'kaykit/packs/dungeon/table_long.gltf', position: [0, 0, -4], scale: 0.8 },
  ],
  'adventurers-picnic': [
    { id: 'env-tree-l', path: 'tiny-treats/pretty-park/tree.gltf', position: [-5, 0, -3], scale: 2.0 },
    { id: 'env-tree-r', path: 'tiny-treats/pretty-park/tree_large.gltf', position: [5, 0, -4], scale: 2.0 },
    { id: 'env-blanket', path: 'tiny-treats/pleasant-picnic/picnic_blanket_red.gltf', position: [0, 0.2, -1], scale: 2.0 },
    { id: 'env-bush', path: 'tiny-treats/pretty-park/bush.gltf', position: [-3, 0, -4], scale: 1.5 },
  ],
}

// ============================================================================
// HERO CHARACTERS — idle characters visible before user submits a prompt
// ============================================================================

interface HeroCharacter {
  id: string
  characterId: CharacterKey
  position: Position
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
// STATE TYPES
// ============================================================================

interface ActiveActor {
  id: string
  type: 'character' | 'prop' | 'animal' | 'procedural'
  characterId?: CharacterKey
  modelPath?: string
  proceduralType?: string  // "balloon"
  position: [number, number, number]
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
// COMPONENT
// ============================================================================

export interface ScenePlayer3DProps {
  script: SceneScript | null
  taskId: string
  onComplete?: () => void
}

export default function ScenePlayer3D({ script, taskId, onComplete }: ScenePlayer3DProps) {
  const [actors, setActors] = useState<ActiveActor[]>([])
  const [envProps, setEnvProps] = useState<EnvironmentProp[]>([])
  const [effects, setEffects] = useState<ActiveEffect[]>([])
  const [emotes, setEmotes] = useState<ActiveEmote[]>([])
  const [tweens, setTweens] = useState<ActiveTween[]>([])

  const actorRefs = useRef<Map<string, Character3DHandle | Prop3DHandle>>(new Map())
  const spawnedIds = useRef<Set<string>>(new Set()) // Track spawned actors (avoids stale closure)
  const actorPositionsRef = useRef<Map<string, [number, number, number]>>(new Map())
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
    setActors([])
    setEffects([])
    setEmotes([])
    spawnedIds.current.clear()
    actorPositionsRef.current.clear()

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

      default:
        console.warn('[ScenePlayer3D] Unknown action type:', action)
    }
  }

  // ============================================================================
  // ACTION HANDLERS (error-tolerant)
  // ============================================================================

  function handleSpawn(target: string, position: Position, resolvedPosition?: [number, number, number]) {
    const localPos = resolvedPosition || POSITION_MAP[position] || [0, 0, 0]
    const pos = zonePosition(currentZone, localPos)
    const actorId = target

    // Resolve target type: character → animal → procedural → prop
    const characterId = resolveCharacterId(actorId)
    const isCharacter = characterId !== null
    const isAnimal = !isCharacter && isAnimalModel(actorId)
    const isProcedural = !isCharacter && !isAnimal && actorId === 'balloon'
    const propPath = !isCharacter && !isAnimal && !isProcedural ? resolvePropPath(actorId) : null

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
        animation: 'Spawn_Ground',
      }
    } else if (isAnimal) {
      newActor = {
        id: actorId,
        type: 'animal',
        modelPath: ANIMAL_MODELS[actorId],
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
        scale: resolvePropScale(actorId),
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
    console.log(`[ScenePlayer3D] Spawned ${actorId} at ${position}${resolvedPosition ? ` [${resolvedPosition.join(', ')}]` : ''}`)
  }

  function handleMove(target: string, to: Position, style?: string, resolvedPosition?: [number, number, number], durationMs?: number): Promise<void> {
    const localPos = resolvedPosition || POSITION_MAP[to] || [0, 0, 0]
    const newPos = zonePosition(currentZone, localPos)
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

    // Also trigger walking animation for characters
    if (currentActor.type === 'character') {
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
          // Return to idle after move
          if (currentActor.type === 'character') {
            handleAnimate(target, 'Idle_A')
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
    SoundManager3D.play('remove')
    console.log(`[ScenePlayer3D] Removed ${target}`)
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
    </>
  )
}
