/**
 * Barbarian School Quest — Vignettes for all stages.
 *
 * Stage 1: "At recess, {MONSTER} plays {ACTIVITY} on the {EQUIPMENT}"
 * Stage 2: "At recess, a {ENERGY} {MONSTER} plays {ACTIVITY} on the {EQUIPMENT} during {WEATHER} weather"
 * Stage 3: "Combine {GAME1} with {GAME2} in {STYLE} style on the {PLAYGROUND}"
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const BARBARIAN_SCHOOL_STAGE_1: Vignette[] = [
  // ── BARBARIAN VIGNETTES ──
  {
    id: 'bs_barbarian_tag',
    description: 'Barbarian charges at everyone for tag with overwhelming strength, launching kids across the playground',
    trigger: { monster: 'barbarian', equipment: '*', activity: 'tag' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'swing', position: 'cs-left' },
        { action: 'spawn', asset: 'slide', position: 'cs-right' },
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-left', style: 'charge' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'run_panic' },
        { action: 'move', character: 'ninja', to: 'off-right', style: 'launch' },
        { action: 'react', effect: 'stars-spin', position: 'cs-left' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-right', style: 'charge' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'animate', character: 'knight', anim: 'get_bonked' },
        { action: 'move', character: 'knight', to: 'off-left', style: 'launch' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'Cheering' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '💪 BARBARIAN SMASH!',
      message: 'This barbarian plays tag like a wrecking ball! Too much power for a friendly game of tag.',
      skillTaught: 'Detail',
      tip: 'Adding gentle or careful to your prompt could prevent playground chaos!',
    },
  },
  {
    id: 'bs_barbarian_wrestling',
    description: 'Barbarian wrestling on the seesaw creates so much force that the equipment breaks',
    trigger: { monster: 'barbarian', equipment: '*', activity: 'wrestling' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'seesaw', position: 'cs-center' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-left', style: 'walk' },
        { action: 'move', character: 'robot', to: 'cs-right', style: 'walk' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'jump_small' },
        { action: 'sfx', sound: 'react' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'move', character: 'robot', to: 'top', style: 'bounce' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'despawn', asset: 'seesaw' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn', asset: 'crate', position: 'cs-left' },
        { action: 'spawn', asset: 'barrel', position: 'cs-right' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🤼 SEESAW SMASH!',
      message: 'Barbarian strength + wrestling moves = broken playground equipment! The seesaw never stood a chance.',
      skillTaught: 'Specificity',
      tip: 'Try describing the size or weight of your monster to control their impact on the world.',
    },
  },
  {
    id: 'bs_barbarian_hide_seek',
    description: 'Barbarian tries to hide behind a tiny bush, completely visible and failing hilariously',
    trigger: { monster: 'barbarian', equipment: '*', activity: 'hide_seek' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'haybale', position: 'cs-center' },
        { action: 'spawn', asset: 'barrel', position: 'cs-left' },
        { action: 'spawn_character', character: 'barbarian', position: 'off-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-center', style: 'sneak' },
        { action: 'animate', character: 'barbarian', anim: 'walk' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-left', style: 'walk' },
        { action: 'animate', character: 'mage', anim: 'wave' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🙈 WORST HIDING SPOT!',
      message: 'A massive barbarian behind a tiny haybale? Everyone can see you! Hide-and-seek needs a better strategy.',
      skillTaught: 'Focus',
      tip: 'Adding where or how to hide in your prompt helps your monster make smarter choices!',
    },
  },
  {
    id: 'bs_barbarian_race',
    description: 'Barbarian smashes through all obstacles instead of running around them during a race',
    trigger: { monster: 'barbarian', equipment: '*', activity: 'race' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'crate', position: 'cs-left' },
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'spawn', asset: 'haybale', position: 'cs-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-left', style: 'charge' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'despawn', asset: 'crate' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-center', style: 'charge' },
        { action: 'sfx', sound: 'react' },
        { action: 'despawn', asset: 'barrel' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-right', style: 'charge' },
        { action: 'sfx', sound: 'react' },
        { action: 'despawn', asset: 'haybale' },
        { action: 'react', effect: 'smoke', position: 'cs-right' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'off-right', style: 'charge' },
        { action: 'react', effect: 'glow-pulse', position: 'off-right' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🏃 DESTRUCTION DERBY!',
      message: 'This barbarian treats the race course like a demolition zone! Smashing through obstacles is one way to win.',
      skillTaught: 'Sequencing',
      tip: 'Use words like avoid or go around to teach your monster better race strategies!',
    },
  },
  {
    id: 'bs_barbarian_jumping',
    description: 'Barbarian jumps so hard they crack the ground and send shockwaves everywhere',
    trigger: { monster: 'barbarian', equipment: '*', activity: 'jumping' },
    tier: 'subtle',
    promptScore: 'partial',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sandbox', position: 'cs-center' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'jump_idle' },
        { action: 'move', character: 'barbarian', to: 'top', style: 'bounce' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-center', style: 'drop' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.1 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'react', effect: 'dust', position: 'wide' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'get_bonked' },
        { action: 'animate', character: 'knight', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'cs-left' },
        { action: 'react', effect: 'stars-spin', position: 'cs-right' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🦘 GROUND POUNDER!',
      message: 'Barbarian jumping creates earthquakes! The landing shockwave knocked everyone else over.',
      skillTaught: 'Detail',
      tip: 'Try adding softly or gently to control how your monster performs actions!',
    },
  },
  {
    id: 'bs_barbarian_climbing',
    description: 'Barbarian climbs the slide from the wrong direction and gets stuck halfway',
    trigger: { monster: 'barbarian', equipment: '*', activity: 'climbing' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'slide', position: 'cs-center' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'cs-right', style: 'walk' },
        { action: 'animate', character: 'barbarian', anim: 'walk' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'jump_small' },
        { action: 'move', character: 'barbarian', to: 'cs-center', style: 'climb' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', to: 'ds-right', style: 'slide' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
        { action: 'react', effect: 'stars-spin', position: 'ds-right' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🧗 WRONG WAY!',
      message: 'Climbing UP the slide? The barbarian had the right energy, wrong direction! Gravity always wins.',
      skillTaught: 'Specificity',
      tip: 'Being specific about direction helps your monster understand the right way to play!',
    },
  },

  // ── CLOWN VIGNETTES ──
  {
    id: 'bs_clown_tag',
    description: 'Clown tags people with a pie to the face instead of touching them',
    trigger: { monster: 'clown', equipment: '*', activity: 'tag' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'swing', position: 'cs-left' },
        { action: 'spawn_character', character: 'clown', position: 'off-left', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'ds-left', style: 'bounce' },
        { action: 'animate', character: 'clown', anim: 'jump_idle' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'throw' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'get_bonked' },
        { action: 'react', effect: 'splash', position: 'cs-center' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'throw' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'react', effect: 'splash', position: 'cs-right' },
        { action: 'react', effect: 'hearts-float', position: 'cs-right' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'wave' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🥧 PIE TAG CHAMPION!',
      message: 'This clown turned tag into a pie-throwing contest! Messy, hilarious, and definitely not the rules.',
      skillTaught: 'Focus',
      tip: 'Add traditionally or by the rules to keep your clown from inventing their own game!',
    },
  },
  {
    id: 'bs_clown_wrestling',
    description: 'Clown uses rubber chickens and pratfalls in a silly wrestling match',
    trigger: { monster: 'clown', equipment: '*', activity: 'wrestling' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sandbox', position: 'cs-center' },
        { action: 'spawn_character', character: 'clown', position: 'ds-left', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'mage', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'cs-left', style: 'bounce' },
        { action: 'move', character: 'mage', to: 'cs-right', style: 'walk' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'throw' },
        { action: 'react', effect: 'bubbles', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'cs-right' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'jump_small' },
        { action: 'move', character: 'clown', to: 'cs-center', style: 'bounce' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'sit_floor' },
        { action: 'react', effect: 'laugh-tears', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🤡 SILLY WRESTLING!',
      message: 'Clown wrestling is all about comedy, not competition! Rubber chickens and pratfalls win the day.',
      skillTaught: 'Detail',
      tip: 'Describing your monster\'s personality helps create scenes that match their character!',
    },
  },
  {
    id: 'bs_clown_hide_seek',
    description: 'Clown hides behind a balloon but squeaky shoes give them away immediately',
    trigger: { monster: 'clown', equipment: '*', activity: 'hide_seek' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'spawn', asset: 'crate', position: 'cs-left' },
        { action: 'spawn_character', character: 'clown', position: 'off-right', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'cs-center', style: 'bounce' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'sit_floor' },
        { action: 'react', effect: 'bubbles', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'knight', to: 'ds-left', style: 'walk' },
        { action: 'sfx', sound: 'react' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-left' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '👟 SQUEAKY SHOES!',
      message: 'Hiding behind a balloon with squeaky shoes? This clown was doomed from the start! Stealth requires silence.',
      skillTaught: 'Specificity',
      tip: 'Mentioning quietly or sneakily helps your monster understand hide-and-seek better!',
    },
  },
  {
    id: 'bs_clown_race',
    description: 'Clown trips over their own giant shoes and tumbles across the finish line',
    trigger: { monster: 'clown', equipment: '*', activity: 'race' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'flag', position: 'cs-right' },
        { action: 'spawn_character', character: 'clown', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'ds-left', style: 'walk' },
        { action: 'move', character: 'ninja', to: 'ds-center', style: 'walk' },
        { action: 'animate', character: 'clown', anim: 'walk' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'ds-left' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'cs-center', style: 'tumble' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'cs-right', style: 'tumble' },
        { action: 'move', character: 'ninja', to: 'cs-center', style: 'walk' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'sit_floor' },
        { action: 'react', effect: 'stars-spin', position: 'cs-right' },
        { action: 'react', effect: 'laugh-tears', position: 'cs-right' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🤸 TUMBLE VICTORY!',
      message: 'This clown won by accident! Tripping over giant shoes and rolling to victory is peak clown energy.',
      skillTaught: 'Sequencing',
      tip: 'Try describing how your monster should move to avoid hilarious mishaps!',
    },
  },
  {
    id: 'bs_clown_jumping',
    description: 'Clown bounces on a ball and launches into the air in a spectacular jump',
    tier: 'subtle',
    trigger: { monster: 'clown', equipment: '*', activity: 'jumping' },
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'ball', position: 'cs-center' },
        { action: 'spawn_character', character: 'clown', position: 'ds-center', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'robot', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'jump_idle' },
        { action: 'move', character: 'clown', to: 'cs-center', style: 'bounce' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'jump_idle' },
        { action: 'move', character: 'clown', to: 'top', style: 'launch' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'cs-center', style: 'drop' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'taunt' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🎪 CIRCUS JUMP!',
      message: 'This clown used the ball as a trampoline for an epic launch! Perfect form, perfect landing.',
      skillTaught: 'Detail',
      tip: 'Adding how your monster jumps (high, far, carefully) creates more interesting scenes!',
    },
  },
  {
    id: 'bs_clown_climbing',
    description: 'Clown juggles while climbing and props fall on everyone below',
    trigger: { monster: 'clown', equipment: '*', activity: 'climbing' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'slide', position: 'cs-center' },
        { action: 'spawn_character', character: 'clown', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'clown', to: 'cs-center', style: 'climb' },
        { action: 'react', effect: 'bubbles', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'stars-spin', position: 'top' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'animate', character: 'knight', anim: 'get_bonked' },
        { action: 'react', effect: 'splash', position: 'cs-left' },
        { action: 'react', effect: 'dust', position: 'cs-right' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'jump_big' },
        { action: 'react', effect: 'laugh-tears', position: 'cs-center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🤹 JUGGLING DISASTER!',
      message: 'Climbing AND juggling? The clown succeeded but everyone below got bonked by falling props!',
      skillTaught: 'Focus',
      tip: 'Use one task at a time in your prompts to avoid chaotic multi-tasking!',
    },
  },

  // ── NINJA VIGNETTES ──
{
    id: 'bs_ninja_tag',
    description: 'Ninja moves so fast during tag that everyone gives up trying to catch them',
    trigger: { monster: 'ninja', equipment: '*', activity: 'tag' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'seesaw', position: 'cs-left' },
        { action: 'spawn', asset: 'slide', position: 'cs-right' },
        { action: 'spawn_character', character: 'ninja', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'off-left', to: 'ds-left', duration: 0.2, style: 'dash' },
        { action: 'move', character: 'barbarian', from: 'cs-center', to: 'ds-left', duration: 0.6, style: 'run' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'ds-left', to: 'cs-right', duration: 0.15, style: 'dash' },
        { action: 'animate', character: 'barbarian', anim: 'run_panic' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'cs-right', to: 'us-left', duration: 0.15, style: 'dash' },
        { action: 'move', character: 'knight', from: 'ds-right', to: 'cs-center', duration: 0.6, style: 'run' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
        { action: 'animate', character: 'knight', anim: 'sit_floor' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'Cheering' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '⚡ SPEED DEMON!',
      message: 'Your ninja was TOO fast! Nobody could even get close. Sometimes being the best means nobody wants to play.',
      skillTaught: 'Specificity',
      tip: 'Try describing speed that\'s fun but not impossible to match.',
    },
  },
  {
    id: 'bs_ninja_wrestling',
    description: 'Ninja uses stealth moves but keeps accidentally disappearing mid-match',
    trigger: { monster: 'ninja', equipment: '*', activity: 'wrestling' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'haybale', position: 'cs-center' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'ds-left', to: 'cs-center', duration: 0.4, style: 'normal' },
        { action: 'move', character: 'barbarian', from: 'ds-right', to: 'cs-center', duration: 0.4, style: 'normal' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'cast_spell' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'despawn', character: 'ninja' },
        { action: 'animate', character: 'barbarian', anim: 'run_panic' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'us-left', anim: 'spawn_air' },
        { action: 'react', effect: 'smoke', position: 'us-left' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'smoke', position: 'us-left' },
        { action: 'despawn', character: 'ninja' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'off-right', anim: 'spawn_ground' },
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🌫️ NOW YOU SEE ME...',
      message: 'Your ninja\'s stealth skills backfired! Hard to wrestle when you keep vanishing into thin air.',
      skillTaught: 'Context Awareness',
      tip: 'Think about when special abilities help vs when they cause problems.',
    },
  },
  {
    id: 'bs_ninja_hide_seek',
    description: 'Ninja is so good at hiding that nobody can ever find them and the game never ends',
    trigger: { monster: 'ninja', equipment: '*', activity: 'hide_seek' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'barrel', position: 'cs-left' },
        { action: 'spawn', asset: 'crate', position: 'cs-right' },
        { action: 'spawn', asset: 'sandbox', position: 'ds-right' },
        { action: 'spawn_character', character: 'ninja', position: 'cs-center', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_ground' },
        { action: 'animate', character: 'clown', anim: 'wave' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'cs-center', to: 'off-right', duration: 0.2, style: 'dash' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
        { action: 'despawn', character: 'ninja' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'move', character: 'clown', from: 'off-left', to: 'cs-left', duration: 0.5, style: 'normal' },
        { action: 'move', character: 'mage', from: 'off-right', to: 'cs-right', duration: 0.5, style: 'normal' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'run_panic' },
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'sit_floor' },
        { action: 'animate', character: 'mage', anim: 'sit_floor' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '👻 TOO GOOD!',
      message: 'Your ninja hid SO well that the game is still going! Being unbeatable isn\'t always fun for everyone.',
      skillTaught: 'Balance',
      tip: 'Perfect hiding means no one wins. Try making it challenging but not impossible.',
    },
  },
  {
    id: 'bs_ninja_race',
    description: 'Ninja teleports to the finish line before the race even starts',
    trigger: { monster: 'ninja', equipment: '*', activity: 'race' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'flag', position: 'us-right' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'ds-left' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'despawn', character: 'ninja' },
        { action: 'spawn_character', character: 'ninja', position: 'us-right', anim: 'spawn_air' },
        { action: 'react', effect: 'smoke', position: 'ds-left' },
        { action: 'react', effect: 'smoke', position: 'us-right' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'wave' },
        { action: 'react', effect: 'glow-pulse', position: 'us-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-center', to: 'cs-center', duration: 0.4, style: 'normal' },
        { action: 'move', character: 'knight', from: 'ds-right', to: 'cs-right', duration: 0.4, style: 'normal' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'animate', character: 'knight', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '⚡ TIME TRAVEL!',
      message: 'Your ninja won before anyone else moved! Teleporting to the finish is creative but kinda ruins the race.',
      skillTaught: 'Fair Play',
      tip: 'Winning is fun, but so is the journey. Think about what makes a game exciting.',
    },
  },
  {
    id: 'bs_ninja_jumping',
    description: 'Ninja does triple backflips but lands face-first in the sandbox',
    trigger: { monster: 'ninja', equipment: '*', activity: 'jumping' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sandbox', position: 'cs-center' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'jump_idle' },
        { action: 'move', character: 'ninja', from: 'ds-left', to: 'top', duration: 0.3, style: 'arc' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'jump_small' },
        { action: 'react', effect: 'stars-spin', position: 'top' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'top', to: 'cs-center', duration: 0.4, style: 'fall' },
        { action: 'react', effect: 'dust', position: 'top' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'get_bonked' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'taunt' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-right' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🤸 OVERACHIEVER!',
      message: 'Your ninja tried TOO many flips and crash-landed! Sometimes simpler is better than flashier.',
      skillTaught: 'Clarity',
      tip: 'Amazing tricks are cool, but only if you stick the landing. Keep it manageable.',
    },
  },
  {
    id: 'bs_ninja_climbing',
    description: 'Ninja runs up the slide like a wall and reaches the top instantly',
    trigger: { monster: 'ninja', equipment: '*', activity: 'climbing' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'slide', position: 'cs-center' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'ds-left', to: 'cs-center', duration: 0.15, style: 'dash' },
        { action: 'move', character: 'barbarian', from: 'ds-right', to: 'cs-center', duration: 0.5, style: 'normal' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'cs-center', to: 'us-left', duration: 0.2, style: 'wall_run' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'jump_big' },
        { action: 'react', effect: 'sparkle-magic', position: 'us-left' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🧗 WALL MASTER!',
      message: 'Your ninja defied gravity! Running up the slide like it\'s flat ground is peak ninja skills.',
      skillTaught: 'Creative Thinking',
      tip: 'You found a unique way to use the equipment. That\'s thinking outside the box!',
    },
  },

  // ── ROBOT VIGNETTES ──
{
    id: 'bs_robot_tag',
    description: 'Robot\'s targeting system locks on and chases everyone with precise mechanical movements',
    trigger: { monster: 'robot', equipment: '*', activity: 'tag' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'swing', position: 'cs-left' },
        { action: 'spawn', asset: 'seesaw', position: 'cs-right' },
        { action: 'spawn_character', character: 'robot', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'us-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'us-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'cast_spell' },
        { action: 'react', effect: 'glow-pulse', position: 'ds-center' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-center', to: 'us-left', duration: 0.4, style: 'mechanical' },
        { action: 'move', character: 'clown', from: 'us-left', to: 'cs-left', duration: 0.4, style: 'run' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'throw' },
        { action: 'animate', character: 'clown', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'cs-left' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: 'us-left' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🎯 TARGET ACQUIRED!',
      message: 'Your robot\'s precision tracking made tag unstoppable! Like a heat-seeking missile of fun.',
      skillTaught: 'Precision',
      tip: 'Using specific abilities (like targeting) makes your prompt more vivid and unique.',
    },
  },
  {
    id: 'bs_robot_wrestling',
    description: 'Robot\'s joints lock up mid-wrestle and it falls over like a statue',
    trigger: { monster: 'robot', equipment: '*', activity: 'wrestling' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'haybale', position: 'cs-center' },
        { action: 'spawn_character', character: 'robot', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-left', to: 'cs-center', duration: 0.5, style: 'mechanical' },
        { action: 'move', character: 'barbarian', from: 'ds-right', to: 'cs-center', duration: 0.4, style: 'normal' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'throw' },
        { action: 'animate', character: 'barbarian', anim: 'throw' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'react', effect: 'steam', position: 'cs-center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'wave' },
        { action: 'react', effect: 'stars-spin', position: 'cs-right' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🤖 SYSTEM ERROR!',
      message: 'Your robot froze up mid-match! Turns out mechanical joints don\'t flex like muscles do.',
      skillTaught: 'Consequences',
      tip: 'Think about how different types of characters might struggle with certain activities.',
    },
  },
  {
    id: 'bs_robot_hide_seek',
    description: 'Robot\'s blinking lights and beeping sounds give away every hiding spot',
    trigger: { monster: 'robot', equipment: '*', activity: 'hide_seek' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'barrel', position: 'cs-left' },
        { action: 'spawn', asset: 'crate', position: 'cs-right' },
        { action: 'spawn_character', character: 'robot', position: 'cs-center', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'off-left', anim: 'spawn_ground' },
        { action: 'animate', character: 'knight', anim: 'wave' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'cs-center', to: 'cs-left', duration: 0.4, style: 'mechanical' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'glow-pulse', position: 'cs-left' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'knight', from: 'off-left', to: 'cs-left', duration: 0.3, style: 'run' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'react', effect: 'stars-spin', position: 'cs-left' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'laugh-tears', position: 'cs-left' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '💡 BLINKING BETRAYAL!',
      message: 'Your robot\'s lights and beeps made hiding impossible! Sometimes your coolest features work against you.',
      skillTaught: 'Irony',
      tip: 'Think about how a character\'s traits might create funny problems in certain situations.',
    },
  },
  {
    id: 'bs_robot_race',
    description: 'Robot calculates optimal route but overheats halfway through the race',
    trigger: { monster: 'robot', equipment: '*', activity: 'race' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'flag', position: 'us-right' },
        { action: 'spawn_character', character: 'robot', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'cast_spell' },
        { action: 'react', effect: 'glow-pulse', position: 'ds-left' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-left', to: 'cs-left', duration: 0.3, style: 'dash' },
        { action: 'move', character: 'ninja', from: 'ds-center', to: 'cs-center', duration: 0.4, style: 'normal' },
        { action: 'move', character: 'clown', from: 'ds-right', to: 'cs-right', duration: 0.5, style: 'normal' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'steam', position: 'cs-left' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-left' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'cs-center', to: 'us-right', duration: 0.3, style: 'dash' },
        { action: 'animate', character: 'ninja', anim: 'jump_big' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🔥 OVERHEATED!',
      message: 'Your robot started strong with perfect calculations but couldn\'t handle the pace! Even machines have limits.',
      skillTaught: 'Pacing',
      tip: 'Starting fast is great, but finishing matters more. Balance power with endurance.',
    },
  },
  {
    id: 'bs_robot_jumping',
    description: 'Robot\'s springs launch them too high and they float slowly back down',
    trigger: { monster: 'robot', equipment: '*', activity: 'jumping' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'seesaw', position: 'cs-center' },
        { action: 'spawn_character', character: 'robot', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'jump_idle' },
        { action: 'react', effect: 'glow-pulse', position: 'ds-center' },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-center', to: 'top', duration: 0.5, style: 'arc' },
        { action: 'react', effect: 'steam', position: 'ds-center' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'jump_small' },
        { action: 'react', effect: 'stars-spin', position: 'top' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'top', to: 'cs-center', duration: 1.0, style: 'float' },
        { action: 'react', effect: 'sparkle-magic', position: 'top' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'Cheering' },
        { action: 'react', effect: 'laugh-tears', position: 'ds-right' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🚀 TO INFINITY!',
      message: 'Your robot launched into orbit! Those springs were WAY too powerful for a playground jump.',
      skillTaught: 'Moderation',
      tip: 'Bigger isn\'t always better. Sometimes you need to dial back the power for safety.',
    },
  },
  {
    id: 'bs_robot_climbing',
    description: 'Robot magnetizes to the metal equipment and gets stuck to everything',
    trigger: { monster: 'robot', equipment: '*', activity: 'climbing' },
    tier: 'subtle',
    promptScore: 'partial',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'slide', position: 'cs-center' },
        { action: 'spawn_character', character: 'robot', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-left', to: 'cs-center', duration: 0.4, style: 'mechanical' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'cast_spell' },
        { action: 'react', effect: 'glow-pulse', position: 'cs-center' },
        { action: 'sfx', sound: 'magic' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', from: 'ds-right', to: 'cs-center', duration: 0.4, style: 'normal' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'throw' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-center' },
        { action: 'animate', character: 'robot', anim: 'wave' },
      ], delayAfter: 0 },
    ],
    feedback: {
      title: '🧲 MAGNETIC MAYHEM!',
      message: 'Your robot stuck to the slide like a fridge magnet! Cool idea but made climbing pretty tricky.',
      skillTaught: 'Problem Solving',
      tip: 'Magnets are helpful for some things, but can cause sticky situations (literally!).',
    },
  },

  // ── CAVEMAN VIGNETTES ──
{
    id: 'bs_caveman_tag',
    description: 'Caveman invents his own version of tag by bonking everyone with a club',
    trigger: { monster: 'caveman', equipment: '*', activity: 'tag' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sandbox', position: 'cs-center' },
        { action: 'spawn_character', character: 'caveman', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'caveman', from: 'off-left', to: 'cs-left', duration: 1.0 },
      ], delayAfter: 0.2 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'throw' },
        { action: 'animate', character: 'barbarian', anim: 'get_bonked' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', from: 'cs-left', to: 'off-right', duration: 0.8 },
        { action: 'move', character: 'ninja', from: 'cs-right', to: 'off-right', duration: 0.8 },
        { action: 'animate', character: 'barbarian', anim: 'run_panic' },
        { action: 'animate', character: 'ninja', anim: 'run_panic' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'wave' },
        { action: 'react', effect: 'dust', position: 'cs-center' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🏃 BONK TAG!',
      message: 'Caveman thought tag meant bonking people with clubs. Everyone ran away fast!',
      skillTaught: 'Specificity',
      tip: 'Being specific about HOW to play helps avoid wild interpretations.',
    },
  },
  {
    id: 'bs_caveman_wrestling',
    description: 'Caveman wrestles a barrel thinking it is an opponent',
    trigger: { monster: 'caveman', equipment: '*', activity: 'wrestling' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'spawn_character', character: 'caveman', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'caveman', from: 'off-left', to: 'cs-left', duration: 1.0 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'throw' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'despawn', asset: 'barrel' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'cs-left' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'cs-right', anim: 'spawn_ground' },
        { action: 'react', effect: 'question-marks', position: 'cs-right' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🤼 BARREL BATTLE!',
      message: 'Caveman wrestled a barrel instead of a friend. The barrel won!',
      skillTaught: 'Specificity',
      tip: 'Specify WHO to wrestle with so you get a real opponent.',
    },
  },
  {
    id: 'bs_caveman_hide_seek',
    description: 'Caveman tries to hide by standing still with arms out like a tree',
    trigger: { monster: 'caveman', equipment: '*', activity: 'hide_seek' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'caveman', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'spawn', asset: 'haybale', position: 'cs-left' },
        { action: 'spawn', asset: 'barrel', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'jump_idle' },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'ninja', from: 'off-left', to: 'ds-left', duration: 1.0 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'ds-left' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'wave' },
        { action: 'animate', character: 'caveman', anim: 'get_bonked' },
        { action: 'react', effect: 'laugh-tears', position: 'cs-center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🌳 TREE DISGUISE!',
      message: 'Caveman stood still with arms out like a tree. Ninja spotted him immediately!',
      skillTaught: 'Specificity',
      tip: 'Be specific about WHERE to hide for better camouflage.',
    },
  },
  {
    id: 'bs_caveman_race',
    description: 'Caveman does not understand ready set go and just stands there grunting',
    trigger: { monster: 'caveman', equipment: '*', activity: 'race' },
    tier: 'subtle',
    promptScore: 'partial',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'flag', position: 'cs-right' },
        { action: 'spawn_character', character: 'caveman', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-center', to: 'cs-right', duration: 1.5 },
        { action: 'move', character: 'knight', from: 'ds-right', to: 'cs-right', duration: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'ds-left' },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'animate', character: 'robot', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'wave' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'sit_floor' },
        { action: 'react', effect: 'dust', position: 'ds-left' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🏁 CONFUSED RACER!',
      message: 'Caveman did not know when to start running. Everyone else finished first!',
      skillTaught: 'Clarity',
      tip: 'Explain the rules clearly so everyone knows what to do.',
    },
  },
  {
    id: 'bs_caveman_jumping',
    description: 'Caveman jumps and lands so hard they make a crater',
    trigger: { monster: 'caveman', equipment: '*', activity: 'jumping' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sandbox', position: 'cs-center' },
        { action: 'spawn_character', character: 'caveman', position: 'cs-center', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'jump_small' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'sfx', sound: 'react' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'react', effect: 'dust', position: 'cs-left' },
        { action: 'react', effect: 'dust', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'run_panic' },
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'move', character: 'barbarian', from: 'ds-left', to: 'off-left', duration: 0.8 },
        { action: 'move', character: 'mage', from: 'ds-right', to: 'off-right', duration: 0.8 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'jump_big' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '💥 EARTHQUAKE JUMP!',
      message: 'Caveman jumped so hard they made a crater! Everyone felt the shockwave!',
      skillTaught: 'Detail',
      tip: 'Add details about HOW to jump for safer playground fun.',
    },
  },
  {
    id: 'bs_caveman_climbing',
    description: 'Caveman tries to climb by stacking rocks but the pile collapses',
    trigger: { monster: 'caveman', equipment: '*', activity: 'climbing' },
    tier: 'moderate',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'caveman', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn', asset: 'crate', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'barrel', position: 'cs-center' },
        { action: 'animate', character: 'caveman', anim: 'throw' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'haybale', position: 'cs-center' },
        { action: 'animate', character: 'caveman', anim: 'throw' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'caveman', from: 'cs-left', to: 'cs-center', duration: 0.5 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'despawn', asset: 'crate' },
        { action: 'despawn', asset: 'barrel' },
        { action: 'despawn', asset: 'haybale' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'caveman', anim: 'sit_floor' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🪨 TOWER TUMBLE!',
      message: 'Caveman built a wobbly rock tower to climb. It fell apart immediately!',
      skillTaught: 'Specificity',
      tip: 'Specify WHAT to climb on for safer, sturdier options.',
    },
  },

  // ── EVERYONE VIGNETTES ──
{
    id: 'bs_everyone_tag',
    description: 'All monsters play tag at once creating total mayhem',
    trigger: { monster: 'everyone', equipment: '*', activity: 'tag' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sandbox', position: 'cs-center' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'us-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', from: 'ds-left', to: 'cs-center', duration: 0.5 },
        { action: 'move', character: 'ninja', from: 'ds-right', to: 'cs-left', duration: 0.5 },
        { action: 'move', character: 'robot', from: 'us-left', to: 'cs-right', duration: 0.5 },
        { action: 'animate', character: 'barbarian', anim: 'run_panic' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'dust', position: 'cs-center' },
        { action: 'react', effect: 'dust', position: 'cs-left' },
        { action: 'react', effect: 'dust', position: 'cs-right' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', from: 'cs-center', to: 'off-right', duration: 0.8 },
        { action: 'move', character: 'ninja', from: 'cs-left', to: 'off-left', duration: 0.8 },
        { action: 'move', character: 'robot', from: 'cs-right', to: 'off-right', duration: 0.8 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🏃 TOTAL TAG CHAOS!',
      message: 'Everyone playing tag at once means everyone is both IT and running away!',
      skillTaught: 'Specificity',
      tip: 'Choose ONE monster to be IT first to avoid total confusion.',
    },
  },
  {
    id: 'bs_everyone_wrestling',
    description: 'Royal rumble on the seesaw breaks it under everyone combined weight',
    trigger: { monster: 'everyone', equipment: '*', activity: 'wrestling' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'seesaw', position: 'cs-center' },
        { action: 'spawn_character', character: 'barbarian', position: 'off-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', from: 'off-left', to: 'cs-left', duration: 1.0 },
        { action: 'move', character: 'knight', from: 'off-left', to: 'cs-right', duration: 1.0 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn_character', character: 'robot', position: 'off-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'off-right', to: 'cs-center', duration: 0.8 },
        { action: 'move', character: 'mage', from: 'off-right', to: 'cs-center', duration: 0.8 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'despawn', asset: 'seesaw' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
        { action: 'animate', character: 'knight', anim: 'sit_floor' },
        { action: 'animate', character: 'robot', anim: 'get_bonked' },
        { action: 'animate', character: 'mage', anim: 'get_bonked' },
        { action: 'react', effect: 'stars-spin', position: 'cs-center' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🤼 SEESAW SMASH!',
      message: 'Everyone wrestled on the seesaw at once. It broke under all that weight!',
      skillTaught: 'Context Awareness',
      tip: 'Think about WHERE you wrestle. A seesaw cannot hold everyone!',
    },
  },
  {
    id: 'bs_everyone_hide_seek',
    description: 'Everyone hides at once so nobody is it and they all wait forever',
    trigger: { monster: 'everyone', equipment: '*', activity: 'hide_seek' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'barrel', position: 'cs-left' },
        { action: 'spawn', asset: 'haybale', position: 'cs-right' },
        { action: 'spawn', asset: 'crate', position: 'ds-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'ninja', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'cs-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 1.5 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-left' },
        { action: 'react', effect: 'question-marks', position: 'cs-right' },
        { action: 'react', effect: 'question-marks', position: 'ds-center' },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'sit_floor' },
        { action: 'animate', character: 'mage', anim: 'sit_floor' },
        { action: 'animate', character: 'clown', anim: 'sit_floor' },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'react', effect: 'bubbles', position: 'cs-center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🙈 NOBODY SEEKS!',
      message: 'Everyone hid but nobody was chosen to seek. They waited and waited and waited...',
      skillTaught: 'Role Assignment',
      tip: 'Pick ONE monster to be the seeker before everyone else hides!',
    },
  },
  {
    id: 'bs_everyone_race',
    description: 'All monsters race but each cheats in their own unique way',
    tier: 'moderate',
    promptScore: 'perfect',
    trigger: { monster: 'everyone', equipment: '*', activity: 'race' },
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'flag', position: 'cs-right' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'despawn', character: 'ninja' },
        { action: 'spawn_character', character: 'ninja', position: 'cs-right', anim: 'spawn_ground' },
        { action: 'react', effect: 'smoke', position: 'ds-left' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'robot', from: 'ds-center', to: 'cs-right', duration: 0.8 },
        { action: 'react', effect: 'glow-pulse', position: 'ds-center' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'barbarian', from: 'ds-right', to: 'cs-right', duration: 1.2 },
        { action: 'animate', character: 'barbarian', anim: 'run_panic' },
        { action: 'react', effect: 'dust', position: 'ds-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'ninja', anim: 'Cheering' },
        { action: 'animate', character: 'robot', anim: 'wave' },
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'cs-right' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🏁 CHEATER RACE!',
      message: 'Ninja teleported, robot calculated shortcuts, barbarian smashed through. Everyone cheated!',
      skillTaught: 'Fair Play',
      tip: 'Set clear race rules so everyone plays fairly and has fun.',
    },
  },
  {
    id: 'bs_everyone_jumping',
    description: 'Everyone jumps at the same time creating a synchronized earthquake',
    trigger: { monster: 'everyone', equipment: '*', activity: 'jumping' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'sandbox', position: 'cs-center' },
        { action: 'spawn_character', character: 'barbarian', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'jump_small' },
        { action: 'animate', character: 'knight', anim: 'jump_small' },
        { action: 'animate', character: 'robot', anim: 'jump_small' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-center' },
        { action: 'react', effect: 'dust', position: 'cs-left' },
        { action: 'react', effect: 'dust', position: 'cs-right' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'us-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'us-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'run_panic' },
        { action: 'animate', character: 'clown', anim: 'run_panic' },
        { action: 'move', character: 'mage', from: 'us-left', to: 'off-left', duration: 0.8 },
        { action: 'move', character: 'clown', from: 'us-right', to: 'off-right', duration: 0.8 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'wave' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'animate', character: 'robot', anim: 'jump_big' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '💥 SYNCHRONIZED QUAKE!',
      message: 'Everyone jumped together and made an earthquake! Perfect teamwork makes the ground shake!',
      skillTaught: 'Coordination',
      tip: 'When everyone works together, amazing things happen!',
    },
  },
  {
    id: 'bs_everyone_climbing',
    description: 'Everyone climbs the same slide at once causing a traffic jam pile-up at the top',
    trigger: { monster: 'everyone', equipment: '*', activity: 'climbing' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'slide', position: 'cs-center' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'barbarian', from: 'ds-left', to: 'cs-left', duration: 1.0 },
        { action: 'move', character: 'ninja', from: 'ds-center', to: 'cs-center', duration: 1.0 },
        { action: 'move', character: 'clown', from: 'ds-right', to: 'cs-right', duration: 1.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-left' },
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
        { action: 'react', effect: 'question-marks', position: 'cs-right' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'animate', character: 'barbarian', anim: 'sit_floor' },
        { action: 'animate', character: 'ninja', anim: 'sit_floor' },
        { action: 'animate', character: 'clown', anim: 'sit_floor' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'dust', position: 'cs-center' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 },
    ],
    feedback: {
      title: '🛝 SLIDE TRAFFIC JAM!',
      message: 'Everyone tried to climb the slide at once. They got stuck at the top in a pile!',
      skillTaught: 'Turn-Taking',
      tip: 'Take turns climbing so everyone gets a chance without crashing.',
    },
  },

];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const BARBARIAN_SCHOOL_DEFAULT: Vignette = {
  id: 'barbarian_school_default',
  description: 'Monsters gather at the playground for a generic recess scene.',
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
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'glow-pulse', position: 'center' },
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

// ─── STAGE 2 VIGNETTES ──────────────────────────────────────────────────────

export const BARBARIAN_SCHOOL_STAGE_2: Vignette[] = [

  // ── SLEEPY + HIDE_SEEK + SANDBOX + SUNNY ────────────────────────────────────
  {
    id: 'bs2_sleepy_ninja_hide_sandbox_sunny',
    description: 'A sleepy ninja tries to play hide-and-seek in the sandbox but keeps falling asleep mid-hide.',
    trigger: { energy: 'sleepy', monster: 'ninja', activity: 'hide_seek', equipment: 'sandbox', weather: 'sunny' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'sandbox', position: 'center' },
          { action: 'spawn', asset: 'tree_cartoon', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'ninja', emoji: '😴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'walk' },
          { action: 'text_popup', text: '😴 So... sleepy...', position: 'top', size: 'large' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'die_flop' },
          { action: 'react', effect: 'question-marks', position: 'center' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '🔍' },
          { action: 'text_popup', text: '🤡 FOUND YOU! 🤡', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😴 Sleepy Stealth Fail',
      message: "A sleepy ninja trying to hide? They fell asleep before they could finish hiding! Energy level matters!",
      skillTaught: 'Specificity',
      tip: "Energy changes how a character acts. Try hyper for wild energy!",
    },
    vagueComparison: {
      vague: "ninja + hide_seek + sandbox",
      vagueResult: "Ninja vanishes perfectly in sandbox",
      specific: "sleepy ninja + hide_seek + sandbox",
      specificResult: "Ninja falls asleep while hiding and gets found immediately!",
      why: "Adding ENERGY changes the whole scene — sleepy monsters play differently!",
    },
  },

  // ── MEGA_HYPER + RACE + FIELD + WINDY ───────────────────────────────────────
  {
    id: 'bs2_mega_hyper_robot_race_field_windy',
    description: 'A MEGA hyper robot races across the field in windy weather, goes way too fast, and launches into the sky.',
    trigger: { energy: 'MEGA_hyper', monster: 'robot', activity: 'race', equipment: 'field', weather: 'windy' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'spawn', asset: 'cone_traffic', position: 'left' },
          { action: 'spawn', asset: 'cone_traffic', position: 'right' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'robot', emoji: '⚡' },
          { action: 'text_popup', text: '⚡ TURBO MODE! ⚡', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'jump_idle' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'text_popup', text: '🌪️ TOO FAST! 🌪️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'spin_attack' },
          { action: 'react', effect: 'stars-spin', position: 'top' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '🤖 ROBOT FLIES AWAY! 🤖', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ MEGA HYPER CHAOS!',
      message: "A MEGA hyper robot in windy weather? They went SO FAST they flew away! Energy + Weather = WILD results!",
      skillTaught: 'Specificity',
      tip: "MEGA hyper energy makes everything EXTREME. Combine with weather for epic chaos!",
    },
    vagueComparison: {
      vague: "robot + race + field",
      vagueResult: "Robot races across the field normally",
      specific: "MEGA_hyper robot + race + field + windy",
      specificResult: "Robot goes TOO FAST, wind catches them, and they fly away like a rocket!",
      why: "Energy level + weather makes the scene way more exciting!",
    },
  },

  // ── SLEEPY + CLIMBING + SLIDE + RAINY ───────────────────────────────────────
  {
    id: 'bs2_sleepy_barbarian_climbing_slide_rainy',
    description: 'A sleepy barbarian tries to climb a wet slide in the rain, slips, and takes a nap at the bottom.',
    trigger: { energy: 'sleepy', monster: 'barbarian', activity: 'climbing', equipment: 'slide', weather: 'rainy' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'slide', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '😴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'walk' },
          { action: 'text_popup', text: '💤 Must... climb...', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'get_hit' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'text_popup', text: '💧 SLIP! 💧', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'die_flop' },
          { action: 'emote', character: 'barbarian', emoji: '😴' },
          { action: 'text_popup', text: '😴 NAP TIME 😴', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💤 Rainy Sleepy Slip',
      message: "A sleepy barbarian climbing a rainy slide? They slipped and fell asleep! Weather + Energy = new challenges!",
      skillTaught: 'Specificity',
      tip: "Rainy weather makes things slippery. Sleepy monsters need gentle activities!",
    },
    vagueComparison: {
      vague: "barbarian + climbing + slide",
      vagueResult: "Barbarian climbs the slide powerfully",
      specific: "sleepy barbarian + climbing + slide + rainy",
      specificResult: "Sleepy barbarian slips on wet slide and falls asleep!",
      why: "Weather and energy combine to make the outcome totally different!",
    },
  },

  // ── HYPER + TAG + SWING + SNOWY ─────────────────────────────────────────────
  {
    id: 'bs2_hyper_ninja_tag_swing_snowy',
    description: 'A hyper ninja plays tag on swings during snow, bounces everywhere making snowballs fly.',
    trigger: { energy: 'hyper', monster: 'ninja', activity: 'tag', equipment: 'swing', weather: 'snowy' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'swing_set', position: 'center' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'left', anim: 'spawn_air' },
          { action: 'emote', character: 'ninja', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'jump_idle' },
          { action: 'text_popup', text: '🥷 SNOW TAG! 🥷', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'spin_attack' },
          { action: 'react', effect: 'snowflakes', position: 'left' },
          { action: 'react', effect: 'snowflakes', position: 'right' },
          { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'robot', position: 'bottom', anim: 'spawn_ground' },
          { action: 'crowd_react', characters: 'all', anim: 'wave' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '❄️ Hyper Snow Tag!',
      message: "A hyper ninja in the snow created a SNOWBALL TORNADO! Energy + Weather = amazing combos!",
      skillTaught: 'Specificity',
      tip: "Snowy weather adds snow effects. Hyper energy makes them fly everywhere!",
    },
    vagueComparison: {
      vague: "ninja + tag + swing",
      vagueResult: "Ninja plays tag on swings",
      specific: "hyper ninja + tag + swing + snowy",
      specificResult: "Hyper ninja creates a snowball tornado on the swings!",
      why: "Energy + weather creates special effects you wouldn't see otherwise!",
    },
  },

  // ── HYPER + JUMPING + MERRY_GO_ROUND + WINDY ────────────────────────────────
  {
    id: 'bs2_hyper_caveman_jumping_merry_windy',
    description: 'A hyper caveman jumps on the merry-go-round in windy weather, spins out of control.',
    trigger: { energy: 'hyper', monster: 'caveman', activity: 'jumping', equipment: 'merry_go_round', weather: 'windy' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'merry_go_round', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'caveman', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'caveman', emoji: '🦴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'jump_idle' },
          { action: 'text_popup', text: '🦴 JUMP JUMP! 🦴', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'spin_attack' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'camera_shake', intensity: 0.7, duration: 0.6 },
          { action: 'text_popup', text: '🌪️ SPIN FASTER! 🌪️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'die_dramatic' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'text_popup', text: '💫 TOO DIZZY! 💫', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌪️ Hyper Wind Spin!',
      message: "A hyper caveman on the merry-go-round in windy weather? They spun SO FAST they got dizzy!",
      skillTaught: 'Specificity',
      tip: "Hyper + windy weather = EXTREME spinning. Be careful with wild combos!",
    },
    vagueComparison: {
      vague: "caveman + jumping + merry_go_round",
      vagueResult: "Caveman jumps on merry-go-round",
      specific: "hyper caveman + jumping + merry_go_round + windy",
      specificResult: "Wind makes it spin faster, hyper caveman gets too dizzy!",
      why: "Energy and weather stack together to create extreme results!",
    },
  },

  // ── NORMAL + WRESTLING + SEESAW + SUNNY ─────────────────────────────────────
  {
    id: 'bs2_normal_barbarian_wrestling_seesaw_sunny',
    description: 'A normal energy barbarian wrestles on the seesaw in sunny weather — perfectly balanced chaos.',
    trigger: { energy: 'normal', monster: 'barbarian', activity: 'wrestling', equipment: 'seesaw', weather: 'sunny' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'seesaw', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'caveman', position: 'right', anim: 'spawn_ground' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'animate', character: 'caveman', anim: 'taunt' },
          { action: 'text_popup', text: '🤼 SEESAW BATTLE! 🤼', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'animate', character: 'caveman', anim: 'idle' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤼 Balanced Battle',
      message: "Normal energy = a good match! Sunny weather = perfect conditions. Not too crazy, not too boring!",
      skillTaught: 'Specificity',
      tip: "Normal energy is reliable. Add different energy for wild surprises!",
    },
    vagueComparison: {
      vague: "barbarian + wrestling + seesaw",
      vagueResult: "Barbarians wrestle on seesaw",
      specific: "normal barbarian + wrestling + seesaw + sunny",
      specificResult: "Perfect balanced wrestling match in nice weather!",
      why: "Normal energy and sunny weather keep things stable and fun!",
    },
  },

  // ── SLEEPY + RACE + FIELD + SUNNY ───────────────────────────────────────────
  {
    id: 'bs2_sleepy_clown_race_field_sunny',
    description: 'A sleepy clown tries to race on the field but keeps yawning and walking slowly.',
    trigger: { energy: 'sleepy', monster: 'clown', activity: 'race', equipment: 'field', weather: 'sunny' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'spawn', asset: 'cone_traffic', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '😴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'walk' },
          { action: 'text_popup', text: '😴 Yawn... race... yawn...', position: 'top', size: 'large' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '🐌 SLOWEST RACE EVER! 🐌', position: 'center', size: 'huge' },
          { action: 'react', effect: 'question-marks', position: 'center' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🐌 Sleepy Slow Race',
      message: "A sleepy clown racing? They walked so slowly it wasn't really a race! Energy changes everything!",
      skillTaught: 'Specificity',
      tip: "Sleepy energy makes things slow. Pick hyper for fast action!",
    },
    vagueComparison: {
      vague: "clown + race + field",
      vagueResult: "Clown races across field",
      specific: "sleepy clown + race + field",
      specificResult: "Clown walks so slowly it's not even a race!",
      why: "Energy level totally changes how fast or slow the action is!",
    },
  },

  // ── MEGA_HYPER + CLIMBING + SLIDE + RAINY ───────────────────────────────────
  {
    id: 'bs2_mega_hyper_ninja_climbing_slide_rainy',
    description: 'A MEGA hyper ninja climbs a rainy slide, slips up and down repeatedly in pure chaos.',
    trigger: { energy: 'MEGA_hyper', monster: 'ninja', activity: 'climbing', equipment: 'slide', weather: 'rainy' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'slide', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'ninja', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'walk' },
          { action: 'text_popup', text: '⚡ CLIMB FAST! ⚡', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'get_hit' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'text_popup', text: '💧 SLIP! 💧', position: 'center', size: 'large' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'jump_idle' },
          { action: 'text_popup', text: '⚡ TRY AGAIN! ⚡', position: 'top', size: 'large' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'spin_attack' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.7, duration: 0.6 },
          { action: 'text_popup', text: '🌪️ SLIP CHAOS! 🌪️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ MEGA Hyper Rain Chaos!',
      message: "MEGA hyper ninja on a rainy slide? They tried SO HARD but kept slipping! Energy vs. Weather = chaos!",
      skillTaught: 'Specificity',
      tip: "MEGA hyper energy fights rainy weather = wild, unpredictable results!",
    },
    vagueComparison: {
      vague: "ninja + climbing + slide",
      vagueResult: "Ninja climbs slide smoothly",
      specific: "MEGA_hyper ninja + climbing + slide + rainy",
      specificResult: "Ninja tries SO HARD but rain makes them slip up and down!",
      why: "MEGA hyper energy + rainy weather creates a funny battle!",
    },
  },

  // ── HYPER + HIDE_SEEK + SANDBOX + WINDY ─────────────────────────────────────
  {
    id: 'bs2_hyper_robot_hide_sandbox_windy',
    description: 'A hyper robot hides in the sandbox but wind keeps blowing sand everywhere revealing them.',
    trigger: { energy: 'hyper', monster: 'robot', activity: 'hide_seek', equipment: 'sandbox', weather: 'windy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'sandbox', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'robot', emoji: '🤖' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'text_popup', text: '🤖 HIDE! HIDE! 🤖', position: 'top', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'text_popup', text: '🌪️ SAND EVERYWHERE! 🌪️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '👀' },
          { action: 'text_popup', text: '🤡 I SEE YOU! 🤡', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌪️ Windy Hide Fail',
      message: "A hyper robot tried to hide but the wind blew all the sand away! Weather matters for hiding!",
      skillTaught: 'Specificity',
      tip: "Windy weather makes hiding harder. Try sunny or rainy instead!",
    },
    vagueComparison: {
      vague: "robot + hide_seek + sandbox",
      vagueResult: "Robot hides in sandbox",
      specific: "hyper robot + hide_seek + sandbox + windy",
      specificResult: "Wind blows sand away and reveals the hiding robot!",
      why: "Weather conditions affect how well hiding works!",
    },
  },

  // ── MEGA_HYPER + TAG + FIELD + SNOWY ────────────────────────────────────────
  {
    id: 'bs2_mega_hyper_caveman_tag_field_snowy',
    description: 'A MEGA hyper caveman plays tag in snowy field, runs so fast they create a snow tornado.',
    trigger: { energy: 'MEGA_hyper', monster: 'caveman', activity: 'tag', equipment: 'field', weather: 'snowy' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'caveman', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'caveman', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'walk' },
          { action: 'react', effect: 'snowflakes', position: 'left' },
          { action: 'text_popup', text: '⚡ MEGA TAG! ⚡', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'spin_attack' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'camera_shake', intensity: 0.7, duration: 0.7 },
          { action: 'text_popup', text: '❄️ SNOW TORNADO! ❄️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'jump_big' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '❄️ MEGA Snow Tornado!',
      message: "A MEGA hyper caveman in the snow ran SO FAST they created a snow tornado! Perfect energy + weather combo!",
      skillTaught: 'Specificity',
      tip: "MEGA hyper + snowy = amazing visual effects! Try different combos!",
    },
    vagueComparison: {
      vague: "caveman + tag + field",
      vagueResult: "Caveman plays tag on field",
      specific: "MEGA_hyper caveman + tag + field + snowy",
      specificResult: "Caveman runs so fast in snow they create a tornado!",
      why: "MEGA energy + snow weather = spectacular visual effects!",
    },
  },

  // ── NORMAL + JUMPING + SEESAW + RAINY ───────────────────────────────────────
  {
    id: 'bs2_normal_ninja_jumping_seesaw_rainy',
    description: 'A normal energy ninja jumps on a rainy seesaw, everything stays balanced and controlled.',
    trigger: { energy: 'normal', monster: 'ninja', activity: 'jumping', equipment: 'seesaw', weather: 'rainy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'seesaw', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'jump_idle' },
          { action: 'animate', character: 'robot', anim: 'idle' },
          { action: 'text_popup', text: '☔ Rainy Seesaw ☔', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'Cheering' },
          { action: 'animate', character: 'robot', anim: 'wave' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '☔ Balanced Rain Play',
      message: "Normal energy in rainy weather = controlled fun! Not too wild, not too boring!",
      skillTaught: 'Specificity',
      tip: "Normal energy keeps things steady even in rainy weather!",
    },
    vagueComparison: {
      vague: "ninja + jumping + seesaw",
      vagueResult: "Ninja jumps on seesaw",
      specific: "normal ninja + jumping + seesaw + rainy",
      specificResult: "Ninja stays balanced even in rain!",
      why: "Normal energy + weather = predictable, controlled results!",
    },
  },

  // ── HYPER + WRESTLING + SWING + SUNNY ───────────────────────────────────────
  {
    id: 'bs2_hyper_barbarian_wrestling_swing_sunny',
    description: 'A hyper barbarian wrestles on swings in sunny weather, swings go wild but everyone has fun.',
    trigger: { energy: 'hyper', monster: 'barbarian', activity: 'wrestling', equipment: 'swing', weather: 'sunny' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'swing_set', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'caveman', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '💪' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'animate', character: 'caveman', anim: 'taunt' },
          { action: 'text_popup', text: '💪 SWING WRESTLING! 💪', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'animate', character: 'caveman', anim: 'spin_attack' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'taunt' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'text_popup', text: '☀️ SUNNY CHAOS! ☀️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💪 Hyper Swing Battle!',
      message: "Hyper barbarian wrestling on swings in sunny weather = wild fun! Energy makes it exciting!",
      skillTaught: 'Specificity',
      tip: "Hyper energy makes activities more intense. Try MEGA_hyper for even more!",
    },
    vagueComparison: {
      vague: "barbarian + wrestling + swing",
      vagueResult: "Barbarian wrestles on swings",
      specific: "hyper barbarian + wrestling + swing + sunny",
      specificResult: "Hyper energy makes the swings go wild in perfect sunny weather!",
      why: "Energy level controls how intense the action gets!",
    },
  },

  // ── SLEEPY + TAG + MERRY_GO_ROUND + WINDY ───────────────────────────────────
  {
    id: 'bs2_sleepy_clown_tag_merry_windy',
    description: 'A sleepy clown tries tag on the merry-go-round in wind, just sits down and spins slowly.',
    trigger: { energy: 'sleepy', monster: 'clown', activity: 'tag', equipment: 'merry_go_round', weather: 'windy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'merry_go_round', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '😴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'walk' },
          { action: 'text_popup', text: '😴 Too... tired... for tag...', position: 'top', size: 'large' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'die_flop' },
          { action: 'text_popup', text: '💤 SLOW SPIN 💤', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💤 Sleepy Spin',
      message: "A sleepy clown just sat on the merry-go-round instead of playing tag! Sleepy = slow activities!",
      skillTaught: 'Specificity',
      tip: "Sleepy energy makes monsters too tired for active games!",
    },
    vagueComparison: {
      vague: "clown + tag + merry_go_round",
      vagueResult: "Clown plays tag on merry-go-round",
      specific: "sleepy clown + tag + merry_go_round + windy",
      specificResult: "Sleepy clown just sits and spins slowly!",
      why: "Sleepy energy makes active games turn into naps!",
    },
  },

  // ── SLEEPY + JUMPING + SLIDE + SNOWY ────────────────────────────────────────
  {
    id: 'bs2_sleepy_robot_jumping_slide_snowy',
    description: 'A sleepy robot tries to jump on a slide in the snow, barely gets off the ground.',
    trigger: { energy: 'sleepy', monster: 'robot', activity: 'jumping', equipment: 'slide', weather: 'snowy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'slide', position: 'center' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'robot', emoji: '😴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'jump_idle' },
          { action: 'text_popup', text: '😴 Tiny... jump...', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'die_flop' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'text_popup', text: '❄️ SNOW NAP ❄️', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '❄️ Sleepy Snow Jump',
      message: "A sleepy robot in the snow barely jumped before falling into a snow nap! Energy changes how high characters jump!",
      skillTaught: 'Specificity',
      tip: "Sleepy energy makes jumping very small. Try hyper for big jumps!",
    },
    vagueComparison: {
      vague: "robot + jumping + slide",
      vagueResult: "Robot jumps on slide",
      specific: "sleepy robot + jumping + slide + snowy",
      specificResult: "Robot barely jumps before falling asleep in snow!",
      why: "Sleepy energy + snow = minimal effort and nap time!",
    },
  },

  // ── NORMAL + HIDE_SEEK + SWING + SNOWY ──────────────────────────────────────
  {
    id: 'bs2_normal_clown_hide_swing_snowy',
    description: 'A normal energy clown hides behind swings in snow, makes good hiding spot with snow cover.',
    trigger: { energy: 'normal', monster: 'clown', activity: 'hide_seek', equipment: 'swing', weather: 'snowy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'swing_set', position: 'center' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '🤫' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'walk' },
          { action: 'text_popup', text: '🤡 Perfect hiding spot!', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'react', effect: 'snowflakes', position: 'left' },
          { action: 'text_popup', text: '❄️ SNOW COVER! ❄️', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'ninja', emoji: '🔍' },
          { action: 'text_popup', text: '🥷 Where are they?', position: 'right', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '❄️ Snow Hiding Success',
      message: "Normal energy clown used the snow as extra cover! Weather can help or hurt hiding!",
      skillTaught: 'Specificity',
      tip: "Snowy weather gives extra hiding cover. Normal energy = steady play!",
    },
    vagueComparison: {
      vague: "clown + hide_seek + swing",
      vagueResult: "Clown hides behind swing",
      specific: "normal clown + hide_seek + swing + snowy",
      specificResult: "Snow provides extra cover for a good hiding spot!",
      why: "Weather adds environmental advantages to normal gameplay!",
    },
  },

  // ── NORMAL + CLIMBING + FIELD + WINDY ───────────────────────────────────────
  {
    id: 'bs2_normal_caveman_climbing_field_windy',
    description: 'A normal energy caveman tries to climb on field equipment in wind, stays balanced and focused.',
    trigger: { energy: 'normal', monster: 'caveman', activity: 'climbing', equipment: 'field', weather: 'windy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'spawn', asset: 'cone_traffic', position: 'left' },
          { action: 'react', effect: 'smoke', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'caveman', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'caveman', emoji: '🦴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'walk' },
          { action: 'text_popup', text: '🦴 Steady climb...', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'jump_big' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'text_popup', text: '🌪️ WIND CAN\'T STOP ME! 🌪️', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌪️ Steady in the Wind',
      message: "Normal energy caveman stayed focused despite the wind! Normal energy = reliable results!",
      skillTaught: 'Specificity',
      tip: "Normal energy keeps characters steady even in challenging weather!",
    },
    vagueComparison: {
      vague: "caveman + climbing + field",
      vagueResult: "Caveman climbs on field",
      specific: "normal caveman + climbing + field + windy",
      specificResult: "Wind blows but caveman stays focused and succeeds!",
      why: "Normal energy provides stability against weather challenges!",
    },
  },

  // ── HYPER + RACE + SANDBOX + RAINY ──────────────────────────────────────────
  {
    id: 'bs2_hyper_clown_race_sandbox_rainy',
    description: 'A hyper clown races through rainy sandbox, splashes mud everywhere in chaotic fun.',
    trigger: { energy: 'hyper', monster: 'clown', activity: 'race', equipment: 'sandbox', weather: 'rainy' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'sandbox', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'walk' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'text_popup', text: '🤡 MUD RACE! 🤡', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'spin_attack' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'right' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'text_popup', text: '💧 MUD SPLASH! 💧', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💧 Hyper Mud Race!',
      message: "Hyper clown racing in rainy sandbox = mud EVERYWHERE! Energy + weather = messy chaos!",
      skillTaught: 'Specificity',
      tip: "Hyper energy in rain creates splashing and mud. Try different combinations!",
    },
    vagueComparison: {
      vague: "clown + race + sandbox",
      vagueResult: "Clown races in sandbox",
      specific: "hyper clown + race + sandbox + rainy",
      specificResult: "Rain turns sandbox to mud, hyper clown splashes everywhere!",
      why: "Rain + hyper energy transforms a simple race into muddy chaos!",
    },
  },

  // ── MEGA_HYPER + WRESTLING + SEESAW + SUNNY ─────────────────────────────────
  {
    id: 'bs2_mega_hyper_barbarian_wrestling_seesaw_sunny',
    description: 'A MEGA hyper barbarian wrestles on seesaw in sunny weather, launches opponents into the air.',
    trigger: { energy: 'MEGA_hyper', monster: 'barbarian', activity: 'wrestling', equipment: 'seesaw', weather: 'sunny' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'seesaw', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'caveman', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'barbarian', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'text_popup', text: '💪 MEGA POWER! 💪', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'animate', character: 'caveman', anim: 'jump_idle' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.8, duration: 0.7 },
          { action: 'text_popup', text: '🚀 LAUNCHED! 🚀', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🚀 MEGA Hyper Launch!',
      message: "MEGA hyper barbarian on the seesaw launched the opponent into the sky! MEGA energy = MEGA results!",
      skillTaught: 'Specificity',
      tip: "MEGA_hyper creates extreme actions. Seesaw wrestling becomes launching!",
    },
    vagueComparison: {
      vague: "barbarian + wrestling + seesaw",
      vagueResult: "Barbarian wrestles on seesaw",
      specific: "MEGA_hyper barbarian + wrestling + seesaw + sunny",
      specificResult: "MEGA power launches opponent into the air like a rocket!",
      why: "MEGA_hyper energy turns normal wrestling into launching!",
    },
  },

  // ── SLEEPY + WRESTLING + FIELD + WINDY ──────────────────────────────────────
  {
    id: 'bs2_sleepy_caveman_wrestling_field_windy',
    description: 'A sleepy caveman tries wrestling on field in wind, just hugs opponent and falls asleep.',
    trigger: { energy: 'sleepy', monster: 'caveman', activity: 'wrestling', equipment: 'field', weather: 'windy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'caveman', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'barbarian', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'caveman', emoji: '😴' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'walk' },
          { action: 'text_popup', text: '😴 So tired... must wrestle...', position: 'top', size: 'large' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'die_flop' },
          { action: 'emote', character: 'caveman', emoji: '💤' },
          { action: 'react', effect: 'question-marks', position: 'center' },
          { action: 'text_popup', text: '🤗 HUG NAP! 🤗', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '💤 Sleepy Hug Wrestling',
      message: "Sleepy caveman turned wrestling into a nap hug! Sleepy energy changes everything!",
      skillTaught: 'Specificity',
      tip: "Sleepy monsters can't do intense activities. They need calm games!",
    },
    vagueComparison: {
      vague: "caveman + wrestling + field",
      vagueResult: "Caveman wrestles on field",
      specific: "sleepy caveman + wrestling + field + windy",
      specificResult: "Too tired to wrestle, caveman just hugs and sleeps!",
      why: "Sleepy energy makes combat turn into cuddles!",
    },
  },

  // ── NORMAL + TAG + SANDBOX + WINDY ──────────────────────────────────────────
  {
    id: 'bs2_normal_robot_tag_sandbox_windy',
    description: 'A normal energy robot plays tag in windy sandbox, steady gameplay with some sand blowing.',
    trigger: { energy: 'normal', monster: 'robot', activity: 'tag', equipment: 'sandbox', weather: 'windy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'sandbox', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'ninja', position: 'right', anim: 'spawn_ground' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'animate', character: 'ninja', anim: 'walk' },
          { action: 'text_popup', text: '🤖 TAG TIME! 🤖', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'taunt' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'text_popup', text: '🌪️ TAG! 🌪️', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌪️ Windy Tag Play',
      message: "Normal robot played tag smoothly despite the wind! Normal energy = consistent gameplay!",
      skillTaught: 'Specificity',
      tip: "Normal energy keeps games predictable. Wind adds atmosphere but doesn't change the outcome!",
    },
    vagueComparison: {
      vague: "robot + tag + sandbox",
      vagueResult: "Robot plays tag in sandbox",
      specific: "normal robot + tag + sandbox + windy",
      specificResult: "Robot plays steady tag with wind blowing sand around!",
      why: "Normal energy maintains stable gameplay even in windy conditions!",
    },
  },

  // ── HYPER + CLIMBING + SEESAW + SNOWY ───────────────────────────────────────
  {
    id: 'bs2_hyper_ninja_climbing_seesaw_snowy',
    description: 'A hyper ninja climbs on seesaw in snow, bounces wildly making snowballs fly.',
    trigger: { energy: 'hyper', monster: 'ninja', activity: 'climbing', equipment: 'seesaw', weather: 'snowy' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'seesaw', position: 'center' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'ninja', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'jump_idle' },
          { action: 'react', effect: 'snowflakes', position: 'left' },
          { action: 'text_popup', text: '🥷 HYPER CLIMB! 🥷', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'spin_attack' },
          { action: 'react', effect: 'snowflakes', position: 'center' },
          { action: 'react', effect: 'snowflakes', position: 'right' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'text_popup', text: '❄️ SNOW BOUNCE! ❄️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'wave' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '❄️ Hyper Snow Bounce!',
      message: "Hyper ninja on snowy seesaw bounced so hard snow flew everywhere! Energy + weather = wild combos!",
      skillTaught: 'Specificity',
      tip: "Hyper climbing on equipment makes it bounce. Snow adds extra effects!",
    },
    vagueComparison: {
      vague: "ninja + climbing + seesaw",
      vagueResult: "Ninja climbs on seesaw",
      specific: "hyper ninja + climbing + seesaw + snowy",
      specificResult: "Hyper bouncing launches snowballs in all directions!",
      why: "Hyper energy turns climbing into bouncing, snow adds flying snowballs!",
    },
  },

  // ── MEGA_HYPER + HIDE_SEEK + SWING + RAINY ──────────────────────────────────
  {
    id: 'bs2_mega_hyper_clown_hide_swing_rainy',
    description: 'A MEGA hyper clown tries hiding behind swings in rain, moves so much they give away position.',
    trigger: { energy: 'MEGA_hyper', monster: 'clown', activity: 'hide_seek', equipment: 'swing', weather: 'rainy' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'swing_set', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'walk' },
          { action: 'text_popup', text: '🤡 HIDE! HIDE! HIDE!', position: 'top', size: 'huge' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'spin_attack' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'react', effect: 'smoke', position: 'right' },
          { action: 'text_popup', text: '💧 CAN\'T STAY STILL! 💧', position: 'center', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'robot', emoji: '👀' },
          { action: 'text_popup', text: '🤖 FOUND YOU! 🤖', position: 'right', size: 'large' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ Too Hyper to Hide!',
      message: "MEGA hyper clown moved TOO MUCH to hide! Some energy levels don't match some activities!",
      skillTaught: 'Specificity',
      tip: "MEGA_hyper energy makes hiding impossible. Match energy to activity!",
    },
    vagueComparison: {
      vague: "clown + hide_seek + swing",
      vagueResult: "Clown hides behind swing",
      specific: "MEGA_hyper clown + hide_seek + swing + rainy",
      specificResult: "Too hyper to stay still, clown splashes and gets found!",
      why: "MEGA_hyper energy fights against hiding activities!",
    },
  },

  // ── NORMAL + RACE + SWING + RAINY ───────────────────────────────────────────
  {
    id: 'bs2_normal_barbarian_race_swing_rainy',
    description: 'A normal energy barbarian races on swings in rain, careful and steady despite slippery conditions.',
    trigger: { energy: 'normal', monster: 'barbarian', activity: 'race', equipment: 'swing', weather: 'rainy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'swing_set', position: 'center' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'barbarian', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'caveman', position: 'right', anim: 'spawn_ground' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'walk' },
          { action: 'animate', character: 'caveman', anim: 'walk' },
          { action: 'text_popup', text: '☔ Rainy Swing Race ☔', position: 'top', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'barbarian', anim: 'taunt' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'text_popup', text: '🏁 STEADY WIN! 🏁', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '☔ Steady Rainy Race',
      message: "Normal energy barbarian won by staying steady in the rain! Normal = reliable performance!",
      skillTaught: 'Specificity',
      tip: "Normal energy performs well in all weather. Steady beats chaotic!",
    },
    vagueComparison: {
      vague: "barbarian + race + swing",
      vagueResult: "Barbarian races on swings",
      specific: "normal barbarian + race + swing + rainy",
      specificResult: "Barbarian stays steady despite rain and wins!",
      why: "Normal energy provides consistency in challenging conditions!",
    },
  },

  // ── HYPER + HIDE_SEEK + FIELD + SUNNY ───────────────────────────────────────
  {
    id: 'bs2_hyper_caveman_hide_field_sunny',
    description: 'A hyper caveman tries hiding on field in sunny weather, runs around too much and gets spotted.',
    trigger: { energy: 'hyper', monster: 'caveman', activity: 'hide_seek', equipment: 'field', weather: 'sunny' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'spawn', asset: 'cone_traffic', position: 'left' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'caveman', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'caveman', emoji: '⚡' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'walk' },
          { action: 'text_popup', text: '🦴 HIDE HERE! NO WAIT, HERE!', position: 'top', size: 'large' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'walk' },
          { action: 'text_popup', text: '⚡ OR HERE! ⚡', position: 'center', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'ninja', emoji: '👁️' },
          { action: 'text_popup', text: '🥷 SEEN YOU! 🥷', position: 'right', size: 'large' },
          { action: 'sfx', sound: 'fail' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ Too Hyper to Hide!',
      message: "Hyper caveman couldn't pick a spot and got caught! Hyper energy makes hiding harder!",
      skillTaught: 'Specificity',
      tip: "Hyper energy works great for running games, not hiding games!",
    },
    vagueComparison: {
      vague: "caveman + hide_seek + field",
      vagueResult: "Caveman hides on field",
      specific: "hyper caveman + hide_seek + field + sunny",
      specificResult: "Too much energy, caveman keeps moving and gets spotted!",
      why: "Hyper energy makes it hard to stay still and hide!",
    },
  },

];

// ─── STAGE 2 DEFAULT ────────────────────────────────────────────────────────

export const BARBARIAN_SCHOOL_DEFAULT_2: Vignette = {
  id: 'barbarian_school_default_2',
  description: 'Monsters at recess with some energy and weather, but missing details.',
  trigger: { energy: '*', monster: '*', activity: '*', equipment: '*', weather: '*' },
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
        { action: 'spawn_character', character: 'ninja', position: 'left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'jump_big' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '🎪 RECESS CONTINUES! 🎪', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🎪 Recess in Progress!',
    message: "Something is happening at recess! But add ENERGY (sleepy/hyper) and WEATHER (rainy/snowy) to see how they change the scene!",
    skillTaught: 'Specificity',
    tip: "Energy and weather add exciting new details. Try MEGA_hyper + snowy!",
  },
  vagueComparison: {
    vague: "monster + activity + equipment",
    vagueResult: "Basic recess scene",
    specific: "energy + monster + activity + equipment + weather",
    specificResult: "Energy and weather completely transform what happens!",
    why: "Each modifier you add makes the story more specific and exciting!",
  },
};

// ─── STAGE 3 VIGNETTES ──────────────────────────────────────────────────────

export const BARBARIAN_SCHOOL_STAGE_3: Vignette[] = [

  // ── COMBO: tag + hide_seek = STEALTH TAG ───────────────────────────────────
  {
    id: 'bs3_combo_stealth_tag',
    description: 'Combining tag with hide-and-seek creates STEALTH TAG — an invisible tag game where seekers hunt hidden taggers.',
    trigger: { game1: 'tag', game2: 'hide_seek', style: 'ninja', playground: 'sandbox' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'sandbox', position: 'center' },
          { action: 'spawn', asset: 'tree_cartoon', position: 'left' },
          { action: 'spawn', asset: 'tree_cartoon', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '🥷 SECRET COMBO UNLOCKED! 🥷', position: 'top', size: 'huge' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'center', anim: 'skel_spawn' },
          { action: 'emote', character: 'ninja', emoji: '👻' },
          { action: 'text_popup', text: '🥷 STEALTH TAG! 🥷', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '👀' },
          { action: 'emote', character: 'robot', emoji: '🔍' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'taunt' },
          { action: 'react', effect: 'smoke', position: 'center' },
          { action: 'text_popup', text: '👻 YOU CAN\'T SEE ME! 👻', position: 'center', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🥷 STEALTH TAG UNLOCKED!',
      message: "You discovered STEALTH TAG! Tag + Hide-and-Seek = invisible tag game! Secret combos unlock new games!",
      skillTaught: 'Combo Thinking',
      tip: "Try combining two different games to discover more secret combos!",
    },
  },

  // ── COMBO: wrestling + jumping = TRAMPOLINE WRESTLING ───────────────────────
  {
    id: 'bs3_combo_trampoline_wrestling',
    description: 'Combining wrestling with jumping creates TRAMPOLINE WRESTLING — bouncy combat in mid-air.',
    trigger: { game1: 'wrestling', game2: 'jumping', style: 'clown', playground: 'slide' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'slide', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '🤡 SECRET COMBO UNLOCKED! 🤡', position: 'top', size: 'huge' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'barbarian', position: 'right', anim: 'spawn_air' },
          { action: 'text_popup', text: '🤼 TRAMPOLINE WRESTLING! 🤼', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'jump_idle' },
          { action: 'animate', character: 'barbarian', anim: 'jump_idle' },
          { action: 'text_popup', text: '🦘 BOUNCE BATTLE! 🦘', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'spin_attack' },
          { action: 'animate', character: 'barbarian', anim: 'spin_attack' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.7, duration: 0.6 },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'wave' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🦘 TRAMPOLINE WRESTLING UNLOCKED!',
      message: "You discovered TRAMPOLINE WRESTLING! Wrestling + Jumping = bouncy combat! Keep finding combos!",
      skillTaught: 'Combo Thinking',
      tip: "Mixing physical activities creates new action-packed games!",
    },
  },

  // ── COMBO: race + climbing = OBSTACLE COURSE ────────────────────────────────
  {
    id: 'bs3_combo_obstacle_course',
    description: 'Combining racing with climbing creates OBSTACLE COURSE — epic parkour race.',
    trigger: { game1: 'race', game2: 'climbing', style: 'robot', playground: 'field' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'spawn', asset: 'cone_traffic', position: 'left' },
          { action: 'spawn', asset: 'cone_traffic', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '🤖 SECRET COMBO UNLOCKED! 🤖', position: 'top', size: 'huge' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'ninja', position: 'right', anim: 'spawn_ground' },
          { action: 'text_popup', text: '🏁 OBSTACLE COURSE! 🏁', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'animate', character: 'ninja', anim: 'walk' },
          { action: 'text_popup', text: '🧗 CLIMB & RACE! 🧗', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'jump_idle' },
          { action: 'animate', character: 'ninja', anim: 'jump_idle' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'taunt' },
          { action: 'react', effect: 'stars-spin', position: 'right' },
          { action: 'text_popup', text: '🏆 PARKOUR CHAMPION! 🏆', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🏁 OBSTACLE COURSE UNLOCKED!',
      message: "You discovered OBSTACLE COURSE! Race + Climbing = epic parkour race! Amazing combo!",
      skillTaught: 'Combo Thinking',
      tip: "Combining movement activities creates complex challenges!",
    },
  },

  // ── COMBO: tag + race = SPEED TAG ──────────────────────────────────────────
  {
    id: 'bs3_combo_speed_tag',
    description: 'Combining tag with racing creates SPEED TAG — lightning-fast tag game.',
    trigger: { game1: 'tag', game2: 'race', style: 'ninja', playground: 'field' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'grass_patch', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '⚡ SECRET COMBO UNLOCKED! ⚡', position: 'top', size: 'huge' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'ninja', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'robot', position: 'right', anim: 'spawn_ground' },
          { action: 'text_popup', text: '⚡ SPEED TAG! ⚡', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'walk' },
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'react', effect: 'smoke', position: 'left' },
          { action: 'react', effect: 'smoke', position: 'right' },
          { action: 'text_popup', text: '💨 SUPER FAST! 💨', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'ninja', anim: 'taunt' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'text_popup', text: '🏷️ TAG! 🏷️', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'jump_big' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '⚡ SPEED TAG UNLOCKED!',
      message: "You discovered SPEED TAG! Tag + Race = lightning-fast tag! Keep experimenting!",
      skillTaught: 'Combo Thinking',
      tip: "Combining chase games makes them even faster and more exciting!",
    },
  },

  // ── COMBO: hide_seek + climbing = VERTICAL HIDE & SEEK ──────────────────────
  {
    id: 'bs3_combo_vertical_hide',
    description: 'Combining hide-and-seek with climbing creates VERTICAL HIDE & SEEK — hide on top of things.',
    trigger: { game1: 'hide_seek', game2: 'climbing', style: 'caveman', playground: 'slide' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'slide', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '🦴 SECRET COMBO UNLOCKED! 🦴', position: 'top', size: 'huge' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'caveman', position: 'center', anim: 'spawn_air' },
          { action: 'text_popup', text: '🧗 VERTICAL HIDE & SEEK! 🧗', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'left', anim: 'spawn_ground' },
          { action: 'emote', character: 'clown', emoji: '👀' },
          { action: 'text_popup', text: '🤔 WHERE? 🤔', position: 'left', size: 'large' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'animate', character: 'caveman', anim: 'taunt' },
          { action: 'emote', character: 'caveman', emoji: '👆' },
          { action: 'text_popup', text: '🦴 UP HERE! 🦴', position: 'center', size: 'large' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'clown', anim: 'get_hit' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
          { action: 'react', effect: 'glow-pulse', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🧗 VERTICAL HIDE & SEEK UNLOCKED!',
      message: "You discovered VERTICAL HIDE & SEEK! Hide-and-Seek + Climbing = hide on top! Brilliant!",
      skillTaught: 'Combo Thinking',
      tip: "Mixing hiding with climbing adds a whole new dimension!",
    },
  },

  // ── COMBO: wrestling + race = CHASE WRESTLING ───────────────────────────────
  {
    id: 'bs3_combo_chase_wrestling',
    description: 'Combining wrestling with racing creates CHASE WRESTLING — grab opponents while running.',
    trigger: { game1: 'wrestling', game2: 'race', style: 'robot', playground: 'swing' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'swing_set', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'text_popup', text: '🤖 SECRET COMBO UNLOCKED! 🤖', position: 'top', size: 'huge' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'robot', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'barbarian', position: 'right', anim: 'spawn_ground' },
          { action: 'text_popup', text: '🤼 CHASE WRESTLING! 🤼', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'walk' },
          { action: 'animate', character: 'barbarian', anim: 'walk' },
          { action: 'text_popup', text: '💨 RUN & GRAB! 💨', position: 'center', size: 'large' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'robot', anim: 'taunt' },
          { action: 'animate', character: 'barbarian', anim: 'get_hit' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'text_popup', text: '🤖 GOT YOU! 🤖', position: 'center', size: 'huge' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'wave' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤼 CHASE WRESTLING UNLOCKED!',
      message: "You discovered CHASE WRESTLING! Wrestling + Race = grab and run! Awesome combo!",
      skillTaught: 'Combo Thinking',
      tip: "Mixing combat with speed creates intense new games!",
    },
  },

];

// ─── STAGE 3 DEFAULT ────────────────────────────────────────────────────────

export const BARBARIAN_SCHOOL_DEFAULT_3: Vignette = {
  id: 'barbarian_school_default_3',
  description: 'Monsters trying to combine games but no secret combo discovered yet.',
  trigger: { game1: '*', game2: '*', style: '*', playground: '*' },
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
        { action: 'spawn_character', character: 'ninja', position: 'right', anim: 'spawn_ground' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'taunt' },
        { action: 'react', effect: 'question-marks', position: 'center' },
        { action: 'text_popup', text: '🤔 Trying to combine... 🤔', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🤔 Combo Experiment',
    message: "You're trying to combine games! But this combo doesn't unlock a secret. Try different game pairs!",
    skillTaught: 'Combo Thinking',
    tip: "There are 6 secret combos! Try tag+hide_seek, wrestling+jumping, race+climbing, and more!",
  },
};
