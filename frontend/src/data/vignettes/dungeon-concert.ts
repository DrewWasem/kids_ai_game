/**
 * Dungeon Concert Quest — Vignettes for Stage 1.
 *
 * Stage 1: "The {HERO} tries to {ESCAPE_METHOD} past the {OBSTACLE}"
 * Slots: HERO (knight/mage/rogue/skeleton/necromancer/team), ESCAPE_METHOD (sneak/fight/magic/lockpick/distract/smash), OBSTACLE (guard/locked_door/trap/darkness/puzzle/skeleton_army)
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const DUNGEON_CONCERT_STAGE_1: Vignette[] = [

  // ── EXACT: rogue + lockpick + locked_door ───────────────────────────────────
  {
    id: 'dungeon_concert_1_perfect_rogue_lockpick_door',
    trigger: { hero: 'rogue', escape_method: 'lockpick', obstacle: 'locked_door' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Dungeon corridor
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'left' },
          { action: 'spawn', asset: 'wall_stone', position: 'right' },
          { action: 'spawn', asset: 'torch_wall', position: 'left' },
          { action: 'spawn', asset: 'torch_wall', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Locked door
      {
        parallel: [
          { action: 'spawn', asset: 'door_iron', position: 'center' },
          { action: 'spawn', asset: 'lock', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Rogue sneaks in
      {
        parallel: [
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'rogue', emoji: '🗝️' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Rogue examines lock
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'idle' },
          { action: 'emote', character: 'rogue', emoji: '🔍' },
        ],
        delayAfter: 0.5,
      },
      // Pulls out lockpicks
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'interact' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🔓 PICKING... 🔓', position: 'top', size: 'large' },
        ],
        delayAfter: 1.0,
      },
      // Concentrating
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'interact' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      // CLICK - lock opens
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '✨ CLICK! ✨', position: 'center', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Door opens
      {
        parallel: [
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'screen_flash', color: 'white', duration: 0.2 },
        ],
        delayAfter: 0.5,
      },
      // Rogue celebrates smoothly
      {
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'text_popup', text: '🗝️ SMOOTH ESCAPE! 🗝️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🗝️ LOCKPICK MASTER!',
      message: "The rogue expertly picked the lock! Perfect match: WHO (rogue) knows HOW to lockpick and beat WHAT obstacle (locked door). That's skill!",
      skillTaught: 'Specificity',
      tip: "Matching a hero's skills to the obstacle = smooth success!",
    },
  },

  // ── EXACT: team + fight + skeleton_army ─────────────────────────────────────
  {
    id: 'dungeon_concert_1_perfect_team_fight_army',
    trigger: { hero: 'team', escape_method: 'fight', obstacle: 'skeleton_army' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Dungeon hall
      {
        parallel: [
          { action: 'spawn', asset: 'pillar_stone', position: 'left' },
          { action: 'spawn', asset: 'pillar_stone', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Skeleton army appears
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
          { action: 'spawn_character', character: 'skeleton_mage', position: 'right', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'skeleton_minion', position: 'bottom', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
          { action: 'text_popup', text: '💀 SKELETON ARMY! 💀', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Heroes assemble
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'rogue', position: 'left', anim: 'spawn_ground' },
          { action: 'react', effect: 'explosion-cartoon', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Battle cry
      {
        parallel: [
          { action: 'crowd_react', characters: ['knight', 'mage', 'rogue'], anim: 'taunt' },
          { action: 'text_popup', text: '⚔️ CHARGE! ⚔️', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // EPIC BATTLE
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'animate', character: 'rogue', anim: 'throw' },
          { action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' },
          { action: 'animate', character: 'skeleton_mage', anim: 'cast_long' },
          { action: 'camera_shake', intensity: 0.8, duration: 2.0 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.5,
      },
      // Explosions everywhere
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'react', effect: 'fire-sneeze', position: 'left' },
          { action: 'screen_flash', color: 'orange', duration: 0.3 },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Skeletons defeated
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' },
          { action: 'animate', character: 'skeleton_mage', anim: 'die_dramatic' },
          { action: 'animate', character: 'skeleton_minion', anim: 'die_flop' },
        ],
        delayAfter: 0.8,
      },
      // VICTORY!
      {
        parallel: [
          { action: 'crowd_react', characters: ['knight', 'mage', 'rogue'], anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🏆 TEAM VICTORY! 🏆', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚔️ EPIC BATTLE!',
      message: "The whole team fought together and defeated the skeleton army! When you face a BIG obstacle, teamwork is the answer. Perfect WHO + HOW + WHAT!",
      skillTaught: 'Specificity',
      tip: 'Big obstacles need big solutions! Team + fight = victory!',
    },
  },

  // ── PAIR: mage + magic + * ──────────────────────────────────────────────────
  {
    id: 'dungeon_concert_1_chaos_mage_magic',
    trigger: { hero: 'mage', escape_method: 'magic', obstacle: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      // Dark dungeon
      {
        parallel: [
          { action: 'spawn', asset: 'wall_stone', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      // Mage enters
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'mage', emoji: '✨' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Mage starts casting
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'text_popup', text: '🪄 MAGIC TIME! 🪄', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      // Magic goes WILD
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'fire-sneeze', position: 'right' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'camera_shake', intensity: 0.7, duration: 1.5 },
          { action: 'screen_flash', color: 'purple', duration: 0.3 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      // More explosions
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'left' },
          { action: 'react', effect: 'sparkle-magic', position: 'right' },
          { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
        ],
        delayAfter: 0.5,
      },
      // Mage gets knocked back
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'get_hit' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Smoke clears
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'idle' },
          { action: 'emote', character: 'mage', emoji: '😵' },
          { action: 'react', effect: 'sad-cloud', position: 'center' },
        ],
        delayAfter: 0.8,
      },
      // Confusion
      {
        parallel: [
          { action: 'emote', character: 'mage', emoji: '🤷' },
          { action: 'text_popup', text: '💥 ...OOPS? 💥', position: 'center', size: 'huge' },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🪄 WILD MAGIC!',
      message: "The mage cast magic but didn't know WHAT obstacle to solve! Magic went haywire! Pick a specific obstacle for better control.",
      skillTaught: 'Focus',
      tip: "Magic is powerful, but it needs a target! Try mage + magic + darkness or mage + magic + trap.",
    },
  },

  // ── CATEGORY: * + smash + * ─────────────────────────────────────────────────
  {
    id: 'dungeon_concert_1_partial_smash',
    trigger: { hero: '*', escape_method: 'smash', obstacle: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      // Dungeon room
      {
        parallel: [
          { action: 'spawn', asset: 'crate_wood', position: 'center' },
          { action: 'spawn', asset: 'barrel', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Hero appears
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '💪' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // SMASH!
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'text_popup', text: '💥 SMASH! 💥', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // Destruction
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'right' },
          { action: 'camera_shake', intensity: 0.8, duration: 0.8 },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.8,
      },
      // Success?
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'celebrate' },
          { action: 'emote', character: 'barbarian', emoji: '😄' },
          { action: 'text_popup', text: '💪 SMASHED! 💪', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💥 Smash Success!',
      message: "Someone smashed something! But WHO did the smashing and WHAT were they trying to escape? Add those details!",
      skillTaught: 'Detail',
      tip: "Try 'knight + smash + locked_door' or 'barbarian + smash + guard' for a complete escape!",
    },
  },

];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const DUNGEON_CONCERT_DEFAULT: Vignette = {
  id: 'dungeon_concert_default',
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
