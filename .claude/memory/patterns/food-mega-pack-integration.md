# FoodMegaPack Integration Pattern

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** props, food, scale, scene-player, assets, collision-resolution

## Summary

Pattern for integrating large 3D asset packs into ScenePlayer3D's PROP_PATHS when prop names collide with existing entries. Uses suffix-based collision resolution and category-specific scale defaults.

## Details

### Problem

FoodMegaPack contains 173 GLB food models with names that often collide with existing PROP_PATHS entries from other asset packs (e.g., `apple`, `banana`, `carrot`, `cake`, `knife`). Need to add all models while preserving existing references.

### Solution

**1. Collision detection:**
- Identify all prop names that already exist in PROP_PATHS
- Apply pack-specific suffix to colliding names only
- Use original names for non-colliding entries

**2. Suffix pattern:**
- Suffix format: `{name}_fmp` (FoodMegaPack)
- Examples: `apple_fmp`, `banana_fmp`, `carrot_fmp`
- Non-colliding: `mango`, `melon`, `grapefruit` (no suffix needed)

**3. Scale defaults by category:**
- Fruits: 3.0
- Vegetables: 3.0
- Bread/Cheese/Meat: 2.5
- Fish: 2.0
- Cutlery: 3.0
- Jars: 2.5

### Implementation Example

```typescript
// PROP_PATHS in ScenePlayer3D.tsx

// Colliding names (suffix added)
apple_fmp: 'food-mega-pack/Apple/Apple_01.gltf',
banana_fmp: 'food-mega-pack/Banana/Banana_01.gltf',
carrot_fmp: 'food-mega-pack/Carrot/Carrot_01.gltf',
cake_fmp: 'food-mega-pack/Cake/Cake_01.gltf',
knife_fmp: 'food-mega-pack/Knife/Knife_01.gltf',

// Non-colliding names (no suffix)
mango: 'food-mega-pack/Mango/Mango_01.gltf',
melon: 'food-mega-pack/Melon/Melon_01.gltf',
grapefruit: 'food-mega-pack/Grapefruit/Grapefruit_01.gltf',
cucumber: 'food-mega-pack/Cucumber/Cucumber_01.gltf',
halibut: 'food-mega-pack/Halibut/Halibut_01.gltf',

// PROP_SCALE matching entries
const PROP_SCALE: Record<string, number> = {
  // Fruits
  apple_fmp: 3.0,
  banana_fmp: 3.0,
  mango: 3.0,
  melon: 3.0,

  // Vegetables
  carrot_fmp: 3.0,
  cucumber: 3.0,

  // Bread/Cheese/Meat
  bacon_fmp: 2.5,
  ham: 2.5,
  cheddar: 2.5,

  // Fish
  halibut: 2.0,
  salmon: 2.0,

  // Cutlery
  knife_fmp: 3.0,
  fork: 3.0,

  // Jars
  honey_jar: 2.5,
  jam_hex: 2.5,
};
```

### FoodMegaPack File Structure

**Path template:**
```
food-mega-pack/{Category}/{Item}/{Item}_01.glb
food-mega-pack/{Category}/{Item}/Texture.png
```

**Categories (14 total):**
1. Fruits/ — Apple, Banana, Grapefruit, Lemon, Mango, Melon, Orange, Pear, Pineapple
2. Vegetables/ — Bell Pepper, Broccoli, Cabbage, Carrot, Cauliflower, Chili Pepper, Cucumber, Garlic, Onion, Potato, Pumpkin, Spring Onion, Tomato, Turnip
3. Bread/ — Baguette, Croissant, Loaf, Sliced Bread
4. Cheese/ — Cheddar, Hole Cheese, White Cheese, Yellow Cheese
5. Meat/ — Bacon, Ham, Sausage
6. Fish/ — Halibut, Salmon
7. Dessert/ — Cake, Jelly
8. Drinks/ — Bottle, Can, Carton
9. Cutlery/ — Fork, Knife, Spoon Big, Spoon Small
10. Utensils/ — Big Spoon, Kitchen Knife, Ladle, Spatula
11. Jars/ — Honey Jar, Jam Hex, Jam Round
12. Mushrooms/ — Bell Mushroom

**Slice variants:**
Most items have `{Item}_slice_01.gltf` variants for cut/sliced versions (e.g., `Apple_slice_01.gltf`, `Banana_slice_01.gltf`). Add as separate PROP_PATHS entries with `_slice` suffix.

Example:
```typescript
apple_fmp: 'food-mega-pack/Apple/Apple_01.gltf',
apple_slice: 'food-mega-pack/Apple/Apple_slice_01.gltf',
banana_fmp: 'food-mega-pack/Banana/Banana_01.gltf',
banana_slice: 'food-mega-pack/Banana/Banana_slice_01.gltf',
```

### Collision Resolution Rules

**When to add suffix:**
1. Run grep search for existing prop name in PROP_PATHS
2. If exact match found → add pack suffix (`_fmp`)
3. If no match → use original name

**Suffix selection:**
- Pack-specific acronym (short, memorable)
- `_fmp` = FoodMegaPack
- `_kk` = KayKit (existing pattern in codebase)
- `_tt` = Tiny Treats
- `_qp` = Quaternius Props

**Backwards compatibility:**
- Existing prop names MUST remain unchanged
- Old scene scripts reference original names (e.g., `apple` → KayKit apple)
- New scene scripts can reference FoodMegaPack via `apple_fmp`

### Scale Calibration Process

1. **Reference unit:** Character height = 2.61 units (Rig_Medium from KayKit)
2. **Target size:** Food items should be hand-holdable or tabletop-sized
3. **Category defaults:**
   - Fruits/Veg: 3.0 (slightly oversized for visibility)
   - Bread/Cheese/Meat: 2.5 (realistic handheld)
   - Fish: 2.0 (full fish models are large)
   - Cutlery: 3.0 (match character scale)
   - Jars: 2.5 (kitchen countertop size)
4. **Override when needed:** Specific items can have custom scales in PROP_SCALE if defaults don't work

### Bundle Size Impact

**Before FoodMegaPack:** 1,295 kB JS (~347 kB gzipped)
**After FoodMegaPack:** 2,052 kB JS (~468 kB gzipped)
**Delta:** +757 kB (+121 kB gzipped)

**Cause:** 91 new PROP_PATHS string entries with full file paths

**Mitigation (if needed):**
- Lazy-load food props only when food-related tasks are active
- Use shortened path aliases (e.g., `fmp/` prefix instead of full `food-mega-pack/`)
- Tree-shake unused props in production build

### Testing Checklist

- [ ] Build passes with 0 TS errors
- [ ] Existing scene scripts still work (no broken prop references)
- [ ] New food props spawn at correct scale
- [ ] Slice variants spawn correctly
- [ ] No duplicate PROP_PATHS keys
- [ ] PROP_SCALE has matching entries for all new props

## Related

- `.claude/memory/sessions/2026-02-14-emoji-food-integration.md` — Deployment session
- `.claude/memory/context/asset-gap-analysis.md` — Originally recommended Kenney Food Kit (200 models)
- `frontend/src/game/ScenePlayer3D.tsx` — PROP_PATHS and PROP_SCALE definitions
- `frontend/public/assets/3d/food-mega-pack/` — Asset source directory
