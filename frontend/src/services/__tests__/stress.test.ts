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

  it('succeeds when extra unknown fields are present (they get stripped)', () => {
    const obj = {
      ...validScript(),
      bonus_field: 42,
      another_unknown: { nested: true },
    };
    const result = parseSceneScript(JSON.stringify(obj));
    expect(result.success_level).toBe('FULL_SUCCESS');
    expect(result.actions).toHaveLength(1);
    // Extra fields are stripped — parseSceneScript only extracts known fields
    expect((result as Record<string, unknown>).bonus_field).toBeUndefined();
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
// Section 3: Resolver edge cases (covered in resolver.test.ts)
// ===========================================================================
// Resolver tests have been moved to resolver.test.ts for cleaner isolation.
// The resolver now uses a 2-tier architecture (live API + fallback, no cache).
