import type { SceneScript } from '../types/scene-script';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const TIMEOUT_MS = 6000;

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY not set in .env');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }] as ClaudeMessage[],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error ${response.status}: ${error}`);
    }

    const data: ClaudeResponse = await response.json();
    return data.content[0].text;
  } finally {
    clearTimeout(timeout);
  }
}

export function parseSceneScript(raw: string): SceneScript {
  // Strip markdown code fences if Claude wraps the JSON
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  if (!parsed.success_level || !parsed.actions || !Array.isArray(parsed.actions)) {
    throw new Error('Invalid scene script: missing required fields');
  }

  return parsed as SceneScript;
}

export async function evaluateInput(
  systemPrompt: string,
  userInput: string,
): Promise<SceneScript> {
  const raw = await callClaude(systemPrompt, userInput);
  return parseSceneScript(raw);
}
