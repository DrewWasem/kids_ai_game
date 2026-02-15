/**
 * Dungeon Concert Quest — Vignettes for all stages.
 *
 * Stage 1: "The {HERO} tries to {ESCAPE_METHOD} past the {OBSTACLE}"
 * Stage 2: "The {HERO} tries to {STEALTH}ly {ESCAPE_METHOD} past the {OBSTACLE} at {SPEED} speed"
 * Stage 3: "Combine {METHOD1} with {METHOD2} using {ELEMENT} in the {ROOM}"
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

// Knight vignettes (6 escape methods)
const KNIGHT_VIGNETTES: Vignette[] = [
  {
    id: 'dc_knight_sneak',
    description: 'A knight tries to sneak in heavy armor making loud clanking noises.',
    trigger: { hero: 'knight', escape_method: 'sneak', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'knight', emoji: '🤫' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'walk' }, { action: 'text_popup', text: '🛡️ CLANK CLANK CLANK 🛡️', position: 'center', size: 'huge' }, { action: 'camera_shake', intensity: 0.6, duration: 1.0 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'get_hit' }, { action: 'emote', character: 'knight', emoji: '😅' }, { action: 'react', effect: 'stars-spin', position: 'center' }], delayAfter: 0.5 },
      { parallel: [{ action: 'text_popup', text: '💥 TOO LOUD! 💥', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🛡️ ARMOR TOO LOUD!',
      message: 'Knights in armor cannot sneak! The clanking gave away the position. Try fight or smash instead.',
      skillTaught: 'Specificity',
      tip: 'Match hero skills to the method. Knights are loud, not sneaky!',
    },
  },
  {
    id: 'dc_knight_fight',
    description: 'A knight charges into battle with sword raised.',
    trigger: { hero: 'knight', escape_method: 'fight', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'pillar_stone', position: 'left' }, { action: 'spawn', asset: 'pillar_stone', position: 'right' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'knight', emoji: '⚔️' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'sword_slash' }, { action: 'text_popup', text: '⚔️ FOR HONOR! ⚔️', position: 'top', size: 'huge' }, { action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'camera_shake', intensity: 0.7, duration: 0.8 }, { action: 'react', effect: 'stars-spin', position: 'center' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'Cheering' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'text_popup', text: '🏆 VICTORY! 🏆', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ HONORABLE COMBAT!',
      message: 'The knight fought bravely! Knights excel at direct combat. Perfect hero-method match!',
      skillTaught: 'Specificity',
      tip: 'Knights are built for fighting. Use their strengths!',
    },
  },
  {
    id: 'dc_knight_magic',
    description: 'A knight tries to cast a spell but only knows sword swings.',
    trigger: { hero: 'knight', escape_method: 'magic', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'knight', emoji: '🪄' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'cast_spell' }, { action: 'text_popup', text: '✨ ABRA...CA... ✨', position: 'center', size: 'large' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'question-marks', position: 'center' }, { action: 'emote', character: 'knight', emoji: '❓' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'idle' }, { action: 'text_popup', text: '🤷 NO MAGIC! 🤷', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪄 NOT A SPELLCASTER!',
      message: 'Knights cannot cast spells! They need a mage for magic. Wrong hero for this method.',
      skillTaught: 'Specificity',
      tip: 'Use mage for magic, knight for fighting!',
    },
  },
  {
    id: 'dc_knight_lockpick',
    description: 'A knight tries to pick a lock with their giant gauntlets.',
    trigger: { hero: 'knight', escape_method: 'lockpick', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'door_iron', position: 'center' }, { action: 'spawn', asset: 'lock', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'knight', emoji: '🔑' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'interact' }, { action: 'text_popup', text: '🔓 PICKING... 🔓', position: 'center', size: 'large' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'text_popup', text: '🔨 GAUNTLET TOO BIG! 🔨', position: 'center', size: 'huge' }, { action: 'camera_shake', intensity: 0.5, duration: 0.5 }, { action: 'sfx', sound: 'fail' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'idle' }, { action: 'emote', character: 'knight', emoji: '😬' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔨 GAUNTLETS TOO BIG!',
      message: 'Knight gauntlets are too clumsy for lockpicking! Need a rogue with nimble fingers.',
      skillTaught: 'Specificity',
      tip: 'Use rogue for lockpicking, not knight!',
    },
  },
  {
    id: 'dc_knight_distract',
    description: 'A knight creates a loud distraction by banging their sword on their shield.',
    trigger: { hero: 'knight', escape_method: 'distract', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'knight', emoji: '🛡️' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'sword_slash' }, { action: 'text_popup', text: '🛡️ CLANG CLANG! 🛡️', position: 'center', size: 'huge' }, { action: 'camera_shake', intensity: 0.7, duration: 1.0 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'text_popup', text: '💥 LOUD DISTRACTION! 💥', position: 'center', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'wave' }, { action: 'react', effect: 'glow-pulse', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🛡️ LOUD DISTRACTION!',
      message: 'The knight created a distraction, but it was TOO loud! Subtle distractions work better.',
      skillTaught: 'Specificity',
      tip: 'Knights can distract, but they are very loud about it!',
    },
  },
  {
    id: 'dc_knight_smash',
    description: 'A knight smashes through obstacles with brute force.',
    trigger: { hero: 'knight', escape_method: 'smash', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'crate_wood', position: 'center' }, { action: 'spawn', asset: 'barrel', position: 'right' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'knight', emoji: '💪' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'spin_attack' }, { action: 'text_popup', text: '💥 SMASH! 💥', position: 'top', size: 'huge' }, { action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'camera_shake', intensity: 0.8, duration: 0.8 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'right' }, { action: 'screen_flash', color: 'orange', duration: 0.2 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'taunt' }, { action: 'react', effect: 'hearts-float', position: 'center' }, { action: 'text_popup', text: '🏆 SMASHED THROUGH! 🏆', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 KNIGHT SMASH!',
      message: 'The knight smashed through the obstacle! Knights are great at breaking things with force.',
      skillTaught: 'Specificity',
      tip: 'Knights excel at smashing obstacles!',
    },
  },
];

// Mage vignettes (6 escape methods)
const MAGE_VIGNETTES: Vignette[] = [
  {
    id: 'dc_mage_sneak',
    description: 'A mage tries to sneak but their glowing staff gives them away.',
    trigger: { hero: 'mage', escape_method: 'sneak', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'mage', emoji: '🤫' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'walk' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'react', effect: 'glow-pulse', position: 'left' }, { action: 'text_popup', text: '✨ GLOWING STAFF ✨', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'get_hit' }, { action: 'emote', character: 'mage', emoji: '😅' }, { action: 'text_popup', text: '💡 TOO BRIGHT! 💡', position: 'center', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '✨ GLOWING STAFF!',
      message: 'The mage staff glows in the dark! Cannot sneak with a magical nightlight. Try magic instead.',
      skillTaught: 'Specificity',
      tip: 'Mages are magical, not sneaky. Use their spells!',
    },
  },
  {
    id: 'dc_mage_fight',
    description: 'A mage tries to fight hand-to-hand but is too frail.',
    trigger: { hero: 'mage', escape_method: 'fight', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'pillar_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'mage', emoji: '💪' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'throw' }, { action: 'text_popup', text: '👊 WEAK PUNCH! 👊', position: 'center', size: 'large' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'get_hit' }, { action: 'emote', character: 'mage', emoji: '😵' }, { action: 'react', effect: 'stars-spin', position: 'left' }, { action: 'text_popup', text: '💫 TOO WEAK! 💫', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💪 TOO FRAIL!',
      message: 'Mages are not built for hand-to-hand combat! Use magic instead of fists.',
      skillTaught: 'Specificity',
      tip: 'Mages fight with spells, not swords!',
    },
  },
  {
    id: 'dc_mage_magic',
    description: 'A mage casts powerful spells with spectacular results.',
    trigger: { hero: 'mage', escape_method: 'magic', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'mage', emoji: '🪄' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'cast_long' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'text_popup', text: '🪄 ARCANE POWER! 🪄', position: 'top', size: 'huge' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'screen_flash', color: 'purple', duration: 0.3 }, { action: 'camera_shake', intensity: 0.6, duration: 0.8 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'jump_big' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'text_popup', text: '✨ SPELL SUCCESS! ✨', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪄 ARCANE MASTER!',
      message: 'The mage cast a powerful spell! Perfect match: mages excel at magic.',
      skillTaught: 'Specificity',
      tip: 'Mages are the masters of magic!',
    },
  },
  {
    id: 'dc_mage_lockpick',
    description: 'A mage tries to pick a lock with magic but casts the wrong spell.',
    trigger: { hero: 'mage', escape_method: 'lockpick', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'door_iron', position: 'center' }, { action: 'spawn', asset: 'lock', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'mage', emoji: '🔓' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'cast_spell' }, { action: 'text_popup', text: '🔮 UNLOCK SPELL! 🔮', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'text_popup', text: '💥 LOCK EXPLODES! 💥', position: 'center', size: 'huge' }, { action: 'camera_shake', intensity: 0.7, duration: 0.8 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'idle' }, { action: 'emote', character: 'mage', emoji: '😬' }, { action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 WRONG SPELL!',
      message: 'The mage used too much magic and exploded the lock! Lockpicking needs finesse, not explosions.',
      skillTaught: 'Specificity',
      tip: 'Magic can open locks, but subtlety is needed. Try rogue for lockpicking!',
    },
  },
  {
    id: 'dc_mage_distract',
    description: 'A mage creates magical illusions to distract enemies.',
    trigger: { hero: 'mage', escape_method: 'distract', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'mage', emoji: '🎭' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'cast_spell' }, { action: 'text_popup', text: '🎪 ILLUSION SPELL! 🎪', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'hearts-float', position: 'right' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'text_popup', text: '✨ MAGICAL DISTRACTION! ✨', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'Cheering' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎭 ILLUSION SUCCESS!',
      message: 'The mage created magical illusions to distract! Mages are great at distractions with spells.',
      skillTaught: 'Specificity',
      tip: 'Mages can create magical distractions!',
    },
  },
  {
    id: 'dc_mage_smash',
    description: 'A mage tries to smash with their staff but is too weak.',
    trigger: { hero: 'mage', escape_method: 'smash', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'crate_wood', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'mage', emoji: '💪' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'throw' }, { action: 'text_popup', text: '🪄 WEAK HIT! 🪄', position: 'center', size: 'large' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'animate', character: 'mage', anim: 'get_hit' }, { action: 'emote', character: 'mage', emoji: '😓' }, { action: 'text_popup', text: '💫 NO STRENGTH! 💫', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💪 TOO WEAK!',
      message: 'Mages lack the strength to smash things! Use magic spells, not physical force.',
      skillTaught: 'Specificity',
      tip: 'Mages use magic, not muscles!',
    },
  },
];

// Rogue vignettes (6 escape methods)
const ROGUE_VIGNETTES: Vignette[] = [
  {
    id: 'dc_rogue_sneak',
    description: 'A rogue sneaks silently through shadows.',
    trigger: { hero: 'rogue', escape_method: 'sneak', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'spawn', asset: 'torch_wall', position: 'right' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'rogue', emoji: '🤫' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'walk' }, { action: 'text_popup', text: '👤 SILENT STEPS... 👤', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }], delayAfter: 0.6 },
      { parallel: [{ action: 'emote', character: 'rogue', emoji: '😌' }, { action: 'text_popup', text: '✅ UNDETECTED! ✅', position: 'center', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'taunt' }, { action: 'react', effect: 'hearts-float', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '👤 STEALTH MASTER!',
      message: 'The rogue snuck perfectly! Rogues are built for sneaking in shadows.',
      skillTaught: 'Specificity',
      tip: 'Rogues excel at stealth and sneaking!',
    },
  },
  {
    id: 'dc_rogue_fight',
    description: 'A rogue fights with quick dagger strikes.',
    trigger: { hero: 'rogue', escape_method: 'fight', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'pillar_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'rogue', emoji: '🗡️' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'throw' }, { action: 'text_popup', text: '🗡️ QUICK STRIKES! 🗡️', position: 'center', size: 'large' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'camera_shake', intensity: 0.5, duration: 0.6 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'jump_big' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🗡️ QUICK COMBAT!',
      message: 'The rogue fought with quick strikes! Rogues prefer stealth, but can fight in a pinch.',
      skillTaught: 'Specificity',
      tip: 'Rogues can fight, but sneaking is their strength!',
    },
  },
  {
    id: 'dc_rogue_magic',
    description: 'A rogue tries to cast a spell but has no magical training.',
    trigger: { hero: 'rogue', escape_method: 'magic', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'rogue', emoji: '🪄' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'cast_spell' }, { action: 'text_popup', text: '✨ UH... MAGIC? ✨', position: 'center', size: 'large' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'question-marks', position: 'center' }, { action: 'emote', character: 'rogue', emoji: '❓' }, { action: 'text_popup', text: '🤷 NO MAGIC! 🤷', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪄 NOT A MAGE!',
      message: 'Rogues cannot cast spells! They use stealth and lockpicks, not magic.',
      skillTaught: 'Specificity',
      tip: 'Use mage for magic, rogue for stealth!',
    },
  },
  {
    id: 'dc_rogue_lockpick',
    description: 'A rogue expertly picks a lock with precision tools.',
    trigger: { hero: 'rogue', escape_method: 'lockpick', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'door_iron', position: 'center' }, { action: 'spawn', asset: 'lock', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'rogue', emoji: '🗝️' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'interact' }, { action: 'text_popup', text: '🔓 EXPERT PICKING... 🔓', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'text_popup', text: '✨ CLICK! ✨', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'Cheering' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'text_popup', text: '🗝️ LOCK OPENED! 🗝️', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🗝️ LOCKPICK EXPERT!',
      message: 'The rogue picked the lock perfectly! Rogues are masters of lockpicking.',
      skillTaught: 'Specificity',
      tip: 'Rogues are THE best at lockpicking!',
    },
  },
  {
    id: 'dc_rogue_distract',
    description: 'A rogue throws a coin to create a distraction.',
    trigger: { hero: 'rogue', escape_method: 'distract', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'rogue', emoji: '🪙' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'throw' }, { action: 'text_popup', text: '🪙 COIN TOSS! 🪙', position: 'top', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'right' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'text_popup', text: '✨ DISTRACTION! ✨', position: 'right', size: 'large' }, { action: 'react', effect: 'stars-spin', position: 'right' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'wave' }, { action: 'react', effect: 'glow-pulse', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪙 CLEVER DISTRACTION!',
      message: 'The rogue created a subtle distraction! Rogues are excellent at misdirection.',
      skillTaught: 'Specificity',
      tip: 'Rogues use clever tricks to distract!',
    },
  },
  {
    id: 'dc_rogue_smash',
    description: 'A rogue tries to smash but is too weak.',
    trigger: { hero: 'rogue', escape_method: 'smash', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'crate_wood', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'rogue', emoji: '💪' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'throw' }, { action: 'text_popup', text: '🗡️ WEAK HIT! 🗡️', position: 'center', size: 'large' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'idle' }, { action: 'emote', character: 'rogue', emoji: '😬' }, { action: 'text_popup', text: '💪 NOT STRONG ENOUGH! 💪', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💪 TOO WEAK!',
      message: 'Rogues lack the strength to smash! Use stealth or lockpicking instead.',
      skillTaught: 'Specificity',
      tip: 'Rogues are nimble, not strong. Try sneak or lockpick!',
    },
  },
];

// Skeleton vignettes (6 escape methods)
const SKELETON_VIGNETTES: Vignette[] = [
  {
    id: 'dc_skeleton_sneak',
    description: 'A skeleton tries to sneak but their bones rattle loudly.',
    trigger: { hero: 'skeleton', escape_method: 'sneak', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'skeleton_warrior', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'skeleton_warrior', emoji: '🤫' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'walk' }, { action: 'text_popup', text: '💀 RATTLE RATTLE RATTLE 💀', position: 'center', size: 'huge' }, { action: 'camera_shake', intensity: 0.5, duration: 1.0 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'emote', character: 'skeleton_warrior', emoji: '😅' }, { action: 'text_popup', text: '🦴 TOO NOISY! 🦴', position: 'center', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💀 RATTLING BONES!',
      message: 'Skeleton bones rattle too loudly for sneaking! Try a different approach.',
      skillTaught: 'Specificity',
      tip: 'Skeletons are noisy! Pick a method that fits their nature.',
    },
  },
  {
    id: 'dc_skeleton_fight',
    description: 'A skeleton warrior fights with spinning bone attacks.',
    trigger: { hero: 'skeleton', escape_method: 'fight', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'pillar_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'skeleton_warrior', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'skeleton_warrior', emoji: '⚔️' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' }, { action: 'text_popup', text: '💀 BONE ATTACK! 💀', position: 'top', size: 'huge' }, { action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'camera_shake', intensity: 0.7, duration: 0.8 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'stars-spin', position: 'center' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'taunt' }, { action: 'react', effect: 'hearts-float', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💀 BONE WARRIOR!',
      message: 'The skeleton fought well! Skeletons are natural fighters.',
      skillTaught: 'Specificity',
      tip: 'Skeletons excel at combat!',
    },
  },
  {
    id: 'dc_skeleton_magic',
    description: 'A skeleton tries dark magic but their bones fall apart.',
    trigger: { hero: 'skeleton', escape_method: 'magic', obstacle: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'skeleton_warrior', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'skeleton_warrior', emoji: '🪄' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'cast_spell' }, { action: 'text_popup', text: '💀 DARK MAGIC! 💀', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'left' }, { action: 'text_popup', text: '🦴 BONES FALL APART! 🦴', position: 'center', size: 'huge' }, { action: 'camera_shake', intensity: 0.6, duration: 0.8 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' }, { action: 'emote', character: 'skeleton_warrior', emoji: '😵' }, { action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🦴 BONES APART!',
      message: 'The skeleton magic was too powerful and scattered their bones! Skeletons are not mages.',
      skillTaught: 'Specificity',
      tip: 'Skeletons fight, they do not cast spells!',
    },
  },
  {
    id: 'dc_skeleton_lockpick',
    description: 'A skeleton uses their own rib bone as a lockpick.',
    trigger: { hero: 'skeleton', escape_method: 'lockpick', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'door_iron', position: 'center' }, { action: 'spawn', asset: 'lock', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'skeleton_warrior', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'skeleton_warrior', emoji: '🦴' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'interact' }, { action: 'text_popup', text: '🦴 RIB BONE LOCKPICK! 🦴', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'text_popup', text: '💀 LITERAL SKELETON KEY! 💀', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'jump_big' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💀 SKELETON KEY!',
      message: 'The skeleton used their own bone as a lockpick! Creative and hilarious!',
      skillTaught: 'Specificity',
      tip: 'Skeletons have built-in tools!',
    },
  },
  {
    id: 'dc_skeleton_distract',
    description: 'A skeleton detaches their head and tosses it as a distraction.',
    trigger: { hero: 'skeleton', escape_method: 'distract', obstacle: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'skeleton_warrior', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'skeleton_warrior', emoji: '💀' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'throw' }, { action: 'text_popup', text: '💀 HEAD TOSS! 💀', position: 'top', size: 'huge' }, { action: 'react', effect: 'explosion-cartoon', position: 'right' }, { action: 'camera_shake', intensity: 0.7, duration: 0.8 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'stars-spin', position: 'right' }, { action: 'text_popup', text: '😱 FLYING HEAD! 😱', position: 'right', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💀 FLYING HEAD!',
      message: 'The skeleton threw their own head as a distraction! Ultimate chaos!',
      skillTaught: 'Specificity',
      tip: 'Skeletons can detach parts for creative solutions!',
    },
  },
  {
    id: 'dc_skeleton_smash',
    description: 'A skeleton smashes with bone-crushing force.',
    trigger: { hero: 'skeleton', escape_method: 'smash', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'crate_wood', position: 'center' }, { action: 'spawn', asset: 'barrel', position: 'right' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'skeleton_warrior', position: 'left', anim: 'spawn_ground' }, { action: 'emote', character: 'skeleton_warrior', emoji: '💪' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' }, { action: 'text_popup', text: '💀 BONE SMASH! 💀', position: 'top', size: 'huge' }, { action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'camera_shake', intensity: 0.8, duration: 0.8 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'right' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'skeleton_warrior', anim: 'wave' }, { action: 'react', effect: 'glow-pulse', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💀 BONE CRUSHER!',
      message: 'The skeleton smashed through with bone power! Skeletons are strong fighters.',
      skillTaught: 'Specificity',
      tip: 'Skeletons are good at smashing!',
    },
  },
];

// Necromancer vignettes (6 escape methods)
const NECROMANCER_VIGNETTES: Vignette[] = [
  {
    id: 'dc_necromancer_sneak',
    description: 'A necromancer tries to sneak but summons accidental ghosts.',
    trigger: { hero: 'necromancer', escape_method: 'sneak', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'necromancer', emoji: '🤫' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'walk' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'text_popup', text: '👻 ACCIDENTAL GHOSTS! 👻', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'right' }, { action: 'emote', character: 'necromancer', emoji: '😅' }, { action: 'text_popup', text: '💀 TOO SPOOKY! 💀', position: 'center', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '👻 ACCIDENTAL SUMMON!',
      message: 'The necromancer accidentally summoned ghosts while sneaking! Too spooky to be stealthy.',
      skillTaught: 'Specificity',
      tip: 'Necromancers are magical, not sneaky!',
    },
  },
  {
    id: 'dc_necromancer_fight',
    description: 'A necromancer summons skeleton minions to fight for them.',
    trigger: { hero: 'necromancer', escape_method: 'fight', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'pillar_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'necromancer', emoji: '💀' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'cast_spell' }, { action: 'text_popup', text: '💀 RAISE MINIONS! 💀', position: 'top', size: 'huge' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'spawn_character', character: 'skeleton_minion', position: 'center', anim: 'spawn_ground' }, { action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'camera_shake', intensity: 0.7, duration: 0.8 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'taunt' }, { action: 'react', effect: 'hearts-float', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💀 SUMMONER!',
      message: 'The necromancer raised minions to fight! Necromancers summon others to do the fighting.',
      skillTaught: 'Specificity',
      tip: 'Necromancers use summoning magic!',
    },
  },
  {
    id: 'dc_necromancer_magic',
    description: 'A necromancer casts powerful dark magic spells.',
    trigger: { hero: 'necromancer', escape_method: 'magic', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'necromancer', emoji: '🪄' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'cast_long' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'text_popup', text: '🌑 DARK MAGIC! 🌑', position: 'top', size: 'huge' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'screen_flash', color: 'purple', duration: 0.3 }, { action: 'camera_shake', intensity: 0.7, duration: 0.8 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'jump_big' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🌑 DARK SORCERER!',
      message: 'The necromancer cast dark magic! Necromancers are powerful spellcasters.',
      skillTaught: 'Specificity',
      tip: 'Necromancers excel at dark magic!',
    },
  },
  {
    id: 'dc_necromancer_lockpick',
    description: 'A necromancer summons a ghost to phase through the lock.',
    trigger: { hero: 'necromancer', escape_method: 'lockpick', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'door_iron', position: 'center' }, { action: 'spawn', asset: 'lock', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'necromancer', emoji: '👻' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'cast_spell' }, { action: 'text_popup', text: '👻 SUMMON GHOST! 👻', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'text_popup', text: '💨 GHOST PHASES THROUGH! 💨', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'Cheering' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '👻 GHOST LOCKPICK!',
      message: 'The necromancer summoned a ghost to phase through! Creative magic solution!',
      skillTaught: 'Specificity',
      tip: 'Necromancers use magic, even for lockpicking!',
    },
  },
  {
    id: 'dc_necromancer_distract',
    description: 'A necromancer summons spooky spirits as a distraction.',
    trigger: { hero: 'necromancer', escape_method: 'distract', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'necromancer', emoji: '👻' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'cast_spell' }, { action: 'text_popup', text: '👻 SPOOKY SPIRITS! 👻', position: 'top', size: 'huge' }, { action: 'react', effect: 'sparkle-magic', position: 'right' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'right' }, { action: 'text_popup', text: '😱 GHOSTLY DISTRACTION! 😱', position: 'right', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'wave' }, { action: 'react', effect: 'glow-pulse', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '👻 GHOSTLY DISTRACTION!',
      message: 'The necromancer summoned spirits to distract! Perfect use of necromancy.',
      skillTaught: 'Specificity',
      tip: 'Necromancers create spooky distractions!',
    },
  },
  {
    id: 'dc_necromancer_smash',
    description: 'A necromancer tries to smash but is too weak physically.',
    trigger: { hero: 'necromancer', escape_method: 'smash', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'crate_wood', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' }, { action: 'emote', character: 'necromancer', emoji: '💪' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'throw' }, { action: 'text_popup', text: '🪄 WEAK HIT! 🪄', position: 'center', size: 'large' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'animate', character: 'necromancer', anim: 'get_hit' }, { action: 'emote', character: 'necromancer', emoji: '😓' }, { action: 'text_popup', text: '💀 TOO FRAIL! 💀', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💪 NO STRENGTH!',
      message: 'Necromancers are spellcasters, not warriors! Use magic, not muscles.',
      skillTaught: 'Specificity',
      tip: 'Necromancers use magic, not brute force!',
    },
  },
];

// Team vignettes (6 escape methods)
const TEAM_VIGNETTES: Vignette[] = [
  {
    id: 'dc_team_sneak',
    description: 'A team tries to sneak together but argues about the plan.',
    trigger: { hero: 'team', escape_method: 'sneak', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }], delayAfter: 0.4 },
      { parallel: [{ action: 'crowd_react', characters: ['knight', 'mage', 'rogue'], anim: 'idle' }, { action: 'text_popup', text: '🤫 SHHH! 🤫', position: 'top', size: 'large' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'question-marks', position: 'center' }, { action: 'text_popup', text: '❓ WHO GOES FIRST? ❓', position: 'center', size: 'huge' }, { action: 'camera_shake', intensity: 0.5, duration: 0.8 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.5 },
      { parallel: [{ action: 'text_popup', text: '💥 TOO MUCH ARGUING! 💥', position: 'center', size: 'large' }, { action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🤫 TOO MANY COOKS!',
      message: 'The team could not agree on the sneak plan! Coordination is hard in groups.',
      skillTaught: 'Specificity',
      tip: 'Teams need clear plans, not sneaking arguments!',
    },
  },
  {
    id: 'dc_team_fight',
    description: 'A team of heroes fights together with coordinated attacks.',
    trigger: { hero: 'team', escape_method: 'fight', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'pillar_stone', position: 'left' }, { action: 'spawn', asset: 'pillar_stone', position: 'right' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }], delayAfter: 0.4 },
      { parallel: [{ action: 'crowd_react', characters: ['knight', 'mage', 'rogue'], anim: 'taunt' }, { action: 'text_popup', text: '⚔️ TEAM ATTACK! ⚔️', position: 'top', size: 'huge' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'sword_slash' }, { action: 'animate', character: 'mage', anim: 'cast_spell' }, { action: 'animate', character: 'rogue', anim: 'throw' }, { action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'camera_shake', intensity: 0.9, duration: 1.5 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'taunt' }, { action: 'animate', character: 'mage', anim: 'jump_big' }, { action: 'animate', character: 'rogue', anim: 'Cheering' }, { action: 'react', effect: 'hearts-float', position: 'center' }, { action: 'text_popup', text: '🏆 TEAM VICTORY! 🏆', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ TEAM POWER!',
      message: 'The team fought together perfectly! Teams excel at coordinated combat.',
      skillTaught: 'Specificity',
      tip: 'Teams are strongest when fighting together!',
    },
  },
  {
    id: 'dc_team_magic',
    description: 'A team tries to all cast magic but only the mage knows how.',
    trigger: { hero: 'team', escape_method: 'magic', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }], delayAfter: 0.4 },
      { parallel: [{ action: 'crowd_react', characters: ['knight', 'mage', 'rogue'], anim: 'cast_spell' }, { action: 'text_popup', text: '🪄 EVERYONE CASTS! 🪄', position: 'top', size: 'large' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'react', effect: 'question-marks', position: 'left' }, { action: 'react', effect: 'question-marks', position: 'right' }, { action: 'text_popup', text: '❓ ONLY MAGE HAS MAGIC! ❓', position: 'center', size: 'huge' }], delayAfter: 0.5 },
      { parallel: [{ action: 'sfx', sound: 'fail' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪄 NOT EVERYONE IS A MAGE!',
      message: 'Only the mage can cast spells! The team needs the right hero for each task.',
      skillTaught: 'Specificity',
      tip: 'Teams need to use each member specialty!',
    },
  },
  {
    id: 'dc_team_lockpick',
    description: 'A team watches while the rogue picks the lock.',
    trigger: { hero: 'team', escape_method: 'lockpick', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'door_iron', position: 'center' }, { action: 'spawn', asset: 'lock', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'interact' }, { action: 'text_popup', text: '🔓 ROGUE PICKS... 🔓', position: 'center', size: 'large' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'emote', character: 'knight', emoji: '👀' }, { action: 'emote', character: 'mage', emoji: '👀' }, { action: 'text_popup', text: '👀 OTHERS JUST WATCH 👀', position: 'top', size: 'large' }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'rogue', anim: 'wave' }, { action: 'react', effect: 'stars-spin', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔓 ONE PERSON JOB!',
      message: 'Only the rogue picked the lock while others watched. Lockpicking is a solo task!',
      skillTaught: 'Specificity',
      tip: 'Some tasks only need one specialist, not the whole team!',
    },
  },
  {
    id: 'dc_team_distract',
    description: 'A team creates a multi-layered distraction with everyone doing something different.',
    trigger: { hero: 'team', escape_method: 'distract', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'wall_stone', position: 'center' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }], delayAfter: 0.4 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'sword_slash' }, { action: 'animate', character: 'mage', anim: 'cast_spell' }, { action: 'animate', character: 'rogue', anim: 'throw' }, { action: 'text_popup', text: '🎪 CHAOS DISTRACTION! 🎪', position: 'top', size: 'huge' }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'right' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'react', effect: 'stars-spin', position: 'left' }, { action: 'camera_shake', intensity: 0.8, duration: 1.0 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'Cheering' }, { action: 'animate', character: 'mage', anim: 'wave' }, { action: 'animate', character: 'rogue', anim: 'taunt' }, { action: 'react', effect: 'sparkle-magic', position: 'center' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎪 TEAM CHAOS!',
      message: 'The team created a huge multi-layered distraction! Teams excel at creating chaos together.',
      skillTaught: 'Specificity',
      tip: 'Teams can create spectacular distractions!',
    },
  },
  {
    id: 'dc_team_smash',
    description: 'A team smashes obstacles together with combined force.',
    trigger: { hero: 'team', escape_method: 'smash', obstacle: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [{ action: 'spawn', asset: 'crate_wood', position: 'center' }, { action: 'spawn', asset: 'barrel', position: 'right' }, { action: 'spawn', asset: 'barrel', position: 'left' }, { action: 'sfx', sound: 'spawn' }], delayAfter: 0.5 },
      { parallel: [{ action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' }, { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' }, { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' }], delayAfter: 0.4 },
      { parallel: [{ action: 'crowd_react', characters: ['knight', 'mage', 'rogue'], anim: 'spin_attack' }, { action: 'text_popup', text: '💥 TEAM SMASH! 💥', position: 'top', size: 'huge' }, { action: 'react', effect: 'explosion-cartoon', position: 'center' }, { action: 'camera_shake', intensity: 0.9, duration: 1.2 }, { action: 'sfx', sound: 'react' }], delayAfter: 0.6 },
      { parallel: [{ action: 'react', effect: 'explosion-cartoon', position: 'right' }, { action: 'react', effect: 'explosion-cartoon', position: 'left' }, { action: 'screen_flash', color: 'orange', duration: 0.3 }], delayAfter: 0.5 },
      { parallel: [{ action: 'animate', character: 'knight', anim: 'jump_big' }, { action: 'animate', character: 'mage', anim: 'taunt' }, { action: 'animate', character: 'rogue', anim: 'wave' }, { action: 'react', effect: 'glow-pulse', position: 'center' }, { action: 'text_popup', text: '🏆 DEMOLISHED! 🏆', position: 'center', size: 'huge' }, { action: 'sfx', sound: 'success' }], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 COMBINED FORCE!',
      message: 'The team smashed together with combined power! Teams multiply force.',
      skillTaught: 'Specificity',
      tip: 'Teams can smash bigger obstacles together!',
    },
  },
];

// Assemble all vignettes into PAIR_VIGNETTES array
const PAIR_VIGNETTES: Vignette[] = [
  ...KNIGHT_VIGNETTES,
  ...MAGE_VIGNETTES,
  ...ROGUE_VIGNETTES,
  ...SKELETON_VIGNETTES,
  ...NECROMANCER_VIGNETTES,
  ...TEAM_VIGNETTES,
];

// Export Stage 1 with all 36 vignettes
export const DUNGEON_CONCERT_STAGE_1: Vignette[] = PAIR_VIGNETTES;

// ─── DEFAULT VIGNETTE (Stage 1 — always works) ─────────────────────────────

export const DUNGEON_CONCERT_DEFAULT: Vignette = {
  id: 'dungeon_concert_default',
  description: 'A knight walks through a torch-lit dungeon corridor with no clear escape plan.',
  trigger: { hero: '*', escape_method: '*', obstacle: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'dungeon_wall', position: 'center' },
        { action: 'spawn', asset: 'torch_wall', position: 'left' },
        { action: 'spawn', asset: 'torch_wall', position: 'right' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'animate', character: 'knight', anim: 'walk' },
        { action: 'text_popup', text: '🏰 ESCAPE! 🏰', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🏰 Dungeon Escape!',
    message: "Someone tried to escape! But WHO was it? HOW did they try to escape? WHAT was blocking them? Fill in the details!",
    skillTaught: 'Specificity',
    tip: "Pick a hero, an escape method, and an obstacle. Each detail makes the escape more epic!",
  },
};

// ─── STAGE 2 VIGNETTES ──────────────────────────────────────────────────────
// Template: "The {HERO} tries to {STEALTH}ly {ESCAPE_METHOD} past the {OBSTACLE} at {SPEED} speed"
// STEALTH: loud, quiet, invisible, disguised
// SPEED: slow, normal, fast, instant

export const DUNGEON_CONCERT_STAGE_2: Vignette[] = [

  // ── LOUD: Alarms and chaos ──────────────────────────────────────────────────
  {
    id: 'dc2_loud_sneak_guard_fast',
    description: 'A knight loudly tries to sneak past a guard at fast speed, waking everyone in the dungeon.',
    trigger: { hero: 'knight', stealth: 'loud', escape_method: 'sneak', obstacle: 'guard', speed: 'fast' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'left' },
          { action: 'spawn', asset: 'wall_stone', position: 'right' },
          { action: 'spawn', asset: 'torch_wall', position: 'left' },
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '💤' },
          { action: 'text_popup', text: '💤 GUARD ASLEEP 💤', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'walk' },
          { action: 'react', effect: 'explosion-cartoon', position: 'left' },
          { action: 'text_popup', text: '💥 CLANK CLANK CLANK 💥', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.8, duration: 1.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'idle' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '❗' },
          { action: 'text_popup', text: '🚨 ALARM! 🚨', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'get_hit' },
          { action: 'emote', character: 'knight', emoji: '😱' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🚨 TOO LOUD!',
      message: "The knight's armor clanked so loudly the guard woke up! When you need to SNEAK, being LOUD ruins everything. Try 'quiet' or 'invisible' stealth!",
      skillTaught: 'Specificity',
      tip: "Loud sneaking = caught! Match stealth style to the escape method.",
    },
    vagueComparison: {
      vague: "The knight tries to sneak past the guard",
      specific: "The knight tries to LOUDLY sneak past the guard at FAST speed",
      difference: "Adding 'loud' and 'fast' creates comedy chaos instead of success!",
    },
  },

  {
    id: 'dc2_loud_fight_skeleton_army_normal',
    description: 'A barbarian loudly fights a skeleton army at normal speed with massive battle sounds echoing.',
    trigger: { hero: 'barbarian', stealth: 'loud', escape_method: 'fight', obstacle: 'skeleton_army', speed: 'normal' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'pillar_stone', position: 'left' },
          { action: 'spawn', asset: 'pillar_stone', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
          { action: 'spawn_character', character: 'skeleton_mage', position: 'right', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'skeleton_minion', position: 'bottom', anim: 'spawn_ground' },
          { action: 'text_popup', text: '💀 SKELETON ARMY! 💀', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '⚔️' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'text_popup', text: '💥 LOUD BATTLE CRY! 💥', position: 'center', size: 'huge' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.9, duration: 2.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' },
          { action: 'animate', character: 'skeleton_mage', anim: 'die_dramatic' },
          { action: 'animate', character: 'skeleton_minion', anim: 'die_flop' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🏆 LOUD VICTORY! 🏆', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚔️ EPIC BATTLE!',
      message: "The barbarian fought LOUDLY and defeated the skeleton army! When fighting an army, being LOUD shows dominance. Perfect specificity!",
      skillTaught: 'Specificity',
      tip: "Loud fighting against a big obstacle = spectacular victory!",
    },
    vagueComparison: {
      vague: "Someone fights the skeleton army",
      specific: "The barbarian LOUDLY fights the skeleton army at normal speed",
      difference: "Specifying 'loud' and 'normal' creates epic battle atmosphere!",
    },
  },

  {
    id: 'dc2_loud_distract_trap_slow',
    description: 'A clown loudly creates a distraction near a trap at slow speed, triggering explosions.',
    trigger: { hero: 'clown', stealth: 'loud', escape_method: 'distract', obstacle: 'trap', speed: 'slow' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'floor_stone', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'clown', emoji: '🤡' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'idle' },
          { action: 'text_popup', text: '🎪 LOUD DISTRACTION! 🎪', position: 'top', size: 'huge' },
          { action: 'react', effect: 'explosion-cartoon', position: 'left' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'right' },
          { action: 'camera_shake', intensity: 0.7, duration: 1.5 },
          { action: 'text_popup', text: '💥 TRAP TRIGGERED! 💥', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'get_hit' },
          { action: 'emote', character: 'clown', emoji: '😵' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 TRAP EXPLOSION!',
      message: "The clown's loud distraction was TOO slow and triggered the trap! Traps need quick, quiet movements. Try 'quiet' + 'fast'!",
      skillTaught: 'Specificity',
      tip: "Loud + slow near traps = disaster. Match speed and stealth to the obstacle!",
    },
    vagueComparison: {
      vague: "The clown creates a distraction",
      specific: "The clown LOUDLY distracts the trap at SLOW speed",
      difference: "Adding 'loud' and 'slow' makes the distraction backfire!",
    },
  },

  // ── INVISIBLE/DISGUISED: Stealth and surprise ───────────────────────────────
  {
    id: 'dc2_invisible_sneak_guard_quiet',
    description: 'A rogue turns invisible and quietly sneaks past a sleeping guard perfectly undetected.',
    trigger: { hero: 'rogue', stealth: 'invisible', escape_method: 'sneak', obstacle: 'guard', speed: 'normal' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'torch_wall', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '💤' },
          { action: 'text_popup', text: '💤 GUARD PATROL 💤', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '👻 INVISIBLE! 👻', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'walk' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'emote', character: 'skeleton_warrior', emoji: '💤' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'jump_big' },
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'text_popup', text: '✅ PERFECT STEALTH! ✅', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '👻 INVISIBLE SUCCESS!',
      message: "The rogue turned invisible and snuck past the guard without making a sound! Perfect WHO (rogue) + HOW (invisible sneak) + WHAT (guard). Maximum stealth!",
      skillTaught: 'Specificity',
      tip: "Invisible + sneak + guard = perfect escape!",
    },
    vagueComparison: {
      vague: "The rogue sneaks past the guard",
      specific: "The rogue INVISIBLY sneaks past the guard",
      difference: "Adding 'invisible' makes the stealth flawless!",
    },
  },

  {
    id: 'dc2_disguised_lockpick_locked_door_slow',
    description: 'A mage disguised as a guard slowly picks a lock, taking time to look natural.',
    trigger: { hero: 'mage', stealth: 'disguised', escape_method: 'lockpick', obstacle: 'locked_door', speed: 'slow' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '🎭 DISGUISED! 🎭', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'interact' },
          { action: 'emote', character: 'mage', emoji: '🔍' },
          { action: 'text_popup', text: '🔓 SLOWLY PICKING... 🔓', position: 'center', size: 'large' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'interact' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '✨ CLICK! ✨', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'Cheering' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🎭 SMOOTH ESCAPE! 🎭', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎭 DISGUISED LOCKPICK!',
      message: "The mage disguised themselves and slowly picked the lock looking natural! Taking it SLOW when disguised = believable. Great specificity!",
      skillTaught: 'Specificity',
      tip: "Disguised + slow = believable escape!",
    },
    vagueComparison: {
      vague: "The mage picks the lock",
      specific: "The mage picks the lock DISGUISED and SLOWLY",
      difference: "Adding 'disguised' and 'slow' makes the escape more clever!",
    },
  },

  {
    id: 'dc2_invisible_magic_darkness_instant',
    description: 'A necromancer instantly uses invisible magic to light up total darkness, revealing everything.',
    trigger: { hero: 'necromancer', stealth: 'invisible', escape_method: 'magic', obstacle: 'darkness', speed: 'instant' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'screen_flash', color: 'black', duration: 1.0 },
          { action: 'text_popup', text: '🌑 TOTAL DARKNESS 🌑', position: 'center', size: 'huge' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'emote', character: 'necromancer', emoji: '👻' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'necromancer', anim: 'cast_spell' },
          { action: 'text_popup', text: '✨ INSTANT LIGHT MAGIC! ✨', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'react', effect: 'stars-spin', position: 'top' },
          { action: 'screen_flash', color: 'white', duration: 0.5 },
          { action: 'text_popup', text: '💡 LET THERE BE LIGHT! 💡', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'torch_wall', position: 'left' },
          { action: 'spawn', asset: 'torch_wall', position: 'right' },
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'necromancer', anim: 'wave' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'text_popup', text: '🎉 PATH REVEALED! 🎉', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💡 INSTANT LIGHT!',
      message: "The necromancer used invisible magic to INSTANTLY light the darkness! Speed + stealth style + magic = perfect obstacle match!",
      skillTaught: 'Specificity',
      tip: "Invisible + magic + instant = powerful combo!",
    },
    vagueComparison: {
      vague: "The necromancer uses magic on the darkness",
      specific: "The necromancer uses INVISIBLE magic INSTANTLY on the darkness",
      difference: "Adding 'invisible' and 'instant' creates dramatic light reveal!",
    },
  },

  // ── SPEED-SPECIFIC: Slow = tense, Fast = action, Instant = teleport comedy ─
  {
    id: 'dc2_knight_smash_locked_door_fast',
    description: 'A knight quickly smashes through a locked door with powerful strikes.',
    trigger: { hero: 'knight', escape_method: 'smash', obstacle: 'locked_door', speed: 'fast' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'knight', emoji: '⚔️' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'text_popup', text: '💥 FAST SMASH! 💥', position: 'center', size: 'huge' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'screen_flash', color: 'orange', duration: 0.3 },
          { action: 'text_popup', text: '🚪 DOOR DESTROYED! 🚪', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'taunt' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '⚡ FAST EXIT! ⚡', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ FAST SMASH!',
      message: "The knight smashed the door FAST! Quick action on a locked door = perfect escape. Speed matters!",
      skillTaught: 'Specificity',
      tip: "Fast smashing = powerful action sequence!",
    },
    vagueComparison: {
      vague: "The knight smashes the door",
      specific: "The knight FAST smashes the door",
      difference: "Adding 'fast' creates explosive action energy!",
    },
  },

  {
    id: 'dc2_rogue_sneak_trap_slow',
    description: 'A rogue slowly and carefully sneaks past a trap, avoiding every wire.',
    trigger: { hero: 'rogue', escape_method: 'sneak', obstacle: 'trap', speed: 'slow' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'floor_stone', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'rogue', emoji: '⚠️' },
          { action: 'text_popup', text: '⚠️ TRAP AHEAD ⚠️', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'walk' },
          { action: 'emote', character: 'rogue', emoji: '🔍' },
          { action: 'text_popup', text: '🐌 SLOW AND CAREFUL... 🐌', position: 'center', size: 'large' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'idle' },
          { action: 'emote', character: 'rogue', emoji: '😌' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'jump_big' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '✅ TRAP AVOIDED! ✅', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🐌 SLOW AND SAFE!',
      message: "The rogue took it SLOW and carefully avoided the trap! Slow speed + careful sneaking = safe passage. Great specificity!",
      skillTaught: 'Specificity',
      tip: "Slow + sneak + trap = careful success!",
    },
    vagueComparison: {
      vague: "The rogue sneaks past the trap",
      specific: "The rogue SLOWLY sneaks past the trap",
      difference: "Adding 'slow' creates tension and careful movement!",
    },
  },

  {
    id: 'dc2_mage_magic_puzzle_instant',
    description: 'A mage instantly solves an ancient puzzle with a single spell blast.',
    trigger: { hero: 'mage', escape_method: 'magic', obstacle: 'puzzle', speed: 'instant' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'left' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'text_popup', text: '🧩 ANCIENT PUZZLE 🧩', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '🤔' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '⚡ INSTANT SOLVE! ⚡', position: 'center', size: 'huge' },
          { action: 'screen_flash', color: 'purple', duration: 0.2 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🎉 PUZZLE SOLVED! 🎉', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'Cheering' },
          { action: 'emote', character: 'mage', emoji: '😎' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ INSTANT SOLVE!',
      message: "The mage INSTANTLY solved the puzzle with magic! No thinking needed — pure power. Instant speed = comedy genius moment!",
      skillTaught: 'Specificity',
      tip: "Instant + magic + puzzle = big brain energy!",
    },
    vagueComparison: {
      vague: "The mage uses magic on the puzzle",
      specific: "The mage INSTANTLY uses magic on the puzzle",
      difference: "Adding 'instant' creates a funny genius moment!",
    },
  },

  // ── CROSS COMBINATIONS ──────────────────────────────────────────────────────
  {
    id: 'dc2_team_quiet_fight_skeleton_army_normal',
    description: 'A team quietly fights a skeleton army at normal speed with coordinated silent strikes.',
    trigger: { hero: 'team', stealth: 'quiet', escape_method: 'fight', obstacle: 'skeleton_army', speed: 'normal' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'pillar_stone', position: 'left' },
          { action: 'spawn', asset: 'pillar_stone', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'skeleton_mage', position: 'right', anim: 'spawn_air' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '💤' },
          { action: 'emote', character: 'skeleton_mage', emoji: '💤' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'knight', emoji: '🤫' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'animate', character: 'rogue', anim: 'throw' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' },
          { action: 'animate', character: 'skeleton_mage', anim: 'die_dramatic' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'wave' },
          { action: 'animate', character: 'mage', anim: 'taunt' },
          { action: 'animate', character: 'rogue', anim: 'jump_big' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'text_popup', text: '🤫 SILENT VICTORY! 🤫', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤫 SILENT TEAMWORK!',
      message: "The team QUIETLY fought the skeleton army without waking anyone! Quiet + teamwork + normal speed = perfect stealth combat!",
      skillTaught: 'Specificity',
      tip: "Quiet fighting is possible with teamwork!",
    },
    vagueComparison: {
      vague: "The team fights the skeleton army",
      specific: "The team QUIETLY fights the skeleton army at normal speed",
      difference: "Adding 'quiet' and 'normal' creates coordinated stealth combat!",
    },
  },

  {
    id: 'dc2_skeleton_disguised_distract_guard_fast',
    description: 'A skeleton disguised as another guard quickly distracts the real guard with confusion.',
    trigger: { hero: 'skeleton', stealth: 'disguised', escape_method: 'distract', obstacle: 'guard', speed: 'fast' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'torch_wall', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '💤' },
          { action: 'text_popup', text: '💤 GUARD ON DUTY 💤', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '🎭 DISGUISED! 🎭', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton', anim: 'idle' },
          { action: 'emote', character: 'skeleton', emoji: '👋' },
          { action: 'text_popup', text: '⚡ FAST DISTRACTION! ⚡', position: 'center', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'idle' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '❓' },
          { action: 'react', effect: 'question-marks', position: 'right' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton', anim: 'Cheering' },
          { action: 'react', effect: 'hearts-float', position: 'left' },
          { action: 'text_popup', text: '🎉 CONFUSED GUARD! 🎉', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎭 FAST DISGUISE!',
      message: "The skeleton disguised as a guard and FAST distracted the real guard! Quick disguise = confusion success!",
      skillTaught: 'Specificity',
      tip: "Disguised + fast distraction = clever escape!",
    },
    vagueComparison: {
      vague: "The skeleton distracts the guard",
      specific: "The skeleton DISGUISED distracts the guard FAST",
      difference: "Adding 'disguised' and 'fast' creates clever confusion!",
    },
  },

  {
    id: 'dc2_necromancer_quiet_magic_darkness_slow',
    description: 'A necromancer quietly and slowly uses magic to gently light the darkness without startling anyone.',
    trigger: { hero: 'necromancer', stealth: 'quiet', escape_method: 'magic', obstacle: 'darkness', speed: 'slow' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'screen_flash', color: 'black', duration: 1.0 },
          { action: 'text_popup', text: '🌑 PITCH BLACK 🌑', position: 'center', size: 'huge' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'necromancer', emoji: '🤫' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'necromancer', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '✨ QUIET GLOW... ✨', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'torch_wall', position: 'left' },
          { action: 'spawn', asset: 'torch_wall', position: 'right' },
          { action: 'react', effect: 'sparkle-magic', position: 'top' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'necromancer', anim: 'wave' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🕯️ GENTLE LIGHT! 🕯️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🕯️ GENTLE MAGIC!',
      message: "The necromancer QUIETLY and SLOWLY lit the darkness without startling anyone! Quiet + slow magic = perfect control!",
      skillTaught: 'Specificity',
      tip: "Quiet + slow + magic = careful, controlled light!",
    },
    vagueComparison: {
      vague: "The necromancer uses magic on the darkness",
      specific: "The necromancer QUIETLY and SLOWLY uses magic on the darkness",
      difference: "Adding 'quiet' and 'slow' creates gentle, controlled light!",
    },
  },

  // ── ADDITIONAL STAGE 2 COMBINATIONS ─────────────────────────────────────────

  {
    id: 'dc2_quiet_lockpick_locked_door_fast',
    description: 'A rogue quietly picks a lock at fast speed, working silently but urgently.',
    trigger: { hero: 'rogue', stealth: 'quiet', escape_method: 'lockpick', obstacle: 'locked_door', speed: 'fast' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'rogue', emoji: '🤫' },
          { action: 'text_popup', text: '🔒 LOCKED DOOR 🔒', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'interact' },
          { action: 'emote', character: 'rogue', emoji: '⚡' },
          { action: 'text_popup', text: '🤫⚡ QUIET & FAST! ⚡🤫', position: 'center', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '✨ CLICK! ✨', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'taunt' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🏆 SILENT SPEED! 🏆', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ FAST & QUIET!',
      message: "The rogue picked the lock FAST and QUIET! Urgent but silent = perfect balance. Great specificity!",
      skillTaught: 'Specificity',
      tip: "Quiet + fast lockpicking = skilled thief work!",
    },
    vagueComparison: {
      vague: "The rogue picks the lock",
      vagueResult: "Rogue fiddles with the lock",
      specific: "The rogue QUIETLY picks the lock at FAST speed",
      specificResult: "Rogue's nimble fingers work the lock silently at lightning speed!",
      why: "Speed and stealth style show mastery!",
    },
  },

  {
    id: 'dc2_loud_magic_puzzle_instant',
    description: 'A barbarian loudly uses instant magic to blast a puzzle into pieces.',
    trigger: { hero: 'barbarian', stealth: 'loud', escape_method: 'magic', obstacle: 'puzzle', speed: 'instant' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'left' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'text_popup', text: '🧩 ANCIENT PUZZLE 🧩', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '😤' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'text_popup', text: '💥 SMASH MAGIC! 💥', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 1.0, duration: 1.5 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'left' },
          { action: 'react', effect: 'explosion-cartoon', position: 'right' },
          { action: 'text_popup', text: '🧩💥 PUZZLE DESTROYED! 💥🧩', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'celebrate' },
          { action: 'emote', character: 'barbarian', emoji: '😅' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 TOO LOUD!',
      message: "The barbarian LOUDLY blasted the puzzle with instant magic! Puzzles need thinking, not explosions! Try quiet + slow instead.",
      skillTaught: 'Specificity',
      tip: "Loud + instant magic on puzzles = chaos, not solutions!",
    },
    vagueComparison: {
      vague: "The barbarian uses magic on the puzzle",
      vagueResult: "Barbarian waves hands at puzzle",
      specific: "The barbarian LOUDLY uses INSTANT magic on the puzzle",
      specificResult: "Barbarian smashes puzzle with explosive magic!",
      why: "Loud and instant turn subtle magic into chaos!",
    },
  },

  {
    id: 'dc2_invisible_fight_trap_normal',
    description: 'A knight invisibly fights a trap at normal speed, attacking unseen mechanisms.',
    trigger: { hero: 'knight', stealth: 'invisible', escape_method: 'fight', obstacle: 'trap', speed: 'normal' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'floor_stone', position: 'center' },
          { action: 'spawn', asset: 'barrel_wood', position: 'right' },
          { action: 'text_popup', text: '⚠️ TRAPPED ROOM ⚠️', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '👻 INVISIBLE! 👻', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '⚔️ INVISIBLE STRIKE! ⚔️', position: 'center', size: 'large' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '💥 TRAP DISABLED! 💥', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'jump_big' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'text_popup', text: '✅ UNSEEN VICTORY! ✅', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '👻 INVISIBLE COMBAT!',
      message: "The knight fought the trap while INVISIBLE at normal speed! The trap never saw it coming. Perfect stealth combat!",
      skillTaught: 'Specificity',
      tip: "Invisible + fight = surprise attack!",
    },
    vagueComparison: {
      vague: "The knight fights the trap",
      vagueResult: "Knight swings sword at trap",
      specific: "The knight INVISIBLY fights the trap at normal speed",
      specificResult: "Invisible knight dismantles trap mechanisms unseen!",
      why: "Invisibility makes combat strategic!",
    },
  },

  {
    id: 'dc2_disguised_smash_wall_slow',
    description: 'A skeleton disguised as a builder slowly smashes a wall, pretending to do construction work.',
    trigger: { hero: 'skeleton', stealth: 'disguised', escape_method: 'smash', obstacle: 'wall', speed: 'slow' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'pillar_stone', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '🎭 BUILDER DISGUISE! 🎭', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton', anim: 'idle' },
          { action: 'emote', character: 'skeleton', emoji: '🔨' },
          { action: 'text_popup', text: '🔨 CASUAL WORK... 🔨', position: 'center', size: 'large' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'text_popup', text: '💨 SLOW DEMOLITION 💨', position: 'center', size: 'large' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🏗️ WALL REMOVED! 🏗️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton', anim: 'Cheering' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🎭 NOBODY NOTICED! 🎭', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎭 CLEVER DISGUISE!',
      message: "The skeleton disguised as a builder and SLOWLY smashed the wall! Taking it slow made it look like normal construction work!",
      skillTaught: 'Specificity',
      tip: "Disguised + slow smashing = believable construction!",
    },
    vagueComparison: {
      vague: "The skeleton smashes the wall",
      vagueResult: "Skeleton breaks wall loudly",
      specific: "The skeleton DISGUISED smashes the wall SLOWLY",
      specificResult: "Skeleton casually demolishes wall like a worker!",
      why: "Disguise and slow pace make destruction look normal!",
    },
  },

  {
    id: 'dc2_quiet_sneak_darkness_instant',
    description: 'A mage quietly sneaks through darkness with instant teleportation.',
    trigger: { hero: 'mage', stealth: 'quiet', escape_method: 'sneak', obstacle: 'darkness', speed: 'instant' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'screen_flash', color: 'black', duration: 1.0 },
          { action: 'text_popup', text: '🌑 DARKNESS 🌑', position: 'center', size: 'huge' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '🤫' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '✨ QUIET TELEPORT ✨', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'right' },
          { action: 'text_popup', text: '⚡ INSTANT! ⚡', position: 'right', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'torch_wall', position: 'right' },
          { action: 'text_popup', text: '🎯 PERFECT ARRIVAL! 🎯', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'wave' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ INSTANT SILENCE!',
      message: "The mage QUIETLY teleported through the darkness INSTANTLY! Silent magic + instant speed = perfect stealth!",
      skillTaught: 'Specificity',
      tip: "Quiet + instant teleport = ghost-like movement!",
    },
    vagueComparison: {
      vague: "The mage sneaks through the darkness",
      vagueResult: "Mage fumbles in the dark",
      specific: "The mage QUIETLY sneaks through darkness with INSTANT teleportation",
      specificResult: "Mage silently appears on the other side!",
      why: "Quiet and instant make sneaking flawless!",
    },
  },

  {
    id: 'dc2_loud_lockpick_chest_instant',
    description: 'A barbarian loudly picks a chest lock instantly by breaking it with brute force.',
    trigger: { hero: 'barbarian', stealth: 'loud', escape_method: 'lockpick', obstacle: 'chest', speed: 'instant' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'chest_locked', position: 'center' },
          { action: 'spawn', asset: 'pillar_stone', position: 'left' },
          { action: 'text_popup', text: '📦 LOCKED CHEST 📦', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '💪' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'text_popup', text: '💥 SMASH LOCK! 💥', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.9, duration: 1.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🔓 "LOCKPICKED"! 🔓', position: 'center', size: 'huge' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'emote', character: 'barbarian', emoji: '😅' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '📦 CHEST "OPENED"! 📦', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 BRUTE FORCE!',
      message: "The barbarian LOUDLY 'picked' the lock by smashing it INSTANTLY! That's not lockpicking, that's destruction! Try quiet + slow for real picking.",
      skillTaught: 'Specificity',
      tip: "Loud + instant lockpicking = just smashing!",
    },
    vagueComparison: {
      vague: "The barbarian picks the lock",
      vagueResult: "Barbarian works on lock carefully",
      specific: "The barbarian LOUDLY picks the lock INSTANTLY",
      specificResult: "Barbarian smashes lock off with one punch!",
      why: "Loud and instant turn picking into smashing!",
    },
  },

  {
    id: 'dc2_invisible_distract_skeleton_army_slow',
    description: 'A necromancer invisibly creates slow distractions to confuse a skeleton army.',
    trigger: { hero: 'necromancer', stealth: 'invisible', escape_method: 'distract', obstacle: 'skeleton_army', speed: 'slow' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'pillar_stone', position: 'left' },
          { action: 'spawn', asset: 'pillar_stone', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'skeleton_mage', position: 'right', anim: 'spawn_air' },
          { action: 'text_popup', text: '💀 SKELETON PATROL 💀', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'necromancer', position: 'left', anim: 'spawn_air' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '👻 INVISIBLE! 👻', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'necromancer', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'top' },
          { action: 'text_popup', text: '✨ SLOW WHISPERS... ✨', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
      {
        parallel: [
          { action: 'emote', character: 'skeleton_warrior', emoji: '❓' },
          { action: 'emote', character: 'skeleton_mage', emoji: '❓' },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'necromancer', anim: 'jump_big' },
          { action: 'react', effect: 'glow-pulse', position: 'left' },
          { action: 'text_popup', text: '🎭 ARMY CONFUSED! 🎭', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '👻 INVISIBLE TRICKS!',
      message: "The necromancer stayed INVISIBLE and SLOWLY distracted the skeleton army! Slow invisible whispers = maximum confusion!",
      skillTaught: 'Specificity',
      tip: "Invisible + slow distraction = creepy confusion!",
    },
    vagueComparison: {
      vague: "The necromancer distracts the skeleton army",
      vagueResult: "Necromancer waves at skeletons",
      specific: "The necromancer INVISIBLY distracts the skeleton army SLOWLY",
      specificResult: "Invisible voice slowly drives skeletons crazy!",
      why: "Invisible and slow create psychological warfare!",
    },
  },

  {
    id: 'dc2_disguised_magic_trap_fast',
    description: 'A mage disguised as a trap inspector quickly uses magic to disable traps.',
    trigger: { hero: 'mage', stealth: 'disguised', escape_method: 'magic', obstacle: 'trap', speed: 'fast' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'floor_stone', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'text_popup', text: '⚠️ TRAP ZONE ⚠️', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '🎭 INSPECTOR DISGUISE! 🎭', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'emote', character: 'mage', emoji: '⚡' },
          { action: 'text_popup', text: '✨⚡ FAST DISABLE! ⚡✨', position: 'center', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'text_popup', text: '💫 TRAP NEUTRALIZED! 💫', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'Cheering' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🎭 OFFICIAL WORK DONE! 🎭', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎭 FAST INSPECTOR!',
      message: "The mage disguised as a trap inspector and FAST disabled it with magic! Looking official + working fast = no suspicion!",
      skillTaught: 'Specificity',
      tip: "Disguised + fast magic = efficient professional!",
    },
    vagueComparison: {
      vague: "The mage uses magic on the trap",
      vagueResult: "Mage waves wand at trap slowly",
      specific: "The mage DISGUISED uses magic on the trap FAST",
      specificResult: "Inspector mage swiftly neutralizes trap officially!",
      why: "Disguise makes fast action look professional!",
    },
  },

  {
    id: 'dc2_quiet_smash_puzzle_normal',
    description: 'A knight quietly smashes a puzzle at normal speed, carefully breaking it without noise.',
    trigger: { hero: 'knight', stealth: 'quiet', escape_method: 'smash', obstacle: 'puzzle', speed: 'normal' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'left' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'text_popup', text: '🧩 PUZZLE LOCK 🧩', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'knight', emoji: '🤔' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'emote', character: 'knight', emoji: '🤫' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'text_popup', text: '🤫💥 QUIET SMASH? 💥🤫', position: 'center', size: 'large' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🧩❌ PUZZLE BROKEN! ❌🧩', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'get_hit' },
          { action: 'emote', character: 'knight', emoji: '😅' },
          { action: 'react', effect: 'question-marks', position: 'left' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🧩 WRONG APPROACH!',
      message: "The knight tried to QUIETLY smash the puzzle... but puzzles need solving, not smashing! Try magic or lockpick instead.",
      skillTaught: 'Specificity',
      tip: "Smashing puzzles = broken pieces, not solutions!",
    },
    vagueComparison: {
      vague: "The knight approaches the puzzle",
      vagueResult: "Knight looks at puzzle confused",
      specific: "The knight QUIETLY smashes the puzzle at normal speed",
      specificResult: "Knight carefully breaks puzzle into quiet pieces!",
      why: "Wrong method for the obstacle = failure!",
    },
  },

  {
    id: 'dc2_invisible_smash_guard_instant',
    description: 'A barbarian invisibly and instantly smashes past a guard with teleport power.',
    trigger: { hero: 'barbarian', stealth: 'invisible', escape_method: 'smash', obstacle: 'guard', speed: 'instant' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'torch_wall', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '💤' },
          { action: 'text_popup', text: '💤 GUARD DUTY 💤', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '👻 INVISIBLE POWER! 👻', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'screen_flash', color: 'orange', duration: 0.2 },
          { action: 'text_popup', text: '⚡💥 INSTANT SMASH! 💥⚡', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.7, duration: 0.5 },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'idle' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '❓' },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'wave' },
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'text_popup', text: '👻 GUARD CONFUSED! 👻', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '👻 INVISIBLE RUSH!',
      message: "The barbarian went INVISIBLE and INSTANTLY smashed past the guard! The guard never saw or heard anything. Perfect chaos!",
      skillTaught: 'Specificity',
      tip: "Invisible + instant smash = ghost attack!",
    },
    vagueComparison: {
      vague: "The barbarian gets past the guard",
      vagueResult: "Barbarian walks by guard",
      specific: "The barbarian INVISIBLY smashes past the guard INSTANTLY",
      specificResult: "Invisible barbarian teleport-smashes past bewildered guard!",
      why: "Invisible and instant create supernatural confusion!",
    },
  },

  {
    id: 'dc2_loud_sneak_locked_door_normal',
    description: 'A skeleton warrior loudly tries to sneak past a locked door, clanking armor echoing.',
    trigger: { hero: 'skeleton', stealth: 'loud', escape_method: 'sneak', obstacle: 'locked_door', speed: 'normal' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'spawn', asset: 'wall_stone', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton', emoji: '🤫' },
          { action: 'text_popup', text: '🚪 LOCKED DOOR 🚪', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton', anim: 'walk' },
          { action: 'react', effect: 'explosion-cartoon', position: 'left' },
          { action: 'text_popup', text: '💥 CLANK! CLANK! 💥', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'emote', character: 'skeleton', emoji: '😱' },
          { action: 'text_popup', text: '🚨 GUARDS ALERTED! 🚨', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton', anim: 'get_hit' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'text_popup', text: '🔒 DOOR STAYS LOCKED! 🔒', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 TOO LOUD!',
      message: "The skeleton tried to LOUDLY sneak but made too much noise! Loud sneaking is an oxymoron. Try 'quiet' or 'invisible' instead!",
      skillTaught: 'Specificity',
      tip: "Loud + sneak = contradiction! Match stealth style to method.",
    },
    vagueComparison: {
      vague: "The skeleton sneaks to the door",
      vagueResult: "Skeleton tiptoes quietly",
      specific: "The skeleton LOUDLY sneaks to the locked door at normal speed",
      specificResult: "Skeleton's bones clank loudly with each step!",
      why: "Loud makes sneaking impossible!",
    },
  },

  {
    id: 'dc2_disguised_fight_locked_door_instant',
    description: 'A rogue disguised as a guard instantly fights through a locked door with surprise attack.',
    trigger: { hero: 'rogue', stealth: 'disguised', escape_method: 'fight', obstacle: 'locked_door', speed: 'instant' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'spawn', asset: 'wall_stone', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '🎭 GUARD DISGUISE! 🎭', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'idle' },
          { action: 'emote', character: 'rogue', emoji: '😏' },
          { action: 'text_popup', text: '🚪 INSPECTING DOOR... 🚪', position: 'center', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'throw' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'screen_flash', color: 'red', duration: 0.2 },
          { action: 'text_popup', text: '⚡💥 INSTANT STRIKE! 💥⚡', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🔓 LOCK DESTROYED! 🔓', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'taunt' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🎭 NOBODY SUSPECTED! 🎭', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎭 SURPRISE ATTACK!',
      message: "The rogue disguised as a guard and INSTANTLY fought through the door! Disguise + instant combat = perfect surprise element!",
      skillTaught: 'Specificity',
      tip: "Disguised + instant fight = unexpected power!",
    },
    vagueComparison: {
      vague: "The rogue breaks through the door",
      vagueResult: "Rogue struggles with locked door",
      specific: "The rogue DISGUISED breaks through the door with INSTANT fighting",
      specificResult: "Disguised rogue surprise-smashes lock instantly!",
      why: "Disguise creates opportunity, instant makes it decisive!",
    },
  },

];

// ─── DEFAULT VIGNETTE (Stage 2 — always works) ─────────────────────────────

export const DUNGEON_CONCERT_DEFAULT_2: Vignette = {
  id: 'dc2_default',
  description: 'Someone tries to escape the dungeon with vague stealth and speed choices.',
  trigger: { hero: '*', stealth: '*', escape_method: '*', obstacle: '*', speed: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'wall_stone', position: 'center' },
        { action: 'spawn', asset: 'torch_wall', position: 'left' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'animate', character: 'knight', anim: 'walk' },
        { action: 'text_popup', text: '🏰 ESCAPING... 🏰', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🏰 Vague Escape',
    message: "Someone escaped... but HOW? Was it loud or quiet? Fast or slow? Add those details for a better escape!",
    skillTaught: 'Specificity',
    tip: "Pick a stealth style and speed to make your escape more specific!",
  },
};

// ─── STAGE 3 VIGNETTES ──────────────────────────────────────────────────────
// Template: "Combine {METHOD1} with {METHOD2} using {ELEMENT} in the {ROOM}"
// METHOD1/METHOD2: sneak, fight, magic, lockpick, distract, smash
// ELEMENT: fire, ice, shadow, music
// ROOM: throne_room, treasury, armory, library

export const DUNGEON_CONCERT_STAGE_3: Vignette[] = [

  // ── SECRET COMBO 1: sneak + fight = "Shadow Strike" ────────────────────────
  {
    id: 'dc3_shadow_strike',
    description: 'Combining stealth with combat creates the legendary Shadow Strike — sneak then strike.',
    trigger: { method1: 'sneak', method2: 'fight', element: 'shadow', room: 'throne_room' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'pillar_stone', position: 'left' },
          { action: 'spawn', asset: 'pillar_stone', position: 'right' },
          { action: 'spawn', asset: 'throne', position: 'center' },
          { action: 'text_popup', text: '👑 THRONE ROOM 👑', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '💤' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '🌑 SHADOW SNEAK 🌑', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'walk' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'sword_slash' },
          { action: 'text_popup', text: '⚔️ SHADOW STRIKE! ⚔️', position: 'center', size: 'huge' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'screen_flash', color: 'black', duration: 0.3 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'die_dramatic' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'jump_big' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'text_popup', text: '🏆 SHADOW STRIKE MASTERED! 🏆', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌑 SECRET COMBO: SHADOW STRIKE!',
      message: "You discovered SHADOW STRIKE! Sneak + Fight + Shadow = stealth assassination. The ultimate rogue technique!",
      skillTaught: 'Combo Thinking',
      tip: "Combining opposite skills creates powerful new moves!",
    },
  },

  // ── SECRET COMBO 2: magic + lockpick = "Arcane Locksmith" ──────────────────
  {
    id: 'dc3_arcane_locksmith',
    description: 'Combining magic with lockpicking creates Arcane Locksmith — spells that pick locks.',
    trigger: { method1: 'magic', method2: 'lockpick', element: 'fire', room: 'treasury' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'left' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'text_popup', text: '💰 TREASURY 💰', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '🔥' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'text_popup', text: '🔥 FIRE LOCKPICK SPELL! 🔥', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '✨ LOCK MELTS! ✨', position: 'center', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'screen_flash', color: 'orange', duration: 0.3 },
          { action: 'text_popup', text: '🔓 DOOR OPENS! 🔓', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'Cheering' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🔥 ARCANE LOCKSMITH! 🔥', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🔥 SECRET COMBO: ARCANE LOCKSMITH!',
      message: "You discovered ARCANE LOCKSMITH! Magic + Lockpick + Fire = melt locks with spells. No picks needed!",
      skillTaught: 'Combo Thinking',
      tip: "Combine technical skills with magic for creative solutions!",
    },
  },

  // ── SECRET COMBO 3: distract + smash = "Chaos Exit" ────────────────────────
  {
    id: 'dc3_chaos_exit',
    description: 'Combining distraction with smashing creates Chaos Exit — distract then smash through.',
    trigger: { method1: 'distract', method2: 'smash', element: 'music', room: 'armory' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'spawn', asset: 'barrel', position: 'left' },
          { action: 'spawn', asset: 'barrel', position: 'right' },
          { action: 'text_popup', text: '⚔️ ARMORY ⚔️', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '👀' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'clown', emoji: '🎵' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'idle' },
          { action: 'react', effect: 'hearts-float', position: 'left' },
          { action: 'text_popup', text: '🎵 MUSICAL DISTRACTION! 🎵', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'emote', character: 'skeleton_warrior', emoji: '🤔' },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'right', anim: 'spawn_ground' },
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'text_popup', text: '💥 SMASH THROUGH! 💥', position: 'center', size: 'huge' },
          { action: 'react', effect: 'explosion-cartoon', position: 'right' },
          { action: 'camera_shake', intensity: 0.9, duration: 1.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'wave' },
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🎪 CHAOS EXIT! 🎪', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🎪 SECRET COMBO: CHAOS EXIT!',
      message: "You discovered CHAOS EXIT! Distract + Smash + Music = confuse them, then smash through! Total mayhem!",
      skillTaught: 'Combo Thinking',
      tip: "Distraction lets you smash without resistance!",
    },
  },

  // ── SECRET COMBO 4: fight + magic = "Spell Blade" ──────────────────────────
  {
    id: 'dc3_spell_blade',
    description: 'Combining fighting with magic creates Spell Blade — enchanted weapon combat.',
    trigger: { method1: 'fight', method2: 'magic', element: 'ice', room: 'library' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'left' },
          { action: 'spawn', asset: 'wall_stone', position: 'right' },
          { action: 'spawn', asset: 'crate_wood', position: 'center' },
          { action: 'text_popup', text: '📚 LIBRARY 📚', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_mage', position: 'right', anim: 'spawn_air' },
          { action: 'emote', character: 'skeleton_mage', emoji: '📖' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'knight', emoji: '⚔️' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'cast_spell' },
          { action: 'react', effect: 'snowflakes', position: 'left' },
          { action: 'text_popup', text: '❄️ ICE ENCHANTMENT! ❄️', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '⚔️ SPELL BLADE! ⚔️', position: 'center', size: 'huge' },
          { action: 'screen_flash', color: 'cyan', duration: 0.3 },
          { action: 'camera_shake', intensity: 0.7, duration: 0.8 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_mage', anim: 'die_dramatic' },
          { action: 'react', effect: 'explosion-cartoon', position: 'right' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'jump_big' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🗡️ SPELL BLADE MASTERED! 🗡️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🗡️ SECRET COMBO: SPELL BLADE!',
      message: "You discovered SPELL BLADE! Fight + Magic + Ice = enchanted weapon attacks. Sword meets sorcery!",
      skillTaught: 'Combo Thinking',
      tip: "Magic enhances physical combat for devastating combos!",
    },
  },

  // ── SECRET COMBO 5: sneak + distract = "Ghost Trick" ───────────────────────
  {
    id: 'dc3_ghost_trick',
    description: 'Combining sneak with distraction creates Ghost Trick — invisible distraction technique.',
    trigger: { method1: 'sneak', method2: 'distract', element: 'shadow', room: 'treasury' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'crate_wood', position: 'left' },
          { action: 'spawn', asset: 'crate_wood', position: 'right' },
          { action: 'text_popup', text: '💰 TREASURY 💰', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '👀' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'text_popup', text: '👻 INVISIBLE! 👻', position: 'left', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'right' },
          { action: 'text_popup', text: '💨 GHOST DISTRACTION! 💨', position: 'right', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'idle' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '❓' },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'walk' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'Cheering' },
          { action: 'react', effect: 'glow-pulse', position: 'right' },
          { action: 'text_popup', text: '👻 GHOST TRICK! 👻', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '👻 SECRET COMBO: GHOST TRICK!',
      message: "You discovered GHOST TRICK! Sneak + Distract + Shadow = invisible distractions confuse enemies while you escape!",
      skillTaught: 'Combo Thinking',
      tip: "Invisible distractions are the ultimate stealth tool!",
    },
  },

  // ── SECRET COMBO 6: lockpick + smash = "Pick or Smash" ─────────────────────
  {
    id: 'dc3_pick_or_smash',
    description: 'Combining lockpick with smash creates Pick or Smash — try picking, then SMASH if it fails.',
    trigger: { method1: 'lockpick', method2: 'smash', element: 'fire', room: 'armory' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'text_popup', text: '⚔️ ARMORY DOOR ⚔️', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'rogue', emoji: '🔑' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'interact' },
          { action: 'text_popup', text: '🔓 PICKING... 🔓', position: 'center', size: 'large' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'emote', character: 'rogue', emoji: '😤' },
          { action: 'text_popup', text: '❌ LOCK TOO HARD! ❌', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '🔥' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'text_popup', text: '💥 FIRE SMASH! 💥', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.9, duration: 1.0 },
          { action: 'screen_flash', color: 'orange', duration: 0.3 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'wave' },
          { action: 'animate', character: 'barbarian', anim: 'jump_big' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🔥 PICK OR SMASH! 🔥', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🔥 SECRET COMBO: PICK OR SMASH!',
      message: "You discovered PICK OR SMASH! Lockpick + Smash + Fire = try picking first, then smash if that fails. Always have a backup plan!",
      skillTaught: 'Combo Thinking',
      tip: "Patience first, then brute force if needed!",
    },
  },

];

// ─── DEFAULT VIGNETTE (Stage 3 — always works) ─────────────────────────────

export const DUNGEON_CONCERT_DEFAULT_3: Vignette = {
  id: 'dc3_default',
  description: 'Someone tries to combine methods in the dungeon but no secret combo is found.',
  trigger: { method1: '*', method2: '*', element: '*', room: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'wall_stone', position: 'center' },
        { action: 'spawn', asset: 'torch_wall', position: 'left' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'animate', character: 'knight', anim: 'idle' },
        { action: 'text_popup', text: '🤔 TRYING COMBO... 🤔', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ],
      delayAfter: 1.0,
    },
    {
      parallel: [
        { action: 'emote', character: 'knight', emoji: '❓' },
        { action: 'react', effect: 'question-marks', position: 'center' },
        { action: 'text_popup', text: '💭 NO COMBO FOUND 💭', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '❓ No Combo Yet',
    message: "You tried a combo, but it's not one of the secrets! Try different method + element + room combinations!",
    skillTaught: 'Combo Thinking',
    tip: "Experiment with different combos! Some methods pair better together.",
  },
};
