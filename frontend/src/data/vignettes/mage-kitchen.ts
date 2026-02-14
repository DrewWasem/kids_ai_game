/**
 * Mage Kitchen Quest — Vignettes for Stage 1.
 *
 * Stage 1: "Cast {SPELL} on the {APPLIANCE} to make it {RESULT}"
 * Slots: SPELL (fire_spell/ice_spell/grow_spell/shrink_spell/levitate/transform),
 *        APPLIANCE (stove/fridge/pot/pan/sink/oven),
 *        RESULT (cook_perfectly/explode/dance/multiply/calm_down/go_wild)
 *
 * 36 PAIR vignettes (spell×result, wildcard appliance) + 1 DEFAULT = 37 total.
 * Every vignette has unique characters, movement, and comedy.
 */

import type { Vignette } from '../../types/madlibs';
import { MARK } from '../blocking-templates';

// ─── FIRE SPELL VIGNETTES ────────────────────────────────────────────────────

const FIRE_VIGNETTES: Vignette[] = [
  // ── fire + cook_perfectly: Barbarian Grill Master ──
  {
    id: 'mk_fire_cook', description: 'Barbarian enters as expert grill master, catches and flips food perfectly',
    trigger: { spell: 'fire_spell', appliance: '*', result: 'cook_perfectly' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'ds-right', style: 'linear' },
        { action: 'spawn', asset: 'pan', position: 'ds-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'throw' },
        { action: 'spawn', asset: 'burger', position: MARK.CS_CENTER },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔥 BARBARIAN GRILL MASTER!',
      message: 'Fire + cooking perfectly = the barbarian knows exactly what to do with flames!',
      skillTaught: 'Specificity',
      tip: 'Matching the right spell to the right result brings in the right helper!',
    },
  },

  // ── fire + explode: Pot Rocket Launch ──
  {
    id: 'mk_fire_explode', description: 'Pot launches like a rocket, food rains from sky while cat dodges',
    trigger: { spell: 'fire_spell', appliance: '*', result: 'explode' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.4, duration: 1.0 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'move', asset: 'pot', to: 'off-top', style: 'arc' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'top' },
        { action: 'spawn_rain', asset: 'burger', quantity: 6, position: 'wide' },
        { action: 'camera_shake', intensity: 0.7, duration: 0.5 },
        { action: 'screen_flash', color: 'orange', duration: 0.2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'cat', position: 'off-right' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'off-left', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🚀 POT ROCKET!',
      message: 'Fire + explode = the pot launched into orbit! At least the cat escaped.',
      skillTaught: 'Consequence',
      tip: 'Think about what happens when you combine fire with "explode" — boom!',
    },
  },

  // ── fire + dance: Floor Is Lava Party ──
  {
    id: 'mk_fire_dance', description: 'Kitchen floor catches fire, mage hops around, chicken and dog join the dance',
    trigger: { spell: 'fire_spell', appliance: '*', result: 'dance' },
    tier: 'moderate', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'fire', position: 'ds-left' },
        { action: 'react', effect: 'fire', position: 'ds-right' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'jump_idle' },
        { action: 'emote', character: 'mage', emoji: '🔥' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'chicken', position: 'off-right' },
        { action: 'spawn_character', character: 'dog', position: 'off-left' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'chicken', to: 'ds-right', style: 'bounce' },
        { action: 'move', character: 'dog', to: 'cs-left', style: 'bounce' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'jump_small' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-center' },
        { action: 'text_popup', text: '🕺 DANCE PARTY! 💃', position: 'top', size: 'large' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💃 FLOOR IS LAVA!',
      message: 'Fire + dancing = everyone hopping to avoid the flames! Accidental dance party!',
      skillTaught: 'Creativity',
      tip: 'Sometimes unexpected combos create the funniest scenes!',
    },
  },

  // ── fire + multiply: Infinite Birthday Candles ──
  {
    id: 'mk_fire_multiply', description: 'One candle multiplies into dozens, skeleton firefighter fails to keep up',
    trigger: { spell: 'fire_spell', appliance: '*', result: 'multiply' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'candle', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'candle', position: 'cs-left' },
        { action: 'spawn', asset: 'candle', position: 'cs-right' },
        { action: 'spawn', asset: 'candle', position: 'ds-center' },
        { action: 'react', effect: 'fire', position: 'cs-left' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'off-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'skeleton_warrior', to: 'ds-right', style: 'linear' },
        { action: 'spawn', asset: 'candle', position: 'us-left' },
        { action: 'spawn', asset: 'candle', position: 'us-right' },
        { action: 'react', effect: 'fire', position: 'ds-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'run_panic' },
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'react', effect: 'smoke', position: 'center' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🕯️ CANDLE INVASION!',
      message: 'Fire + multiply = candles everywhere! Even the skeleton couldn\'t put them out!',
      skillTaught: 'Consequence',
      tip: 'Multiplying fire is a recipe for chaos — think about what gets multiplied!',
    },
  },

  // ── fire + calm_down: Cozy Kitchen Campfire ──
  {
    id: 'mk_fire_calm', description: 'Fire becomes a cozy campfire, knight and deer join for marshmallows',
    trigger: { spell: 'fire_spell', appliance: '*', result: 'calm_down' },
    tier: 'subtle', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'knight', to: 'ds-right', style: 'linear' },
        { action: 'spawn', asset: 'cupcake', position: 'ds-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'knight', anim: 'sit_floor' },
        { action: 'spawn_character', character: 'deer', position: 'off-left' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'deer', to: 'cs-left', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'sit_floor' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '🏕️ CAMPFIRE COZY!',
      message: 'Fire + calm = the perfect campfire! Even a deer wandered in for warmth.',
      skillTaught: 'Tone',
      tip: 'The same spell can be gentle or fierce — the RESULT you ask for matters!',
    },
  },

  // ── fire + go_wild: Penguin Fireproof ──
  {
    id: 'mk_fire_wild', description: 'Everything catches fire but penguin waddles in completely unbothered',
    trigger: { spell: 'fire_spell', appliance: '*', result: 'go_wild' },
    tier: 'absolute_chaos', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'ds-center' },
        { action: 'react', effect: 'fire', position: 'cs-left' },
        { action: 'react', effect: 'fire', position: 'cs-right' },
        { action: 'react', effect: 'fire', position: 'us-center' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'move', character: 'mage', to: 'off-left', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'penguin', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'penguin', to: 'ds-center', style: 'linear' },
        { action: 'react', effect: 'fire', position: 'ds-left' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'steam', position: 'ds-center' },
        { action: 'emote', character: 'penguin', emoji: '😎' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '🐧 PENGUIN DON\'T CARE!',
      message: 'Fire + wild = total inferno! But the penguin is completely unbothered.',
      skillTaught: 'Consequence',
      tip: 'Going wild means losing control — not everything responds to fire the same way!',
    },
  },
];

// ─── ICE SPELL VIGNETTES ─────────────────────────────────────────────────────

const ICE_VIGNETTES: Vignette[] = [
  // ── ice + cook_perfectly: Accidental Ice Cream ──
  {
    id: 'mk_ice_cook', description: 'Flash-freeze creates ice cream, dog rushes in and steals it',
    trigger: { spell: 'ice_spell', appliance: '*', result: 'cook_perfectly' },
    tier: 'moderate', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'fridge', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'splash', position: 'cs-center' },
        { action: 'screen_flash', color: 'cyan', duration: 0.3 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'ice_cream', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'animate', character: 'mage', anim: 'celebrate' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'dog', position: 'off-right' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'dog', to: 'cs-center', style: 'bounce' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'dog', to: 'off-right', style: 'linear' },
        { action: 'remove', target: 'ice_cream' },
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'emote', character: 'mage', emoji: '😱' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍦 ICE CREAM HEIST!',
      message: 'Ice + cooking = accidental ice cream! But the dog had other plans...',
      skillTaught: 'Specificity',
      tip: 'Ice can cook frozen treats! But watch out for hungry visitors.',
    },
  },

  // ── ice + explode: Frozen Skeleton Bowling ──
  {
    id: 'mk_ice_explode', description: 'Skeleton gets frozen mid-walk and slides across stage like a bowling ball',
    trigger: { spell: 'ice_spell', appliance: '*', result: 'explode' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'stove', position: 'ds-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'skeleton_warrior', to: 'cs-right', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'screen_flash', color: 'white', duration: 0.3 },
        { action: 'react', effect: 'splash', position: 'cs-right' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'skeleton_warrior', to: 'off-left', style: 'linear' },
        { action: 'sfx', sound: 'move' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'ds-right' },
        { action: 'camera_shake', intensity: 0.7, duration: 0.5 },
        { action: 'animate', character: 'mage', anim: 'dodge_back' },
        { action: 'react', effect: 'dust', position: 'ds-left' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎳 SKELETON BOWLING!',
      message: 'Ice + explode = frozen skeleton slides across the kitchen and crashes!',
      skillTaught: 'Consequence',
      tip: 'Freezing things that are moving creates slippery chaos!',
    },
  },

  // ── ice + dance: Ice Rink Kitchen ──
  {
    id: 'mk_ice_dance', description: 'Kitchen floor freezes into ice rink, ninja and robot slide helplessly',
    trigger: { spell: 'ice_spell', appliance: '*', result: 'dance' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'splash', position: 'center' },
        { action: 'screen_flash', color: 'lightblue', duration: 0.3 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'off-left' },
        { action: 'spawn_character', character: 'robot', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'ninja', to: 'ds-right', style: 'linear' },
        { action: 'move', character: 'robot', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ninja', to: 'cs-left', style: 'linear' },
        { action: 'move', character: 'robot', to: 'cs-right', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'walk_goofy' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_hit' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
        { action: 'react', effect: 'stars-spin', position: 'ds-center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⛸️ ICE RINK KITCHEN!',
      message: 'Ice + dance = everyone\'s slipping and sliding! Nobody can stay on their feet!',
      skillTaught: 'Creativity',
      tip: 'Ice makes surfaces slippery — combine it with dancing for slapstick comedy!',
    },
  },

  // ── ice + multiply: Snowman Army Invasion ──
  {
    id: 'mk_ice_multiply', description: 'One snowman multiplies into an army that fills the kitchen',
    trigger: { spell: 'ice_spell', appliance: '*', result: 'multiply' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'snowman', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn', asset: 'snowman', position: 'cs-left' },
        { action: 'spawn', asset: 'snowman', position: 'cs-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn', asset: 'snowman', position: 'us-left' },
        { action: 'spawn', asset: 'snowman', position: 'us-right' },
        { action: 'spawn', asset: 'snowman', position: 'ds-left' },
        { action: 'spawn', asset: 'snowman', position: 'ds-right' },
        { action: 'animate', character: 'mage', anim: 'run_panic' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'off-right', style: 'linear' },
        { action: 'react', effect: 'splash', position: 'center' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.5 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⛄ SNOWMAN INVASION!',
      message: 'Ice + multiply = snowmen EVERYWHERE! The mage couldn\'t escape!',
      skillTaught: 'Consequence',
      tip: 'Multiplying cold things fills the room fast — ice + multiply = avalanche!',
    },
  },

  // ── ice + calm_down: Frozen Silence ──
  {
    id: 'mk_ice_calm', description: 'Everything freezes into peaceful silence, cat sleeps, penguin waddles through',
    trigger: { spell: 'ice_spell', appliance: '*', result: 'calm_down' },
    tier: 'subtle', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'screen_flash', color: 'lightblue', duration: 0.5 },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'spawn_character', character: 'cat', position: 'cs-left' },
        { action: 'animate', character: 'cat', anim: 'lie_idle' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'penguin', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'penguin', to: 'cs-right', style: 'linear' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'idle' },
        { action: 'react', effect: 'bubbles', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '❄️ FROZEN ZEN!',
      message: 'Ice + calm = a perfectly peaceful frozen wonderland. Even the cat approves.',
      skillTaught: 'Tone',
      tip: 'Ice + calm creates serenity! Matching spell mood to result mood = magic!',
    },
  },

  // ── ice + go_wild: Frost Golem Awakens ──
  {
    id: 'mk_ice_wild', description: 'Frost golem crashes in, chases mage, but penguin befriends it',
    trigger: { spell: 'ice_spell', appliance: '*', result: 'go_wild' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'frost_golem', position: 'off-left', anim: 'spawn_ground' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'frost_golem', to: 'cs-left', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'move', character: 'mage', to: 'ds-right', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'penguin', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'penguin', to: 'cs-right', style: 'linear' },
        { action: 'animate', character: 'penguin', anim: 'wave' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'penguin', anim: 'celebrate' },
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'emote', character: 'frost_golem', emoji: '❤️' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🧊 GOLEM FRIEND!',
      message: 'Ice + wild = a frost golem appeared! But the penguin made friends with it.',
      skillTaught: 'Consequence',
      tip: 'Wild ice magic brings unexpected creatures — not all chaos is bad!',
    },
  },
];


// ─── GROW SPELL VIGNETTES ────────────────────────────────────────────────────

const GROW_VIGNETTES: Vignette[] = [
  // ── grow + cook_perfectly: Feast for a Barbarian ──
  {
    id: 'mk_grow_cook', description: 'Mage grows food into giant feast, barbarian enters drooling with hearts',
    trigger: { spell: 'grow_spell', appliance: '*', result: 'cook_perfectly' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'grow', target: 'burger', scale: 3 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'ds-right', style: 'bounce' },
        { action: 'react', effect: 'hearts-float', position: 'ds-right' },
        { action: 'emote', character: 'barbarian', emoji: '🤤' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'jump_big' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍔 MEGA FEAST!',
      message: 'Grow + cook = giant delicious food! The barbarian is in heaven!',
      skillTaught: 'Specificity',
      tip: 'Growing food to cook it perfectly = a feast fit for a barbarian!',
    },
  },

  // ── grow + explode: Apple Bomb ──
  {
    id: 'mk_grow_explode', description: 'Apple grows bigger and bigger until it pops, fruit rains everywhere',
    trigger: { spell: 'grow_spell', appliance: '*', result: 'explode' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'apple', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'grow', target: 'apple', scale: 2 },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'grow', target: 'apple', scale: 4 },
        { action: 'camera_shake', intensity: 0.3, duration: 0.5 },
        { action: 'emote', character: 'mage', emoji: '😰' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'shrink_pop', target: 'apple' },
        { action: 'screen_flash', color: 'red', duration: 0.2 },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn_rain', asset: 'apple', quantity: 8, position: 'wide' },
        { action: 'spawn_character', character: 'cat', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'off-left', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'dodge_back' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍎 APPLE BOMB!',
      message: 'Growing things that explode = fruit grenade! The cat barely escaped!',
      skillTaught: 'Consequence',
      tip: 'Things can only grow so big before they pop — grow + explode = boom!',
    },
  },

  // ── grow + dance: Giant Carrot Chase ──
  {
    id: 'mk_grow_dance', description: 'Giant carrot appears, chicken goes berserk chasing it around the stage',
    trigger: { spell: 'grow_spell', appliance: '*', result: 'dance' },
    tier: 'moderate', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'carrot', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'grow', target: 'carrot', scale: 3 },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'chicken', position: 'off-right' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'chicken', to: 'cs-center', style: 'bounce' },
        { action: 'emote', character: 'chicken', emoji: '😍' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'chicken', to: 'cs-left', style: 'bounce' },
        { action: 'move', character: 'chicken', to: 'cs-right', style: 'bounce' },
        { action: 'animate', character: 'mage', anim: 'dodge_back' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'laugh-tears', position: 'center' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
        { action: 'text_popup', text: '🐔 CARROT FRENZY! 🥕', position: 'top', size: 'large' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🥕 CARROT FRENZY!',
      message: 'A giant carrot drove the chicken absolutely bonkers! Nobody saw that coming!',
      skillTaught: 'Creativity',
      tip: 'Growing food near animals creates hilarious chase scenes!',
    },
  },

  // ── grow + multiply: Pot Overflow ──
  {
    id: 'mk_grow_multiply', description: 'Pots keep duplicating and growing, kitchen overflows',
    trigger: { spell: 'grow_spell', appliance: '*', result: 'multiply' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'grow', target: 'pot', scale: 2 },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'pot', position: 'cs-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'ds-center' },
        { action: 'spawn', asset: 'pot', position: 'us-center' },
        { action: 'spawn', asset: 'pot', position: 'ds-right' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'move', character: 'mage', to: 'off-left', style: 'linear' },
        { action: 'react', effect: 'steam', position: 'center' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍳 POT INVASION!',
      message: 'Grow + multiply = pots breeding like rabbits! The kitchen is overwhelmed!',
      skillTaught: 'Consequence',
      tip: 'Growing AND multiplying at the same time = exponential chaos!',
    },
  },

  // ── grow + calm_down: Indoor Zen Garden ──
  {
    id: 'mk_grow_calm', description: 'Tree grows inside kitchen creating a zen garden, deer wanders in',
    trigger: { spell: 'grow_spell', appliance: '*', result: 'calm_down' },
    tier: 'subtle', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'tree', position: 'cs-center' },
        { action: 'grow', target: 'tree', scale: 2 },
        { action: 'spawn', asset: 'bush', position: 'cs-left' },
        { action: 'spawn', asset: 'bush', position: 'cs-right' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'deer', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'deer', to: 'cs-right', style: 'linear' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'sit_floor' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'react', effect: 'bubbles', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '🌳 KITCHEN GARDEN!',
      message: 'Grow + calm = a beautiful garden right in the kitchen! The deer approves.',
      skillTaught: 'Tone',
      tip: 'Growing things calmly creates nature — not every grow spell is aggressive!',
    },
  },

  // ── grow + go_wild: Kitchen Safari ──
  {
    id: 'mk_grow_wild', description: 'Kitchen becomes a jungle with bushes and trees, tiger appears causing panic',
    trigger: { spell: 'grow_spell', appliance: '*', result: 'go_wild' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'tree', position: 'cs-center' },
        { action: 'spawn', asset: 'bush', position: 'cs-left' },
        { action: 'spawn', asset: 'bush', position: 'cs-right' },
        { action: 'spawn', asset: 'bush', position: 'ds-right' },
        { action: 'grow', target: 'tree', scale: 3 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'tiger', position: 'off-left' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'tiger', to: 'cs-center', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'move', character: 'mage', to: 'off-right', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'chicken', position: 'off-right' },
        { action: 'move', character: 'chicken', to: 'off-left', style: 'linear' },
        { action: 'react', effect: 'dust', position: 'center' },
        { action: 'camera_shake', intensity: 0.6, duration: 0.8 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🐯 KITCHEN SAFARI!',
      message: 'Grow + wild = the kitchen became a jungle! Complete with a tiger!',
      skillTaught: 'Consequence',
      tip: 'Growing things wild turns any room into nature — be careful what you grow!',
    },
  },
];

// ─── SHRINK SPELL VIGNETTES ──────────────────────────────────────────────────

const SHRINK_VIGNETTES: Vignette[] = [
  // ── shrink + cook_perfectly: Dollhouse Kitchen ──
  {
    id: 'mk_shrink_cook', description: 'Kitchen shrinks to dollhouse size, giant cat peers in from outside',
    trigger: { spell: 'shrink_spell', appliance: '*', result: 'cook_perfectly' },
    tier: 'moderate', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'screen_flash', color: 'purple', duration: 0.3 },
        { action: 'shrink_pop', target: 'stove' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center', scale: 0.3 },
        { action: 'spawn_character', character: 'cat', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'ds-right', style: 'linear' },
        { action: 'grow', target: 'cat', scale: 2.5 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'emote', character: 'cat', emoji: '👀' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'question-marks', position: 'ds-right' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🏠 DOLLHOUSE KITCHEN!',
      message: 'Shrink + cook = tiny kitchen! The cat thinks it\'s a toy!',
      skillTaught: 'Specificity',
      tip: 'Shrinking to cook means the food is also tiny — who\'s going to eat it?',
    },
  },

  // ── shrink + explode: Spring Launch ──
  {
    id: 'mk_shrink_explode', description: 'Compressed pot builds pressure and launches mage across the stage',
    trigger: { spell: 'shrink_spell', appliance: '*', result: 'explode' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'shrink_pop', target: 'pot' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
        { action: 'react', effect: 'steam', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'screen_flash', color: 'white', duration: 0.2 },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'move', character: 'mage', to: 'off-right', style: 'arc' },
        { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'off-left' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'ds-center', style: 'linear' },
        { action: 'animate', character: 'clown', anim: 'celebrate' },
        { action: 'react', effect: 'stars-spin', position: 'off-right' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎪 SPRING LAUNCH!',
      message: 'Shrink + explode = compressed pressure sent the mage flying! The clown loved it!',
      skillTaught: 'Consequence',
      tip: 'Shrinking things that explode compresses the force — bigger launch!',
    },
  },

  // ── shrink + dance: Godzilla Chicken ──
  {
    id: 'mk_shrink_dance', description: 'Everyone shrinks except the chicken, who struts through like Godzilla',
    trigger: { spell: 'shrink_spell', appliance: '*', result: 'dance' },
    tier: 'moderate', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'robot', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'screen_flash', color: 'purple', duration: 0.3 },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'chicken', position: 'off-left' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'chicken', to: 'cs-center', style: 'linear' },
        { action: 'grow', target: 'chicken', scale: 2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'dodge_back' },
        { action: 'animate', character: 'robot', anim: 'dodge_back' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'chicken', to: 'off-right', style: 'linear' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🐔 GODZILLA CHICKEN!',
      message: 'Shrink + dance = everyone shrank except the chicken! It strutted through like a kaiju!',
      skillTaught: 'Creativity',
      tip: 'Shrinking some things makes OTHER things seem giant by comparison!',
    },
  },

  // ── shrink + multiply: Ant-Sized Feast ──
  {
    id: 'mk_shrink_multiply', description: 'Tiny foods scatter everywhere like ants, cat goes crazy trying to catch them',
    trigger: { spell: 'shrink_spell', appliance: '*', result: 'multiply' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'shrink_pop', target: 'burger' },
        { action: 'spawn', asset: 'sushi', position: 'cs-left' },
        { action: 'spawn', asset: 'donut_food', position: 'cs-right' },
        { action: 'spawn', asset: 'banana', position: 'ds-center' },
        { action: 'spawn', asset: 'apple', position: 'ds-right' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'cat', position: 'off-right' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'cs-left', style: 'bounce' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'ds-right', style: 'bounce' },
        { action: 'spawn', asset: 'tomato', position: 'us-center' },
        { action: 'spawn', asset: 'carrot', position: 'us-left' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'cs-center', style: 'bounce' },
        { action: 'react', effect: 'dust', position: 'center' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
        { action: 'animate', character: 'mage', anim: 'celebrate' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🐜 ANT BUFFET!',
      message: 'Shrink + multiply = tiny food everywhere! The cat couldn\'t catch a single one!',
      skillTaught: 'Consequence',
      tip: 'Shrinking + multiplying creates swarms of tiny things — chaos!',
    },
  },

  // ── shrink + calm_down: Quiet Tiny World ──
  {
    id: 'mk_shrink_calm', description: 'Everything shrinks into a peaceful miniature world, penguin waddles through confused',
    trigger: { spell: 'shrink_spell', appliance: '*', result: 'calm_down' },
    tier: 'subtle', promptScore: 'partial',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'screen_flash', color: 'lavender', duration: 0.4 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'react', effect: 'bubbles', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'penguin', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'penguin', to: 'ds-right', style: 'linear' },
        { action: 'emote', character: 'penguin', emoji: '🤔' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'bubbles', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '🔍 TINY WORLD!',
      message: 'Shrink + calm = a miniature wonderland! The penguin couldn\'t figure out what happened.',
      skillTaught: 'Tone',
      tip: 'Shrinking things calmly makes everything peaceful and small — like a snow globe!',
    },
  },

  // ── shrink + go_wild: Size Roulette ──
  {
    id: 'mk_shrink_wild', description: 'Random things keep changing size chaotically, nothing stays stable',
    trigger: { spell: 'shrink_spell', appliance: '*', result: 'go_wild' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'dog', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'screen_flash', color: 'purple', duration: 0.2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'grow', target: 'stove', scale: 3 },
        { action: 'camera_shake', intensity: 0.3, duration: 0.3 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'shrink_pop', target: 'stove' },
        { action: 'grow', target: 'dog', scale: 2 },
        { action: 'react', effect: 'sparkle-magic', position: 'ds-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'shrink_pop', target: 'dog' },
        { action: 'grow', target: 'mage', scale: 2 },
        { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'shrink_pop', target: 'mage' },
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        { action: 'react', effect: 'question-marks', position: 'ds-left' },
        { action: 'camera_shake', intensity: 0.7, duration: 0.8 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎰 SIZE ROULETTE!',
      message: 'Shrink + wild = nothing stays the same size! Total dimensional chaos!',
      skillTaught: 'Consequence',
      tip: 'Wild shrinking means no control — things keep growing and shrinking randomly!',
    },
  },
];
// ─── LEVITATE SPELL VIGNETTES ────────────────────────────────────────────────

const LEVITATE_VIGNETTES: Vignette[] = [
  // ── levitate + cook_perfectly: Zero-G Kitchen ──
  {
    id: 'mk_lev_cook', description: 'Ingredients float in zero gravity, space_ranger helps assemble a mid-air meal',
    trigger: { spell: 'levitate', appliance: '*', result: 'cook_perfectly' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'burger', position: 'cs-left' },
        { action: 'spawn', asset: 'carrot', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'magic_circle', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', asset: 'burger', to: 'top', style: 'float' },
        { action: 'move', asset: 'carrot', to: 'top', style: 'float' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'space_ranger', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'space_ranger', to: 'ds-right', style: 'linear' },
        { action: 'animate', character: 'space_ranger', anim: 'wave' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'space_ranger', anim: 'interact' },
        { action: 'spawn', asset: 'plate', position: MARK.CS_CENTER },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'space_ranger', anim: 'wave' },
        { action: 'animate', character: 'mage', anim: 'Cheering' },
        { action: 'react', effect: 'stars-spin', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🚀 SPACE COOKING!',
      message: 'Levitate + cook = zero-G kitchen! The space ranger knew exactly what to do!',
      skillTaught: 'Specificity',
      tip: 'Floating ingredients + the right helper = perfect space cuisine!',
    },
  },

  // ── levitate + explode: Mid-Air Chain Collision ──
  {
    id: 'mk_lev_explode', description: 'Floating pots collide mid-air causing chain explosions, cat gets launched',
    trigger: { spell: 'levitate', appliance: '*', result: 'explode' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'pan', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'move', asset: 'pot', to: 'top', style: 'float' },
        { action: 'move', asset: 'pan', to: 'top', style: 'float' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'top' },
        { action: 'camera_shake', intensity: 0.7, duration: 0.5 },
        { action: 'screen_flash', color: 'yellow', duration: 0.2 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_rain', asset: 'pot', quantity: 4, position: 'wide' },
        { action: 'spawn_character', character: 'cat', position: 'cs-center' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'off-top', style: 'arc' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'dodge_back' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
        { action: 'react', effect: 'dust', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 AIR CRASH!',
      message: 'Levitate + explode = floating things crash into each other mid-air! The cat went orbital!',
      skillTaught: 'Consequence',
      tip: 'Floating things with no control eventually collide — physics still works!',
    },
  },

  // ── levitate + dance: Floating Pets ──
  {
    id: 'mk_lev_dance', description: 'Cat and dog float helplessly paddling in mid-air while mage laughs',
    trigger: { spell: 'levitate', appliance: '*', result: 'dance' },
    tier: 'moderate', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'cat', position: 'cs-left' },
        { action: 'spawn_character', character: 'dog', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'magic_circle', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'top', style: 'float' },
        { action: 'move', character: 'dog', to: 'top', style: 'float' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'emote', character: 'cat', emoji: '😾' },
        { action: 'emote', character: 'dog', emoji: '😰' },
        { action: 'react', effect: 'question-marks', position: 'top' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'celebrate' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'top', style: 'float' },
        { action: 'emote', character: 'mage', emoji: '😱' },
        { action: 'react', effect: 'bubbles', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎈 FLOATING ZOO!',
      message: 'Levitate + dance = everyone floating! The pets are NOT enjoying this dance!',
      skillTaught: 'Creativity',
      tip: 'Floating animals try to swim through the air — hilarious but not a real dance!',
    },
  },

  // ── levitate + multiply: Pot Tornado ──
  {
    id: 'mk_lev_multiply', description: 'Ring of floating pots surrounds mage, spinning like a tornado',
    trigger: { spell: 'levitate', appliance: '*', result: 'multiply' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'move', asset: 'pot', to: 'top', style: 'float' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'pot', position: 'cs-right' },
        { action: 'move', asset: 'pot', to: 'cs-left', style: 'float' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'us-center' },
        { action: 'spawn', asset: 'pot', position: 'ds-left' },
        { action: 'spawn', asset: 'pot', position: 'ds-right' },
        { action: 'react', effect: 'dust', position: 'center' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'crouch' },
        { action: 'emote', character: 'mage', emoji: '😰' },
        { action: 'react', effect: 'steam', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌪️ POT TORNADO!',
      message: 'Levitate + multiply = a whirlwind of floating pots! The mage is trapped!',
      skillTaught: 'Consequence',
      tip: 'Multiplying floating things creates a vortex — too many things in the air!',
    },
  },

  // ── levitate + calm_down: Floating Nap ──
  {
    id: 'mk_lev_calm', description: 'Everyone floats up peacefully, cat sleeps mid-air, ninja meditates',
    trigger: { spell: 'levitate', appliance: '*', result: 'calm_down' },
    tier: 'subtle', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'magic_circle', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'cat', position: 'cs-left' },
        { action: 'animate', character: 'cat', anim: 'lie_idle' },
        { action: 'spawn_character', character: 'ninja', position: 'cs-right' },
        { action: 'animate', character: 'ninja', anim: 'sit_floor' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'cat', to: 'top', style: 'float' },
        { action: 'move', character: 'ninja', to: 'top', style: 'float' },
        { action: 'move', character: 'mage', to: 'top', style: 'float' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'bubbles', position: 'center' },
        { action: 'react', effect: 'sparkle-magic', position: 'top' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '☁️ CLOUD NAP!',
      message: 'Levitate + calm = floating zen! Everyone drifts peacefully through the air.',
      skillTaught: 'Tone',
      tip: 'Calm levitation is like floating on a cloud — peaceful and dreamy!',
    },
  },

  // ── levitate + go_wild: Anti-Gravity Chaos ──
  {
    id: 'mk_lev_wild', description: 'Knight enters and immediately levitates, tiger floats, total anti-gravity chaos',
    trigger: { spell: 'levitate', appliance: '*', result: 'go_wild' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'magic_circle', position: 'center' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'off-right' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'knight', to: 'off-top', style: 'arc' },
        { action: 'emote', character: 'knight', emoji: '😱' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'tiger', position: 'off-left' },
        { action: 'move', character: 'tiger', to: 'off-top', style: 'float' },
        { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_rain', asset: 'pot', quantity: 5, position: 'wide' },
        { action: 'move', character: 'mage', to: 'off-top', style: 'float' },
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        { action: 'camera_shake', intensity: 0.8, duration: 0.8 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌌 ZERO GRAVITY!',
      message: 'Levitate + wild = NOTHING stays on the ground! Even the tiger went flying!',
      skillTaught: 'Consequence',
      tip: 'Wild levitation means no control over what goes up — everything floats!',
    },
  },
];

// ─── TRANSFORM SPELL VIGNETTES ───────────────────────────────────────────────

const TRANSFORM_VIGNETTES: Vignette[] = [
  // ── transform + cook_perfectly: Molecular Gastronomy ──
  {
    id: 'mk_trans_cook', description: 'Raw ingredients transform one by one into gourmet dishes, ranger celebrates',
    trigger: { spell: 'transform', appliance: '*', result: 'cook_perfectly' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'carrot', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'shrink_pop', target: 'carrot' },
        { action: 'spawn', asset: 'sushi', position: 'cs-center' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'shrink_pop', target: 'sushi' },
        { action: 'spawn', asset: 'cake', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'screen_flash', color: 'gold', duration: 0.2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'ranger', to: MARK.DS_RIGHT, style: 'linear' },
        { action: 'animate', character: 'ranger', anim: 'Cheering' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍱 MOLECULAR MAGIC!',
      message: 'Transform + cook = raw ingredients became gourmet dishes! Instant fine dining!',
      skillTaught: 'Specificity',
      tip: 'Transform + cook perfectly = magical molecular gastronomy!',
    },
  },

  // ── transform + explode: Appliance Rebellion ──
  {
    id: 'mk_trans_explode', description: 'Stove transforms into a rocket and launches through the roof',
    trigger: { spell: 'transform', appliance: '*', result: 'explode' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'shrink_pop', target: 'stove' },
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'screen_flash', color: 'orange', duration: 0.2 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', asset: 'barrel', to: 'off-top', style: 'arc' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'top' },
        { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
        { action: 'animate', character: 'mage', anim: 'die_flop' },
        { action: 'spawn_rain', asset: 'pot', quantity: 4, position: 'wide' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🚀 STOVE ROCKET!',
      message: 'Transform + explode = the stove became a rocket and blasted off! Kitchen destroyed!',
      skillTaught: 'Consequence',
      tip: 'Transforming things that explode turns them into projectiles — watch out!',
    },
  },

  // ── transform + dance: Beauty and the Beast Kitchen ──
  {
    id: 'mk_trans_dance', description: 'Kitchen items transform into living characters that dance together',
    trigger: { spell: 'transform', appliance: '*', result: 'dance' },
    tier: 'moderate', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-center', anim: 'spawn_air' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'pan', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-left' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-right' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'shrink_pop', target: 'pot' },
        { action: 'shrink_pop', target: 'pan' },
        { action: 'spawn_character', character: 'clown', position: 'cs-left', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'ninja', position: 'cs-right', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'walk_goofy' },
        { action: 'animate', character: 'ninja', anim: 'walk_goofy' },
        { action: 'move', character: 'clown', to: 'ds-right', style: 'bounce' },
        { action: 'move', character: 'ninja', to: 'ds-left', style: 'bounce' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'react', effect: 'glow-pulse', position: MARK.DS_CENTER },
        { action: 'text_popup', text: '🎭 BE OUR GUEST! 🎭', position: 'top', size: 'large' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎭 KITCHEN MUSICAL!',
      message: 'Transform + dance = kitchen items came alive and started dancing! Be our guest!',
      skillTaught: 'Creativity',
      tip: 'Transform + dance brings inanimate objects to life — pure Disney magic!',
    },
  },

  // ── transform + multiply: Shapeshifting Chain ──
  {
    id: 'mk_trans_multiply', description: 'Food keeps transforming into different food endlessly, can\'t catch one',
    trigger: { spell: 'transform', appliance: '*', result: 'multiply' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'apple', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'shrink_pop', target: 'apple' },
        { action: 'spawn', asset: 'banana', position: 'cs-center' },
        { action: 'spawn', asset: 'apple', position: 'cs-left' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'shrink_pop', target: 'banana' },
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn', asset: 'banana', position: 'cs-right' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'shrink_pop', target: 'burger' },
        { action: 'spawn', asset: 'cupcake', position: 'cs-center' },
        { action: 'spawn', asset: 'sushi', position: 'ds-center' },
        { action: 'spawn', asset: 'donut_food', position: 'us-center' },
        { action: 'animate', character: 'mage', anim: 'interact' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'shrink_pop', target: 'cupcake' },
        { action: 'react', effect: 'question-marks', position: 'ds-left' },
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔄 SHAPE SWAP!',
      message: 'Transform + multiply = everything keeps changing! The mage can\'t grab anything!',
      skillTaught: 'Consequence',
      tip: 'Transforming + multiplying = nothing stays the same long enough to catch!',
    },
  },

  // ── transform + calm_down: Kitchen to Park ──
  {
    id: 'mk_trans_calm', description: 'Kitchen transforms into a peaceful park with bench, trees, and a deer',
    trigger: { spell: 'transform', appliance: '*', result: 'calm_down' },
    tier: 'subtle', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'fridge', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'screen_flash', color: 'green', duration: 0.3 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'shrink_pop', target: 'stove' },
        { action: 'shrink_pop', target: 'fridge' },
        { action: 'spawn', asset: 'bench', position: 'cs-center' },
        { action: 'spawn', asset: 'tree', position: 'us-center' },
        { action: 'spawn', asset: 'bush', position: 'cs-left' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'deer', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'deer', to: 'cs-right', style: 'linear' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'sit_floor' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '🌿 KITCHEN PARK!',
      message: 'Transform + calm = the kitchen became a beautiful park! Even a deer moved in!',
      skillTaught: 'Tone',
      tip: 'Transform + calm turns anything into nature — the ultimate renovation spell!',
    },
  },

  // ── transform + go_wild: Animal Swap Chain ──
  {
    id: 'mk_trans_wild', description: 'Animals keep transforming into each other — cat to chicken to dog to tiger',
    trigger: { spell: 'transform', appliance: '*', result: 'go_wild' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'cat', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'shrink_pop', target: 'cat' },
        { action: 'spawn_character', character: 'chicken', position: 'cs-center', anim: 'spawn_air' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'shrink_pop', target: 'chicken' },
        { action: 'spawn_character', character: 'dog', position: 'cs-center', anim: 'spawn_air' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.3, duration: 0.3 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'shrink_pop', target: 'dog' },
        { action: 'spawn_character', character: 'tiger', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'screen_flash', color: 'orange', duration: 0.2 },
        { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'move', character: 'mage', to: 'off-left', style: 'linear' },
        { action: 'move', character: 'tiger', to: 'ds-left', style: 'linear' },
        { action: 'react', effect: 'dust', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔀 ANIMAL SWAP!',
      message: 'Transform + wild = animals keep shapeshifting! Cat → chicken → dog → TIGER!',
      skillTaught: 'Consequence',
      tip: 'Wild transform makes things keep changing — and each change gets MORE wild!',
    },
  },
];

// ─── EXPORTS ────────────────────────────────────────────────────────────────

const PAIR_VIGNETTES: Vignette[] = [
  ...FIRE_VIGNETTES,
  ...ICE_VIGNETTES,
  ...GROW_VIGNETTES,
  ...SHRINK_VIGNETTES,
  ...LEVITATE_VIGNETTES,
  ...TRANSFORM_VIGNETTES,
];

export const MAGE_KITCHEN_STAGE_1: Vignette[] = [
  ...PAIR_VIGNETTES,
];

export const MAGE_KITCHEN_DEFAULT: Vignette = {
  id: 'mage_kitchen_default',
  description: 'A mage casts a generic spell in the kitchen with some sparkles.',
  trigger: { spell: '*', appliance: '*', result: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'react', effect: 'question-marks', position: 'ds-left' },
      ],
      delayAfter: 1.0,
    },
    {
      parallel: [
        { action: 'animate', character: 'mage', anim: 'idle_alt' },
        { action: 'emote', character: 'mage', emoji: '🤔' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '✨ Magic Kitchen!',
    message: "Some magic happened! But WHAT spell? On WHAT appliance? With WHAT result? Fill in all the details!",
    skillTaught: 'Specificity',
    tip: "Pick a spell, an appliance, and a result. Each detail makes the magic more specific!",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 2 — PRECISION SPELLCASTING (Intensity + Quantity modifiers)
// ═══════════════════════════════════════════════════════════════════════════════

// Intensity modifiers scale the reaction: tiny → subtle, medium → moderate, mega → spectacular, unstable → chaos
// Quantity modifiers scale how many props spawn

const STAGE2_TINY_VIGNETTES: Vignette[] = [
  // ── tiny + fire_spell + cook_perfectly: Tiny Ember Cook ──
  {
    id: 'mk2_tiny_fire_cook', description: 'Tiny spark barely lights the stove, one small perfectly cooked egg',
    trigger: { intensity: 'tiny', spell: 'fire_spell', appliance: '*', result: 'cook_perfectly', quantity: '*' },
    tier: 'subtle', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: 'cs-center', scale: 0.5 },
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'celebrate' },
        { action: 'emote', character: 'mage', emoji: '😊' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '✨ Gentle Cook!',
      message: 'A tiny spark cooked one perfect little egg. Precise and gentle!',
      skillTaught: 'Specificity',
      tip: 'Power level matters! A tiny spell gives tiny results. Try MEGA for a feast!',
      vagueComparison: {
        vagueInput: 'Cast a spell on the stove',
        vagueResult: 'The mage waves vaguely... the stove just hums.',
      },
    },
  },
  // ── tiny + ice_spell + calm_down: Gentle Snowflake ──
  {
    id: 'mk2_tiny_ice_calm', description: 'Gentle snowflake calms a rattling appliance with a whisper of frost',
    trigger: { intensity: 'tiny', spell: 'ice_spell', appliance: '*', result: 'calm_down', quantity: '*' },
    tier: 'subtle', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'fridge', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'snowflakes', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'emote', character: 'mage', emoji: '😌' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '❄️ Gentle Frost!',
      message: 'Just a whisper of cold — the fridge sighs and settles down. Perfectly gentle!',
      skillTaught: 'Specificity',
      tip: 'A tiny ice spell calms things gently. More power = more chaos!',
      vagueComparison: {
        vagueInput: 'Cast ice on something',
        vagueResult: 'Ice goes... somewhere? The kitchen looks confused.',
      },
    },
  },
  // ── tiny + any spell + explode: Tiny Pop ──
  {
    id: 'mk2_tiny_explode', description: 'Tiny spell tries to explode but only makes a cute pop sound',
    trigger: { intensity: 'tiny', spell: '*', appliance: '*', result: 'explode', quantity: '*' },
    tier: 'subtle', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
        { action: 'text_popup', text: 'pop!', position: 'cs-center', size: 'small' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'idle_alt' },
        { action: 'emote', character: 'mage', emoji: '😅' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💨 Tiny Pop!',
      message: 'A tiny explosion? More like a hiccup. Need MORE POWER for real explosions!',
      skillTaught: 'Specificity',
      tip: 'Tiny + Explode = just a pop. Try "MEGA" for a real BOOM!',
      vagueComparison: {
        vagueInput: 'Make it explode',
        vagueResult: 'Explode what? How big? The mage shrugs.',
      },
    },
  },
  // ── tiny + any + dance: Tiny Jig ──
  {
    id: 'mk2_tiny_dance', description: 'Tiny spell makes one spoon do a little jig on the counter',
    trigger: { intensity: 'tiny', spell: '*', appliance: '*', result: 'dance', quantity: '*' },
    tier: 'subtle', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
        { action: 'text_popup', text: 'wiggle~', position: 'cs-center', size: 'small' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'emote', character: 'mage', emoji: '😂' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🥄 Tiny Jig!',
      message: 'A tiny dance spell? One spoon wiggles. That is barely a dance!',
      skillTaught: 'Specificity',
      tip: 'Tiny power = tiny dance. Try MEGA to get the whole kitchen grooving!',
      vagueComparison: {
        vagueInput: 'Make something dance',
        vagueResult: 'Dance? What should dance? Everything just stares at the mage.',
      },
    },
  },
  // ── tiny + any + multiply: Tiny Clone ──
  {
    id: 'mk2_tiny_multiply', description: 'Tiny multiply spell only makes half a copy — a wobbly half-burger',
    trigger: { intensity: 'tiny', spell: '*', appliance: '*', result: 'multiply', quantity: '*' },
    tier: 'subtle', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: 'cs-right', scale: 0.3 },
        { action: 'react', effect: 'smoke', position: 'cs-right' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'mage', emoji: '😅' },
        { action: 'text_popup', text: 'half a copy?', position: 'cs-right', size: 'small' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍔½ Half a Clone!',
      message: 'Tiny multiply = half a copy! It is wobbly and sad-looking.',
      skillTaught: 'Specificity',
      tip: 'Not enough power to copy! Tiny just makes a blurry half-clone. Use MEGA to truly multiply!',
      vagueComparison: {
        vagueInput: 'Copy the food',
        vagueResult: 'Copy how? Copy what? The mage blinks.',
      },
    },
  },
  // ── tiny + any + go_wild: Tiny Fizzle ──
  {
    id: 'mk2_tiny_go_wild', description: 'Tiny wild spell just makes the stove burp — anticlimactic chaos',
    trigger: { intensity: 'tiny', spell: '*', appliance: '*', result: 'go_wild', quantity: '*' },
    tier: 'subtle', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
        { action: 'text_popup', text: '...burp', position: 'cs-center', size: 'small' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'mage', emoji: '😐' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💨 Tiny Wild?',
      message: 'Tiny power going wild... just makes the stove burp. Not very wild!',
      skillTaught: 'Specificity',
      tip: '"Go wild" needs power! Tiny + wild = fizzle. Try MEGA + go wild for REAL chaos!',
      vagueComparison: {
        vagueInput: 'Make it go crazy',
        vagueResult: 'Go crazy how? The mage wiggles a finger. Nothing happens.',
      },
    },
  },
];

const STAGE2_MEGA_VIGNETTES: Vignette[] = [
  // ── mega + fire_spell + cook_perfectly: MEGA BBQ Feast ──
  {
    id: 'mk2_mega_fire_cook', description: 'MEGA fireball creates an epic barbarian BBQ feast with multiple courses',
    trigger: { intensity: 'mega', spell: 'fire_spell', appliance: '*', result: 'cook_perfectly', quantity: '*' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.7 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-right', anim: 'spawn_ground' },
        { action: 'screen_flash', color: 'orange', duration: 0.15 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'ds-right', style: 'linear' },
        { action: 'spawn', asset: 'burger', position: 'cs-left', scale: 1.5 },
        { action: 'spawn', asset: 'burger', position: 'cs-center', scale: 1.5 },
        { action: 'spawn', asset: 'burger', position: 'cs-right', scale: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'jump_big' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔥 MEGA BBQ FEAST!',
      message: 'MEGA fire + cook perfectly = a three-course barbarian feast! The power level made ALL the difference!',
      skillTaught: 'Specificity',
      tip: 'Power level changed everything! "MEGA fireball to cook" is way more specific than just "cast fire."',
      vagueComparison: {
        vagueInput: 'Cast a fire spell',
        vagueResult: 'Fire flickers for a moment... and goes out. Nothing cooked.',
      },
    },
  },
  // ── mega + any spell + explode: MEGA Explosion ──
  {
    id: 'mk2_mega_explode', description: 'MEGA spell causes massive kitchen explosion with food rain',
    trigger: { intensity: 'mega', spell: '*', appliance: '*', result: 'explode', quantity: '*' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.8, duration: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'screen_flash', color: 'orange', duration: 0.3 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn_rain', asset: 'burger', quantity: 12, position: 'wide' },
        { action: 'camera_shake', intensity: 1.0, duration: 0.5 },
        { action: 'react', effect: 'smoke', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
        { action: 'text_popup', text: 'KABOOM!', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 MEGA KABOOM!',
      message: 'MEGA power + explode = total kitchen destruction! Food is literally raining!',
      skillTaught: 'Specificity',
      tip: 'MEGA + Explode is maximum chaos. Compare with tiny — power level changes EVERYTHING!',
      vagueComparison: {
        vagueInput: 'Make something explode',
        vagueResult: 'Explode what? How much? The mage looks around nervously.',
      },
    },
  },
  // ── mega + grow_spell + multiply: MEGA Growth Army ──
  {
    id: 'mk2_mega_grow_multiply', description: 'MEGA grow spell creates giant multiplying appliances that fill the kitchen',
    trigger: { intensity: 'mega', spell: 'grow_spell', appliance: '*', result: 'multiply', quantity: '*' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.4, duration: 1.0 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'grow', asset: 'pot', scale: 3 },
        { action: 'spawn', asset: 'pot', position: 'cs-left', scale: 2 },
        { action: 'spawn', asset: 'pot', position: 'cs-right', scale: 2 },
        { action: 'spawn', asset: 'pot', position: 'ds-right', scale: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'question-marks', position: 'ds-left' },
        { action: 'text_popup', text: 'TOO MANY!', position: 'center', size: 'large' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '📈 GIANT POT ARMY!',
      message: 'MEGA grow + multiply = giant pots EVERYWHERE! The kitchen is full!',
      skillTaught: 'Specificity',
      tip: 'MEGA power amplifies everything. A tiny grow spell would be much more controlled!',
      vagueComparison: {
        vagueInput: 'Make it grow',
        vagueResult: 'Grow what? By how much? Nothing changes.',
      },
    },
  },
  // ── mega + any + dance: MEGA DANCE PARTY ──
  {
    id: 'mk2_mega_dance', description: 'MEGA dance spell makes every appliance in the kitchen breakdance',
    trigger: { intensity: 'mega', spell: '*', appliance: '*', result: 'dance', quantity: '*' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'fridge', position: 'cs-right' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-center', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'wide' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_LEFT },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_RIGHT },
        { action: 'camera_shake', intensity: 0.3, duration: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'spin_attack' },
        { action: 'react', effect: 'hearts-float', position: 'wide' },
        { action: 'text_popup', text: 'DANCE PARTY!', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💃 MEGA DANCE PARTY!',
      message: 'MEGA power + dance = the WHOLE KITCHEN is breakdancing! Appliances have moves!',
      skillTaught: 'Specificity',
      tip: 'MEGA power makes EVERYTHING dance. Tiny would barely get a wiggle!',
      vagueComparison: {
        vagueInput: 'Make stuff dance',
        vagueResult: 'What stuff? What kind of dance? One pot awkwardly sways.',
      },
    },
  },
  // ── mega + any + calm_down: MEGA FREEZE ──
  {
    id: 'mk2_mega_calm', description: 'MEGA calm spell over-calms everything into frozen solid ice blocks',
    trigger: { intensity: 'mega', spell: '*', appliance: '*', result: 'calm_down', quantity: '*' },
    tier: 'spectacular', promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'snowflakes', position: 'wide' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'snowflakes', position: 'cs-center' },
        { action: 'react', effect: 'snowflakes', position: 'cs-left' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center', color: 'blue' },
        { action: 'camera_shake', intensity: 0.2, duration: 1.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'text_popup', text: 'TOO CALM!', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🧊 MEGA FREEZE!',
      message: 'MEGA calm = everything frozen SOLID! Too calm! The mage is stuck to the floor!',
      skillTaught: 'Specificity',
      tip: 'MEGA + calm = over-calmed into ice! "Tiny" calm would be perfect and gentle.',
      vagueComparison: {
        vagueInput: 'Calm it down',
        vagueResult: 'Calm WHAT down? By how much? The mage pats one pot.',
      },
    },
  },
  // ── mega + any + go_wild: MEGA WILD ──
  {
    id: 'mk2_mega_go_wild', description: 'MEGA wild spell unleashes total kitchen apocalypse — food flying everywhere',
    trigger: { intensity: 'mega', spell: '*', appliance: '*', result: 'go_wild', quantity: '*' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'fridge', position: 'cs-right' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-center', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'wide' },
        { action: 'camera_shake', intensity: 0.5, duration: 2.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_rain', asset: 'burger', quantity: 8, position: 'wide' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'react', effect: 'fire', position: 'cs-left' },
        { action: 'react', effect: 'fire', position: 'cs-right' },
        { action: 'screen_flash', color: 'orange', duration: 0.2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-center' },
        { action: 'text_popup', text: 'TOTAL CHAOS!', position: 'center', size: 'huge' },
        { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌋 MEGA WILD!',
      message: 'MEGA + GO WILD = KITCHEN APOCALYPSE! Food everywhere, fire everywhere, chaos everywhere!',
      skillTaught: 'Specificity',
      tip: 'Maximum power + maximum chaos = maximum destruction! Try "tiny calm" for the opposite!',
      vagueComparison: {
        vagueInput: 'Go wild',
        vagueResult: 'Wild how? The mage spins once. Meh.',
      },
    },
  },
];

const STAGE2_MEDIUM_VIGNETTES: Vignette[] = [
  // ── medium + fire_spell + cook_perfectly: Solid Cook ──
  {
    id: 'mk2_med_fire_cook', description: 'Medium fireball cooks a decent meal with proper heat control',
    trigger: { intensity: 'medium', spell: 'fire_spell', appliance: '*', result: 'cook_perfectly', quantity: '*' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.7 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: MARK.CS_CENTER },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔥 Nice Cook!',
      message: 'Medium heat, one perfect meal. Solid and dependable!',
      skillTaught: 'Specificity',
      tip: 'Medium gives good results. But MEGA would make a feast, and tiny just an egg!',
      vagueComparison: {
        vagueInput: 'Use fire on it',
        vagueResult: 'Fire on... what? How much fire? Nothing specific happens.',
      },
    },
  },
  // ── medium + ice_spell + calm_down: Steady Freeze ──
  {
    id: 'mk2_med_ice_calm', description: 'Medium ice blast steadily cools down an appliance',
    trigger: { intensity: 'medium', spell: 'ice_spell', appliance: '*', result: 'calm_down', quantity: '*' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'snowflakes', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.7 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'celebrate' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '❄️ Steady Chill!',
      message: 'Medium ice calms things nicely. Not too little, not too much!',
      skillTaught: 'Specificity',
      tip: 'Medium is the balanced choice. Tiny whispers, MEGA freezes everything solid!',
      vagueComparison: {
        vagueInput: 'Cast a spell',
        vagueResult: 'Cast WHAT spell? On WHAT? The mage stands there confused.',
      },
    },
  },
  // ── medium + any + explode: Medium Boom ──
  {
    id: 'mk2_med_explode', description: 'Medium explosion pops one pot lid off with a satisfying bang',
    trigger: { intensity: 'medium', spell: '*', appliance: '*', result: 'explode', quantity: '*' },
    tier: 'moderate', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.3, duration: 0.5 },
        { action: 'sfx', sound: 'impact' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'jump_small' },
        { action: 'emote', character: 'mage', emoji: '😲' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 Medium Boom!',
      message: 'A solid explosion — the pot lid flew off! Not too big, not too small.',
      skillTaught: 'Specificity',
      tip: 'Medium explosions are manageable. MEGA would blow up the whole kitchen!',
      vagueComparison: {
        vagueInput: 'Blow it up',
        vagueResult: 'Blow WHAT up? The mage looks around nervously.',
      },
    },
  },
  // ── medium + any + dance: Medium Groove ──
  {
    id: 'mk2_med_dance', description: 'Medium dance spell gets a few items swaying to an imaginary beat',
    trigger: { intensity: 'medium', spell: '*', appliance: '*', result: 'dance', quantity: '*' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn', asset: 'stove', position: 'cs-right' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'react', effect: 'stars-spin', position: 'cs-right' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎵 Nice Groove!',
      message: 'A few items sway to the beat. A pleasant kitchen dance!',
      skillTaught: 'Specificity',
      tip: 'Medium dance is fun and controlled. MEGA would be a full disco!',
      vagueComparison: {
        vagueInput: 'Do a dance thing',
        vagueResult: 'What kind of dance? The mage does an awkward shuffle.',
      },
    },
  },
  // ── medium + any + multiply: Medium Clone ──
  {
    id: 'mk2_med_multiply', description: 'Medium multiply creates three neat copies of a dish',
    trigger: { intensity: 'medium', spell: '*', appliance: '*', result: 'multiply', quantity: '*' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: MARK.CS_LEFT },
        { action: 'spawn', asset: 'burger', position: MARK.CS_RIGHT },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'Cheering' },
        { action: 'text_popup', text: 'x3!', position: 'center', size: 'large' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '✨ Triple Copy!',
      message: 'Three perfect copies! Medium multiply is just right.',
      skillTaught: 'Specificity',
      tip: 'Medium multiply = a few neat copies. MEGA would overflow the kitchen!',
      vagueComparison: {
        vagueInput: 'Make more',
        vagueResult: 'More of what? How many more? One extra crumb appears.',
      },
    },
  },
  // ── medium + any + go_wild: Medium Chaos ──
  {
    id: 'mk2_med_go_wild', description: 'Medium wild spell makes the kitchen get rowdy — pots rattle and food jumps',
    trigger: { intensity: 'medium', spell: '*', appliance: '*', result: 'go_wild', quantity: '*' },
    tier: 'moderate', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'react', effect: 'steam', position: 'cs-left' },
        { action: 'spawn', asset: 'burger', position: 'ds-right', spawnStyle: 'drop' },
        { action: 'camera_shake', intensity: 0.2, duration: 0.8 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'jump_small' },
        { action: 'emote', character: 'mage', emoji: '😬' },
        { action: 'sfx', sound: 'impact' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌀 Medium Mayhem!',
      message: 'Medium wild makes things rowdy — pots rattle, food jumps. Manageable chaos!',
      skillTaught: 'Specificity',
      tip: 'Medium wild = fun chaos. MEGA wild = total destruction. Choose your chaos level!',
      vagueComparison: {
        vagueInput: 'Go wild',
        vagueResult: 'Wild how? The mage shrugs and nothing wild happens.',
      },
    },
  },
];

const STAGE2_UNSTABLE_VIGNETTES: Vignette[] = [
  // ── unstable + any spell + any result: Wild Card ──
  {
    id: 'mk2_unstable_wild', description: 'Unstable power causes random magical chaos — spells bounce everywhere',
    trigger: { intensity: 'unstable', spell: '*', appliance: '*', result: '*', quantity: '*' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'fridge', position: 'cs-right' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-center', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.3, duration: 2.0 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'fire', position: 'cs-left' },
        { action: 'react', effect: 'snowflakes', position: 'cs-right' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'screen_flash', color: 'purple', duration: 0.15 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'spawn_rain', asset: 'burger', quantity: 6, position: 'wide' },
        { action: 'camera_shake', intensity: 0.7, duration: 0.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-center' },
        { action: 'text_popup', text: 'UNSTABLE!', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 UNSTABLE CHAOS!',
      message: 'Unstable power makes EVERYTHING go haywire! Fire, ice, and explosions all at once!',
      skillTaught: 'Specificity',
      tip: '"Unstable" means you lose control. Compare: "Tiny" = gentle, "Medium" = balanced, "MEGA" = powerful but controlled!',
      vagueComparison: {
        vagueInput: 'Do something unstable',
        vagueResult: 'Unstable what? The mage accidentally turns themselves green.',
      },
    },
  },
  // ── unstable + any + dance: Unstable Dance Nightmare ──
  {
    id: 'mk2_unstable_dance', description: 'Unstable dance spell makes everything twitch and jitter uncontrollably',
    trigger: { intensity: 'unstable', spell: '*', appliance: '*', result: 'dance', quantity: '*' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'fridge', position: 'cs-right' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-center', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'wide' },
        { action: 'camera_shake', intensity: 0.4, duration: 2.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'react', effect: 'stars-spin', position: 'cs-left' },
        { action: 'react', effect: 'stars-spin', position: 'cs-right' },
        { action: 'react', effect: 'explosion-cartoon', position: 'ds-right' },
        { action: 'screen_flash', color: 'purple', duration: 0.15 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-center' },
        { action: 'text_popup', text: 'GLITCHY DANCE!', position: 'center', size: 'huge' },
        { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🤪 GLITCH DANCE!',
      message: 'Unstable + dance = everything twitches and glitches! The mage cannot control the beat!',
      skillTaught: 'Specificity',
      tip: 'Unstable power makes dance spells go haywire! Try "medium" for a controlled groove.',
      vagueComparison: {
        vagueInput: 'Dance unstably',
        vagueResult: 'The mage trips over their own feet. That is about it.',
      },
    },
  },
  // ── unstable + any + multiply: Unstable Cloning Chaos ──
  {
    id: 'mk2_unstable_multiply', description: 'Unstable multiply creates warped, melted, wrong copies of everything',
    trigger: { intensity: 'unstable', spell: '*', appliance: '*', result: 'multiply', quantity: '*' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.3, duration: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-left', scale: 0.5 },
        { action: 'spawn', asset: 'fridge', position: 'cs-right', scale: 0.3 },
        { action: 'spawn', asset: 'stove', position: 'ds-right', scale: 0.4 },
        { action: 'react', effect: 'smoke', position: 'wide' },
        { action: 'screen_flash', color: 'green', duration: 0.15 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'react', effect: 'question-marks', position: 'ds-left' },
        { action: 'text_popup', text: 'WRONG COPIES!', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🫠 MUTANT CLONES!',
      message: 'Unstable multiply = wrong copies! You asked for burgers but got mini fridges and stoves!',
      skillTaught: 'Specificity',
      tip: 'Unstable power copies the WRONG things! Use "medium" or "mega" for accurate clones.',
      vagueComparison: {
        vagueInput: 'Copy stuff',
        vagueResult: 'Copy what stuff? The mage copies the air. Nothing visible happens.',
      },
    },
  },
  // ── unstable + any + go_wild: Unstable Meltdown ──
  {
    id: 'mk2_unstable_go_wild', description: 'Unstable wild causes a complete kitchen meltdown — everything explodes in sequence',
    trigger: { intensity: 'unstable', spell: '*', appliance: '*', result: 'go_wild', quantity: '*' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn', asset: 'pot', position: 'cs-left' },
        { action: 'spawn', asset: 'fridge', position: 'cs-right' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-center', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.5, duration: 3.0 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'sfx', sound: 'impact' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'spawn_rain', asset: 'burger', quantity: 10, position: 'wide' },
        { action: 'screen_flash', color: 'red', duration: 0.2 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'react', effect: 'laugh-tears', position: 'wide' },
        { action: 'text_popup', text: 'MELTDOWN!!!', position: 'center', size: 'huge' },
        { action: 'camera_shake', intensity: 1.0, duration: 0.5 },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '☢️ TOTAL MELTDOWN!',
      message: 'Unstable + go wild = KITCHEN MELTDOWN! Everything explodes in sequence! Maximum destruction!',
      skillTaught: 'Specificity',
      tip: 'Unstable wild is the most chaotic combo! For controlled results, use specific intensity + specific result.',
      vagueComparison: {
        vagueInput: 'Just go crazy',
        vagueResult: 'The mage spins in a circle. One thing falls off a shelf. Underwhelming.',
      },
    },
  },
];

const STAGE2_QUANTITY_VIGNETTES: Vignette[] = [
  // ── any + way_too_many: Kitchen Flood ──
  {
    id: 'mk2_way_too_many', description: 'WAY too many items spawn and flood the kitchen',
    trigger: { intensity: '*', spell: '*', appliance: '*', result: '*', quantity: 'way_too_many' },
    tier: 'spectacular', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_rain', asset: 'burger', quantity: 15, position: 'wide' },
        { action: 'spawn_rain', asset: 'pot', quantity: 6, position: 'wide' },
        { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'text_popup', text: 'TOO MANY!', position: 'center', size: 'huge' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌊 KITCHEN FLOOD!',
      message: 'WAY too many of everything! The kitchen is drowning in food and pots!',
      skillTaught: 'Specificity',
      tip: 'Quantity matters! "Just one" is precise. "WAY too many" is hilarious but messy!',
      vagueComparison: {
        vagueInput: 'Make a lot of them',
        vagueResult: 'A lot of WHAT? The mage conjures... a lot of confused looks.',
      },
    },
  },
  // ── any + a_dozen + cook_perfectly: Dozen Perfect Dishes ──
  {
    id: 'mk2_dozen_cook', description: 'Exactly a dozen perfectly cooked dishes line up neatly',
    trigger: { intensity: '*', spell: '*', appliance: '*', result: 'cook_perfectly', quantity: 'a_dozen' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: MARK.CS_LEFT },
        { action: 'spawn', asset: 'burger', position: MARK.CS_CENTER },
        { action: 'spawn', asset: 'burger', position: MARK.CS_RIGHT },
        { action: 'spawn', asset: 'burger', position: MARK.DS_RIGHT },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'jump_big' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'text_popup', text: 'A DOZEN!', position: 'top', size: 'large' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '📦 A PERFECT DOZEN!',
      message: 'Exactly a dozen perfect dishes! Quantity + quality = amazing!',
      skillTaught: 'Specificity',
      tip: 'Saying "a dozen" gives exact results. "Way too many" gives chaos. Details matter!',
      vagueComparison: {
        vagueInput: 'Cook some food',
        vagueResult: 'Some food appears... maybe? It is unclear and bland.',
      },
    },
  },
];

const STAGE2_PAIR_VIGNETTES: Vignette[] = [
  ...STAGE2_TINY_VIGNETTES,
  ...STAGE2_MEGA_VIGNETTES,
  ...STAGE2_MEDIUM_VIGNETTES,
  ...STAGE2_UNSTABLE_VIGNETTES,
  ...STAGE2_QUANTITY_VIGNETTES,
];

export const MAGE_KITCHEN_STAGE_2: Vignette[] = [
  ...STAGE2_PAIR_VIGNETTES,
];

export const MAGE_KITCHEN_DEFAULT_2: Vignette = {
  id: 'mage_kitchen_default_2',
  description: 'A vague spell fizzles — not enough detail about power or quantity.',
  trigger: { intensity: '*', spell: '*', appliance: '*', result: '*', quantity: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ],
      delayAfter: 0.4,
    },
    {
      parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ],
      delayAfter: 0.8,
    },
    {
      parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
        { action: 'emote', character: 'mage', emoji: '🤷' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🤷 Vague Magic...',
    message: "Something sort of happened... but HOW powerful? HOW many? Be more specific!",
    skillTaught: 'Specificity',
    tip: "Try setting the Power Level and Quantity — they change everything about the result!",
    vagueComparison: {
      vagueInput: 'Cast a spell',
      vagueResult: "That's exactly what just happened. A vague spell with vague results!",
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 3 — COMBO EFFECTS (Secret combinations unlock unique vignettes)
// ═══════════════════════════════════════════════════════════════════════════════

const STAGE3_SECRET_COMBOS: Vignette[] = [
  // ── SECRET 1: Fire + Ice = Steam Kitchen ──
  {
    id: 'mk3_fire_ice_steam', description: 'Fire meets ice — the kitchen fills with magical steam, revealing hidden runes',
    trigger: { spell: 'fire_spell', spell2: 'ice_spell', mood: '*', target: '*' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-left' },
        { action: 'react', effect: 'snowflakes', position: 'cs-right' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'react', effect: 'smoke', position: 'cs-left' },
        { action: 'react', effect: 'smoke', position: 'cs-right' },
        { action: 'camera_shake', intensity: 0.3, duration: 1.0 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: 'STEAM REVEAL!', position: 'center', size: 'huge' },
        { action: 'screen_flash', color: 'white', duration: 0.2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'Cheering' },
        { action: 'react', effect: 'glow-pulse', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌫️ SECRET: STEAM REVEAL!',
      message: 'Fire + Ice = Steam! The magical steam reveals ancient runes hidden in the kitchen walls!',
      skillTaught: 'Combo Thinking',
      tip: 'Some things create NEW results when combined! Fire and ice make steam — what else fits together?',
    },
  },

  // ── SECRET 2: Grow + Shrink = Size Swap ──
  {
    id: 'mk3_grow_shrink_swap', description: 'Grow meets shrink — everything in the kitchen swaps sizes randomly',
    trigger: { spell: 'grow_spell', spell2: 'shrink_spell', mood: '*', target: '*' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-left', scale: 0.5 },
        { action: 'spawn', asset: 'fridge', position: 'cs-right', scale: 2.0 },
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-center', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'camera_shake', intensity: 0.4, duration: 1.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'grow', asset: 'stove', scale: 3.0 },
        { action: 'grow', asset: 'fridge', scale: 0.3 },
        { action: 'grow', asset: 'pot', scale: 2.5 },
        { action: 'screen_flash', color: 'purple', duration: 0.15 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'text_popup', text: 'SIZE SWAP!', position: 'center', size: 'huge' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'jump_big' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '📏 SECRET: SIZE SWAP!',
      message: 'Grow + Shrink at the same time = everything swaps sizes! The pot is HUGE and the fridge is tiny!',
      skillTaught: 'Combo Thinking',
      tip: 'Opposites create surprises! What other opposites can you combine?',
    },
  },

  // ── SECRET 3: Levitate + Transform = Flying Food Parade ──
  {
    id: 'mk3_lev_trans_parade', description: 'Levitate + Transform = food transforms mid-air into a flying parade',
    trigger: { spell: 'levitate', spell2: 'transform', mood: '*', target: '*' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'pot', position: 'cs-center' },
        { action: 'spawn', asset: 'pan', position: 'cs-left' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-left' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', asset: 'pot', to: 'top', style: 'arc' },
        { action: 'move', asset: 'pan', to: 'top', style: 'arc' },
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn', asset: 'burger', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', asset: 'burger', to: 'off-right', style: 'arc' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CENTER },
        { action: 'text_popup', text: 'FOOD PARADE!', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎪 SECRET: FLYING FOOD PARADE!',
      message: 'Levitate + Transform = the food floats up, transforms, and parades through the air!',
      skillTaught: 'Combo Thinking',
      tip: 'Movement + Change = animation! Think about what words DO together, not just separately.',
    },
  },

  // ── SECRET 4: Fire + Stove + Wild = Volcanic Kitchen ──
  {
    id: 'mk3_fire_stove_wild', description: 'Fire on a wild stove turns the kitchen into a volcano',
    trigger: { spell: 'fire_spell', spell2: '*', mood: 'wild', target: 'stove' },
    tier: 'absolute_chaos', promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'fire', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.6, duration: 2.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'fire', position: 'cs-left' },
        { action: 'react', effect: 'fire', position: 'cs-right' },
        { action: 'react', effect: 'fire', position: 'center' },
        { action: 'screen_flash', color: 'red', duration: 0.2 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_rain', asset: 'burger', quantity: 10, position: 'wide' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'text_popup', text: 'VOLCANO!', position: 'center', size: 'huge' },
        { action: 'camera_shake', intensity: 1.0, duration: 0.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
        { action: 'spawn_character', character: 'barbarian', position: 'off-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'celebrate' },
        { action: 'emote', character: 'barbarian', emoji: '🌋' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌋 SECRET: VOLCANIC KITCHEN!',
      message: 'Fire + Wild Stove = the stove becomes a VOLCANO! The barbarian loves it!',
      skillTaught: 'Combo Thinking',
      tip: 'Fire on something already hot = double trouble! Context changes how spells work.',
    },
  },

  // ── SECRET 5: Ice + Oven + Calm = Perfect Temperature ──
  {
    id: 'mk3_ice_oven_calm', description: 'Ice calms the haunted oven to exact baking temperature',
    trigger: { spell: 'ice_spell', spell2: '*', mood: 'calm', target: 'oven' },
    tier: 'moderate', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'oven', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'snowflakes', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.7 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'text_popup', text: 'PERFECT TEMP!', position: 'cs-center', size: 'large' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: MARK.CS_CENTER },
        { action: 'react', effect: 'glow-pulse', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎯 SECRET: PERFECT TEMPERATURE!',
      message: 'Ice + Haunted Oven + Calm = the oven settles to EXACTLY the right temperature! Perfect bake!',
      skillTaught: 'Combo Thinking',
      tip: 'Ice on a hot oven = balance! The right spell on the right target with the right mood = magic!',
    },
  },

  // ── SECRET 6: Transform + Sink + Curious = Potion Fountain ──
  {
    id: 'mk3_trans_sink_curious', description: 'Transform on the sink turns water into a rainbow potion fountain',
    trigger: { spell: 'transform', spell2: '*', mood: 'curious', target: 'sink' },
    tier: 'spectacular', promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sink', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'react', effect: 'glow-pulse', position: MARK.CS_CENTER },
        { action: 'screen_flash', color: 'purple', duration: 0.15 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_rain', asset: 'potion', quantity: 6, position: 'wide' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'text_popup', text: 'POTION FOUNTAIN!', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'jump_big' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CENTER },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌈 SECRET: POTION FOUNTAIN!',
      message: 'Transform + Sink + Curious = water transforms into a rainbow potion fountain!',
      skillTaught: 'Combo Thinking',
      tip: 'Transform changes WHAT something is. On water? It becomes potions! Context matters!',
    },
  },
];

export const MAGE_KITCHEN_STAGE_3: Vignette[] = [
  ...STAGE3_SECRET_COMBOS,
];

export const MAGE_KITCHEN_DEFAULT_3: Vignette = {
  id: 'mage_kitchen_default_3',
  description: 'A normal spell — nothing secret triggered. Keep experimenting!',
  trigger: { spell: '*', spell2: '*', mood: '*', target: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'stove', position: 'cs-center' },
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
      ],
      delayAfter: 0.4,
    },
    {
      parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ],
      delayAfter: 0.8,
    },
    {
      parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'emote', character: 'mage', emoji: '🤔' },
      ],
      delayAfter: 1.5,
    },
    {
      parallel: [
        { action: 'text_popup', text: 'Keep trying...', position: 'bottom', size: 'small' },
      ],
      delayAfter: 1.0,
    },
  ],
  feedback: {
    title: '🔮 Normal Spell...',
    message: "That was a regular spell — no secret combo triggered. Try different combinations!",
    skillTaught: 'Combo Thinking',
    tip: "Think about how words RELATE to each other. Fire + Ice? Grow + Shrink? What fits together?",
  },
};
