/**
 * Option Generator — calls Claude Sonnet to generate fresh Mad Libs options.
 *
 * Fires on stage entry (while intro text displays). Returns SlotOption arrays
 * for each slot in the current quest stage. Falls back to defaultOptions if
 * Claude hasn't responded in 4 seconds.
 */

import type { SlotOption, QuestStage } from '../types/madlibs';

const OPTION_TIMEOUT_MS = 4000;

/**
 * Generate fresh options for all slots in a quest stage.
 * Uses Claude Sonnet for speed. Falls back to defaultOptions on timeout.
 */
export async function generateOptions(
  stage: QuestStage,
  playCount: number,
): Promise<Record<string, SlotOption[]>> {
  const result: Record<string, SlotOption[]> = {};

  // Start with defaults immediately
  for (const slot of stage.template.slots) {
    result[slot.id] = slot.defaultOptions;
  }

  try {
    const response = await Promise.race([
      callOptionGeneration(stage, playCount),
      timeout(OPTION_TIMEOUT_MS),
    ]);

    if (response) {
      // Merge generated options, validating tags
      for (const slot of stage.template.slots) {
        const generated = (response as Record<string, SlotOption[]>)[slot.id];
        if (generated && generated.length >= 3) {
          // Validate all tags are in allowedTags
          const valid = generated.filter(opt => slot.allowedTags.includes(opt.tag));
          if (valid.length >= 3) {
            result[slot.id] = valid.slice(0, 6);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[option-generator] Claude call failed, using defaults:', err);
  }

  return result;
}

async function callOptionGeneration(
  stage: QuestStage,
  playCount: number,
): Promise<Record<string, SlotOption[]> | null> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[option-generator] No API key — using defaults');
    return null;
  }

  const difficultyHint = playCount <= 3
    ? 'straightforward and recognizable (cake, pizza, music)'
    : playCount <= 6
    ? 'sillier and more creative (invisible pizza, a cake made of socks)'
    : 'prompt-engineering focused (exactly 3 blue cupcakes, a very specific magic trick)';

  const slotsDesc = stage.template.slots.map(s =>
    `- ${s.id} (${s.label}): allowed tags = [${s.allowedTags.join(', ')}]`
  ).join('\n');

  const systemPrompt = `You generate creative dropdown options for a kids' game (ages 8-10).

QUEST: ${stage.title}
TEMPLATE: "${stage.template.sentence}"

SLOTS:
${slotsDesc}

Generate 6 options per slot. Each option needs:
- "label": Fun kid-friendly text (1-4 words)
- "tag": Must be one of the allowed tags for that slot
- "icon": A single emoji

Difficulty: ${difficultyHint}

Mix sensible, silly, and absurd options. Make labels fun and kid-appropriate.

Return ONLY a JSON object like:
{
  "SLOT_ID": [{"label": "...", "tag": "...", "icon": "..."}],
  ...
}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [{ role: 'user', content: 'Generate the options now.' }],
        system: systemPrompt,
      }),
    });

    if (!resp.ok) {
      console.warn(`[option-generator] API error: ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    const text = data.content?.[0]?.text ?? '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (err) {
    console.warn('[option-generator] Parse error:', err);
    return null;
  }
}

function timeout(ms: number): Promise<null> {
  return new Promise(resolve => setTimeout(() => resolve(null), ms));
}
