/**
 * Stage Layout Engine — transforms SceneScript actions to use non-overlapping
 * 3D positions, converts pop-in spawns to walk-ins, and syncs tween duration.
 *
 * Pure function: no side effects, no network calls. Operates on the action array
 * after block resolution, before ScenePlayer3D consumes it.
 *
 * Slot grid: 5 columns × 3 depth rows = 15 non-overlapping positions.
 * Each slot has a 1.2u occupancy radius. Environment props block nearby slots.
 */

import type { SceneScript, Action, Position, SpawnAction, MoveAction } from '../types/scene-script';
import { TASK_ENVIRONMENTS } from '../game/ScenePlayer3D';

// ─── SLOT GRID ───────────────────────────────────────────────────────────────

interface Slot {
  name: string;
  x: number;
  z: number;
  occupied: boolean;
  blocked: boolean; // blocked by environment prop
}

const COLUMNS = [
  { name: 'far-left', x: -4.5 },
  { name: 'left', x: -2.0 },
  { name: 'center', x: 0 },
  { name: 'right', x: 2.0 },
  { name: 'far-right', x: 4.5 },
];

const ROWS = [
  { name: 'front', z: 1.5 },
  { name: 'mid', z: 0 },
  { name: 'back', z: -1.5 },
];

function createSlotGrid(): Slot[] {
  const slots: Slot[] = [];
  for (const row of ROWS) {
    for (const col of COLUMNS) {
      slots.push({
        name: `${col.name}-${row.name}`,
        x: col.x,
        z: row.z,
        occupied: false,
        blocked: false,
      });
    }
  }
  return slots;
}

// ─── OFF-SCREEN POSITIONS ────────────────────────────────────────────────────

const OFF_SCREEN_COORDS: Record<string, [number, number, number]> = {
  'off-left': [-6, 0, 0],
  'off-right': [6, 0, 0],
  'off-top': [0, 5, 0],
};

function isOffScreen(position: string): boolean {
  return position in OFF_SCREEN_COORDS;
}

// ─── POSITION PREFERENCE MAPPING ─────────────────────────────────────────────

/** Maps abstract Position names to ordered lists of preferred slot names */
const POSITION_PREFERENCES: Record<string, string[]> = {
  center: [
    'center-mid', 'center-front', 'center-back',
    'left-mid', 'right-mid',
    'left-front', 'right-front',
    'left-back', 'right-back',
    'far-left-mid', 'far-right-mid',
    'far-left-front', 'far-right-front',
    'far-left-back', 'far-right-back',
  ],
  left: [
    'left-mid', 'left-front', 'left-back',
    'far-left-mid', 'far-left-front', 'far-left-back',
    'center-mid', 'center-front', 'center-back',
    'right-mid', 'right-front', 'right-back',
    'far-right-mid', 'far-right-front', 'far-right-back',
  ],
  right: [
    'right-mid', 'right-front', 'right-back',
    'far-right-mid', 'far-right-front', 'far-right-back',
    'center-mid', 'center-front', 'center-back',
    'left-mid', 'left-front', 'left-back',
    'far-left-mid', 'far-left-front', 'far-left-back',
  ],
  top: [
    'center-back', 'left-back', 'right-back',
    'center-mid', 'left-mid', 'right-mid',
    'far-left-back', 'far-right-back',
  ],
  bottom: [
    'center-front', 'left-front', 'right-front',
    'center-mid', 'left-mid', 'right-mid',
    'far-left-front', 'far-right-front',
  ],
};

// ─── ENVIRONMENT COLLISION ───────────────────────────────────────────────────

const ENV_CLEARANCE = 2.0; // minimum distance from env props

function markBlockedSlots(slots: Slot[], taskId: string): void {
  const envProps = TASK_ENVIRONMENTS[taskId];
  if (!envProps) return;

  for (const slot of slots) {
    for (const prop of envProps) {
      const dx = slot.x - prop.position[0];
      const dz = slot.z - prop.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < ENV_CLEARANCE) {
        slot.blocked = true;
        break;
      }
    }
  }
}

// ─── SLOT ALLOCATION ─────────────────────────────────────────────────────────

function allocateSlot(
  slots: Slot[],
  position: Position,
): Slot | null {
  const prefs = POSITION_PREFERENCES[position] || POSITION_PREFERENCES['center'];

  for (const slotName of prefs) {
    const slot = slots.find(s => s.name === slotName);
    if (slot && !slot.occupied && !slot.blocked) {
      slot.occupied = true;
      return slot;
    }
  }

  // Absolute fallback: any unoccupied, unblocked slot
  const fallback = slots.find(s => !s.occupied && !s.blocked);
  if (fallback) {
    fallback.occupied = true;
    return fallback;
  }

  return null;
}

// ─── DISTANCE / DURATION HELPERS ─────────────────────────────────────────────

function computeDuration(fromPos: [number, number, number], toPos: [number, number, number]): number {
  const dx = toPos[0] - fromPos[0];
  const dz = toPos[2] - fromPos[2];
  const distance = Math.sqrt(dx * dx + dz * dz);
  return Math.round(Math.min(Math.max(distance / 4.0 * 1000, 600), 2500));
}

// ─── WALK-IN CONVERSION ──────────────────────────────────────────────────────

/**
 * Converts appear-* spawns (pop-in) to walk-in sequences:
 * - Spawn at off-screen position
 * - Move to the allocated on-screen slot
 * - Stagger entries by 400ms
 * - Compute distance-based duration for each walk-in
 */
function convertAppearsToWalks(actions: Action[]): Action[] {
  const result: Action[] = [];
  let walkInCount = 0;

  // Build a set of targets that already have a move action following their spawn
  const targetsWithMove = new Set<string>();
  for (let i = 0; i < actions.length - 1; i++) {
    const curr = actions[i];
    const next = actions[i + 1];
    if (curr.type === 'spawn' && next.type === 'move' && next.target === curr.target) {
      targetsWithMove.add(curr.target);
    }
  }

  for (const action of actions) {
    if (action.type !== 'spawn') {
      result.push(action);
      continue;
    }

    const spawn = action as SpawnAction;
    const isOnScreen = ['left', 'center', 'right', 'top', 'bottom'].includes(spawn.position);
    const hasFollowingMove = targetsWithMove.has(spawn.target);

    // Only convert on-screen spawns without an existing move
    if (!isOnScreen || hasFollowingMove) {
      result.push(action);
      continue;
    }

    // Alternate entry side for visual variety
    const entrySide: Position = walkInCount % 2 === 0 ? 'off-left' : 'off-right';
    const entryCoords = OFF_SCREEN_COORDS[entrySide];
    const staggerDelay = walkInCount * 400;

    // Save the on-screen resolved position for the move target
    const targetPosition = spawn.resolvedPosition;

    // Replace spawn position with off-screen entry
    const entrySpawn: SpawnAction = {
      ...spawn,
      position: entrySide,
      resolvedPosition: entryCoords, // off-screen coordinates
      delay_ms: (spawn.delay_ms || 0) + staggerDelay,
    };
    result.push(entrySpawn);

    // Compute walk-in duration based on distance
    const duration = targetPosition
      ? computeDuration(entryCoords, targetPosition)
      : 1200; // fallback ~1.2s

    // Insert a move to the originally resolved position
    const walkIn: MoveAction = {
      type: 'move',
      target: spawn.target,
      to: spawn.position, // original position name for fallback
      style: 'linear',
      resolvedPosition: targetPosition, // on-screen slot coords
      duration_ms: duration,
    };
    result.push(walkIn);

    walkInCount++;
  }

  return result;
}

// ─── MAIN LAYOUT FUNCTION ────────────────────────────────────────────────────

/**
 * Transform a SceneScript's actions to use non-overlapping positions.
 *
 * 1. Creates 15-slot grid
 * 2. Blocks slots near environment props
 * 3. Allocates slots for each spawn/move action (skips off-screen positions)
 * 4. Converts appear-* pop-ins to walk-in sequences
 * 5. Returns modified SceneScript (original is not mutated)
 */
export function layoutStage(script: SceneScript, taskId: string): SceneScript {
  const slots = createSlotGrid();
  markBlockedSlots(slots, taskId);

  // Track which actor is at which slot for move start positions
  const actorSlots = new Map<string, Slot>();

  // Deep clone actions to avoid mutating the original
  const actions: Action[] = JSON.parse(JSON.stringify(script.actions));

  for (const action of actions) {
    switch (action.type) {
      case 'spawn': {
        // Skip slot allocation for off-screen spawns — they'll move to a slot later
        if (isOffScreen(action.position)) {
          break;
        }
        const slot = allocateSlot(slots, action.position);
        if (slot) {
          action.resolvedPosition = [slot.x, 0, slot.z];
          actorSlots.set(action.target, slot);
        }
        break;
      }

      case 'move': {
        const slot = allocateSlot(slots, action.to);
        if (slot) {
          // Free the previous slot
          const prevSlot = actorSlots.get(action.target);
          if (prevSlot) prevSlot.occupied = false;

          action.resolvedPosition = [slot.x, 0, slot.z];
          actorSlots.set(action.target, slot);

          // Compute distance-based duration
          if (!action.duration_ms) {
            const prevPos: [number, number, number] = prevSlot
              ? [prevSlot.x, 0, prevSlot.z]
              : [0, 0, 0];
            action.duration_ms = computeDuration(prevPos, [slot.x, 0, slot.z]);
          }
        } else if (!action.duration_ms) {
          // Grid full — set fallback duration
          action.duration_ms = 800;
        }
        break;
      }

      case 'spawn_group': {
        // Allocate adjacent slots for group members
        for (const member of action.targets) {
          const slot = allocateSlot(slots, member.position);
          if (slot) {
            // Override offset with slot-relative positioning
            member.offset = [slot.x, 0, slot.z];
            // Set position to center so offset is applied from origin
            member.position = 'center' as Position;
            actorSlots.set(member.id, slot);
          }
        }
        break;
      }

      case 'react': {
        if ('position' in action) {
          // Place react effect near an available slot
          const slot = slots.find(s => !s.blocked && s.name.includes('center'));
          if (slot) {
            action.resolvedPosition = [slot.x, 0, slot.z];
          }
        }
        break;
      }
    }
  }

  // Convert pop-in spawns to walk-in sequences
  const finalActions = convertAppearsToWalks(actions);

  return {
    ...script,
    actions: finalActions,
  };
}
