import type { SceneScript } from '../../types/scene-script';
import { parseSceneScript } from '../claude';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** A minimal valid scene script with all required fields. */
function validScriptObject(overrides: Partial<SceneScript> = {}): SceneScript {
  return {
    success_level: 'FULL_SUCCESS',
    narration: 'The monster ate the giant cake!',
    actions: [
      { type: 'spawn', target: 'cake-giant', position: 'center' },
      { type: 'animate', target: 'monster', anim: 'eat' },
      { type: 'react', effect: 'confetti-burst', position: 'center' },
    ],
    prompt_feedback: 'Great job specifying the cake size!',
    ...overrides,
  };
}

/** Serialize a script object to a raw JSON string. */
function toRaw(obj: SceneScript): string {
  return JSON.stringify(obj);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('parseSceneScript', () => {
  // 1. Valid JSON
  it('parses a well-formed scene script correctly', () => {
    const input = validScriptObject();
    const result = parseSceneScript(toRaw(input));

    expect(result.success_level).toBe('FULL_SUCCESS');
    expect(result.narration).toBe('The monster ate the giant cake!');
    expect(result.actions).toHaveLength(3);
    expect(result.actions[0]).toEqual({
      type: 'spawn',
      target: 'cake-giant',
      position: 'center',
    });
    expect(result.prompt_feedback).toBe('Great job specifying the cake size!');
  });

  // 2. Markdown-wrapped JSON (```json ... ```)
  it('strips ```json fences before parsing', () => {
    const json = toRaw(validScriptObject());
    const wrapped = '```json\n' + json + '\n```';

    const result = parseSceneScript(wrapped);
    expect(result.success_level).toBe('FULL_SUCCESS');
    expect(result.actions).toHaveLength(3);
  });

  // 3. Markdown fences without language tag (``` ... ```)
  it('strips ``` fences without a language tag', () => {
    const json = toRaw(validScriptObject());
    const wrapped = '```\n' + json + '\n```';

    const result = parseSceneScript(wrapped);
    expect(result.success_level).toBe('FULL_SUCCESS');
    expect(result.actions).toHaveLength(3);
  });

  // 4. Missing success_level
  it('throws when success_level is missing', () => {
    const obj = validScriptObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (obj as any).success_level;

    expect(() => parseSceneScript(JSON.stringify(obj))).toThrow(
      'Invalid scene script: missing required fields',
    );
  });

  // 5. Missing actions array
  it('throws when actions array is missing', () => {
    const obj = validScriptObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (obj as any).actions;

    expect(() => parseSceneScript(JSON.stringify(obj))).toThrow(
      'Invalid scene script: missing required fields',
    );
  });

  // 6. Actions not an array
  it('throws when actions is not an array', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj = { ...validScriptObject(), actions: 'foo' as any };

    expect(() => parseSceneScript(JSON.stringify(obj))).toThrow(
      'Invalid scene script: missing required fields',
    );
  });

  // 7. Invalid JSON
  it('throws on completely invalid JSON', () => {
    expect(() => parseSceneScript('this is not json')).toThrow();
  });

  // 8. Whitespace around JSON
  it('trims surrounding whitespace and parses correctly', () => {
    const json = toRaw(validScriptObject());
    const padded = '   \n\n  ' + json + '  \n\n   ';

    const result = parseSceneScript(padded);
    expect(result.success_level).toBe('FULL_SUCCESS');
    expect(result.actions).toHaveLength(3);
  });

  // 9. All three success levels parse correctly
  describe('all success levels', () => {
    const levels = ['FULL_SUCCESS', 'PARTIAL_SUCCESS', 'FUNNY_FAIL'] as const;

    for (const level of levels) {
      it(`parses success_level "${level}"`, () => {
        const input = validScriptObject({ success_level: level });
        const result = parseSceneScript(toRaw(input));
        expect(result.success_level).toBe(level);
      });
    }
  });
});
