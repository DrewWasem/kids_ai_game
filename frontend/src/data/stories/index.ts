/**
 * Story Curriculum — barrel export.
 *
 * Re-exports every story config and provides ordered collections
 * for iteration (progression UI, stage selection, etc.).
 */

export type { Story, StoryStage, StoryResponse, StoryElement, Skill, SkillId } from './types';

import type { Story } from './types';

import { SKELETON_BIRTHDAY } from './skeleton-birthday';
import { SKELETON_PIZZA } from './skeleton-pizza';
import { MAGE_KITCHEN } from './mage-kitchen';
import { BARBARIAN_SCHOOL } from './barbarian-school';
import { KNIGHT_SPACE } from './knight-space';
import { DUNGEON_CONCERT } from './dungeon-concert';
import { ADVENTURERS_PICNIC } from './adventurers-picnic';

// Re-export individual stories
export {
  SKELETON_BIRTHDAY,
  SKELETON_PIZZA,
  MAGE_KITCHEN,
  BARBARIAN_SCHOOL,
  KNIGHT_SPACE,
  DUNGEON_CONCERT,
  ADVENTURERS_PICNIC,
};

/** All stories in curriculum progression order (1-7). */
export const STORY_ORDER: Story[] = [
  SKELETON_BIRTHDAY,   // 1 — Specificity
  SKELETON_PIZZA,      // 2 — Completeness
  MAGE_KITCHEN,        // 3 — Context
  BARBARIAN_SCHOOL,    // 4 — Step-by-Step
  KNIGHT_SPACE,        // 5 — Perspective
  DUNGEON_CONCERT,     // 6 — Creative Constraints
  ADVENTURERS_PICNIC,  // 7 — Integration (capstone)
];

/** Lookup a story by its zone id. */
export function getStoryById(id: string): Story | undefined {
  return STORY_ORDER.find((s) => s.id === id);
}
