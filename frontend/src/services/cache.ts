import type { SceneScript } from '../types/scene-script';

/** Stored cache: taskId → normalized input → SceneScript */
let CACHE: Record<string, Record<string, SceneScript>> = {};

/** Load pre-generated responses from the demo cache JSON file. */
export function loadDemoCache(data: Record<string, Record<string, SceneScript>>): void {
  CACHE = data;
  const count = Object.values(CACHE).reduce(
    (sum, entries) => sum + Object.keys(entries).length,
    0,
  );
  console.log(`[Cache] Loaded ${count} pre-cached responses`);
}

/** Normalize an input string for matching. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')   // strip punctuation
    .replace(/\s+/g, ' ');      // collapse whitespace
}

/** Extract meaningful keywords from an input. */
function extractKeywords(input: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'to', 'for', 'of', 'with', 'in', 'on', 'at', 'by', 'it', 'its',
    'be', 'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would',
    'can', 'could', 'should', 'may', 'might', 'shall', 'i', 'you', 'he',
    'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
    'his', 'our', 'their', 'this', 'that', 'some', 'any', 'no', 'not',
    'so', 'if', 'then', 'than', 'too', 'very', 'just', 'about', 'up',
    'out', 'how', 'what', 'when', 'where', 'who', 'which', 'there',
    'here', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'make', 'let', 'get', 'put', 'take', 'give', 'go', 'come', 'want',
    'need', 'like', 'really', 'please',
  ]);

  return normalize(input)
    .split(' ')
    .filter(w => w.length > 1 && !stopWords.has(w));
}

/** Compute keyword overlap score between two inputs. Returns 0-1. */
function keywordOverlap(inputA: string, inputB: string): number {
  const kwA = extractKeywords(inputA);
  const kwB = extractKeywords(inputB);

  if (kwA.length === 0 || kwB.length === 0) return 0;

  const setB = new Set(kwB);
  const matches = kwA.filter(w => setB.has(w)).length;

  // Jaccard-ish: matches / max(len) — biased toward shorter inputs matching
  return matches / Math.max(kwA.length, kwB.length);
}

/**
 * Get a cached response for the given task and input.
 * Tries exact match first, then fuzzy keyword matching.
 * Returns null if no sufficiently close match found.
 */
export function getCachedResponse(taskId: string, input: string): SceneScript | null {
  const taskCache = CACHE[taskId];
  if (!taskCache) return null;

  const norm = normalize(input);

  // Exact match on normalized input
  if (taskCache[norm]) {
    return taskCache[norm];
  }

  // Also try exact match against stored keys (they may already be normalized)
  for (const [key, script] of Object.entries(taskCache)) {
    if (normalize(key) === norm) {
      return script;
    }
  }

  // Fuzzy match: find best keyword overlap
  let bestScore = 0;
  let bestScript: SceneScript | null = null;

  for (const [key, script] of Object.entries(taskCache)) {
    const score = keywordOverlap(input, key);
    if (score > bestScore) {
      bestScore = score;
      bestScript = script;
    }
  }

  // Threshold: require at least 60% keyword overlap for a fuzzy match
  const FUZZY_THRESHOLD = 0.6;
  if (bestScore >= FUZZY_THRESHOLD && bestScript) {
    console.log(`[Cache] Fuzzy match (score=${bestScore.toFixed(2)}) for "${input}"`);
    return bestScript;
  }

  return null;
}

/**
 * Save a live response to the runtime cache (not persisted to disk).
 */
export function saveToCache(taskId: string, input: string, script: SceneScript): void {
  if (!CACHE[taskId]) {
    CACHE[taskId] = {};
  }
  CACHE[taskId][normalize(input)] = script;
}
