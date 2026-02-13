/**
 * Vignette Resolver — maps tag combinations to pre-built vignettes.
 *
 * 5-priority matching:
 * 1. EXACT (all tags match)
 * 2. PAIR (2+ tags match, including wildcards)
 * 3. VIBE match (just the vibe/mood slot)
 * 4. CATEGORY match (any wildcard combos)
 * 5. DEFAULT fallback
 */

import type { Vignette, VignetteStep, VignetteAction, QuestStage } from '../types/madlibs';
import type { Action, SceneScript } from '../types/scene-script';
import { resolveAnimationVerb } from '../data/animation-verbs';

/**
 * Resolve which vignette to play based on selected tags.
 */
export function resolveVignette(
  selectedTags: Record<string, string>,
  stage: QuestStage,
): Vignette {
  const vignettes = stage.vignettes;
  const slotIds = stage.template.slots.map(s => s.id);

  // Priority 1: EXACT match (all tags)
  const exact = vignettes.find(v => {
    return slotIds.every(id => {
      const triggerVal = v.trigger[id.toLowerCase()];
      return triggerVal === selectedTags[id] || triggerVal === '*';
    });
  });
  if (exact && !isAllWildcard(exact, slotIds)) return exact;

  // Priority 2: PAIR match (2+ of N tags match)
  const pairMatches = vignettes.filter(v => {
    let matchCount = 0;
    for (const id of slotIds) {
      const triggerVal = v.trigger[id.toLowerCase()];
      if (triggerVal === selectedTags[id] || triggerVal === '*') matchCount++;
    }
    return matchCount >= 2 && matchCount < slotIds.length;
  });
  if (pairMatches.length > 0) {
    return pairMatches[Math.floor(Math.random() * pairMatches.length)];
  }

  // Priority 3: VIBE match — match the last slot (usually vibe/mood)
  const vibeSlotId = slotIds[slotIds.length - 1];
  const vibeMatch = vignettes.find(v => {
    const triggerVal = v.trigger[vibeSlotId.toLowerCase()];
    return triggerVal === selectedTags[vibeSlotId];
  });
  if (vibeMatch) return vibeMatch;

  // Priority 4: CATEGORY match — any single non-wildcard tag match
  const categoryMatch = vignettes.find(v => {
    return slotIds.some(id => {
      const triggerVal = v.trigger[id.toLowerCase()];
      return triggerVal === selectedTags[id] && triggerVal !== '*';
    });
  });
  if (categoryMatch) return categoryMatch;

  // Priority 5: DEFAULT
  return stage.defaultVignette;
}

function isAllWildcard(v: Vignette, slotIds: string[]): boolean {
  return slotIds.every(id => v.trigger[id.toLowerCase()] === '*');
}

/**
 * Convert a Vignette into a SceneScript for the playback engine.
 */
export function buildVignetteScript(
  vignette: Vignette,
  _selectedTags: Record<string, string>,
): SceneScript {
  const actions = vignetteStepsToActions(vignette.steps);

  // Map prompt score to success level
  const successMap: Record<string, 'FULL_SUCCESS' | 'PARTIAL_SUCCESS' | 'FUNNY_FAIL'> = {
    perfect: 'FULL_SUCCESS',
    chaotic: 'FUNNY_FAIL',
    partial: 'PARTIAL_SUCCESS',
    funny_fail: 'FUNNY_FAIL',
  };

  return {
    success_level: successMap[vignette.promptScore] ?? 'PARTIAL_SUCCESS',
    narration: vignette.feedback.title,
    actions,
    prompt_feedback: vignette.feedback.message,
    guide_hint: vignette.feedback.tip,
  };
}

/**
 * Flatten VignetteSteps into sequential Actions for the existing playback engine.
 * Parallel actions within a step get staggered with small delays.
 */
function vignetteStepsToActions(steps: VignetteStep[]): Action[] {
  const result: Action[] = [];
  let cumulativeDelay = 0;

  for (const step of steps) {
    // Each action in a parallel group starts at the same time
    for (let i = 0; i < step.parallel.length; i++) {
      const va = step.parallel[i];
      const action = vignetteActionToAction(va, cumulativeDelay);
      if (action) result.push(action);
    }

    // delayAfter advances the timeline
    cumulativeDelay += (step.delayAfter ?? 0.5) * 1000;
  }

  return result;
}

/**
 * Convert a VignetteAction to a scene-script Action.
 */
function vignetteActionToAction(va: VignetteAction, delayMs: number): Action | null {
  const delay_ms = Math.round(delayMs);

  switch (va.action) {
    case 'spawn':
    case 'spawn_character':
      return {
        type: 'spawn',
        target: (va.character ?? va.asset ?? 'mystery_crate') as any,
        position: (va.position ?? 'center') as any,
        delay_ms,
      };

    case 'move':
      return {
        type: 'move',
        target: (va.character ?? va.asset ?? '') as any,
        to: (va.to ?? va.position ?? 'center') as any,
        style: (va.style as any) ?? 'linear',
        delay_ms,
      };

    case 'animate':
      return {
        type: 'animate',
        target: (va.character ?? '') as any,
        anim: resolveAnimationVerb(va.anim ?? 'idle'),
        delay_ms,
        duration_ms: 800,
      };

    case 'react':
      return {
        type: 'react',
        effect: (va.effect ?? 'confetti-burst') as any,
        position: (va.position ?? 'center') as any,
        delay_ms,
      };

    case 'emote':
      return {
        type: 'emote',
        target: (va.character ?? '') as any,
        emoji: va.emoji ?? va.text,
        text: va.text,
        delay_ms,
      };

    case 'sfx':
      return {
        type: 'sfx',
        sound: va.sound ?? 'react',
        delay_ms,
      };

    case 'camera_shake':
      return {
        type: 'camera_shake' as any,
        intensity: (typeof va.intensity === 'number' ? va.intensity : 0.5),
        duration: va.duration ?? 0.5,
        delay_ms,
      };

    case 'camera_zoom':
      return {
        type: 'camera_zoom' as any,
        target: va.target ?? 'center',
        speed: va.speed ?? 'medium',
        delay_ms,
      };

    case 'text_popup':
      return {
        type: 'text_popup' as any,
        text: va.text ?? '',
        position: (va.position ?? 'center') as 'top' | 'center' | 'bottom',
        size: va.size ?? 'large',
        delay_ms,
        duration_ms: 2000,
      };

    case 'screen_flash':
      return {
        type: 'screen_flash' as any,
        color: va.color ?? 'white',
        duration: va.duration ?? 0.2,
        delay_ms,
      };

    case 'crowd_react':
      return {
        type: 'crowd_react' as any,
        characters: va.characters ?? 'all',
        anim: resolveAnimationVerb(va.anim ?? 'celebrate'),
        delay_ms,
      };

    case 'spawn_rain':
      return {
        type: 'spawn_rain' as any,
        asset: va.asset ?? 'mystery_crate',
        count: va.quantity ?? 8,
        area: (va.position ?? 'wide') as any,
        delay_ms,
      };

    case 'delay':
      return {
        type: 'wait',
        duration_ms: (va.duration ?? 1) * 1000,
        delay_ms,
      };

    default:
      return null;
  }
}
