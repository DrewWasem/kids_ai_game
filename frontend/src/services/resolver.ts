import type { SceneScript } from '../types/scene-script';
import type { QuestStage, Vignette } from '../types/madlibs';
import { callClaude, parseSceneScript } from './claude';
import { getWorldPrompt } from '../data/worlds';
import { FALLBACK_SCRIPTS } from '../data/fallback-scripts';
import { layoutStage } from './stage-layout-engine';
import { resolveVignette, buildVignetteScript } from './vignette-resolver';

export type ResponseSource = 'live' | 'fallback' | 'vignette';

export interface ResolvedResponse {
  script: SceneScript;
  source: ResponseSource;
  latencyMs: number;
}

/**
 * Two-tier response resolver (sandbox mode):
 *   Tier 1 — Live Claude API: call with sandbox world prompt
 *   Tier 2 — Fallback: pre-written generic response, demo never errors
 */
export async function resolveResponse(
  taskId: string,
  userInput: string,
): Promise<ResolvedResponse> {
  const start = performance.now();

  // ── Tier 1: Live Claude API ────────────────────────────
  try {
    const systemPrompt = getWorldPrompt(taskId);
    const raw = await callClaude(systemPrompt, userInput);
    let script = parseSceneScript(raw);

    // Apply stage layout for non-overlapping positions
    script = layoutStage(script, taskId);

    const latencyMs = performance.now() - start;
    console.log(`[Resolver] Tier 1 — Live API (${latencyMs.toFixed(0)}ms)`);

    return { script, source: 'live', latencyMs };
  } catch (error) {
    console.warn('[Resolver] Tier 1 failed:', error);
  }

  // ── Tier 2: Fallback ──────────────────────────────────
  const fallback = FALLBACK_SCRIPTS[taskId] ?? FALLBACK_SCRIPTS['skeleton-birthday'];
  const latencyMs = performance.now() - start;
  console.log(`[Resolver] Tier 2 — Fallback (${latencyMs.toFixed(0)}ms)`);

  return { script: fallback, source: 'fallback', latencyMs };
}

/**
 * Resolve a Mad Libs combo → pre-built vignette → SceneScript.
 * Instant (no API call needed).
 */
export function resolveCombo(
  selectedTags: Record<string, string>,
  stage: QuestStage,
): { script: SceneScript; vignette: Vignette; source: 'vignette'; latencyMs: number } {
  const start = performance.now();

  const vignette = resolveVignette(selectedTags, stage);
  const script = buildVignetteScript(vignette, selectedTags);
  const latencyMs = performance.now() - start;

  console.log(`[Resolver] Vignette resolved: "${vignette.id}" (${latencyMs.toFixed(1)}ms)`);

  return { script, vignette, source: 'vignette', latencyMs };
}
