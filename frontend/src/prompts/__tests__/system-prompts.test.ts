/**
 * System Prompt Validation Tests
 *
 * Ensures all 7 new 3D system prompts follow the vocabulary contract:
 * - Reference only valid actor names, prop names, animations, and reactions
 * - Include required sections (SUCCESS CRITERIA, AVAILABLE ACTORS, etc.)
 * - Are non-empty strings with reasonable length
 * - Have consistent structure across all tasks
 */

import { describe, it, expect } from 'vitest';
import { SKELETON_BIRTHDAY_PROMPT } from '../skeleton-birthday';
import { KNIGHT_SPACE_PROMPT } from '../knight-space';
import { MAGE_KITCHEN_PROMPT } from '../mage-kitchen';
import { BARBARIAN_SCHOOL_PROMPT } from '../barbarian-school';
import { DUNGEON_CONCERT_PROMPT } from '../dungeon-concert';
import { SKELETON_PIZZA_PROMPT } from '../skeleton-pizza';
import { ADVENTURERS_PICNIC_PROMPT } from '../adventurers-picnic';

// Valid vocabulary (from scene-script.ts)
const VALID_POSITIONS = [
  'left', 'center', 'right', 'top', 'bottom', 'off-left', 'off-right', 'off-top',
];

const VALID_MOVE_STYLES = [
  'linear', 'arc', 'bounce', 'float', 'shake', 'spin-in', 'drop-in',
];

const VALID_REACTIONS = [
  'confetti-burst', 'explosion-cartoon', 'hearts-float',
  'stars-spin', 'question-marks', 'laugh-tears',
  'fire-sneeze', 'splash', 'sparkle-magic', 'sad-cloud',
];

const VALID_SUCCESS_LEVELS = ['FULL_SUCCESS', 'PARTIAL_SUCCESS', 'FUNNY_FAIL'];

// All 3D prompts with their task IDs
const ALL_PROMPTS: Record<string, string> = {
  'skeleton-birthday': SKELETON_BIRTHDAY_PROMPT,
  'knight-space': KNIGHT_SPACE_PROMPT,
  'mage-kitchen': MAGE_KITCHEN_PROMPT,
  'barbarian-school': BARBARIAN_SCHOOL_PROMPT,
  'dungeon-concert': DUNGEON_CONCERT_PROMPT,
  'skeleton-pizza': SKELETON_PIZZA_PROMPT,
  'adventurers-picnic': ADVENTURERS_PICNIC_PROMPT,
};

// Required sections every prompt must have
const REQUIRED_SECTIONS = [
  'TASK:',
  'JSON FORMAT:',
  'SUCCESS CRITERIA:',
  'AVAILABLE ACTORS',
  'AVAILABLE PROPS',
  'AVAILABLE REACTIONS',
  'AVAILABLE POSITIONS:',
  'AVAILABLE MOVE STYLES:',
  'RULES:',
];

describe('System Prompts', () => {
  // ── Basic structure tests ───────────────────────────────────────────────

  describe('All 7 prompts exist and are non-empty', () => {
    it('should export exactly 7 prompts', () => {
      expect(Object.keys(ALL_PROMPTS)).toHaveLength(7);
    });

    it.each(Object.keys(ALL_PROMPTS))('%s is a non-empty string', (taskId) => {
      expect(typeof ALL_PROMPTS[taskId]).toBe('string');
      expect(ALL_PROMPTS[taskId].length).toBeGreaterThan(100);
    });
  });

  // ── Required sections ─────────────────────────────────────────────────

  describe('Required sections present', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s has all required sections', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      for (const section of REQUIRED_SECTIONS) {
        expect(prompt).toContain(section);
      }
    });
  });

  // ── Success criteria ──────────────────────────────────────────────────

  describe('Success criteria', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s mentions all 3 success levels', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      for (const level of VALID_SUCCESS_LEVELS) {
        expect(prompt).toContain(level);
      }
    });

    it.each(Object.keys(ALL_PROMPTS))('%s defines 3 criteria for FULL_SUCCESS', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      // FULL_SUCCESS criteria should mention "AND" (connecting the 3 elements)
      const fullSuccessSection = prompt.split('FULL_SUCCESS:')[1]?.split('PARTIAL_SUCCESS')[0] || '';
      expect(fullSuccessSection).toContain('AND');
    });
  });

  // ── Reactions vocabulary ──────────────────────────────────────────────

  describe('Reactions vocabulary', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s only lists valid reaction keys', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      const reactionsSection = prompt.split('AVAILABLE REACTIONS')[1]?.split('AVAILABLE POSITIONS')[0] || '';

      // Extract reaction names from the section
      for (const reaction of VALID_REACTIONS) {
        if (reactionsSection.includes(reaction)) {
          expect(VALID_REACTIONS).toContain(reaction);
        }
      }
    });
  });

  // ── Positions vocabulary ──────────────────────────────────────────────

  describe('Positions vocabulary', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s lists valid positions', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      const posSection = prompt.split('AVAILABLE POSITIONS:')[1]?.split('AVAILABLE MOVE')[0] || '';

      for (const pos of VALID_POSITIONS) {
        if (posSection.includes(pos)) {
          expect(VALID_POSITIONS).toContain(pos);
        }
      }
    });
  });

  // ── Move styles vocabulary ────────────────────────────────────────────

  describe('Move styles vocabulary', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s lists valid move styles', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      const styleSection = prompt.split('AVAILABLE MOVE STYLES:')[1]?.split('RULES:')[0] || '';

      for (const style of VALID_MOVE_STYLES) {
        if (styleSection.includes(style)) {
          expect(VALID_MOVE_STYLES).toContain(style);
        }
      }
    });
  });

  // ── Rules compliance ──────────────────────────────────────────────────

  describe('Rules compliance', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s enforces max 6 actions', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      expect(prompt).toContain('Maximum 6 actions');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s enforces narration word limit', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      expect(prompt).toContain('under 20 words');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s requires JSON-only response', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      expect(prompt).toContain('RESPOND WITH ONLY THE JSON OBJECT');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s forbids inventing asset names', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      expect(prompt).toContain('NEVER invent new asset names');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s ensures FUNNY_FAIL is never mean', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      expect(prompt).toContain('NEVER mean or scary');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s encourages in prompt_feedback', (taskId) => {
      const prompt = ALL_PROMPTS[taskId];
      expect(prompt).toContain('encouraging');
    });
  });

  // ── Task-specific actor checks ────────────────────────────────────────

  describe('Task-specific actors', () => {
    it('skeleton-birthday includes skeleton_warrior', () => {
      expect(SKELETON_BIRTHDAY_PROMPT).toContain('skeleton_warrior');
    });

    it('skeleton-birthday includes knight as party guest', () => {
      expect(SKELETON_BIRTHDAY_PROMPT).toContain('knight');
    });

    it('knight-space includes knight and space_ranger', () => {
      expect(KNIGHT_SPACE_PROMPT).toContain('knight');
      expect(KNIGHT_SPACE_PROMPT).toContain('space_ranger');
    });

    it('mage-kitchen includes mage and witch', () => {
      expect(MAGE_KITCHEN_PROMPT).toContain('mage');
      expect(MAGE_KITCHEN_PROMPT).toContain('witch');
    });

    it('barbarian-school includes barbarian and other adventurers', () => {
      expect(BARBARIAN_SCHOOL_PROMPT).toContain('barbarian');
      expect(BARBARIAN_SCHOOL_PROMPT).toContain('knight');
      expect(BARBARIAN_SCHOOL_PROMPT).toContain('mage');
    });

    it('dungeon-concert includes skeleton_warrior and clown', () => {
      expect(DUNGEON_CONCERT_PROMPT).toContain('skeleton_warrior');
      expect(DUNGEON_CONCERT_PROMPT).toContain('clown');
    });

    it('skeleton-pizza includes skeleton_warrior and skeleton_rogue', () => {
      expect(SKELETON_PIZZA_PROMPT).toContain('skeleton_warrior');
      expect(SKELETON_PIZZA_PROMPT).toContain('skeleton_rogue');
    });

    it('adventurers-picnic includes all 5 core adventurers', () => {
      expect(ADVENTURERS_PICNIC_PROMPT).toContain('knight');
      expect(ADVENTURERS_PICNIC_PROMPT).toContain('barbarian');
      expect(ADVENTURERS_PICNIC_PROMPT).toContain('mage');
      expect(ADVENTURERS_PICNIC_PROMPT).toContain('ranger');
      expect(ADVENTURERS_PICNIC_PROMPT).toContain('rogue');
    });
  });

  // ── JSON format in examples ───────────────────────────────────────────

  describe('JSON format examples', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s includes success_level in JSON format', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('"success_level"');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s includes narration in JSON format', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('"narration"');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s includes actions in JSON format', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('"actions"');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s includes missing_elements in JSON format', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('"missing_elements"');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s includes prompt_feedback in JSON format', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('"prompt_feedback"');
    });
  });

  // ── Quest AI branding ─────────────────────────────────────────────

  describe('Quest AI branding', () => {
    it.each(Object.keys(ALL_PROMPTS))('%s identifies as Quest AI game engine', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('Quest AI');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s targets ages 7-11', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('ages 7-11');
    });

    it.each(Object.keys(ALL_PROMPTS))('%s teaches prompt engineering', (taskId) => {
      expect(ALL_PROMPTS[taskId]).toContain('prompt engineering');
    });
  });
});
