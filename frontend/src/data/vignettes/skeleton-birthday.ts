/**
 * Skeleton Birthday Quest — Vignettes for all 3 stages.
 *
 * Stage 1: "Plan a party with {FOOD} and {ENTERTAINMENT} for a {VIBE} birthday"
 * Stage 2: "Get the skeleton to {ACTION} with a {COMPANION} at the {LOCATION}"
 * Stage 3: "For the grand finale, make {NUMBER} guests {GROUP_ACTION} while {CHAOS_EVENT} happens"
 */

import type { Vignette } from '../../types/madlibs';

// ─── STAGE 1 VIGNETTES ──────────────────────────────────────────────────────

export const SKELETON_BIRTHDAY_STAGE_1: Vignette[] = [

  // ── PERFECT: cake + magic_show + spooky ────────────────────────────────────
  {
    id: 'skel_bday_1_perfect_cake_magic_spooky',
    trigger: { food: 'cake', entertainment: 'magic_show', vibe: 'spooky' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      // Scene setup
      {
        parallel: [
          { action: 'spawn', asset: 'table_long', position: 'center' },
          { action: 'spawn', asset: 'candle_triple', position: 'left' },
          { action: 'spawn', asset: 'candle_triple', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Birthday skeleton rises from ground
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.8,
      },
      // Skeleton taunts excitedly
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '🎂' },
        ],
        delayAfter: 0.5,
      },
      // Guests arrive
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_mage', position: 'left', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'skeleton_minion', position: 'right', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'knight', position: 'bottom', anim: 'spawn_ground' },
          { action: 'sfx', sound: 'spawn' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      // Guests wave
      {
        parallel: [
          { action: 'animate', character: 'skeleton_mage', anim: 'wave' },
          { action: 'animate', character: 'skeleton_minion', anim: 'wave' },
          { action: 'animate', character: 'knight', anim: 'celebrate' },
        ],
        delayAfter: 0.6,
      },
      // Wizard enters dramatically
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'right', anim: 'spawn_air' },
          { action: 'react', effect: 'sparkle-magic', position: 'right' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.4,
      },
      // Wizard casts spell
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'react' },
          { action: 'camera_shake', intensity: 0.3, duration: 1.5 },
        ],
        delayAfter: 1.5,
      },
      // CAKE APPEARS
      {
        parallel: [
          { action: 'spawn', asset: 'cookie', position: 'center' },
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
          { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
          { action: 'screen_flash', color: 'white', duration: 0.2 },
          { action: 'text_popup', text: '✨ MAGIC CAKE! ✨', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.3,
      },
      // Everyone celebrates
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'animate', character: 'mage', anim: 'taunt' },
          { action: 'sfx', sound: 'success' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
        ],
        delayAfter: 0.8,
      },
      // Spooky finale — skull cake topper
      {
        parallel: [
          { action: 'spawn', asset: 'skull', position: 'center' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Final celebration
      {
        parallel: [
          { action: 'spawn', asset: 'banner_red', position: 'top' },
          { action: 'text_popup', text: '🎉 HAPPY BONE-DAY! 🎉', position: 'center', size: 'huge' },
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌟 PERFECT PARTY!',
      message: "You planned an amazing spooky birthday! You said WHAT food (magic cake), WHAT entertainment (a magic show), and WHAT vibe (spooky). When you're specific about all the details, everything comes together perfectly!",
      skillTaught: 'Specificity',
      tip: 'Great prompts answer WHO, WHAT, WHERE, and HOW — you nailed it!',
    },
  },

  // ── CHAOTIC: pizza + music + wild ──────────────────────────────────────────
  {
    id: 'skel_bday_1_chaos_pizza_music_wild',
    trigger: { food: 'pizza', entertainment: 'music', vibe: 'wild' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      // Skeleton already partying
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'jump_idle' },
          { action: 'sfx', sound: 'spawn' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '🤘' },
        ],
        delayAfter: 0.3,
      },
      // PIZZA RAIN
      {
        parallel: [
          { action: 'spawn_rain', asset: 'pizza_slice', quantity: 10, position: 'wide' },
          { action: 'sfx', sound: 'react' },
          { action: 'camera_shake', intensity: 0.4, duration: 2.0 },
          { action: 'text_popup', text: '🍕 PIZZA STORM! 🍕', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Skeleton gets bonked
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'get_hit' },
          { action: 'sfx', sound: 'fail' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '😵' },
        ],
        delayAfter: 0.4,
      },
      // More skeletons spawn in chaos
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_mage', position: 'left', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'skeleton_minion', position: 'right', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'clown', position: 'bottom', anim: 'skel_spawn' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      // They all "dance" with combat anims
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'spin_attack' },
          { action: 'animate', character: 'skeleton_mage', anim: 'kick' },
          { action: 'animate', character: 'skeleton_minion', anim: 'jump_idle' },
          { action: 'animate', character: 'clown', anim: 'pushups' },
          { action: 'sfx', sound: 'react' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
        ],
        delayAfter: 1.5,
      },
      // Barrel thrown
      {
        parallel: [
          { action: 'animate', character: 'skeleton_mage', anim: 'throw' },
          { action: 'spawn', asset: 'barrel', position: 'center' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      // Crash
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'center' },
          { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
          { action: 'sfx', sound: 'fail' },
          { action: 'crowd_react', characters: ['skeleton_minion', 'clown'], anim: 'dodge_back' },
          { action: 'screen_flash', color: 'orange', duration: 0.15 },
        ],
        delayAfter: 0.5,
      },
      // Comedy beat — silence
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'taunt_long' },
          { action: 'animate', character: 'skeleton_mage', anim: 'lie_idle' },
          { action: 'animate', character: 'skeleton_minion', anim: 'sit_floor' },
          { action: 'animate', character: 'clown', anim: 'die_dramatic' },
        ],
        delayAfter: 1.0,
      },
      // One last pizza bonk
      {
        parallel: [
          { action: 'spawn', asset: 'pizza_slice', position: 'center' },
          { action: 'animate', character: 'skeleton_warrior', anim: 'die_flop' },
          { action: 'sfx', sound: 'fail' },
          { action: 'camera_shake', intensity: 0.3, duration: 0.3 },
        ],
        delayAfter: 0.5,
      },
      // Final text
      {
        parallel: [
          { action: 'text_popup', text: '🍕 BEST. PARTY. EVER. 🍕', position: 'center', size: 'huge' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🌪️ TOTAL CHAOS!',
      message: "Well... that was WILD! Pizza rain + wild music = absolute madness. Your choices were fun but didn't work TOGETHER — that's why the party went bonkers!",
      skillTaught: 'Specificity',
      tip: "Try picking a food and entertainment that go together — like cake + magic show. Matching details = better results!",
    },
  },

  // ── PARTIAL: any food + any entertainment + missing vibe ───────────────────
  {
    id: 'skel_bday_1_partial_no_vibe',
    trigger: { food: '*', entertainment: '*', vibe: 'default' },
    tier: 'subtle',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'table_long', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'mage', position: 'right', anim: 'idle' },
          { action: 'emote', character: 'mage', emoji: '🤷' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'idle_alt' },
          { action: 'emote', character: 'skeleton_warrior', text: '...what kind of party is this?' },
        ],
        delayAfter: 1.5,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'present_red', position: 'center' },
          { action: 'react', effect: 'sad-cloud', position: 'center' },
          { action: 'text_popup', text: '🎈 ...', position: 'top', size: 'small' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'sit_down' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '😐 Almost a Party...',
      message: "The food and entertainment showed up, but without a VIBE, nobody knew how to act! Was it supposed to be spooky? Fancy? Wild?",
      skillTaught: 'Specificity',
      tip: "Every detail matters! Try filling in ALL the blanks — especially the vibe. It ties everything together!",
    },
  },

  // ── PERFECT: feast + fireworks + epic ──────────────────────────────────────
  {
    id: 'skel_bday_1_perfect_feast_fireworks_epic',
    trigger: { food: 'feast', entertainment: 'fireworks', vibe: 'epic' },
    tier: 'spectacular',
    promptScore: 'perfect',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'table_long', position: 'center' },
          { action: 'spawn', asset: 'table_long', position: 'left' },
          { action: 'spawn', asset: 'table_long', position: 'right' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'skeleton_mage', position: 'left', anim: 'spawn_air' },
          { action: 'spawn_character', character: 'knight', position: 'right', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'mage', position: 'bottom', anim: 'spawn_air' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      // Epic feast appears
      {
        parallel: [
          { action: 'spawn', asset: 'dinner_plate', position: 'center' },
          { action: 'spawn', asset: 'sandwich', position: 'left' },
          { action: 'spawn', asset: 'stew_pot', position: 'right' },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '⚔️ EPIC FEAST! ⚔️', position: 'top', size: 'huge' },
        ],
        delayAfter: 0.5,
      },
      // Everyone cheers
      {
        parallel: [
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      // Mage launches fireworks
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_spell' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.3,
      },
      {
        parallel: [
          { action: 'react', effect: 'explosion-cartoon', position: 'top' },
          { action: 'react', effect: 'stars-spin', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'left' },
          { action: 'camera_shake', intensity: 0.4, duration: 1.0 },
          { action: 'sfx', sound: 'success' },
          { action: 'screen_flash', color: 'gold', duration: 0.2 },
        ],
        delayAfter: 0.5,
      },
      // Grand finale
      {
        parallel: [
          { action: 'spawn', asset: 'banner_red', position: 'top' },
          { action: 'text_popup', text: '🎆 LEGENDARY BIRTHDAY! 🎆', position: 'center', size: 'huge' },
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'react', effect: 'hearts-float', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🏆 LEGENDARY!',
      message: "An epic feast with fireworks?! That's EXACTLY how a legendary skeleton celebrates! You nailed every detail.",
      skillTaught: 'Specificity',
      tip: "You're a natural prompt engineer! Try the other quests to test your skills!",
    },
  },

  // ── CHAOTIC: fruit + combat_show + silly ───────────────────────────────────
  {
    id: 'skel_bday_1_chaos_fruit_combat_silly',
    trigger: { food: 'fruit', entertainment: 'combat_show', vibe: 'silly' },
    tier: 'absolute_chaos',
    promptScore: 'chaotic',
    steps: [
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
          { action: 'emote', character: 'skeleton_warrior', emoji: '🤔' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      // Fruit rains down
      {
        parallel: [
          { action: 'spawn_rain', asset: 'apple', quantity: 8, position: 'wide' },
          { action: 'sfx', sound: 'react' },
          { action: 'text_popup', text: '🍎 FRUIT STORM! 🍎', position: 'top', size: 'huge' },
          { action: 'camera_shake', intensity: 0.3, duration: 1.5 },
        ],
        delayAfter: 0.5,
      },
      // Knight charges in for combat
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
          { action: 'animate', character: 'knight', anim: 'sword_slash' },
          { action: 'sfx', sound: 'move' },
        ],
        delayAfter: 0.3,
      },
      // Knight slips on fruit
      {
        parallel: [
          { action: 'animate', character: 'knight', anim: 'die_flop' },
          { action: 'sfx', sound: 'fail' },
          { action: 'react', effect: 'stars-spin', position: 'left' },
          { action: 'emote', character: 'knight', emoji: '🍌' },
        ],
        delayAfter: 0.5,
      },
      // Clown appears
      {
        parallel: [
          { action: 'spawn_character', character: 'clown', position: 'right', anim: 'spawn_air' },
          { action: 'animate', character: 'clown', anim: 'celebrate' },
          { action: 'react', effect: 'laugh-tears', position: 'right' },
        ],
        delayAfter: 0.5,
      },
      // Skeleton laughs
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
          { action: 'react', effect: 'laugh-tears', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 0.5,
      },
      // Finale
      {
        parallel: [
          { action: 'text_popup', text: '🎪 SILLY BRAWL! 🎪', position: 'center', size: 'huge' },
          { action: 'react', effect: 'confetti-burst', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
    feedback: {
      title: '🤪 SILLY CHAOS!',
      message: "A fruit fight at a birthday party? The knight slipped on a banana and the clown loved it! Your wild combo made everyone laugh.",
      skillTaught: 'Creativity',
      tip: "Wild combos are hilarious! But for a 'perfect' party, try picking things that work together.",
    },
  },

  // ── VIBE MATCH: any + any + spooky ─────────────────────────────────────────
  {
    id: 'skel_bday_1_vibe_spooky',
    trigger: { food: '*', entertainment: '*', vibe: 'spooky' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'awaken' },
          { action: 'sfx', sound: 'spawn' },
          { action: 'spawn', asset: 'candle_triple', position: 'left' },
          { action: 'spawn', asset: 'candle_triple', position: 'right' },
        ],
        delayAfter: 0.8,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'skull', position: 'center' },
          { action: 'spawn', asset: 'pumpkin_jackolantern', position: 'left' },
          { action: 'react', effect: 'fire-sneeze', position: 'center' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_mage', position: 'left', anim: 'spawn_ground' },
          { action: 'spawn_character', character: 'necromancer', position: 'right', anim: 'spawn_ground' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'taunt' },
          { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '👻 SPOOKY PARTY! 👻', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
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
    trigger: { food: '*', entertainment: '*', vibe: 'fancy' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn', asset: 'pillar', position: 'left' },
          { action: 'spawn', asset: 'pillar', position: 'right' },
          { action: 'spawn', asset: 'rug', position: 'center' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.4,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'spawn_ground' },
          { action: 'spawn', asset: 'chest_gold', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'spawn_character', character: 'knight', position: 'left', anim: 'walk_swagger' },
          { action: 'spawn_character', character: 'mage', position: 'right', anim: 'walk_swagger' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'skeleton_warrior', anim: 'wave' },
          { action: 'crowd_react', characters: 'all', anim: 'wave' },
          { action: 'text_popup', text: '🎩 FANCY! 🎩', position: 'center', size: 'large' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'success' },
        ],
        delayAfter: 2.0,
      },
    ],
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
    trigger: { food: '*', entertainment: 'magic_show', vibe: '*' },
    tier: 'moderate',
    promptScore: 'partial',
    steps: [
      {
        parallel: [
          { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
          { action: 'spawn_character', character: 'mage', position: 'right', anim: 'spawn_air' },
          { action: 'sfx', sound: 'spawn' },
        ],
        delayAfter: 0.5,
      },
      {
        parallel: [
          { action: 'animate', character: 'mage', anim: 'cast_long' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'sfx', sound: 'react' },
        ],
        delayAfter: 1.0,
      },
      {
        parallel: [
          { action: 'spawn', asset: 'potion_red', position: 'center' },
          { action: 'react', effect: 'sparkle-magic', position: 'center' },
          { action: 'animate', character: 'skeleton_warrior', anim: 'celebrate' },
          { action: 'sfx', sound: 'success' },
          { action: 'text_popup', text: '✨ MAGIC! ✨', position: 'center', size: 'large' },
        ],
        delayAfter: 2.0,
      },
    ],
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
  trigger: { food: '*', entertainment: '*', vibe: '*' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    {
      parallel: [
        { action: 'spawn_character', character: 'skeleton_warrior', position: 'center', anim: 'skel_spawn' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.8,
    },
    {
      parallel: [
        { action: 'spawn', asset: 'table_long', position: 'center' },
        { action: 'spawn', asset: 'present_red', position: 'left' },
        { action: 'spawn', asset: 'present_blue', position: 'right' },
        { action: 'sfx', sound: 'spawn' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'knight', position: 'left', anim: 'spawn_ground' },
        { action: 'spawn_character', character: 'mage', position: 'right', anim: 'spawn_air' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'confetti-burst', position: 'center' },
        { action: 'sfx', sound: 'success' },
        { action: 'text_popup', text: '🎉 HAPPY BIRTHDAY! 🎉', position: 'center', size: 'large' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🎂 Party Time!',
    message: "A birthday party happened! It was... fine. But imagine how much MORE fun it would be if you picked specific food, entertainment, and a vibe!",
    skillTaught: 'Specificity',
    tip: "Try filling in all three blanks with specific choices. Each detail you add makes the party crazier!",
  },
};
