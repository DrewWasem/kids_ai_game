/**
 * Skeleton Birthday Quest — Vignettes for all 3 stages.
 *
 * Stage 1: "Plan a party with {FOOD} and {ENTERTAINMENT} for a {VIBE} birthday"
 * Stage 2: "Plan a {SIZE} party with {FOOD} and {ENTERTAINMENT} for a {VIBE} birthday where the skeleton feels {MOOD}"
 * Stage 3: "Combine {ACTIVITY1} with {ACTIVITY2} in a {SPIRIT} way at {LOCATION}"
 */

import type { Vignette } from '../../types/madlibs';
import {
  setupProps, enterFromWing, enterGroup, dramaticReveal,
  jugglingEntrance, composeBlocking, MARK,
} from '../blocking-templates';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

// ── CAKE VIGNETTES ──────────────────────────────────────────────────────────

const CAKE_VIGNETTES: Vignette[] = [
  // ── cake + magic_show ──
  {
    id: 'sb_cake_magic_show',
    description: 'A wizard conjures a magic cake for a spooky skeleton birthday with candles, skulls, and confetti.',
    trigger: { food: 'cake', entertainment: 'magic_show', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'table_long', mark: MARK.US_CENTER },
        { asset: 'candle_triple', mark: MARK.US_LEFT },
        { asset: 'candle_triple', mark: MARK.US_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.CS_CENTER, {
        arrivalAnim: 'taunt', emote: '🎂',
      }),
      enterGroup(
        [
          { character: 'skeleton_mage', mark: MARK.DS_LEFT },
          { character: 'skeleton_minion', mark: MARK.DS_RIGHT },
          { character: 'knight', mark: MARK.DS_FAR_RIGHT },
        ],
        'right',
        { arrivalAnim: 'wave' },
      ),
      dramaticReveal('mage', MARK.CS_RIGHT, {
        preEffects: ['sparkle-magic'],
        revealAnim: 'cast_long',
        cameraShake: 0.3,
      }),
      [{
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
          { action: 'sfx', sound: 'react' },
          { action: 'camera_shake', intensity: 0.3, duration: 1.5 },
        ],
        delayAfter: 1.5,
      }],
      [{
        parallel: [
          { action: 'spawn', asset: 'cookie', position: MARK.CS_CENTER },
          { action: 'react', effect: 'explosion-cartoon', position: MARK.CS_CENTER },
          { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
          { action: 'sfx', sound: 'success' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'screen_flash', color: 'white', duration: 0.2 },
          { action: 'text_popup', text: '✨ MAGIC CAKE! ✨', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.3,
      }],
      [{
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'animate', character: 'mage', anim: 'taunt' },
          { action: 'sfx', sound: 'success' },
          { action: 'react', effect: 'confetti-burst', position: MARK.CS_CENTER },
        ],
        delayAfter: 0.8,
      }],
      [{
        parallel: [
          { action: 'spawn', asset: 'skull', position: MARK.CS_CENTER },
          { action: 'react', effect: 'fire-sneeze', position: MARK.CS_CENTER },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      }],
      [{
        parallel: [
          { action: 'spawn', asset: 'banner_red', position: MARK.TOP },
          { action: 'text_popup', text: '🎉 HAPPY BONE-DAY! 🎉', position: 'center', size: 'huge' },
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: MARK.CS_CENTER },
          { action: 'react', effect: 'hearts-float', position: MARK.CS_CENTER },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      }],
    ),
    feedback: {
      title: '🌟 PERFECT PARTY!',
      message: "You planned an amazing spooky birthday! You said WHAT food (magic cake), WHAT entertainment (a magic show), and WHAT vibe (spooky). When you're specific about all the details, everything comes together perfectly!",
      skillTaught: 'Specificity',
      tip: 'Great prompts answer WHO, WHAT, WHERE, and HOW — you nailed it!',
    },
  },

  // ── cake + fireworks ──
  {
    id: 'sb_cake_fireworks',
    description: 'Birthday cake explodes with candles that shoot fireworks into the sky.',
    trigger: { food: 'cake', entertainment: 'fireworks', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🎂' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'cookie', position: 'cs-center' },
        { action: 'spawn', asset: 'candle_triple', position: 'cs-left' },
        { action: 'spawn', asset: 'candle_triple', position: 'cs-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'ds-right', anim: 'spawn_air' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'fire-sneeze', position: 'top' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'text_popup', text: '🎆 FIREWORK CANDLES! 🎆', position: 'center', size: 'huge' },
        { action: 'screen_flash', color: 'yellow', duration: 0.2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎆 Firework Cake!',
      message: 'The birthday candles are FIREWORKS! Each one explodes when you blow it out!',
      skillTaught: 'Specificity',
      tip: 'Cake + Fireworks = explosive birthday celebration! Mix and match for creativity!',
    },
  },

  // ── cake + music ──
  {
    id: 'sb_cake_music',
    description: 'Singing cake layers harmonize while the skeleton dances.',
    trigger: { food: 'cake', entertainment: 'music', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'cookie', position: 'cs-center' },
        { action: 'spawn', asset: 'present', position: 'cs-left' },
        { action: 'spawn', asset: 'present', position: 'cs-right' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_mage', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'skeleton_minion', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: '🎵 The cake SINGS! 🎵', position: 'top', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'celebrate' },
        { action: 'animate', character: 'skeleton_mage', anim: 'taunt' },
        { action: 'animate', character: 'skeleton_minion', anim: 'celebrate' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎵 Singing Cake!',
      message: 'The cake sings Happy Birthday in perfect harmony! Everyone dances along!',
      skillTaught: 'Specificity',
      tip: 'Cake + Music = singing dessert! Each combo creates something unique!',
    },
  },

  // ── cake + combat ──
  {
    id: 'sb_cake_combat',
    description: 'Warriors battle over the last slice of birthday cake.',
    trigger: { food: 'cake', entertainment: 'combat', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'cookie', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🎂' },
        { action: 'emote', character: 'knight', emoji: '⚔️' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: '⚔️ CAKE BATTLE! ⚔️', position: 'center', size: 'huge' },
        { action: 'react', effect: 'stars-spin', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ Cake War!',
      message: 'A cake battle broke out! The warriors are fighting for the last slice!',
      skillTaught: 'Specificity',
      tip: 'Cake + Combat = competitive chaos! Not all combos are peaceful!',
    },
  },

  // ── cake + dance ──
  {
    id: 'sb_cake_dance',
    description: 'The birthday cake wobbles and dances on the table while everyone cheers.',
    trigger: { food: 'cake', entertainment: 'dance', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'cookie', position: 'cs-center' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_minion', position: 'ds-right', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'text_popup', text: '💃 The cake DANCES! 💃', position: 'top', size: 'large' },
        { action: 'camera_shake', intensity: 0.3, duration: 0.8 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💃 Dancing Dessert!',
      message: 'The cake is ALIVE and dancing on the table! Everyone joins in the celebration!',
      skillTaught: 'Specificity',
      tip: 'Cake + Dance = living dessert party! Objects can become performers!',
    },
  },

  // ── cake + games ──
  {
    id: 'sb_cake_games',
    description: 'Pin the candle on the cake game ends with frosting everywhere.',
    trigger: { food: 'cake', entertainment: 'games', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'cookie', position: 'cs-center' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_minion', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'rogue', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_minion', anim: 'throw' },
        { action: 'spawn', asset: 'candle_triple', position: 'cs-center' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'splash', position: 'cs-center' },
        { action: 'text_popup', text: '🎯 SPLAT! 🎯', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎯 Cake Games!',
      message: 'Pin the candle on the cake turned messy! Frosting flew everywhere!',
      skillTaught: 'Specificity',
      tip: 'Cake + Games = party game mayhem! Competitive fun with dessert!',
    },
  },
];

// ── PIZZA VIGNETTES ────────────────────────────────────────────────────────

const PIZZA_VIGNETTES: Vignette[] = [
  // ── pizza + magic_show ──
  {
    id: 'sb_pizza_magic_show',
    description: 'A wizard makes pizza slices multiply endlessly from a single pie.',
    trigger: { food: 'pizza', entertainment: 'magic_show', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'cs-right', anim: 'spawn_air' },
        { action: 'emote', character: 'mage', emoji: '🍕' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn_rain', asset: 'burger', quantity: 8, position: 'wide' },
        { action: 'text_popup', text: '✨ INFINITE PIZZA! ✨', position: 'top', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '✨ Infinite Pizza!',
      message: 'The wizard multiplied one pizza into hundreds! Magic makes MORE food!',
      skillTaught: 'Specificity',
      tip: 'Pizza + Magic Show = endless food magic! Wizards love pizza tricks!',
    },
  },

  // ── pizza + fireworks ──
  {
    id: 'sb_pizza_fireworks',
    description: 'Pepperoni slices shoot into the air like pizza-flavored rockets.',
    trigger: { food: 'pizza', entertainment: 'fireworks', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'ds-left', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'knight', anim: 'throw' },
        { action: 'sfx', sound: 'move' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'fire-sneeze', position: 'top' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
        { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
        { action: 'text_popup', text: '🍕 PIZZA ROCKETS! 🍕', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍕 Pizza Rockets!',
      message: 'The pizza slices launched like fireworks! Pepperoni explosions in the sky!',
      skillTaught: 'Specificity',
      tip: 'Pizza + Fireworks = food explosions! Wild combo creates chaos!',
    },
  },

  // ── pizza + music ──
  {
    id: 'sb_pizza_music',
    description: 'Pizza rains from the sky as skeletons mosh and a barrel explodes at a wild music party.',
    trigger: { food: 'pizza', entertainment: 'music', vibe: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'jump_idle' },
        { action: 'sfx', sound: 'spawn' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🤘' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'spawn_rain', asset: 'burger', quantity: 10, position: 'wide' },
        { action: 'sfx', sound: 'react' },
        { action: 'camera_shake', intensity: 0.4, duration: 2.0 },
        { action: 'text_popup', text: '🍕 PIZZA STORM! 🍕', position: 'top', size: 'huge' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'get_hit' },
        { action: 'sfx', sound: 'fail' },
        { action: 'react', effect: 'stars-spin', position: 'center' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '😵' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_mage', position: 'left', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'skeleton_minion', position: 'right', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'clown', position: 'bottom', anim: 'skel_spawn' },
        { action: 'sfx', sound: 'spawn' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' },
        { action: 'animate', character: 'skeleton_mage', anim: 'kick' },
        { action: 'animate', character: 'skeleton_minion', anim: 'jump_idle' },
        { action: 'animate', character: 'clown', anim: 'pushups' },
        { action: 'sfx', sound: 'react' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 1.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_mage', anim: 'throw' },
        { action: 'spawn', asset: 'barrel', position: 'center' },
        { action: 'sfx', sound: 'move' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
        { action: 'sfx', sound: 'fail' },
        { action: 'crowd_react', characters: ['skeleton_minion', 'clown'], anim: 'dodge_back' },
        { action: 'screen_flash', color: 'orange', duration: 0.15 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt_long' },
        { action: 'animate', character: 'skeleton_mage', anim: 'lie_idle' },
        { action: 'animate', character: 'skeleton_minion', anim: 'sit_floor' },
        { action: 'animate', character: 'clown', anim: 'die_dramatic' },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: 'center' },
        { action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' },
        { action: 'sfx', sound: 'fail' },
        { action: 'camera_shake', intensity: 0.3, duration: 0.3 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'text_popup', text: '🍕 BEST. PARTY. EVER. 🍕', position: 'center', size: 'huge' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '🌪️ TOTAL CHAOS!',
      message: "Well... that was WILD! Pizza rain + wild music = absolute madness. Your choices were fun but didn't work TOGETHER — that's why the party went bonkers!",
      skillTaught: 'Specificity',
      tip: "Try picking a food and entertainment that go together — like cake + magic show. Matching details = better results!",
    },
  },

  // ── pizza + combat ──
  {
    id: 'sb_pizza_combat',
    description: 'Food fight with pizza slices used as throwing weapons.',
    trigger: { food: 'pizza', entertainment: 'combat', vibe: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
        { action: 'spawn', asset: 'burger', position: 'ds-left' },
        { action: 'spawn', asset: 'burger', position: 'ds-right' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'throw' },
        { action: 'animate', character: 'knight', anim: 'throw' },
        { action: 'sfx', sound: 'move' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'splash', position: 'center' },
        { action: 'react', effect: 'splash', position: 'cs-left' },
        { action: 'react', effect: 'splash', position: 'cs-right' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
        { action: 'text_popup', text: '⚔️ PIZZA FIGHT! ⚔️', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ Food Fight!',
      message: 'Pizza slices became weapons! The combat turned into a messy food war!',
      skillTaught: 'Specificity',
      tip: 'Pizza + Combat = food fight chaos! Messy but hilarious!',
    },
  },

  // ── pizza + dance ──
  {
    id: 'sb_pizza_dance',
    description: 'Pizza boxes spin like dance partners while everyone does the pizza shuffle.',
    trigger: { food: 'pizza', entertainment: 'dance', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'spawn', asset: 'burger', position: 'cs-left' },
        { action: 'spawn', asset: 'burger', position: 'cs-right' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_minion', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'celebrate' },
        { action: 'animate', character: 'skeleton_minion', anim: 'celebrate' },
        { action: 'animate', character: 'clown', anim: 'celebrate' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: '💃 PIZZA SHUFFLE! 💃', position: 'top', size: 'large' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💃 Pizza Dance!',
      message: 'Everyone dances with pizza boxes! The pizza shuffle is the hottest move!',
      skillTaught: 'Specificity',
      tip: 'Pizza + Dance = delicious dance party! Food becomes part of the fun!',
    },
  },

  // ── pizza + games ──
  {
    id: 'sb_pizza_games',
    description: 'Pizza toss game where slices land perfectly in mouths.',
    trigger: { food: 'pizza', entertainment: 'games', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'skeleton_mage', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'throw' },
        { action: 'spawn', asset: 'burger', position: 'cs-center' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'stars-spin', position: 'cs-right' },
        { action: 'text_popup', text: '🎯 PERFECT CATCH! 🎯', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎯 Pizza Toss!',
      message: 'Pizza toss game is a hit! Everyone catches slices perfectly!',
      skillTaught: 'Specificity',
      tip: 'Pizza + Games = competitive snacking! Turn food into a game!',
    },
  },
];

// ── FEAST VIGNETTES ─────────────────────────────────────────────────────────

const FEAST_VIGNETTES: Vignette[] = [
  // ── feast + magic_show ──
  {
    id: 'sb_feast_magic_show',
    description: 'A wizard conjures an endless feast that keeps appearing on the table.',
    trigger: { food: 'feast', entertainment: 'magic_show', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'table_long', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'taunt', emote: '🍖',
      }),
      dramaticReveal('mage', MARK.CS_RIGHT, {
        preEffects: ['sparkle-magic'],
        revealAnim: 'cast_long',
        cameraShake: 0.3,
      }),
      [{ parallel: [
        { action: 'spawn_rain', asset: 'burger', quantity: 3, position: MARK.CS_LEFT },
        { action: 'spawn_rain', asset: 'pizza', quantity: 3, position: MARK.CS_CENTER },
        { action: 'spawn_rain', asset: 'cake_birthday', quantity: 2, position: MARK.CS_RIGHT },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'text_popup', text: '✨ ENDLESS FEAST! ✨', position: 'top', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, speed: 'fast', style: 'arc' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '✨ Magic Feast!',
      message: 'The wizard conjured an endless stream of food! The table overflows with magical dishes!',
      skillTaught: 'Specificity',
      tip: 'Feast + Magic Show = infinite food! Magic makes everything bigger!',
    },
  },

  // ── feast + fireworks ──
  {
    id: 'sb_feast_fireworks',
    description: 'An epic feast with fireworks launched by a wizard creates a legendary skeleton celebration.',
    trigger: { food: 'feast', entertainment: 'fireworks', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'table_long', mark: MARK.CS_CENTER },
        { asset: 'table_long', mark: MARK.CS_LEFT },
        { asset: 'table_long', mark: MARK.CS_RIGHT },
      ]),
      enterGroup([
        { character: 'skeleton_warrior', mark: MARK.DS_CENTER },
        { character: 'skeleton_mage', mark: MARK.DS_LEFT },
        { character: 'knight', mark: MARK.DS_RIGHT },
      ], 'left', { arrivalAnim: 'taunt' }),
      dramaticReveal('mage', MARK.DS_FAR_RIGHT, {
        preEffects: ['sparkle-magic'],
        revealAnim: 'cast_long',
        cameraShake: 0.3,
      }),
      [{ parallel: [
        { action: 'spawn', asset: 'dinner_plate', position: MARK.CS_CENTER },
        { action: 'spawn', asset: 'pizza', position: MARK.CS_LEFT },
        { action: 'spawn', asset: 'cake_birthday', position: MARK.CS_RIGHT },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '⚔️ EPIC FEAST! ⚔️', position: 'top', size: 'huge' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.3 }],
      [{ parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: MARK.FLY_SPACE },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_CENTER },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_LEFT },
        { action: 'camera_shake', intensity: 0.4, duration: 1.0 },
        { action: 'screen_flash', color: 'gold', duration: 0.2 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'spawn', asset: 'banner_red', position: MARK.FLY_SPACE },
        { action: 'text_popup', text: '🎆 LEGENDARY BIRTHDAY! 🎆', position: 'center', size: 'huge' },
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'confetti-burst', position: MARK.CENTER },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 }],
    ),
    feedback: {
      title: '🏆 LEGENDARY!',
      message: "An epic feast with fireworks?! That's EXACTLY how a legendary skeleton celebrates! You nailed every detail.",
      skillTaught: 'Specificity',
      tip: "You're a natural prompt engineer! Try the other quests to test your skills!",
    },
  },

  // ── feast + music ──
  {
    id: 'sb_feast_music',
    description: 'A grand banquet where plates clink in rhythm to create music.',
    trigger: { food: 'feast', entertainment: 'music', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'table_long', mark: MARK.CS_CENTER },
        { asset: 'dinner_plate', mark: MARK.CS_LEFT },
        { asset: 'dinner_plate', mark: MARK.CS_RIGHT },
        { asset: 'guitar', mark: MARK.US_LEFT },
        { asset: 'drums', mark: MARK.US_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🎵',
      }),
      enterGroup([
        { character: 'skeleton_mage', mark: MARK.DS_LEFT },
        { character: 'knight', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'wave' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Hammering' },
        { action: 'animate', character: 'skeleton_mage', anim: 'interact' },
        { action: 'animate', character: 'knight', anim: 'interact' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_CENTER, style: 'arc', duration: 0.6 },
        { action: 'text_popup', text: '🎵 DINNER SYMPHONY! 🎵', position: 'top', size: 'large' },
        { action: 'react', effect: 'glow-pulse', position: MARK.CENTER },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🎵 Musical Feast!',
      message: 'The skeletons drum on plates and strum guitars! The whole feast becomes a concert!',
      skillTaught: 'Specificity',
      tip: 'Feast + Music = dining becomes a concert! Everything makes sound!',
    },
  },

  // ── feast + combat ──
  {
    id: 'sb_feast_combat',
    description: 'Warriors compete in an eating contest, turning the feast into a battle.',
    trigger: { food: 'feast', entertainment: 'combat', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: composeBlocking(
      setupProps([
        { asset: 'table_long', mark: MARK.CS_CENTER },
        { asset: 'burger', mark: MARK.CS_LEFT },
        { asset: 'pizza', mark: MARK.CS_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_LEFT, {
        arrivalAnim: 'taunt', emote: '🍖',
      }),
      enterFromWing('knight', 'right', MARK.DS_RIGHT, {
        arrivalAnim: 'taunt', emote: '⚔️',
      }),
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, speed: 'fast', style: 'straight' },
        { action: 'move', character: 'knight', to: MARK.CS_RIGHT, speed: 'fast', style: 'straight' },
        { action: 'text_popup', text: '⚔️ EATING CONTEST! ⚔️', position: 'center', size: 'huge' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'interact' },
        { action: 'animate', character: 'knight', anim: 'interact' },
        { action: 'react', effect: 'explosion-cartoon', position: MARK.CS_CENTER },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'knight', anim: 'die_flop' },
        { action: 'react', effect: 'laugh-tears', position: MARK.DS_RIGHT },
        { action: 'react', effect: 'stars-spin', position: MARK.DS_LEFT },
        { action: 'text_popup', text: '🏆 WINNER! 🏆', position: MARK.DS_LEFT, size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '⚔️ Food Battle!',
      message: 'The feast became a competitive eating contest! The skeleton warrior wins by a mile!',
      skillTaught: 'Specificity',
      tip: 'Feast + Combat = eating competition! Turn dinner into a challenge!',
    },
  },

  // ── feast + dance ──
  {
    id: 'sb_feast_dance',
    description: 'Everyone dances around the feast table in a celebratory circle.',
    trigger: { food: 'feast', entertainment: 'dance', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'table_long', mark: MARK.CS_CENTER },
        { asset: 'dinner_plate', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_LEFT, {
        arrivalAnim: 'Cheering', emote: '💃',
      }),
      enterGroup([
        { character: 'skeleton_mage', mark: MARK.DS_RIGHT },
        { character: 'clown', mark: MARK.DS_CENTER },
      ], 'right', { arrivalAnim: 'Cheering' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' },
        { action: 'animate', character: 'skeleton_mage', anim: 'jump_big' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'text_popup', text: '💃 FEAST DANCE! 💃', position: 'top', size: 'large' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, style: 'arc', duration: 0.6 },
        { action: 'move', character: 'skeleton_mage', to: MARK.CS_RIGHT, style: 'arc', duration: 0.6 },
        { action: 'move', character: 'clown', to: MARK.DS_FAR_LEFT, style: 'arc', duration: 0.6 },
        { action: 'react', effect: 'glow-pulse', position: MARK.CENTER },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '💃 Dancing Dinner!',
      message: 'Everyone dances around the feast table! Spinning, jumping, and cheering!',
      skillTaught: 'Specificity',
      tip: 'Feast + Dance = celebration around food! The party surrounds the meal!',
    },
  },

  // ── feast + games ──
  {
    id: 'sb_feast_games',
    description: 'Feast becomes a treasure hunt where guests search for hidden treats.',
    trigger: { food: 'feast', entertainment: 'games', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'table_long', mark: MARK.CS_CENTER },
        { asset: 'chest', mark: MARK.CS_LEFT },
        { asset: 'chest', mark: MARK.CS_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🎯',
      }),
      enterFromWing('rogue', 'right', MARK.DS_RIGHT, {
        arrivalAnim: 'sneak',
      }),
      [{
        parallel: [
          { action: 'move', character: 'rogue', to: MARK.CS_LEFT, speed: 'fast', style: 'direct' },
          { action: 'text_popup', text: '🔍 SEARCHING... 🔍', position: 'top', size: 'large' },
        ], delayAfter: 0.5,
      }],
      [{
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'interact' },
          { action: 'spawn', asset: 'burger', position: MARK.CS_LEFT },
          { action: 'react', effect: 'stars-spin', position: MARK.CS_LEFT },
          { action: 'sfx', sound: 'react' },
        ], delayAfter: 0.5,
      }],
      [{
        parallel: [
          { action: 'move', character: 'rogue', to: MARK.CS_RIGHT, speed: 'fast', style: 'direct' },
        ], delayAfter: 0.4,
      }],
      [{
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'interact' },
          { action: 'spawn', asset: 'cake_birthday', position: MARK.CS_RIGHT },
          { action: 'react', effect: 'sparkle-magic', position: MARK.CS_RIGHT },
          { action: 'text_popup', text: '🎯 JACKPOT! 🎯', position: MARK.CENTER, size: 'huge' },
          { action: 'sfx', sound: 'success' },
        ], delayAfter: 0.6,
      }],
      [{
        parallel: [
          { action: 'animate', character: 'rogue', anim: 'Cheering' },
          { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
          { action: 'react', effect: 'confetti-burst', position: MARK.CENTER },
        ], delayAfter: 1.5,
      }],
    ),
    feedback: {
      title: '🎯 Feast Hunt!',
      message: 'The rogue found all the hidden feast treats! Every chest had delicious food!',
      skillTaught: 'Specificity',
      tip: 'Feast + Games = treasure hunt for food! Turn eating into adventure!',
    },
  },
];

// ── FRUIT VIGNETTES ─────────────────────────────────────────────────────────

const FRUIT_VIGNETTES: Vignette[] = [
  // ── fruit + magic_show ──
  {
    id: 'sb_fruit_magic_show',
    description: 'A wizard juggles fruit that transforms into different animals.',
    trigger: { food: 'fruit', entertainment: 'magic_show', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'apple', mark: MARK.DS_LEFT },
        { asset: 'banana', mark: MARK.DS_RIGHT },
        { asset: 'peach', mark: MARK.DS_FAR_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.CS_LEFT, {
        arrivalAnim: 'wave', emote: '🍎',
      }),
      dramaticReveal('mage', MARK.CS_RIGHT, {
        preEffects: ['sparkle-magic'],
        revealAnim: 'cast_long',
        cameraShake: 0.3,
      }),
      [{ parallel: [
        { action: 'move', character: 'mage', to: MARK.CS_CENTER, style: 'arc', duration: 0.8 },
        { action: 'grow', asset: 'apple', scale: 3.0, duration: 1.0 },
        { action: 'react', effect: 'sparkle-magic', position: MARK.DS_LEFT },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'spawn_rain', asset: 'banana', quantity: 5, position: 'center' },
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'stars-spin', position: 'center' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'text_popup', text: '✨ FRUIT MAGIC! ✨', position: 'top', size: 'huge' },
        { action: 'react', effect: 'glow-pulse', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '✨ Fruit Transformation!',
      message: 'The wizard made giant fruit appear and rain from the sky! Magic produce everywhere!',
      skillTaught: 'Specificity',
      tip: 'Fruit + Magic Show = enchanted produce! Fruit becomes magical!',
    },
  },

  // ── fruit + fireworks ──
  {
    id: 'sb_fruit_fireworks',
    description: 'Fruit explodes in the air creating juice fireworks.',
    trigger: { food: 'fruit', entertainment: 'fireworks', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: composeBlocking(
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'taunt', emote: '🎆',
      }),
      enterFromWing('mage', 'right', MARK.DS_RIGHT, {
        arrivalAnim: 'cast_spell',
      }),
      [{ parallel: [
        { action: 'move', character: 'mage', to: MARK.CS_CENTER, style: 'straight', duration: 0.6 },
        { action: 'spawn_rain', asset: 'apple', quantity: 6, position: 'wide' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 }],
      [{ parallel: [
        { action: 'react', effect: 'fire-sneeze', position: MARK.FLY_SPACE },
        { action: 'react', effect: 'splash', position: MARK.CS_LEFT },
        { action: 'react', effect: 'splash', position: MARK.CS_RIGHT },
        { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
        { action: 'text_popup', text: '🍎 FRUIT BOOM! 🍎', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'stars-spin', position: 'center' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🍎 Juice Explosion!',
      message: 'The wizard launched fruit fireworks! Juice spray everywhere like colorful explosions!',
      skillTaught: 'Specificity',
      tip: 'Fruit + Fireworks = juicy explosions! Messy but spectacular!',
    },
  },

  // ── fruit + music ──
  {
    id: 'sb_fruit_music',
    description: 'Fruit bounces to the beat, creating a percussion orchestra.',
    trigger: { food: 'fruit', entertainment: 'music', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'apple', mark: MARK.CS_LEFT },
        { asset: 'apple', mark: MARK.CS_RIGHT },
        { asset: 'banana', mark: MARK.CS_FAR_LEFT },
        { asset: 'peach', mark: MARK.CS_FAR_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🎵',
      }),
      enterGroup([
        { character: 'skeleton_mage', mark: MARK.DS_LEFT },
        { character: 'skeleton_minion', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'wave' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Hammering' },
        { action: 'animate', character: 'skeleton_mage', anim: 'interact' },
        { action: 'animate', character: 'skeleton_minion', anim: 'interact' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_LEFT },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_RIGHT },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_CENTER, style: 'arc', duration: 0.6 },
        { action: 'text_popup', text: '🎵 FRUIT BEATS! 🎵', position: 'top', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'glow-pulse', position: 'center' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🎵 Fruit Orchestra!',
      message: 'The skeletons drum on fruit to make music! Apples and bananas play percussion!',
      skillTaught: 'Specificity',
      tip: 'Fruit + Music = fruity rhythms! Food becomes instruments!',
    },
  },

  // ── fruit + combat ──
  {
    id: 'sb_fruit_combat',
    description: 'Fruit rains down, a knight slips on a banana, and a clown laughs at the silly birthday brawl.',
    trigger: { food: 'fruit', entertainment: 'combat', vibe: '*' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: composeBlocking(
      enterFromWing('skeleton_warrior', 'left', MARK.CS_CENTER, {
        arrivalAnim: 'taunt', emote: '🤔',
      }),
      [{ parallel: [
        { action: 'spawn_rain', asset: 'apple', quantity: 8, position: 'wide' },
        { action: 'sfx', sound: 'react' },
        { action: 'text_popup', text: '🍎 FRUIT STORM! 🍎', position: 'top', size: 'huge' },
        { action: 'camera_shake', intensity: 0.3, duration: 1.5 },
      ], delayAfter: 0.5 }],
      enterFromWing('knight', 'right', MARK.DS_RIGHT, {
        arrivalAnim: 'sword_slash',
      }),
      [{ parallel: [
        { action: 'move', character: 'knight', to: MARK.DS_CENTER, style: 'straight', duration: 0.4 },
        { action: 'animate', character: 'knight', anim: 'die_flop' },
        { action: 'sfx', sound: 'fail' },
        { action: 'react', effect: 'stars-spin', position: MARK.DS_CENTER },
        { action: 'emote', character: 'knight', emoji: '🍌' },
      ], delayAfter: 0.5 }],
      enterFromWing('clown', 'right', MARK.DS_FAR_RIGHT, {
        arrivalAnim: 'Cheering',
      }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt_long' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'react', effect: 'laugh-tears', position: MARK.CS_CENTER },
        { action: 'react', effect: 'laugh-tears', position: MARK.DS_FAR_RIGHT },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'text_popup', text: '🎪 SILLY BRAWL! 🎪', position: 'center', size: 'huge' },
        { action: 'animate', character: 'knight', anim: 'lie_idle' },
        { action: 'react', effect: 'dust', position: MARK.DS_CENTER },
      ], delayAfter: 2.0 }],
    ),
    feedback: {
      title: '🤪 SILLY CHAOS!',
      message: "A fruit fight at a birthday party? The knight slipped on a banana and the clown loved it! Your wild combo made everyone laugh.",
      skillTaught: 'Creativity',
      tip: "Wild combos are hilarious! But for a 'perfect' party, try picking things that work together.",
    },
  },

  // ── fruit + dance ──
  {
    id: 'sb_fruit_dance',
    description: 'Fruits dance in mid-air while everyone catches them with their mouths.',
    trigger: { food: 'fruit', entertainment: 'dance', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'apple', mark: MARK.US_LEFT },
        { asset: 'apple', mark: MARK.US_RIGHT },
        { asset: 'banana', mark: MARK.US_FAR_LEFT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.CS_CENTER, {
        arrivalAnim: 'Cheering', emote: '💃',
      }),
      enterGroup([
        { character: 'clown', mark: MARK.DS_LEFT },
        { character: 'ninja', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'Cheering' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'animate', character: 'ninja', anim: 'Cheering' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.US_LEFT },
        { action: 'react', effect: 'sparkle-magic', position: MARK.US_RIGHT },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'move', character: 'clown', to: MARK.CS_LEFT, style: 'arc', duration: 0.6 },
        { action: 'move', character: 'ninja', to: MARK.CS_RIGHT, style: 'arc', duration: 0.6 },
        { action: 'spawn_rain', asset: 'peach', quantity: 4, position: 'center' },
        { action: 'text_popup', text: '💃 DANCING FRUIT! 💃', position: 'top', size: 'large' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'animate', character: 'ninja', anim: 'Cheering' },
        { action: 'react', effect: 'glow-pulse', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '💃 Fruit Ballet!',
      message: 'Everyone dances with fruit in the air! They catch dancing apples while performing!',
      skillTaught: 'Specificity',
      tip: 'Fruit + Dance = floating fruit ballet! Snacks become performers!',
    },
  },

  // ── fruit + games ──
  {
    id: 'sb_fruit_games',
    description: 'Bobbing for apples game where the apples try to escape.',
    trigger: { food: 'fruit', entertainment: 'games', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'barrel', mark: MARK.CS_CENTER },
        { asset: 'apple', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🎯',
      }),
      enterGroup([
        { character: 'skeleton_minion', mark: MARK.DS_LEFT },
        { character: 'skeleton_mage', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'wave' }),
      [{ parallel: [
        { action: 'move', character: 'skeleton_minion', to: MARK.CS_LEFT, style: 'straight', duration: 0.5 },
        { action: 'animate', character: 'skeleton_minion', anim: 'interact' },
        { action: 'react', effect: 'splash', position: MARK.CS_CENTER },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_minion', anim: 'Cheering' },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_LEFT },
        { action: 'text_popup', text: '🎯 GOT ONE! 🎯', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'skeleton_mage', anim: 'wave' },
        { action: 'animate', character: 'skeleton_minion', anim: 'taunt' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🎯 Apple Bobbing!',
      message: 'Apple bobbing game is on! The minion got one! The apples are fast but the skeletons are faster!',
      skillTaught: 'Specificity',
      tip: 'Fruit + Games = classic party game! Tradition meets fun!',
    },
  },
];

// ── CANDY VIGNETTES ─────────────────────────────────────────────────────────

const CANDY_VIGNETTES: Vignette[] = [
  // ── candy + magic_show ──
  {
    id: 'sb_candy_magic_show',
    description: 'A wizard makes candy appear from thin air and float around.',
    trigger: { food: 'candy', entertainment: 'magic_show', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: composeBlocking(
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🍬',
      }),
      dramaticReveal('mage', MARK.CS_RIGHT, {
        preEffects: ['sparkle-magic'],
        revealAnim: 'cast_long',
        cameraShake: 0.3,
      }),
      [{ parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'spawn_rain', asset: 'cookie', quantity: 6, position: 'wide' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'grow', asset: 'cookie', scale: 3.0, duration: 1.0 },
        { action: 'text_popup', text: '✨ CANDY MAGIC! ✨', position: 'top', size: 'huge' },
        { action: 'react', effect: 'glow-pulse', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, speed: 'fast', style: 'arc' },
      ], delayAfter: 0.4 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '✨ Sweet Magic!',
      message: 'The wizard conjured a rain of candy that grew to giant size! Sweet treats everywhere!',
      skillTaught: 'Specificity',
      tip: 'Candy + Magic Show = sugary spells! Magic makes candy appear!',
    },
  },

  // ── candy + fireworks ──
  {
    id: 'sb_candy_fireworks',
    description: 'Candy explodes in the sky like sweet colorful fireworks.',
    trigger: { food: 'candy', entertainment: 'fireworks', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: composeBlocking(
      enterFromWing('skeleton_warrior', 'left', MARK.DS_LEFT, {
        arrivalAnim: 'taunt', emote: '🎆',
      }),
      enterFromWing('mage', 'right', MARK.DS_RIGHT, {
        arrivalAnim: 'cast_spell',
      }),
      [{ parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'spawn_rain', asset: 'cookie', quantity: 8, position: 'wide' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.4 }],
      [{ parallel: [
        { action: 'react', effect: 'fire-sneeze', position: MARK.FLY_SPACE },
        { action: 'react', effect: 'explosion-cartoon', position: MARK.CS_LEFT },
        { action: 'react', effect: 'explosion-cartoon', position: MARK.CS_RIGHT },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_CENTER },
        { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
        { action: 'screen_flash', color: 'pink', duration: 0.2 },
        { action: 'text_popup', text: '🍬 CANDY BOOM! 🍬', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'get_hit' },
        { action: 'animate', character: 'mage', anim: 'dodge_back' },
        { action: 'react', effect: 'dust', position: MARK.DS_LEFT },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'Cheering' },
        { action: 'react', effect: 'confetti-burst', position: MARK.CENTER },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🍬 Sugar Explosion!',
      message: 'The wizard launched candy fireworks! Sweet treats exploded across the sky!',
      skillTaught: 'Specificity',
      tip: 'Candy + Fireworks = sugar bombs! Sweet and explosive!',
    },
  },

  // ── candy + music ──
  {
    id: 'sb_candy_music',
    description: 'Candy wrappers crinkle in rhythm to create sweet music.',
    trigger: { food: 'candy', entertainment: 'music', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'cookie', mark: MARK.CS_LEFT },
        { asset: 'cookie', mark: MARK.CS_RIGHT },
        { asset: 'guitar', mark: MARK.US_LEFT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🎵',
      }),
      enterGroup([
        { character: 'skeleton_minion', mark: MARK.DS_LEFT },
        { character: 'clown', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'wave' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Hammering' },
        { action: 'animate', character: 'skeleton_minion', anim: 'interact' },
        { action: 'animate', character: 'clown', anim: 'interact' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_LEFT },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_RIGHT },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_CENTER, style: 'arc', duration: 0.6 },
        { action: 'text_popup', text: '🎵 CANDY CHORUS! 🎵', position: 'top', size: 'large' },
        { action: 'react', effect: 'glow-pulse', position: MARK.CENTER },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🎵 Sweet Symphony!',
      message: 'The skeletons play candy wrapper percussion! Crinkles create a sweet melody!',
      skillTaught: 'Specificity',
      tip: 'Candy + Music = wrapper orchestra! Sweets make sound!',
    },
  },

  // ── candy + combat ──
  {
    id: 'sb_candy_combat',
    description: 'Candy cane swords and lollipop shields in a sweet sugar battle.',
    trigger: { food: 'candy', entertainment: 'combat', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: composeBlocking(
      setupProps([
        { asset: 'sword', mark: MARK.CS_LEFT },
        { asset: 'shield', mark: MARK.CS_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_FAR_LEFT, {
        arrivalAnim: 'taunt', emote: '🍭',
      }),
      enterFromWing('knight', 'right', MARK.DS_FAR_RIGHT, {
        arrivalAnim: 'taunt', emote: '⚔️',
      }),
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, speed: 'fast', style: 'straight' },
        { action: 'move', character: 'knight', to: MARK.CS_RIGHT, speed: 'fast', style: 'straight' },
        { action: 'text_popup', text: '⚔️ CANDY CLASH! ⚔️', position: 'center', size: 'huge' },
      ], delayAfter: 0.4 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'sword_slash' },
        { action: 'animate', character: 'knight', anim: 'block' },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_CENTER },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'animate', character: 'knight', anim: 'sword_slash' },
        { action: 'animate', character: 'skeleton_warrior', anim: 'get_hit' },
        { action: 'spawn_rain', asset: 'cookie', quantity: 5, position: MARK.CS_CENTER },
        { action: 'react', effect: 'explosion-cartoon', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'die_dramatic' },
        { action: 'animate', character: 'knight', anim: 'Cheering' },
        { action: 'react', effect: 'laugh-tears', position: MARK.CS_LEFT },
        { action: 'react', effect: 'confetti-burst', position: MARK.CENTER },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '⚔️ Sweet Battle!',
      message: 'A candy combat! They fought with swords and candy rained from every hit!',
      skillTaught: 'Specificity',
      tip: 'Candy + Combat = sugary warfare! Sweet treats become weapons!',
    },
  },

  // ── candy + dance ──
  {
    id: 'sb_candy_dance',
    description: 'Sugar rush hits and everyone dances wildly with candy.',
    trigger: { food: 'candy', entertainment: 'dance', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: composeBlocking(
      setupProps([
        { asset: 'cookie', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_LEFT, {
        arrivalAnim: 'Cheering', emote: '💃',
      }),
      enterGroup([
        { character: 'clown', mark: MARK.DS_CENTER },
        { character: 'skeleton_minion', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'Cheering' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' },
        { action: 'animate', character: 'clown', anim: 'jump_big' },
        { action: 'animate', character: 'skeleton_minion', anim: 'spin_attack' },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_CENTER },
        { action: 'camera_shake', intensity: 0.3, duration: 1.0 },
        { action: 'text_popup', text: '💃 SUGAR RUSH! 💃', position: 'top', size: 'huge' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, style: 'arc', duration: 0.5 },
        { action: 'move', character: 'clown', to: MARK.CS_RIGHT, style: 'arc', duration: 0.5 },
        { action: 'move', character: 'skeleton_minion', to: MARK.CS_FAR_RIGHT, style: 'arc', duration: 0.5 },
        { action: 'spawn_rain', asset: 'cookie', quantity: 4, position: 'center' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'glow-pulse', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '💃 Sugar Rush Dance!',
      message: 'The candy gave everyone a sugar rush! They spin and jump nonstop!',
      skillTaught: 'Specificity',
      tip: 'Candy + Dance = hyperactive party! Sugar makes everyone energetic!',
    },
  },

  // ── candy + games ──
  {
    id: 'sb_candy_games',
    description: 'Pin the wrapper on the candy game turns sticky and sweet.',
    trigger: { food: 'candy', entertainment: 'games', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'cookie', mark: MARK.CS_CENTER },
        { asset: 'cookie', mark: MARK.CS_LEFT },
        { asset: 'cookie', mark: MARK.CS_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🎯',
      }),
      enterGroup([
        { character: 'skeleton_minion', mark: MARK.DS_LEFT },
        { character: 'rogue', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'sneak' }),
      [{ parallel: [
        { action: 'move', character: 'skeleton_minion', to: MARK.CS_LEFT, speed: 'fast', style: 'straight' },
        { action: 'animate', character: 'skeleton_minion', anim: 'interact' },
        { action: 'text_popup', text: '🔍 SEARCHING... 🔍', position: 'top', size: 'large' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_minion', anim: 'die_flop' },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_LEFT },
        { action: 'text_popup', text: '🎯 STUCK! 🎯', position: MARK.CS_LEFT, size: 'large' },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'move', character: 'rogue', to: MARK.CS_RIGHT, speed: 'fast', style: 'direct' },
        { action: 'animate', character: 'rogue', anim: 'interact' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_RIGHT },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'rogue', anim: 'Cheering' },
        { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
        { action: 'react', effect: 'laugh-tears', position: MARK.CENTER },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🎯 Sticky Games!',
      message: 'The minion got stuck to the candy! But the rogue found the prize!',
      skillTaught: 'Specificity',
      tip: 'Candy + Games = sticky fun! Sweet treats make games messy!',
    },
  },
];

// ── SOUP VIGNETTES ──────────────────────────────────────────────────────────

const SOUP_VIGNETTES: Vignette[] = [
  // ── soup + magic_show ──
  {
    id: 'sb_soup_magic_show',
    description: 'A wizard stirs a cauldron making magical soup appear.',
    trigger: { food: 'soup', entertainment: 'magic_show', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'barrel', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🍲',
      }),
      dramaticReveal('mage', MARK.CS_RIGHT, {
        preEffects: ['sparkle-magic'],
        revealAnim: 'cast_long',
        cameraShake: 0.3,
      }),
      [{ parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'smoke', position: MARK.CS_CENTER },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'grow', asset: 'barrel', scale: 2.0, duration: 1.0 },
        { action: 'react', effect: 'glow-pulse', position: MARK.CS_CENTER },
        { action: 'text_popup', text: '✨ MAGIC SOUP! ✨', position: 'top', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, speed: 'fast', style: 'arc' },
      ], delayAfter: 0.4 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '✨ Enchanted Soup!',
      message: 'The wizard brewed magical soup! The cauldron grew and bubbles with enchantment!',
      skillTaught: 'Specificity',
      tip: 'Soup + Magic Show = potion brewing! Soup becomes a magic spell!',
    },
  },

  // ── soup + fireworks ──
  {
    id: 'sb_soup_fireworks',
    description: 'Soup bubbles over and explodes like a volcano firework.',
    trigger: { food: 'soup', entertainment: 'fireworks', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: composeBlocking(
      setupProps([
        { asset: 'barrel', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_LEFT, {
        arrivalAnim: 'taunt', emote: '🎆',
      }),
      enterFromWing('mage', 'right', MARK.DS_RIGHT, {
        arrivalAnim: 'cast_spell',
      }),
      [{ parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'smoke', position: MARK.CS_CENTER },
        { action: 'react', effect: 'glow-pulse', position: MARK.CS_CENTER },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'react', effect: 'fire-sneeze', position: MARK.FLY_SPACE },
        { action: 'react', effect: 'explosion-cartoon', position: MARK.CS_CENTER },
        { action: 'react', effect: 'splash', position: MARK.CS_LEFT },
        { action: 'react', effect: 'splash', position: MARK.CS_RIGHT },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
        { action: 'screen_flash', color: 'orange', duration: 0.2 },
        { action: 'text_popup', text: '🍲 SOUP VOLCANO! 🍲', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.8 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'get_hit' },
        { action: 'animate', character: 'mage', anim: 'dodge_back' },
        { action: 'react', effect: 'dust', position: MARK.DS_LEFT },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'react', effect: 'confetti-burst', position: MARK.CENTER },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🍲 Soup Eruption!',
      message: 'The soup boiled over like a volcano! Broth exploded and splashed everyone!',
      skillTaught: 'Specificity',
      tip: 'Soup + Fireworks = explosive cooking! Hot soup becomes volcanic!',
    },
  },

  // ── soup + music ──
  {
    id: 'sb_soup_music',
    description: 'Soup bubbles in rhythm creating a gurgling melody.',
    trigger: { food: 'soup', entertainment: 'music', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'barrel', mark: MARK.CS_CENTER },
        { asset: 'guitar', mark: MARK.US_LEFT },
        { asset: 'drums', mark: MARK.US_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '🎵',
      }),
      enterGroup([
        { character: 'skeleton_mage', mark: MARK.DS_LEFT },
        { character: 'skeleton_minion', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'wave' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Hammering' },
        { action: 'animate', character: 'skeleton_mage', anim: 'interact' },
        { action: 'animate', character: 'skeleton_minion', anim: 'interact' },
        { action: 'react', effect: 'smoke', position: MARK.CS_CENTER },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_CENTER, style: 'arc', duration: 0.6 },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'text_popup', text: '🎵 SOUP SONG! 🎵', position: 'top', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'glow-pulse', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🎵 Bubbling Beat!',
      message: 'The soup bubbles in rhythm while the skeletons play instruments! A cooking concert!',
      skillTaught: 'Specificity',
      tip: 'Soup + Music = cooking concert! Bubbles become beats!',
    },
  },

  // ── soup + combat ──
  {
    id: 'sb_soup_combat',
    description: 'Ladle dueling contest with soup splashing everywhere.',
    trigger: { food: 'soup', entertainment: 'combat', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'chaotic',
    steps: composeBlocking(
      setupProps([
        { asset: 'barrel', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_FAR_LEFT, {
        arrivalAnim: 'taunt', emote: '🍲',
      }),
      enterFromWing('knight', 'right', MARK.DS_FAR_RIGHT, {
        arrivalAnim: 'taunt', emote: '⚔️',
      }),
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, speed: 'fast', style: 'straight' },
        { action: 'move', character: 'knight', to: MARK.CS_RIGHT, speed: 'fast', style: 'straight' },
        { action: 'text_popup', text: '⚔️ LADLE DUEL! ⚔️', position: 'center', size: 'huge' },
      ], delayAfter: 0.4 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'sword_slash' },
        { action: 'animate', character: 'knight', anim: 'sword_slash' },
        { action: 'react', effect: 'splash', position: MARK.CS_CENTER },
        { action: 'react', effect: 'splash', position: MARK.CS_LEFT },
        { action: 'react', effect: 'splash', position: MARK.CS_RIGHT },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'get_hit' },
        { action: 'animate', character: 'knight', anim: 'get_hit' },
        { action: 'react', effect: 'dust', position: MARK.CS_LEFT },
        { action: 'react', effect: 'dust', position: MARK.CS_RIGHT },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' },
        { action: 'animate', character: 'knight', anim: 'die_flop' },
        { action: 'react', effect: 'laugh-tears', position: MARK.CENTER },
        { action: 'text_popup', text: '🍲 BOTH SOAKED! 🍲', position: 'center', size: 'huge' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '⚔️ Soup Fight!',
      message: 'A ladle duel! Both warriors ended up soaked in soup — nobody wins a food fight!',
      skillTaught: 'Specificity',
      tip: 'Soup + Combat = messy food fight! Liquid warfare!',
    },
  },

  // ── soup + dance ──
  {
    id: 'sb_soup_dance',
    description: 'Everyone dances around the soup pot in a swirling circle.',
    trigger: { food: 'soup', entertainment: 'dance', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'barrel', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_LEFT, {
        arrivalAnim: 'Cheering', emote: '💃',
      }),
      enterGroup([
        { character: 'skeleton_mage', mark: MARK.DS_RIGHT },
        { character: 'clown', mark: MARK.DS_CENTER },
      ], 'right', { arrivalAnim: 'Cheering' }),
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' },
        { action: 'animate', character: 'skeleton_mage', anim: 'jump_big' },
        { action: 'animate', character: 'clown', anim: 'spin_attack' },
        { action: 'react', effect: 'smoke', position: MARK.CS_CENTER },
        { action: 'text_popup', text: '💃 SOUP SWIRL! 💃', position: 'top', size: 'large' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, style: 'arc', duration: 0.6 },
        { action: 'move', character: 'skeleton_mage', to: MARK.CS_RIGHT, style: 'arc', duration: 0.6 },
        { action: 'move', character: 'clown', to: MARK.CS_FAR_LEFT, style: 'arc', duration: 0.6 },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '💃 Soup Swirl!',
      message: 'Everyone dances around the soup pot! Spinning and jumping makes the soup swirl too!',
      skillTaught: 'Specificity',
      tip: 'Soup + Dance = stirring party! Movement makes the soup swirl!',
    },
  },

  // ── soup + games ──
  {
    id: 'sb_soup_games',
    description: 'Hot soup relay race where skeletons carefully carry bowls.',
    trigger: { food: 'soup', entertainment: 'games', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: composeBlocking(
      setupProps([
        { asset: 'barrel', mark: MARK.CS_CENTER },
        { asset: 'dinner_plate', mark: MARK.CS_FAR_RIGHT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_FAR_LEFT, {
        arrivalAnim: 'wave', emote: '🍲',
      }),
      enterFromWing('skeleton_minion', 'right', MARK.DS_FAR_RIGHT, {
        arrivalAnim: 'wave', emote: '🎯',
      }),
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, speed: 'medium', style: 'straight' },
        { action: 'animate', character: 'skeleton_warrior', anim: 'walk' },
        { action: 'react', effect: 'smoke', position: MARK.CS_LEFT },
        { action: 'text_popup', text: '🍲 CAREFUL! 🍲', position: 'top', size: 'large' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' },
        { action: 'react', effect: 'splash', position: MARK.CS_LEFT },
        { action: 'react', effect: 'stars-spin', position: MARK.CS_LEFT },
        { action: 'sfx', sound: 'fail' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_minion', to: MARK.CS_RIGHT, speed: 'medium', style: 'straight' },
        { action: 'animate', character: 'skeleton_minion', anim: 'walk' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_minion', anim: 'Cheering' },
        { action: 'text_popup', text: '🏆 MADE IT! 🏆', position: MARK.CS_RIGHT, size: 'huge' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_RIGHT },
        { action: 'react', effect: 'laugh-tears', position: MARK.CS_LEFT },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 }],
    ),
    feedback: {
      title: '🎯 Soup Relay!',
      message: 'Hot soup relay race! The warrior spilled but the minion made it! Balance and speed!',
      skillTaught: 'Specificity',
      tip: 'Soup + Games = careful competition! Balance and speed!',
    },
  },
];

// ── ASSEMBLE ALL STAGE 1 VIGNETTES ─────────────────────────────────────────

const PAIR_VIGNETTES: Vignette[] = [
  ...CAKE_VIGNETTES,
  ...PIZZA_VIGNETTES,
  ...FEAST_VIGNETTES,
  ...FRUIT_VIGNETTES,
  ...CANDY_VIGNETTES,
  ...SOUP_VIGNETTES,
];

export const SKELETON_BIRTHDAY_STAGE_1: Vignette[] = [
  ...PAIR_VIGNETTES,

  // ── VIBE MATCH: any + any + spooky ─────────────────────────────────────────
  {
    id: 'skel_bday_1_vibe_spooky',
    description: 'Candles flicker and skulls appear as spooky vibes set the mood for the skeleton party.',
    trigger: { food: '*', entertainment: '*', vibe: 'spooky' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: composeBlocking(
      setupProps([
        { asset: 'candle_triple', mark: MARK.US_LEFT },
        { asset: 'candle_triple', mark: MARK.US_RIGHT },
        { asset: 'skull', mark: MARK.CS_CENTER },
        { asset: 'pumpkin_jackolantern', mark: MARK.CS_LEFT },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'awaken', emote: '👻',
      }),
      enterGroup([
        { character: 'skeleton_mage', mark: MARK.DS_LEFT },
        { character: 'necromancer', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'sneak' }),
      [{ parallel: [
        { action: 'react', effect: 'fire-sneeze', position: MARK.CS_CENTER },
        { action: 'react', effect: 'skull-burst', position: MARK.CS_LEFT },
        { action: 'camera_shake', intensity: 0.2, duration: 0.5 },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'necromancer', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.DS_RIGHT },
        { action: 'text_popup', text: '👻 SPOOKY PARTY! 👻', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 }],
    ),
    feedback: {
      title: '👻 Spooky Vibes!',
      message: "The spooky atmosphere was great! The candles and skulls set the mood. Try adding specific food and entertainment to make it even more epic!",
      skillTaught: 'Detail',
      tip: "You got the vibe right! Now try being specific about the food and entertainment too.",
    },
  },

  // ── VIBE MATCH: any + any + fancy ──────────────────────────────────────────
  {
    id: 'skel_bday_1_vibe_fancy',
    description: 'Pillars, a gold chest, and a red carpet create a fancy elegant skeleton celebration.',
    trigger: { food: '*', entertainment: '*', vibe: 'fancy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: composeBlocking(
      setupProps([
        { asset: 'pillar', mark: MARK.US_LEFT },
        { asset: 'pillar', mark: MARK.US_RIGHT },
        { asset: 'rug', mark: MARK.CS_CENTER },
        { asset: 'chest_gold', mark: MARK.CS_CENTER },
      ]),
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'walk_swagger', emote: '🎩',
      }),
      enterGroup([
        { character: 'knight', mark: MARK.DS_LEFT },
        { character: 'mage', mark: MARK.DS_RIGHT },
      ], 'right', { arrivalAnim: 'walk_swagger' }),
      [{ parallel: [
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'react', effect: 'glow-pulse', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
        { action: 'crowd_react', characters: 'all', anim: 'wave' },
        { action: 'text_popup', text: '🎩 FANCY! 🎩', position: 'center', size: 'large' },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 }],
    ),
    feedback: {
      title: '🎩 Fancy Vibes!',
      message: "What an elegant party! The pillars and gold set the scene. Now add specific food and entertainment to really complete the picture.",
      skillTaught: 'Detail',
      tip: "The fancy vibe is working! Try adding 'a feast' or 'a magic show' to fill in the blanks.",
    },
  },

  // ── CATEGORY: any + magic_show + any ───────────────────────────────────────
  {
    id: 'skel_bday_1_cat_magic',
    description: 'A wizard performs a magic show with sparkles and a potion for the skeleton birthday.',
    trigger: { food: '*', entertainment: 'magic_show', vibe: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: composeBlocking(
      enterFromWing('skeleton_warrior', 'left', MARK.DS_CENTER, {
        arrivalAnim: 'wave', emote: '✨',
      }),
      dramaticReveal('mage', MARK.CS_RIGHT, {
        preEffects: ['sparkle-magic'],
        revealAnim: 'cast_long',
        cameraShake: 0.2,
      }),
      [{ parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'spawn', asset: 'potion_red', position: MARK.CS_CENTER },
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 }],
      [{ parallel: [
        { action: 'move', character: 'skeleton_warrior', to: MARK.CS_LEFT, style: 'arc', duration: 0.5 },
      ], delayAfter: 0.4 }],
      [{ parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'mage', anim: 'wave' },
        { action: 'text_popup', text: '✨ MAGIC! ✨', position: 'center', size: 'large' },
        { action: 'react', effect: 'hearts-float', position: MARK.CENTER },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 2.0 }],
    ),
    feedback: {
      title: '✨ Magic Show!',
      message: "The magic show was great! The wizard pulled off some tricks. Try adding specific food and a party vibe for a full combo.",
      skillTaught: 'Detail',
      tip: "Good entertainment choice! Now pick food and a vibe to complete the party.",
    },
  },
];

// ─── DEFAULT VIGNETTE (always works) ────────────────────────────────────────

export const SKELETON_BIRTHDAY_DEFAULT: Vignette = {
  id: 'skel_bday_default',
  description: 'A clown walks in juggling 3 cats, then guests arrive for a chaotic birthday party.',
  trigger: { food: '*', entertainment: '*', vibe: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: composeBlocking(
    // Props: party table
    setupProps([
      { asset: 'table_long', mark: MARK.US_CENTER },
      { asset: 'present', mark: MARK.US_LEFT },
    ]),
    // Cat juggling entrance!
    jugglingEntrance(
      'clown', 'left', MARK.DS_CENTER,
      ['cat_1', 'cat_2', 'cat_3'], 'cat',
      { charAnim: 'Cheering' },
    ),
    // Skeleton walks in from right
    enterFromWing('skeleton_warrior', 'right', MARK.DS_RIGHT, {
      arrivalAnim: 'taunt', emote: '🎉',
    }),
    // Final celebration
    [{
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'confetti-burst', position: MARK.CS_CENTER },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '🎉 HAPPY BIRTHDAY! 🎉', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    }],
  ),
  feedback: {
    title: '🎂 Party Time!',
    message: "A birthday party happened! It was... fine. But imagine how much MORE fun it would be if you picked specific food, entertainment, and a vibe!",
    skillTaught: 'Specificity',
    tip: "Try filling in all three blanks with specific choices. Each detail you add makes the party crazier!",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 2 — SIZE + MOOD MODIFIERS (Teaching specificity through scale and emotion)
// ═══════════════════════════════════════════════════════════════════════════════

const STAGE2_SIZE_MOOD_VIGNETTES: Vignette[] = [
  // ── TINY PARTY: tiny + cake + magic_show ──
  {
    id: 'sb2_tiny_cake_magic',
    description: 'A tiny birthday party with a miniature cake and pocket-sized magic tricks',
    trigger: { size: 'tiny', food: 'cake', entertainment: 'magic_show', vibe: '*', mood: '*' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center', scale: 0.3 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'skeleton_warrior', to: 'cs-center', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_air', scale: 0.5 },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'ds-right', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'cake_birthday', position: 'cs-center', scale: 0.2 },
        { action: 'text_popup', text: 'tiny cake!', position: 'top', size: 'small' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🎂' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔍 Tiny Party!',
      message: 'A pocket-sized party! The cake is so small you need a magnifying glass to see it!',
      skillTaught: 'Specificity',
      tip: 'SIZE changes EVERYTHING. Tiny = cute and small. Try GIANT for mega chaos!',
      vagueComparison: {
        vagueInput: 'Have a party',
        vagueResult: 'A party happens... but how big? Who knows!',
      },
    },
  },

  // ── TINY PARTY: tiny + candy + silly ──
  {
    id: 'sb2_tiny_candy_silly',
    description: 'Tiny candy scattered around for a silly microscopic celebration',
    trigger: { size: 'tiny', food: 'candy', entertainment: '*', vibe: 'silly', mood: '*' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'present', position: 'cs-left', scale: 0.2 },
        { action: 'spawn', asset: 'present', position: 'cs-right', scale: 0.2 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'off-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'skeleton_warrior', to: 'cs-center', style: 'bounce' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-left' },
        { action: 'react', effect: 'hearts-float', position: 'cs-right' },
        { action: 'text_popup', text: 'itty bitty candy!', position: 'center', size: 'small' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🍬' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍬 Miniature Madness!',
      message: 'The candy is so tiny, the skeleton can barely see it! But the silly vibes are huge!',
      skillTaught: 'Specificity',
      tip: 'Tiny + silly = small but fun! SIZE and VIBE work together to create unique scenes!',
      vagueComparison: {
        vagueInput: 'Get some candy',
        vagueResult: 'Candy appears... somewhere. Normal size. Normal vibes. Boring.',
      },
    },
  },

  // ── TINY PARTY: tiny + pizza + music ──
  {
    id: 'sb2_tiny_pizza_music',
    description: 'A miniature pizza party with a tiny band playing tiny tunes',
    trigger: { size: 'tiny', food: 'pizza', entertainment: 'music', vibe: '*', mood: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center', scale: 0.3 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'skeleton_mage', position: 'ds-left', anim: 'spawn_ground', scale: 0.4 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_mage', anim: 'cast_spell' },
        { action: 'react', effect: 'sparkle-magic', position: 'ds-left' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'spawn', asset: 'pizza', position: 'cs-center', scale: 0.2 },
        { action: 'text_popup', text: '🎵 tiny pizza 🎵', position: 'top', size: 'small' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
        { action: 'animate', character: 'skeleton_mage', anim: 'taunt' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎵 Pocket Concert!',
      message: 'The band is so tiny they fit in your hand! The pizza is bite-sized!',
      skillTaught: 'Specificity',
      tip: 'Tiny size makes EVERYTHING small. Try GIANT for the opposite effect!',
      vagueComparison: {
        vagueInput: 'Play music and serve pizza',
        vagueResult: 'Music plays. Pizza appears. Normal everything. Yawn.',
      },
    },
  },

  // ── GIANT PARTY: giant + cake + magic_show ──
  {
    id: 'sb2_giant_cake_magic',
    description: 'A massive cake towers over everyone while a giant wizard performs enormous magic',
    trigger: { size: 'giant', food: 'cake', entertainment: 'magic_show', vibe: '*', mood: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center', scale: 2.0 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_air', scale: 2.5 },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'cs-right', style: 'stomp' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'spawn', asset: 'cake_birthday', position: 'center', scale: 3.0 },
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        { action: 'text_popup', text: 'MEGA CAKE!', position: 'top', size: 'huge' },
        { action: 'screen_flash', color: 'white', duration: 0.2 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt_long' },
        { action: 'animate', character: 'mage', anim: 'taunt' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎂 MEGA CAKE PARTY!',
      message: 'The cake is MASSIVE! The wizard is HUGE! Everything is GIANT!',
      skillTaught: 'Specificity',
      tip: 'GIANT makes everything ENORMOUS and CHAOTIC! Size = scale = drama!',
      vagueComparison: {
        vagueInput: 'Make a cake appear',
        vagueResult: 'A normal cake appears. No drama, no size, no WOW.',
      },
    },
  },

  // ── GIANT PARTY: enormous + fireworks + epic ──
  {
    id: 'sb2_enormous_fireworks_epic',
    description: 'Sky-filling fireworks explode at an enormous epic celebration',
    trigger: { size: 'enormous', food: '*', entertainment: 'fireworks', vibe: 'epic', mood: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'banner_red', position: 'top', scale: 3.0 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground', scale: 2.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'ds-left', anim: 'spawn_ground', scale: 2.0 },
        { action: 'spawn_character', character: 'mage', position: 'ds-right', anim: 'spawn_air', scale: 2.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'fire-sneeze', position: 'top' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
        { action: 'camera_shake', intensity: 0.8, duration: 1.5 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'text_popup', text: 'ENORMOUS EPIC PARTY!', position: 'center', size: 'huge' },
        { action: 'screen_flash', color: 'yellow', duration: 0.3 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'react', effect: 'sparkle-magic', position: 'top' },
      ], delayAfter: 2.0 },
    ],
    feedback: {
      title: '🎆 ENORMOUS EPIC EXPLOSION!',
      message: 'The fireworks fill the ENTIRE SKY! The party is so big it needs its own ZIP CODE!',
      skillTaught: 'Specificity',
      tip: 'ENORMOUS + EPIC = maximum drama! Stack modifiers for HUGE results!',
      vagueComparison: {
        vagueInput: 'Set off fireworks',
        vagueResult: 'A single firework goes off. Meh. Where is the SCALE?',
      },
    },
  },

  // ── GIANT PARTY: giant + feast + wild ──
  {
    id: 'sb2_giant_feast_wild',
    description: 'A chaotic giant feast where food is everywhere and everyone goes wild',
    trigger: { size: 'giant', food: 'feast', entertainment: '*', vibe: 'wild', mood: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center', scale: 2.5 },
        { action: 'spawn', asset: 'burger', position: 'cs-left', scale: 2.0 },
        { action: 'spawn', asset: 'cake_birthday', position: 'cs-right', scale: 2.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground', scale: 1.5 },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-left', anim: 'spawn_ground', scale: 1.5 },
        { action: 'spawn_character', character: 'clown', position: 'ds-right', anim: 'spawn_ground', scale: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'barbarian', anim: 'taunt' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'camera_shake', intensity: 0.5, duration: 1.0 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'fire-sneeze', position: 'cs-left' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'text_popup', text: 'WILD FEAST!', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'jump_big' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍖 GIANT WILD FEAST!',
      message: 'The food is HUGE! The party is WILD! Everything is OUT OF CONTROL!',
      skillTaught: 'Specificity',
      tip: 'GIANT + WILD = maximum chaos! Size and vibe multiply the madness!',
      vagueComparison: {
        vagueInput: 'Serve food',
        vagueResult: 'Some food appears on a table. Everyone politely eats. Boring.',
      },
    },
  },

  // ── MOOD: excited + fireworks ──
  {
    id: 'sb2_excited_fireworks',
    description: 'An excited skeleton bounces around while fireworks explode rapidly',
    trigger: { size: '*', food: '*', entertainment: 'fireworks', vibe: '*', mood: 'excited' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'jump_big' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🎉' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'fire-sneeze', position: 'cs-left' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'text_popup', text: '🎆 SO EXCITED! 🎆', position: 'center', size: 'large' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎆 Bouncing Bones!',
      message: 'The skeleton is SO EXCITED the fireworks go off in rapid bursts! Energy everywhere!',
      skillTaught: 'Specificity',
      tip: 'MOOD changes how characters REACT! Excited = fast and bouncy!',
      vagueComparison: {
        vagueInput: 'Have fireworks',
        vagueResult: 'Fireworks happen. The skeleton stands there. No emotion. No energy.',
      },
    },
  },

  // ── MOOD: shy + music ──
  {
    id: 'sb2_shy_music',
    description: 'A shy skeleton peeks out while gentle music plays softly',
    trigger: { size: '*', food: '*', entertainment: 'music', vibe: '*', mood: 'shy' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_mage', position: 'ds-right', anim: 'spawn_ground' },
        { action: 'animate', character: 'skeleton_mage', anim: 'idle_alt' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: '🎵 gentle music 🎵', position: 'top', size: 'small' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'idle_alt' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '😊' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎵 Quiet Celebration',
      message: 'The skeleton feels shy, so the music is soft and gentle. A calm, sweet party.',
      skillTaught: 'Specificity',
      tip: 'SHY mood = quiet and gentle. Different moods create different party vibes!',
      vagueComparison: {
        vagueInput: 'Play music',
        vagueResult: 'Music plays at normal volume. The skeleton has no feelings about it.',
      },
    },
  },

  // ── MOOD: chaotic + dance ──
  {
    id: 'sb2_chaotic_dance',
    description: 'Chaotic dancing with characters spinning wildly everywhere',
    trigger: { size: '*', food: '*', entertainment: 'dance', vibe: '*', mood: 'chaotic' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'clown', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'animate', character: 'ninja', anim: 'taunt' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.5 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-right' },
        { action: 'text_popup', text: 'CHAOS DANCE!', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'taunt_long' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💃 CHAOS DANCE!',
      message: 'The skeleton feels CHAOTIC! Everyone dances in random directions! Total mayhem!',
      skillTaught: 'Specificity',
      tip: 'CHAOTIC mood = everything goes wild! Mood controls the energy level!',
      vagueComparison: {
        vagueInput: 'Have a dance',
        vagueResult: 'Characters sway gently. No chaos, no energy, no fun.',
      },
    },
  },

  // ── MOOD: mysterious + magic_show ──
  {
    id: 'sb2_mysterious_magic',
    description: 'A mysterious magic show with dark smoke and hidden reveals',
    trigger: { size: '*', food: '*', entertainment: 'magic_show', vibe: '*', mood: 'mysterious' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'candle_triple', position: 'cs-left' },
        { action: 'spawn', asset: 'candle_triple', position: 'cs-right' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_air' },
        { action: 'react', effect: 'smoke', position: 'cs-center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'cs-center', style: 'linear' },
        { action: 'react', effect: 'smoke', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: '✨ mystery magic ✨', position: 'top', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'idle_alt' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🤔' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎩 Mysterious Magic!',
      message: 'The skeleton feels MYSTERIOUS, so the magic is dark and secretive. What will appear?',
      skillTaught: 'Specificity',
      tip: 'MYSTERIOUS mood = suspense and shadows! Mood sets the TONE of the scene!',
      vagueComparison: {
        vagueInput: 'Do magic',
        vagueResult: 'A wizard waves a wand. Magic happens. No mystery, no mood.',
      },
    },
  },

  // ── SIZE + FOOD: giant + pizza ──
  {
    id: 'sb2_giant_pizza',
    description: 'A pizza so giant it needs multiple characters to carry it',
    trigger: { size: 'giant', food: 'pizza', entertainment: '*', vibe: '*', mood: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center', scale: 2.0 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'barbarian', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'pizza', position: 'cs-center', scale: 3.0 },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: 'MEGA PIZZA!', position: 'center', size: 'huge' },
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
        { action: 'animate', character: 'barbarian', anim: 'Cheering' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🍕' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍕 MEGA PIZZA MOUNTAIN!',
      message: 'The pizza is SO BIG it barely fits on the table! Everyone needs to help carry it!',
      skillTaught: 'Specificity',
      tip: 'GIANT size + specific food = huge versions! Try TINY for the opposite!',
      vagueComparison: {
        vagueInput: 'Bring pizza',
        vagueResult: 'A normal pizza appears. Normal size. No one is impressed.',
      },
    },
  },

  // ── SIZE + FOOD: tiny + pizza ──
  {
    id: 'sb2_tiny_pizza',
    description: 'A pizza so tiny it fits on a single finger',
    trigger: { size: 'tiny', food: 'pizza', entertainment: '*', vibe: '*', mood: '*' },
    tier: 'subtle',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'pizza', position: 'cs-center', scale: 0.1 },
        { action: 'text_popup', text: 'tiny pizza?', position: 'center', size: 'small' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'idle_alt' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🔍' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'cs-center' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🔍 Where IS it?',
      message: 'The pizza is SO TINY the skeleton needs a magnifying glass to find it! Adorable but not filling!',
      skillTaught: 'Specificity',
      tip: 'TINY + pizza = microscopic meal! SIZE matters when planning a party!',
      vagueComparison: {
        vagueInput: 'Get pizza',
        vagueResult: 'A regular pizza shows up. No size specified, no surprise.',
      },
    },
  },

  // ── SIZE + FOOD: enormous + cake ──
  {
    id: 'sb2_enormous_cake',
    description: 'A cake so enormous it towers into the sky',
    trigger: { size: 'enormous', food: 'cake', entertainment: '*', vibe: '*', mood: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-left', anim: 'spawn_ground', scale: 0.8 },
        { action: 'spawn_character', character: 'mage', position: 'ds-right', anim: 'spawn_air', scale: 0.8 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'camera_shake', intensity: 0.7, duration: 1.2 },
      ], delayAfter: 1.0 },
      { parallel: [
        { action: 'spawn', asset: 'cake_birthday', position: 'center', scale: 4.0 },
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        { action: 'screen_flash', color: 'white', duration: 0.3 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'text_popup', text: 'CAKE TOWER!', position: 'top', size: 'huge' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'wave' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎂 CAKE SKYSCRAPER!',
      message: 'The cake is SO ENORMOUS it touches the clouds! You will need a ladder to eat the top!',
      skillTaught: 'Specificity',
      tip: 'ENORMOUS is even BIGGER than GIANT! Choose your size carefully!',
      vagueComparison: {
        vagueInput: 'Make a cake',
        vagueResult: 'A normal birthday cake appears. One layer. Boring.',
      },
    },
  },

  // ── NORMAL SIZE + MOOD: normal + excited + games ──
  {
    id: 'sb2_normal_excited_games',
    description: 'A normal-sized party where excited skeleton plays energetic party games',
    trigger: { size: 'normal', food: '*', entertainment: 'games', mood: 'excited', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'present', position: 'cs-left' },
        { action: 'spawn', asset: 'present', position: 'cs-right' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'animate', character: 'skeleton_warrior', anim: 'jump_big' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'text_popup', text: 'PARTY GAMES!', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🎉' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎮 Excited Game Time!',
      message: 'The skeleton is SO EXCITED for games! Normal size, but maximum energy!',
      skillTaught: 'Specificity',
      tip: 'NORMAL size + EXCITED mood = balanced but energetic! Mood adds personality!',
      vagueComparison: {
        vagueInput: 'Play party games',
        vagueResult: 'Games happen with no emotion or energy',
      },
    },
  },

  // ── TINY + MOOD: tiny + mysterious + combat ──
  {
    id: 'sb2_tiny_mysterious_combat',
    description: 'Tiny mysterious combat with miniature warriors fighting in shadows',
    trigger: { size: 'tiny', food: '*', entertainment: 'combat', mood: 'mysterious', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'candle_triple', position: 'cs-left', scale: 0.3 },
        { action: 'spawn', asset: 'candle_triple', position: 'cs-right', scale: 0.3 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground', scale: 0.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground', scale: 0.5 },
        { action: 'react', effect: 'smoke', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'text_popup', text: 'tiny secret duel', position: 'center', size: 'small' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '⚔️' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ Secret Tiny Duel!',
      message: 'TINY warriors fight in MYSTERIOUS shadows! A secret miniature battle!',
      skillTaught: 'Specificity',
      tip: 'TINY + MYSTERIOUS = small and secretive! Size and mood work together!',
      vagueComparison: {
        vagueInput: 'Have a fight',
        vagueResult: 'Normal-sized warriors battle with no atmosphere',
      },
    },
  },

  // ── GIANT + MOOD: giant + shy + music ──
  {
    id: 'sb2_giant_shy_music',
    description: 'Giant skeleton feels shy despite huge size, soft gentle music plays',
    trigger: { size: 'giant', food: '*', entertainment: 'music', mood: 'shy', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-center', anim: 'spawn_ground', scale: 2.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_mage', position: 'ds-left', anim: 'spawn_ground', scale: 0.8 },
        { action: 'animate', character: 'skeleton_warrior', anim: 'idle_alt' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'text_popup', text: '🎵 gentle giant 🎵', position: 'top', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'emote', character: 'skeleton_warrior', emoji: '😊' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎵 Gentle Giant!',
      message: 'The skeleton is GIANT but feels SHY! Soft music for a sweet giant!',
      skillTaught: 'Specificity',
      tip: 'GIANT + SHY = big but gentle! Mood can contrast with size for surprises!',
      vagueComparison: {
        vagueInput: 'Play music',
        vagueResult: 'Music plays at normal volume with no personality',
      },
    },
  },

  // ── NORMAL + FOOD: normal + soup + dance ──
  {
    id: 'sb2_normal_soup_dance',
    description: 'Normal-sized soup party with dancing and warm celebration',
    trigger: { size: 'normal', food: 'soup', entertainment: 'dance', mood: '*', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn', asset: 'bowl', position: 'cs-center' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-left', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: 'soup & dance!', position: 'center', size: 'large' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍲 Soup Dance Party!',
      message: 'Warm soup and happy dancing! A cozy celebration with movement!',
      skillTaught: 'Specificity',
      tip: 'Specific food + specific entertainment = unique combo! Soup changes the vibe!',
      vagueComparison: {
        vagueInput: 'Have food and entertainment',
        vagueResult: 'Generic party with no specific details',
      },
    },
  },

  // ── TINY + FOOD: tiny + fruit + excited ──
  {
    id: 'sb2_tiny_fruit_excited',
    description: 'Tiny fruit party where excited skeleton bounces around berry-sized treats',
    trigger: { size: 'tiny', food: 'fruit', mood: 'excited', entertainment: '*', vibe: '*' },
    tier: 'subtle',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'apple', position: 'cs-left', scale: 0.2 },
        { action: 'spawn', asset: 'apple', position: 'cs-right', scale: 0.2 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground', scale: 0.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🍎' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'hearts-float', position: 'cs-left' },
        { action: 'react', effect: 'hearts-float', position: 'cs-right' },
        { action: 'text_popup', text: 'berry-sized fruit!', position: 'center', size: 'small' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍎 Berry Party!',
      message: 'TINY fruit with EXCITED skeleton! The apples are the size of berries!',
      skillTaught: 'Specificity',
      tip: 'TINY + FRUIT + EXCITED = small treats with big energy!',
      vagueComparison: {
        vagueInput: 'Bring fruit',
        vagueResult: 'Normal apples appear, no size, no emotion',
      },
    },
  },

  // ── ENORMOUS + MOOD: enormous + chaotic + combat ──
  {
    id: 'sb2_enormous_chaotic_combat',
    description: 'Enormous chaotic combat with giant warriors fighting wildly',
    trigger: { size: 'enormous', food: '*', entertainment: 'combat', mood: 'chaotic', vibe: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground', scale: 2.5 },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground', scale: 2.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'barbarian', position: 'ds-center', anim: 'spawn_ground', scale: 2.0 },
        { action: 'camera_shake', intensity: 0.7, duration: 1.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'animate', character: 'barbarian', anim: 'taunt' },
        { action: 'camera_shake', intensity: 0.8, duration: 1.5 },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'fire-sneeze', position: 'cs-right' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'text_popup', text: 'MEGA BATTLE!', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'spin_attack' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ ENORMOUS CHAOS BATTLE!',
      message: 'ENORMOUS warriors in CHAOTIC combat! Total mayhem at giant scale!',
      skillTaught: 'Specificity',
      tip: 'ENORMOUS + CHAOTIC = maximum wild energy! Size and mood multiply!',
      vagueComparison: {
        vagueInput: 'Have a battle',
        vagueResult: 'Normal fight with normal size and no emotion',
      },
    },
  },

  // ── NORMAL + FOOD: normal + candy + mysterious ──
  {
    id: 'sb2_normal_candy_mysterious',
    description: 'Normal candy appears mysteriously with dark magic effects',
    trigger: { size: 'normal', food: 'candy', entertainment: '*', mood: 'mysterious', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'candle_triple', position: 'cs-left' },
        { action: 'spawn', asset: 'candle_triple', position: 'cs-right' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_air' },
        { action: 'react', effect: 'smoke', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'cs-right', style: 'linear' },
        { action: 'animate', character: 'mage', anim: 'cast_spell' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn', asset: 'present', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: '🍬 mystery candy 🍬', position: 'top', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'skeleton_warrior', emoji: '🤔' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍬 Mysterious Sweets!',
      message: 'MYSTERIOUS mood makes candy appear from shadows! What flavor will it be?',
      skillTaught: 'Specificity',
      tip: 'NORMAL size + MYSTERIOUS mood = suspenseful but not overwhelming!',
      vagueComparison: {
        vagueInput: 'Give candy',
        vagueResult: 'Candy appears plainly with no atmosphere',
      },
    },
  },

  // ── GIANT + FOOD: giant + feast + excited ──
  {
    id: 'sb2_giant_feast_excited',
    description: 'Giant excited feast with massive food and bouncing energy',
    trigger: { size: 'giant', food: 'feast', mood: 'excited', entertainment: '*', vibe: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center', scale: 2.5 },
        { action: 'spawn', asset: 'burger', position: 'cs-left', scale: 2.0 },
        { action: 'spawn', asset: 'cookie', position: 'cs-right', scale: 2.0 },
        { action: 'spawn', asset: 'bowl', position: 'cs-center', scale: 1.8 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground', scale: 1.5 },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'jump_big' },
        { action: 'emote', character: 'skeleton_warrior', emoji: '🎉' },
        { action: 'camera_shake', intensity: 0.5, duration: 0.8 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-left' },
        { action: 'react', effect: 'hearts-float', position: 'cs-right' },
        { action: 'text_popup', text: 'MEGA FEAST!', position: 'center', size: 'huge' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍖 GIANT EXCITED FEAST!',
      message: 'GIANT food with EXCITED skeleton! The feast is huge and the energy is through the roof!',
      skillTaught: 'Specificity',
      tip: 'GIANT + FEAST + EXCITED = maximum party energy! All three modifiers stack!',
      vagueComparison: {
        vagueInput: 'Serve a feast',
        vagueResult: 'Normal buffet with no size or emotion',
      },
    },
  },

  // ── TINY + ENTERTAINMENT: tiny + combat + shy ──
  {
    id: 'sb2_tiny_combat_shy',
    description: 'Tiny shy warriors barely tap each other in polite miniature combat',
    trigger: { size: 'tiny', food: '*', entertainment: 'combat', mood: 'shy', vibe: '*' },
    tier: 'subtle',
    promptScore: 'funny_fail',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground', scale: 0.4 },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground', scale: 0.4 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'idle_alt' },
        { action: 'animate', character: 'knight', anim: 'idle_alt' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'question-marks', position: 'center' },
        { action: 'text_popup', text: 'gentle tap?', position: 'center', size: 'small' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'emote', character: 'skeleton_warrior', emoji: '😊' },
        { action: 'emote', character: 'knight', emoji: '😊' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ Polite Tiny Battle!',
      message: 'TINY + SHY = the warriors barely touch! They are too polite to really fight!',
      skillTaught: 'Specificity',
      tip: 'TINY + SHY = gentle and sweet! Sometimes combos create funny fails!',
      vagueComparison: {
        vagueInput: 'Have a fight',
        vagueResult: 'Normal warriors clash with normal intensity',
      },
    },
  },

  // ── ENORMOUS + FOOD: enormous + candy + chaotic ──
  {
    id: 'sb2_enormous_candy_chaotic',
    description: 'Enormous chaotic candy explosion with massive sweets everywhere',
    trigger: { size: 'enormous', food: 'candy', mood: 'chaotic', entertainment: '*', vibe: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'present', position: 'cs-left', scale: 3.0 },
        { action: 'spawn', asset: 'present', position: 'cs-right', scale: 3.0 },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground', scale: 1.5 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'ds-left', anim: 'spawn_ground', scale: 1.5 },
        { action: 'spawn_character', character: 'ninja', position: 'ds-right', anim: 'spawn_ground', scale: 1.5 },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'clown', anim: 'Cheering' },
        { action: 'animate', character: 'ninja', anim: 'taunt' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'confetti-burst', position: 'cs-left' },
        { action: 'react', effect: 'explosion-cartoon', position: 'center' },
        { action: 'react', effect: 'hearts-float', position: 'cs-right' },
        { action: 'text_popup', text: 'CANDY CHAOS!', position: 'center', size: 'huge' },
        { action: 'screen_flash', color: 'pink', duration: 0.2 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🍬 CANDY EXPLOSION!',
      message: 'ENORMOUS candy with CHAOTIC mood! Giant sweets flying everywhere!',
      skillTaught: 'Specificity',
      tip: 'ENORMOUS + CANDY + CHAOTIC = sweet mayhem! Triple stack for wild results!',
      vagueComparison: {
        vagueInput: 'Get candy',
        vagueResult: 'Some candy appears on a table, no excitement',
      },
    },
  },

  // ── NORMAL + ENTERTAINMENT: normal + combat + excited ──
  {
    id: 'sb2_normal_combat_excited',
    description: 'Normal-sized excited combat with energetic warriors bouncing around',
    trigger: { size: 'normal', food: '*', entertainment: 'combat', mood: 'excited', vibe: '*' },
    tier: 'moderate',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'jump_big' },
        { action: 'animate', character: 'knight', anim: 'wave' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: 'EXCITED DUEL!', position: 'center', size: 'large' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'sword_slash' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ Energetic Battle!',
      message: 'NORMAL size but EXCITED mood! The warriors are bouncing with energy!',
      skillTaught: 'Specificity',
      tip: 'NORMAL + EXCITED = balanced size with high energy! Mood matters!',
      vagueComparison: {
        vagueInput: 'Have a battle',
        vagueResult: 'Warriors fight with no emotion or personality',
      },
    },
  },
];

export const SKELETON_BIRTHDAY_STAGE_2: Vignette[] = [
  ...STAGE2_SIZE_MOOD_VIGNETTES,
];

export const SKELETON_BIRTHDAY_DEFAULT_2: Vignette = {
  id: 'skel_bday_default_2',
  description: 'A vague party happens — not enough detail about size or mood.',
  trigger: { size: '*', food: '*', entertainment: '*', vibe: '*', mood: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: composeBlocking(
    setupProps([
      { asset: 'table_long', mark: MARK.US_CENTER },
    ]),
    enterFromWing('skeleton_warrior', 'left', MARK.CS_CENTER, {
      arrivalAnim: 'idle_alt', emote: '🤷',
    }),
    [{
      parallel: [
        { action: 'react', effect: 'question-marks', position: MARK.CS_CENTER },
        { action: 'text_popup', text: '🎂 ...party?', position: 'center', size: 'small' },
        { action: 'sfx', sound: 'react' },
      ],
      delayAfter: 2.0,
    }],
  ),
  feedback: {
    title: '🤷 Vague Party...',
    message: "Something sort of happened... but HOW BIG? HOW does the skeleton FEEL? Be more specific!",
    skillTaught: 'Specificity',
    tip: "Try setting the SIZE and MOOD — they change everything about the party!",
    vagueComparison: {
      vagueInput: 'Have a party',
      vagueResult: "That's exactly what just happened. A vague party with vague results!",
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 3 — SECRET COMBOS (Activity pairs unlock unique vignettes)
// ═══════════════════════════════════════════════════════════════════════════════

const STAGE3_SECRET_COMBOS: Vignette[] = [
  // ── SECRET 1: magic_show + fireworks = Spellwork Spectacular ──
  {
    id: 'sb3_magic_fireworks',
    description: 'Magic show meets fireworks — spell effects become firework explosions',
    trigger: { activity1: 'magic_show', activity2: 'fireworks', spirit: '*', location: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-center' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_air' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'cs-right', style: 'linear' },
      ], delayAfter: 0.3 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'react', effect: 'fire-sneeze', position: 'top' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-right' },
        { action: 'camera_shake', intensity: 0.6, duration: 1.0 },
        { action: 'screen_flash', color: 'purple', duration: 0.2 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'text_popup', text: 'SPELL FIREWORKS!', position: 'center', size: 'huge' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🪄 SECRET: SPELLWORK SPECTACULAR!',
      message: 'Magic + Fireworks = spell effects EXPLODE in the sky! Every spell becomes a firework!',
      skillTaught: 'Combo Thinking',
      tip: 'Some activities create NEW results when combined! Magic and fireworks make spell-explosions!',
    },
  },

  // ── SECRET 2: combat + dance = Battle Dance ──
  {
    id: 'sb3_combat_dance',
    description: 'Combat meets dance — fighters move in perfectly choreographed battle',
    trigger: { activity1: 'combat', activity2: 'dance', spirit: '*', location: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
        { action: 'animate', character: 'knight', anim: 'wave' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: '⚔️ BATTLE DANCE! 💃', position: 'center', size: 'huge' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'spin_attack' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '⚔️ SECRET: BATTLE DANCE!',
      message: 'Combat + Dance = choreographed fighting! The warriors battle in perfect rhythm!',
      skillTaught: 'Combo Thinking',
      tip: 'Fighting and dancing together create a performance! What other pairs fit?',
    },
  },

  // ── SECRET 2 REVERSE: dance + combat (same result) ──
  {
    id: 'sb3_dance_combat',
    description: 'Dance meets combat — same as combat + dance',
    trigger: { activity1: 'dance', activity2: 'combat', spirit: '*', location: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'cs-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'knight', position: 'cs-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'Cheering' },
        { action: 'animate', character: 'knight', anim: 'Cheering' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
        { action: 'animate', character: 'knight', anim: 'taunt' },
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'jump_big' },
        { action: 'animate', character: 'knight', anim: 'jump_big' },
        { action: 'camera_shake', intensity: 0.4, duration: 0.8 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: '💃 DANCE BATTLE! ⚔️', position: 'center', size: 'huge' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'taunt_long' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💃 SECRET: DANCE BATTLE!',
      message: 'Dance + Combat = choreographed moves! The same combo works both ways!',
      skillTaught: 'Combo Thinking',
      tip: 'Order does not matter! Dance + Combat = Combat + Dance!',
    },
  },

  // ── SECRET 3: music + magic_show = Musical Enchantment ──
  {
    id: 'sb3_music_magic',
    description: 'Music meets magic — instruments play themselves with magical enchantment',
    trigger: { activity1: 'music', activity2: 'magic_show', spirit: '*', location: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'off-right', anim: 'spawn_air' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'move', character: 'mage', to: 'cs-right', style: 'linear' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-left' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-center' },
        { action: 'react', effect: 'sparkle-magic', position: 'cs-right' },
      ], delayAfter: 0.8 },
      { parallel: [
        { action: 'text_popup', text: '🎵 ✨ 🎵 ✨ 🎵', position: 'center', size: 'large' },
        { action: 'react', effect: 'hearts-float', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: 'MAGIC MUSIC!', position: 'top', size: 'huge' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'wave' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎵 SECRET: MUSICAL ENCHANTMENT!',
      message: 'Music + Magic = instruments play THEMSELVES! The music is alive with enchantment!',
      skillTaught: 'Combo Thinking',
      tip: 'Combining creative activities makes NEW magic! What else can you mix?',
    },
  },

  // ── SECRET 4: fireworks + games = Explosive Games ──
  {
    id: 'sb3_fireworks_games',
    description: 'Fireworks meet games — party games explode with colorful effects',
    trigger: { activity1: 'fireworks', activity2: 'games', spirit: '*', location: '*' },
    tier: 'absolute_chaos',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'present', position: 'cs-left' },
        { action: 'spawn', asset: 'present', position: 'cs-right' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'ninja', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
      ], delayAfter: 0.4 },
      { parallel: [
        { action: 'react', effect: 'explosion-cartoon', position: 'cs-left' },
        { action: 'react', effect: 'fire-sneeze', position: 'cs-right' },
        { action: 'camera_shake', intensity: 0.7, duration: 1.0 },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: 'BOOM GAMES!', position: 'center', size: 'huge' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'screen_flash', color: 'yellow', duration: 0.2 },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'jump_big' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '💥 SECRET: EXPLOSIVE GAMES!',
      message: 'Fireworks + Games = every game action explodes with fireworks! Musical chairs goes BOOM!',
      skillTaught: 'Combo Thinking',
      tip: 'Adding fireworks to games makes them EXPLOSIVE! Combine for surprises!',
    },
  },

  // ── SECRET 5: games + music = Musical Chairs Chaos ──
  {
    id: 'sb3_games_music',
    description: 'Games meet music — musical chairs where the chairs run away',
    trigger: { activity1: 'games', activity2: 'music', spirit: '*', location: '*' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      { parallel: [
        { action: 'spawn', asset: 'table_long', position: 'cs-left' },
        { action: 'spawn', asset: 'table_long', position: 'cs-right' },
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'ds-center', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'spawn_character', character: 'clown', position: 'ds-left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'robot', position: 'ds-right', anim: 'spawn_ground' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'react', effect: 'sparkle-magic', position: 'center' },
        { action: 'text_popup', text: '🎵 musical chairs! 🎵', position: 'top', size: 'large' },
        { action: 'sfx', sound: 'react' },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'move', asset: 'table_long', to: 'off-left', style: 'scatter' },
        { action: 'camera_shake', intensity: 0.3, duration: 0.8 },
      ], delayAfter: 0.6 },
      { parallel: [
        { action: 'text_popup', text: 'CHAIRS RUN AWAY!', position: 'center', size: 'huge' },
        { action: 'react', effect: 'laugh-tears', position: 'center' },
        { action: 'sfx', sound: 'success' },
      ], delayAfter: 0.5 },
      { parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'Cheering' },
      ], delayAfter: 1.5 },
    ],
    feedback: {
      title: '🎵 SECRET: MUSICAL CHAIR CHASE!',
      message: 'Games + Music = the chairs RUN AWAY during musical chairs! Catch them if you can!',
      skillTaught: 'Combo Thinking',
      tip: 'Music + Games = living musical chairs! The furniture moves on its own!',
    },
  },
];

export const SKELETON_BIRTHDAY_STAGE_3: Vignette[] = [
  ...STAGE3_SECRET_COMBOS,
];

export const SKELETON_BIRTHDAY_DEFAULT_3: Vignette = {
  id: 'skel_bday_default_3',
  description: 'Two activities happen separately — no combo discovered.',
  trigger: { activity1: '*', activity2: '*', spirit: '*', location: '*' },
  tier: 'moderate',
  promptScore: 'partial',
  steps: composeBlocking(
    setupProps([
      { asset: 'table_long', mark: MARK.US_CENTER },
    ]),
    enterFromWing('skeleton_warrior', 'left', MARK.CS_CENTER, {
      arrivalAnim: 'idle_alt',
    }),
    [{
      parallel: [
        { action: 'react', effect: 'sparkle-magic', position: MARK.CS_LEFT },
        { action: 'sfx', sound: 'react' },
      ],
      delayAfter: 0.5,
    }],
    [{
      parallel: [
        { action: 'react', effect: 'hearts-float', position: MARK.CS_RIGHT },
        { action: 'sfx', sound: 'react' },
      ],
      delayAfter: 0.5,
    }],
    [{
      parallel: [
        { action: 'animate', character: 'skeleton_warrior', anim: 'celebrate' },
        { action: 'text_popup', text: '🎉 two things!', position: 'center', size: 'small' },
      ],
      delayAfter: 2.0,
    }],
  ),
  feedback: {
    title: '🤷 Two Separate Things...',
    message: "Both activities happened, but they did not COMBINE. Try finding pairs that create NEW magic together!",
    skillTaught: 'Combo Thinking',
    tip: "Some activity pairs unlock SECRET COMBOS! Try magic + fireworks, combat + dance, or music + games!",
  },
};
