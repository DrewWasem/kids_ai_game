/**
 * Story Resolver — converts a StoryResponse into a playable SceneScript.
 *
 * Uses the existing block-resolver pipeline, then injects
 * animation overrides from StoryElement.anim fields.
 */

import type { StoryResponse } from '../data/stories/types';
import type { BlockResponse } from '../types/block-types';
import type { SceneScript, Action, ActorKey } from '../types/scene-script';
import { resolveBlocks } from './block-resolver';
import { BLOCK_LIBRARY } from '../data/block-library';
import { layoutStage } from './stage-layout-engine';

/**
 * Convert a StoryResponse into a playable SceneScript.
 *
 * Uses the existing block-resolver pipeline, then injects
 * animation overrides from StoryElement.anim fields.
 */
export function resolveStoryResponse(response: StoryResponse, taskId?: string): SceneScript {
  // 1. Convert StoryResponse → BlockResponse shape
  const blockResponse: BlockResponse = {
    success_level: response.successLevel,
    narration: response.feedback, // Use feedback as narration (short, kid-friendly)
    elements: response.elements.map(el => ({
      block: el.block,
      count: el.count,
      action: el.action,
    })),
    reactions: response.reactions,
    prompt_feedback: response.feedback,
    missing_elements: [],
  };

  // 2. Resolve through existing pipeline
  const script = resolveBlocks(blockResponse, BLOCK_LIBRARY);

  // 3. Inject animation overrides from StoryElement.anim
  // For each element that has an anim field, find the corresponding
  // spawn action and add an animate action right after it
  const animOverrides: Action[] = [];
  for (const el of response.elements) {
    if (el.anim) {
      // The spawn target is either characterId or the block id
      const block = BLOCK_LIBRARY.get(el.block.toLowerCase());
      const targetId = block?.characterId || block?.propId || el.block;
      animOverrides.push({
        type: 'animate',
        target: targetId as ActorKey,
        anim: el.anim,
      });
    }
  }

  // Insert anim overrides after their corresponding spawn actions
  if (animOverrides.length > 0) {
    const finalActions: Action[] = [];
    for (const action of script.actions) {
      finalActions.push(action);
      // After a spawn, check if we have an anim override for this target
      if (action.type === 'spawn') {
        const override = animOverrides.find(a =>
          a.type === 'animate' && a.target === action.target
        );
        if (override) {
          finalActions.push(override);
          // Remove from list so it's not added again
          const idx = animOverrides.indexOf(override);
          animOverrides.splice(idx, 1);
        }
      }
    }
    // Append any remaining overrides (for spawn_group targets etc)
    finalActions.push(...animOverrides);
    script.actions = finalActions;
  }

  // Apply stage layout for non-overlapping positions and walk-in conversion
  if (taskId) {
    return layoutStage(script, taskId);
  }
  return script;
}
