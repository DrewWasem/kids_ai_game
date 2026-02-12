import type { SceneScript } from '../types/scene-script';

/**
 * Hardcoded fallback scripts — used as Tier 2 when API fails.
 * These guarantee the demo NEVER shows an error screen.
 */
export const FALLBACK_SCRIPTS: Record<string, SceneScript> = {
  'skeleton-birthday': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The skeleton sets up a table but forgot to invite anyone!',
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'table_long', position: 'left' },
      { type: 'animate', target: 'skeleton_warrior', anim: 'Idle_A', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    prompt_feedback: 'Nice start! Try describing WHO comes to the party and what decorations you\'d put in the dungeon.',
    guide_hint: 'Try naming a character like "the knight" and tell me what they should do!',
    prompt_analysis: { has_character: false, has_action: false, has_sequence: false, has_detail: false, has_multi_char: false, has_environment: false },
  },

  'knight-space': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The robots float around the space station, bumping into everything!',
    actions: [
      { type: 'spawn', target: 'robot', position: 'left' },
      { type: 'spawn', target: 'space_ranger', position: 'right' },
      { type: 'move', target: 'robot', to: 'center', style: 'bounce' },
      { type: 'react', effect: 'stars-spin', position: 'center' },
    ],
    prompt_feedback: 'Good try! Think about how to fix the space station and who might help.',
    guide_hint: 'Try telling the space ranger or engineer what to repair and how!',
    prompt_analysis: { has_character: false, has_action: false, has_sequence: false, has_detail: false, has_multi_char: false, has_environment: false },
  },

  'barbarian-school': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The monsters arrive at the playground but just stand there looking confused!',
    actions: [
      { type: 'spawn', target: 'barbarian', position: 'left' },
      { type: 'spawn', target: 'clown', position: 'right' },
      { type: 'animate', target: 'barbarian', anim: 'Idle_A', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    prompt_feedback: 'The playground is waiting! Tell the monsters what to play.',
    guide_hint: 'Try saying something like "the barbarian goes down the slide while the clown juggles"!',
    prompt_analysis: { has_character: false, has_action: false, has_sequence: false, has_detail: false, has_multi_char: false, has_environment: false },
  },

  'skeleton-pizza': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The restaurant is a mess and nobody knows what to cook!',
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'left' },
      { type: 'spawn', target: 'pizza', position: 'center' },
      { type: 'animate', target: 'skeleton_warrior', anim: 'PickUp', duration_ms: 600 },
      { type: 'react', effect: 'fire-sneeze', position: 'center' },
    ],
    prompt_feedback: 'The kitchen needs a chef! Who cooks what?',
    guide_hint: 'Try describing who makes the pizza and what toppings they put on it!',
    prompt_analysis: { has_character: false, has_action: false, has_sequence: false, has_detail: false, has_multi_char: false, has_environment: false },
  },

  'adventurers-picnic': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The adventurers found the clearing but something magical just fizzled out!',
    actions: [
      { type: 'spawn', target: 'ranger', position: 'left' },
      { type: 'spawn', target: 'druid', position: 'right' },
      { type: 'react', effect: 'sparkle-magic', position: 'center' },
    ],
    prompt_feedback: 'The forest is full of mysteries! What magical thing happens?',
    guide_hint: 'Try describing what the adventurers discover and how they react to it!',
    prompt_analysis: { has_character: false, has_action: false, has_sequence: false, has_detail: false, has_multi_char: false, has_environment: false },
  },

  'dungeon-concert': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The dungeon door creaks open but nobody has a plan yet!',
    actions: [
      { type: 'spawn', target: 'knight', position: 'left' },
      { type: 'spawn', target: 'rogue', position: 'right' },
      { type: 'spawn', target: 'chest', position: 'center' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    prompt_feedback: 'You need an escape plan! What do you do first?',
    guide_hint: 'Try telling the rogue to pick the lock or the mage to cast a spell!',
    prompt_analysis: { has_character: false, has_action: false, has_sequence: false, has_detail: false, has_multi_char: false, has_environment: false },
  },

  'mage-kitchen': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The mage zaps the stove but the pot starts flying across the room!',
    actions: [
      { type: 'spawn', target: 'mage', position: 'left' },
      { type: 'spawn', target: 'pot', position: 'right' },
      { type: 'animate', target: 'mage', anim: 'Interact', duration_ms: 600 },
      { type: 'react', effect: 'sparkle-magic', position: 'right' },
    ],
    prompt_feedback: 'The kitchen is alive! How does the mage tame it?',
    guide_hint: 'Try describing a specific spell the mage uses and what happens to each kitchen item!',
    prompt_analysis: { has_character: false, has_action: false, has_sequence: false, has_detail: false, has_multi_char: false, has_environment: false },
  },
};
