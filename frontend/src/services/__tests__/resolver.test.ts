import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SceneScript } from '../../types/scene-script';

// ── Mocks ────────────────────────────────────────────────
vi.mock('../../services/cache', () => ({
  getCachedResponse: vi.fn(),
  saveToCache: vi.fn(),
}));

vi.mock('../../services/claude', () => ({
  evaluateInput: vi.fn(),
}));

vi.mock('../../data/fallback-scripts', () => ({
  FALLBACK_SCRIPTS: {
    'monster-party': {
      success_level: 'PARTIAL_SUCCESS',
      narration: 'Fallback monster party narration',
      actions: [
        { type: 'spawn', target: 'monster', position: 'center' },
      ],
      prompt_feedback: 'Fallback feedback for monster party',
    } as SceneScript,
    'robot-pizza': {
      success_level: 'PARTIAL_SUCCESS',
      narration: 'Fallback robot pizza narration',
      actions: [
        { type: 'spawn', target: 'robot', position: 'left' },
      ],
      prompt_feedback: 'Fallback feedback for robot pizza',
    } as SceneScript,
  } as Record<string, SceneScript>,
}));

// Import after mocks are set up
import { resolveResponse } from '../resolver';
import { getCachedResponse, saveToCache } from '../../services/cache';
import { evaluateInput } from '../../services/claude';

// ── Fixtures ─────────────────────────────────────────────
const CACHED_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'The monster loves the giant cake!',
  actions: [
    { type: 'spawn', target: 'cake-giant', position: 'center' },
    { type: 'animate', target: 'monster', anim: 'eat', duration_ms: 500 },
    { type: 'react', effect: 'confetti-burst', position: 'center' },
  ],
  prompt_feedback: 'Great job describing the cake!',
};

const LIVE_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'Balloons fill the party room!',
  actions: [
    { type: 'spawn', target: 'balloon', position: 'left' },
    { type: 'move', target: 'balloon', to: 'top', style: 'float' },
    { type: 'react', effect: 'confetti-burst', position: 'center' },
  ],
  prompt_feedback: 'You described the decorations perfectly!',
};

// ── Tests ────────────────────────────────────────────────
describe('resolveResponse (three-tier resolver)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Tier 1: Cache ──────────────────────────────────────
  describe('Tier 1 — Cache hit', () => {
    it('returns the cached script with source "cache" without calling evaluateInput', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(CACHED_SCRIPT);

      const result = await resolveResponse(
        'monster-party',
        'system prompt',
        'make a giant cake',
      );

      expect(result.script).toBe(CACHED_SCRIPT);
      expect(result.source).toBe('cache');
      expect(evaluateInput).not.toHaveBeenCalled();
      expect(saveToCache).not.toHaveBeenCalled();
    });

    it('includes latencyMs as a number >= 0', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(CACHED_SCRIPT);

      const result = await resolveResponse(
        'monster-party',
        'system prompt',
        'make a giant cake',
      );

      expect(typeof result.latencyMs).toBe('number');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Tier 2: Live API ───────────────────────────────────
  describe('Tier 2 — Live API', () => {
    it('calls evaluateInput when cache misses and returns source "live"', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockResolvedValue(LIVE_SCRIPT);

      const result = await resolveResponse(
        'monster-party',
        'system prompt',
        'fill the room with balloons',
      );

      expect(result.script).toBe(LIVE_SCRIPT);
      expect(result.source).toBe('live');
      expect(evaluateInput).toHaveBeenCalledOnce();
      expect(evaluateInput).toHaveBeenCalledWith('system prompt', 'fill the room with balloons');
    });

    it('saves the live response to cache', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockResolvedValue(LIVE_SCRIPT);

      await resolveResponse(
        'monster-party',
        'system prompt',
        'fill the room with balloons',
      );

      expect(saveToCache).toHaveBeenCalledOnce();
      expect(saveToCache).toHaveBeenCalledWith(
        'monster-party',
        'fill the room with balloons',
        LIVE_SCRIPT,
      );
    });

    it('includes latencyMs as a number >= 0', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockResolvedValue(LIVE_SCRIPT);

      const result = await resolveResponse(
        'monster-party',
        'system prompt',
        'fill the room with balloons',
      );

      expect(typeof result.latencyMs).toBe('number');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Tier 3: Fallback ──────────────────────────────────
  describe('Tier 3 — Fallback', () => {
    it('returns fallback script with source "fallback" when cache misses and API throws', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockRejectedValue(new Error('API timeout'));

      const result = await resolveResponse(
        'monster-party',
        'system prompt',
        'do something cool',
      );

      expect(result.source).toBe('fallback');
      expect(result.script.success_level).toBe('PARTIAL_SUCCESS');
      expect(result.script.narration).toBe('Fallback monster party narration');
    });

    it('returns the correct fallback for the given taskId', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockRejectedValue(new Error('Network error'));

      const result = await resolveResponse(
        'robot-pizza',
        'system prompt',
        'deliver the pizza',
      );

      expect(result.source).toBe('fallback');
      expect(result.script.narration).toBe('Fallback robot pizza narration');
    });

    it('falls back to "monster-party" fallback when taskId is not found in FALLBACK_SCRIPTS', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockRejectedValue(new Error('API error'));

      const result = await resolveResponse(
        'unknown-task-id',
        'system prompt',
        'do something',
      );

      expect(result.source).toBe('fallback');
      expect(result.script.narration).toBe('Fallback monster party narration');
      expect(result.script.prompt_feedback).toBe('Fallback feedback for monster party');
    });

    it('includes latencyMs as a number >= 0', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockRejectedValue(new Error('API timeout'));

      const result = await resolveResponse(
        'monster-party',
        'system prompt',
        'do something cool',
      );

      expect(typeof result.latencyMs).toBe('number');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('does not save fallback to cache', async () => {
      vi.mocked(getCachedResponse).mockReturnValue(null);
      vi.mocked(evaluateInput).mockRejectedValue(new Error('API timeout'));

      await resolveResponse(
        'monster-party',
        'system prompt',
        'do something cool',
      );

      expect(saveToCache).not.toHaveBeenCalled();
    });
  });
});
