# Vocabulary Contract — Source of Truth

**Created:** 2026-02-10
**Source:** docs/Prompt-Quest-Outrageous-Tasks-Asset-Library.html
**Confidence:** high
**Tags:** assets, vocabulary, scene-script

## Actors (sprite keys → animations)

- `monster`: idle, happy, sad, eat, dance, cry, sneeze-fire, confused, wave
- `dog`: idle, bark, float, fetch, wag, helmet-on, spin, sleep
- `trex`: idle, walk, stuck, blush, roar, sit-break, wave, pencil-try
- `octopus`: idle, play-drums, play-guitar, tangle, rock, wave, bow
- `robot`: idle, walk, trip, dance, deliver, short-circuit, fly, celebrate
- `wizard`: idle, cast, surprised, facepalm
- `kid`: idle, cheer, laugh, point, clap
- `fish`: idle, swim, cheer, cover-ears, crowd-surf
- `squirrel`: idle, steal, run, celebrate

## Props (static objects)

cake, cake-giant, cake-tiny, rocket, spacesuit, moon, flag, plates, soup-bowl, toaster, fridge, desk, pencil, chair, lunchbox, guitar, drums, keyboard, microphone, pizza, pizza-soggy, river, pillow-fort, bone, balloon, present, stars, fire-extinguisher

## Backdrops

party-room, space, wizard-kitchen, classroom, underwater-stage, city-street

## Positions

left, center, right, top, bottom, off-left, off-right, off-top

## Move Styles

linear, arc, bounce, float, shake, spin-in, drop-in

## Reactions (Lottie overlays)

confetti-burst, explosion-cartoon, hearts-float, stars-spin, question-marks, laugh-tears, fire-sneeze, splash, sparkle-magic, sad-cloud

## Action Types

spawn, move, animate, react, emote, sfx, wait, remove

## Scene Script JSON Format

```json
{
  "success_level": "FULL_SUCCESS | PARTIAL_SUCCESS | FUNNY_FAIL",
  "narration": "One fun sentence (under 25 words)",
  "actions": [
    { "type": "spawn", "target": "actor-or-prop", "position": "left" },
    { "type": "move", "target": "actor-or-prop", "to": "center", "style": "arc", "duration_ms": 800 },
    { "type": "animate", "target": "actor", "anim": "eat", "delay_ms": 500 },
    { "type": "react", "effect": "confetti-burst", "position": "center" },
    { "type": "emote", "target": "actor", "emoji": "😍", "text": "Yummy!" },
    { "type": "wait", "duration_ms": 1000 },
    { "type": "remove", "target": "actor-or-prop" }
  ],
  "missing_elements": [],
  "prompt_feedback": "Concrete game advice for the child"
}
```

## Rules

- Max 8 actions per script
- ONLY reference assets from lists above
- narration under 25 words, funny
- FUNNY_FAIL: silly and surprising, never mean or scary
