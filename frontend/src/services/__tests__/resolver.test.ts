import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SceneScript } from '../../types/scene-script';
import type { QuestStage, Vignette } from '../../types/madlibs';

// ── Mocks ────────────────────────────────────────────────
vi.mock('../../services/claude', () => ({
  callClaude: vi.fn(),
  parseSceneScript: vi.fn(),
}));

vi.mock('../../data/worlds', () => ({
  getWorldPrompt: vi.fn(() => 'mock system prompt'),
}));

vi.mock('../../services/stage-layout-engine', () => ({
  layoutStage: vi.fn((script: SceneScript) => script),
}));

vi.mock('../../data/fallback-scripts', () => ({
  FALLBACK_SCRIPTS: {
    'skeleton-birthday': {
      success_level: 'PARTIAL_SUCCESS',
      narration: 'Fallback skeleton birthday narration',
      actions: [
        { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      ],
      prompt_feedback: 'Fallback feedback for skeleton birthday',
    } as SceneScript,
    'knight-space': {
      success_level: 'PARTIAL_SUCCESS',
      narration: 'Fallback knight space narration',
      actions: [
        { type: 'spawn', target: 'robot', position: 'left' },
      ],
      prompt_feedback: 'Fallback feedback for knight space',
    } as SceneScript,
  } as Record<string, SceneScript>,
}));

vi.mock('../../services/vignette-resolver', () => ({
  resolveVignette: vi.fn(),
  buildVignetteScript: vi.fn(),
}));

// Import after mocks are set up
import { resolveResponse, resolveCombo } from '../resolver';
import { callClaude, parseSceneScript } from '../../services/claude';
import { resolveVignette, buildVignetteScript } from '../../services/vignette-resolver';

// ── Fixtures ─────────────────────────────────────────────
const LIVE_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'Balloons fill the party room!',
  actions: [
    { type: 'spawn', target: 'skeleton_warrior', position: 'left' },
    { type: 'react', effect: 'confetti-burst', position: 'center' },
  ],
  prompt_feedback: 'You described the decorations perfectly!',
};

// ── Tests ────────────────────────────────────────────────
describe('resolveResponse (two-tier resolver)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Tier 1: Live API ───────────────────────────────────
  describe('Tier 1 — Live API', () => {
    it('calls callClaude and returns source "live" on success', async () => {
      vi.mocked(callClaude).mockResolvedValue('raw json');
      vi.mocked(parseSceneScript).mockReturnValue(LIVE_SCRIPT);

      const result = await resolveResponse('skeleton-birthday', 'make a giant cake');

      expect(result.script).toEqual(LIVE_SCRIPT);
      expect(result.source).toBe('live');
      expect(callClaude).toHaveBeenCalledOnce();
    });

    it('includes latencyMs as a number >= 0', async () => {
      vi.mocked(callClaude).mockResolvedValue('raw json');
      vi.mocked(parseSceneScript).mockReturnValue(LIVE_SCRIPT);

      const result = await resolveResponse('skeleton-birthday', 'test');

      expect(typeof result.latencyMs).toBe('number');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Tier 2: Fallback ──────────────────────────────────
  describe('Tier 2 — Fallback', () => {
    it('returns fallback when API throws', async () => {
      vi.mocked(callClaude).mockRejectedValue(new Error('API timeout'));

      const result = await resolveResponse('skeleton-birthday', 'do something cool');

      expect(result.source).toBe('fallback');
      expect(result.script.success_level).toBe('PARTIAL_SUCCESS');
      expect(result.script.narration).toBe('Fallback skeleton birthday narration');
    });

    it('returns the correct fallback for the given taskId', async () => {
      vi.mocked(callClaude).mockRejectedValue(new Error('Network error'));

      const result = await resolveResponse('knight-space', 'fix the station');

      expect(result.source).toBe('fallback');
      expect(result.script.narration).toBe('Fallback knight space narration');
    });

    it('falls back to skeleton-birthday when taskId is unknown', async () => {
      vi.mocked(callClaude).mockRejectedValue(new Error('API error'));

      const result = await resolveResponse('unknown-task-id', 'do something');

      expect(result.source).toBe('fallback');
      expect(result.script.narration).toBe('Fallback skeleton birthday narration');
    });

    it('includes latencyMs as a number >= 0', async () => {
      vi.mocked(callClaude).mockRejectedValue(new Error('API timeout'));

      const result = await resolveResponse('skeleton-birthday', 'anything');

      expect(typeof result.latencyMs).toBe('number');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('resolveCombo (vignette resolver)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves a vignette and builds a SceneScript', () => {
    const mockVignette: Vignette = {
      id: 'test-vignette',
      trigger: { food: 'cake', entertainment: 'magic_show', vibe: 'spooky' },
      steps: [],
      feedback: { title: 'Spooky cake party!', message: 'Great combo!' },
      promptScore: 'perfect',
    };
    const mockScript: SceneScript = {
      success_level: 'FULL_SUCCESS',
      narration: 'Spooky cake party!',
      actions: [],
      prompt_feedback: 'Great combo!',
    };

    vi.mocked(resolveVignette).mockReturnValue(mockVignette);
    vi.mocked(buildVignetteScript).mockReturnValue(mockScript);

    const mockStage = {
      id: 'test-stage',
      questId: 'skeleton-birthday',
      stageNumber: 1,
      title: 'Test',
      intro: 'Test intro',
      template: { sentence: '{FOOD} and {ENTERTAINMENT} for {VIBE}', slots: [] },
      vignettes: [mockVignette],
      defaultVignette: mockVignette,
      successTags: [],
    } as QuestStage;

    const result = resolveCombo(
      { FOOD: 'cake', ENTERTAINMENT: 'magic_show', VIBE: 'spooky' },
      mockStage,
    );

    expect(result.source).toBe('vignette');
    expect(result.script).toEqual(mockScript);
    expect(result.vignette).toEqual(mockVignette);
    expect(typeof result.latencyMs).toBe('number');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
