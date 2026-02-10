import type { SceneScript } from '../types/scene-script';
import { getCachedResponse, saveToCache } from './cache';
import { evaluateInput } from './claude';
import { FALLBACK_SCRIPTS } from '../data/fallback-scripts';

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
 */
export async function resolveResponse(
  taskId: string,
  systemPrompt: string,
  userInput: string,
): Promise<ResolvedResponse> {
  const start = performance.now();

  // ── Tier 1: Cache ──────────────────────────────────────
  const cached = getCachedResponse(taskId, userInput);
  if (cached) {
    const latencyMs = performance.now() - start;
    console.log(`[Resolver] Tier 1 — Cache hit (${latencyMs.toFixed(0)}ms)`);
    return { script: cached, source: 'cache', latencyMs };
  }

  // ── Tier 2: Live Claude API ────────────────────────────
  try {
    const script = await evaluateInput(systemPrompt, userInput);
    const latencyMs = performance.now() - start;
    console.log(`[Resolver] Tier 2 — Live API (${latencyMs.toFixed(0)}ms)`);

    // Cache this response for next time
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
