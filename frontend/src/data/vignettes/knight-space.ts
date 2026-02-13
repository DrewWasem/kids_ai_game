/**
 * Knight Space Quest — Vignettes for Stage 1.
 *
 * Stage 1: "Fix the station by having {CREW} do {TASK} using the {TOOL}"
 * Slots: CREW (ranger/robot/engineer/knight/everyone), TASK (repair/launch/build/rescue/explore/defend), TOOL (solar_panel/cargo/dome/rocket/flag/laser)
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const KNIGHT_SPACE_STAGE_1: Vignette[] = [

  // ── EXACT: ranger + repair + solar_panel ───────────────────────────────────
  {
    id: 'knight_space_1_perfect_ranger_repair_solar',
    trigger: { crew: 'ranger', task: 'repair', tool: 'solar_panel' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Space station appears
      {
        parallel: [
          { action: 'spawn', asset: 'space_station', position: 'center' },
          { action: 'spawn', asset: 'satellite_dish', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Broken solar panel sparking
      {
        parallel: [
          { action: 'spawn', asset: 'solar_panel', position: 'right' },
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'sfx', sound: 'fail' },
          { action: 'text_popup', text: '⚠️ POWER CRITICAL! ⚠️', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      // Space ranger arrives
      {
        parallel: [
          { action: 'spawn_character', character: 'space_ranger', position: 'left', anim: 'spawn_air' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Ranger salutes
      {
        parallel: [
          { action: 'animate', character: 'space_ranger', anim: 'wave' },
          { action: 'emote', character: 'space_ranger', emoji: '🔧' },
        ],
        delayAfter: 0.5,
      },
      // Ranger moves to solar panel
      {
        parallel: [
          { action: 'animate', character: 'space_ranger', anim: 'walk' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      // Ranger repairs panel
      {
        parallel: [
          { action: 'animate', character: 'space_ranger', anim: 'interact' },
          { action: 'react', effect: 'sparkle-magic', position: 'right' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      // Solar panel fixed!
      {
        parallel: [
          { action: 'react', effect: 'confetti-burst', position: 'right' },
          { action: 'screen_flash', color: 'yellow', duration: 0.2 },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '⚡ POWER RESTORED! ⚡', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Ranger celebrates
      {
        parallel: [
          { action: 'animate', character: 'space_ranger', anim: 'celebrate' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌟 PERFECT REPAIR!',
      message: "The space ranger expertly fixed the solar panel! You said WHO (ranger), WHAT they do (repair), and WHAT tool (solar panel). That's exactly how space stations get saved!",
      skillTaught: 'Specificity',
      tip: 'Matching the right expert with the right job = mission success!',
    },
  },

  // ── EXACT: everyone + launch + rocket ───────────────────────────────────────
  {
    id: 'knight_space_1_perfect_everyone_launch_rocket',
    trigger: { crew: 'everyone', task: 'launch', tool: 'rocket' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Launch pad setup
      {
        parallel: [
          { action: 'spawn', asset: 'rocket', position: 'center' },
          { action: 'spawn', asset: 'cargo_crate', position: 'left' },
          { action: 'spawn', asset: 'cargo_crate', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Crew assembles
      {
        parallel: [
          { action: 'spawn_character', character: 'space_ranger', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'engineer', position: 'bottom', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'knight', position: 'center', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Everyone gets ready
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'wave' },
          { action: 'text_popup', text: '🚀 LAUNCH SEQUENCE! 🚀', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // Countdown
      {
        parallel: [
          { action: 'text_popup', text: '3...', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.2, duration: 0.5 },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '2...', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.4, duration: 0.5 },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '1...', position: 'center', size: 'huge' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
        ],
        delayAfter: 0.5,
      },
      // LIFTOFF!
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'screen_flash', color: 'orange', duration: 0.3 },
          { action: 'camera_shake', intensity: 0.8, duration: 1.5 },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '🚀 LIFTOFF! 🚀', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.8,
      },
      // Everyone celebrates
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🚀 LEGENDARY LAUNCH!',
      message: "When the WHOLE CREW works together on a rocket launch, amazing things happen! Teamwork makes the dream work (in space)!",
      skillTaught: 'Specificity',
      tip: 'Everyone + launch + rocket = the perfect space mission combo!',
    },
  },

  // ── PAIR: knight + defend + * ───────────────────────────────────────────────
  {
    id: 'knight_space_1_chaos_knight_defend',
    trigger: { crew: 'knight', task: 'defend', tool: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      // Space station
      {
        parallel: [
          { action: 'spawn', asset: 'space_station', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      // Knight appears IN SPACE
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'knight', emoji: '⚔️' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Knight charges (medieval style)
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'sfx', sound: 'move' },
          { action: 'text_popup', text: '⚔️ FOR HONOR! ⚔️', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      // Confused pause
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'idle' },
          { action: 'emote', character: 'knight', emoji: '🤔' },
          { action: 'react', effect: 'question-marks', position: 'center' },
        ],
        delayAfter: 1.0,
      },
      // Knight swings at nothing
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'spin_attack' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      // Gets dizzy
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'get_hit' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      // Robot appears to help
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'robot', emoji: '🤖' },
        ],
        delayAfter: 0.5,
      },
      // Robot facepalms
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'idle' },
          { action: 'react', effect: 'sad-cloud', position: 'right' },
          { action: 'text_popup', text: '🤦 WRONG JOB! 🤦', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚔️ MEDIEVAL CHAOS!',
      message: "A knight trying to defend a space station with a sword? It's... creative! But maybe a space ranger with tech tools would work better?",
      skillTaught: 'Context',
      tip: "Match the character to the setting! Knights are great for castles, not space stations.",
    },
  },

  // ── VIBE/CATEGORY: * + * + laser ────────────────────────────────────────────
  {
    id: 'knight_space_1_partial_laser',
    trigger: { crew: '*', task: '*', tool: 'laser' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      // Space station setup
      {
        parallel: [
          { action: 'spawn', asset: 'space_station', position: 'center' },
          { action: 'spawn', asset: 'satellite_dish', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Random crew member appears
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Laser appears
      {
        parallel: [
          { action: 'spawn', asset: 'laser_gun', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // Robot uses laser
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'throw' },
          { action: 'react', effect: 'explosion-cartoon', position: 'right' },
          { action: 'camera_shake', intensity: 0.4, duration: 0.5 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      // Confusion
      {
        parallel: [
          { action: 'emote', character: 'robot', emoji: '🤷' },
          { action: 'react', effect: 'question-marks', position: 'center' },
          { action: 'text_popup', text: '💥 PEW PEW? 💥', position: 'top', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🔫 Laser Shenanigans!',
      message: "You picked a laser! But WHO is using it and WHY? Add a crew member and a task to make this mission complete!",
      skillTaught: 'Detail',
      tip: "Lasers are cool, but they need a purpose! Try 'ranger + defend + laser' for a full mission.",
    },
  },

];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const KNIGHT_SPACE_DEFAULT: Vignette = {
  id: 'knight_space_default',
  trigger: { crew: '*', task: '*', tool: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn', asset: 'space_station', position: 'center' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'space_ranger', position: 'left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'wave' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '🛸 SPACE MISSION! 🛸', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🛸 Space Station Online!',
    message: "Something happened at the space station! But WHO fixed it? WHAT did they do? With WHAT tool? Fill in the blanks for a real mission!",
    skillTaught: 'Specificity',
    tip: "Try picking a crew member, a task, and a tool. Each detail makes the mission clearer!",
  },
};
