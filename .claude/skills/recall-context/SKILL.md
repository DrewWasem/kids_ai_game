---
name: recall-context
description: Use this before writing ANY game code, system prompt, scene script, or
  Phaser scene. Reads the vocabulary contract and relevant reference docs to ensure
  only valid assets are referenced. Prevents hallucinating actor names, animations,
  props, or effects that don't exist.
---

# Recall Context Skill

Before generating any scene script, system prompt, Phaser scene, or game configuration:

## Required Steps

1. **Read the vocabulary contract** — Check `docs/vocabulary-contract.md` (or the vocabulary
   section of the system prompt if the contract doc doesn't exist yet). This is the single
   source of truth for every asset in the game.

2. **Verify actors** — Only reference actors that exist in the asset library (`public/assets/actors/`).
   If unsure, check what files actually exist on disk.

3. **Verify props** — Only reference props in `public/assets/props/`. Don't invent prop names.

4. **Verify animations** — Only reference animation names that are defined for each actor.
   If using static images + tweens (no sprite atlas), the available "animations" are:
   tween-based movements (move, scale, rotate, fade) not named sprite animations.

5. **Verify effects** — Only reference Lottie reaction effects that exist in `public/assets/reactions/`.

6. **Verify positions** — Use only: left, center, right, top, bottom, off-left, off-right, off-top.

7. **Verify move styles** — Use only: linear, arc, bounce, float, shake, spin-in, drop-in.

## Rules

- **NEVER invent an asset name** — if it's not in the vocabulary contract or on disk, don't use it
- **Scene scripts max 6 actions**
- **Narration under 25 words**
- **FUNNY_FAIL must be silly, never mean or scary**
- When in doubt, use fewer assets rather than guessing at names that might not exist
