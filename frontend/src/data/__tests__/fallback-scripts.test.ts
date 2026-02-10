import { describe, it, expect } from 'vitest';
import { FALLBACK_SCRIPTS } from '../fallback-scripts';

// ── Vocabulary contract values ──────────────────────────────────────────────

const VALID_SUCCESS_LEVELS = ['FULL_SUCCESS', 'PARTIAL_SUCCESS', 'FUNNY_FAIL'] as const;

const VALID_ACTION_TYPES = [
  'spawn', 'move', 'animate', 'react', 'emote', 'sfx', 'wait', 'remove',
] as const;

const VALID_ACTOR_KEYS = [
  'monster', 'dog', 'trex', 'octopus', 'robot',
  'wizard', 'kid', 'fish', 'squirrel',
] as const;

const VALID_PROP_KEYS = [
  'cake', 'cake-giant', 'cake-tiny', 'rocket', 'spacesuit',
  'moon', 'flag', 'plates', 'soup-bowl', 'toaster',
  'fridge', 'desk', 'pencil', 'chair', 'lunchbox',
  'guitar', 'drums', 'keyboard', 'microphone',
  'pizza', 'pizza-soggy', 'river', 'pillow-fort',
  'bone', 'balloon', 'present', 'stars', 'fire-extinguisher',
] as const;

const VALID_SPAWN_TARGETS = [...VALID_ACTOR_KEYS, ...VALID_PROP_KEYS];

const VALID_POSITIONS = [
  'left', 'center', 'right', 'top', 'bottom',
  'off-left', 'off-right', 'off-top',
] as const;

const VALID_MOVE_STYLES = [
  'linear', 'arc', 'bounce', 'float', 'shake', 'spin-in', 'drop-in',
] as const;

const VALID_REACTION_KEYS = [
  'confetti-burst', 'explosion-cartoon', 'hearts-float',
  'stars-spin', 'question-marks', 'laugh-tears',
  'fire-sneeze', 'splash', 'sparkle-magic', 'sad-cloud',
] as const;

const MAX_ACTIONS = 8;
const MAX_NARRATION_WORDS = 25;

// ── Helpers ─────────────────────────────────────────────────────────────────

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('FALLBACK_SCRIPTS', () => {
  // 1. Has entries for both tasks
  it('has entries for "monster-party" and "robot-pizza"', () => {
    expect(FALLBACK_SCRIPTS).toHaveProperty('monster-party');
    expect(FALLBACK_SCRIPTS).toHaveProperty('robot-pizza');
  });

  const taskKeys = Object.keys(FALLBACK_SCRIPTS);

  describe.each(taskKeys)('script: %s', (taskKey) => {
    const script = FALLBACK_SCRIPTS[taskKey];

    // 2. Valid success_level
    it('has a valid success_level', () => {
      expect(VALID_SUCCESS_LEVELS).toContain(script.success_level);
    });

    // 3. Narration is non-empty and under 25 words
    it('has a non-empty narration under 25 words', () => {
      expect(typeof script.narration).toBe('string');
      expect(script.narration.length).toBeGreaterThan(0);
      const words = wordCount(script.narration);
      expect(words).toBeGreaterThan(0);
      expect(words).toBeLessThanOrEqual(MAX_NARRATION_WORDS);
    });

    // 4. Non-empty actions array
    it('has a non-empty actions array', () => {
      expect(Array.isArray(script.actions)).toBe(true);
      expect(script.actions.length).toBeGreaterThan(0);
    });

    // 5. Non-empty prompt_feedback
    it('has a non-empty prompt_feedback string', () => {
      expect(typeof script.prompt_feedback).toBe('string');
      expect(script.prompt_feedback.length).toBeGreaterThan(0);
    });

    // 6. Every action has a valid type
    it('all actions have valid types', () => {
      for (const action of script.actions) {
        expect(VALID_ACTION_TYPES).toContain(action.type);
      }
    });

    // 7. Spawn actions reference valid actor/prop keys
    it('spawn actions reference valid actor or prop keys', () => {
      const spawnActions = script.actions.filter((a) => a.type === 'spawn');
      for (const action of spawnActions) {
        if ('target' in action) {
          expect(VALID_SPAWN_TARGETS).toContain(action.target);
        }
        if ('position' in action) {
          expect(VALID_POSITIONS).toContain(action.position);
        }
      }
    });

    // 8. Move actions have valid position targets and optional valid move styles
    it('move actions have valid positions and styles', () => {
      const moveActions = script.actions.filter((a) => a.type === 'move');
      for (const action of moveActions) {
        if ('to' in action) {
          expect(VALID_POSITIONS).toContain(action.to);
        }
        if ('style' in action && action.style !== undefined) {
          expect(VALID_MOVE_STYLES).toContain(action.style);
        }
        if ('target' in action) {
          expect(VALID_SPAWN_TARGETS).toContain(action.target);
        }
      }
    });

    // 9. Animate actions reference valid actor keys
    it('animate actions reference valid actor keys', () => {
      const animateActions = script.actions.filter((a) => a.type === 'animate');
      for (const action of animateActions) {
        if ('target' in action) {
          expect(VALID_ACTOR_KEYS).toContain(action.target);
        }
      }
    });

    // 10. React actions reference valid reaction keys and positions
    it('react actions reference valid reaction keys and positions', () => {
      const reactActions = script.actions.filter((a) => a.type === 'react');
      for (const action of reactActions) {
        if ('effect' in action) {
          expect(VALID_REACTION_KEYS).toContain(action.effect);
        }
        if ('position' in action) {
          expect(VALID_POSITIONS).toContain(action.position);
        }
      }
    });

    // 11. Actions array has <= 8 actions (contract max)
    it(`has at most ${MAX_ACTIONS} actions`, () => {
      expect(script.actions.length).toBeLessThanOrEqual(MAX_ACTIONS);
    });

    // 12. missing_elements is optional, but if present it's an array of strings
    it('missing_elements, if present, is an array of strings', () => {
      if (script.missing_elements !== undefined) {
        expect(Array.isArray(script.missing_elements)).toBe(true);
        for (const el of script.missing_elements) {
          expect(typeof el).toBe('string');
        }
      }
    });
  });
});
