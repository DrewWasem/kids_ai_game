# Kids Game Design Research: Ages 8-10
## Comprehensive Design Guide for Prompt Quest

Research compiled: February 2026
Target: Kids ages 8-10 learning prompt engineering through play

---

## Table of Contents
1. [Visual Design](#1-visual-design)
2. [Interaction Design](#2-interaction-design)
3. [Sound Design](#3-sound-design)
4. [Emotional Design](#4-emotional-design)
5. [Educational Game Design](#5-educational-game-design)
6. [Accessibility](#6-accessibility)
7. [Industry Examples & References](#7-industry-examples--references)

---

## 1. Visual Design

### 1.1 Color Palette

**Age group note:** Kids aged 8-10 sit in the "older children" bracket (9-12 per NNG). They reject anything that feels "babyish" but are not ready for adult aesthetics. They respond to deeper, more complex color schemes than younger kids, but still need vibrant, saturated colors.

**Rules:**
- Use the **60-30-10 rule**: 60% dominant color, 30% secondary, 10% accent
- Limit palette to **3-5 core colors** plus neutrals
- Avoid "endless rainbow" chaos -- purposeful color selection is critical
- Use **darker accent colors** for text overlays to ensure readability
- Never rely on color alone to convey meaning (accessibility)

**Recommended Palette for Prompt Quest (Space/Magic/Adventure Theme):**

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary (Deep Purple) | Dark background | `#1a0533` | Canvas background (already in use) |
| Primary Light (Violet) | Interactive elements | `#6a4c93` | Buttons, active states |
| Secondary (Cyan) | Highlights, accents | `#38bdf8` | Success states, links, glowing elements |
| Accent (Yellow-Gold) | Rewards, stars | `#eab308` | Coins, stars, achievements |
| Accent (Green) | Success, positive | `#22c55e` | Correct answers, go states |
| Warm Accent (Orange) | Energy, calls-to-action | `#ff9f1c` | Primary CTA buttons |
| Neutral Light | Text on dark | `#f4f1de` | Body text, cream white |
| Neutral Dark | Text on light | `#293241` | Headings on light backgrounds |
| Error (Soft Red) | Gentle error state | `#ff595e` | Errors (used sparingly) |

**Alternative Vibrant "Classroom Brights" Palette:**
- Red: `#ff595e`
- Yellow: `#ffca3a`
- Green: `#8ac926`
- Blue: `#1982c4`
- Purple: `#6a4c93`

**Alternative "Space Explorer" Palette (fits game theme):**
- Deep Navy: `#0f172a`
- Dark Blue: `#1e293b`
- Cyan: `#38bdf8`
- Green: `#22c55e`
- Yellow: `#eab308`

### 1.2 Typography

**Key principle:** Ages 8-10 are still developing readers. Legibility is non-negotiable. Fun fonts are for headings ONLY; body text must be clean and simple.

**Font Recommendations:**

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| **Headings / Titles** | **Fredoka One** | Baloo 2, Luckiest Guy | Bold (700) |
| **Body Text** | **Nunito Sans** | Nunito, Lato | Regular (400), SemiBold (600) |
| **Game Narration** | **Nunito** | Nunito Sans | Regular (400) |
| **Code/Input Text** | **Fira Code** or system monospace | monospace | Regular (400) |

**Why these fonts:**
- **Fredoka One**: Bold, bubbly, rounded -- radiates friendliness. Perfect for headings. Available on Google Fonts (free).
- **Nunito Sans**: Rounded but restrained sans-serif -- excellent readability for body text. Pairs perfectly with Fredoka. Also free via Google Fonts.
- Both have "infant characters" (single-story "a" and "g") which aids child readability.

**Font Sizes (for 1024x576 game canvas + surrounding UI):**

| Element | Size | Line Height | Notes |
|---------|------|-------------|-------|
| Main Title / H1 | 32-40px | 1.2 | Fredoka One |
| Section Heading / H2 | 24-28px | 1.3 | Fredoka One |
| Sub-heading / H3 | 20-22px | 1.3 | Nunito Sans SemiBold |
| Body Text | 16-18px | 1.5 | Nunito Sans Regular |
| Game Narration Text | 18-20px | 1.5 | Nunito, slightly larger |
| Button Labels | 16-18px | 1.2 | Nunito Sans SemiBold |
| Input Placeholder | 16px | 1.4 | Nunito Sans Regular |
| Captions / Helper Text | 14px | 1.4 | Nunito Sans Regular |
| Minimum readable text | 12px | 1.4 | Emergency only |

**Typography Rules:**
- Never go below **12px** for anything a child must read
- Body text minimum is **16px** (research-backed standard)
- Line height: **1.4-1.6x** the font size
- Maximum line length: **50-65 characters** (shorter for kids)
- Use **sentence case** for body text, **Title Case** for headings
- Strong contrast: text on dark backgrounds should be `#f4f1de` (cream) or pure white, never gray
- Limit to **2 typefaces maximum** across the entire game

### 1.3 UI Element Sizing

**Touch/click targets for children must be larger than adult standards.**

| Element | Minimum Size | Recommended | Padding/Margin |
|---------|-------------|-------------|----------------|
| Primary Buttons | 48x48px | **60-72px tall** | 12-16px padding |
| Secondary Buttons | 44x44px | 52-60px tall | 10-14px padding |
| Text Input Field | 48px tall | **56px tall** | 12-16px internal padding |
| Icon Buttons | 44x44px | 56x56px | 8px margin between |
| Clickable Cards | -- | 120px+ | 16px gap between |
| Toggle/Checkbox | 24x24px min | 32x32px | 8px margin |

**Spacing System (8px base grid):**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight internal spacing |
| `--space-sm` | 8px | Icon margins, compact gaps |
| `--space-md` | 16px | Standard element spacing |
| `--space-lg` | 24px | Section gaps |
| `--space-xl` | 32px | Major section dividers |
| `--space-2xl` | 48px | Page-level padding |

**Critical rules:**
- Keep interactive elements **away from screen edges** (minimum 16px margin) -- children's imprecise motor skills cause accidental menu/app triggers
- Maintain at least **8px gap** between clickable elements to prevent mis-taps
- NNG recommends **2cm x 2cm** physical button size for children (approximately 76x76px at standard DPI)

### 1.4 Character Design Principles

For Prompt Quest's monster/creature characters:

- **Use round, soft shapes**: Circles and rounded rectangles convey approachability and safety
- **Exaggerate features**: Large eyes (1/3 to 1/2 of face), oversized expressions, exaggerated reactions
- **Bold, bright colors**: Each character should have a distinct primary color for instant recognition
- **Strong silhouettes**: Characters should be identifiable by outline alone
- **Limit detail complexity**: Clean lines, 3-5 colors per character maximum
- **Personality through accessories**: Hats, tools, expressions tell story without text
- **Avoid sharp/angular shapes**: Triangles and points subconsciously signal danger/unfriendliness
- **Make monsters cute, not scary**: Big eyes, round bodies, small limbs, goofy smiles

### 1.5 Animation Principles

**Timing Reference Table:**

| Animation Type | Duration | Easing | Notes |
|----------------|----------|--------|-------|
| Button hover/press | 100-150ms | `ease-out` | Must feel instant |
| Button bounce feedback | 200ms | `ease-out` then `ease-in` | Scale 1.0 -> 1.05 -> 1.0 |
| Element appear/enter | 300ms | `ease-out` | Fade + slide up |
| Element disappear/exit | 200ms | `ease-in` | Faster exit than enter |
| Modal open | 300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot |
| Modal close | 200ms | `ease-in` | Quick close |
| Character spawn | 400-500ms | `Bounce.easeOut` | Fun, bouncy entrance |
| Character move | 500-1000ms | `Sine.easeInOut` | Smooth, natural |
| Celebration confetti | 800-1200ms | `ease-out` | Big, noticeable |
| Text typing/reveal | 30-50ms per char | Linear | Typewriter effect |
| Toast/notification | 300ms in, 200ms out | `ease-out`, `ease-in` | Auto-dismiss after 3-4s |
| Page/scene transition | 400-500ms | `ease-in-out` | Never over 500ms |
| Error shake | 300ms | `ease-in-out` | 3 oscillations |
| Progress bar fill | 400-600ms | `ease-out` | Satisfying smooth fill |

**Phaser-specific tween settings:**
```javascript
// Bouncy character spawn
{ duration: 500, ease: 'Bounce.easeOut', scale: { from: 0, to: 1 } }

// Smooth character movement
{ duration: 800, ease: 'Sine.easeInOut' }

// Fun wobble
{ duration: 200, ease: 'Sine.easeInOut', angle: { from: -5, to: 5 }, yoyo: true, repeat: 2 }

// Celebration pop
{ duration: 300, ease: 'Back.easeOut', scale: { from: 0.5, to: 1.2 } }

// Elastic entrance
{ duration: 600, ease: 'Elastic.easeOut' }
```

**Movement speed guideline:**
- Character movement: **200-400 pixels/second** for comfortable viewing
- Fast actions: up to **600 px/s**
- Slow, dramatic: **100-150 px/s**
- Formula: `duration = (distance / speed) * 1000` ms

**Animation rules for kids:**
- Every button press needs **immediate visual feedback** (< 100ms)
- Use `ease-out` for entrances (responsive feel), `ease-in` for exits
- Never make children wait more than **300ms** without some visual response
- Bouncy/elastic easing is **appropriate and fun** for this age group
- Celebratory animations can be **longer (800-1200ms)** -- they are the reward
- Always respect `prefers-reduced-motion` media query
- No animation should exceed **3 seconds** without being skippable

### 1.6 Visual Hierarchy & Layout

**Screen zones for 1024x576 canvas:**

```
+--------------------------------------------------+
|  SAFE ZONE (90% = 921x518, 51px margin each side) |
|                                                    |
|  +---TOP BAR (task info, score, settings)------+  |
|  |  [Task Name]        [Stars] [Settings Gear] |  |
|  +---------------------------------------------+  |
|                                                    |
|  +---MAIN GAME AREA (center, ~60% height)------+  |
|  |                                               |  |
|  |          Scene Script Player Area             |  |
|  |     (actors, props, animations here)          |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                    |
|  +---BOTTOM PANEL (input, narration, feedback)--+  |
|  |  [Narration text]                             |  |
|  |  [Text input field...        ] [Send button]  |  |
|  |  [Feedback / tip area]                        |  |
|  +-----------------------------------------------+  |
|                                                    |
+--------------------------------------------------+
```

**Hierarchy rules:**
- Most important: **game scene** (center, largest area)
- Second: **input area** (bottom, where child types)
- Third: **feedback/narration** (near input, readable)
- Least: **chrome/settings** (top corners, small)
- Use **size, color, and contrast** to establish hierarchy -- larger + brighter = more important
- Group related elements with **proximity** and consistent spacing
- Keep the **center of screen** for primary content (eye tracking shows children focus here)
- Avoid putting anything critical in the **bottom 10%** or **top 5%** of the screen

---

## 2. Interaction Design

### 2.1 Input Methods

**Keyboard (Primary for Prompt Quest):**
- Text input is the core mechanic -- typing prompts
- Auto-focus the input field when appropriate
- Support `Enter` key to submit (in addition to button click)
- Show a blinking cursor and placeholder text
- Consider auto-complete/suggestions for common words

**Mouse/Trackpad:**
- Large hover states on all interactive elements
- Clear cursor changes (pointer on clickable items)
- No right-click menus or complex interactions
- Drag-and-drop should be avoided unless core mechanic (unreliable with kids' motor skills)

**Touch (for tablet/mobile play):**
- All targets minimum **60px** (see sizing section)
- No hover-dependent interactions (touch has no hover)
- Avoid multi-finger gestures
- Provide on-screen keyboard that doesn't obscure game content

**Voice (Optional/Stretch feature):**
- Web Speech API works for quick prototyping but has limited accuracy with children's voices
- Specialized kids' voice APIs: SoapBox/AI Labs, Speechace, KeenASR
- Always provide a visual alternative -- voice is supplementary, never required
- COPPA compliance critical when recording children's audio
- Show clear microphone on/off state
- Display transcription in real-time so child can verify

### 2.2 Feedback Loops

**Immediate feedback (0-200ms):**
- Button press visual response (scale/color change)
- Input field focus state
- Keystroke feedback in input
- Click sounds

**Short-term feedback (200ms-2s):**
- Scene script animations playing
- Narration text appearing
- Character reactions
- Success/failure state indication

**Medium-term feedback (2-8s):**
- AI response loading (with engaging loading animation)
- Scene script sequence playing out
- Feedback panel updating with tips

**Long-term feedback (session-level):**
- Star/progress tracking per task
- "Best prompts" collection
- Skill improvement shown over multiple attempts

**Golden rule:** Never leave a child waiting with no feedback. If processing takes more than 300ms, show something visual (spinner, animation, progress indicator).

### 2.3 Error Handling

**Principles:**
- NEVER blame the child ("You typed it wrong" -> "Hmm, let's try that differently!")
- NEVER show technical errors (API failures, timeouts -> fallback response)
- NEVER use the word "error," "invalid," "fail," or "wrong"
- Always provide a clear next action
- Use encouraging, warm language
- Add character/mascot personality to error moments

**Error message tone examples:**
| Situation | BAD | GOOD |
|-----------|-----|------|
| Empty input | "Error: Input required" | "Type something fun for the monsters to try!" |
| API timeout | "Request timed out" | "The monsters are thinking extra hard... Let's try again!" |
| No match found | "Invalid prompt" | "Interesting idea! The monsters tried something silly. Want to try a different way?" |
| Network error | "Network error" | "Oops, the magic signal got lost! Trying again..." |
| Unknown | "Something went wrong" | "Whoa, that was unexpected! Let's shake it off and try again!" |

**Visual error design:**
- Gentle shake animation (300ms, 3 oscillations) instead of red borders
- Use warm orange (`#ff9f1c`) instead of aggressive red for warnings
- Keep the input content when an error occurs (don't clear the field)
- Auto-retry silently when possible (network errors)
- The three-tier fallback system ensures kids NEVER see an error screen

### 2.4 Onboarding

**Research findings:**
- Budge Studios found that only 25% of first-time kids completed initial game loops; after redesigning onboarding, this rose to 74%
- Kids skip lengthy text instructions -- observed repeatedly in NNG research
- Audio + visual cues together are more effective than text alone for this age group

**Onboarding pattern for Prompt Quest:**

1. **Immediate play** (no sign-up wall, no lengthy intro)
2. **Show, don't tell** -- use 2-3 animated examples, not text paragraphs
3. **Progressive disclosure** -- teach one concept per step:
   - Step 1: "Type what you want the monsters to do" (show example prompt)
   - Step 2: "Watch what happens!" (show scene reaction)
   - Step 3: "Try to be more specific for better results!" (show improved prompt)
4. **First success in under 60 seconds** -- the child should see a positive result immediately
5. **Reward the first attempt** regardless of quality (FUNNY_FAIL is still a win)
6. **Contextual hints** appear only when needed, not front-loaded
7. **Maximum 3 onboarding steps** before free play begins

**Progressive difficulty ramp:**
```
Attempt 1-2:  Very forgiving, any input gets a fun reaction
Attempt 3-5:  Gentle suggestions ("Try adding a color!")
Attempt 6-10: More specific feedback ("What kind of cake? Big? Small? Chocolate?")
Attempt 11+:  Full prompt engineering coaching
```

### 2.5 Reward Systems

**Research insight:** Eye-tracking shows kids pay minimal visual attention to persistent score/reward displays DURING gameplay. They engage most with **end-of-round feedback** and **celebration moments**.

**Effective reward mechanics for ages 8-10:**
- **Stars per task** (1-3 stars based on prompt quality) -- simple, universally understood
- **Celebration animations** on success (confetti, character dance, sound effects)
- **Prompt collection** -- save their best prompts as "discovered spells"
- **Unlockable scene variations** -- new monsters, decorations, reactions
- **Verbal/text praise** that is specific ("Your prompt was so specific, the monster knew exactly what to do!")

**Reward timing:**
- Immediate micro-reward: visual + audio feedback on every submit
- Task completion: bigger celebration (confetti, stars)
- Session reward: recap of what they learned
- Place rewards **early** in the interaction to combat temporal discounting

**Avoid:**
- Points/currency systems (overcomplicates, distracts from learning)
- Leaderboards (creates anxiety, not appropriate for this age)
- Punishment for failure (no "lives" system, no penalty)
- Infinite reward loops or fake scarcity

### 2.6 Cognitive Load Management

**Working memory in ages 8-10:**
- Miller's law: 7 +/- 2 items in working memory (for adults)
- Children have **reduced working memory capacity** -- plan for 3-5 items
- Children this age are in Piaget's "Concrete Operational Stage" -- they handle concrete concepts but struggle with abstract ones

**Design strategies:**
- **Chunk information** into groups of 3-5 related items
- **One concept per screen** -- never teach two things simultaneously
- **Visual + text** redundancy -- show AND tell, don't rely on one modality
- **Consistent UI patterns** -- same layout, same buttons, same positions every time
- **Reduce choices** -- present 2-3 options maximum, not 10
- **Use the game scene** as the primary information carrier (concrete, visual)
- **Keep narration under 20 words** per scene script
- **Keep feedback to one concrete tip** at a time
- Physical interactions (clicking, typing, dragging) help **offload working memory**

**Maximum simultaneous UI elements rule:**
- Top bar: 3 items max (task name, progress indicator, settings)
- Main area: 1 primary focus (the scene)
- Bottom panel: 2-3 items (narration, input, one feedback tip)
- Total on screen at once: **6-8 distinct UI elements**

---

## 3. Sound Design

### 3.1 Music Style & Tempo

**Overall music character:**
- Upbeat, cheerful, optimistic, playful
- Major keys (C major, G major, F major)
- Instruments: ukulele, glockenspiel, piano, acoustic guitar, light percussion, whistles, claps
- Chiptune/synth elements acceptable for a tech-themed game (prompt engineering = digital magic)
- Light, bouncy bass lines
- Avoid: minor keys, heavy bass, complex harmonies, lyrics with words

**Tempo by game state:**

| Game State | BPM | Style | Notes |
|------------|-----|-------|-------|
| Main menu / idle | 90-100 | Gentle, inviting | Ukulele + light piano |
| Active gameplay | 105-120 | Moderately upbeat | Adds light percussion |
| Waiting for AI response | 85-95 | Magical, anticipatory | Sparkly, ethereal tones |
| Success celebration | 120-130 | Energetic, triumphant | Full instrumentation burst |
| Thinking/reading feedback | 80-90 | Calm, supportive | Soft piano + pads |

**Music implementation rules:**
- **Loop seamlessly** -- no jarring restart points
- **Keep volume at -12dB to -18dB** below speech/narration levels
- **Duck music** during narration or text display
- **Use short musical stingers** (1-3 seconds) for success/failure moments
- **Cross-fade** between game states (300-500ms transition)
- Provide volume control and mute button (always accessible)

### 3.2 Sound Effect Categories

**UI Sounds:**

| Sound | Trigger | Character | Duration |
|-------|---------|-----------|----------|
| Button click | Any button press | Soft pop/click | 50-100ms |
| Button hover | Mouse enters button | Subtle tick | 30-50ms |
| Text input keystroke | Each key press | Soft typewriter tap | 20-40ms |
| Submit prompt | Send button clicked | Whoosh + sparkle | 200-400ms |
| Menu open | Panel/modal opens | Ascending chime | 150-300ms |
| Menu close | Panel/modal closes | Descending soft tone | 100-200ms |
| Toggle on/off | Switch flipped | Click + subtle confirm | 80-120ms |

**Game Event Sounds:**

| Sound | Trigger | Character | Duration |
|-------|---------|-----------|----------|
| Character spawn | Actor appears in scene | Pop + bounce | 300-500ms |
| Character move | Actor moves across scene | Swoosh/slide | Matches tween duration |
| Character react (happy) | Success animation | Cheerful squeak | 200-400ms |
| Character react (funny) | Funny fail animation | Comical boing/slip | 300-500ms |
| Effect: confetti | Celebration plays | Sparkle shower | 800-1200ms |
| Effect: explosion | Comic explosion | Cartoonish boom | 400-600ms |
| Effect: sparkle | Magic effect | Twinkling bells | 300-600ms |

**Reward Sounds:**

| Sound | Trigger | Character | Duration |
|-------|---------|-----------|----------|
| Star earned | Task rating revealed | Rising chime + ding | 500-800ms |
| Full success | 3 stars achieved | Triumphant fanfare | 1000-1500ms |
| Partial success | 1-2 stars | Encouraging melody | 600-800ms |
| Funny fail | Amusing mistake | Wah-wah + giggle | 500-800ms |
| Level up / progress | Major milestone | Grand ascending scale | 1200-1800ms |
| New unlock | Content unlocked | Magical reveal + sparkle | 800-1000ms |

### 3.3 Volume Considerations

**Default volume levels (relative):**
- Master: 80%
- Music: 50% (subdued backdrop)
- SFX: 70% (noticeable but not startling)
- Voice/Narration: 100% (if used, always clearest)

**Rules:**
- No sound should ever be startlingly loud
- Provide **separate volume sliders** for Music and SFX
- Include a **global mute button** always visible in top UI
- Save volume preferences to localStorage
- Start with music at reduced volume on first visit
- Consider `AudioContext` user gesture requirement in browsers

### 3.4 Audio Accessibility

- All sound-conveyed information must also be visually represented
- Provide **closed captions** for any voice narration
- Support system volume/mute settings
- Never require sound for core gameplay (sound enhances, never gates)
- Offer **visual beat indicators** as alternative to audio rhythm cues
- Test that game is fully playable on mute

---

## 4. Emotional Design

### 4.1 Tone of Voice

**For ages 8-10, the tone should be:**
- **Friendly peer, not condescending adult** -- think "cool older sibling" energy
- **Enthusiastic but not manic** -- excited about their ideas, not hyperactive
- **Clear and direct** -- short sentences, common words
- **Encouraging without being patronizing** -- "Great idea!" not "Good job, sweetie!"
- **Playful and slightly silly** -- mirrors their sense of humor
- **Conversational** -- contractions okay, informal grammar fine

**Vocabulary rules:**
- Target **Flesch-Kincaid Grade Level 3-4** for all game text
- Average sentence length: **8-12 words**
- Mostly **1-2 syllable words**
- Use active voice exclusively
- Avoid: jargon, sarcasm, idioms kids might not know

**Example narration text (grade 3-4 level):**
- "The monster grabbed the biggest cake it could find!" (10 words, grade 2.8)
- "Your prompt was super clear! The monster knew exactly what to do." (12 words, grade 3.1)
- "Hmm, the monster got confused. Try telling it what SIZE cake you want!" (13 words, grade 3.5)

**System prompt personality:** Frame the AI as a playful narrator telling the story of what happens when kids' prompts come to life. Not a teacher, not a judge -- a storyteller.

### 4.2 Humor That Works for Ages 8-10

**Kids this age love:**
- **Slapstick and physical comedy**: Characters falling, bumping into things, exaggerated reactions
- **Absurdist humor**: A giant cake falling from the sky, a monster wearing a tiny hat
- **Mild grossness**: Slime, burps (used sparingly), food messes
- **Unexpected outcomes**: They typed "make a cake" and got a cake the size of a house
- **Wordplay and puns**: Simple puns they can understand ("That's one smart cookie!")
- **Self-aware silliness**: Characters acknowledging how weird things are
- **Repetition with variation**: Running gags that evolve

**Avoid:**
- Mean-spirited humor or put-downs
- Pop culture references they won't get
- Complex irony or sarcasm (too abstract at this age)
- Scary or threatening humor
- Bathroom humor (divisive, some parents object)

**FUNNY_FAIL examples for Prompt Quest:**
- Prompt "make cake" -> Monster makes a cake out of rocks because you didn't say what KIND
- Prompt "give monster hat" -> Monster puts a hat on its foot because you didn't say WHERE
- The monster always tries its best but misunderstands vague prompts in hilarious ways

### 4.3 Building Confidence

**Principles:**
- **Celebrate effort, not just results**: "That was a really creative idea!" (even on failure)
- **Normalize iteration**: "Even pro prompt engineers try lots of different ways!"
- **Show progress**: "Your prompts are getting more specific! Look how much better that worked!"
- **Separate the child from the outcome**: The PROMPT was unclear, not the CHILD is wrong
- **Use "yet" framing**: "The monster didn't quite get it yet -- try adding more details!"
- **Never compare to others**: No leaderboards, no "other kids got this right"
- **Make first attempt always produce something**: No blank failures, always a reaction

**Confidence-building feedback patterns:**
```
Attempt 1: "The monster loved trying that! Here's what happened..."
Attempt 2: "Ooh, getting closer! What if you added [specific detail]?"
Attempt 3: "Nice, you added [detail]! The monster is starting to get it!"
Attempt 4: "YES! That's a great prompt! Look what the monster did!"
```

### 4.4 Failure Handling

**Core philosophy:** In Prompt Quest, there is no "failure." There are only:
- **FULL_SUCCESS**: The prompt was clear and specific, the scene played perfectly
- **PARTIAL_SUCCESS**: The prompt was okay, the scene mostly worked with some funny bits
- **FUNNY_FAIL**: The prompt was vague, the scene is hilarious (this IS the fun)

**Making mistakes fun:**
- Every input gets a reaction (never "nothing happens")
- Vague prompts create **funnier** results, not "wrong" results
- The monster always TRIES to follow the prompt -- it just interprets vague prompts literally/absurdly
- Failures are reframed as "the monster got confused" not "you did it wrong"
- Each failure provides **one specific, actionable tip** to improve
- Children get **unlimited retries** with no penalty
- The game **remembers improvement** and points it out

**Emotional arc of a "failure" in Prompt Quest:**
1. Child submits vague prompt
2. Scene plays with funny/absurd interpretation (child laughs)
3. Narration: warm, funny description of what happened
4. Feedback: "The monster didn't know what SIZE cake to make, so it made the biggest one ever! Try adding a size next time."
5. Input field ready for retry (previous prompt still visible for editing)

### 4.5 Celebration Moments

**When to celebrate:**
- First prompt submitted (any quality)
- First FULL_SUCCESS achieved
- Earning each star
- Completing a task
- Prompt improvement detected (better than previous attempt)
- Creative/unexpected prompts (even if not "correct")

**Celebration intensity scale:**

| Event | Visual | Audio | Duration |
|-------|--------|-------|----------|
| Button press | Micro-bounce | Soft click | 100ms |
| Prompt submitted | Sparkle trail | Whoosh | 300ms |
| FUNNY_FAIL | Character slapstick | Boing + giggle | 800ms |
| PARTIAL_SUCCESS | Confetti (light) | Cheerful chime | 600ms |
| FULL_SUCCESS | Confetti (full) + stars + character dance | Triumphant fanfare | 1200ms |
| Task complete | Screen-wide celebration, large stars animate | Full victory music | 2000ms |

**Celebration rules:**
- Scale celebrations to the achievement -- don't over-celebrate small things
- Celebrations should never interrupt or block the child's ability to continue
- Allow celebrations to be skipped/dismissed with a click
- Use confetti particle effects (emoji text objects per project pattern) + screen shake + character animations
- Every celebration should include at least **two sensory channels** (visual + audio)

---

## 5. Educational Game Design

### 5.1 Scaffolding Learning

**Scaffolding in Prompt Quest means gradually reducing support as the child improves:**

**Level 1 -- Full Support:**
- Show example prompts before child types
- Accept any input and create a fun scene
- Provide very specific feedback: "Try adding a color! Like 'red cake' or 'blue hat'"
- Highlight which part of their prompt worked well

**Level 2 -- Guided Practice:**
- Show prompt starters or fill-in-the-blank templates
- Feedback becomes slightly less specific: "What details could you add?"
- Introduce one new concept per round (size, color, action, emotion)

**Level 3 -- Independent Practice:**
- No examples shown, child writes freely
- Feedback references prompt engineering concepts: "Being specific helps!"
- Multiple concepts can be combined in one prompt

**Level 4 -- Mastery:**
- Complex multi-step prompts
- Feedback is reflective: "What made that prompt work so well?"
- Child discovers prompt engineering principles through experimentation

**Fade scaffolding based on performance:**
- Track consecutive successes
- After 3 FULL_SUCCESS results in a row, reduce hint level
- If 3 FUNNY_FAILs in a row, increase hint level
- Never jump more than one level at a time

### 5.2 Zone of Proximal Development

**The ZPD "sweet spot" for Prompt Quest:**

```
TOO EASY (boring)     |  ZPD (learning)           |  TOO HARD (frustrating)
---------------------- | ------------------------- | ----------------------
"Type anything"        |  "Add details to make     |  "Write a 3-step
(no skill needed)      |   your prompt clearer"    |   conditional prompt
                       |  (achievable with hints)  |   with constraints"
                       |                           |  (abstract, too complex)
```

**Practical implementation:**
- Start every session in the child's current comfort zone (1-2 easy wins)
- Introduce one new challenge element per 3-4 prompts
- If the child is struggling, return to a success state before trying again
- Use the AI response quality to gauge difficulty (more FULL_SUCCESS = ready for harder tasks)
- The "Concrete Operational Stage" (ages 7-11) means: keep concepts tangible and demonstrable, not abstract

### 5.3 Feedback That Teaches

**Three-part feedback structure:**

1. **Acknowledge** (emotional): "Great try!" / "That was creative!" / "The monster loved that!"
2. **Explain** (cognitive): What happened and why ("The monster didn't know what size cake because your prompt didn't say")
3. **Suggest** (actionable): One specific next step ("Try adding a size word like 'tiny' or 'enormous'")

**Feedback rules:**
- Maximum **one teaching point per feedback** (cognitive load management)
- Always start with something **positive** (what worked, or acknowledge effort)
- Make the suggestion **concrete and specific** (not "be more descriptive" but "add a color")
- Use the **scene that just played** as the visual evidence (point to what happened)
- Keep total feedback text under **25 words**
- Gradually shift from telling to asking: "What details could you add?" vs. "Add a color"

**Example feedback progression:**
```
Early:    "Try adding a color! Say 'red cake' instead of just 'cake'."
Middle:   "What color should the cake be? Adding details helps the monster understand."
Advanced: "How could you make this prompt even more specific?"
```

### 5.4 Balancing Fun vs. Learning

**The fun IS the learning in Prompt Quest:**
- Prompt engineering is learned through cause and effect (type vague prompt -> funny result; type specific prompt -> success)
- The comedy of FUNNY_FAIL is the most memorable teaching moment
- Every game interaction IS a learning opportunity -- there is no separate "lesson" phase
- Fun is the vehicle, not the distraction

**Balance checklist:**
- [ ] Every interaction teaches something about prompt specificity
- [ ] The child is laughing or smiling (engagement check)
- [ ] The child voluntarily tries again (motivation check)
- [ ] The child's prompts are getting more detailed over time (learning check)
- [ ] The child can explain why one prompt worked better than another (transfer check)

---

## 6. Accessibility

### 6.1 Color Contrast

**WCAG 2.2 AA requirements (minimum standard):**

| Element | Minimum Ratio | Target |
|---------|--------------|--------|
| Normal text (< 18px) | 4.5:1 | 5:1+ |
| Large text (>= 18px bold or >= 24px) | 3:1 | 4.5:1+ |
| UI components (buttons, inputs, icons) | 3:1 | 4.5:1+ |
| Non-text contrast (graphs, indicators) | 3:1 | 4.5:1+ |

**Specific contrast checks for Prompt Quest palette:**

| Foreground | Background | Ratio | Pass? |
|-----------|-----------|-------|-------|
| `#f4f1de` (cream) | `#1a0533` (purple bg) | ~14:1 | Yes (AAA) |
| `#38bdf8` (cyan) | `#1a0533` (purple bg) | ~6.5:1 | Yes (AA) |
| `#eab308` (gold) | `#1a0533` (purple bg) | ~7.8:1 | Yes (AA) |
| `#22c55e` (green) | `#1a0533` (purple bg) | ~7.2:1 | Yes (AA) |
| `#ff595e` (red) | `#1a0533` (purple bg) | ~4.8:1 | Yes (AA) |
| `#293241` (dark) | `#f4f1de` (cream) | ~12:1 | Yes (AAA) |

**Rules:**
- Never use color alone to convey meaning -- always pair with icons, text, or patterns
- Provide a **high-contrast mode** option
- Test all color combinations with a contrast checker tool
- Consider **colorblind-safe palettes** -- avoid relying on red/green distinction alone

### 6.2 Screen Reader Support

**Implementation checklist:**
- All images have descriptive `alt` text
- All buttons have accessible labels (`aria-label` when icon-only)
- Form inputs have associated `<label>` elements
- Game scene narration text is also in the DOM (not just canvas)
- Use semantic HTML (`<main>`, `<nav>`, `<section>`, `<button>`)
- Announce dynamic content changes with `aria-live` regions
- Provide text descriptions of visual scene script actions
- Tab order follows logical reading order
- Focus indicators are visible and high-contrast (minimum 3:1)

**Phaser canvas accessibility:**
- Canvas content is inherently inaccessible to screen readers
- Mirror critical game state in DOM elements with `aria-live="polite"`
- The narration text, feedback panel, and input field should all be in the DOM
- Consider a "screen reader mode" that provides text-only scene descriptions

### 6.3 Motor Accessibility

**Requirements:**
- All interactions achievable with keyboard alone (Tab, Enter, Space, Arrow keys)
- No time-limited interactions (no "type before the timer runs out")
- No precision clicking required (large targets, see sizing section)
- No rapid repeated clicking required
- Support for switch access and adaptive controllers (standard keyboard events)
- Adjustable interaction speed (optional slower animations)
- No essential drag-and-drop (provide click-based alternative)

**Keyboard navigation map for Prompt Quest:**
- `Tab`: Move between input field, send button, and menu items
- `Enter`: Submit prompt (when input focused) or activate button
- `Escape`: Close modals, dismiss notifications
- `Arrow keys`: Navigate within menus or option lists
- All focus states clearly visible with `outline` (not just `outline: none`)

### 6.4 Reading Level

**Target: Flesch-Kincaid Grade Level 3.0-4.0**

**Guidelines:**
- Average sentence: **8-12 words**
- Average word: **1-2 syllables**
- Active voice only
- No compound-complex sentences
- Define or avoid domain-specific terms
- Use the simplest word that conveys the meaning

**Prompt Quest vocabulary list (approved simple terms):**
| Instead of... | Use... |
|---------------|--------|
| "Formulate a prompt" | "Type what you want" |
| "The AI interpreted" | "The monster tried" |
| "Insufficient detail" | "Need more details" |
| "Modify your input" | "Change your words" |
| "Execute the command" | "Make it happen" |
| "Parameters" | "Details" |
| "Iterate" | "Try again" |
| "Optimize" | "Make it better" |
| "Specificity" | "Being exact" |
| "Ambiguous" | "Unclear" |

**Reading support features:**
- Optional text-to-speech for all UI text
- Adjustable font size (minimum 3 size options)
- Highlight text as it is read aloud
- Keep all text visible long enough to read (minimum 3 seconds for short text, longer for paragraphs)
- Break long text into sequential panels, not one block

---

## 7. Industry Examples & References

### 7.1 Successful Kids Games -- Design Analysis

**Prodigy (ages 6-14, Math RPG):**
- RPG mechanics wrap math questions (answer questions to cast spells)
- All questions **voiced** for non-readers
- On-screen learning aids (fraction wall, counters)
- Adaptive difficulty based on performance tracking
- Freemium model (education is always free)
- 100M+ students globally
- **Takeaway for Prompt Quest:** Wrapping learning in game narrative works at massive scale. Voice support is important. Adaptive difficulty is essential.

**CodeSpark Academy (ages 5-10, Coding):**
- **Completely word-free interface** -- all icons and visual programming
- Drag-and-drop puzzle mechanics (sequencing, loops, conditionals)
- "Create" mode for open-ended expression
- Arcade-style game feel keeps engagement high
- Based on university research
- 200+ countries
- **Takeaway for Prompt Quest:** Word-free where possible. Creative expression mode is a huge engagement driver. Research-backed pedagogy matters.

**ScratchJr (ages 5-7, Creative Coding):**
- Icon-based programming (snap graphical blocks together)
- Built-in character/costume editor (kids LOVE customization)
- Created by MIT Media Lab + Tufts
- Free, open-source
- Designed specifically for cognitive/social/emotional development stage
- **Takeaway for Prompt Quest:** Kids gravitate to creative tools. Character customization is magnetic. Keep the interface age-appropriate and developmentally grounded.

**Duolingo (all ages, Language Learning):**
- Progressive disclosure: learn before you sign up
- Gamification: streaks, XP, league boards (for teens/adults)
- Bite-sized lessons (5-15 minutes)
- Immediate feedback on every answer
- Playful error handling ("Oops! Not quite!")
- Green owl mascot adds personality to every interaction
- **Takeaway for Prompt Quest:** Immediate play, no gates. Mascot personality matters. Short sessions. Every interaction has feedback.

### 7.2 Design Systems & Guidelines

| Resource | Focus | URL |
|----------|-------|-----|
| Nielsen Norman Group: UX for Children (3-12) | 156 guidelines, 399 pages, 4th edition | nngroup.com/reports/children-on-the-web/ |
| NNG: Cognitive Considerations for Kids | Age-specific cognitive development | nngroup.com/articles/kids-cognition/ |
| NNG: Physical Development for Kids | Motor skills, target sizes | nngroup.com/articles/children-ux-physical-development/ |
| Lingokids Visual Design Principles | Color, typography, layout for children | lingokids design blog |
| Filament Games: WCAG 2.1 AA Glossary | Accessibility terms for game devs | filamentgames.com |
| Game UX Master Guide: HUD Layout | Safe zones, visual hierarchy | gameuxmasterguide.com |
| Game UI Database | 55,000+ screenshots from 1,300+ games | gameuidatabase.com |

### 7.3 Key Research References

| Topic | Source | Key Finding |
|-------|--------|-------------|
| Target sizes for children | NNG (2002-2024) | 2cm x 2cm minimum for kids (~76px) |
| Age group targeting | NNG | Must distinguish 3-5, 6-8, 9-12; kids aware of age differences |
| Working memory in kids | Miller (1956), Baddeley & Hitch (2004) | 7+/-2 items for adults; less for children; chunking equally effective across ages 6-10 |
| Cognitive development | Piaget | Ages 7-11: Concrete Operational Stage; can use logic on concrete but not abstract problems |
| Feedback impact | Hattie & Timperley (2007) | Immediate feedback has 0.79 effect size on learning |
| ZPD in games | Vygotsky (1978) | Learning happens at the "sweet spot" between too easy and too hard |
| Scaffolding | Puntambekar & Hubscher (2005) | Key attributes: diagnosis, calibration, and fading |
| Growth mindset | Dweck (2006) | Trial-and-error in low-stakes environments builds resilience |
| Cognitive load theory | Paas & van Merrienboer (2020) | Minimize extraneous load, optimize germane load for learning |
| Interactive content & retention | Joan Ganz Cooney Center | Interactive content increases learning retention by up to 60% |
| Game-based learning market | Industry reports (2024) | Grown from $3.5B (2018) to $24B (2024) |
| Children's attention span | Multiple | 8-12 minutes per task average for this age group |

---

## Quick Reference: Prompt Quest Design Tokens

```css
/* Colors */
--color-bg-primary: #1a0533;
--color-bg-secondary: #1e293b;
--color-interactive: #6a4c93;
--color-interactive-hover: #7d5fa6;
--color-accent-cyan: #38bdf8;
--color-accent-gold: #eab308;
--color-accent-green: #22c55e;
--color-accent-orange: #ff9f1c;
--color-text-light: #f4f1de;
--color-text-dark: #293241;
--color-error-soft: #ff595e;
--color-success: #22c55e;

/* Typography */
--font-heading: 'Fredoka One', 'Baloo 2', cursive;
--font-body: 'Nunito Sans', 'Nunito', sans-serif;
--font-size-h1: 36px;
--font-size-h2: 26px;
--font-size-h3: 21px;
--font-size-body: 17px;
--font-size-narration: 19px;
--font-size-button: 17px;
--font-size-caption: 14px;
--font-size-min: 12px;
--line-height-heading: 1.2;
--line-height-body: 1.5;

/* Spacing (8px grid) */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;

/* Sizing */
--button-height-primary: 64px;
--button-height-secondary: 52px;
--input-height: 56px;
--icon-button-size: 56px;
--touch-target-min: 48px;
--border-radius-sm: 8px;
--border-radius-md: 12px;
--border-radius-lg: 16px;
--border-radius-full: 9999px;

/* Animation */
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-celebration: 1000ms;
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in: cubic-bezier(0.32, 0, 0.67, 0);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Audio */
--volume-master: 0.8;
--volume-music: 0.5;
--volume-sfx: 0.7;
--volume-voice: 1.0;
```

---

## Sources

### Visual Design
- [Top 10 UI/UX Design Tips for Child-Friendly Interfaces](https://www.aufaitux.com/blog/ui-ux-designing-for-children/)
- [UX Design for Kids: Principles and Recommendations](https://www.ramotion.com/blog/ux-design-for-kids/)
- [Main Principles of UX Design for Children](https://www.eleken.co/blog-posts/ux-design-for-children-how-to-create-a-product-children-will-love)
- [Visual Principles When Designing for Children - Lingokids](https://jobs.lingokids.com/posts/visual-principles-when-designing-for-children)
- [Designing Websites for Kids - Canva](https://www.canva.com/learn/kids-websites/)
- [Digital Design Considerations for Child vs Adult User Groups](https://medium.com/fruto/digital-design-considerations-for-child-vs-adult-user-groups-8ea55389ffa0)
- [Kids Color Palettes - Coolors](https://coolors.co/palettes/popular/kids)
- [Kids Color Palettes - Color Hunt](https://colorhunt.co/palettes/kids)
- [The Best 15 Kids Color Palette Ideas](https://filmora.wondershare.com/video-creative-tips/kids-color-palette.html)

### Typography
- [Typography in Digital Products for Kids](https://medium.com/ux-of-edtech/typography-in-digital-products-for-kids-f10ce0588555)
- [12 Best Kids Fonts for Children's Websites](https://www.elegantthemes.com/blog/resources/kids-fonts)
- [Best Fredoka Font Pairings & Alternatives](https://fontfoundryhub.com/best-fredoka-font-pairings-alternatives/)
- [Sassoon Fonts - Research-Backed Educational Typography](https://sassoonfont.co.uk/)

### Touch Targets & Sizing
- [Touch Targets on Touchscreens - Nielsen Norman Group](https://www.nngroup.com/articles/touch-target-size/)
- [Accessible Target Sizes Cheatsheet - Smashing Magazine](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/)
- [WCAG 2.2 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Design for Kids Based on Physical Development - NNG](https://www.nngroup.com/articles/children-ux-physical-development/)

### Animation & Motion
- [How Fast Should Your UI Animations Be? - Val Head](https://valhead.com/2016/05/05/how-fast-should-your-ui-animations-be/)
- [Animation Duration - Nielsen Norman Group](https://www.nngroup.com/articles/animation-duration/)
- [Easing Functions Cheat Sheet](https://easings.net/)
- [Best Practices for Animating Micro-Interactions with CSS](https://blog.pixelfreestudio.com/best-practices-for-animating-micro-interactions-with-css/)
- [Animations and Tweens - Phaser/MDN](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Animations_and_tweens)

### Sound Design
- [Game Sound Design: Principles, Software, Examples](https://gamedesignskills.com/game-design/sound/)
- [9 Sound Design Tips to Improve Your Game's Audio - GameAnalytics](https://www.gameanalytics.com/blog/9-sound-design-tips-to-improve-your-games-audio)
- [CASUAL UI - Game and UI Sound Effects - BOOM Library](https://www.boomlibrary.com/sound-effects/casual-ui/)
- [Quute UI - Modern & Cute Interface Sounds - Sonniss](https://sonniss.com/sound-effects/quute-ui-modern-cute-user-interface-sounds/)
- [Kids Background Music - MelodyLoops](https://www.melodyloops.com/music-for/kids/)

### Interaction Design & Feedback
- [The Design of Incentive Systems in Digital Game-Based Learning](https://www.mdpi.com/2227-7102/13/7/668)
- [Feedback Loops - Game Design Toolkit](https://tkdev.dss.cloud/gamedesign/toolkit/feedback-loops/)
- [Serious Educational Games for Children - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10963373/)
- [Current State of Play: Children's Learning in Digital Games - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11268831/)

### Onboarding
- [App Onboarding for Kids - Budge Studios / Google](https://android-developers.googleblog.com/2017/04/app-onboarding-for-kids-how-budge.html)
- [Building A Kid-Friendly App: Onboarding - AppSamurai](https://appsamurai.com/blog/building-a-kid-friendly-app-onboarding-and-monetization/)
- [3 Onboarding Lessons from Nintendo Games - Appcues](https://www.appcues.com/blog/3-fundamental-user-onboarding-lessons-from-classic-nintendo-games)
- [Onboarding Tutorials vs. Contextual Help - NNG](https://www.nngroup.com/articles/onboarding-tutorials/)

### Cognitive Load & Scaffolding
- [Cognitive-Load Theory - Paas & van Merrienboer](https://journals.sagepub.com/doi/10.1177/0963721420922183)
- [Developmental Abilities to Form Chunks - Frontiers in Psychology](https://pmc.ncbi.nlm.nih.gov/articles/PMC4763062/)
- [Zone of Proximal Development in Video Games - GamersLearn](https://www.gamerslearn.com/design/challenge-and-zpd-in-video-games)
- [The Scaffolding Mechanism in Serious Games](https://www.academia.edu/2037023/The_Scaffolding_Mechanism_in_Serious_Games)
- [Unlocking the Power of Chunking - Pearson](https://www.pearson.com/en-au/schools/insights-news/unlocking-the-power-of-chunking-reducing-cognitive-load/)

### Emotional Design & Growth Mindset
- [Gamification in Education: Growth Mindset Games](https://mybrainware.com/blog/gamification-in-education-fostering-a-growth-mindset/)
- [Helping Kids Develop Emotional Resilience Through Play](https://www.sunrayaba.com/post/helping-kids-develop-emotional-resilience-through-play)

### Accessibility
- [Contrast Requirements for WCAG 2.2 Level AA](https://www.makethingsaccessible.com/guides/contrast-requirements-for-wcag-2-2-level-aa/)
- [Color Contrast Accessibility - WebAIM](https://webaim.org/articles/contrast/)
- [Accessibility Terms for Game Developers - Filament Games](https://www.filamentgames.com/blog/accessibility-terms-for-game-developers-a-wcag-2-1-aa-glossary/)

### Nielsen Norman Group Research
- [UX Design for Children (Ages 3-12), 4th Edition](https://www.nngroup.com/reports/children-on-the-web/)
- [Children's UX: Usability Issues](https://www.nngroup.com/articles/childrens-websites-usability-issues/)
- [Designing for Kids: Cognitive Considerations](https://www.nngroup.com/articles/kids-cognition/)
- [Usability Testing with Minors: 16 Tips](https://www.nngroup.com/articles/usability-testing-minors/)

### Industry Examples
- [Prodigy Education](https://www.prodigygame.com/)
- [CodeSpark Academy](https://codespark.com/)
- [ScratchJr - MIT](https://www.scratchjr.org/)
- [Game UI Database](https://www.gameuidatabase.com/)

### Readability
- [Flesch-Kincaid Readability Tests - Wikipedia](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests)
- [Flesch Reading Ease and Kincaid Grade Level - Readable](https://readable.com/readability/flesch-reading-ease-flesch-kincaid-grade-level/)

### Character Design
- [Character Design Tips - Creative Bloq](https://www.creativebloq.com/character-design/tips-5132643)
- [Key Principles of Effective Character Design - Capermint](https://www.capermint.com/blog/basic-character-design-principles/)
- [Character Design Styles and Best Practices - AAA Game Art Studio](https://aaagameartstudio.com/blog/characters-design-styles-types-and-best-practices)

### Celebration & Particle Effects
- [tsParticles - Confetti & Particles](https://particles.js.org/)
- [Party.js - Confetti & Sparkle Effects](https://party.js.org/)
- [Magic UI Confetti Component](https://magicui.design/docs/components/confetti)

### Voice Input for Kids
- [AI Labs / SoapBox - Voice AI for Children](https://www.soapboxlabs.com/)
- [Speechace API for Kids](https://www.speechace.com/using-the-speechace-api-as-voice-ai-for-kids/)
- [Web Speech API Specification](https://webaudio.github.io/web-speech-api/)

### Error Messages
- [Error Message Guidelines - Nielsen Norman Group](https://www.nngroup.com/articles/error-message-guidelines/)
- [How to Design User-Friendly Error Messages - WowMakers](https://www.wowmakers.com/blog/user-friendly-error-messages/)
