/**
 * Badge System — detects prompt engineering skills and awards badges.
 *
 * 8 badges track different prompting skills. Unlocked badges persist
 * in localStorage so they survive page refreshes.
 */

import type { PromptAnalysis } from '../types/scene-script';

export interface BadgeDefinition {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const BADGES: BadgeDefinition[] = [
  { id: 'commander', label: 'Commander', emoji: '\u{1F3AF}', description: 'Named a specific character' },
  { id: 'director', label: 'Director', emoji: '\u{1F3AC}', description: 'Described a specific action' },
  { id: 'storyteller', label: 'Storyteller', emoji: '\u{1F4D6}', description: 'Put events in sequence' },
  { id: 'detail-master', label: 'Detail Master', emoji: '\u{1F50D}', description: 'Added vivid details' },
  { id: 'world-builder', label: 'World Builder', emoji: '\u{1F30D}', description: 'Referenced the environment' },
  { id: 'combo-king', label: 'Combo King', emoji: '\u{1F451}', description: 'Had multiple characters interact' },
  { id: 'iterator', label: 'Iterator', emoji: '\u{1F504}', description: 'Improved a prompt on retry' },
  { id: 'prompt-master', label: 'Prompt Master', emoji: '\u{2B50}', description: 'Used 4+ skills in one prompt' },
];

const STORAGE_KEY = 'quest-ai-badges';

export function loadBadges(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // localStorage unavailable or corrupt
  }
  return {};
}

export function saveBadges(badges: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
  } catch {
    // localStorage unavailable
  }
}

/**
 * Check which badges should be newly unlocked given a prompt analysis.
 * Returns array of badge IDs that are newly earned (not already in currentBadges).
 */
export function checkBadges(
  analysis: PromptAnalysis | undefined,
  currentBadges: Record<string, boolean>,
  isRetryImproved?: boolean,
): string[] {
  if (!analysis) return [];

  const newBadges: string[] = [];

  if (analysis.has_character && !currentBadges['commander']) {
    newBadges.push('commander');
  }
  if (analysis.has_action && !currentBadges['director']) {
    newBadges.push('director');
  }
  if (analysis.has_sequence && !currentBadges['storyteller']) {
    newBadges.push('storyteller');
  }
  if (analysis.has_detail && !currentBadges['detail-master']) {
    newBadges.push('detail-master');
  }
  if (analysis.has_environment && !currentBadges['world-builder']) {
    newBadges.push('world-builder');
  }
  if (analysis.has_multi_char && !currentBadges['combo-king']) {
    newBadges.push('combo-king');
  }
  if (isRetryImproved && !currentBadges['iterator']) {
    newBadges.push('iterator');
  }

  // Prompt Master: 4+ skills in one prompt
  const skillCount = [
    analysis.has_character,
    analysis.has_action,
    analysis.has_sequence,
    analysis.has_detail,
    analysis.has_multi_char,
    analysis.has_environment,
  ].filter(Boolean).length;

  if (skillCount >= 4 && !currentBadges['prompt-master']) {
    newBadges.push('prompt-master');
  }

  return newBadges;
}

/** Count skills present in a prompt analysis */
export function countSkills(analysis: PromptAnalysis | undefined): number {
  if (!analysis) return 0;
  return [
    analysis.has_character,
    analysis.has_action,
    analysis.has_sequence,
    analysis.has_detail,
    analysis.has_multi_char,
    analysis.has_environment,
  ].filter(Boolean).length;
}
