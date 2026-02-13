import { describe, it, expect } from 'vitest';
import { FALLBACK_SCRIPTS } from '../fallback-scripts';

// ── Vocabulary contract values ──────────────────────────────────────────────

const VALID_SUCCESS_LEVELS = ['FULL_SUCCESS', 'PARTIAL_SUCCESS', 'FUNNY_FAIL'] as const;

const VALID_ACTION_TYPES = [
  'spawn', 'move', 'animate', 'react', 'emote', 'sfx', 'wait', 'remove',
] as const;

// Legacy 2D + 3D actor keys (used across all fallback scripts)
const VALID_ACTOR_KEYS = [
  // Legacy 2D
  'monster', 'dog', 'trex', 'octopus', 'robot',
  'wizard', 'kid', 'fish', 'squirrel',
  // 3D KayKit characters
  'knight', 'barbarian', 'mage', 'ranger', 'rogue', 'druid', 'engineer',
  'skeleton_warrior', 'skeleton_mage', 'skeleton_rogue', 'skeleton_minion', 'necromancer',
  'space_ranger', 'ninja', 'clown', 'witch', 'vampire', 'black_knight', 'superhero', 'caveman', 'frost_golem', 'survivalist',
] as const;

// Legacy 2D + 3D prop keys
const VALID_PROP_KEYS = [
  // Legacy 2D
  'cake', 'cake-giant', 'cake-tiny', 'rocket', 'spacesuit',
  'moon', 'flag', 'plates', 'soup-bowl', 'toaster',
  'fridge', 'desk', 'pencil', 'chair', 'lunchbox',
  'guitar', 'drums', 'keyboard', 'microphone',
  'pizza', 'pizza-soggy', 'river', 'pillow-fort',
  'bone', 'balloon', 'present', 'stars', 'fire-extinguisher',
  // 3D props
  'torch', 'barrel', 'crate', 'chest', 'table', 'bench',
  'tree', 'rock', 'bush', 'fence', 'sign', 'lamp',
  'sword', 'shield', 'bow', 'potion', 'scroll',
  'cake-3d', 'cupcake', 'bread', 'pie',
  'blanket', 'basket', 'plate', 'cup', 'bottle',
  'candle', 'book', 'clock', 'rug',
  'slide', 'swing', 'sandbox', 'seesaw', 'merry_go_round',
  'sink', 'oven', 'stove', 'pan', 'pot',
  'pizza_pepperoni', 'apple', 'picnic_blanket',
  'present_A_red', 'present_B_blue', 'banner_blue', 'banner_red',
  'table_long', 'chair_A',
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
  // 1. Has entries for all 7 3D tasks
  it('has entries for all 7 3D tasks', () => {
    expect(FALLBACK_SCRIPTS).toHaveProperty('skeleton-birthday');
    expect(FALLBACK_SCRIPTS).toHaveProperty('knight-space');
    expect(FALLBACK_SCRIPTS).toHaveProperty('mage-kitchen');
    expect(FALLBACK_SCRIPTS).toHaveProperty('barbarian-school');
    expect(FALLBACK_SCRIPTS).toHaveProperty('dungeon-concert');
    expect(FALLBACK_SCRIPTS).toHaveProperty('skeleton-pizza');
    expect(FALLBACK_SCRIPTS).toHaveProperty('adventurers-picnic');
  });

  // 2. Has exactly 7 total tasks
  it('has 7 total fallback scripts', () => {
    expect(Object.keys(FALLBACK_SCRIPTS)).toHaveLength(7);
  });

  const taskKeys = Object.keys(FALLBACK_SCRIPTS);

  describe.each(taskKeys)('script: %s', (taskKey) => {
    const script = FALLBACK_SCRIPTS[taskKey];

    it('has a valid success_level', () => {
      expect(VALID_SUCCESS_LEVELS).toContain(script.success_level);
    });

    it('has a non-empty narration under 25 words', () => {
      expect(typeof script.narration).toBe('string');
      expect(script.narration.length).toBeGreaterThan(0);
      const words = wordCount(script.narration);
      expect(words).toBeGreaterThan(0);
      expect(words).toBeLessThanOrEqual(MAX_NARRATION_WORDS);
    });

    it('has a non-empty actions array', () => {
      expect(Array.isArray(script.actions)).toBe(true);
      expect(script.actions.length).toBeGreaterThan(0);
    });

    it('has a non-empty prompt_feedback string', () => {
      expect(typeof script.prompt_feedback).toBe('string');
      expect(script.prompt_feedback.length).toBeGreaterThan(0);
    });

    it('all actions have valid types', () => {
      for (const action of script.actions) {
        expect(VALID_ACTION_TYPES).toContain(action.type);
      }
    });

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

    it('animate actions reference valid actor keys', () => {
      const animateActions = script.actions.filter((a) => a.type === 'animate');
      for (const action of animateActions) {
        if ('target' in action) {
          expect(VALID_ACTOR_KEYS).toContain(action.target);
        }
      }
    });

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

    it(`has at most ${MAX_ACTIONS} actions`, () => {
      expect(script.actions.length).toBeLessThanOrEqual(MAX_ACTIONS);
    });

    it('missing_elements, if present, is an array of strings', () => {
      if (script.missing_elements !== undefined) {
        expect(Array.isArray(script.missing_elements)).toBe(true);
        for (const el of script.missing_elements) {
          expect(typeof el).toBe('string');
        }
      }
    });
  });

  // ── 3D-specific validation ──────────────────────────────────────────────

  describe('3D fallback scripts use correct 3D vocabulary', () => {
    const threeDTasks = [
      'skeleton-birthday', 'knight-space', 'mage-kitchen',
      'barbarian-school', 'dungeon-concert', 'skeleton-pizza', 'adventurers-picnic',
    ];

    it.each(threeDTasks)('%s uses 3D character names (not legacy 2D)', (taskKey) => {
      const script = FALLBACK_SCRIPTS[taskKey];
      const spawnActions = script.actions.filter((a) => a.type === 'spawn');
      const animateActions = script.actions.filter((a) => a.type === 'animate');

      const legacy2DOnly = ['monster', 'dog', 'trex', 'octopus', 'wizard', 'kid', 'fish', 'squirrel'];

      // 3D tasks should NOT use legacy 2D-only actor names
      for (const action of [...spawnActions, ...animateActions]) {
        if ('target' in action) {
          const target = action.target as string;
          // Only check character targets, skip props
          if (VALID_ACTOR_KEYS.includes(target as typeof VALID_ACTOR_KEYS[number])) {
            expect(legacy2DOnly).not.toContain(target);
          }
        }
      }
    });

    it('skeleton-birthday spawns skeleton_warrior', () => {
      const script = FALLBACK_SCRIPTS['skeleton-birthday'];
      const spawns = script.actions
        .filter((a) => a.type === 'spawn')
        .map((a) => ('target' in a ? a.target : ''));
      expect(spawns).toContain('skeleton_warrior');
    });

    it('skeleton-pizza spawns skeleton_warrior and pizza', () => {
      const script = FALLBACK_SCRIPTS['skeleton-pizza'];
      const spawns = script.actions
        .filter((a) => a.type === 'spawn')
        .map((a) => ('target' in a ? a.target : ''));
      expect(spawns).toContain('skeleton_warrior');
      expect(spawns).toContain('pizza');
    });

    it('adventurers-picnic spawns ranger and druid', () => {
      const script = FALLBACK_SCRIPTS['adventurers-picnic'];
      const spawns = script.actions
        .filter((a) => a.type === 'spawn')
        .map((a) => ('target' in a ? a.target : ''));
      expect(spawns).toContain('ranger');
      expect(spawns).toContain('druid');
    });
  });
});
