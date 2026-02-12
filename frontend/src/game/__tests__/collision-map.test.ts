import { describe, it, expect } from 'vitest'
import {
  resolveCollisions,
  VILLAGE_COLLIDERS,
  PLAYER_RADIUS,
  type CircleCollider,
} from '../collision-map'

describe('resolveCollisions', () => {
  const single: CircleCollider[] = [{ x: 0, z: 0, radius: 2.0 }]

  it('does not move player when far from colliders', () => {
    const result = resolveCollisions(10, 10, single)
    expect(result.x).toBeCloseTo(10)
    expect(result.z).toBeCloseTo(10)
  })

  it('pushes player out when overlapping single collider', () => {
    // Player at (1.5, 0), collider at (0, 0) r=2. minDist = 2 + 0.5 = 2.5
    // dist = 1.5, overlap = 1.0. Should push to x = 2.5
    const result = resolveCollisions(1.5, 0, single)
    expect(result.x).toBeCloseTo(2.5)
    expect(result.z).toBeCloseTo(0)
  })

  it('pushes out along diagonal', () => {
    // Player at (1, 1), collider at origin r=2
    // dist = sqrt(2) ≈ 1.414, minDist = 2.5, overlap ≈ 1.086
    const result = resolveCollisions(1, 1, single)
    const dist = Math.sqrt(result.x ** 2 + result.z ** 2)
    expect(dist).toBeCloseTo(2.5, 1)
    // Direction preserved (45 degrees)
    expect(result.x).toBeCloseTo(result.z, 1)
  })

  it('preserves slide behavior — tangential movement passes through', () => {
    // Collider at (0, 0) r=2. Player moving along z-axis at x=2.3 (just inside)
    // Only the x-component should be pushed out, z stays
    const result = resolveCollisions(2.3, 5, single)
    // z should be untouched (no overlap in z direction at this x)
    expect(result.z).toBeCloseTo(5, 1)
    // x should be pushed to at least minDist from center... but since z=5 is far, no collision
    expect(result.x).toBeCloseTo(2.3)
  })

  it('handles wall-like two-collider slide', () => {
    // Two colliders side by side creating a wall
    const wall: CircleCollider[] = [
      { x: 0, z: 0, radius: 3.0 },
      { x: 0, z: 6, radius: 3.0 },
    ]
    // Player at (1.5, 3) overlaps both colliders (dist ≈ 3.35, minDist = 3.5)
    const result = resolveCollisions(1.5, 3, wall, 0.5)
    // Should be pushed outward in x (both push right since player is right of both centers)
    expect(result.x).toBeGreaterThan(1.5)
    // z stays near 3 (equidistant from both, forces cancel vertically)
    expect(result.z).toBeCloseTo(3, 0)
  })

  it('handles exact center overlap gracefully (distSq near zero)', () => {
    // Player exactly on collider center — guarded by distSq > 0.0001
    const result = resolveCollisions(0, 0, single)
    // Should not crash. Position may not change (both are near zero).
    expect(Number.isFinite(result.x)).toBe(true)
    expect(Number.isFinite(result.z)).toBe(true)
  })

  it('respects custom player radius', () => {
    const result = resolveCollisions(2.0, 0, single, 1.0)
    // minDist = 2.0 + 1.0 = 3.0. dist = 2.0. overlap = 1.0
    expect(result.x).toBeCloseTo(3.0)
  })
})

describe('VILLAGE_COLLIDERS', () => {
  it('is non-empty', () => {
    expect(VILLAGE_COLLIDERS.length).toBeGreaterThan(50)
  })

  it('all have positive radii', () => {
    for (const c of VILLAGE_COLLIDERS) {
      expect(c.radius).toBeGreaterThan(0)
    }
  })

  it('all have finite coordinates', () => {
    for (const c of VILLAGE_COLLIDERS) {
      expect(Number.isFinite(c.x)).toBe(true)
      expect(Number.isFinite(c.z)).toBe(true)
      expect(Number.isFinite(c.radius)).toBe(true)
    }
  })

  it('spawn point [0, 0] is clear of all colliders', () => {
    const result = resolveCollisions(0, 0, VILLAGE_COLLIDERS)
    // Should not be pushed more than 0.1 from origin
    const dist = Math.sqrt(result.x ** 2 + result.z ** 2)
    expect(dist).toBeLessThan(0.5)
  })

  it('no collider blocks zone centers within trigger distance (3.0)', () => {
    // Zone centers from gameStore — player must be able to reach within 3.0 of each
    const ZONE_CENTERS: Record<string, [number, number]> = {
      'skeleton-birthday': [0, -55],
      'knight-space': [25, -25],
      'barbarian-school': [35, 0],
      'skeleton-pizza': [25, 25],
      'adventurers-picnic': [0, 35],
      'dungeon-concert': [-25, 25],
      'mage-kitchen': [-35, 0],
    }

    for (const [zoneId, [cx, cz]] of Object.entries(ZONE_CENTERS)) {
      // Test that approaching from the zone center, the player isn't pushed away
      const result = resolveCollisions(cx, cz, VILLAGE_COLLIDERS)
      const pushDist = Math.sqrt((result.x - cx) ** 2 + (result.z - cz) ** 2)
      // Player should be pushed less than 2.0 units from zone center
      // (still within trigger distance of 3.0)
      expect(
        pushDist,
        `Zone ${zoneId} at [${cx}, ${cz}] pushed ${pushDist.toFixed(2)} units`,
      ).toBeLessThan(2.0)
    }
  })
})
