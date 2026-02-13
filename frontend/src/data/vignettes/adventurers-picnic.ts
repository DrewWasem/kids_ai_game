/**
 * Adventurers Picnic Quest — Vignettes for Stage 1.
 *
 * Stage 1: "The {ADVENTURER} discovers a {DISCOVERY} and reacts by {REACTION}"
 * Slots: ADVENTURER (ranger/druid/barbarian/ninja/rogue/whole_party), DISCOVERY (magic_portal/treasure/creature/enchanted_food/ancient_ruin/glowing_plant), REACTION (investigate/celebrate/panic/cast_spell/set_trap/have_picnic)
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const ADVENTURERS_PICNIC_STAGE_1: Vignette[] = [

  // ── EXACT: druid + glowing_plant + cast_spell ───────────────────────────────
  {
    id: 'adventurers_picnic_1_perfect_druid_plant_spell',
    trigger: { adventurer: 'druid', discovery: 'glowing_plant', reaction: 'cast_spell' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Forest clearing
      {
        parallel: [
          { action: 'spawn', asset: 'tree_oak', position: 'left' },
          { action: 'spawn', asset: 'tree_oak', position: 'right' },
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Druid enters
      {
        parallel: [
          { action: 'spawn_character', character: 'druid', position: 'left', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Druid walks
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'walk' },
        ],
        delayAfter: 0.5,
      },
      // Discovers glowing plant
      {
        parallel: [
          { action: 'spawn', asset: 'mushroom_glowing', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
          { action: 'text_popup', text: '✨ GLOWING PLANT! ✨', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      // Druid examines it
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'idle' },
          { action: 'emote', character: 'druid', emoji: '🌿' },
        ],
        delayAfter: 0.5,
      },
      // Druid casts growth spell
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'camera_shake', intensity: 0.4, duration: 1.5 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.5,
      },
      // Plant grows HUGE
      {
        parallel: [
          { action: 'spawn', asset: 'tree_magic', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'screen_flash', color: 'green', duration: 0.3 },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '🌳 GIANT TREE! 🌳', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.8,
      },
      // Druid celebrates
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌳 NATURE MAGIC!',
      message: "The druid found a glowing plant and used magic to make it grow HUGE! Perfect match of WHO (druid) + WHAT (glowing plant) + HOW (cast spell)!",
      skillTaught: 'Specificity',
      tip: 'Matching a character to their strengths = magical results!',
    },
  },

  // ── EXACT: whole_party + treasure + celebrate ───────────────────────────────
  {
    id: 'adventurers_picnic_1_perfect_party_treasure_celebrate',
    trigger: { adventurer: 'whole_party', discovery: 'treasure', reaction: 'celebrate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Adventure scene
      {
        parallel: [
          { action: 'spawn', asset: 'rock_boulder', position: 'left' },
          { action: 'spawn', asset: 'rock_boulder', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Party arrives
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'rogue', position: 'right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'barbarian', position: 'bottom', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'druid', position: 'center', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Rogue spots something
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'idle' },
          { action: 'emote', character: 'rogue', emoji: '👀' },
        ],
        delayAfter: 0.5,
      },
      // TREASURE CHEST APPEARS
      {
        parallel: [
          { action: 'spawn', asset: 'chest_gold', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
          { action: 'text_popup', text: '💰 TREASURE! 💰', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Everyone gasps
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'idle' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      // Chest opens
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'screen_flash', color: 'gold', duration: 0.3 },
          { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      // Gold coins spawn
      {
        parallel: [
          { action: 'spawn_rain', asset: 'coin', quantity: 12, position: 'wide' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      // EVERYONE CELEBRATES
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🎉 WE DID IT! 🎉', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💰 PARTY TREASURE!',
      message: "The whole party found treasure and celebrated together! Teamwork makes finding treasure even better. Perfect WHO + WHAT + HOW!",
      skillTaught: 'Specificity',
      tip: 'When everyone works together, the celebration is even bigger!',
    },
  },

  // ── PAIR: barbarian + * + panic ─────────────────────────────────────────────
  {
    id: 'adventurers_picnic_1_chaos_barbarian_panic',
    trigger: { adventurer: 'barbarian', discovery: '*', reaction: 'panic' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      // Forest
      {
        parallel: [
          { action: 'spawn', asset: 'tree_pine', position: 'left' },
          { action: 'spawn', asset: 'tree_pine', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      // Barbarian enters
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Something appears
      {
        parallel: [
          { action: 'spawn', asset: 'bunny', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      // Barbarian PANICS
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'get_hit' },
          { action: 'emote', character: 'barbarian', emoji: '😱' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'text_popup', text: '😱 AHHH! 😱', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Barbarian runs in circles
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.8,
      },
      // Swings weapon wildly
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'sword_slash' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // Falls over
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'die_flop' },
          { action: 'react', effect: 'sad-cloud', position: 'left' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.8,
      },
      // Bunny hops away
      {
        parallel: [
          { action: 'text_popup', text: '🐰 ...just a bunny 🐰', position: 'center', size: 'large' },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😱 PANIC MODE!',
      message: "The barbarian panicked at EVERYTHING! Even a bunny! Try picking what they discovered for a clearer scene.",
      skillTaught: 'Context',
      tip: 'Barbarians are brave warriors! Maybe try investigate or celebrate instead of panic?',
    },
  },

  // ── CATEGORY: * + magic_portal + * ──────────────────────────────────────────
  {
    id: 'adventurers_picnic_1_partial_portal',
    trigger: { adventurer: '*', discovery: 'magic_portal', reaction: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      // Clearing
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Someone appears
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // PORTAL OPENS
      {
        parallel: [
          { action: 'spawn', asset: 'portal', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
          { action: 'screen_flash', color: 'purple', duration: 0.3 },
          { action: 'sfx', sound: 'react' },
          { action: 'text_popup', text: '🌀 MAGIC PORTAL! 🌀', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.8,
      },
      // Character stares
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'idle' },
          { action: 'emote', character: 'mage', emoji: '🤔' },
          { action: 'react', effect: 'question-marks', position: 'left' },
        ],
        delayAfter: 1.5,
      },
      // Shrug
      {
        parallel: [
          { action: 'emote', character: 'mage', emoji: '🤷' },
          { action: 'text_popup', text: '...what now?', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌀 Portal Mystery!',
      message: "A magic portal appeared! But WHO discovered it and HOW did they react? Add those details to complete the story!",
      skillTaught: 'Detail',
      tip: "Try 'mage + magic_portal + investigate' or 'rogue + magic_portal + set_trap'!",
    },
  },

];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const ADVENTURERS_PICNIC_DEFAULT: Vignette = {
  id: 'adventurers_picnic_default',
  trigger: { adventurer: '*', discovery: '*', reaction: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'picnic_blanket', position: 'center' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'druid', position: 'right', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'wave' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '🏕️ ADVENTURE! 🏕️', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🏕️ Adventure Time!',
    message: "Something happened on the adventure! But WHO discovered it? WHAT did they find? HOW did they react? Fill in the story!",
    skillTaught: 'Specificity',
    tip: "Pick an adventurer, a discovery, and a reaction. Each detail brings the adventure to life!",
  },
};
