import type { SceneScript } from '../types/scene-script';
import type { BlockResponse } from '../types/block-types';
import { getCachedResponse, saveToCache } from './cache';
import { evaluateInput, evaluateInputBlock, parseResponse } from './claude';
import { resolveBlocks } from './block-resolver';
import { BLOCK_LIBRARY } from '../data/block-library';
import { FALLBACK_SCRIPTS } from '../data/fallback-scripts';
import { layoutStage } from './stage-layout-engine';

export type ResponseSource = 'cache' | 'live' | 'fallback';

export interface ResolvedResponse {
  script: SceneScript;
  source: ResponseSource;
  latencyMs: number;
}

/**
 * Three-tier response resolver:
 *   Tier 1 — Cache (instant): exact or fuzzy match from pre-generated responses
 *   Tier 2 — Live API (1-8s): call Claude with 6s timeout, cache the result
 *   Tier 3 — Fallback (instant): pre-written generic response, demo never errors
 *
 * Supports both legacy SceneScript format (actions[]) and new BlockResponse format (elements[]).
 * Format is auto-detected from the response. Block responses are resolved via BlockResolver.
 */
export async function resolveResponse(
  taskId: string,
  systemPrompt: string,
  userInput: string,
  useBlockFormat = false,
): Promise<ResolvedResponse> {
  const start = performance.now();

  // ── Tier 1: Cache ──────────────────────────────────────
  // Cache stores SceneScripts — works for both formats (block responses are resolved before caching)
  const cached = getCachedResponse(taskId, userInput);
  if (cached) {
    const latencyMs = performance.now() - start;
    console.log(`[Resolver] Tier 1 — Cache hit (${latencyMs.toFixed(0)}ms)`);
    return { script: cached, source: 'cache', latencyMs };
  }

  // ── Tier 2: Live Claude API ────────────────────────────
  try {
    let script: SceneScript;

    if (useBlockFormat) {
      // Block format: get raw response, auto-detect format, resolve if needed
      const raw = await evaluateInputBlock(systemPrompt, userInput);
      const { format, parsed } = parseResponse(raw);

      if (format === 'block') {
        console.log('[Resolver] Block format detected — resolving via BlockResolver');
        script = resolveBlocks(parsed as BlockResponse, BLOCK_LIBRARY, taskId);
      } else {
        console.log('[Resolver] Legacy scene-script format detected — passing through');
        script = parsed as SceneScript;
      }
    } else {
      // Legacy path: full SceneScript from Claude
      script = await evaluateInput(systemPrompt, userInput);
    }

    // Apply stage layout for non-overlapping positions
    script = layoutStage(script, taskId);

    const latencyMs = performance.now() - start;
    console.log(`[Resolver] Tier 2 — Live API (${latencyMs.toFixed(0)}ms)`);

    // Cache the resolved SceneScript for next time
    saveToCache(taskId, userInput, script);

    return { script, source: 'live', latencyMs };
  } catch (error) {
    console.warn('[Resolver] Tier 2 failed:', error);
  }

  // ── Tier 3: Fallback ──────────────────────────────────
  const fallback = FALLBACK_SCRIPTS[taskId] ?? FALLBACK_SCRIPTS['monster-party'];
  const latencyMs = performance.now() - start;
  console.log(`[Resolver] Tier 3 — Fallback (${latencyMs.toFixed(0)}ms)`);

  return { script: fallback, source: 'fallback', latencyMs };
}
