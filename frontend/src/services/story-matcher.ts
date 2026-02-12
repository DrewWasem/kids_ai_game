import type { StoryResponse } from '../data/stories/types';

/** Match result with score for ranking */
export interface StoryMatchResult {
  response: StoryResponse;
  score: number;
}

/** Normalize input: lowercase, strip punctuation, collapse whitespace */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Common stopwords — hoisted to module scope to avoid re-creation per call */
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'it', 'its', 'this', 'that',
  'and', 'or', 'but', 'not', 'so', 'if', 'then', 'than', 'too',
  'very', 'just', 'about', 'up', 'out', 'no', 'yes', 'all', 'some',
  'my', 'your', 'his', 'her', 'we', 'they', 'i', 'you', 'he', 'she',
]);

/** Extract meaningful keywords (skip common stopwords) */
function extractKeywords(input: string): string[] {
  return normalize(input)
    .split(' ')
    .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

/** Calculate keyword overlap between two strings (0-1) */
function keywordOverlap(inputA: string, inputB: string): number {
  const kwA = extractKeywords(inputA);
  const kwB = extractKeywords(inputB);
  if (kwA.length === 0 || kwB.length === 0) return 0;

  const setB = new Set(kwB);
  let matches = 0;
  for (const kw of kwA) {
    if (setB.has(kw)) matches++;
  }
  // Normalize by the smaller set to be generous
  return matches / Math.min(kwA.length, kwB.length);
}

const MATCH_THRESHOLD = 0.35;

/**
 * Find the best matching StoryResponse for user input.
 * Returns null if no response scores above threshold.
 */
export function matchStoryInput(
  userInput: string,
  responses: StoryResponse[],
): StoryMatchResult | null {
  const norm = normalize(userInput);

  // Exact match first (normalized)
  for (const response of responses) {
    if (normalize(response.sampleInput) === norm) {
      return { response, score: 1.0 };
    }
  }

  // Fuzzy keyword match
  let bestScore = 0;
  let bestResponse: StoryResponse | null = null;

  for (const response of responses) {
    const score = keywordOverlap(userInput, response.sampleInput);
    if (score > bestScore) {
      bestScore = score;
      bestResponse = response;
    }
  }

  if (bestResponse && bestScore >= MATCH_THRESHOLD) {
    console.log(`[StoryMatcher] Matched (score=${bestScore.toFixed(2)}): "${userInput}" → "${bestResponse.sampleInput.slice(0, 60)}..."`);
    return { response: bestResponse, score: bestScore };
  }

  console.log(`[StoryMatcher] No match (best=${bestScore.toFixed(2)}): "${userInput}"`);
  return null;
}
