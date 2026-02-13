/**
 * Barbarian School Quest — Vignettes for Stage 1.
 *
 * Stage 1: "At recess, {MONSTER} plays {ACTIVITY} on the {EQUIPMENT}"
 * Slots: MONSTER (barbarian/clown/ninja/robot/caveman/everyone), ACTIVITY (tag/wrestling/hide_seek/race/jumping/climbing), EQUIPMENT (slide/swing/seesaw/sandbox/merry_go_round/field)
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const BARBARIAN_SCHOOL_STAGE_1: Vignette[] = [

  // ── EXACT: barbarian + wrestling + seesaw ───────────────────────────────────
  {
    id: 'barbarian_school_1_perfect_barbarian_wrestling_seesaw',
    trigger: { monster: 'barbarian', activity: 'wrestling', equipment: 'seesaw' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Playground setup
      {
        parallel: [
          { action: 'spawn', asset: 'seesaw', position: 'center' },
          { action: 'spawn', asset: 'fence_wood', position: 'left' },
          { action: 'spawn', asset: 'fence_wood', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Barbarian charges in
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '💪' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Barbarian roars
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'text_popup', text: '💪 RECESS RUMBLE! 💪', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // Caveman opponent appears
      {
        parallel: [
          { action: 'spawn_character', character: 'caveman', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'caveman', emoji: '🦴' },
        ],
        delayAfter: 0.5,
      },
      // They both jump on seesaw
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'jump_idle' },
          { action: 'animate', character: 'caveman', anim: 'jump_idle' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      // CRASH LANDING
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'animate', character: 'caveman', anim: 'spin_attack' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.7, duration: 0.8 },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Seesaw BREAKS
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'screen_flash', color: 'brown', duration: 0.2 },
          { action: 'text_popup', text: '💥 SEESAW K.O.! 💥', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Both sprawled out
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'die_flop' },
          { action: 'animate', character: 'caveman', anim: 'die_dramatic' },
        ],
        delayAfter: 0.8,
      },
      // Victory (somehow)
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '🏆 BARBARIAN WINS! 🏆', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💪 SEESAW SMASH!',
      message: "A barbarian wrestling on a seesaw?! Of COURSE it broke! You picked WHO (barbarian), WHAT (wrestling), and WHERE (seesaw). Perfect chaos!",
      skillTaught: 'Specificity',
      tip: 'When you match a wild character with a wild activity, expect wild results!',
    },
  },

  // ── EXACT: ninja + hide_seek + sandbox ──────────────────────────────────────
  {
    id: 'barbarian_school_1_perfect_ninja_hide_sandbox',
    trigger: { monster: 'ninja', activity: 'hide_seek', equipment: 'sandbox' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Playground with sandbox
      {
        parallel: [
          { action: 'spawn', asset: 'sandbox', position: 'center' },
          { action: 'spawn', asset: 'tree_cartoon', position: 'left' },
          { action: 'spawn', asset: 'tree_cartoon', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Kids looking for ninja
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '👀' },
          { action: 'emote', character: 'robot', emoji: '🔍' },
        ],
        delayAfter: 0.5,
      },
      // They look around confused
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'idle' },
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'react', effect: 'question-marks', position: 'center' },
          { action: 'text_popup', text: '🤔 WHERE IS NINJA? 🤔', position: 'top', size: 'large' },
        ],
        delayAfter: 1.0,
      },
      // They walk away
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'walk' },
          { action: 'animate', character: 'robot', anim: 'walk' },
        ],
        delayAfter: 0.5,
      },
      // NINJA BURSTS FROM SAND
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'center', anim: 'skel_spawn' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Ninja taunts
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'taunt' },
          { action: 'emote', character: 'ninja', emoji: '🥷' },
          { action: 'text_popup', text: '🥷 SURPRISE! 🥷', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Others jump in shock
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'get_hit' },
          { action: 'animate', character: 'robot', anim: 'get_hit' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      // Ninja wins
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '🥷 NINJA MASTER! 🥷', position: 'center', size: 'huge' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🥷 STEALTH MASTER!',
      message: "The ninja disappeared into the sandbox and nobody could find them! Perfect hiding spot. You matched WHO (ninja) + WHAT (hide and seek) + WHERE (sandbox)!",
      skillTaught: 'Specificity',
      tip: "Matching a character's skills to the activity = perfect combo!",
    },
  },

  // ── PAIR: clown + * + swing ─────────────────────────────────────────────────
  {
    id: 'barbarian_school_1_chaos_clown_swing',
    trigger: { monster: 'clown', activity: '*', equipment: 'swing' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      // Swing set
      {
        parallel: [
          { action: 'spawn', asset: 'swing_set', position: 'center' },
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
      // Clown does tricks
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'pushups' },
          { action: 'text_popup', text: '🤡 WATCH THIS! 🤡', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      // Clown jumps
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'jump_idle' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      // Backflip attempt
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'spin_attack' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      // CRASH
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'die_flop' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Kids laugh
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'caveman', position: 'bottom', anim: 'spawn_ground' },
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'react', effect: 'laugh-tears', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      // Clown takes a bow
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'celebrate' },
          { action: 'text_popup', text: '🎪 RECESS SHOW! 🎪', position: 'center', size: 'huge' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤡 CLOWN CHAOS!',
      message: "A clown on a swing doing tricks? Total chaos! The clown made it entertaining but forgot what activity they were SUPPOSED to be doing!",
      skillTaught: 'Focus',
      tip: 'Clowns are fun, but pick a specific activity to match! Try clown + jumping + swing.',
    },
  },

  // ── CATEGORY: * + race + * ──────────────────────────────────────────────────
  {
    id: 'barbarian_school_1_partial_race',
    trigger: { monster: '*', activity: 'race', equipment: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      // Field setup
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'spawn', asset: 'cone_traffic', position: 'left' },
          { action: 'spawn', asset: 'cone_traffic', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Racers appear
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'ninja', position: 'right', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Ready, set...
      {
        parallel: [
          { action: 'text_popup', text: '🏁 READY... 🏁', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      // GO!
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'animate', character: 'ninja', anim: 'walk' },
          { action: 'text_popup', text: '🏁 GO! 🏁', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 1.0,
      },
      // Finish
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'celebrate' },
          { action: 'animate', character: 'robot', anim: 'idle' },
          { action: 'react', effect: 'confetti-burst', position: 'right' },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '🥇 RACE COMPLETE! 🥇', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🏁 Race Time!',
      message: "A race happened! But WHO was racing and WHERE? Add a specific monster and equipment to make it more exciting!",
      skillTaught: 'Detail',
      tip: "Try 'ninja + race + field' or 'barbarian + race + slide' for a complete scene!",
    },
  },

];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const BARBARIAN_SCHOOL_DEFAULT: Vignette = {
  id: 'barbarian_school_default',
  trigger: { monster: '*', activity: '*', equipment: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'playground', position: 'center' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'right', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '🎪 RECESS TIME! 🎪', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🎪 Recess Break!',
    message: "Something happened at recess! But WHO was playing? WHAT were they doing? WHERE? Fill in the details for the full story!",
    skillTaught: 'Specificity',
    tip: "Pick a monster, an activity, and equipment. Each detail adds to the scene!",
  },
};
