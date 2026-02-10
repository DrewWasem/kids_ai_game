import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadDemoCache, getCachedResponse, saveToCache } from '../cache';
import type { SceneScript } from '../../types/scene-script';

// ---------------------------------------------------------------------------
// Mock SceneScript fixtures
// ---------------------------------------------------------------------------

const MOCK_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'The monster loved the giant cake!',
  actions: [
    { type: 'spawn', target: 'cake-giant', position: 'center' },
    { type: 'animate', target: 'monster', anim: 'eat' },
    { type: 'react', effect: 'confetti-burst', position: 'center' },
  ],
  prompt_feedback: 'Great job specifying a giant cake for the monster!',
};

const MOCK_SCRIPT_ALT: SceneScript = {
  success_level: 'PARTIAL_SUCCESS',
  narration: 'The rocket zoomed into space!',
  actions: [
    { type: 'spawn', target: 'rocket', position: 'bottom' },
    { type: 'move', target: 'rocket', to: 'top', style: 'arc' },
  ],
  prompt_feedback: 'Try adding more details about the destination.',
};

const MOCK_SCRIPT_FUNNY: SceneScript = {
  success_level: 'FUNNY_FAIL',
  narration: 'The dog ate all the balloons!',
  actions: [
    { type: 'spawn', target: 'dog', position: 'left' },
    { type: 'spawn', target: 'balloon', position: 'right' },
    { type: 'animate', target: 'dog', anim: 'eat' },
  ],
  prompt_feedback: 'Balloons are not food! Try giving the dog a bone instead.',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a demo cache data structure for use with loadDemoCache. */
function makeDemoCache(
  entries: Record<string, Record<string, SceneScript>>,
): Record<string, Record<string, SceneScript>> {
  return entries;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Cache Service', () => {
  // Reset cache state before each test by loading an empty cache
  beforeEach(() => {
    vi.restoreAllMocks();
    loadDemoCache({});
  });

  // -----------------------------------------------------------------------
  // loadDemoCache
  // -----------------------------------------------------------------------
  describe('loadDemoCache', () => {
    it('should load data and log the total count of cached responses', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const data = makeDemoCache({
        'monster-party': {
          'bring a giant cake': MOCK_SCRIPT,
          'launch a rocket': MOCK_SCRIPT_ALT,
        },
        'robot-pizza': {
          'give the dog a balloon': MOCK_SCRIPT_FUNNY,
        },
      });

      loadDemoCache(data);

      expect(consoleSpy).toHaveBeenCalledWith('[Cache] Loaded 3 pre-cached responses');
    });

    it('should log 0 when loaded with an empty object', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      loadDemoCache({});

      expect(consoleSpy).toHaveBeenCalledWith('[Cache] Loaded 0 pre-cached responses');
    });

    it('should replace previous cache data entirely', () => {
      loadDemoCache({
        'monster-party': { 'bring a cake': MOCK_SCRIPT },
      });
      expect(getCachedResponse('monster-party', 'bring a cake')).toEqual(MOCK_SCRIPT);

      // Now load fresh data without the old entry
      loadDemoCache({
        'monster-party': { 'launch a rocket': MOCK_SCRIPT_ALT },
      });
      expect(getCachedResponse('monster-party', 'bring a cake')).toBeNull();
      expect(getCachedResponse('monster-party', 'launch a rocket')).toEqual(MOCK_SCRIPT_ALT);
    });
  });

  // -----------------------------------------------------------------------
  // getCachedResponse - exact match
  // -----------------------------------------------------------------------
  describe('getCachedResponse - exact match', () => {
    it('should return the script for an exact key match', () => {
      loadDemoCache({
        'monster-party': { 'bring a giant cake': MOCK_SCRIPT },
      });

      const result = getCachedResponse('monster-party', 'bring a giant cake');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should match when cached key is already normalized and input normalizes to same value', () => {
      loadDemoCache({
        'monster-party': { 'bring a giant cake': MOCK_SCRIPT },
      });

      // Input has different casing and extra whitespace - normalizes to same key
      const result = getCachedResponse('monster-party', '  Bring A Giant Cake  ');
      expect(result).toEqual(MOCK_SCRIPT);
    });
  });

  // -----------------------------------------------------------------------
  // getCachedResponse - normalized match
  // -----------------------------------------------------------------------
  describe('getCachedResponse - normalized match', () => {
    it('should match case-insensitively', () => {
      loadDemoCache({
        'monster-party': { 'Bring A Giant Cake': MOCK_SCRIPT },
      });

      const result = getCachedResponse('monster-party', 'bring a giant cake');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should match when punctuation is stripped', () => {
      loadDemoCache({
        'monster-party': { "Bring a giant cake!!!": MOCK_SCRIPT },
      });

      const result = getCachedResponse('monster-party', 'bring a giant cake');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should match when extra whitespace is collapsed', () => {
      loadDemoCache({
        'monster-party': { 'bring   a   giant   cake': MOCK_SCRIPT },
      });

      const result = getCachedResponse('monster-party', 'bring a giant cake');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should match with combined normalization (case + punctuation + whitespace)', () => {
      loadDemoCache({
        'monster-party': { '  BRING,  a Giant... CAKE!!! ': MOCK_SCRIPT },
      });

      const result = getCachedResponse('monster-party', 'bring a giant cake');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should match input with punctuation against a clean cached key', () => {
      loadDemoCache({
        'monster-party': { 'bring a giant cake': MOCK_SCRIPT },
      });

      const result = getCachedResponse('monster-party', 'Bring a giant cake!!!');
      expect(result).toEqual(MOCK_SCRIPT);
    });
  });

  // -----------------------------------------------------------------------
  // getCachedResponse - fuzzy keyword match
  // -----------------------------------------------------------------------
  describe('getCachedResponse - fuzzy keyword match', () => {
    it('should return a script when keyword overlap is >= 60%', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Cached keywords (after stop-word removal): ["bring", "giant", "chocolate", "cake", "monster"]
      // Input keywords: ["giant", "chocolate", "cake"]
      // matches = 3, max(3, 5) = 5, score = 3/5 = 0.6 - exactly at threshold
      loadDemoCache({
        'monster-party': {
          'bring giant chocolate cake monster': MOCK_SCRIPT,
        },
      });

      const result = getCachedResponse('monster-party', 'giant chocolate cake');
      expect(result).toEqual(MOCK_SCRIPT);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Cache] Fuzzy match'),
      );
    });

    it('should return the best match when multiple entries exist', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {});

      loadDemoCache({
        'monster-party': {
          'giant chocolate birthday cake': MOCK_SCRIPT,
          'rocket space launch moon': MOCK_SCRIPT_ALT,
        },
      });

      // First entry keywords: ["giant", "chocolate", "birthday", "cake"]
      // Input keywords: ["giant", "chocolate", "cake"]
      // matches = 3, max(3,4) = 4, score = 0.75 - above threshold
      // Second entry keywords: ["rocket", "space", "launch", "moon"]
      // matches = 0, score = 0
      const result = getCachedResponse('monster-party', 'giant chocolate cake');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should return null when keyword overlap is below 60% threshold', () => {
      loadDemoCache({
        'monster-party': {
          'giant chocolate birthday cake with sprinkles': MOCK_SCRIPT,
        },
      });

      // Cached keywords: ["giant", "chocolate", "birthday", "cake", "sprinkles"]
      // Input "tiny red balloon" keywords: ["tiny", "red", "balloon"]
      // matches = 0, score = 0 - below threshold
      const result = getCachedResponse('monster-party', 'tiny red balloon');
      expect(result).toBeNull();
    });

    it('should return null when overlap is just below 60%', () => {
      loadDemoCache({
        'monster-party': {
          'big purple dancing singing flying monster': MOCK_SCRIPT,
        },
      });

      // Cached keywords: ["big", "purple", "dancing", "singing", "flying", "monster"]
      // Input keywords: ["big", "purple", "sleeping"] -> 3 words
      // matches = 2 (big, purple), max(3, 6) = 6, score = 2/6 = 0.333 - below threshold
      const result = getCachedResponse('monster-party', 'big purple sleeping');
      expect(result).toBeNull();
    });

    it('should log the fuzzy match score when a fuzzy match succeeds', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      loadDemoCache({
        'monster-party': {
          'giant cake party': MOCK_SCRIPT,
        },
      });

      // Cached keywords: ["giant", "cake", "party"]
      // Input keywords: ["giant", "cake", "celebration"]
      // matches = 2, max(3,3) = 3, score = 2/3 ~ 0.667 - above threshold
      getCachedResponse('monster-party', 'giant cake celebration');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[Cache\] Fuzzy match \(score=0\.6[67]\)/),
      );
    });
  });

  // -----------------------------------------------------------------------
  // getCachedResponse - empty / unknown
  // -----------------------------------------------------------------------
  describe('getCachedResponse - empty cache and unknown taskId', () => {
    it('should return null when cache is empty', () => {
      loadDemoCache({});
      const result = getCachedResponse('monster-party', 'bring a cake');
      expect(result).toBeNull();
    });

    it('should return null for an unknown taskId', () => {
      loadDemoCache({
        'monster-party': { 'bring a cake': MOCK_SCRIPT },
      });

      const result = getCachedResponse('unknown-task', 'bring a cake');
      expect(result).toBeNull();
    });

    it('should return null when taskId exists but input has no match', () => {
      loadDemoCache({
        'monster-party': { 'bring a cake': MOCK_SCRIPT },
      });

      // Completely unrelated input with no keyword overlap
      const result = getCachedResponse('monster-party', 'xylophone zeppelin quasar');
      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // saveToCache
  // -----------------------------------------------------------------------
  describe('saveToCache', () => {
    it('should save a response and retrieve it correctly', () => {
      saveToCache('monster-party', 'build a pillow fort', MOCK_SCRIPT);

      const result = getCachedResponse('monster-party', 'build a pillow fort');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should create a new task bucket if the taskId does not exist', () => {
      // Cache starts empty, saveToCache should create the task bucket
      saveToCache('new-task', 'do something cool', MOCK_SCRIPT_ALT);

      const result = getCachedResponse('new-task', 'do something cool');
      expect(result).toEqual(MOCK_SCRIPT_ALT);
    });

    it('should normalize the input key before saving', () => {
      saveToCache('monster-party', '  BUILD a Pillow Fort!!!  ', MOCK_SCRIPT);

      // Retrieve with a clean version - should match because both normalize the same
      const result = getCachedResponse('monster-party', 'build a pillow fort');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should overwrite an existing entry for the same normalized key', () => {
      saveToCache('monster-party', 'bring a cake', MOCK_SCRIPT);
      saveToCache('monster-party', 'bring a cake', MOCK_SCRIPT_ALT);

      const result = getCachedResponse('monster-party', 'bring a cake');
      expect(result).toEqual(MOCK_SCRIPT_ALT);
    });

    it('should store multiple entries under the same taskId', () => {
      saveToCache('monster-party', 'bring a cake', MOCK_SCRIPT);
      saveToCache('monster-party', 'launch a rocket', MOCK_SCRIPT_ALT);

      expect(getCachedResponse('monster-party', 'bring a cake')).toEqual(MOCK_SCRIPT);
      expect(getCachedResponse('monster-party', 'launch a rocket')).toEqual(MOCK_SCRIPT_ALT);
    });

    it('should coexist with preloaded demo cache data', () => {
      loadDemoCache({
        'monster-party': { 'bring a cake': MOCK_SCRIPT },
      });

      saveToCache('monster-party', 'launch a rocket', MOCK_SCRIPT_ALT);

      // Both should be accessible
      expect(getCachedResponse('monster-party', 'bring a cake')).toEqual(MOCK_SCRIPT);
      expect(getCachedResponse('monster-party', 'launch a rocket')).toEqual(MOCK_SCRIPT_ALT);
    });
  });

  // -----------------------------------------------------------------------
  // Normalization behavior (indirectly tested through getCachedResponse)
  // -----------------------------------------------------------------------
  describe('Normalization', () => {
    it('should strip all punctuation marks', () => {
      loadDemoCache({
        task: { 'hello world': MOCK_SCRIPT },
      });

      // Various punctuation characters
      expect(getCachedResponse('task', 'hello, world!')).toEqual(MOCK_SCRIPT);
      expect(getCachedResponse('task', 'hello... world?')).toEqual(MOCK_SCRIPT);
    });

    it('should handle parentheses and quotes as punctuation', () => {
      loadDemoCache({
        task: { 'hello world': MOCK_SCRIPT },
      });

      expect(getCachedResponse('task', '"hello" (world)')).toEqual(MOCK_SCRIPT);
    });

    it('should collapse multiple whitespace characters into single space', () => {
      loadDemoCache({
        task: { 'one two three': MOCK_SCRIPT },
      });

      expect(getCachedResponse('task', 'one    two     three')).toEqual(MOCK_SCRIPT);
      expect(getCachedResponse('task', '  one  two  three  ')).toEqual(MOCK_SCRIPT);
    });

    it('should convert all characters to lowercase', () => {
      loadDemoCache({
        task: { 'abc def': MOCK_SCRIPT },
      });

      expect(getCachedResponse('task', 'ABC DEF')).toEqual(MOCK_SCRIPT);
      expect(getCachedResponse('task', 'AbC dEf')).toEqual(MOCK_SCRIPT);
    });

    it('should handle empty and whitespace-only inputs gracefully', () => {
      loadDemoCache({
        task: { 'hello': MOCK_SCRIPT },
      });

      // Empty string will not match "hello"
      expect(getCachedResponse('task', '')).toBeNull();
      expect(getCachedResponse('task', '   ')).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Keyword extraction (indirectly tested through fuzzy matching)
  // -----------------------------------------------------------------------
  describe('Keyword extraction', () => {
    it('should remove common stop words and keep meaningful words', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {});

      // "the big red monster" -> keywords: ["big", "red", "monster"] (stop word "the" removed)
      // "a big red monster" -> keywords: ["big", "red", "monster"]
      // Perfect overlap -> score = 1.0
      loadDemoCache({
        task: { 'the big red monster': MOCK_SCRIPT },
      });

      // Different stop words but same meaningful words
      const result = getCachedResponse('task', 'a big red monster');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should filter out single-character words', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {});

      // Input "a b c dragon" -> keywords should be just ["dragon"] (single chars filtered)
      // Cached "dragon fire" -> keywords: ["dragon", "fire"]
      // matches = 1 (dragon), max(1, 2) = 2, score = 0.5 - below threshold
      loadDemoCache({
        task: { 'dragon fire': MOCK_SCRIPT },
      });

      // Only "dragon" survives keyword extraction from this input
      const result = getCachedResponse('task', 'a b c dragon');
      expect(result).toBeNull(); // 0.5 < 0.6 threshold
    });

    it('should return null (score 0) when all input words are stop words', () => {
      loadDemoCache({
        task: { 'dragon fire castle': MOCK_SCRIPT },
      });

      // All stop words - no keywords extracted, score = 0
      const result = getCachedResponse('task', 'the and or but is are');
      expect(result).toBeNull();
    });

    it('should handle inputs with only stop words and punctuation', () => {
      loadDemoCache({
        task: { 'monster cake party': MOCK_SCRIPT },
      });

      const result = getCachedResponse('task', 'the, and! or? but.');
      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------
  describe('Edge cases', () => {
    it('should handle very long inputs without errors', () => {
      loadDemoCache({
        task: { 'monster cake': MOCK_SCRIPT },
      });

      const longInput = 'monster cake ' + 'extra word '.repeat(100);
      // keyword overlap would be low due to many extra words
      // 2 matches / max(102, 2) = 2/102 ~ 0.02 - well below threshold
      // normalized exact match will not match either
      const result = getCachedResponse('task', longInput);
      expect(result).toBeNull();
    });

    it('should handle special characters in input', () => {
      loadDemoCache({
        task: { 'monster cake': MOCK_SCRIPT },
      });

      // After normalization, "m@nst3r c#ke" becomes "mnst3r cke" - not matching "monster cake"
      const result = getCachedResponse('task', 'm@nst3r c#ke');
      expect(result).toBeNull();
    });

    it('should handle numeric content in inputs', () => {
      saveToCache('task', 'bring 3 cakes', MOCK_SCRIPT);

      const result = getCachedResponse('task', 'bring 3 cakes');
      expect(result).toEqual(MOCK_SCRIPT);
    });

    it('should differentiate between different task IDs', () => {
      saveToCache('task-a', 'bring a cake', MOCK_SCRIPT);
      saveToCache('task-b', 'bring a cake', MOCK_SCRIPT_ALT);

      expect(getCachedResponse('task-a', 'bring a cake')).toEqual(MOCK_SCRIPT);
      expect(getCachedResponse('task-b', 'bring a cake')).toEqual(MOCK_SCRIPT_ALT);
    });
  });
});
