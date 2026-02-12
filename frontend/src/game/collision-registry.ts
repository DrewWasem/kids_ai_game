/**
 * Collision Registry — Auto-measured bounding boxes from GLTF models.
 *
 * Each Piece component registers its world-space XZ footprint on mount.
 * The player collision system checks against these boxes.
 * Debug mode (press .) renders them as ground rectangles.
 */

export interface CollisionBox {
  cx: number      // world center X
  cz: number      // world center Z
  halfW: number   // half-width (X extent / 2)
  halfD: number   // half-depth (Z extent / 2)
  minY: number    // bottom Y (for ground detection)
  maxY: number    // top Y (for height reference)
}

// Global registry — populated by Piece components on mount
const boxes: CollisionBox[] = []
let generation = 0 // increments when registry changes

export function registerCollision(box: CollisionBox) {
  boxes.push(box)
  generation++
}

export function unregisterCollision(box: CollisionBox) {
  const idx = boxes.indexOf(box)
  if (idx >= 0) {
    boxes.splice(idx, 1)
    generation++
  }
}

export function getCollisionBoxes(): readonly CollisionBox[] {
  return boxes
}

export function getGeneration(): number {
  return generation
}

/** Check if a world position collides with any registered box (AABB check) */
export function collidesWithAny(x: number, z: number, playerRadius: number): boolean {
  for (const box of boxes) {
    // Expand box by player radius for Minkowski sum collision
    if (
      x >= box.cx - box.halfW - playerRadius &&
      x <= box.cx + box.halfW + playerRadius &&
      z >= box.cz - box.halfD - playerRadius &&
      z <= box.cz + box.halfD + playerRadius
    ) {
      return true
    }
  }
  return false
}
