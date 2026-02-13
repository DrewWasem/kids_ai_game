# Claude Code Prompt: Quest AI → Mad Libs Pivot

## Context

I'm pivoting Quest AI from free-text prompting to a **Mad Libs-style interaction model**. The current game has kids type open-ended prompts that get evaluated by Claude API, but the responses are slow (1-8s) and the 3D scene reactions are boring — a character spawns, maybe walks somewhere, plays one animation. Kids lose interest immediately.

The new model: **kids fill in structured prompt blanks, and each combination triggers a pre-built, over-the-top animated vignette with tons of assets, chain reactions, and comedic timing.** The vignettes play instantly from pre-authored content. **Claude's role is generating the Mad Libs options themselves** — the creative word choices that fill each slot. This means every playthrough feels fresh (new options each time), Claude is deeply integrated into the core mechanic, but the kid never waits for AI during the fun part.

## What Exists (Keep / Reuse)

- React + TypeScript + Vite app
- React Three Fiber 3D rendering in 1024x576 canvas
- Scene playback engine that executes sequential actions: `spawn`, `move`, `animate`, `react`, `emote`, `sfx`, `spawn_group`
- 7,834 3D model library (KayKit, Quaternius, Poly.pizza) — only ~250 currently used
- 7 quest zones in a medieval village with 3 stages each
- Zustand state management
- Character animation system (Idle, Cheering, Walking, spell-casting, etc.)
- Particle effects (confetti, hearts, stars, sparkle, explosion)
- Sound effects (pop, whoosh, sparkle, celebrate, fail)
- Camera fly transitions
- Loading system, header bar, village exploration

## What Changes

### 1. Replace Free-Text Input with Mad Libs Selector UI (Powered by Claude)

Remove the single text input box. Replace it with a **sentence template with dropdown/spinner slots**.

Each stage presents a prompt template like:

```
"The skeleton wants to ___(ACTION) the ___(OBJECT) while feeling ___(EMOTION) at the ___(LOCATION)"
```

Each blank is a **scrollable selector wheel or dropdown** with 4-6 options.

#### Claude Generates the Options (This is the Key Integration)

**When a kid enters a quest stage**, the game fires off a Claude API call (Sonnet for speed) that generates the dropdown options. This happens **while the kid is reading the stage intro text and narration**, so by the time they're ready to interact, the options are loaded. No perceived wait.

**Claude API Call — Option Generation:**

```typescript
// Fire this the moment a stage loads, while intro text is displaying
async function generateStageOptions(stage: QuestStage, playerHistory: PlayerHistory): Promise<GeneratedOptions> {
  const response = await callClaude({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `You generate creative, funny word options for a kids' Mad Libs game (ages 8-10).
    
RULES:
- Generate exactly ${stage.template.slots.length} option lists
- Each list has exactly 6 options
- Every option MUST map to one of the allowed tags for that slot (provided below)
- Mix in: 2 "sensible" options, 2 "silly" options, 2 "wildly absurd" options
- Use kid-friendly vocabulary — nothing scary, gross, or inappropriate
- Make absurd options genuinely funny to an 8-year-old (fart jokes OK, potty humor OK in moderation)
- Each option is 1-3 words max
- CRITICAL: Return valid JSON only, no markdown, no preamble

The player has already played ${playerHistory.totalPlays} rounds.
${playerHistory.totalPlays > 0 ? `They tend to pick: ${playerHistory.favoriteTagCategories.join(', ')}. Generate options that SURPRISE them — lean away from their usual picks.` : ''}
${playerHistory.discoveredCombos > 3 ? `They've discovered ${playerHistory.discoveredCombos} combos. Make options WEIRDER to keep them exploring.` : ''}`,

    messages: [{
      role: "user",
      content: `Quest: "${stage.title}"
Stage intro: "${stage.intro}"
Template: "${stage.template.sentence}"

Slots:
${stage.template.slots.map(slot => `- ${slot.label} (allowed tags: ${slot.allowedTags.join(', ')})`).join('\n')}

Generate 6 options per slot. Return JSON:
{
  "slots": [
    {
      "slotId": "ACTION",
      "options": [
        { "label": "juggle", "tag": "throw", "icon": "🤹" },
        ...
      ]
    }
  ]
}`
    }]
  });
  
  return parseOptions(response);
}
```

**How Tag Mapping Works:**

Each slot has a fixed set of `allowedTags` that map to pre-built vignettes. Claude generates creative LABELS (what the kid sees) but must assign each option one of the allowed tags (what the game engine uses to select vignettes). This means:

- Kid sees: "YEET", "gently toss", "suplex", "lob like a basketball"  
- Engine sees: `tag: "throw"` for all of them
- Kid sees: "a wobbly cake", "17 pizzas", "one sad muffin", "a burrito the size of a horse"
- Engine sees: `tag: "food_large"` or `tag: "food_small"`

This is the magic: **Claude makes it feel infinite and fresh, but the game only needs to handle ~4-6 tags per slot.** The combinatorial vignette matching stays manageable.

**Fallback if API is slow or fails:**
Each stage has a `defaultOptions` array — static, pre-written options that are always fun. If Claude hasn't responded by the time the intro text finishes, use defaults. The kid never knows. When Claude's response arrives late, hot-swap the options with a subtle refresh animation.

```typescript
interface TemplateSlot {
  id: string;
  label: string; // "ACTION"
  icon: string; // "💥"
  allowedTags: string[]; // ["throw", "eat", "ride", "wear", "fight"]
  defaultOptions: SlotOption[]; // Static fallback — always works
  generatedOptions?: SlotOption[]; // Claude-generated — loaded async
}

interface SlotOption {
  label: string; // "YEET" (what kid sees — from Claude)
  tag: string; // "throw" (what engine uses — from allowedTags)
  icon: string; // "🤾" (from Claude)
}
```

#### Progressive Difficulty via Claude

Claude doesn't just randomize — it **adapts to the player**:

- **First play**: Options are straightforward. "cake" / "pizza" / "cookies" — easy to understand.
- **After 3 plays**: Options get sillier. "a cake made of socks" / "invisible pizza" / "cookies that scream"
- **After 6 plays**: Options introduce prompt engineering concepts. "exactly 3 blue cupcakes" (specificity) / "a cake, then ice cream, then pie IN THAT ORDER" (sequencing)
- **After 10 plays**: Options that are mini-prompts themselves. Kids start to see that more specific descriptions = better results.

This is the **hidden curriculum**: by reading increasingly specific and well-structured options, kids internalize what good prompts look like. They're learning by CHOOSING, not by typing.

#### UI Design for Selectors
- Style them like fantasy scroll/parchment cards that flip
- Each selector should feel tactile — spin animation, snap to selection
- Show a preview icon (emoji from Claude) for the selected word
- Make the GO button big, animated, impossible to miss
- Add a "Randomize All 🎲" button for kids who want chaos
- Add a "New Words! 🔄" button that re-calls Claude for fresh options (with a brief sparkle loading animation)

### 2. Overhaul the Reaction/Vignette System

This is the most important change. **Every combination must trigger a multi-step animated vignette that is visually dense, surprising, and funny.** The current system spawns 1-3 things and plays basic animations. The new system should feel like a Rube Goldberg machine.

**New Vignette Structure (each should be 8-15 seconds):**

```typescript
interface Vignette {
  id: string;
  // Mapping from slot selections to this vignette
  trigger: {
    action: string;
    object: string;
    emotion?: string;
    location?: string;
  };
  // The sequence of things that happen
  steps: VignetteStep[];
  // Overall rating of this combo
  promptScore: 'perfect' | 'funny_fail' | 'chaotic' | 'partial';
  // Educational feedback shown AFTER the vignette plays
  feedback: {
    title: string; // "Amazing Specificity!" or "Total Chaos!"
    message: string; // Why this combo worked or hilariously didn't
    skillTaught: string; // Which prompt skill this demonstrates
    tip: string; // "Next time, try matching the emotion to the action!"
  };
}
```

**Each vignette step should use MORE of the 7,834 asset library.** Specifically:

#### Spawn Density
- Current: 1-3 assets spawn per scene
- New target: **8-20 assets per vignette**
- Use `spawn_group` aggressively with stagger timing
- Background extras: crowds of characters reacting, animals running through, environmental chaos
- Props everywhere: tables flipping, food flying, decorations appearing

#### Chain Reactions
Build sequences where one action causes the next:
```
skeleton throws cake → cake hits wizard → wizard's spell misfires →
spell turns chicken giant → giant chicken chases knight →
knight crashes into birthday banner → confetti EVERYWHERE
```

Each step should have:
- A primary action (the main thing happening)
- 2-3 secondary reactions (background characters reacting, props affected)
- At least 1 particle effect
- A sound effect
- Camera shake or zoom on impact moments

#### Comedy Timing
- Add **pause beats** before punchlines (0.5s delay before the big reaction)
- Use **anticipation** — character winds up before throwing, crouches before jumping
- **Smash cuts** — quick camera angle changes on impact
- **Pile-ups** — things accumulate and then all collapse/explode at once
- **Callbacks** — something from the first action comes back at the end

#### Asset Categories to Pull From (use the full 7,834 library)

Search through and USE assets from these categories aggressively:
- **Food**: cakes, pizzas, pies, fruit, meat — for throwing, stacking, raining
- **Animals**: chickens, pigs, horses, cats, dogs — as surprised bystanders, chaos agents
- **Furniture**: tables, chairs, barrels, crates — for flipping, stacking, crashing
- **Nature**: trees, bushes, rocks, flowers — growing, falling, bouncing  
- **Effects/Magic**: potions, spell circles, crystals, orbs — magical mishaps
- **Vehicles**: carts, wagons, boats — crashing through scenes
- **Seasonal/Holiday**: presents, pumpkins, snowmen — surprise appearances
- **Fantasy**: swords, shields, treasure chests, crowns — dramatic reveals
- **Space**: rockets, planets, aliens — for the space quest absurdity

#### Specific Vignette Examples

**Skeleton Birthday — Stage 1 (Teaching Specificity)**

Template: `"Plan a party with ___(FOOD) and ___(ENTERTAINMENT) for the skeleton's ___(TYPE) birthday"`

Combo: Cake + Magic Show + Spooky Birthday →
```
1. [0.0s] Skeleton spawns center, idle animation, party hat on head
2. [0.5s] spawn_group: 6 party tables with tablecloths arc around skeleton
3. [1.0s] Wizard spawns left, walks to center with dramatic cape flutter
4. [1.5s] spawn_group: 3-tier cake appears on center table with sparkle burst
5. [2.0s] Wizard casts spell → cake FLOATS off table, spinning
6. [2.5s] 4 ghost NPCs spawn in chairs, cheering animation
7. [3.0s] Cake explodes into 12 individual slices that fly to each guest
8. [3.5s] Skeleton catches slice, cheering animation
9. [4.0s] spawn_group: candles light up across ALL tables (fire particles)
10. [4.5s] Wizard pulls rabbit from hat → rabbit is also a skeleton
11. [5.0s] Skeleton rabbit bounces across tables knocking over goblets
12. [5.5s] ALL characters laugh animation
13. [6.0s] MASSIVE confetti + hearts + stars particle burst
14. [6.5s] Birthday banner unfurls from sky: "HAPPY BONE DAY"
15. [7.0s] Camera zooms out showing full chaotic party scene
```
Score: PERFECT — "You were super specific! You said WHAT food, WHAT entertainment, and WHAT kind of party. That's why the skeleton got exactly the birthday it wanted!"

Combo: Food + Nothing + Birthday (missing entertainment) →
```
1. [0.0s] Skeleton spawns center, idle, party hat
2. [0.5s] Table spawns with food
3. [1.5s] Skeleton looks around... waiting...
4. [2.5s] Cricket sound effect
5. [3.0s] Tumbleweed rolls through
6. [3.5s] Skeleton sits down alone, sad idle
7. [4.0s] Single sad balloon floats up and pops
8. [4.5s] Skeleton shrugs
```
Score: PARTIAL — "The food showed up, but there's nothing to DO at this party! Try adding entertainment to make it fun!"

Combo: Pizza + Chicken Rodeo + Underwater Birthday →
```
1. [0.0s] Skeleton spawns, party hat, confused look
2. [0.5s] Scene FLOODS with blue water particles rising from ground
3. [1.0s] spawn_group: 8 pizzas float by like fish, swimming animation
4. [1.5s] GIANT chicken spawns with cowboy hat
5. [2.0s] Skeleton jumps ON the chicken
6. [2.5s] Chicken bucks wildly, pizza slices fly everywhere  
7. [3.0s] spawn_group: 6 fish spawn watching, cheering
8. [3.5s] Skeleton flies off chicken, lands in pizza stack
9. [4.0s] Bubble particles everywhere
10. [4.5s] All fish clap, "HAPPY BIRTHDAY" bubbles float up
11. [5.0s] Skeleton gives thumbs up from pizza pile, confetti
```
Score: CHAOTIC — "That was WILD! Your choices were super creative but didn't really match. That's what happens when your prompt mixes things that don't go together — you get hilarious chaos! For a great prompt, try picking things that work together."

### 3. Vignette Authoring System

Create a vignette authoring data structure so I can rapidly create hundreds of reaction combos.

```typescript
// Each quest stage defines its template and all possible vignettes
interface QuestStage {
  id: string;
  questId: string;
  stageNumber: number;
  title: string;
  intro: string; // "Help plan the skeleton's birthday party!"
  
  // The Mad Libs template
  template: {
    sentence: string; // "Plan a party with {FOOD} and {ENTERTAINMENT} for a {TYPE} birthday"
    slots: TemplateSlot[];
  };
  
  // All possible vignettes for this stage
  vignettes: Vignette[];
  
  // Fallback vignette if no specific combo match
  defaultVignette: Vignette;
  
  // Which combos count as "success" to advance
  successCombos: string[][]; // e.g. [["cake", "magic_show", "spooky"]]
}

interface TemplateSlot {
  id: string;
  label: string; // "FOOD"
  icon: string; // "🍕"
  options: SlotOption[];
}

interface SlotOption {
  id: string;
  label: string; // "Pizza"
  icon: string; // "🍕"
  tags: string[]; // for combo matching
}
```

**Important:** Design the combo matching to be flexible — not every slot combination needs a unique vignette. Use a tag-based matching system:
- Exact combo match → specific vignette (best reactions)
- Partial match (2 of 3 slots) → semi-specific vignette  
- Tag match ("any food" + "any music") → category vignette
- No match → default funny fallback

This way I can cover hundreds of combos with maybe 30-50 authored vignettes per quest.

### 4. Upgrade the Playback Engine

The current playback engine needs enhancements for denser vignettes:

#### New Action Types Needed
```typescript
// Add to existing action types:
'camera_shake'    // Screen shake on impacts (intensity, duration)
'camera_zoom'     // Quick zoom in/out for emphasis
'camera_cut'      // Instant camera angle change
'delay'           // Dramatic pause beat
'spawn_rain'      // Rain down objects from above (asset, count, area)
'physics_burst'   // Objects explode outward from point  
'slide_in'        // Asset slides in from off-screen (direction)
'grow'            // Asset scales from 0 to target size
'shrink_pop'      // Asset shrinks then pops with particle
'stack'           // Place asset on top of another asset
'chain'           // Trigger next action only when this one completes
'crowd_react'     // All background NPCs play same animation simultaneously
'text_popup'      // Big floating text appears ("BOOM!", "PERFECT!", "OH NO!")
'screen_flash'    // Brief white/color flash on big moments
```

#### Parallel Execution
Current system is sequential only. Add ability to run actions in parallel:
```typescript
interface VignetteStep {
  // Actions that start at the same time
  parallel: Action[];
  // Delay before next step
  delayAfter?: number;
}
```

This lets you have "skeleton throws cake" + "crowd gasps" + "camera zooms" all happening at once.

#### Asset Preloading
With 8-20 assets per vignette, preload the full asset list for a vignette when the kid enters the stage (while they're reading the intro and picking options). No loading hitches during playback.

### 5. Keep the Educational Layer (But Make It Post-Vignette)

After the vignette plays, show a **results card** (not during — don't interrupt the fun):

```
┌──────────────────────────────────┐
│ 🎉 CHAOTIC COMBO!               │
│                                  │
│ Your prompt: "Plan a party with  │
│ PIZZA and CHICKEN RODEO for an   │
│ UNDERWATER birthday"             │
│                                  │
│ 🧠 Prompt Skill: SPECIFICITY    │
│                                  │
│ "Your choices were creative but  │
│ didn't match each other! Great   │
│ prompts pick details that work   │
│ TOGETHER. Try matching your      │
│ entertainment to your theme!"    │
│                                  │
│ [🎲 Try Again]  [➡️ Next Stage]  │
│          (if success)            │
└──────────────────────────────────┘
```

The key insight: **let them replay with different combos.** The fun is in discovering what each combination does. Some kids will methodically find the "right" answer. Others will deliberately pick the chaotic options. Both paths teach prompting.

### 6. Village Updates

- Remove the free-text input UI entirely
- Each quest zone should show a **preview** of the Mad Libs template when you get close (floating above the zone circle)
- Add a **combo counter** to each zone: "You've discovered 4/12 reactions!"
- This creates a collection/completionist mechanic that drives replay

### 7. Claude Integration Architecture

#### When Claude Gets Called

| Moment | What Claude Does | Latency Hidden By |
|---|---|---|
| Kid enters a quest stage | Generates 6 options per slot | Kid is reading intro narration (2-4s) |
| Kid hits "New Words! 🔄" | Generates fresh options | Sparkle loading animation (1-2s) |
| Kid completes all 3 stages | Generates a personalized summary of their adventure | Victory animation playing (3-5s) |

Claude is NEVER in the critical path between "kid hits GO" and "vignette plays." That path is always: button press → tag lookup → instant vignette playback.

#### Prompt Engineering Taught Through Option Design

This is the subtle genius of the approach. Claude's options progressively model good prompt structure:

**Round 1 options:** `"cake"`, `"pizza"`, `"cookies"` (single nouns — basic)
**Round 5 options:** `"a giant chocolate cake"`, `"3 pepperoni pizzas"` (adjectives + specificity)  
**Round 10 options:** `"exactly 5 tiny blue cupcakes arranged in a circle"` (full prompt-like descriptions)

The kid learns that **more specific descriptions exist** just by reading the options. They start to internalize prompt structure without being lectured. When they eventually use Claude for real, they'll naturally write more specific prompts because they've seen hundreds of examples.

#### API Call Budget

- ~1 call per stage entry (option generation) — Sonnet, ~300 tokens out
- ~1 call per "New Words" button press
- ~1 call per quest completion (summary)
- Estimated: 5-8 API calls per full quest playthrough
- Total for a 30-minute play session: ~15-25 calls
- Cost: negligible (Sonnet pricing)

### 8. Migration Priority

**Phase 1 (Friday):** 
- Build the Mad Libs selector UI component with dropdown/spinner slots
- Implement Claude API call for option generation with tag mapping
- Build static fallback options for Skeleton Birthday Stage 1
- Refactor Skeleton Birthday Stage 1 with 6-8 vignettes
- Upgrade playback engine with parallel actions, camera_shake, spawn_rain, text_popup
- **Test: Enter stage → see Claude-generated options → pick combo → vignette plays instantly**

**Phase 2 (Saturday):**
- Author vignettes for Skeleton Birthday stages 2-3
- Author vignettes for 2 more quests (pick the most visual ones)
- Implement progressive difficulty in Claude's option generation (track play count)
- Add "New Words! 🔄" button
- Add combo discovery counter

**Phase 3 (Sunday):**
- Polish: selector animations, vignette timing, sound design
- Remaining quests get at least a default + 2-3 authored vignettes each
- Add post-quest Claude summary generation
- Playtest with my daughter, iterate on comedy timing and option quality

**Phase 4 (Monday):**
- Final polish, bug fixes
- Record demo video — specifically show: same stage played twice with different Claude-generated options to demonstrate freshness
- Write submission description emphasizing Claude integration
- Submit by 6 PM PST

## Key Principles

1. **Claude powers the CHOICES, not the entertainment** — Claude generates the Mad Libs options (the creative words kids pick from). Vignettes are pre-built and play instantly. The kid never waits for AI during the fun part.
2. **Claude makes it feel infinite** — Every time a kid enters a stage, Claude generates fresh options. Same quest, different words every time. But all options map to a fixed set of tags, so the vignette system stays manageable.
3. **Claude adapts to the player** — Options get sillier, more specific, and more "prompt-like" as the kid plays more. This is the hidden curriculum — kids learn prompting by reading increasingly well-structured options.
4. **Graceful degradation** — Every stage has static fallback options. If Claude is slow or fails, the game works perfectly with defaults. When Claude responds, options hot-swap in. Kid never notices.
5. **MORE is more for vignettes** — Spawn tons of assets, chain reactions, particle effects, screen shakes. Kids want spectacle. Use the full 7,834 asset library.
6. **Every combo should be entertaining** — There are no "wrong" answers, just different levels of success. Chaotic combos should be the FUNNIEST.
7. **Education is the wrapper, not the core** — The fun is discovering combos. The learning happens through the increasingly sophisticated options Claude generates AND the post-vignette feedback.
8. **"New Words!" button is the replay hook** — Kids can re-call Claude for fresh options anytime. This single button makes every stage infinitely replayable and directly demonstrates to hackathon judges that Claude is deeply integrated.
