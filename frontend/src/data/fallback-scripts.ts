import type { SceneScript } from '../types/scene-script';

/**
 * Hardcoded fallback scripts — used as Tier 3 when cache misses AND API fails.
 * These guarantee the demo NEVER shows an error screen.
 */
export const FALLBACK_SCRIPTS: Record<string, SceneScript> = {
  'monster-party': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The monster tries to party, but something feels incomplete!',
    actions: [
      { type: 'spawn', target: 'cake', position: 'left' },
      { type: 'move', target: 'cake', to: 'center', style: 'arc' },
      { type: 'animate', target: 'monster', anim: 'confused', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['decorations', 'entertainment'],
    prompt_feedback: 'Good start! Try describing what KIND of party the monster should have — what decorations, food, and fun activities?',
  },

  'robot-pizza': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The robot picks up the pizza but looks lost!',
    actions: [
      { type: 'spawn', target: 'robot', position: 'left' },
      { type: 'spawn', target: 'pizza', position: 'center' },
      { type: 'move', target: 'robot', to: 'center', style: 'linear' },
      { type: 'animate', target: 'robot', anim: 'confused', duration_ms: 600 },
    ],
    missing_elements: ['delivery destination', 'obstacles to avoid'],
    prompt_feedback: 'Nice try! Tell the robot WHERE to deliver the pizza and what to watch out for on the way.',
  },
};
