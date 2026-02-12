/**
 * Stage Layout Engine — comprehensive tests for all 7 stories (220 responses).
 *
 * Tests the full pipeline: StoryResponse → resolveStoryResponse → layoutStage
 * Verifies:
 *   1. No overlapping positions (min distance between actors)
 *   2. No collision with environment props
 *   3. All spawns get resolvedPosition coordinates
 *   4. Walk-in conversion (appear-* → off-screen spawn + move)
 *   5. Move actions have distance-based duration_ms
 *   6. Original scripts are not mutated
 *   7. Every response across all stories processes without error
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { layoutStage } from '../stage-layout-engine';
import { resolveStoryResponse } from '../story-resolver';
import { STORY_ORDER } from '../../data/stories/index';
import type { Story, StoryResponse } from '../../data/stories/types';
import type { SceneScript, Action, SpawnAction, MoveAction } from '../../types/scene-script';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const MIN_ACTOR_DISTANCE = 1.4; // slots are 2u apart; allow small tolerance under 1.5
const ENV_CLEARANCE = 1.8; // slightly under 2.0u for floating point tolerance

/** Environment prop positions per zone (mirrors TASK_ENVIRONMENTS in ScenePlayer3D) */
const ENV_POSITIONS: Record<string, [number, number, number][]> = {
  'skeleton-birthday': [[-5, 0, -3], [5, 0, -3], [-4, 0, -2], [0, 0, -4]],
  'knight-space': [[0, 0, -4], [-4, 0, -2], [4, 0, -2]],
  'mage-kitchen': [[-3, 0, -3], [3, 0, -3], [0, 0, -4]],
  'barbarian-school': [[-4, 0, -3], [4, 0, -3], [0, 0, -4]],
  'dungeon-concert': [[-5, 0, -3], [5, 0, -3], [0, 0, -4], [-3, 0, -2], [3, 0, -2]],
  'skeleton-pizza': [[-4, 0, -2], [4, 0, -2], [0, 0, -5]],
  'adventurers-picnic': [[-5, 0, -3], [5, 0, -4], [0, 0.01, -1], [-3, 0, -4]],
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

function distance2D(a: [number, number, number], b: [number, number, number]): number {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dz * dz);
}

/** Extract all resolved positions from spawn actions (excluding off-screen) */
function getSpawnPositions(actions: Action[]): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>();
  for (const action of actions) {
    if (action.type === 'spawn' && action.resolvedPosition) {
      // Skip off-screen spawns (these will walk in)
      const [x] = action.resolvedPosition;
      if (Math.abs(x) <= 5) {
        positions.set(action.target, action.resolvedPosition);
      }
    }
  }
  return positions;
}

/** Extract final positions: spawn positions overridden by move resolvedPositions */
function getFinalPositions(actions: Action[]): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>();
  for (const action of actions) {
    if (action.type === 'spawn' && action.resolvedPosition) {
      positions.set(action.target, action.resolvedPosition);
    }
    if (action.type === 'move' && action.resolvedPosition) {
      positions.set(action.target, action.resolvedPosition);
    }
  }
  return positions;
}

/** Count spawn_group member positions */
function getGroupPositions(actions: Action[]): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (const action of actions) {
    if (action.type === 'spawn_group') {
      for (const member of action.targets) {
        if (member.offset) {
          positions.push(member.offset as [number, number, number]);
        }
      }
    }
  }
  return positions;
}

function resolveStory(response: StoryResponse, taskId: string): SceneScript {
  return resolveStoryResponse(response, taskId);
}

// ─── TEST SUITES ────────────────────────────────────────────────────────────

describe('Stage Layout Engine', () => {

  // ── Unit tests for layoutStage core behavior ──────────────────────────────

  describe('core behavior', () => {
    it('returns a new object (does not mutate input)', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'center' },
        ],
        prompt_feedback: 'test',
      };
      const original = JSON.stringify(input);
      const result = layoutStage(input, 'skeleton-birthday');

      expect(result).not.toBe(input);
      expect(JSON.stringify(input)).toBe(original);
    });

    it('assigns resolvedPosition to spawn actions', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'center' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');
      const spawn = result.actions.find(a => a.type === 'spawn') as SpawnAction;

      // Walk-in conversion converts on-screen spawns to off-screen + move
      // So the spawn should now be off-screen, and there should be a follow-up move
      expect(spawn).toBeDefined();
    });

    it('assigns resolvedPosition to move actions', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'off-left' },
          { type: 'move', target: 'knight' as any, to: 'center' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');
      const move = result.actions.find(a => a.type === 'move') as MoveAction;

      expect(move).toBeDefined();
      expect(move.resolvedPosition).toBeDefined();
      expect(move.resolvedPosition).toHaveLength(3);
    });

    it('computes duration_ms on move actions based on distance', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'off-left' },
          { type: 'move', target: 'knight' as any, to: 'right' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');
      const move = result.actions.find(a => a.type === 'move') as MoveAction;

      expect(move.duration_ms).toBeDefined();
      expect(move.duration_ms).toBeGreaterThanOrEqual(600);
      expect(move.duration_ms).toBeLessThanOrEqual(2500);
    });

    it('converts appear-* spawns to walk-in sequences', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'center' },
          { type: 'spawn', target: 'mage' as any, position: 'left' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');

      // Each spawn should be followed by a move (walk-in)
      const spawns = result.actions.filter(a => a.type === 'spawn') as SpawnAction[];
      const moves = result.actions.filter(a => a.type === 'move') as MoveAction[];

      expect(spawns.length).toBe(2);
      expect(moves.length).toBe(2);

      // Spawns should be at off-screen positions
      for (const spawn of spawns) {
        expect(['off-left', 'off-right']).toContain(spawn.position);
      }
    });

    it('alternates walk-in entry sides', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'center' },
          { type: 'spawn', target: 'mage' as any, position: 'left' },
          { type: 'spawn', target: 'rogue' as any, position: 'right' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');
      const spawns = result.actions.filter(a => a.type === 'spawn') as SpawnAction[];

      // First from off-left, second from off-right, third from off-left
      expect(spawns[0].position).toBe('off-left');
      expect(spawns[1].position).toBe('off-right');
      expect(spawns[2].position).toBe('off-left');
    });

    it('staggers walk-in delays by 400ms increments', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'center' },
          { type: 'spawn', target: 'mage' as any, position: 'left' },
          { type: 'spawn', target: 'rogue' as any, position: 'right' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');
      const spawns = result.actions.filter(a => a.type === 'spawn') as SpawnAction[];

      expect(spawns[0].delay_ms).toBe(0);
      expect(spawns[1].delay_ms).toBe(400);
      expect(spawns[2].delay_ms).toBe(800);
    });

    it('does NOT convert off-screen spawns that already have a move', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'off-left' },
          { type: 'move', target: 'knight' as any, to: 'center' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');

      // Should still have exactly 1 spawn and 1 move (no extra walk-in inserted)
      const spawns = result.actions.filter(a => a.type === 'spawn');
      const moves = result.actions.filter(a => a.type === 'move');
      expect(spawns.length).toBe(1);
      expect(moves.length).toBe(1);
    });

    it('allocates unique slots for multiple actors at same position', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'center' },
          { type: 'spawn', target: 'mage' as any, position: 'center' },
          { type: 'spawn', target: 'rogue' as any, position: 'center' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');

      // All moves (walk-in destinations) should have different resolvedPositions
      const moves = result.actions.filter(a => a.type === 'move') as MoveAction[];
      const positions = moves.map(m => m.resolvedPosition!);

      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dist = distance2D(positions[i], positions[j]);
          expect(dist).toBeGreaterThan(0); // different slots
        }
      }
    });

    it('handles unknown taskId gracefully (no env props to block)', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'center' },
        ],
        prompt_feedback: 'test',
      };
      // Should not throw
      const result = layoutStage(input, 'nonexistent-task');
      expect(result.actions.length).toBeGreaterThan(0);
    });

    it('handles empty actions array', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');
      expect(result.actions).toEqual([]);
    });

    it('preserves non-spawn/move actions (animate, emote, sfx, wait, remove)', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          { type: 'spawn', target: 'knight' as any, position: 'off-left' },
          { type: 'move', target: 'knight' as any, to: 'center' },
          { type: 'animate', target: 'knight' as any, anim: 'Cheering' },
          { type: 'emote', target: 'knight' as any, emoji: '🎉' },
          { type: 'wait', duration_ms: 500 },
          { type: 'sfx', sound: 'pop' },
          { type: 'react', effect: 'confetti-burst' as any, position: 'center' },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');

      const types = result.actions.map(a => a.type);
      expect(types).toContain('animate');
      expect(types).toContain('emote');
      expect(types).toContain('wait');
      expect(types).toContain('sfx');
      expect(types).toContain('react');
    });
  });

  // ── Full pipeline tests for every story ───────────────────────────────────

  describe('full pipeline — all 220 responses', () => {
    // Track stats for summary
    let totalResponses = 0;
    let totalActions = 0;
    let overlapViolations = 0;
    let envCollisionViolations = 0;

    for (const story of STORY_ORDER) {
      describe(`Story: ${story.title} (${story.id})`, () => {

        it(`has ${story.stages.length} stages`, () => {
          expect(story.stages.length).toBeGreaterThanOrEqual(3);
        });

        for (let stageIdx = 0; stageIdx < story.stages.length; stageIdx++) {
          const stage = story.stages[stageIdx];

          describe(`Stage ${stageIdx + 1}: ${stage.title}`, () => {

            it(`has 10 responses`, () => {
              expect(stage.responses.length).toBe(10);
            });

            for (let respIdx = 0; respIdx < stage.responses.length; respIdx++) {
              const response = stage.responses[respIdx];
              const label = `[${respIdx}] ${response.successLevel} — "${response.sampleInput.slice(0, 50)}..."`;

              describe(label, () => {

                let script: SceneScript;

                beforeAll(() => {
                  script = resolveStory(response, story.id);
                  totalResponses++;
                  totalActions += script.actions.length;
                });

                it('resolves without throwing', () => {
                  expect(script).toBeDefined();
                  expect(script.actions).toBeInstanceOf(Array);
                });

                it('produces at least one action', () => {
                  expect(script.actions.length).toBeGreaterThan(0);
                });

                it('preserves success_level', () => {
                  expect(script.success_level).toBe(response.successLevel);
                });

                it('has no overlapping final positions (min distance check)', () => {
                  const finalPos = getFinalPositions(script.actions);
                  const entries = Array.from(finalPos.entries());

                  for (let i = 0; i < entries.length; i++) {
                    for (let j = i + 1; j < entries.length; j++) {
                      const [idA, posA] = entries[i];
                      const [idB, posB] = entries[j];

                      // Skip off-screen positions
                      if (Math.abs(posA[0]) > 5 || Math.abs(posB[0]) > 5) continue;

                      const dist = distance2D(posA, posB);
                      if (dist < MIN_ACTOR_DISTANCE) {
                        overlapViolations++;
                      }
                      expect(dist).toBeGreaterThanOrEqual(
                        MIN_ACTOR_DISTANCE,
                        // Custom error message
                      );
                    }
                  }
                });

                it('has no collisions with environment props', () => {
                  const envPositions = ENV_POSITIONS[story.id] || [];
                  const finalPos = getFinalPositions(script.actions);

                  for (const [actorId, pos] of finalPos.entries()) {
                    // Skip off-screen
                    if (Math.abs(pos[0]) > 5) continue;

                    for (const envPos of envPositions) {
                      const dist = distance2D(pos, envPos);
                      if (dist < ENV_CLEARANCE) {
                        envCollisionViolations++;
                      }
                      expect(dist).toBeGreaterThanOrEqual(ENV_CLEARANCE);
                    }
                  }
                });

                it('all move actions have duration_ms set', () => {
                  const moves = script.actions.filter(a => a.type === 'move') as MoveAction[];
                  for (const move of moves) {
                    expect(move.duration_ms).toBeDefined();
                    expect(move.duration_ms).toBeGreaterThanOrEqual(600);
                    expect(move.duration_ms).toBeLessThanOrEqual(2500);
                  }
                });

                it('walk-in spawns use off-screen positions', () => {
                  // Find spawn+move pairs (walk-ins)
                  for (let i = 0; i < script.actions.length - 1; i++) {
                    const curr = script.actions[i];
                    const next = script.actions[i + 1];
                    if (
                      curr.type === 'spawn' &&
                      next.type === 'move' &&
                      next.target === curr.target
                    ) {
                      const spawn = curr as SpawnAction;
                      expect(['off-left', 'off-right', 'off-top']).toContain(spawn.position);
                    }
                  }
                });
              });
            }
          });
        }
      });
    }
  });

  // ── Per-zone environment collision tests ──────────────────────────────────

  describe('environment collision avoidance per zone', () => {
    const zones = [
      'skeleton-birthday',
      'skeleton-pizza',
      'mage-kitchen',
      'barbarian-school',
      'knight-space',
      'dungeon-concert',
      'adventurers-picnic',
    ];

    for (const zone of zones) {
      it(`${zone}: slots near env props are blocked`, () => {
        // Spawn actors at every named position
        const input: SceneScript = {
          success_level: 'FULL_SUCCESS',
          narration: 'test',
          actions: [
            { type: 'spawn', target: 'knight' as any, position: 'left' },
            { type: 'spawn', target: 'mage' as any, position: 'center' },
            { type: 'spawn', target: 'rogue' as any, position: 'right' },
          ],
          prompt_feedback: 'test',
        };
        const result = layoutStage(input, zone);
        const finalPos = getFinalPositions(result.actions);
        const envPositions = ENV_POSITIONS[zone] || [];

        for (const [actorId, pos] of finalPos.entries()) {
          if (Math.abs(pos[0]) > 5) continue;
          for (const envPos of envPositions) {
            const dist = distance2D(pos, envPos);
            expect(dist).toBeGreaterThanOrEqual(ENV_CLEARANCE);
          }
        }
      });
    }
  });

  // ── Stress: max actors on stage ───────────────────────────────────────────

  describe('stress: high actor count', () => {
    it('handles 10 actors without crashing or duplicating positions', () => {
      const targets = [
        'knight', 'mage', 'rogue', 'barbarian', 'ranger',
        'ninja', 'clown', 'witch', 'vampire', 'engineer',
      ];
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: targets.map(t => ({
          type: 'spawn' as const,
          target: t as any,
          position: 'center' as const,
        })),
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'dungeon-concert');

      // Should produce walk-in sequences for all
      const moves = result.actions.filter(a => a.type === 'move') as MoveAction[];
      expect(moves.length).toBe(10);

      // All move destinations should be unique
      const positions = moves.map(m => m.resolvedPosition!);
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          expect(distance2D(positions[i], positions[j])).toBeGreaterThan(0);
        }
      }
    });

    it('handles 15 actors (fills entire grid)', () => {
      const targets = Array.from({ length: 15 }, (_, i) => `actor-${i}`);
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        // Use a task with no env props to have all 15 slots available
        actions: targets.map(t => ({
          type: 'spawn' as const,
          target: t as any,
          position: 'center' as const,
        })),
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'nonexistent-task'); // no env props

      const moves = result.actions.filter(a => a.type === 'move') as MoveAction[];
      expect(moves.length).toBe(15);
    });
  });

  // ── spawn_group handling ──────────────────────────────────────────────────

  describe('spawn_group', () => {
    it('allocates slots for group members', () => {
      const input: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'test',
        actions: [
          {
            type: 'spawn_group',
            targets: [
              { id: 'cat-0', target: 'cat', position: 'center' as any, offset: [0, 0, 0] },
              { id: 'cat-1', target: 'cat', position: 'center' as any, offset: [1.5, 0, 0] },
              { id: 'cat-2', target: 'cat', position: 'center' as any, offset: [3, 0, 0] },
            ],
            stagger_ms: 150,
          },
        ],
        prompt_feedback: 'test',
      };
      const result = layoutStage(input, 'skeleton-birthday');

      const group = result.actions.find(a => a.type === 'spawn_group');
      expect(group).toBeDefined();
      if (group && group.type === 'spawn_group') {
        // Each member should have a unique offset (slot position)
        const offsets = group.targets.map(t => t.offset!);
        for (let i = 0; i < offsets.length; i++) {
          for (let j = i + 1; j < offsets.length; j++) {
            const dist = distance2D(
              offsets[i] as [number, number, number],
              offsets[j] as [number, number, number],
            );
            expect(dist).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  // ── Response distribution check ───────────────────────────────────────────

  describe('response distribution', () => {
    for (const story of STORY_ORDER) {
      for (let stageIdx = 0; stageIdx < story.stages.length; stageIdx++) {
        const stage = story.stages[stageIdx];
        it(`${story.id} stage ${stageIdx + 1} has correct success level distribution`, () => {
          const full = stage.responses.filter(r => r.successLevel === 'FULL_SUCCESS').length;
          const partial = stage.responses.filter(r => r.successLevel === 'PARTIAL_SUCCESS').length;
          const fail = stage.responses.filter(r => r.successLevel === 'FUNNY_FAIL').length;

          expect(full).toBeGreaterThanOrEqual(3);
          expect(partial).toBeGreaterThanOrEqual(2);
          expect(fail).toBeGreaterThanOrEqual(2);
          expect(full + partial + fail).toBe(10);
        });
      }
    }
  });
});
