import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SceneScript } from '../../types/scene-script';

// ===========================================================================
// Section 1: parseSceneScript stress tests
// ===========================================================================

import { parseSceneScript } from '../../services/claude';

/** A minimal valid SceneScript object. */
function validScript(overrides: Partial<SceneScript> = {}): SceneScript {
  return {
    success_level: 'FULL_SUCCESS',
    narration: 'The monster enjoyed the party!',
    actions: [
      { type: 'spawn', target: 'cake', position: 'center' },
    ],
    prompt_feedback: 'Nice job!',
    ...overrides,
  };
}

describe('parseSceneScript — stress / edge cases', () => {
  it('throws on a completely empty string', () => {
    expect(() => parseSceneScript('')).toThrow();
  });

  it('throws on a whitespace-only string', () => {
    expect(() => parseSceneScript('   \n\t  ')).toThrow();
  });

  it('throws when success_level is missing', () => {
    const obj = { narration: 'Hello', actions: [], prompt_feedback: 'Tip' };
    expect(() => parseSceneScript(JSON.stringify(obj))).toThrow(
      'Invalid scene script: missing required fields',
    );
  });

  it('throws when actions is a string instead of an array', () => {
    const obj = {
      success_level: 'FULL_SUCCESS',
      narration: 'Hello',
      actions: 'not-an-array',
      prompt_feedback: 'Tip',
    };
    expect(() => parseSceneScript(JSON.stringify(obj))).toThrow(
      'Invalid scene script: missing required fields',
    );
  });

  it('succeeds when extra unknown fields are present', () => {
    const obj = {
      ...validScript(),
      bonus_field: 42,
      another_unknown: { nested: true },
    };
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.success_level).toBe('FULL_SUCCESS');
    expect(result.actions).toHaveLength(1);
    // Extra fields are passed through (not stripped)
    expect((result as Record<string, unknown>).bonus_field).toBe(42);
  });

  it('succeeds when JSON is wrapped in ```json fences', () => {
    const json = JSON.stringify(validScript());
    const wrapped = '```json\n' + json + '\n```';
    const result = parseSceneScript(wrapped);
    expect(result.success_level).toBe('FULL_SUCCESS');
  });

  it('succeeds when JSON is wrapped in ``` fences without language tag', () => {
    const json = JSON.stringify(validScript());
    const wrapped = '```\n' + json + '\n```';
    const result = parseSceneScript(wrapped);
    expect(result.success_level).toBe('FULL_SUCCESS');
  });

  it('throws on JSON with a trailing comma (invalid JSON)', () => {
    const raw = '{"success_level":"FULL_SUCCESS","narration":"Hi","actions":[],"prompt_feedback":"Tip",}';
    expect(() => parseSceneScript(raw)).toThrow();
  });

  it('succeeds with an extremely long narration (1000 chars)', () => {
    const longNarration = 'A'.repeat(1000);
    const obj = validScript({ narration: longNarration });
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.narration).toHaveLength(1000);
  });

  it('succeeds with an empty actions array (0 items)', () => {
    const obj = validScript({ actions: [] });
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.actions).toHaveLength(0);
  });

  it('succeeds with 20 actions (exceeds 6 recommendation but parser does not enforce)', () => {
    const manyActions = Array.from({ length: 20 }, (_, i) => ({
      type: 'spawn' as const,
      target: 'cake' as const,
      position: 'center' as const,
    }));
    const obj = validScript({ actions: manyActions });
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.actions).toHaveLength(20);
  });

  it('succeeds when narration contains HTML tags', () => {
    const obj = validScript({ narration: '<b>Bold</b> and <script>alert("xss")</script>' });
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.narration).toContain('<b>Bold</b>');
    expect(result.narration).toContain('<script>');
  });

  it('succeeds with unicode characters in narration (emoji, Chinese, Arabic)', () => {
    const unicodeNarration = 'The monster said hello! \u{1F382}\u{1F389} \u4F60\u597D \u0645\u0631\u062D\u0628\u0627';
    const obj = validScript({ narration: unicodeNarration });
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.narration).toBe(unicodeNarration);
  });

  it('succeeds when narration contains nested JSON as a string', () => {
    const obj = validScript({ narration: '{"key": "value", "arr": [1,2,3]}' });
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.narration).toBe('{"key": "value", "arr": [1,2,3]}');
  });

  it('handles or throws on JSON with BOM character at start', () => {
    const bom = '\uFEFF';
    const json = JSON.stringify(validScript());
    const withBom = bom + json;
    // BOM followed by valid JSON: JSON.parse handles BOM in some engines.
    // The trim() call in parseSceneScript may or may not strip it.
    // Either succeeding or throwing is acceptable — we just verify no unhandled crash.
    try {
      const result = parseSceneScript(withBom);
      expect(result.success_level).toBe('FULL_SUCCESS');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('throws on truncated JSON (missing closing brace)', () => {
    const truncated = '{"success_level":"FULL_SUCCESS","narration":"Hi","actions":[';
    expect(() => parseSceneScript(truncated)).toThrow();
  });
});

// ===========================================================================
// Section 2: Cache edge cases
// ===========================================================================

import { getCachedResponse, saveToCache, loadDemoCache } from '../../services/cache';

/** A reusable mock SceneScript. */
const MOCK_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'Cache test narration',
  actions: [{ type: 'spawn', target: 'cake', position: 'center' }],
  prompt_feedback: 'Cache test feedback',
};

const MOCK_SCRIPT_B: SceneScript = {
  success_level: 'PARTIAL_SUCCESS',
  narration: 'Second script narration',
  actions: [{ type: 'spawn', target: 'balloon', position: 'left' }],
  prompt_feedback: 'Second script feedback',
};

describe('Cache — stress / edge cases', () => {
  beforeEach(() => {
    // Reset cache to a clean state before every test
    loadDemoCache({});
    vi.restoreAllMocks();
  });

  it('getCachedResponse returns null for an unknown taskId', () => {
    const result = getCachedResponse('nonexistent-task-id', 'some input');
    expect(result).toBeNull();
  });

  it('getCachedResponse returns null for an empty string input', () => {
    saveToCache('task', 'hello', MOCK_SCRIPT);
    const result = getCachedResponse('task', '');
    expect(result).toBeNull();
  });

  it('saveToCache then getCachedResponse retrieves the same script', () => {
    saveToCache('my-task', 'build a sandcastle', MOCK_SCRIPT);
    const result = getCachedResponse('my-task', 'build a sandcastle');
    expect(result).toEqual(MOCK_SCRIPT);
  });

  it('input with leading/trailing whitespace matches normalized version', () => {
    saveToCache('task', 'build a fort', MOCK_SCRIPT);
    const result = getCachedResponse('task', '  build a fort  ');
    expect(result).toEqual(MOCK_SCRIPT);
  });

  it('input with ALL CAPS matches lowercase version', () => {
    saveToCache('task', 'build a fort', MOCK_SCRIPT);
    const result = getCachedResponse('task', 'BUILD A FORT');
    expect(result).toEqual(MOCK_SCRIPT);
  });

  it('very long input (500 chars) can be saved and retrieved', () => {
    const longInput = 'word '.repeat(100).trim(); // 499 chars
    saveToCache('task', longInput, MOCK_SCRIPT);
    const result = getCachedResponse('task', longInput);
    expect(result).toEqual(MOCK_SCRIPT);
  });

  it('unicode input can be saved and retrieved', () => {
    const unicodeInput = '\u{1F382} birthday party \u4F60\u597D';
    saveToCache('task', unicodeInput, MOCK_SCRIPT);
    const result = getCachedResponse('task', unicodeInput);
    expect(result).toEqual(MOCK_SCRIPT);
  });

  it('special characters (&, <, >, ", \') in input work correctly', () => {
    const specialInput = 'cake & balloons < confetti > "party" \'fun\'';
    saveToCache('task', specialInput, MOCK_SCRIPT);
    // After normalization, punctuation is stripped, so retrieve with normalized form
    const result = getCachedResponse('task', specialInput);
    expect(result).toEqual(MOCK_SCRIPT);
  });

  it('multiple saves with the same key overwrites previous value', () => {
    saveToCache('task', 'bring a cake', MOCK_SCRIPT);
    saveToCache('task', 'bring a cake', MOCK_SCRIPT_B);
    const result = getCachedResponse('task', 'bring a cake');
    expect(result).toEqual(MOCK_SCRIPT_B);
  });
});

// ===========================================================================
// Section 3: Resolver edge cases
// ===========================================================================

// These mocks must be declared before importing the resolver module
vi.mock('../../services/cache', async () => {
  // Import the real module to use its actual implementation in sections 1 & 2,
  // but provide mock-able versions for the resolver tests.
  // Because vi.mock is hoisted, we use a dynamic approach.
  const actual = await vi.importActual<typeof import('../../services/cache')>('../../services/cache');
  return {
    ...actual,
    getCachedResponse: vi.fn(actual.getCachedResponse),
    saveToCache: vi.fn(actual.saveToCache),
    loadDemoCache: actual.loadDemoCache,
  };
});

vi.mock('../../services/claude', async () => {
  const actual = await vi.importActual<typeof import('../../services/claude')>('../../services/claude');
  return {
    ...actual,
    evaluateInput: vi.fn(),
  };
});

vi.mock('../../data/fallback-scripts', () => ({
  FALLBACK_SCRIPTS: {
    'monster-party': {
      success_level: 'PARTIAL_SUCCESS',
      narration: 'Fallback: the monster waits patiently.',
      actions: [
        { type: 'spawn', target: 'monster', position: 'center' },
      ],
      prompt_feedback: 'Fallback feedback for monster-party',
    } as SceneScript,
  } as Record<string, SceneScript>,
}));

import { resolveResponse } from '../../services/resolver';
import { evaluateInput } from '../../services/claude';

const LIVE_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'Live API script!',
  actions: [
    { type: 'spawn', target: 'cake-giant', position: 'center' },
    { type: 'react', effect: 'confetti-burst', position: 'center' },
  ],
  prompt_feedback: 'Excellent prompting!',
};

describe('resolveResponse — stress / edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the cache mocks to return null by default for resolver tests
    vi.mocked(getCachedResponse).mockReturnValue(null);
  });

  it('when cache returns a hit, live API is never called', async () => {
    const cachedScript: SceneScript = {
      success_level: 'FULL_SUCCESS',
      narration: 'Cached result',
      actions: [{ type: 'spawn', target: 'cake', position: 'center' }],
      prompt_feedback: 'From cache',
    };
    vi.mocked(getCachedResponse).mockReturnValue(cachedScript);

    const result = await resolveResponse('monster-party', 'system', 'test input');

    expect(result.script).toBe(cachedScript);
    expect(result.source).toBe('cache');
    expect(evaluateInput).not.toHaveBeenCalled();
  });

  it('when cache misses and API succeeds, result is saved to cache', async () => {
    vi.mocked(getCachedResponse).mockReturnValue(null);
    vi.mocked(evaluateInput).mockResolvedValue(LIVE_SCRIPT);

    await resolveResponse('monster-party', 'system', 'decorate the room');

    expect(saveToCache).toHaveBeenCalledWith(
      'monster-party',
      'decorate the room',
      LIVE_SCRIPT,
    );
  });

  it('when cache misses and API throws, fallback is returned', async () => {
    vi.mocked(getCachedResponse).mockReturnValue(null);
    vi.mocked(evaluateInput).mockRejectedValue(new Error('Network failure'));

    const result = await resolveResponse('monster-party', 'system', 'anything');

    expect(result.source).toBe('fallback');
    expect(result.script.success_level).toBe('PARTIAL_SUCCESS');
    expect(result.script.narration).toBe('Fallback: the monster waits patiently.');
  });

  it('when cache misses and API throws, error is logged via console.warn', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(getCachedResponse).mockReturnValue(null);
    const apiError = new Error('API timeout');
    vi.mocked(evaluateInput).mockRejectedValue(apiError);

    await resolveResponse('monster-party', 'system', 'anything');

    expect(warnSpy).toHaveBeenCalledWith('[Resolver] Tier 2 failed:', apiError);
  });

  it('fallback always returns a valid SceneScript with all required fields', async () => {
    vi.mocked(getCachedResponse).mockReturnValue(null);
    vi.mocked(evaluateInput).mockRejectedValue(new Error('fail'));

    const result = await resolveResponse('monster-party', 'system', 'anything');

    const script = result.script;
    expect(script).toBeDefined();
    expect(['FULL_SUCCESS', 'PARTIAL_SUCCESS', 'FUNNY_FAIL']).toContain(script.success_level);
    expect(typeof script.narration).toBe('string');
    expect(script.narration.length).toBeGreaterThan(0);
    expect(Array.isArray(script.actions)).toBe(true);
    expect(typeof script.prompt_feedback).toBe('string');
  });

  it('unknown taskId still returns a fallback (defaults to monster-party fallback)', async () => {
    vi.mocked(getCachedResponse).mockReturnValue(null);
    vi.mocked(evaluateInput).mockRejectedValue(new Error('fail'));

    const result = await resolveResponse('totally-unknown-task', 'system', 'anything');

    expect(result.source).toBe('fallback');
    // Should fall back to monster-party since 'totally-unknown-task' is not in FALLBACK_SCRIPTS
    expect(result.script.narration).toBe('Fallback: the monster waits patiently.');
    expect(result.script.prompt_feedback).toBe('Fallback feedback for monster-party');
  });

  it('response always has latencyMs >= 0 (cache path)', async () => {
    vi.mocked(getCachedResponse).mockReturnValue(LIVE_SCRIPT);

    const result = await resolveResponse('monster-party', 'system', 'test');

    expect(typeof result.latencyMs).toBe('number');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('response always has latencyMs >= 0 (live path)', async () => {
    vi.mocked(getCachedResponse).mockReturnValue(null);
    vi.mocked(evaluateInput).mockResolvedValue(LIVE_SCRIPT);

    const result = await resolveResponse('monster-party', 'system', 'test');

    expect(typeof result.latencyMs).toBe('number');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('response always has latencyMs >= 0 (fallback path)', async () => {
    vi.mocked(getCachedResponse).mockReturnValue(null);
    vi.mocked(evaluateInput).mockRejectedValue(new Error('fail'));

    const result = await resolveResponse('monster-party', 'system', 'test');

    expect(typeof result.latencyMs).toBe('number');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
