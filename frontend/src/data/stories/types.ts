/**
 * Story Curriculum Types — typed data for the multi-stage guided experience.
 *
 * Each Story has 3-4 Stages. Each Stage has 10 pre-rendered Responses
 * (4 FULL_SUCCESS, 3 PARTIAL_SUCCESS, 3 FUNNY_FAIL) plus 3 guidance hints.
 *
 * StoryElement extends BlockElement with an optional animation override
 * so pre-rendered scenes can specify exact character animations.
 */

import type { SuccessLevel } from '../../types/scene-script';

// ─── SKILL FRAMEWORK ────────────────────────────────────────────────────────

export type SkillId =
  | 'specificity'
  | 'completeness'
  | 'context'
  | 'step-by-step'
  | 'perspective'
  | 'creative-constraints'
  | 'integration';

export interface Skill {
  id: SkillId;
  level: number;                // 1-7
  name: string;                 // e.g. "Specificity"
  kidFriendlyName: string;      // e.g. "Paint the Picture"
  description: string;          // one-line explanation
}

// ─── SCENE ELEMENTS ─────────────────────────────────────────────────────────

export interface StoryElement {
  block: string;                // block-library keyword: 'skeleton_warrior', 'cake_birthday'
  count?: number;               // default 1
  action: string;               // choreography: 'appear-center', 'enter-left', 'drop-center'
  anim?: string;                // animation override: 'Cheering', 'Walking_A', 'Skeletons_Taunt'
}

// ─── RESPONSES ──────────────────────────────────────────────────────────────

export interface StoryResponse {
  sampleInput: string;          // example child input that maps to this response
  successLevel: SuccessLevel;
  elements: StoryElement[];
  reactions: string[];          // e.g. ['confetti-burst', 'sparkle-magic']
  feedback: string;             // encouraging feedback + one concrete tip
}

// ─── STAGES ─────────────────────────────────────────────────────────────────

export interface StoryStage {
  title: string;                // e.g. "Who's Invited?"
  narration: string;            // narrator text shown before the prompt
  question: string;             // what the child is asked to do
  responses: StoryResponse[];   // 10 pre-rendered responses
  hints: [string, string, string]; // 3 progressive guidance hints (general → specific)
}

// ─── STORY ──────────────────────────────────────────────────────────────────

export interface Story {
  id: string;                   // zone id: 'skeleton-birthday'
  title: string;                // "Skeleton's Surprise Birthday Party"
  order: number;                // 1-7 (progression order)
  skill: SkillId;
  teachingGoal: string;
  characters: string[];         // block-library character ids used
  props: string[];              // block-library prop ids used
  stages: StoryStage[];
}
