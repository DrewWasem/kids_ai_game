# 🗺️ Prompt Quest - Solo Dev 7-Day Roadmap

**Builder:** Drew (solo)
**Hackathon:** Built with Opus 4.6 (Feb 10-16, 2026)
**Goal:** Ship ONE perfect task demo that teaches prompt engineering through play

---

## 📋 Scope Lock (Non-Negotiable)

### ✅ Building
- **1 core task** (Monster Birthday Party) - polished to perfection
- **1 stretch task** (Robot Pizza Delivery) - only if Day 5 goes well
- **Text input + optional voice** (Explorer Mode only, ages 8-10)
- **Golden Response Cache** (20-30 pre-computed responses)
- **Phaser scene script player** (spawn, move, animate, react actions)
- **Minimal UI** (shadcn/ui components, functional over beautiful)

### ❌ Cut
- ~~Magic Mode (5-7 year olds)~~ - too much UI work for solo
- ~~Builder Mode (11-13 year olds)~~ - code editor too complex
- ~~Trophy Room / Badge system~~ - nice-to-have, not demo-critical
- ~~Custom Lottie character (Pixel guide)~~ - use pre-made animations
- ~~6 tasks~~ - 1-2 maximum

---

## 🎯 Success Criteria

**Demo must show:**
1. User types: "have a party" → Partial success (small cake, confused monster)
2. Feedback panel explains what's missing
3. User retries: "throw a giant birthday cake with balloons and music"
4. Full success → giant cake flies across screen → monster catches → happy dance → confetti

**If this one flow works perfectly, you win.**

---

## 📅 Day-by-Day Breakdown

---

## **Day 1 (Monday): Foundation**
**Goal:** Phaser renders in React, Claude returns valid JSON

### Morning (4 hours)
- [ ] **Clone starter template**
  ```bash
  git clone https://github.com/phaserjs/template-react-ts prompt-quest
  cd prompt-quest
  npm install
  npm run dev
  ```
- [ ] **Verify Phaser works** - you should see the default demo scene
- [ ] **Install dependencies**
  ```bash
  npm install zustand @anthropic-ai/sdk
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button input card textarea
  ```

### Afternoon (4 hours)
- [ ] **Set up Claude API client**
  - Create `.env`: `VITE_ANTHROPIC_API_KEY=your_key`
  - Create `src/services/claude.ts`:
    ```typescript
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true // hackathon only!
    });

    export async function evaluateInput(taskId: string, userInput: string) {
      const response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 500,
        system: SYSTEM_PROMPTS[taskId],
        messages: [{ role: 'user', content: userInput }]
      });

      const text = response.content[0].text;
      return parseSceneScript(text);
    }
    ```

- [ ] **Write Monster Party system prompt** (`src/prompts/monster-party.ts`)
  ```typescript
  export const MONSTER_PARTY_PROMPT = `You are a game engine evaluating a child's solution.

  Task: Plan a birthday party for a monster who's never had one.

  Return ONLY this JSON (no markdown, no explanation):
  {
    "success_level": "FULL_SUCCESS" | "PARTIAL_SUCCESS" | "FUNNY_FAIL",
    "narration": "One fun sentence (under 20 words)",
    "actions": [
      { "type": "spawn", "actor": "cake-giant", "position": "left" },
      { "type": "move", "actor": "cake-giant", "to": "center", "style": "arc" },
      { "type": "animate", "actor": "monster", "anim": "eat" },
      { "type": "react", "effect": "confetti", "position": "center" }
    ],
    "feedback": "What they did well and what to add"
  }

  RULES:
  - FULL_SUCCESS: cake + decorations + entertainment
  - PARTIAL_SUCCESS: only 1-2 elements
  - FUNNY_FAIL: vague or unrelated
  - Max 6 actions
  - Available actors: monster, kid, cake, cake-giant, balloon, present
  - Available anims: idle, happy, sad, eat, dance, confused
  - Available effects: confetti, hearts, sparkle
  `;
  ```

- [ ] **Test Claude response** - run 5 test inputs, verify you get clean JSON every time

### Evening (2 hours)
- [x] **Source assets from Kenney.nl**
  - Downloaded 13 Kenney packs (CC0): Toon Characters, Food Kit, Particle Pack, Emotes, Game Icons, Animal Pack, Space Shooter, Furniture Kit, Fish Pack, RPG Urban, UI Pack, Platformer Enemies, Background Elements
  - Extracted to `public/assets/raw-packs/` (5,161 PNGs, 125MB)
  - Created `ASSET-MANIFEST.md` with 141 assets across 4 priority levels
  - Directory structure set up: `actors/`, `props/`, `backdrops/`, `reactions/`, `effects/`, `ui/`, `sfx/`
  - Still needed: select & rename best assets per vocab key, source gaps (monster, trex, octopus, squirrel), create custom SVGs for missing props

**End of Day 1 Gate:** ✅ Phaser scene loads, Claude returns valid JSON for "throw a huge cake"

---

## **Day 2 (Tuesday): The Core Loop**
**Goal:** Input → Claude → Animation → Celebration works end-to-end

### Morning (4 hours)
- [ ] **Create Monster Party Phaser scene** (`src/game/scenes/MonsterPartyScene.ts`)
  ```typescript
  export class MonsterPartyScene extends Phaser.Scene {
    preload() {
      // Load all assets
      this.load.image('bg-party', 'assets/backdrops/party-room.png');
      this.load.image('monster', 'assets/actors/monster.png');
      this.load.image('cake', 'assets/props/cake.png');
      this.load.image('cake-giant', 'assets/props/cake-giant.png');
      this.load.image('balloon', 'assets/props/balloon.png');
    }

    create() {
      // Set backdrop
      this.add.image(512, 384, 'bg-party');

      // Spawn monster at center
      this.monster = this.add.image(512, 400, 'monster').setScale(1.5);

      // Listen for scene scripts from React
      EventBus.on('play-script', this.playScript, this);
    }

    playScript(script: SceneScript) {
      // Execute actions sequentially
      this.executeActions(script.actions);
    }
  }
  ```

- [ ] **Build Scene Script Player** (`src/game/SceneScriptPlayer.ts`)
  - Create class with `async executeActions(actions: Action[])`
  - Implement action types: `spawn`, `move`, `animate`, `react`
  - Use Phaser tweens for movement
  - Return promises that resolve when complete

### Afternoon (4 hours)
- [ ] **Wire EventBus** (use the existing one from template)
  - React calls: `EventBus.emit('play-script', sceneScript)`
  - Phaser listens: `EventBus.on('play-script', this.playScript, this)`

- [x] **Build game-themed React UI** (`src/App.tsx`)
  - Fredoka + Nunito fonts, quest-* color palette, glow effects
  - Game-style tab buttons, gold gradient submit button
  - Voice button embedded in textarea, kid-friendly result bubbles

### Evening (2 hours)
- [ ] **Test the full loop 10 times** with varied inputs:
  - "throw a huge cake"
  - "have a birthday party with cake and balloons"
  - "give the monster a party"
  - "throw cake" (partial)
  - "make monster happy" (vague)

- [ ] **Add confetti celebration** - install `react-confetti`, fire on FULL_SUCCESS

**End of Day 2 Gate:** ✅ Type input → Claude → cake animates → monster reacts → confetti

---

## **Day 3 (Wednesday): Cache + Feedback**
**Goal:** Instant cached responses, prompt feedback panel

### Morning (4 hours)
- [ ] **Build response cache system** (`src/services/cache.ts`)
  ```typescript
  // In-memory cache for demo
  const CACHE: Record<string, Record<string, SceneScript>> = {};

  export function getCachedResponse(taskId: string, input: string): SceneScript | null {
    const normalized = input.toLowerCase().trim();

    // Exact match
    if (CACHE[taskId]?.[normalized]) {
      return CACHE[taskId][normalized];
    }

    // Fuzzy match (keyword overlap)
    return fuzzyMatch(taskId, normalized);
  }

  export function saveToCache(taskId: string, input: string, script: SceneScript) {
    if (!CACHE[taskId]) CACHE[taskId] = {};
    CACHE[taskId][input.toLowerCase().trim()] = script;
  }
  ```

- [ ] **Add three-tier response resolver** (`src/services/resolver.ts`)
  ```typescript
  export async function resolveResponse(taskId: string, input: string) {
    // Tier 1: Cache
    const cached = getCachedResponse(taskId, input);
    if (cached) return { script: cached, source: 'cache' };

    // Tier 2: Live API
    try {
      const script = await evaluateInput(taskId, input);
      saveToCache(taskId, input, script);
      return { script, source: 'live' };
    } catch (error) {
      console.warn('Claude API failed:', error);
    }

    // Tier 3: Fallback
    return {
      script: FALLBACK_SCRIPTS[taskId],
      source: 'fallback'
    };
  }
  ```

### Afternoon (3 hours)
- [ ] **Build prompt feedback panel** (`src/components/FeedbackPanel.tsx`)
  ```tsx
  function FeedbackPanel({ script }: { script: SceneScript }) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <Badge variant={script.success_level === 'FULL_SUCCESS' ? 'success' : 'warning'}>
            {script.success_level.replace('_', ' ')}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{script.feedback}</p>

          {script.success_level === 'PARTIAL_SUCCESS' && (
            <div className="mt-2 p-2 bg-yellow-50 rounded">
              <p className="text-xs font-semibold">💡 Try adding:</p>
              <ul className="text-xs list-disc pl-4">
                {script.missing_elements?.map(el => <li key={el}>{el}</li>)}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  ```

- [ ] **Add to UI**, show after animation completes

### Evening (3 hours)
- [ ] **Pre-cache 10 responses manually**
  - Run through common inputs
  - Call Claude API
  - Save to `src/data/demo-cache.json`
  - Load on app startup

**End of Day 3 Gate:** ✅ Cached inputs return instantly, feedback shows concrete tips

---

## **Day 4 (Thursday): Polish + Second Task (Conditional)**
**Goal:** Monster Party is bulletproof. Start Robot Pizza if time allows.

### Morning (4 hours)
- [ ] **Monster Party polish**
  - Test 20+ edge cases
  - Add error boundary around Phaser
  - Handle malformed Claude responses gracefully
  - Add loading states (Lottie "thinking" animation or simple spinner)
  - Test on slow network (Chrome devtools throttling)

- [x] **Add voice input button** (optional, Chrome-only)
  - Compact icon inside textarea, pulse animation when listening
  - Web Speech API with graceful fallback (hides if unsupported)

### Afternoon (4 hours)
**Decision point:** Is Monster Party flawless? If YES → continue. If NO → stop and fix it.

- [ ] **Create Robot Pizza scene** (`src/game/scenes/RobotPizzaScene.ts`)
  - Simpler than Monster Party (learn from Day 2)
  - City backdrop, robot, pizza, obstacles
  - 4-5 actions max

- [ ] **Write system prompt** for Robot Pizza
- [ ] **Test with 10 inputs**

**End of Day 4 Gate:** ✅ Monster Party is demo-ready. Robot Pizza works (if you got there).

---

## **Day 5 (Friday): Deploy + Stress Test**
**Goal:** Deployed to Vercel, no broken states discoverable

### Morning (3 hours)
- [ ] **Deploy to Vercel**
  ```bash
  npm install -g vercel
  vercel --prod
  ```
  - Set environment variable: `VITE_ANTHROPIC_API_KEY`
  - Test deployed URL on Chrome

- [x] **Add task selector** (header nav with 2 tasks)
  - Game-style tab buttons with glow on active, emoji + label
  - Switches Phaser scene + resets state via Zustand

### Afternoon (4 hours)
- [ ] **Stress test with weird inputs**
  - Empty string
  - 500 character essay
  - Gibberish: "asdfasdf"
  - Unrelated: "what is 2+2?"
  - Non-English: "¿Cómo estás?"

- [ ] **Verify all failure modes are handled gracefully**
  - Claude API timeout → fallback
  - Bad JSON → fallback
  - Missing asset → skip action, don't crash

### Evening (3 hours)
- [ ] **Test on multiple browsers**
  - Chrome (primary)
  - Firefox (text input should work)
  - Safari (text input should work)

- [ ] **Test on mobile** (optional, but check responsive layout)

**End of Day 5 Gate:** ✅ Deployed, tested, no crashes discoverable in 30 min free-play

---

## **Day 6 (Saturday): The Golden Response Cache**
**Goal:** Pre-compute 20-30 Opus responses for bulletproof demo

### Morning (4 hours)
- [ ] **Build cache generation script** (`scripts/build-cache.ts`)
  ```typescript
  const DEMO_SCENARIOS = {
    'monster-party': [
      // Full success variations
      'throw a giant birthday cake with balloons and music',
      'have a party with huge cake decorations and entertainment',
      'give monster a big party with cake balloons presents',

      // Partial success
      'throw a cake',
      'have a party',
      'give monster cake',

      // Funny fails
      'make monster happy',
      'do something fun',
      'party time',

      // Edge cases
      'throw the biggest most amazing cake ever with confetti',
    ],
    'robot-pizza': [
      // ... similar structure
    ]
  };

  async function buildCache() {
    const cache: any = {};

    for (const [taskId, inputs] of Object.entries(DEMO_SCENARIOS)) {
      cache[taskId] = {};

      for (const input of inputs) {
        console.log(`Generating: ${taskId} → "${input}"`);

        const script = await evaluateInput(taskId, input);
        cache[taskId][input.toLowerCase()] = script;

        await new Promise(r => setTimeout(r, 1000)); // Rate limit
      }
    }

    fs.writeFileSync(
      'src/data/demo-cache.json',
      JSON.stringify(cache, null, 2)
    );

    console.log(`✅ Generated ${Object.values(cache).flatMap(Object.keys).length} responses`);
  }
  ```

- [ ] **Run the script** - let it generate for 20-30 minutes
- [ ] **Load cache on app startup** (`src/services/cache.ts`)

### Afternoon (4 hours)
- [ ] **Final bug fixes** based on Day 5 testing
- [ ] **Add simple analytics** (log to console):
  - Which tier served the response (cache/live/fallback)
  - Response time
  - Success level distribution

- [ ] **Optimize asset loading**
  - Compress PNGs if they're large
  - Verify all assets under 100KB each
  - Test cold start load time

### Evening (2 hours)
- [ ] **Create fallback responses** for each task
  ```typescript
  const FALLBACK_SCRIPTS = {
    'monster-party': {
      success_level: 'PARTIAL_SUCCESS',
      narration: 'The monster tries to party, but something feels incomplete!',
      actions: [
        { type: 'spawn', actor: 'cake', position: 'left' },
        { type: 'move', actor: 'cake', to: 'center' },
        { type: 'animate', actor: 'monster', anim: 'confused' }
      ],
      feedback: 'Try describing what KIND of party the monster should have!'
    }
  };
  ```

**End of Day 6 Gate:** ✅ Cache loaded with 20+ responses, deployed version uses cache

---

## **Day 7 (Sunday): Demo Prep**
**Goal:** Pitch practiced, backup video recorded, pre-demo checklist complete

### Morning (3 hours)
- [ ] **Record backup demo video** (2-3 minutes)
  - Use QuickTime Screen Recording (Mac) or OBS (cross-platform)
  - Show the full flow: task select → type input → animation → feedback → retry → success
  - Add voiceover explaining what's happening
  - Export as MP4

- [ ] **Write 2-minute pitch script** (see below)
- [ ] **Practice pitch 3 times** out loud, time yourself

### Afternoon (3 hours)
- [ ] **Create simple pitch deck** (3-5 slides max)
  - Slide 1: Title + tagline
  - Slide 2: The problem (kids need AI literacy, current tools are chat interfaces)
  - Slide 3: The solution (learn through play, AI is invisible)
  - Slide 4: Tech showcase (Opus 4.6 + vocabulary contract + cache)
  - Slide 5: Demo (screenshot or live)

- [ ] **Prepare GitHub README** with:
  - Project description
  - Screenshots
  - How to run locally
  - Tech stack

### Evening (4 hours - take it easy)
- [ ] **Run pre-demo checklist** (see below)
- [ ] **Sleep 8 hours** - seriously

---

## 🎤 2-Minute Pitch Script

```
[Slide 1: Title]
"Hi, I'm Drew. I built Prompt Quest."

[Slide 2: Problem]
"I have a daughter, and I realized - every AI tool for kids is just
ChatGPT with a cute skin. Kids are chatting WITH AI, not learning
HOW to work with AI. So I asked: what if AI was invisible? What if
it was the game engine?"

[Slide 3: Solution]
"Prompt Quest teaches prompt engineering through gameplay. Kids solve
puzzles by describing solutions. Claude interprets their input and
brings it to life through animation."

[Slide 4: Demo]
"Let me show you. This is the Monster Birthday Party task."

[Type: "have a party"]
"Partial success - the monster gets a tiny cake and looks confused.
See the feedback? It explains what's missing - but as game advice,
not abstract prompting tips."

[Type: "throw a giant birthday cake with balloons and music"]
"Full success - huge cake flies across the screen, monster catches it,
balloons appear, happy dance, confetti everywhere."

[Slide 5: Tech]
"What's powering this? Claude Opus 4.6. I'm using the 1M context window
to hold the entire game vocabulary - every actor, prop, animation the
game can reference. This ensures Claude never hallucinates assets that
don't exist. For demo reliability, I pre-cached 30 responses so there's
zero API latency."

"Kids are learning prompt literacy - specificity, completeness, clarity -
through play, not lectures. And they don't even know they're learning.
That's the magic."

[End]
```

**Time yourself. Cut to fit 2 minutes exactly.**

---

## ✅ Pre-Demo Checklist (Run 30 min before)

```
[ ] Open Chrome (NOT Firefox, NOT Safari for voice demo)
[ ] Navigate to deployed Vercel URL
[ ] Verify app loads (see game scene + input box)
[ ] Test cached input: "throw a giant cake with balloons" → works instantly
[ ] Test voice button (Chrome only) → mic permission granted
[ ] Check confetti fires on full success
[ ] Test feedback panel appears on partial success
[ ] Close all other tabs
[ ] Disable notifications (do-not-disturb mode)
[ ] Maximize browser window
[ ] Have backup video loaded in separate tab
[ ] Have pitch deck open
[ ] Charge laptop to 100%
[ ] Mute Slack/Discord
[ ] Take 3 deep breaths
```

---

## 🚨 Emergency Fallback Plans

### If Claude API is down during demo:
- **You're fine** - cache serves everything
- Mention: "Running on pre-cached Opus responses for demo speed"

### If Vercel is slow:
- Run local dev server: `npm run dev`
- Switch to `localhost:5173` in browser

### If Phaser breaks on stage:
- Play backup demo video
- Narrate over it: "Here's what happens when..."

### If you run out of time:
**Cut in this order:**
1. Robot Pizza task (focus on Monster Party only)
2. Voice input button (text input is enough)
3. Second prompt feedback tip (keep it minimal)
4. Fancy animations (static images + tweens are fine)

**Never cut:**
- The core input → Claude → animation loop
- The Golden Response Cache
- Monster Birthday Party task

---

## 📊 Time Budget Summary

| Day | Hours | Focus |
|-----|-------|-------|
| 1 | 10h | Foundation (Phaser + Claude working) |
| 2 | 10h | Core loop (input → animation → celebration) |
| 3 | 10h | Cache system + feedback panel |
| 4 | 8h | Polish + second task (conditional) |
| 5 | 10h | Deploy + stress test |
| 6 | 10h | Golden cache generation |
| 7 | 10h | Demo prep + rest |
| **Total** | **68h** | ~10h/day over 7 days |

**Budget for emergencies:** If you hit a blocker, you have ~12 hours of buffer by cutting scope.

---

## 🎯 North Star Metric

**One perfect interaction that makes someone smile.**

If you demo ONE loop where:
1. User types something creative
2. Claude interprets it correctly
3. Phaser animates it beautifully
4. User laughs or says "oh cool!"

**You win.**

Everything else is in service of this moment. Build backwards from it.

---

## 🔥 Final Solo Dev Wisdom

- **Ship > Perfect** - A working demo beats a beautiful idea
- **Cache = Sleep** - Pre-cache everything, demo without fear
- **Cut ruthlessly** - 1 polished task > 2 buggy tasks
- **Trust the process** - This roadmap has buffer built in
- **Rest on Day 7** - A rested demo beats an exhausted one

**You got this. Now go build.** 🚀
