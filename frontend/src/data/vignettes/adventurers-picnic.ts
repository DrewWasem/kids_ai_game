/**
 * Adventurers Picnic Quest — Vignettes for Stage 1, 2, 3.
 *
 * Stage 1: "The {ADVENTURER} discovers a {DISCOVERY} and reacts by {REACTION}"
 * Slots: ADVENTURER (ranger/druid/barbarian/ninja/rogue/whole_party), DISCOVERY (magic_portal/treasure/creature/enchanted_food/ancient_ruin/glowing_plant), REACTION (investigate/celebrate/panic/cast_spell/set_trap/have_picnic)
 *
 * Stage 2: "At {TIME}, the {CAUTION} {ADVENTURER} discovers a {DISCOVERY} and reacts by {REACTION}"
 * Adds: CAUTION (reckless/cautious/stealthy/bold), TIME (dawn/noon/dusk/midnight)
 *
 * Stage 3: "The party uses {SKILL1} and {SKILL2} together in the {TERRAIN} with {WEATHER}"
 * Combos: SKILL1/SKILL2 (investigate/cast_spell/set_trap/celebrate/panic/have_picnic), TERRAIN (forest/river/cave/hilltop), WEATHER (foggy/starry/stormy/magical)
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

// RANGER vignettes (6 reactions)
const RANGER_VIGNETTES: Vignette[] = [
  {
    id: 'ap_ranger_investigate',
    description: 'Ranger investigates a forest discovery, tracking clues like a pro.',
    trigger: { adventurer: 'ranger', discovery: '*', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn', asset: 'tree_oak', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'idle' },
        { action: 'emote', character: 'ranger', emoji: '🔍' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'text_popup', text: '🔍 Tracked it! 🔍', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔍 RANGER TRACKING!',
      message: "Rangers excel at investigation! Their tracking skills reveal every clue.",
      skillTaught: 'Specificity',
      tip: 'Match character strengths to actions for perfect results!',
    },
  },
  {
    id: 'ap_ranger_celebrate',
    description: 'Ranger celebrates a discovery by doing a nature dance.',
    trigger: { adventurer: 'ranger', discovery: '*', reaction: 'celebrate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'spawn', asset: 'tree_pine', position: 'ds-left' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'Cheering' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'bunny', position: 'ds-right' },
        { action: 'text_popup', text: '🌲 Nature Party! 🌲', position: 'center', size: 'large' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌲 RANGER CELEBRATION!',
      message: "Rangers celebrate in harmony with nature! Even the animals join in!",
      skillTaught: 'Specificity',
      tip: 'Each adventurer has their own celebration style!',
    },
  },
  {
    id: 'ap_ranger_panic',
    description: 'Ranger panics and runs in circles, very un-ranger-like.',
    trigger: { adventurer: 'ranger', discovery: '*', reaction: 'panic' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn_character', character: 'ranger', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'rock_boulder', position: 'cs-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'get_hit' },
        { action: 'emote', character: 'ranger', emoji: '😱' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'walk' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: '😱 Rangers DON\'T panic! 😱', position: 'center', size: 'large' },
        { action: 'react', effect: 'question-marks', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '😱 RANGER PANIC?!',
      message: "Rangers are supposed to be calm! Panic doesn't match their character.",
      skillTaught: 'Specificity',
      tip: 'Try investigate or set_trap — those fit ranger skills better!',
    },
  },
  {
    id: 'ap_ranger_cast_spell',
    description: 'Ranger tries to cast a spell but has no magic power.',
    trigger: { adventurer: 'ranger', discovery: '*', reaction: 'cast_spell' },
    tier: 'subtle',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'cast_spell' },
        { action: 'emote', character: 'ranger', emoji: '🤔' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
        { action: 'text_popup', text: '...nothing happened', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'ranger', emoji: '🤷' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🤷 NO MAGIC HERE!',
      message: "Rangers don't have magic! Try a druid or mage for spellcasting.",
      skillTaught: 'Specificity',
      tip: 'Match actions to character abilities for better results!',
    },
  },
  {
    id: 'ap_ranger_set_trap',
    description: 'Ranger expertly sets a trap using forest knowledge.',
    trigger: { adventurer: 'ranger', discovery: '*', reaction: 'set_trap' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'throw' },
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'spawn', asset: 'torch', position: 'cs-left' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'wave' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
        { action: 'text_popup', text: '🪤 PERFECT TRAP! 🪤', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪤 RANGER TRAP MASTER!',
      message: "Rangers are expert trap setters! Perfect match of character and action!",
      skillTaught: 'Specificity',
      tip: 'Rangers use nature and tools to create clever traps!',
    },
  },
  {
    id: 'ap_ranger_have_picnic',
    description: 'Ranger has a peaceful picnic in nature.',
    trigger: { adventurer: 'ranger', discovery: '*', reaction: 'have_picnic' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'spawn', asset: 'tree_pine', position: 'ds-left' },
        { action: 'spawn', asset: 'tree_pine', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'apple', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ranger', anim: 'sit_floor' },
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'text_popup', text: '🍎 Nature Snack! 🍎', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍎 RANGER PICNIC!',
      message: "Rangers love peaceful nature picnics! Perfect harmony with the forest.",
      skillTaught: 'Specificity',
      tip: 'Rangers enjoy simple natural moments!',
    },
  },
];

// DRUID vignettes (6 reactions)
const DRUID_VIGNETTES: Vignette[] = [
  {
    id: 'ap_druid_investigate',
    description: 'Druid investigates a discovery using nature wisdom.',
    trigger: { adventurer: 'druid', discovery: '*', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'spawn', asset: 'tree_magic', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'druid', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'idle' },
        { action: 'emote', character: 'druid', emoji: '🌿' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'text_popup', text: '🌿 Nature\'s Secret! 🌿', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌿 NATURE WISDOM!',
      message: "Druids read nature like a book! Perfect investigation match!",
      skillTaught: 'Specificity',
      tip: 'Druids understand the language of nature!',
    },
  },
  {
    id: 'ap_druid_celebrate',
    description: 'Druid celebrates by growing flowers everywhere.',
    trigger: { adventurer: 'druid', discovery: '*', reaction: 'celebrate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'druid', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.3, duration: 1.0 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'spawn', asset: 'tree_magic', position: 'ds-left' },
        { action: 'spawn', asset: 'mushroom_glowing', position: 'ds-right' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'taunt' },
        { action: 'text_popup', text: '🌸 FLOWER PARTY! 🌸', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌸 DRUID CELEBRATION!',
      message: "Druids celebrate by making nature bloom! Magic flowers everywhere!",
      skillTaught: 'Specificity',
      tip: 'Druids bring nature\'s joy to every moment!',
    },
  },
  {
    id: 'ap_druid_panic',
    description: 'Druid panics and tries to turn into a tree but fails.',
    trigger: { adventurer: 'druid', discovery: '*', reaction: 'panic' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn_character', character: 'druid', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'bunny', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'get_hit' },
        { action: 'emote', character: 'druid', emoji: '😱' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
        { action: 'text_popup', text: '🌳 Failed Shapeshifting! 🌳', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌳 PANIC SHAPESHIFT FAIL!',
      message: "Druids stay calm! Panicking makes their magic wonky!",
      skillTaught: 'Specificity',
      tip: 'Druids work best when they\'re at peace with nature!',
    },
  },
  {
    id: 'ap_druid_cast_spell',
    description: 'Druid casts a nature spell that makes plants grow.',
    trigger: { adventurer: 'druid', discovery: '*', reaction: 'cast_spell' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'druid', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.4, duration: 1.2 },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'spawn', asset: 'tree_magic', position: 'cs-center' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'screen_flash', color: 'green', duration: 0.3 },
        { action: 'text_popup', text: '🌳 NATURE MAGIC! 🌳', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'jump_big' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌳 DRUID MAGIC!',
      message: "Perfect match! Druids excel at nature spells!",
      skillTaught: 'Specificity',
      tip: 'Druids + spells = instant nature magic!',
    },
  },
  {
    id: 'ap_druid_set_trap',
    description: 'Druid sets a trap using vines and plants.',
    trigger: { adventurer: 'druid', discovery: '*', reaction: 'set_trap' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'druid', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-left' },
        { action: 'text_popup', text: '🌿 VINE TRAP! 🌿', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌿 NATURE TRAP!',
      message: "Druids use plants to create living traps! Nature is their ally!",
      skillTaught: 'Specificity',
      tip: 'Druids make traps from the forest itself!',
    },
  },
  {
    id: 'ap_druid_have_picnic',
    description: 'Druid has a picnic surrounded by friendly forest creatures.',
    trigger: { adventurer: 'druid', discovery: '*', reaction: 'have_picnic' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'grass_patch', position: 'cs-center' },
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn', asset: 'tree_oak', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'druid', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'apple', position: 'cs-center' },
        { action: 'spawn', asset: 'bunny', position: 'ds-left' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'druid', anim: 'sit_floor' },
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'text_popup', text: '🐰 NATURE FEAST! 🐰', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🐰 DRUID PICNIC!',
      message: "Druids share their meals with forest friends! Perfect harmony!",
      skillTaught: 'Specificity',
      tip: 'Nature always joins a druid\'s picnic!',
    },
  },
];

// BARBARIAN vignettes (6 reactions)
const BARBARIAN_VIGNETTES: Vignette[] = [
  {
    id: 'ap_barbarian_investigate',
    description: 'Barbarian investigates by smashing things until they find answers.',
    trigger: { adventurer: 'barbarian', discovery: '*', reaction: 'investigate' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-left' },
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-right' },
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'sword_slash' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.7, duration: 0.8 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'wave' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'text_popup', text: '💥 SMASH FIRST! 💥', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 BARBARIAN INVESTIGATION!',
      message: "Barbarians investigate with their fists! Smash now, ask questions later!",
      skillTaught: 'Specificity',
      tip: 'Not subtle, but it works for barbarians!',
    },
  },
  {
    id: 'ap_barbarian_celebrate',
    description: 'Barbarian celebrates with a victory roar and weapon spinning.',
    trigger: { adventurer: 'barbarian', discovery: '*', reaction: 'celebrate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-left' },
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'taunt' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'text_popup', text: '💪 VICTORY! 💪', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💪 BARBARIAN ROAR!',
      message: "Barbarians celebrate LOUD! Maximum energy, maximum awesome!",
      skillTaught: 'Specificity',
      tip: 'Barbarians bring the party with pure muscle power!',
    },
  },
  {
    id: 'ap_barbarian_panic',
    description: 'Barbarian panics and runs around swinging wildly at nothing.',
    trigger: { adventurer: 'barbarian', discovery: '*', reaction: 'panic' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_pine', position: 'ds-left' },
        { action: 'spawn', asset: 'bunny', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'get_hit' },
        { action: 'emote', character: 'barbarian', emoji: '😱' },
        { action: 'react', effect: 'stars-spin', position: 'off-left' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
        { action: 'camera_shake', intensity: 0.7, duration: 1.0 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'text_popup', text: '😱 PANIC SMASH! 😱', position: 'center', size: 'huge' },
        { action: 'react', effect: 'question-marks', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '😱 BARBARIAN PANIC!',
      message: "Even barbarians panic sometimes! Chaos everywhere!",
      skillTaught: 'Specificity',
      tip: 'Barbarians + panic = maximum destruction!',
    },
  },
  {
    id: 'ap_barbarian_cast_spell',
    description: 'Barbarian tries to cast a spell by yelling at things.',
    trigger: { adventurer: 'barbarian', discovery: '*', reaction: 'cast_spell' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-right' },
        { action: 'spawn_character', character: 'barbarian', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'cast_spell' },
        { action: 'emote', character: 'barbarian', emoji: '😤' },
        { action: 'camera_shake', intensity: 0.3, duration: 0.5 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'text_popup', text: '...YELLING ISN\'T MAGIC!', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'barbarian', emoji: '🤷' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '😤 NO BARBARIAN MAGIC!',
      message: "Barbarians don't do magic! Try smashing or celebrating instead!",
      skillTaught: 'Specificity',
      tip: 'Barbarians use strength, not spells!',
    },
  },
  {
    id: 'ap_barbarian_set_trap',
    description: 'Barbarian sets a trap that is just a giant rock ready to fall.',
    trigger: { adventurer: 'barbarian', discovery: '*', reaction: 'set_trap' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'throw' },
        { action: 'spawn', asset: 'rock_boulder', position: 'cs-center' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.6 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'jump_big' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'text_popup', text: '🪨 ROCK TRAP! 🪨', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪨 BARBARIAN TRAP!',
      message: "Barbarian traps are simple: big rocks! If it works, it works!",
      skillTaught: 'Specificity',
      tip: 'Barbarians keep traps brutally simple!',
    },
  },
  {
    id: 'ap_barbarian_have_picnic',
    description: 'Barbarian has a picnic by eating everything in sight.',
    trigger: { adventurer: 'barbarian', discovery: '*', reaction: 'have_picnic' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn', asset: 'cake_birthday', position: 'cs-left' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
        { action: 'emote', character: 'barbarian', emoji: '😋' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'text_popup', text: '🍔 FEAST TIME! 🍔', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍔 BARBARIAN FEAST!',
      message: "Barbarians love food! Big portions, big appetite!",
      skillTaught: 'Specificity',
      tip: 'Barbarians never skip a meal!',
    },
  },
];

// NINJA vignettes (6 reactions)
const NINJA_VIGNETTES: Vignette[] = [
  {
    id: 'ap_ninja_investigate',
    description: 'Ninja investigates silently from the shadows.',
    trigger: { adventurer: 'ninja', discovery: '*', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-left' },
        { action: 'spawn', asset: 'tree_oak', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'chest', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ninja', to: 'ds-right', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'idle' },
        { action: 'emote', character: 'ninja', emoji: '👀' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'text_popup', text: '🥷 STEALTH CHECK! 🥷', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🥷 NINJA STEALTH!',
      message: "Ninjas investigate without being seen! Perfect stealth!",
      skillTaught: 'Specificity',
      tip: 'Ninjas are masters of silent observation!',
    },
  },
  {
    id: 'ap_ninja_celebrate',
    description: 'Ninja celebrates with a flashy backflip and smoke bomb.',
    trigger: { adventurer: 'ninja', discovery: '*', reaction: 'celebrate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_pine', position: 'ds-left' },
        { action: 'spawn_character', character: 'ninja', position: 'cs-center', anim: 'spawn_air' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'jump_small' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'Cheering' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'react', effect: 'stars-spin', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'text_popup', text: '🥷 NINJA STYLE! 🥷', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🥷 NINJA CELEBRATION!',
      message: "Ninjas celebrate with flair! Smoke bombs and backflips!",
      skillTaught: 'Specificity',
      tip: 'Ninjas do everything with style!',
    },
  },
  {
    id: 'ap_ninja_panic',
    description: 'Ninja panics and throws smoke bombs everywhere.',
    trigger: { adventurer: 'ninja', discovery: '*', reaction: 'panic' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'bunny', position: 'cs-center' },
        { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_air' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'get_hit' },
        { action: 'emote', character: 'ninja', emoji: '😱' },
        { action: 'react', effect: 'stars-spin', position: 'off-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'throw' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'react', effect: 'smoke', position: 'ds-left' },
        { action: 'react', effect: 'smoke', position: 'ds-right' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'text_popup', text: '😱 SMOKE EVERYWHERE! 😱', position: 'center', size: 'huge' },
        { action: 'react', effect: 'question-marks', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '😱 NINJA PANIC!',
      message: "Panicking ninja = smoke bomb chaos! Can't see anything!",
      skillTaught: 'Specificity',
      tip: 'Ninjas work best when they stay calm and focused!',
    },
  },
  {
    id: 'ap_ninja_cast_spell',
    description: 'Ninja tries to cast a spell but ninjas use ninjutsu, not magic.',
    trigger: { adventurer: 'ninja', discovery: '*', reaction: 'cast_spell' },
    tier: 'subtle',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_pine', position: 'ds-left' },
        { action: 'spawn_character', character: 'ninja', position: 'cs-center', anim: 'spawn_air' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'cast_spell' },
        { action: 'emote', character: 'ninja', emoji: '🤔' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'text_popup', text: '...that\'s just smoke', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'ninja', emoji: '🤷' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🤷 NOT QUITE MAGIC!',
      message: "Ninjas use ninjutsu, not spells! Try throwing or investigating instead!",
      skillTaught: 'Specificity',
      tip: 'Ninjas have their own techniques, not magic spells!',
    },
  },
  {
    id: 'ap_ninja_set_trap',
    description: 'Ninja sets a silent trap with perfect precision.',
    trigger: { adventurer: 'ninja', discovery: '*', reaction: 'set_trap' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ninja', to: 'ds-right', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'throw' },
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'spawn', asset: 'torch', position: 'cs-left' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'wave' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'text_popup', text: '🥷 SILENT TRAP! 🥷', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🥷 NINJA TRAP MASTER!',
      message: "Ninjas set silent, deadly traps! Perfect precision!",
      skillTaught: 'Specificity',
      tip: 'Ninjas excel at sneaky trap placement!',
    },
  },
  {
    id: 'ap_ninja_have_picnic',
    description: 'Ninja has a picnic while remaining completely hidden.',
    trigger: { adventurer: 'ninja', discovery: '*', reaction: 'have_picnic' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_pine', position: 'ds-left' },
        { action: 'spawn', asset: 'tree_pine', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'sandwich', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_air' },
        { action: 'react', effect: 'smoke', position: 'off-right' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ninja', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'sit_floor' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'text_popup', text: '🥷 STEALTH SNACK! 🥷', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🥷 NINJA PICNIC!',
      message: "Ninjas eat in the shadows! Even their snacks are stealthy!",
      skillTaught: 'Specificity',
      tip: 'Ninjas never drop their guard, even during meals!',
    },
  },
];

// ROGUE vignettes (6 reactions)
const ROGUE_VIGNETTES: Vignette[] = [
  {
    id: 'ap_rogue_investigate',
    description: 'Rogue investigates by lockpicking and searching for treasure.',
    trigger: { adventurer: 'rogue', discovery: '*', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'chest', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'rogue', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'idle' },
        { action: 'emote', character: 'rogue', emoji: '🔓' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'spawn_rain', asset: 'coin', quantity: 6, position: 'cs-center' },
        { action: 'text_popup', text: '🔓 UNLOCKED! 🔓', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔓 ROGUE LOCKPICKING!',
      message: "Rogues investigate by picking locks! Perfect treasure hunter match!",
      skillTaught: 'Specificity',
      tip: 'Rogues excel at finding hidden loot!',
    },
  },
  {
    id: 'ap_rogue_celebrate',
    description: 'Rogue celebrates by tossing coins in the air.',
    trigger: { adventurer: 'rogue', discovery: '*', reaction: 'celebrate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
        { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'rogue', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'throw' },
        { action: 'spawn_rain', asset: 'coin', quantity: 10, position: 'wide' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'jump_big' },
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'text_popup', text: '💰 JACKPOT! 💰', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💰 ROGUE TREASURE!',
      message: "Rogues celebrate with gold! Coins everywhere!",
      skillTaught: 'Specificity',
      tip: 'Rogues love finding and celebrating treasure!',
    },
  },
  {
    id: 'ap_rogue_panic',
    description: 'Rogue panics and drops all their stolen loot.',
    trigger: { adventurer: 'rogue', discovery: '*', reaction: 'panic' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'bunny', position: 'cs-center' },
        { action: 'spawn_character', character: 'rogue', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'get_hit' },
        { action: 'emote', character: 'rogue', emoji: '😱' },
        { action: 'react', effect: 'stars-spin', position: 'ds-left' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'throw' },
        { action: 'spawn_rain', asset: 'coin', quantity: 8, position: 'wide' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: '😱 DROPPED THE LOOT! 😱', position: 'center', size: 'large' },
        { action: 'react', effect: 'question-marks', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '😱 ROGUE PANIC!',
      message: "Panicking rogue = lost treasure! Stay calm to keep the loot!",
      skillTaught: 'Specificity',
      tip: 'Rogues work best when they stay sneaky and calm!',
    },
  },
  {
    id: 'ap_rogue_cast_spell',
    description: 'Rogue tries to cast a spell but has no magic training.',
    trigger: { adventurer: 'rogue', discovery: '*', reaction: 'cast_spell' },
    tier: 'subtle',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-right' },
        { action: 'spawn_character', character: 'rogue', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'cast_spell' },
        { action: 'emote', character: 'rogue', emoji: '🤔' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
        { action: 'text_popup', text: '...rogues don\'t do magic', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'rogue', emoji: '🤷' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🤷 NO ROGUE MAGIC!',
      message: "Rogues use tricks, not spells! Try investigate or set_trap instead!",
      skillTaught: 'Specificity',
      tip: 'Rogues rely on skill and cunning, not magic!',
    },
  },
  {
    id: 'ap_rogue_set_trap',
    description: 'Rogue sets a sneaky trap to protect their treasure.',
    trigger: { adventurer: 'rogue', discovery: '*', reaction: 'set_trap' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'rogue', to: 'ds-left', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'throw' },
        { action: 'spawn', asset: 'barrel', position: 'cs-left' },
        { action: 'spawn', asset: 'barrel', position: 'cs-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'Cheering' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'text_popup', text: '🪤 SNEAKY TRAP! 🪤', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪤 ROGUE TRAP MASTER!',
      message: "Rogues set sneaky traps to protect their treasure! Clever!",
      skillTaught: 'Specificity',
      tip: 'Rogues use cunning to create perfect traps!',
    },
  },
  {
    id: 'ap_rogue_have_picnic',
    description: 'Rogue has a picnic while counting their stolen gold.',
    trigger: { adventurer: 'rogue', discovery: '*', reaction: 'have_picnic' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'sandwich', position: 'cs-center' },
        { action: 'spawn', asset: 'chest_gold', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'rogue', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'rogue', anim: 'sit_floor' },
        { action: 'emote', character: 'rogue', emoji: '💰' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_rain', asset: 'coin', quantity: 5, position: 'cs-center' },
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'text_popup', text: '💰 TREASURE PICNIC! 💰', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💰 ROGUE PICNIC!',
      message: "Rogues enjoy picnics with their treasure! Gold and food!",
      skillTaught: 'Specificity',
      tip: 'Rogues never let their guard down... or their gold!',
    },
  },
];

// WHOLE_PARTY vignettes (6 reactions)
const WHOLE_PARTY_VIGNETTES: Vignette[] = [
  {
    id: 'ap_whole_party_investigate',
    description: 'The whole party investigates together, combining all their skills.',
    trigger: { adventurer: 'whole_party', discovery: '*', reaction: 'investigate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'rogue', position: 'off-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'druid', position: 'ds-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
        { action: 'move', character: 'rogue', to: 'ds-right', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'idle' },
        { action: 'emote', character: 'ranger', emoji: '🔍' },
        { action: 'emote', character: 'rogue', emoji: '👀' },
        { action: 'emote', character: 'druid', emoji: '🌿' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'react', effect: 'stars-spin', position: 'center' },
        { action: 'text_popup', text: '🔍 TEAM INVESTIGATION! 🔍', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔍 PARTY TEAMWORK!',
      message: "The whole party working together finds all the clues! Perfect teamwork!",
      skillTaught: 'Specificity',
      tip: 'Teamwork combines everyone\'s strengths!',
    },
  },
  {
    id: 'ap_whole_party_celebrate',
    description: 'The whole party celebrates together with maximum joy.',
    trigger: { adventurer: 'whole_party', discovery: '*', reaction: 'celebrate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'off-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'rogue', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'druid', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'screen_flash', color: 'gold', duration: 0.3 },
        { action: 'spawn_rain', asset: 'coin', quantity: 15, position: 'wide' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'wave' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'text_popup', text: '🎉 PARTY VICTORY! 🎉', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎉 PARTY CELEBRATION!',
      message: "Everyone celebrating together is the best! Maximum joy!",
      skillTaught: 'Specificity',
      tip: 'Shared victories make the celebration even bigger!',
    },
  },
  {
    id: 'ap_whole_party_panic',
    description: 'The whole party panics and runs in all directions.',
    trigger: { adventurer: 'whole_party', discovery: '*', reaction: 'panic' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'bunny', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'rogue', position: 'cs-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'get_hit' },
        { action: 'emote', character: 'ranger', emoji: '😱' },
        { action: 'emote', character: 'barbarian', emoji: '😱' },
        { action: 'react', effect: 'stars-spin', position: 'center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'walk' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
        { action: 'react', effect: 'smoke', position: 'ds-left' },
        { action: 'react', effect: 'smoke', position: 'ds-right' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'text_popup', text: '😱 EVERYONE PANIC! 😱', position: 'center', size: 'huge' },
        { action: 'react', effect: 'question-marks', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '😱 PARTY PANIC!',
      message: "When everyone panics, it's total chaos! Coordination is lost!",
      skillTaught: 'Specificity',
      tip: 'Panic is contagious — keep the team calm!',
    },
  },
  {
    id: 'ap_whole_party_cast_spell',
    description: 'The whole party tries to cast a spell together but only some have magic.',
    trigger: { adventurer: 'whole_party', discovery: '*', reaction: 'cast_spell' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'druid', position: 'ds-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'cs-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'cast_spell' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'ds-left' },
        { action: 'react', effect: 'sparkle-magic', position: 'ds-right' },
        { action: 'react', effect: 'smoke', position: 'cs-left' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'barbarian', emoji: '🤷' },
        { action: 'text_popup', text: '...some aren\'t magic users!', position: 'center', size: 'large' },
        { action: 'react', effect: 'question-marks', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🤷 MIXED MAGIC!',
      message: "Only some party members can cast spells! Mixed results!",
      skillTaught: 'Specificity',
      tip: 'Try actions that everyone can do together!',
    },
  },
  {
    id: 'ap_whole_party_set_trap',
    description: 'The whole party sets a complex trap together.',
    trigger: { adventurer: 'whole_party', discovery: '*', reaction: 'set_trap' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'tree_oak', position: 'ds-left' },
        { action: 'spawn', asset: 'rock_boulder', position: 'ds-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'rogue', position: 'off-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
        { action: 'move', character: 'rogue', to: 'ds-right', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'throw' },
        { action: 'spawn', asset: 'barrel', position: 'cs-left' },
        { action: 'spawn', asset: 'barrel', position: 'cs-right' },
        { action: 'spawn', asset: 'torch', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'taunt' },
        { action: 'react', effect: 'glow-pulse', position: 'center' },
        { action: 'text_popup', text: '🪤 MEGA TRAP! 🪤', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪤 PARTY TRAP!',
      message: "The whole party building a trap together = mega trap! Teamwork!",
      skillTaught: 'Specificity',
      tip: 'Combining everyone\'s skills creates the best traps!',
    },
  },
  {
    id: 'ap_whole_party_have_picnic',
    description: 'The whole party has a big picnic together.',
    trigger: { adventurer: 'whole_party', discovery: '*', reaction: 'have_picnic' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'burger', position: 'cs-left' },
        { action: 'spawn', asset: 'cake_birthday', position: 'cs-center' },
        { action: 'spawn', asset: 'apple', position: 'cs-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'off-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'druid', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'rogue', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
        { action: 'move', character: 'barbarian', to: 'ds-right', style: 'linear' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'sit_floor' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'text_popup', text: '🧺 PARTY FEAST! 🧺', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🧺 PARTY PICNIC!',
      message: "The whole party enjoying a feast together! Perfect team bonding!",
      skillTaught: 'Specificity',
      tip: 'Sharing meals brings the party closer!',
    },
  },
];

// Assemble all Stage 1 vignettes
const PAIR_VIGNETTES: Vignette[] = [
  ...RANGER_VIGNETTES,
  ...DRUID_VIGNETTES,
  ...BARBARIAN_VIGNETTES,
  ...NINJA_VIGNETTES,
  ...ROGUE_VIGNETTES,
  ...WHOLE_PARTY_VIGNETTES,
];

export const ADVENTURERS_PICNIC_STAGE_1: Vignette[] = PAIR_VIGNETTES;

// ─── STAGE 2 VIGNETTES (Specificity — time + caution) ──────────────────────

export const ADVENTURERS_PICNIC_STAGE_2: Vignette[] = [

  // ── RECKLESS 1: reckless barbarian charges into magic portal at noon ──
  {
    id: 'ap2_reckless_barbarian_portal',
    description: 'At noon, a reckless barbarian charges straight into a magic portal, explosions everywhere.',
    trigger: { caution: 'reckless', time: 'noon', adventurer: 'barbarian', discovery: 'magic_portal', reaction: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'spawn', asset: 'portal', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
          { action: 'screen_flash', color: 'yellow', duration: 0.2 }, // noon light
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'barbarian', to: 'cs-center', style: 'linear' },
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.8, duration: 1.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'barbarian', to: 'off-right', style: 'arc' },
          { action: 'react', effect: 'smoke', position: 'cs-center' },
          { action: 'text_popup', text: '💥 YOLO! 💥', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 RECKLESS CHARGE!',
      message: "A reckless barbarian at noon doesn't think twice — just charges in! The bright sunlight didn't slow them down at all!",
      skillTaught: 'Specificity',
      tip: 'Try cautious or stealthy for a safer approach!',
      vagueComparison: {
        vagueInput: 'The barbarian discovers a portal',
        vagueResult: 'The barbarian might be careful or reckless — specifying RECKLESS made this explosion happen!',
      },
    },
  },

  // ── RECKLESS 2: reckless ranger finds treasure at dawn, grabs it all, trap triggers ──
  {
    id: 'ap2_reckless_ranger_treasure',
    description: 'At dawn, a reckless ranger grabs treasure and triggers a trap.',
    trigger: { caution: 'reckless', time: 'dawn', adventurer: 'ranger', discovery: 'treasure', reaction: '*' },
    tier: 'absolute_chaos',
    promptScore: 'funny_fail',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
          { action: 'screen_flash', color: 'pink', duration: 0.3 }, // dawn light
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'cs-center', style: 'linear' },
          { action: 'emote', character: 'ranger', emoji: '🤑' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'throw' },
          { action: 'spawn_rain', asset: 'coin', quantity: 8, position: 'wide' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'animate', character: 'ranger', anim: 'get_hit' },
          { action: 'react', effect: 'smoke', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.8 },
          { action: 'text_popup', text: '🪤 TRAP! 🪤', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🪤 TREASURE TRAP!',
      message: "Reckless at dawn means rushing in before seeing clearly! The early light didn't help the ranger check for traps first.",
      skillTaught: 'Specificity',
      tip: 'Cautious rangers investigate before grabbing!',
      vagueComparison: {
        vagueInput: 'The ranger finds treasure',
        vagueResult: 'A ranger might check for traps... but RECKLESS made them grab first!',
      },
    },
  },

  // ── RECKLESS 3: reckless ninja discovers creature at dusk, scares it, chaos ──
  {
    id: 'ap2_reckless_ninja_creature',
    description: 'At dusk, a reckless ninja startles a forest creature and gets chased.',
    trigger: { caution: 'reckless', time: 'dusk', adventurer: 'ninja', discovery: 'creature', reaction: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'bunny', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.3 }, // dusk light
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_air' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ninja', to: 'cs-center', style: 'linear' },
          { action: 'animate', character: 'ninja', anim: 'sword_slash' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'cs-center' },
          { action: 'emote', character: 'ninja', emoji: '😱' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ninja', to: 'off-left', style: 'linear' },
          { action: 'react', effect: 'smoke', position: 'cs-center' },
          { action: 'text_popup', text: '🐰 RUN! 🐰', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😱 CREATURE CHAOS!',
      message: "Reckless at dusk means charging into shadows! The ninja scared the creature instead of sneaking up quietly.",
      skillTaught: 'Specificity',
      tip: 'Stealthy ninjas work best in dim light!',
      vagueComparison: {
        vagueInput: 'The ninja discovers a creature',
        vagueResult: 'A ninja could sneak or charge. RECKLESS turned this into a chase!',
      },
    },
  },

  // ── STEALTHY 1: stealthy rogue at midnight sneaks past treasure guardians ──
  {
    id: 'ap2_stealthy_rogue_midnight',
    description: 'At midnight, a stealthy rogue silently sneaks past sleeping guardians to claim treasure.',
    trigger: { caution: 'stealthy', time: 'midnight', adventurer: 'rogue', discovery: 'treasure', reaction: 'investigate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
          { action: 'spawn', asset: 'rock_boulder', position: 'cs-left' },
          { action: 'spawn', asset: 'rock_boulder', position: 'cs-right' },
          { action: 'screen_flash', color: 'darkblue', duration: 0.5 }, // midnight darkness
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton', position: 'cs-left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'skeleton', position: 'cs-right', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton', emoji: '💤' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'rogue', to: 'cs-center', style: 'linear' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'jump_big' },
          { action: 'spawn_rain', asset: 'coin', quantity: 6, position: 'cs-center' },
          { action: 'text_popup', text: '🤫 PERFECT HEIST! 🤫', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤫 MIDNIGHT HEIST!',
      message: "Stealthy + midnight + rogue = the perfect combination! Darkness helps rogues move unseen.",
      skillTaught: 'Specificity',
      tip: 'Matching character skills to time of day creates perfect scenarios!',
      vagueComparison: {
        vagueInput: 'The rogue finds treasure',
        vagueResult: 'Without STEALTHY + MIDNIGHT, the guards might have woken up!',
      },
    },
  },

  // ── STEALTHY 2: stealthy druid at dawn investigates glowing plant quietly ──
  {
    id: 'ap2_stealthy_druid_plant',
    description: 'At dawn, a stealthy druid quietly observes a glowing plant and discovers its secret.',
    trigger: { caution: 'stealthy', time: 'dawn', adventurer: 'druid', discovery: 'glowing_plant', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-center' },
          { action: 'spawn', asset: 'grass_patch', position: 'cs-left' },
          { action: 'spawn', asset: 'grass_patch', position: 'cs-right' },
          { action: 'screen_flash', color: 'pink', duration: 0.3 }, // dawn light
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'druid', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'idle' },
          { action: 'emote', character: 'druid', emoji: '🌿' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'cast_spell' },
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
          { action: 'text_popup', text: '✨ Nature\'s Secret! ✨', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌿 NATURE\'S SECRET!',
      message: "Stealthy + dawn + druid = quiet observation reveals magic! The soft morning light helped the druid see the plant\'s true nature.",
      skillTaught: 'Specificity',
      tip: 'Being stealthy lets you discover things without disturbing them!',
      vagueComparison: {
        vagueInput: 'The druid discovers a glowing plant',
        vagueResult: 'Without STEALTHY, the druid might have scared the plant\'s magic away!',
      },
    },
  },

  // ── CAUTIOUS 3: cautious ranger sets trap carefully for ancient ruin ──
  {
    id: 'ap2_cautious_ranger_ruin',
    description: 'A cautious ranger carefully sets a trap to protect an ancient ruin.',
    trigger: { caution: 'cautious', time: '*', adventurer: 'ranger', discovery: 'ancient_ruin', reaction: 'set_trap' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'idle' },
          { action: 'emote', character: 'ranger', emoji: '🤔' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'throw' },
          { action: 'spawn', asset: 'flag', position: 'cs-left' },
          { action: 'spawn', asset: 'flag', position: 'cs-right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'Cheering' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🪤 Perfect Trap! 🪤', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🪤 PERFECT TRAP!',
      message: "Cautious rangers think before acting! Careful planning made this trap flawless.",
      skillTaught: 'Specificity',
      tip: 'Cautious characters take their time and get it right!',
      vagueComparison: {
        vagueInput: 'The ranger sets a trap',
        vagueResult: 'Without CAUTIOUS, the trap might be sloppy or trigger early!',
      },
    },
  },

  // ── TIME-SPECIFIC 1: dawn + druid + glowing_plant = golden light magic ──
  {
    id: 'ap2_dawn_druid_plant',
    description: 'At dawn, golden light makes the druid\'s plant magic even more powerful.',
    trigger: { caution: '*', time: 'dawn', adventurer: 'druid', discovery: 'glowing_plant', reaction: 'cast_spell' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-center' },
          { action: 'screen_flash', color: 'gold', duration: 0.5 }, // golden dawn
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'druid', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.4, duration: 1.2 },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'tree_magic', position: 'cs-center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'screen_flash', color: 'gold', duration: 0.3 },
          { action: 'text_popup', text: '🌅 DAWN MAGIC! 🌅', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌅 GOLDEN DAWN MAGIC!',
      message: "Dawn's golden light makes plant magic super powerful! Time of day matters for druids!",
      skillTaught: 'Specificity',
      tip: 'Dawn amplifies nature magic — try different times for different effects!',
      vagueComparison: {
        vagueInput: 'The druid casts a spell on a plant',
        vagueResult: 'Without DAWN, the spell would be weaker. Golden morning light = golden magic!',
      },
    },
  },

  // ── TIME-SPECIFIC 2: midnight + magic_portal = spooky glowing portal ──
  {
    id: 'ap2_midnight_portal',
    description: 'At midnight, the magic portal glows with eerie power.',
    trigger: { caution: '*', time: 'midnight', adventurer: '*', discovery: 'magic_portal', reaction: '*' },
    tier: 'spectacular',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'screen_flash', color: 'darkblue', duration: 0.5 }, // midnight darkness
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'portal', position: 'cs-center' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.5, duration: 1.5 },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.3 },
          { action: 'text_popup', text: '🌙 MIDNIGHT PORTAL! 🌙', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
          { action: 'emote', character: 'mage', emoji: '😲' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌙 MIDNIGHT PORTAL!',
      message: "Midnight makes magic portals glow with extra power! The darkness amplifies the magic.",
      skillTaught: 'Specificity',
      tip: 'Time changes everything — midnight is when magic is strongest!',
      vagueComparison: {
        vagueInput: 'Someone discovers a portal',
        vagueResult: 'Without MIDNIGHT, the portal would be less magical. Darkness = power!',
      },
    },
  },

  // ── TIME-SPECIFIC 3: dusk + treasure + dramatic shadows ──
  {
    id: 'ap2_dusk_treasure',
    description: 'At dusk, dramatic shadows make finding treasure extra mysterious.',
    trigger: { caution: '*', time: 'dusk', adventurer: '*', discovery: 'treasure', reaction: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.4 }, // dusk shadows
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'idle' },
          { action: 'emote', character: 'ranger', emoji: '😲' },
          { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_rain', asset: 'coin', quantity: 8, position: 'cs-center' },
          { action: 'text_popup', text: '🌆 DUSK DISCOVERY! 🌆', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌆 DUSK TREASURE!',
      message: "Dusk creates dramatic shadows that make discoveries feel epic! The fading light adds mystery.",
      skillTaught: 'Specificity',
      tip: 'Dusk is perfect for dramatic moments!',
      vagueComparison: {
        vagueInput: 'Someone finds treasure',
        vagueResult: 'Without DUSK, there would be no dramatic shadows. Time sets the mood!',
      },
    },
  },

  // ── CROSS 1: bold barbarian at noon smashes through ancient ruin ──
  {
    id: 'ap2_bold_barbarian_ruin',
    description: 'At noon, a bold barbarian smashes straight through an ancient ruin.',
    trigger: { caution: 'bold', time: 'noon', adventurer: 'barbarian', discovery: 'ancient_ruin', reaction: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'screen_flash', color: 'yellow', duration: 0.3 }, // bright noon
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'barbarian', to: 'cs-center', style: 'linear' },
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'react', effect: 'smoke', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.8, duration: 1.0 },
          { action: 'text_popup', text: '💪 SMASH! 💪', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'wave' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💪 BOLD SMASH!',
      message: "Bold + noon + barbarian = maximum confidence! The bright sunlight made the barbarian even bolder!",
      skillTaught: 'Specificity',
      tip: 'Bold characters act with confidence — sometimes too much!',
      vagueComparison: {
        vagueInput: 'The barbarian discovers a ruin',
        vagueResult: 'Without BOLD, the barbarian might investigate instead of smashing!',
      },
    },
  },

  // ── CROSS 2: cautious ninja at dusk investigates enchanted food ──
  {
    id: 'ap2_cautious_ninja_food',
    description: 'At dusk, a cautious ninja carefully inspects enchanted food before trying it.',
    trigger: { caution: 'cautious', time: 'dusk', adventurer: 'ninja', discovery: 'enchanted_food', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
          { action: 'spawn', asset: 'cake', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.3 }, // dusk
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_air' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ninja', to: 'ds-right', style: 'linear' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'idle' },
          { action: 'emote', character: 'ninja', emoji: '🤔' },
          { action: 'react', effect: 'question-marks', position: 'cs-center' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'taunt' },
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
          { action: 'text_popup', text: '✅ Safe! ✅', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '✅ CAREFUL INSPECTION!',
      message: "Cautious + dusk + ninja = perfect investigation! The fading light made the ninja extra careful.",
      skillTaught: 'Specificity',
      tip: 'Cautious characters check before acting — smart!',
      vagueComparison: {
        vagueInput: 'The ninja discovers enchanted food',
        vagueResult: 'Without CAUTIOUS, the ninja might eat first and ask questions later!',
      },
    },
  },

  // ── CROSS 3: stealthy whole_party at midnight investigates creature ──
  {
    id: 'ap2_stealthy_party_creature',
    description: 'At midnight, the stealthy whole party quietly observes a mysterious creature.',
    trigger: { caution: 'stealthy', time: 'midnight', adventurer: 'whole_party', discovery: 'creature', reaction: 'investigate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'bunny', position: 'cs-center' },
          { action: 'screen_flash', color: 'darkblue', duration: 0.5 }, // midnight
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'druid', position: 'off-right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'rogue', position: 'ds-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
          { action: 'move', character: 'druid', to: 'ds-right', style: 'linear' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'idle' },
          { action: 'emote', character: 'ranger', emoji: '🤫' },
          { action: 'emote', character: 'druid', emoji: '👀' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
          { action: 'text_popup', text: '🌙 PERFECT TEAMWORK! 🌙', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌙 MIDNIGHT OBSERVATION!',
      message: "Stealthy + midnight + whole party = perfect teamwork! The darkness helps everyone stay hidden together.",
      skillTaught: 'Specificity',
      tip: 'Teamwork is even better when everyone is stealthy at the right time!',
      vagueComparison: {
        vagueInput: 'The party discovers a creature',
        vagueResult: 'Without STEALTHY + MIDNIGHT, the creature would have run away!',
      },
    },
  },

  // ── BOLD 1: bold ranger celebrates at dawn with treasure ──
  {
    id: 'ap2_bold_ranger_dawn_treasure',
    description: 'At dawn, a bold ranger celebrates finding treasure without checking for traps.',
    trigger: { caution: 'bold', time: 'dawn', adventurer: 'ranger', discovery: 'treasure', reaction: 'celebrate' },
    tier: 'moderate',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
          { action: 'screen_flash', color: 'pink', duration: 0.3 }, // dawn light
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'cs-center', style: 'linear' },
          { action: 'emote', character: 'ranger', emoji: '🎉' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'jump_big' },
          { action: 'spawn_rain', asset: 'coin', quantity: 10, position: 'wide' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🎉 BOLD FIND! 🎉', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎉 BOLD CELEBRATION!',
      message: "Bold + dawn means celebrating immediately! The ranger's confidence at sunrise led to an instant victory party.",
      skillTaught: 'Specificity',
      tip: 'Bold characters don\'t hesitate — they act with confidence!',
      vagueComparison: {
        vagueInput: 'The ranger finds treasure',
        vagueResult: 'Ranger might investigate or grab it carefully — but BOLD + DAWN means instant celebration in the morning light!',
      },
    },
  },

  // ── BOLD 2: bold ninja at dusk panics when creature appears ──
  {
    id: 'ap2_bold_ninja_dusk_panic',
    description: 'At dusk, a bold ninja tries to fight a creature but ends up panicking.',
    trigger: { caution: 'bold', time: 'dusk', adventurer: 'ninja', discovery: 'creature', reaction: 'panic' },
    tier: 'absolute_chaos',
    promptScore: 'funny_fail',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'bunny', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.3 }, // dusk
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_air' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ninja', to: 'cs-center', style: 'linear' },
          { action: 'animate', character: 'ninja', anim: 'sword_slash' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'cs-center' },
          { action: 'emote', character: 'ninja', emoji: '😰' },
          { action: 'react', effect: 'question-marks', position: 'cs-center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'ninja', to: 'off-left', style: 'linear' },
          { action: 'react', effect: 'smoke', position: 'cs-center' },
          { action: 'text_popup', text: '😰 TOO BOLD! 😰', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😰 BOLD BACKFIRE!',
      message: "Being bold at dusk doesn't always work! The fading light and overconfidence led to panic.",
      skillTaught: 'Specificity',
      tip: 'Sometimes bold actions need better timing — try dawn or noon!',
      vagueComparison: {
        vagueInput: 'The ninja encounters a creature',
        vagueResult: 'Ninja might approach carefully or attack — but BOLD + DUSK means overconfidence in dim light leads to comedy panic!',
      },
    },
  },

  // ── BOLD 3: bold druid at midnight casts spell on magic portal ──
  {
    id: 'ap2_bold_druid_midnight_portal',
    description: 'At midnight, a bold druid fearlessly casts a spell on a glowing magic portal.',
    trigger: { caution: 'bold', time: 'midnight', adventurer: 'druid', discovery: 'magic_portal', reaction: 'cast_spell' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'spawn', asset: 'portal', position: 'cs-center' },
          { action: 'screen_flash', color: 'darkblue', duration: 0.5 }, // midnight
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'druid', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.3 },
          { action: 'text_popup', text: '🌙 FEARLESS MAGIC! 🌙', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌙 MIDNIGHT BOLDNESS!',
      message: "Bold + midnight + druid = fearless spellcasting! The darkness didn't stop this brave nature mage.",
      skillTaught: 'Specificity',
      tip: 'Bold druids aren\'t afraid of dark magic!',
      vagueComparison: {
        vagueInput: 'The druid finds a portal',
        vagueResult: 'Druid might study it cautiously — but BOLD + MIDNIGHT means fearless spellcasting in the darkest hour!',
      },
    },
  },

  // ── CAUTIOUS 1: cautious barbarian at noon sets trap for treasure ──
  {
    id: 'ap2_cautious_barbarian_noon_trap',
    description: 'At noon, a cautious barbarian carefully sets a trap to protect treasure.',
    trigger: { caution: 'cautious', time: 'noon', adventurer: 'barbarian', discovery: 'treasure', reaction: 'set_trap' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'chest_gold', position: 'cs-center' },
          { action: 'screen_flash', color: 'yellow', duration: 0.3 }, // noon
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'barbarian', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'idle' },
          { action: 'emote', character: 'barbarian', emoji: '🤔' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'throw' },
          { action: 'spawn', asset: 'barrel', position: 'cs-left' },
          { action: 'spawn', asset: 'barrel', position: 'cs-right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'Cheering' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'text_popup', text: '🛡️ SMART DEFENSE! 🛡️', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🛡️ CAREFUL BARBARIAN!',
      message: "Cautious + noon + barbarian = a thinking warrior! Even in bright daylight, this barbarian plans ahead.",
      skillTaught: 'Specificity',
      tip: 'Cautious characters think before acting, even barbarians!',
      vagueComparison: {
        vagueInput: 'The barbarian finds treasure',
        vagueResult: 'Barbarian might just grab it and run — but CAUTIOUS + NOON means strategic trap-setting in full daylight!',
      },
    },
  },

  // ── CAUTIOUS 2: cautious rogue at midnight investigates ancient ruin ──
  {
    id: 'ap2_cautious_rogue_midnight_ruin',
    description: 'At midnight, a cautious rogue carefully investigates an ancient ruin.',
    trigger: { caution: 'cautious', time: 'midnight', adventurer: 'rogue', discovery: 'ancient_ruin', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'screen_flash', color: 'darkblue', duration: 0.5 }, // midnight
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
          { action: 'spawn', asset: 'torch', position: 'off-left' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'rogue', to: 'ds-left', style: 'linear' },
          { action: 'react', effect: 'glow-pulse', position: 'ds-left' }, // torch light
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'idle' },
          { action: 'emote', character: 'rogue', emoji: '🔍' },
          { action: 'react', effect: 'question-marks', position: 'cs-center' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'wave' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'text_popup', text: '🔍 SAFE DISCOVERY! 🔍', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🔍 MIDNIGHT INVESTIGATION!',
      message: "Cautious + midnight + rogue = careful exploration! The rogue used a torch and took their time in the darkness.",
      skillTaught: 'Specificity',
      tip: 'Cautious investigation at night needs light and patience!',
      vagueComparison: {
        vagueInput: 'The rogue explores a ruin',
        vagueResult: 'Rogue might rush in or move carefully — but CAUTIOUS + MIDNIGHT means slow, safe exploration with a torch!',
      },
    },
  },

  // ── CAUTIOUS 3: cautious whole_party at dawn has picnic ──
  {
    id: 'ap2_cautious_party_dawn_picnic',
    description: 'At dawn, the cautious whole party carefully sets up a perfect picnic.',
    trigger: { caution: 'cautious', time: 'dawn', adventurer: 'whole_party', discovery: 'enchanted_food', reaction: 'have_picnic' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
          { action: 'spawn', asset: 'cake', position: 'cs-center' },
          { action: 'screen_flash', color: 'pink', duration: 0.3 }, // dawn
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'druid', position: 'off-right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'ninja', position: 'ds-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
          { action: 'move', character: 'druid', to: 'ds-right', style: 'linear' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'idle' },
          { action: 'emote', character: 'ranger', emoji: '😊' },
          { action: 'emote', character: 'druid', emoji: '🍰' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'jump_big' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🌅 PERFECT PICNIC! 🌅', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌅 CAUTIOUS CELEBRATION!',
      message: "Cautious + dawn + whole party = everyone plans together! The morning light made the perfect picnic setup.",
      skillTaught: 'Specificity',
      tip: 'Teamwork works best when everyone is careful and thoughtful!',
      vagueComparison: {
        vagueInput: 'The party has a picnic',
        vagueResult: 'Party might rush or forget things — but CAUTIOUS + DAWN means perfectly organized morning celebration!',
      },
    },
  },

  // ── STEALTHY 3: stealthy ranger at noon investigates glowing plant ──
  {
    id: 'ap2_stealthy_ranger_noon_plant',
    description: 'At noon, a stealthy ranger quietly approaches a glowing plant despite bright sunlight.',
    trigger: { caution: 'stealthy', time: 'noon', adventurer: 'ranger', discovery: 'glowing_plant', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-center' },
          { action: 'screen_flash', color: 'yellow', duration: 0.3 }, // noon
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'idle' },
          { action: 'emote', character: 'ranger', emoji: '👀' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'taunt' },
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
          { action: 'text_popup', text: '🌞 Quiet in Sunlight! 🌞', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌞 STEALTHY NOON!',
      message: "Stealthy at noon is harder — bright sunlight makes hiding tough! But the ranger tried anyway.",
      skillTaught: 'Specificity',
      tip: 'Stealth works better at dusk or midnight when shadows help!',
      vagueComparison: {
        vagueInput: 'The ranger investigates a plant',
        vagueResult: 'Ranger might approach normally — but STEALTHY + NOON means trying to sneak in bright daylight, which is tricky!',
      },
    },
  },

  // ── RECKLESS 4: reckless rogue at midnight grabs treasure from creature ──
  {
    id: 'ap2_reckless_rogue_midnight_creature',
    description: 'At midnight, a reckless rogue steals treasure from a sleeping creature.',
    trigger: { caution: 'reckless', time: 'midnight', adventurer: 'rogue', discovery: 'creature', reaction: 'celebrate' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'bunny', position: 'cs-center' },
          { action: 'spawn', asset: 'chest_gold', position: 'cs-left' },
          { action: 'screen_flash', color: 'darkblue', duration: 0.5 }, // midnight
          { action: 'emote', character: 'bunny', emoji: '💤' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'off-right', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'rogue', to: 'cs-left', style: 'linear' },
          { action: 'emote', character: 'rogue', emoji: '😈' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'throw' },
          { action: 'spawn_rain', asset: 'coin', quantity: 8, position: 'wide' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'cs-center' },
          { action: 'move', character: 'rogue', to: 'off-right', style: 'linear' },
          { action: 'react', effect: 'smoke', position: 'cs-center' },
          { action: 'text_popup', text: '😈 RISKY HEIST! 😈', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😈 MIDNIGHT CHAOS!',
      message: "Reckless + midnight + rogue = bold theft! The rogue grabbed treasure in the dark and ran before the creature woke up!",
      skillTaught: 'Specificity',
      tip: 'Reckless works sometimes, but stealthy is safer for rogues!',
      vagueComparison: {
        vagueInput: 'The rogue finds a creature',
        vagueResult: 'Rogue might sneak or observe — but RECKLESS + MIDNIGHT means grab treasure and run in darkness!',
      },
    },
  },

  // ── BOLD 4: bold whole_party at dawn discovers magic portal together ──
  {
    id: 'ap2_bold_party_dawn_portal',
    description: 'At dawn, the bold whole party rushes into a magic portal together.',
    trigger: { caution: 'bold', time: 'dawn', adventurer: 'whole_party', discovery: 'magic_portal', reaction: 'investigate' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'spawn', asset: 'portal', position: 'cs-center' },
          { action: 'screen_flash', color: 'pink', duration: 0.3 }, // dawn
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'barbarian', position: 'off-right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'mage', position: 'ds-left', anim: 'spawn_air' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'cs-center', style: 'linear' },
          { action: 'move', character: 'barbarian', to: 'cs-center', style: 'linear' },
          { action: 'move', character: 'mage', to: 'cs-center', style: 'arc' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.7, duration: 1.0 },
          { action: 'screen_flash', color: 'gold', duration: 0.3 },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🌅 TEAM COURAGE! 🌅', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌅 BOLD TEAMWORK!',
      message: "Bold + dawn + whole party = fearless group adventure! The morning light gave everyone courage to jump in together!",
      skillTaught: 'Specificity',
      tip: 'Bold teamwork at dawn = maximum confidence!',
      vagueComparison: {
        vagueInput: 'The party finds a portal',
        vagueResult: 'Party might debate or send one person — but BOLD + DAWN means everyone rushes in together fearlessly!',
      },
    },
  },

  // ── STEALTHY 4: stealthy barbarian at dusk sets trap quietly ──
  {
    id: 'ap2_stealthy_barbarian_dusk_trap',
    description: 'At dusk, a stealthy barbarian quietly sets a trap in the shadows.',
    trigger: { caution: 'stealthy', time: 'dusk', adventurer: 'barbarian', discovery: 'ancient_ruin', reaction: 'set_trap' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.3 }, // dusk
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'barbarian', to: 'ds-left', style: 'linear' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'idle' },
          { action: 'emote', character: 'barbarian', emoji: '🤫' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'throw' },
          { action: 'spawn', asset: 'barrel', position: 'cs-left' },
          { action: 'spawn', asset: 'rock_boulder', position: 'cs-right' },
          { action: 'react', effect: 'smoke', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'wave' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🤫 SILENT TRAP! 🤫', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤫 STEALTHY WARRIOR!',
      message: "Stealthy + dusk + barbarian = a quiet warrior! The fading light helped this barbarian move silently.",
      skillTaught: 'Specificity',
      tip: 'Even barbarians can be stealthy with the right timing!',
      vagueComparison: {
        vagueInput: 'The barbarian sets a trap',
        vagueResult: 'Barbarian might smash things loudly — but STEALTHY + DUSK means silent, careful trap placement in shadows!',
      },
    },
  },

  // ── RECKLESS 5: reckless druid at noon celebrates glowing plant ──
  {
    id: 'ap2_reckless_druid_noon_plant',
    description: 'At noon, a reckless druid rushes to celebrate finding a glowing plant without checking it.',
    trigger: { caution: 'reckless', time: 'noon', adventurer: 'druid', discovery: 'glowing_plant', reaction: 'celebrate' },
    tier: 'moderate',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'mushroom_glowing', position: 'cs-center' },
          { action: 'screen_flash', color: 'yellow', duration: 0.3 }, // noon
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'druid', to: 'cs-center', style: 'linear' },
          { action: 'emote', character: 'druid', emoji: '🤩' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'jump_big' },
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
          { action: 'text_popup', text: '🤩 INSTANT LOVE! 🤩', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'cs-center' },
          { action: 'animate', character: 'druid', anim: 'get_hit' },
          { action: 'text_popup', text: '✨ Oops! Magic spores! ✨', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤩 RECKLESS BOTANIST!',
      message: "Reckless + noon + druid = celebrating too soon! The bright sunlight made the druid too excited to check the plant first.",
      skillTaught: 'Specificity',
      tip: 'Even nature lovers should investigate before celebrating!',
      vagueComparison: {
        vagueInput: 'The druid finds a glowing plant',
        vagueResult: 'Druid might study it carefully — but RECKLESS + NOON means instant excitement leads to magic spores!',
      },
    },
  },

  // ── BOLD 5: bold rogue at dusk investigates enchanted food ──
  {
    id: 'ap2_bold_rogue_dusk_food',
    description: 'At dusk, a bold rogue just eats enchanted food without checking it first.',
    trigger: { caution: 'bold', time: 'dusk', adventurer: 'rogue', discovery: 'enchanted_food', reaction: 'investigate' },
    tier: 'moderate',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
          { action: 'spawn', asset: 'burger', position: 'cs-center' },
          { action: 'screen_flash', color: 'purple', duration: 0.3 }, // dusk
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'move', character: 'rogue', to: 'cs-center', style: 'linear' },
          { action: 'emote', character: 'rogue', emoji: '😋' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'idle' },
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.6,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'Cheering' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'text_popup', text: '😋 LUCKY! 😋', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😋 BOLD EATING!',
      message: "Bold + dusk + rogue = eat first, ask questions later! The dimming light didn't slow this hungry rogue down.",
      skillTaught: 'Specificity',
      tip: 'Bold actions can work out... but cautious is safer with magic food!',
      vagueComparison: {
        vagueInput: 'The rogue finds enchanted food',
        vagueResult: 'Rogue might examine it carefully — but BOLD + DUSK means just eating it immediately, luckily it was delicious!',
      },
    },
  },

];


export const ADVENTURERS_PICNIC_DEFAULT_2: Vignette = {
  id: 'adventurers_picnic_default_2',
  description: 'A vague adventure with no details about timing or caution.',
  trigger: { caution: '*', time: '*', adventurer: '*', discovery: '*', reaction: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
      ],
      delayAfter: 0.3,
    },
    {
      parallel: [
        { action: 'move', character: 'ranger', to: 'ds-center', style: 'linear' },
      ],
      delayAfter: 0.4,
    },
    {
      parallel: [
        { action: 'animate', character: 'ranger', anim: 'idle' },
        { action: 'emote', character: 'ranger', emoji: '🤷' },
        { action: 'react', effect: 'question-marks', position: 'center' },
        { action: 'text_popup', text: '...what now?', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🤷 Vague Adventure...',
    message: "Something happened... but WHEN? HOW careful were they? Add timing and caution for a clearer story!",
    skillTaught: 'Specificity',
    tip: "Try adding CAUTION (reckless/stealthy) and TIME (dawn/midnight) to see how they change the scene!",
    vagueComparison: {
      vagueInput: 'An adventurer discovers something',
      vagueResult: 'That could be ANYTHING! Specificity brings the story to life.',
    },
  },
};

// ─── STAGE 3 VIGNETTES (Combo Thinking — secret combos) ────────────────────

export const ADVENTURERS_PICNIC_STAGE_3: Vignette[] = [

  // ── SECRET 1: investigate + cast_spell = Arcane Discovery ──
  {
    id: 'ap3_investigate_spell_discovery',
    description: 'The party investigates and casts spells together — revealing hidden ancient runes.',
    trigger: { skill1: 'investigate', skill2: 'cast_spell', terrain: '*', weather: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'stone_circle', position: 'cs-center' },
          { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_air' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
          { action: 'move', character: 'mage', to: 'ds-right', style: 'linear' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'idle' },
          { action: 'emote', character: 'ranger', emoji: '🔍' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.5, duration: 1.2 },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'screen_flash', color: 'blue', duration: 0.3 },
          { action: 'text_popup', text: '📜 ARCANE DISCOVERY! 📜', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'taunt' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '📜 SECRET: ARCANE DISCOVERY!',
      message: 'Investigate + Cast Spell = Arcane Discovery! Research plus magic reveals ancient secrets!',
      skillTaught: 'Combo Thinking',
      tip: 'Some skills work better together! What other combos can you find?',
    },
  },

  // ── SECRET 2: set_trap + celebrate = Party Trap ──
  {
    id: 'ap3_trap_celebrate_party',
    description: 'Setting traps while celebrating creates a hilarious chain reaction of fun traps.',
    trigger: { skill1: 'set_trap', skill2: 'celebrate', terrain: '*', weather: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
          { action: 'spawn_character', character: 'rogue', position: 'off-left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'ranger', position: 'off-right', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'rogue', to: 'ds-left', style: 'linear' },
          { action: 'move', character: 'ranger', to: 'ds-right', style: 'linear' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'throw' },
          { action: 'spawn', asset: 'flag', position: 'cs-left' },
          { action: 'spawn', asset: 'flag', position: 'cs-right' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'wave' },
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
          { action: 'react', effect: 'confetti-burst', position: 'cs-right' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.8 },
          { action: 'text_popup', text: '🎉 PARTY TRAP! 🎉', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'jump_big' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎉 SECRET: PARTY TRAP!',
      message: 'Set Trap + Celebrate = Party Trap! Celebration triggers a chain of fun explosions!',
      skillTaught: 'Combo Thinking',
      tip: 'Mixing fun with danger creates hilarious chaos!',
    },
  },

  // ── SECRET 3: panic + have_picnic = Panic Picnic ──
  {
    id: 'ap3_panic_picnic_chaos',
    description: 'Panicking while eating creates a hilarious mess.',
    trigger: { skill1: 'panic', skill2: 'have_picnic', terrain: '*', weather: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
          { action: 'spawn', asset: 'cake', position: 'cs-center' },
          { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'barbarian', to: 'ds-center', style: 'linear' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'get_hit' },
          { action: 'emote', character: 'barbarian', emoji: '😱' },
          { action: 'react', effect: 'stars-spin', position: 'ds-center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'spawn_rain', asset: 'burger', quantity: 8, position: 'wide' },
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'camera_shake', intensity: 0.7, duration: 1.0 },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'react', effect: 'laugh-tears', position: 'center' },
          { action: 'text_popup', text: '😱🧺 PANIC PICNIC! 🧺😱', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😱🧺 SECRET: PANIC PICNIC!',
      message: 'Panic + Have Picnic = Panic Picnic! Eating while panicking = food flying everywhere!',
      skillTaught: 'Combo Thinking',
      tip: 'Some combos are just pure chaos — and that\'s hilarious!',
    },
  },

  // ── SECRET 4: cast_spell + set_trap = Enchanted Trap ──
  {
    id: 'ap3_spell_trap_enchanted',
    description: 'Magic traps with sparkle effects guard the forest.',
    trigger: { skill1: 'cast_spell', skill2: 'set_trap', terrain: '*', weather: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'tree_oak', position: 'cs-left' },
          { action: 'spawn', asset: 'tree_oak', position: 'cs-right' },
          { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'ranger', position: 'off-right', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'mage', to: 'ds-left', style: 'linear' },
          { action: 'move', character: 'ranger', to: 'ds-right', style: 'linear' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ranger', anim: 'throw' },
          { action: 'spawn', asset: 'flag', position: 'cs-center' },
          { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '✨🪤 ENCHANTED TRAP! 🪤✨', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '✨🪤 SECRET: ENCHANTED TRAP!',
      message: 'Cast Spell + Set Trap = Enchanted Trap! Magical traps with sparkle effects!',
      skillTaught: 'Combo Thinking',
      tip: 'Magic makes everything better — even traps!',
    },
  },

  // ── SECRET 5: investigate + have_picnic = Scholarly Feast ──
  {
    id: 'ap3_investigate_picnic_feast',
    description: 'Eating while studying ancient texts — the ultimate scholar move.',
    trigger: { skill1: 'investigate', skill2: 'have_picnic', terrain: '*', weather: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
          { action: 'spawn', asset: 'cake', position: 'cs-center' },
          { action: 'spawn', asset: 'stone_circle', position: 'cs-right' },
          { action: 'spawn_character', character: 'druid', position: 'off-left', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'druid', to: 'ds-center', style: 'linear' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'idle' },
          { action: 'emote', character: 'druid', emoji: '📖' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'druid', anim: 'taunt' },
          { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '📖🧺 SCHOLARLY FEAST! 🧺📖', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '📖🧺 SECRET: SCHOLARLY FEAST!',
      message: 'Investigate + Have Picnic = Scholarly Feast! Eating while studying ancient wisdom!',
      skillTaught: 'Combo Thinking',
      tip: 'Multitasking like a true scholar!',
    },
  },

  // ── SECRET 6: celebrate + panic = Celebration Panic ──
  {
    id: 'ap3_celebrate_panic_chaos',
    description: 'Joy and terror at the same time — maximum chaos energy.',
    trigger: { skill1: 'celebrate', skill2: 'panic', terrain: '*', weather: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
          { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'clown', position: 'off-right', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'move', character: 'barbarian', to: 'ds-left', style: 'bounce' },
          { action: 'move', character: 'clown', to: 'ds-right', style: 'bounce' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'wave' },
          { action: 'react', effect: 'sparkle-magic', position: 'ds-left' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'get_hit' },
          { action: 'emote', character: 'clown', emoji: '😱' },
          { action: 'react', effect: 'stars-spin', position: 'ds-right' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'jump_small' },
          { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
          { action: 'react', effect: 'laugh-tears', position: 'center' },
          { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
          { action: 'text_popup', text: '🎉😱 CELEBRATION PANIC! 😱🎉', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎉😱 SECRET: CELEBRATION PANIC!',
      message: 'Celebrate + Panic = Celebration Panic! Joy and terror happening at the same time!',
      skillTaught: 'Combo Thinking',
      tip: 'Sometimes the best moments are complete chaos!',
    },
  },

];

export const ADVENTURERS_PICNIC_DEFAULT_3: Vignette = {
  id: 'adventurers_picnic_default_3',
  description: 'The party tries skills together but no secret combo discovered.',
  trigger: { skill1: '*', skill2: '*', terrain: '*', weather: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'picnic_blanket', position: 'cs-center' },
        { action: 'spawn_character', character: 'ranger', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'druid', position: 'off-right', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'move', character: 'ranger', to: 'ds-left', style: 'linear' },
        { action: 'move', character: 'druid', to: 'ds-right', style: 'linear' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'idle' },
        { action: 'emote', character: 'ranger', emoji: '🤷' },
        { action: 'react', effect: 'question-marks', position: 'center' },
      ],
      delayAfter: 0.8,
    },
    {
      parallel: [
        { action: 'text_popup', text: '...try a different combo?', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🤷 No Secret Combo...',
    message: "The party worked together, but no secret combo unlocked! Try different skill combinations!",
    skillTaught: 'Combo Thinking',
    tip: "Look for skills that go together naturally — like investigate + cast_spell, or panic + have_picnic!",
  },
};

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const ADVENTURERS_PICNIC_DEFAULT: Vignette = {
  id: 'adventurers_picnic_default',
  description: 'Adventurers gather on a picnic blanket for a generic outdoor scene.',
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
