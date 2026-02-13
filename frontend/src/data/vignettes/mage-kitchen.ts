/**
 * Mage Kitchen Quest — Vignettes for Stage 1.
 *
 * Stage 1: "Cast {SPELL} on the {APPLIANCE} to make it {RESULT}"
 * Slots: SPELL (fire_spell/ice_spell/grow_spell/shrink_spell/levitate/transform), APPLIANCE (stove/fridge/pot/pan/sink/oven), RESULT (cook_perfectly/explode/dance/multiply/calm_down/go_wild)
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const MAGE_KITCHEN_STAGE_1: Vignette[] = [

  // ── EXACT: fire_spell + stove + cook_perfectly ──────────────────────────────
  {
    id: 'mage_kitchen_1_perfect_fire_stove_cook',
    trigger: { spell: 'fire_spell', appliance: 'stove', result: 'cook_perfectly' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Kitchen setup
      {
        parallel: [
          { action: 'spawn', asset: 'stove', position: 'center' },
          { action: 'spawn', asset: 'counter', position: 'left' },
          { action: 'spawn', asset: 'pot', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Mage enters
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '🔥' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Mage prepares spell
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'idle' },
          { action: 'text_popup', text: '🔥 FIRE SPELL! 🔥', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      // Casts fire spell
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'camera_shake', intensity: 0.4, duration: 1.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      // Stove ignites perfectly
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      // Food cooks perfectly
      {
        parallel: [
          { action: 'spawn', asset: 'stew_pot', position: 'center' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'screen_flash', color: 'gold', duration: 0.2 },
          { action: 'text_popup', text: '👨‍🍳 PERFECT! 👨‍🍳', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      // Mage celebrates
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'emote', character: 'mage', emoji: '⭐' },
        ],
        delayAfter: 0.8,
      },
      // Final triumph
      {
        parallel: [
          { action: 'text_popup', text: '🌟 MAGICAL CHEF! 🌟', position: 'center', size: 'huge' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🔥 PERFECT SPELL!',
      message: "Fire spell on the stove = perfectly cooked food! You matched WHAT spell (fire) with WHAT appliance (stove) to get the RESULT (cook perfectly)!",
      skillTaught: 'Specificity',
      tip: 'When you match the right spell to the right appliance, magic works perfectly!',
    },
  },

  // ── EXACT: grow_spell + pot + multiply ──────────────────────────────────────
  {
    id: 'mage_kitchen_1_perfect_grow_pot_multiply',
    trigger: { spell: 'grow_spell', appliance: 'pot', result: 'multiply' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Kitchen
      {
        parallel: [
          { action: 'spawn', asset: 'counter', position: 'center' },
          { action: 'spawn', asset: 'pot', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Mage enters
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '🌱' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Casts grow spell
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🌱 GROW SPELL! 🌱', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      // Pot starts growing
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // POT MULTIPLIES
      {
        parallel: [
          { action: 'spawn', asset: 'pot', position: 'left' },
          { action: 'spawn', asset: 'pot', position: 'right' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'react', effect: 'sparkle-magic', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // MORE POTS!
      {
        parallel: [
          { action: 'spawn_rain', asset: 'pot', quantity: 6, position: 'wide' },
          { action: 'text_popup', text: '🍲 POT EXPLOSION! 🍲', position: 'top', size: 'huge' },
          { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      // Mage shocked but happy
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'get_hit' },
          { action: 'emote', character: 'mage', emoji: '😲' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
        ],
        delayAfter: 0.5,
      },
      // Success!
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'text_popup', text: '✨ INFINITE POTS! ✨', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌱 MULTIPLICATION MAGIC!',
      message: "Grow spell on a pot = INFINITE POTS! You matched the spell, appliance, and result perfectly. Now you'll never run out!",
      skillTaught: 'Specificity',
      tip: 'Perfect combo = magical results! Try other spell + appliance + result combos!',
    },
  },

  // ── PAIR: * + fridge + explode ──────────────────────────────────────────────
  {
    id: 'mage_kitchen_1_chaos_fridge_explode',
    trigger: { spell: '*', appliance: 'fridge', result: 'explode' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      // Kitchen with fridge
      {
        parallel: [
          { action: 'spawn', asset: 'fridge', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      // Mage appears
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '😈' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Casts random spell
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🪄 CHAOS SPELL! 🪄', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      // Fridge starts shaking
      {
        parallel: [
          { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      // Mage backs away
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'dodge_back' },
          { action: 'emote', character: 'mage', emoji: '😰' },
        ],
        delayAfter: 0.3,
      },
      // FRIDGE EXPLODES!!!
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'camera_shake', intensity: 0.9, duration: 1.2 },
          { action: 'screen_flash', color: 'white', duration: 0.3 },
          { action: 'sfx', sound: 'fail' },
          { action: 'text_popup', text: '💥 KABOOM! 💥', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.8,
      },
      // Food rains down
      {
        parallel: [
          { action: 'spawn_rain', asset: 'apple', quantity: 5, position: 'wide' },
          { action: 'spawn_rain', asset: 'carrot', quantity: 4, position: 'wide' },
          { action: 'spawn_rain', asset: 'bread', quantity: 3, position: 'wide' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      // Mage covered in food
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'die_dramatic' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'text_popup', text: '🍎 FOOD STORM! 🍎', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 FRIDGE EXPLOSION!',
      message: "Any spell + fridge + explode = CHAOS! Food everywhere! Try picking a specific spell to see what happens!",
      skillTaught: 'Creativity',
      tip: "Explosions are fun! But try different spells to get different results.",
    },
  },

  // ── CATEGORY: levitate + * + * ──────────────────────────────────────────────
  {
    id: 'mage_kitchen_1_partial_levitate',
    trigger: { spell: 'levitate', appliance: '*', result: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      // Kitchen items
      {
        parallel: [
          { action: 'spawn', asset: 'pan', position: 'center' },
          { action: 'spawn', asset: 'pot', position: 'left' },
          { action: 'spawn', asset: 'plate', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Mage appears
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '✨' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Casts levitate
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🎈 LEVITATE! 🎈', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      // Everything floats
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'react', effect: 'sparkle-magic', position: 'right' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      // Mage happy but confused
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'celebrate' },
          { action: 'emote', character: 'mage', emoji: '🤷' },
          { action: 'text_popup', text: '✨ FLOATING KITCHEN! ✨', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎈 Everything Floats!',
      message: "The levitate spell made things float! But WHAT appliance and WHAT result were you aiming for? Add those details!",
      skillTaught: 'Detail',
      tip: "Try 'levitate + pot + dance' or 'levitate + pan + go_wild' for a complete spell!",
    },
  },

];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const MAGE_KITCHEN_DEFAULT: Vignette = {
  id: 'mage_kitchen_default',
  trigger: { spell: '*', appliance: '*', result: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'stove', position: 'center' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: '✨ MAGIC! ✨', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
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
