/**
 * collision-map.ts — Circle-circle collision for the village world.
 *
 * ~80 static circle colliders covering buildings, trees, props, cliffs, and landmarks.
 * Player radius 0.5. Each frame: test candidate position against all colliders,
 * push out along center-to-center normal if overlapping. Produces natural slide
 * behavior — tangential movement preserved, radial component cancelled.
 *
 * No physics engine. Pure math. ~0.001ms per frame.
 */

export interface CircleCollider {
  x: number
  z: number
  radius: number
  label?: string
}

export const PLAYER_RADIUS = 0.5

/**
 * Resolve player position against all circle colliders.
 * Iterates multiple passes to handle multi-collider corners cleanly.
 */
export function resolveCollisions(
  candidateX: number,
  candidateZ: number,
  colliders: readonly CircleCollider[],
  playerRadius: number = PLAYER_RADIUS,
): { x: number; z: number } {
  let px = candidateX
  let pz = candidateZ

  // Two passes handles corner cases where pushing out of one collider pushes into another
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i]
      const dx = px - c.x
      const dz = pz - c.z
      const distSq = dx * dx + dz * dz
      const minDist = c.radius + playerRadius

      if (distSq < minDist * minDist && distSq > 0.0001) {
        const dist = Math.sqrt(distSq)
        const overlap = minDist - dist
        // Push player out along center-to-center normal
        const nx = dx / dist
        const nz = dz / dist
        px += nx * overlap
        pz += nz * overlap
      }
    }
  }

  return { x: px, z: pz }
}

// ============================================================================
// COLLIDER CATALOG — All positions from VillageWorld.tsx
// ============================================================================

// --- Village Center Buildings (lines 281-318) ---
const VILLAGE_BUILDINGS: CircleCollider[] = [
  { x: 18, z: -5, radius: 5.0, label: 'townhall' },
  { x: -18, z: -7, radius: 4.5, label: 'tavern' },
  { x: 14, z: 9, radius: 4.0, label: 'market' },
  { x: -8, z: 2, radius: 2.5, label: 'well' },
  { x: -24, z: 7, radius: 4.5, label: 'blacksmith' },
  { x: 24, z: -12, radius: 3.5, label: 'home-A' },
  { x: -15, z: -14, radius: 3.5, label: 'home-B' },
  { x: -28, z: 14, radius: 3.0, label: 'home-A-small' },
  { x: 28, z: 12, radius: 3.0, label: 'home-B-small' },
  { x: 28, z: 2, radius: 4.5, label: 'church' },
  { x: -30, z: 0, radius: 4.0, label: 'windmill' },
  { x: 10, z: -12, radius: 4.0, label: 'stables' },
  { x: 32, z: -8, radius: 3.0, label: 'watchtower' },
  { x: -6, z: -10, radius: 3.5, label: 'stage' },
]

// --- Village Props (lines 321-327) ---
const VILLAGE_PROPS: CircleCollider[] = [
  { x: -12, z: -2, radius: 1.5, label: 'barrel' },
  { x: 8, z: 2, radius: 1.8, label: 'crate' },
  { x: -12, z: 12, radius: 1.8, label: 'haybale' },
  { x: 6, z: -7, radius: 1.5, label: 'wheelbarrow' },
  { x: -9, z: 7, radius: 1.2, label: 'sack' },
  { x: 6, z: 6, radius: 1.5, label: 'trough' },
]

// --- Village Trees (lines 331-335) ---
const VILLAGE_TREES: CircleCollider[] = [
  { x: -32, z: -2, radius: 2.0, label: 'tree-left' },
  { x: 32, z: -2, radius: 2.0, label: 'tree-right' },
  { x: -30, z: 12, radius: 2.5, label: 'trees-left' },
  { x: 30, z: -10, radius: 2.5, label: 'trees-right' },
  { x: 20, z: 15, radius: 2.0, label: 'tree-se' },
]

// --- Zone Landmarks (lines 988-1000) ---
const ZONE_LANDMARKS: CircleCollider[] = [
  { x: -10, z: -60, radius: 5.5, label: 'castle-red' },
  { x: 31, z: -30, radius: 3.5, label: 'tower-blue' },
  { x: 41, z: -4, radius: 3.5, label: 'tower-red' },
  { x: 31, z: 30, radius: 3.5, label: 'shrine-yellow' },
  { x: 8, z: 40, radius: 3.5, label: 'watchtower-green' },
  { x: -31, z: 30, radius: 3.5, label: 'tower-yellow' },
  { x: -41, z: -4, radius: 3.5, label: 'tower-green' },
]

// --- Strategic Hills (lines 1059-1063) ---
const STRATEGIC_HILLS: CircleCollider[] = [
  { x: 15, z: -12, radius: 3.5, label: 'hill-1' },
  { x: -15, z: 15, radius: 3.5, label: 'hill-2' },
  { x: 20, z: 12, radius: 3.0, label: 'hill-3' },
  { x: -12, z: -20, radius: 3.0, label: 'hill-4' },
  { x: 8, z: 22, radius: 2.5, label: 'hill-5' },
]

// --- Road Props (lines 943-950) ---
const ROAD_PROPS: CircleCollider[] = [
  { x: -5, z: 18, radius: 1.2, label: 'road-crate' },
  { x: 5, z: -8, radius: 1.8, label: 'road-haybale' },
  { x: -5, z: 8, radius: 1.5, label: 'road-trough' },
  { x: -4, z: -12, radius: 1.5, label: 'road-barrel' },
  { x: -8, z: 18, radius: 2.0, label: 'road-tree-left' },
  { x: 8, z: 22, radius: 2.0, label: 'road-tree-right' },
]

// --- Zone Approach Props (lines 1106-1127) ---
const ZONE_APPROACH: CircleCollider[] = [
  { x: 20, z: -20, radius: 1.8, label: 'approach-crate' },
  { x: 24, z: -18, radius: 1.5, label: 'approach-target' },
  { x: 28, z: -6, radius: 1.8, label: 'approach-haybale' },
  { x: 20, z: 20, radius: 1.5, label: 'approach-barrel' },
  { x: -20, z: 20, radius: 1.5, label: 'approach-weaponrack' },
  { x: -24, z: 22, radius: 2.5, label: 'approach-tent' },
]

// --- Pond (lines 1072-1094) — two semicircles leaving bridge gap ---
const POND: CircleCollider[] = [
  { x: 12, z: 15.5, radius: 2.5, label: 'pond-north' },
  { x: 12, z: 20.5, radius: 2.5, label: 'pond-south' },
]

// --- Dungeon Approach Cliffs (lines 571-592) ---
const DUNGEON_APPROACH: CircleCollider[] = [
  // Left side
  { x: -8, z: -27, radius: 3.0, label: 'cliff-L1' },
  { x: -10, z: -30, radius: 3.0, label: 'cliff-L2' },
  { x: -11, z: -34, radius: 3.0, label: 'cliff-L3' },
  { x: -9, z: -37, radius: 3.5, label: 'cliff-L4' },
  { x: -12, z: -40, radius: 3.5, label: 'cliff-L5' },
  { x: -13, z: -43, radius: 3.5, label: 'cliff-L6' },
  { x: -16, z: -46, radius: 3.5, label: 'cliff-L7' },
  // Right side (mirrors)
  { x: 8, z: -27, radius: 3.0, label: 'cliff-R1' },
  { x: 10, z: -30, radius: 3.0, label: 'cliff-R2' },
  { x: 11, z: -34, radius: 3.0, label: 'cliff-R3' },
  { x: 9, z: -37, radius: 3.5, label: 'cliff-R4' },
  { x: 12, z: -40, radius: 3.5, label: 'cliff-R5' },
  { x: 13, z: -43, radius: 3.5, label: 'cliff-R6' },
  { x: 16, z: -46, radius: 3.5, label: 'cliff-R7' },
  // Entrance narrows
  { x: -12, z: -45, radius: 4.0, label: 'cliff-entrance-L' },
  { x: 12, z: -45, radius: 4.0, label: 'cliff-entrance-R' },
]

// --- Dungeon Bowl Walls (lines 547-568) ---
const DUNGEON_BOWL: CircleCollider[] = [
  // Back wall
  { x: 0, z: -72, radius: 8.0, label: 'bowl-back-center' },
  { x: -18, z: -70, radius: 6.0, label: 'bowl-back-left' },
  { x: 18, z: -70, radius: 6.0, label: 'bowl-back-right' },
  // Left wall
  { x: -25, z: -64, radius: 6.0, label: 'bowl-left-1' },
  { x: -28, z: -58, radius: 5.0, label: 'bowl-left-2' },
  { x: -26, z: -52, radius: 5.0, label: 'bowl-left-3' },
  { x: -22, z: -49, radius: 4.0, label: 'bowl-left-4' },
  // Right wall (mirrors)
  { x: 25, z: -64, radius: 6.0, label: 'bowl-right-1' },
  { x: 28, z: -58, radius: 5.0, label: 'bowl-right-2' },
  { x: 26, z: -52, radius: 5.0, label: 'bowl-right-3' },
  { x: 22, z: -49, radius: 4.0, label: 'bowl-right-4' },
]

// ============================================================================
// COMBINED COLLIDER LIST
// ============================================================================

export const VILLAGE_COLLIDERS: readonly CircleCollider[] = [
  ...VILLAGE_BUILDINGS,
  ...VILLAGE_PROPS,
  ...VILLAGE_TREES,
  ...ZONE_LANDMARKS,
  ...STRATEGIC_HILLS,
  ...ROAD_PROPS,
  ...ZONE_APPROACH,
  ...POND,
  ...DUNGEON_APPROACH,
  ...DUNGEON_BOWL,
]
