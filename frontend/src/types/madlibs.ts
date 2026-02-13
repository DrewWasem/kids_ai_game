/**
 * Mad Libs Pivot — Type Definitions
 *
 * Structured prompt system: kids fill in blanks from dropdown options.
 * Each combination triggers a pre-built vignette. Claude generates
 * the dropdown options (not the vignettes).
 */

// ─── SLOT & OPTIONS ──────────────────────────────────────────────────────────

export interface SlotOption {
  label: string;   // What the kid sees: "YEET", "gently toss"
  tag: string;     // What the engine uses: "throw" (from allowedTags)
  icon: string;    // Emoji icon: "🤾"
}

export interface TemplateSlot {
  id: string;              // "FOOD", "ENTERTAINMENT", "VIBE"
  label: string;           // Display label
  icon: string;            // Slot emoji
  allowedTags: string[];   // Valid tags for this slot
  defaultOptions: SlotOption[];  // Static fallback if Claude is slow
}

export interface GeneratedOptions {
  slots: Array<{
    slotId: string;
    options: SlotOption[];
  }>;
}

// ─── QUEST STAGES ────────────────────────────────────────────────────────────

export interface QuestStage {
  id: string;
  questId: string;       // Zone ID: "skeleton-birthday"
  stageNumber: number;
  title: string;
  intro: string;         // "Help plan the skeleton's birthday party!"

  template: {
    sentence: string;    // "Plan a party with {FOOD} and {ENTERTAINMENT} for a {VIBE} birthday"
    slots: TemplateSlot[];
  };

  vignettes: Vignette[];
  defaultVignette: Vignette;

  // Which tag combos count as "success" to advance
  successTags?: string[][];  // e.g. [["cake", "magic_show", "spooky"]]
}

// ─── VIGNETTES ───────────────────────────────────────────────────────────────

export type PromptScore = 'perfect' | 'funny_fail' | 'chaotic' | 'partial';
export type ReactionTier = 'subtle' | 'moderate' | 'spectacular' | 'absolute_chaos';

export interface ComboTrigger {
  [slotId: string]: string;  // e.g. { food: 'cake', entertainment: 'magic_show', vibe: 'spooky' }
  // Use '*' for wildcard, 'default' for unselected
}

export interface VignetteStep {
  parallel: VignetteAction[];
  delayAfter?: number;  // Seconds before next step
}

/** Actions within a vignette step — superset of scene-script Action with vignette-specific fields */
export interface VignetteAction {
  action: string;  // 'spawn', 'spawn_character', 'move', 'animate', 'react', 'emote', 'sfx',
                   // 'camera_shake', 'camera_zoom', 'text_popup', 'screen_flash', 'crowd_react',
                   // 'spawn_rain', 'grow', 'delay'

  // Common fields
  character?: string;
  characters?: string[] | 'all' | 'all_background' | 'all_others';
  asset?: string;
  position?: string;
  anim?: string;

  // Spawn fields
  attachTo?: string;
  scale?: number;
  quantity?: number;
  spawnStyle?: 'place' | 'drop' | 'rain' | 'explode_outward' | 'stack' | 'circle' | 'float_up';
  rotation?: string;

  // Move fields
  to?: string;
  style?: string;
  moveTo?: string;

  // Effect fields
  effect?: string;
  intensity?: number | string;
  duration?: number;
  color?: string;

  // Text fields
  text?: string;
  emoji?: string;
  size?: 'small' | 'large' | 'huge';

  // Camera fields
  target?: string;
  speed?: 'fast' | 'slow' | 'medium';

  // Sound fields
  sound?: string;
  volume?: number;
}

export interface VignetteFeedback {
  title: string;       // "🌟 PERFECT PARTY!"
  message: string;     // Why this combo worked or didn't
  skillTaught: string; // "Specificity", "Sequencing", etc.
  tip: string;         // "Great prompts answer WHO, WHAT, WHERE, and HOW"
}

export interface Vignette {
  id: string;
  trigger: ComboTrigger;
  tier: ReactionTier;
  promptScore: PromptScore;
  steps: VignetteStep[];
  feedback: VignetteFeedback;
}

// ─── COMEDY COMBOS ───────────────────────────────────────────────────────────

/** Template variables in comedy combos use {VARIABLE_NAME} syntax */
export type ComboTemplate = VignetteAction[];

export interface ComboVariables {
  [key: string]: string | number;
}

// ─── ASSET SUBSTITUTION ──────────────────────────────────────────────────────

export interface AssetEntry {
  path: string;
  fallback?: string;
}

export interface AssetSub {
  primaryAsset: string;
  fallbackAsset?: string;
  scale?: number;
  quantity?: number;
  spawnStyle?: 'place' | 'drop' | 'rain' | 'explode_outward' | 'stack' | 'circle';
  particleOnSpawn?: string;
}

// ─── REACTION TIER SPECS ─────────────────────────────────────────────────────

export const TIER_SPECS: Record<ReactionTier, {
  actorCount: [number, number];
  propCount: [number, number];
  particleBursts: [number, number];
  cameraShakes: number | [number, number];
  duration: [number, number];
  chainReactions: number | [number, number];
}> = {
  subtle: {
    actorCount: [2, 4],
    propCount: [3, 6],
    particleBursts: [1, 2],
    cameraShakes: 0,
    duration: [4, 6],
    chainReactions: 0,
  },
  moderate: {
    actorCount: [3, 6],
    propCount: [6, 12],
    particleBursts: [2, 4],
    cameraShakes: [0, 1],
    duration: [6, 9],
    chainReactions: [1, 2],
  },
  spectacular: {
    actorCount: [5, 8],
    propCount: [10, 20],
    particleBursts: [4, 8],
    cameraShakes: [1, 3],
    duration: [8, 12],
    chainReactions: [2, 4],
  },
  absolute_chaos: {
    actorCount: [6, 12],
    propCount: [15, 30],
    particleBursts: [6, 12],
    cameraShakes: [3, 6],
    duration: [10, 15],
    chainReactions: [4, 8],
  },
};

// ─── PLAYER HISTORY ──────────────────────────────────────────────────────────

export interface PlayerHistory {
  totalPlays: number;
  favoriteTagCategories: string[];
  discoveredCombos: number;
}
