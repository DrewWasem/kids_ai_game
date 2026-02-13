/**
 * Skeleton Pizza Quest — Vignettes for Stage 1.
 *
 * Stage 1: "Have {CHEF} cook {DISH} in the most {STYLE} way possible"
 * Slots: CHEF (skeleton/clown/superhero/survivalist/everyone), DISH (pizza/pepperoni/pasta/soup/cake/mystery), STYLE (fast/fancy/chaotic/explosive/sneaky/dramatic)
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const SKELETON_PIZZA_STAGE_1: Vignette[] = [

  // ── EXACT: skeleton + pizza + chaotic ───────────────────────────────────────
  {
    id: 'skeleton_pizza_1_perfect_skeleton_pizza_chaotic',
    trigger: { chef: 'skeleton', dish: 'pizza', style: 'chaotic' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Kitchen setup
      {
        parallel: [
          { action: 'spawn', asset: 'stove', position: 'center' },
          { action: 'spawn', asset: 'table_kitchen', position: 'left' },
          { action: 'spawn', asset: 'barrel', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Skeleton chef rises
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '👨‍🍳' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Skeleton frantically cooks
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' },
          { action: 'text_popup', text: '🍕 CHAOS COOKING! 🍕', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // Ingredients fly everywhere
      {
        parallel: [
          { action: 'spawn_rain', asset: 'pizza_slice', quantity: 5, position: 'wide' },
          { action: 'spawn_rain', asset: 'tomato', quantity: 3, position: 'wide' },
          { action: 'camera_shake', intensity: 0.5, duration: 1.5 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      // Skeleton's bones fly off
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'get_hit' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Skeleton keeps going anyway
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '🦴' },
        ],
        delayAfter: 0.5,
      },
      // PIZZA EXPLODES onto plate
      {
        parallel: [
          { action: 'spawn', asset: 'pizza_whole', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.8, duration: 0.6 },
          { action: 'screen_flash', color: 'red', duration: 0.2 },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      // Skeleton celebrates
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'text_popup', text: '🍕 CHAOTIC MASTERPIECE! 🍕', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🍕 CHAOTIC CHEF!',
      message: "The skeleton cooked pizza in the MOST chaotic way possible! Bones flying, ingredients everywhere, but it WORKED! You said WHO (skeleton), WHAT (pizza), and HOW (chaotic)!",
      skillTaught: 'Specificity',
      tip: 'All three details = a perfect (chaotic) scene!',
    },
  },

  // ── EXACT: superhero + cake + dramatic ──────────────────────────────────────
  {
    id: 'skeleton_pizza_1_perfect_superhero_cake_dramatic',
    trigger: { chef: 'superhero', dish: 'cake', style: 'dramatic' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Dramatic kitchen
      {
        parallel: [
          { action: 'spawn', asset: 'oven', position: 'center' },
          { action: 'spawn', asset: 'spotlight', position: 'top' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Superhero arrives DRAMATICALLY
      {
        parallel: [
          { action: 'spawn_character', character: 'superhero', position: 'left', anim: 'spawn_air' },
          { action: 'react', effect: 'explosion-cartoon', position: 'left' },
          { action: 'camera_shake', intensity: 0.4, duration: 0.5 },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Superhero poses
      {
        parallel: [
          { action: 'animate', character: 'superhero', anim: 'taunt' },
          { action: 'emote', character: 'superhero', emoji: '🦸' },
          { action: 'text_popup', text: '🦸 SUPER BAKER! 🦸', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Uses super speed to mix
      {
        parallel: [
          { action: 'animate', character: 'superhero', anim: 'spin_attack' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      // Flies up dramatically
      {
        parallel: [
          { action: 'animate', character: 'superhero', anim: 'jump_idle' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      // Heat vision to bake
      {
        parallel: [
          { action: 'animate', character: 'superhero', anim: 'cast_spell' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      // PERFECT CAKE APPEARS
      {
        parallel: [
          { action: 'spawn', asset: 'cake_giant', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'screen_flash', color: 'gold', duration: 0.3 },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      // Dramatic finale
      {
        parallel: [
          { action: 'animate', character: 'superhero', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'text_popup', text: '🎂 SUPER CAKE! 🎂', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🦸 SUPER DRAMATIC!',
      message: "The superhero baked a cake using SUPER POWERS! Heat vision, super speed, and dramatic flair! Perfect WHO + WHAT + HOW combo!",
      skillTaught: 'Specificity',
      tip: 'Match the character to the style for maximum impact!',
    },
  },

  // ── PAIR: clown + * + explosive ─────────────────────────────────────────────
  {
    id: 'skeleton_pizza_1_chaos_clown_explosive',
    trigger: { chef: 'clown', dish: '*', style: 'explosive' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      // Kitchen
      {
        parallel: [
          { action: 'spawn', asset: 'stove', position: 'center' },
          { action: 'spawn', asset: 'pot', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      // Clown appears
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'clown', emoji: '🤡' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Clown adds "ingredients"
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'throw' },
          { action: 'text_popup', text: '🤡 SECRET INGREDIENT! 🤡', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      // Pot starts bubbling
      {
        parallel: [
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'sfx', sound: 'react' },
          { action: 'camera_shake', intensity: 0.3, duration: 0.5 },
        ],
        delayAfter: 0.3,
      },
      // Clown backs away nervously
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'dodge_back' },
          { action: 'emote', character: 'clown', emoji: '😰' },
        ],
        delayAfter: 0.3,
      },
      // EXPLOSION!!!
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'camera_shake', intensity: 0.9, duration: 1.0 },
          { action: 'screen_flash', color: 'orange', duration: 0.3 },
          { action: 'sfx', sound: 'fail' },
          { action: 'text_popup', text: '💥 KABOOM! 💥', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.8,
      },
      // Clown covered in soot
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'die_dramatic' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
        ],
        delayAfter: 0.8,
      },
      // Clown takes a bow
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'celebrate' },
          { action: 'react', effect: 'laugh-tears', position: 'center' },
          { action: 'text_popup', text: '🎪 TA-DA! 🎪', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 EXPLOSIVE CHAOS!',
      message: "The clown + explosive = KABOOM! Whatever they were cooking, it exploded! Try adding a specific dish to see what happens!",
      skillTaught: 'Creativity',
      tip: "Explosive + clown = guaranteed chaos! Add the dish for the full picture.",
    },
  },

  // ── CATEGORY: * + mystery + * ───────────────────────────────────────────────
  {
    id: 'skeleton_pizza_1_partial_mystery',
    trigger: { chef: '*', dish: 'mystery', style: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      // Mysterious kitchen
      {
        parallel: [
          { action: 'spawn', asset: 'cauldron', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Chef appears
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'skeleton_mage', emoji: '🤔' },
        ],
        delayAfter: 0.5,
      },
      // Magic cooking
      {
        parallel: [
          { action: 'animate', character: 'skeleton_mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      // Something appears...
      {
        parallel: [
          { action: 'spawn', asset: 'potion_mystery', position: 'center' },
          { action: 'react', effect: 'question-marks', position: 'center' },
          { action: 'text_popup', text: '❓ MYSTERY DISH? ❓', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'partial' },
        ],
        delayAfter: 1.0,
      },
      // Shrug
      {
        parallel: [
          { action: 'animate', character: 'skeleton_mage', anim: 'idle' },
          { action: 'emote', character: 'skeleton_mage', emoji: '🤷' },
          { action: 'text_popup', text: '🍽️ ...what is it? 🍽️', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '❓ Mystery Meal!',
      message: "A mystery dish appeared! But WHO cooked it and HOW? Add a chef and a cooking style to solve the mystery!",
      skillTaught: 'Detail',
      tip: "Mystery dishes are fun surprises, but try being specific about the chef and style!",
    },
  },

];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const SKELETON_PIZZA_DEFAULT: Vignette = {
  id: 'skeleton_pizza_default',
  trigger: { chef: '*', dish: '*', style: '*' },
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
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'left', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'interact' },
        { action: 'spawn', asset: 'pizza_slice', position: 'center' },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '🍕 COOKING! 🍕', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🍳 Kitchen Time!',
    message: "Someone cooked something! But WHO was the chef? WHAT did they cook? HOW did they cook it? Fill in the details!",
    skillTaught: 'Specificity',
    tip: "Try picking a chef, a dish, and a cooking style. Each detail makes it better!",
  },
};
