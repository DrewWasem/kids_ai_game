# Prompt Quest — Comprehensive Design & Execution Document

> **Generated:** February 12, 2026
> **Project:** Prompt Quest — AI-powered game teaching kids (ages 7-11) prompt engineering through play
> **Hackathon:** Claude Code Hackathon (Feb 10-16, 2026)
> **Developer:** Drew (solo)

---

## Table of Contents

1. [The Big Picture: What Prompt Quest Teaches](#1-the-big-picture)
2. [Zone-by-Zone Breakdown](#2-zone-by-zone-breakdown)
3. [Alignment with Digital Literacy, AI Literacy & Child Development](#3-alignment-with-literacy-standards)
4. [Iterative Steps Within Each Zone](#4-iterative-steps-within-each-zone)
5. [Full Zone Walkthroughs (Prompts, Answers, Visuals)](#5-full-zone-walkthroughs)
6. [How All Zones Teach One Common Goal](#6-how-all-zones-teach-one-common-goal)
7. [Current Execution Status](#7-current-execution-status)
8. [Agent & Skill Inventory with Gap Analysis](#8-agent--skill-inventory-with-gap-analysis)
9. [Recommendations](#9-recommendations)
10. [Modified Execution Plan](#10-modified-execution-plan)

---

## 1. The Big Picture

### What Is Prompt Quest?

Prompt Quest is a 3D medieval village where children (ages 7-11) walk between quest zones and type natural language descriptions to make things happen on screen. Each zone teaches a specific **prompt engineering skill** — the ability to communicate clearly and precisely with AI systems.

### The Core Loop

```
Child reads quest challenge
    → Types a description (natural language)
        → AI interprets it and generates a scene script
            → 3D characters and props act it out on screen
                → Child sees what their words produced
                    → Feedback helps them refine their description
                        → They try again (iterative improvement)
```

### The Single Success Metric

**One perfect interaction that makes someone smile.**

A child types something creative → Claude interprets it → a 3D scene plays out → the child laughs or feels proud. Everything in this document serves that moment.

### What We're Really Teaching

We never say "prompt engineering" to kids. We never use the word "prompt." Instead, we teach them to **describe things clearly** — a skill that transfers directly to:

- Communicating with AI tools (ChatGPT, Claude, DALL-E, etc.)
- Writing clear instructions for any audience
- Breaking complex ideas into specific, actionable steps
- Thinking from multiple perspectives
- Working creatively within constraints

---

## 2. Zone-by-Zone Breakdown

The village contains **7 quest zones** arranged in a circular ring around a medieval village center. Each zone teaches one skill, building from foundational to advanced:

| Order | Zone | Skill Taught | Metaphor | Location |
|-------|------|-------------|----------|----------|
| 1 | Skeleton's Surprise Birthday | **Specificity** | "Paint the Picture" | North [0, 0, -55] |
| 2 | Skeleton's Pizza Disaster | **Completeness** | "Don't Forget the List" | SE [25, 0, 25] |
| 3 | Mage vs. The Cursed Kitchen | **Context** | "Set the Scene" | West [-35, 0, 0] |
| 4 | Barbarian's First Day of School | **Step-by-Step** | "First This, Then That" | East [35, 0, 0] |
| 5 | Knight's Accidental Space Mission | **Perspective** | "Think Like Them" | NE [25, 0, -25] |
| 6 | Dungeon Rock Concert | **Creative Constraints** | "Color Inside the Lines" | SW [-25, 0, 25] |
| 7 | Adventurers' Disastrous Picnic | **Integration** | "Master Prompter" | South [0, 0, 35] |

### Skill Progression Logic

The 7 skills form a deliberate ladder:

- **Skills 1-2 (Specificity, Completeness):** Core fundamentals. Most children's prompts fail because they're too vague or leave out key details. These zones teach the baseline.
- **Skills 3-4 (Context, Step-by-Step):** Structural thinking. Understanding that WHO/WHERE/WHAT-SITUATION matters, and that ORDER affects outcomes. This separates "okay" descriptions from "great" ones.
- **Skills 5-6 (Perspective, Constraints):** Advanced reasoning. Thinking about the viewpoint of who's reading your description, and creating solutions within specific limitations. These require abstract thought.
- **Skill 7 (Integration):** Capstone. Combines all 6 prior skills in a single multi-stage challenge. The "final exam."

---

## 3. Alignment with Literacy Standards

### Digital Literacy Alignment

| Skill | Digital Literacy Connection | Real-World Transfer |
|-------|---------------------------|-------------------|
| Specificity | **Precise search queries** — typing "red Nike running shoes size 6" vs. "shoes" | Google searches, Amazon filters, voice assistants |
| Completeness | **Complete task descriptions** — including all requirements in a request | Filing forms, writing emails, submitting work orders |
| Context | **Situational awareness** — knowing WHAT tool you're using changes HOW you communicate | Choosing the right app for the task, adapting tone for audience |
| Step-by-Step | **Algorithmic thinking** — understanding sequence and dependencies | Following/writing recipes, assembly instructions, code |
| Perspective | **Audience awareness** — the receiver interprets based on THEIR knowledge | Writing for different audiences, empathy in communication |
| Constraints | **Working within systems** — every tool has limitations, creativity thrives in structure | Character limits (Twitter), format requirements (school papers), budget constraints |
| Integration | **Complex communication** — combining multiple skills for sophisticated output | Professional emails, project proposals, creative writing |

### AI Literacy Alignment (ISTE Standards)

Prompt Quest directly addresses emerging AI literacy frameworks:

| ISTE AI Competency | How Prompt Quest Teaches It |
|--------------------|---------------------------|
| **Understand AI capabilities** | Children see that AI interprets their words literally — vague input = unpredictable output |
| **Effective human-AI interaction** | Each zone teaches a different aspect of communicating clearly with AI |
| **Iterative refinement** | The 3-stage structure within each zone IS the iteration loop |
| **Critical evaluation of AI output** | Children see the result and decide if it matches their intent |
| **Ethical AI use** | Brand voice never blames the child; AI is a collaborative partner, not an authority |

### Early Childhood Development Alignment

| Development Principle | Application in Prompt Quest | Framework |
|----------------------|---------------------------|-----------|
| **Concrete operational stage** (ages 7-11) | All tasks use physical, tangible scenarios (parties, kitchens, schools) — never abstract concepts | Piaget |
| **Zone of Proximal Development** | 3 progressive hints per stage guide children from "can't do alone" to "can do with help" to "can do independently" | Vygotsky |
| **Scaffolded learning** | Stages move from simple (1 element) to complex (3+ elements), hints provide decreasing support | Wood, Bruner & Ross |
| **Intrinsic motivation** | Comedy-first design — funny failures are MORE entertaining than success, removing fear of "wrong answers" | Self-Determination Theory (Deci & Ryan) |
| **Growth mindset framing** | Feedback says "try adding X" never "you forgot X" — framing improvement as discovery, not correction | Dweck |
| **Multi-modal learning** | Visual (3D scene), linguistic (typed input), auditory (TTS narration, SFX), kinesthetic (clicking, typing) | Gardner |
| **Immediate feedback loop** | Child types → scene plays in <2 seconds → cause and effect is visceral and instant | Behaviorist reinforcement |
| **Safety & trust** | NEVER red for failure, NEVER "wrong/failed/error", failure = comedy, brand voice = encouraging older sibling | NAEYC / COPPA |

### Age-Appropriate Design (7-11)

| Design Choice | Developmental Reason |
|--------------|---------------------|
| Max 20-word narrations | Working memory capacity at age 7-8 is ~5-7 chunks; short sentences reduce cognitive load |
| 300-character input limit | Prevents overwhelm; encourages concise thinking |
| 3 hints per stage | Provides enough scaffolding without creating dependency |
| Physical/silly scenarios | Concrete operational children reason best about tangible situations |
| No abstract skill labels | "Paint the Picture" not "Specificity" — metaphors over terminology |
| Comedy-first failure | Ages 7-11 are developing self-concept; punitive failure damages motivation |
| 3 stages per zone | Attention span of ~15-20 minutes per activity; 3 stages × ~5 min = one full session |

---

## 4. Iterative Steps Within Each Zone

### Universal 3-Stage Structure

Every zone (except the capstone) follows the same 3-stage pattern. This consistency helps children build a mental model of how the game works, reducing cognitive load as content complexity increases.

```
STAGE 1: "The Simple Version"
  Goal: Introduce the core concept with a low-complexity challenge
  Teaches: The BASIC form of the skill
  Elements needed: Usually 1-2 specific things
  Success feels: "Oh, I get it!"

STAGE 2: "Now Make It Harder"
  Goal: Apply the skill with more complexity and nuance
  Teaches: The APPLIED form of the skill
  Elements needed: Usually 2-3 things working together
  Success feels: "I can do this AND that!"

STAGE 3: "The Grand Finale"
  Goal: Combine the skill with creativity under pressure
  Teaches: The MASTERED form of the skill
  Elements needed: 3+ elements with style/personality
  Success feels: "I'm good at this!"
```

### How Each Stage Contributes to the Overall Goal

```
Stage 1 → Builds AWARENESS ("this matters")
Stage 2 → Builds COMPETENCE ("I can do this")
Stage 3 → Builds CONFIDENCE ("I own this skill")
                    ↓
         Zone complete → Skill unlocked
                    ↓
         Next zone adds a NEW skill
                    ↓
         Zone 7 combines ALL skills
                    ↓
     Child can write effective AI prompts
```

### The Hint System (Scaffolded Support)

Each stage provides 3 progressive hints following Vygotsky's scaffolding principle:

| Hint Level | Strategy | Example (Skeleton Birthday, Stage 1) |
|-----------|----------|--------------------------------------|
| **Hint 1** | General nudge — points to the right area without giving the answer | "Hmm, who do you want at this party? Can you name specific characters?" |
| **Hint 2** | Specific suggestion — provides concrete options to choose from | "What if you said which adventurers should come? Like the knight, the mage, or the rogue?" |
| **Hint 3** | Near-answer — almost tells them what to type, last resort before they succeed | "The more people you name, the bigger the party gets! Who else should show up?" |

### The Success Rating System

Every response is classified into one of three levels:

| Level | What It Means | Visual Response | Sound | Badge |
|-------|--------------|-----------------|-------|-------|
| **FULL_SUCCESS** | Child included all required elements with specificity | Full scene plays with celebration effects | Success chime | "Amazing!" with star |
| **PARTIAL_SUCCESS** | Child got some elements but missed others | Partial scene plays, missing elements noted | Partial sound | "Almost!" with lightbulb |
| **FUNNY_FAIL** | Input was too vague, off-topic, or nonsensical | Hilarious unintended consequence plays out | Comedy sound | "Oops!" with laugh |

**Critical design rule:** FUNNY_FAIL must be funnier and more entertaining than FULL_SUCCESS. This removes the fear of failure entirely. Children often deliberately type silly things to see what happens — and that's a feature, not a bug.

---

## 5. Full Zone Walkthroughs

### Zone 1: Skeleton's Surprise Birthday Party

**Skill:** Specificity — "Paint the Picture"
**Teaching Goal:** More details = better results. Vague descriptions = funny/unpredictable outcomes.
**Visual Setting:** Dungeon courtyard with stone walls, torches, barrels, pillars, orange torch glow lighting.

**Characters Available:** skeleton_warrior (birthday boy), skeleton_mage, skeleton_minion (×4), knight, mage, rogue
**Props Available:** table_long, chairs, torches, barrels, banners (blue/red), presents, cake_birthday, cupcakes, balloons

---

#### Stage 1: "Who's Invited?"

**Question shown to child:** "Tell the skeleton WHO should come to the birthday party. Be as specific as you can!"

**What this teaches:** Naming specific characters instead of saying "everyone" or "some friends." The more characters you name, the more appear on screen.

**Correct Answers (FULL_SUCCESS):**

| Example Input | Why It Works | Visual Result |
|--------------|-------------|---------------|
| "Invite the knight, the mage, and the rogue! The knight brings his shield, the mage does sparkly magic, and the rogue sneaks in with presents." | Names 3 specific characters + describes what each does | Knight enters left waving, mage enters right with sparkle-magic effect, rogue sneaks in from off-right. Confetti burst at center. Skeleton cheers. |
| "The skeleton mage and four skeleton minions should come. They're all his dungeon friends and they can do a skeleton dance together!" | Names specific characters + quantity + activity | Skeleton_mage spawns left, 4 skeleton_minions spawn in stagger. All do Skeletons_Taunt animation. Stars-spin effect. |
| "The knight in shiny armor, the sneaky rogue who hides behind barrels, and the mage who shoots sparkle spells. They should all wave hello when they arrive." | Names 3 characters + personality traits + arrival action | Knight, rogue, mage enter from sides with Waving animation. Confetti-burst at center. |
| "The knight and skeleton mage are best friends so they should come in together from the left side. Then the rogue sneaks in from the right with a surprise gift." | Names characters + relationship + entry directions + props | Knight and skeleton_mage spawn left together. Rogue enters from off-right. Present spawns. Hearts-float effect. |

**Partial Answers (PARTIAL_SUCCESS):**

| Example Input | What's Missing | Visual Result | Feedback |
|--------------|---------------|---------------|----------|
| "Invite some friends" | No SPECIFIC characters named | Skeleton_warrior spawns alone at center, looks around confused. Question-marks effect. | "Good start! But WHICH friends? Try naming the actual characters — like the knight or the mage!" |
| "The knight should come" | Only 1 character, no description of what they do | Knight enters from left, walks to center. Skeleton waves. Partial celebration. | "Nice, you named one guest! Can you invite more people and describe what they do when they arrive?" |
| "Bring everyone to the party with decorations" | "Everyone" is vague, mentions decorations (Stage 2 topic) | A couple characters spawn randomly. Some props appear. | "You mentioned decorations — cool! But who exactly is 'everyone'? Name the characters!" |

**Wrong/Silly Answers (FUNNY_FAIL):**

| Example Input | What Happens Visually | Feedback |
|--------------|----------------------|----------|
| "party" | Skeleton_warrior stands alone in empty dungeon, confetti falls on just him. He does a sad little dance. Sad-cloud effect. | "The skeleton threw a party for... nobody! WHO should come? Describe your guests!" |
| "make a sandwich" | Skeleton_warrior tries to make a sandwich on the dungeon floor. A barrel rolls across. Laugh-tears effect. | "Ha! Sandwiches are great, but this is a birthday party! Who should the skeleton invite?" |
| "yes" | Skeleton_warrior looks confused, shrugs, sits down. Question-marks effect floats above him. | "The skeleton is confused! Try saying something like: 'Invite the knight and the mage to the party!'" |

**Actions/Movement Breakdown for Stage 1:**

| Action | Characters/Props | Position | Animation | Effect |
|--------|-----------------|----------|-----------|--------|
| spawn | skeleton_warrior (always present) | center | Idle_A | — |
| spawn | Named guests (knight, mage, etc.) | left, right, off-left | Walking_A → Waving | Entrance walk-in |
| animate | Each guest | their position | Waving, Cheering, Idle_B | Character personality |
| react | — | center | — | confetti-burst, sparkle-magic, or hearts-float |
| emote | skeleton_warrior | center | — | "🎉" speech bubble |

---

#### Stage 2: "Decorate the Dungeon!"

**Question:** "Tell the skeleton how to decorate the dungeon for the party. What should it look like?"

**What this teaches:** Specificity applied to OBJECTS and PLACEMENT. "Put up decorations" vs. "Hang blue banners on the left wall and red banners on the right, with torches between them."

**Correct Answers (FULL_SUCCESS):**

| Example Input | Why It Works |
|--------------|-------------|
| "Hang blue and red banners across the walls. Put the long table in the center with chairs on each side. Light all the torches and put barrels of drinks in the corners." | Specific decorations + placement + quantity |
| "Put presents in a big pile on the left. Set up blue banners everywhere and put torches on the walls so it looks spooky-cool. The table goes in the middle with cupcakes on top." | Props + colors + atmosphere + arrangement |

**FUNNY_FAIL Example:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "decorations" | A single banner drops from the ceiling and lands on skeleton_warrior's head. He stumbles around. Laugh-tears effect. | "One banner isn't much of a party! WHAT decorations? WHERE do they go? Paint the picture!" |

**Visual Actions for Stage 2:**
- Props spawn in described positions (banners, tables, torches, barrels, presents)
- Each prop does a bounce entrance animation
- Skeleton_warrior reacts (Cheering when done, or confused if sparse)
- Sparkle-magic or stars-spin effects on completion

---

#### Stage 3: "The Birthday Cake!"

**Question:** "Describe the perfect birthday cake for a skeleton. Where does it go? What happens when it arrives?"

**What this teaches:** Specificity at its peak — describing a single object with detail, placement, and the reaction it creates.

**Correct Answers (FULL_SUCCESS):**

| Example Input | Why It Works |
|--------------|-------------|
| "A giant birthday cake with bones and purple frosting appears on the table in the center. All the skeletons gather around and the skeleton warrior blows out the candles. Everyone cheers!" | Cake description + placement + character reaction + celebration |
| "The mage uses magic to float a huge chocolate cake from the left to the center table. It has candles shaped like bones! The skeleton claps his hands and cupcakes pop up around it." | Movement + description + magic context + secondary props |

**FUNNY_FAIL Example:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "cake" | A tiny cupcake spawns and rolls away. Skeleton chases it. It falls off the table. Sad-cloud effect. | "Just 'cake'? The skeleton needs details! What KIND of cake? How big? Where does it go?" |

---

### Zone 2: Skeleton's Pizza Disaster

**Skill:** Completeness — "Don't Forget the List"
**Teaching Goal:** Leaving out key steps causes failures. A complete plan covers ALL pieces.
**Visual Setting:** Restaurant zone with kitchen counter, oven, dining tables, menu board, warm orange/yellow lighting.

**Characters:** skeleton_warrior, skeleton_rogue, knight, ranger
**Props:** pizza (pepperoni, cheese), table_round, chairs, plates, bench

---

#### Stage 1: "Pick Up the Pizza"

**Question:** "How does the skeleton pick up the pizza? What kind of pizza is it? How does he hold it without his arms falling off?"

**What this teaches:** A COMPLETE description needs THREE things: the pizza type, the carrying method, AND solving the bone problem.

**Correct Answers:**

| Example Input | Elements Covered | Visual |
|--------------|-----------------|--------|
| "The skeleton warrior walks carefully to the counter and picks up a pepperoni pizza. The skeleton rogue ties the skeleton's arms on tight with rope so they don't fall off. He holds the pizza on a plate." | Pizza type ✓ Carrying method ✓ Bone solution ✓ | Skeleton walks to counter (linear), picks up pizza_pepperoni. Rogue helps. Plate spawns. |
| "First the skeleton grabs a big cheese pizza with both hands. But his finger bones are slippery so the rogue holds a plate underneath just in case. The knight stands by the door ready to open it." | Pizza type ✓ Carrying method ✓ Backup plan ✓ | Skeleton grabs pizza_cheese. Rogue with plate. Knight at door position. Sparkle-magic. |

**Partial Answer Example:**
| Input | What's Missing | Feedback |
|-------|---------------|----------|
| "The skeleton picks up the pizza" | Which pizza? How? What about his arms? | "Good, he's picking it up! But WHAT kind of pizza? And how does he hold it with those bony fingers?" |

**FUNNY_FAIL Example:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "pizza" | Skeleton reaches for pizza, arm falls off, pizza slides across floor. Other skeleton slips on it. Laugh-tears. | "The skeleton's arm fell right off! You need a COMPLETE plan — what pizza, how to carry it, and how to keep those bones together!" |

---

#### Stage 2: "The Delivery Route"

**Question:** "Describe the skeleton's delivery route. Where does he go? What obstacles does he face? How does he get past them?"

**What this teaches:** Complete routes need a start, destination, obstacles, AND solutions for each.

#### Stage 3: "The Handoff"

**Question:** "Describe exactly how the skeleton delivers the pizza to the customer. What happens when they get it? Does anything go wrong at the last second?"

**What this teaches:** The final moment needs delivery action, customer reaction, and aftermath — nothing forgotten.

---

### Zone 3: Mage vs. The Cursed Kitchen

**Skill:** Context — "Set the Scene"
**Teaching Goal:** HOW you describe matters. The SITUATION (who, where, what's happening) changes what solutions make sense. A MAGE in a CURSED kitchen needs MAGICAL solutions, not normal ones.
**Visual Setting:** L-shaped kitchen with countertops, stove, fridge, cabinets, warm yellow lighting.

**Characters:** mage, witch, skeleton_minion
**Props:** Kitchen environment (stove, fridge, sink, pots, pans)

---

#### Stage 1: "The Kitchen Is Alive!"

**Question:** "Describe what's happening in the kitchen right now. Who is where? What's going wrong? Give us the full picture!"

**What this teaches:** Context means WHO is involved, WHERE they are, and WHAT'S happening. You need all three.

**Correct Answer Example:**
"The mage is standing on the left side looking scared because the stove on the right is shooting fire. Pots and pans are flying around the center. The fridge door keeps opening and slamming shut on its own."

**Why it works:** Names the character (WHO) + their position and emotion (WHERE/HOW) + the chaos (WHAT) + multiple specific details.

**FUNNY_FAIL Example:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "cook food" | Mage puts hand on cursed stove. Stove explodes. Mage goes flying. Fire-sneeze effect. | "Whoa! You forgot this kitchen is CURSED! Describe the situation first — what's going wrong and who's dealing with it?" |

---

#### Stage 2: "Tame the Stove!"

**Question:** "How does the mage stop the angry stove? Remember: this is a MAGIC kitchen with a CURSED stove. The solution needs to fit the situation!"

**What this teaches:** Solutions must match the CONTEXT. A magic problem needs a magic solution. Telling a mage to "turn the knob" ignores who he is.

**Correct Answer:**
"The mage raises his staff and casts a frost spell from the left toward the stove on the right. The ice magic cools down the stove and puts out the fire. Sparkles appear when the spell works!"

**FUNNY_FAIL Example:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "turn off the stove" | Mage walks over and tries to turn a knob. The knob zaps him. He flies backward. Explosion-cartoon effect. | "This stove is CURSED — it won't listen to normal solutions! Think about the context: you have a MAGE with MAGIC powers. How would HE handle this?" |

---

#### Stage 3: "Save the Dinner!"

**Question:** "How does the mage cook dinner in this magical kitchen? Who helps? What do they make? Remember the context — this is a MAGICAL kitchen!"

---

### Zone 4: Barbarian's First Day of School

**Skill:** Step-by-Step — "First This, Then That"
**Teaching Goal:** ORDER matters. Doing things in the right sequence produces better outcomes. Skipping steps causes chaos.
**Visual Setting:** Playground area with swings, slide, merry-go-round, seesaw, sandbox, fence ring, trees.

**Characters:** barbarian, knight, mage, ranger, rogue
**Props:** desk, chairs, playground equipment

---

#### Stage 1: "Getting Through the Door"

**Question:** "How does the barbarian get into the school building? Describe the steps in order!"

**What this teaches:** Sequence words (first, then, next, finally) and understanding that steps have dependencies.

**Correct Answer:**
"First, the barbarian walks up to the door from the left. Then he tries to squeeze through but gets stuck. Next, the knight pushes him from behind. Finally, he pops through and stumbles to the center!"

**Why it works:** Uses sequence words. Each step depends on the previous one. There's cause-and-effect logic.

**Partial Answer:**
| Input | What's Missing | Feedback |
|-------|---------------|----------|
| "The barbarian goes to school" | No steps, no sequence, no details | "But HOW does he get in? Describe it step by step — first he does THIS, then THAT happens..." |

**FUNNY_FAIL:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "school" | Barbarian runs full speed at the building. Crashes through the wall. Desk flies. Everyone ducks. Explosion-cartoon. | "The barbarian skipped ALL the steps and just charged in! Try describing what happens FIRST, THEN what happens NEXT." |

---

#### Stage 2: "Finding a Seat"

**Question:** "Describe step by step how the barbarian finds a seat and sits down without breaking everything."

#### Stage 3: "Making Friends at Recess"

**Question:** "Step by step, how does the barbarian make a friend at recess? What does he do first, then what?"

**What this teaches:** Social interactions also follow sequences — approach → greet → share → play together.

---

### Zone 5: Knight's Accidental Space Mission

**Skill:** Perspective — "Think Like Them"
**Teaching Goal:** Thinking from someone else's viewpoint changes how you describe things. A medieval knight sees a space station through a completely different lens than an astronaut.
**Visual Setting:** Space zone with landing pad, base modules, tunnels, solar panels, dome, blue/purple accent lighting.

**Characters:** knight, space_ranger
**Props:** basemodule_A, solarpanel, cargo_A, dome

---

#### Stage 1: "Lost in Space!"

**Question:** "The knight is floating around the space station. How does he react to everything he sees? Remember — he thinks in swords and castles!"

**What this teaches:** The same object looks different depending on WHO is looking. Perspective shapes description.

**Correct Answer:**
"The knight floats in looking confused. He sees the dome and thinks it's a giant shield! He tries to pick it up. The solar panels look like dragon wings and he tries to fight them with his sword."

**Why it works:** Every object is filtered through the knight's medieval perspective. A dome becomes a shield. Solar panels become dragon wings.

**FUNNY_FAIL:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "the knight looks around" | Knight just floats, spinning slowly, bumping into things. Question-marks effect. | "Looking around is a start! But HOW does a knight see space stuff? He's never seen solar panels — what would he THINK they are?" |

---

#### Stage 2: "Meeting the Space Ranger"

**Question:** "How do the knight and space ranger meet? The knight thinks in medieval terms. The space ranger thinks in science. How does each see the other?"

**What this teaches:** DUAL perspective — both characters misunderstand each other based on their worldview.

#### Stage 3: "Working Together"

**Question:** "The knight and space ranger need to fix the station together. How does each one help using their own skills and perspective?"

---

### Zone 6: Dungeon Rock Concert

**Skill:** Creative Constraints — "Color Inside the Lines"
**Teaching Goal:** Working within limitations sparks creativity. No instruments exist — you must turn dungeon items INTO instruments!
**Visual Setting:** Stage platform with dungeon walls, decorated pillars, torches, banners, barrels, colorful concert lights (purple, pink, blue).

**Characters:** knight, barbarian, mage, ranger, rogue, skeleton_warrior, clown
**Props:** torches, barrels, banners (blue/red), table_long, chairs

---

#### Stage 1: "Assemble the Band!"

**Question:** "Pick band members and assign each one a dungeon 'instrument.' No guitars or drums exist — only barrels, torches, chairs, and banners!"

**What this teaches:** Creativity within constraints. You CAN'T say "give them a guitar" — you must repurpose what exists.

**Correct Answer:**
"The skeleton warrior is the drummer — he bangs on three barrels! The knight uses a torch as a microphone and sings. The mage waves the blue banner like a rock star flag. The barbarian pounds on the table like a bass drum!"

**Why it works:** Every "instrument" is a real dungeon prop repurposed. The constraint forces creative thinking.

**FUNNY_FAIL:**
| Input | Visual | Feedback |
|-------|--------|----------|
| "give everyone guitars" | Characters look at their empty hands. Someone picks up a barrel and stares at it. Question-marks. | "There are no guitars in a dungeon! Look around — you've got barrels, torches, banners, and chairs. What could you MAKE into instruments?" |

---

#### Stage 2: "Set Up the Stage"

**Question:** "Design the stage using only dungeon stuff. Where does each band member stand? What's the audience seating?"

#### Stage 3: "The Big Performance!"

**Question:** "Describe the concert! What does each band member do? How does the crowd react? Stay within the constraint — only dungeon items!"

---

### Zone 7: Adventurers' Disastrous Picnic (CAPSTONE)

**Skill:** Integration — "Master Prompter"
**Teaching Goal:** Combine ALL skills: specificity, completeness, context, step-by-step, perspective, and creative constraints.
**Visual Setting:** Park zone with tree ring (9 trees), bushes, flowers, fountain, benches, hedges, natural lighting.

**Characters:** knight, barbarian, mage, ranger, rogue (all 5 adventurers)
**Props:** bench, basket, blanket, sandwich, pie, apple, full picnic food set

This zone has **4 stages** instead of 3, as the capstone experience:

---

#### Stage 1: "Setting Up the Picnic"

**Question:** "Describe how each adventurer helps set up the picnic. Who does what? Where does everything go? What's each character's personality like?"

**Skills tested:** Specificity (name characters) + Completeness (all 5 help) + Perspective (personality-driven actions) + Step-by-Step (setup sequence)

**Correct Answer:**
"First, the knight lays the blanket in the center near the fountain. Then the ranger sets up plates and mugs because she's organized. The rogue sneaks over with sandwiches — he probably stole extra. The barbarian carries the heavy stuff: cake and pie. The mage uses sparkle magic to hang apples from tree branches as decoration. Everyone sits down when it's ready."

**Why it works:**
- **Specificity:** Names all 5 characters with specific actions
- **Completeness:** Every character contributes, nothing is left out
- **Context:** A picnic setup, each action fits the setting
- **Step-by-Step:** "First... then... everyone sits when ready"
- **Perspective:** Each character acts according to personality (rogue steals, barbarian carries heavy things)

---

#### Stage 2: "Disaster Strikes!"

**Question:** "Something goes wrong! Describe the disaster step by step: what happens, who is affected, and how does each adventurer react based on their personality?"

**Skills tested:** Step-by-Step (sequential chaos) + Perspective (personality-driven reactions) + Context (disaster fits the setting)

---

#### Stage 3: "Save the Picnic!"

**Question:** "How do the adventurers work together to fix the disaster? Each uses their unique skills. Be specific, complete, and creative!"

**Skills tested:** ALL skills — specificity, completeness, context, step-by-step, perspective, constraints (each uses their OWN skills)

---

#### Stage 4: "The Grand Finale"

**Question:** "Describe the successful picnic ending. Who does what to celebrate? How does each character show happiness in their own way?"

**Skills tested:** Full integration — the victory lap where children demonstrate mastery of all 6 skills in a creative celebration.

---

## 6. How All Zones Teach One Common Goal

### The Common Goal

**Teaching children to communicate effectively with AI systems by writing clear, specific, complete, contextual, ordered, perspective-aware, and creatively constrained natural language descriptions.**

Or more simply: **Teaching kids that WHAT you say and HOW you say it determines what AI does.**

### The Progression Arc

```
Zone 1: "Say WHAT you mean"        (Specificity)
Zone 2: "Say ALL of what you mean"  (Completeness)
Zone 3: "Say WHERE and WHY"         (Context)
Zone 4: "Say it IN ORDER"           (Step-by-Step)
Zone 5: "Say it from THEIR view"    (Perspective)
Zone 6: "Say it WITHIN the rules"   (Constraints)
Zone 7: "Say ALL of it TOGETHER"    (Integration)
```

### How Skills Compound

Each zone doesn't just teach its own skill — it REQUIRES the previous skills:

| Zone | New Skill | Also Requires |
|------|----------|---------------|
| 1 | Specificity | — (foundation) |
| 2 | Completeness | Specificity (complete + specific) |
| 3 | Context | Specificity + Completeness (full picture of the scene) |
| 4 | Step-by-Step | All above (specific, complete steps in context) |
| 5 | Perspective | All above (specific character viewpoints in complete sequences) |
| 6 | Constraints | All above (creative solutions within limits, described specifically) |
| 7 | Integration | ALL SIX skills simultaneously |

### The Real-World Payoff

A child who completes all 7 zones can:
- Write a prompt for ChatGPT that gets a useful answer on the first try
- Describe a picture to DALL-E that generates what they actually imagined
- Give instructions to a voice assistant that are understood correctly
- Write a homework assignment clearly enough for a teacher to understand exactly what they mean
- Explain a game idea to a friend in enough detail to actually play it

---

## 7. Current Execution Status

### What's Built (as of Feb 12, 2026)

| Component | Status | Details |
|-----------|--------|---------|
| 3D Village World | COMPLETE | Hex terrain, 7 zone positions, cobblestone roads, buildings, forest ring, mountains |
| Camera System | COMPLETE | Village follow mode + zone fly-to transitions |
| Scene Player | COMPLETE | 9 action types, zone-relative positioning, error tolerance |
| Character System | COMPLETE | 28 GLBs, 139 animations, SkeletonUtils cloning |
| Prop System | COMPLETE | 87 prop entries, 68 unique models, fuzzy resolution |
| Story Curriculum | COMPLETE | 7 stories, 22 stages, 220 pre-rendered responses |
| Story Matcher | COMPLETE | Fuzzy keyword matching (0.35 threshold) |
| Story Resolver | COMPLETE | StoryResponse → SceneScript conversion pipeline |
| Stage Layout Engine | COMPLETE | 15-slot grid, walk-in conversion, collision avoidance |
| Cache System | COMPLETE | 166 golden entries, fuzzy matching (0.60 threshold) |
| Fallback System | COMPLETE | 13 task-level + 22 stage-level fallback scripts |
| Live API Integration | COMPLETE | Claude Opus 4.6, 12s timeout, JSON parsing |
| Atmosphere System | COMPLETE | Per-zone fog, lighting, sparkles, bloom |
| Sound System | COMPLETE | Web Audio API synthesized SFX (9 sound types) |
| TTS Narration | COMPLETE | SpeechSynthesis with kid-friendly pacing |
| Voice Input | COMPLETE | Web Speech API transcription |
| Loading Screen | COMPLETE | Branded splash with preload trigger |
| PromptInput UI | COMPLETE | Textarea, voice, hints, stage progression, result display |
| TypeScript | CLEAN | 0 errors, strict mode |
| Production Build | PASSING | 655 modules, ~347 kB gzipped |

### What's Remaining (Feb 12-16)

| Task | Priority | Estimated Effort |
|------|----------|-----------------|
| Building scale fix (3.0x → 7.0x) | HIGH | Already done in latest code |
| Zone environment polish (all 7 zones fully decorated) | HIGH | 5 of 7 have basic decoration |
| End-to-end playtesting (all 7 zones × 3 stages) | HIGH | Manual testing needed |
| Voice input testing (Chrome) | MEDIUM | Quick verification |
| Mobile/responsive layout | MEDIUM | Layout exists, needs polish |
| Vercel deployment | HIGH | Final verification |
| Demo video backup recording | HIGH | Safety net for live demo |
| Pitch practice (3x) | HIGH | Presentation prep |
| Cache expansion (more fuzzy matches) | LOW | 166 entries may be sufficient |

---

## 8. Agent & Skill Inventory with Gap Analysis

### Current Agents

| Agent | Purpose | Status | Adequacy |
|-------|---------|--------|----------|
| codebase-researcher | Broad file/structure exploration | ACTIVE | Sufficient |
| codebase-analyzer | Deep code path tracing | ACTIVE | Sufficient |
| memory-locator | Search memory tree | ACTIVE | Sufficient |
| memory-writer | Write/update memory entries | ACTIVE | Sufficient |
| plan-architect | Create implementation plans | ACTIVE | Sufficient |
| implementer | Execute plan tasks | ACTIVE | Sufficient |
| reviewer | Verify spec compliance + quality | ACTIVE | Sufficient |

### Current Skills

| Skill | Purpose | Status | Adequacy |
|-------|---------|--------|----------|
| conductor | Orchestrate R→P→I workflow | ACTIVE | Sufficient |
| planning | Create phased plans | ACTIVE | Sufficient |
| memory | Persistent storage operations | ACTIVE | Sufficient |
| research | Parallel agent investigation | ACTIVE | Sufficient |
| recall | Load context from memory | ACTIVE | Sufficient |
| remember | Persist learnings | ACTIVE | Sufficient |
| recall-context | Session startup context | ACTIVE | Sufficient |
| asset-creator | SVG path creation (legacy) | LEGACY | Not needed for 3D |
| brainstorm | Socratic requirements alignment | ACTIVE | Sufficient |
| start-day | Daily standup | ACTIVE | Sufficient |
| test-prompt | Test system prompts | ACTIVE | Sufficient |
| build-cache | Generate golden cache | ACTIVE | Sufficient |
| pre-demo | Pre-flight checklist | ACTIVE | Critical for deadline |
| implement-plan | Execute plan phases | ACTIVE | Sufficient |
| validate-plan | Verify implementation | ACTIVE | Sufficient |
| create-plan | Create implementation plans | ACTIVE | Duplicate of planning? |

### Current SMEs

| SME | Purpose | Status | Adequacy |
|-----|---------|--------|----------|
| story-writer | Narrative design, comedy | ACTIVE | Critical for content |
| character-director | Character casting, animation | ACTIVE | Sufficient |
| ece-professor | Child development review | ACTIVE | Critical for compliance |
| prompt-writer | System prompt design | ACTIVE | Sufficient |
| child-game-design | Kid UX, brand voice | ACTIVE | Critical for voice |
| 3d-game-development | R3F architecture | ACTIVE | Sufficient |
| 3d-scale-tester | Proportion measurement | ACTIVE | Sufficient |

### Gap Analysis: What's Missing

#### Missing Agent: `playtester`

**Problem:** There is no automated way to simulate a child playing through all 22 stages and verify that every response works visually. Manual testing of 220 responses is impractical for a solo developer with 4 days left.

**Recommendation:** Create a `playtester` agent that:
- Iterates through all 7 stories × 3-4 stages × 10 responses per stage
- For each pre-rendered response, verifies:
  - All referenced actors exist in the block library
  - All referenced props exist in PROP_PATHS
  - All referenced animations exist in the 139-clip set
  - The action count is ≤ 6-8
  - The narration is ≤ 20 words
  - The feedback doesn't contain forbidden words ("prompt", "Great job!", "wrong", "failed", "error")
- Generates a pass/fail report

**Impact:** Catches content bugs (misspelled actor names, non-existent props) before demo day.

#### Missing Agent: `brand-voice-auditor`

**Problem:** With 220 pre-rendered responses + 35 fallback scripts + 166 cache entries, there's a lot of kid-facing text that could violate brand rules. No automated way to check all of it.

**Recommendation:** Create an auditing agent that scans all kid-facing text for:
- Forbidden words: "prompt", "Great job!", "skills", "learning", "wrong", "failed", "error"
- Narration length (> 20 words)
- Exclamation count (> 1 per narration)
- Tone check (does it sound like an encouraging older sibling?)
- Red color references in UI (#FF0000, red, danger, error)

**Impact:** Ensures consistent brand voice across hundreds of text snippets.

#### Missing Skill: `zone-decorator`

**Problem:** The VillageWorld has 7 zone positions but only 2-3 are fully decorated with zone-specific 3D environment props. The remaining zones need environment pieces (walls, furniture, themed props) placed at correct positions and scales.

**Recommendation:** Create a skill that:
- Takes a zone ID and theme description
- References the KayKit asset packs relevant to that theme
- Generates the environment config (positions, rotations, scales for 15-30 props)
- Outputs it in the VillageWorld component format

**Impact:** Completes the visual experience for all 7 zones.

#### Missing Skill: `demo-flow-tester`

**Problem:** The `/pre-demo` skill exists but doesn't actually execute a test flow. It's a checklist, not an automated test.

**Recommendation:** Enhance `/pre-demo` or create `/demo-flow-tester` that:
- Starts the dev server
- Navigates to each zone via Puppeteer
- Submits a test prompt for each stage
- Verifies the response renders without errors
- Takes screenshots for visual comparison
- Reports any broken flows

**Impact:** Automated end-to-end verification before the demo.

#### Potential Gap: `analytics-tracker` (LOW PRIORITY)

**Problem:** No way to track which prompts children actually type during the demo, which zones they visit, or where they get stuck. This data would be valuable for the hackathon pitch ("we tested with 5 kids and here's what we learned").

**Recommendation:** If time permits, add lightweight analytics:
- Log prompt inputs + response sources (cache/API/fallback) to console or localStorage
- Track zone visits and time spent
- Export as JSON for pitch deck data

**Impact:** LOW — nice for pitch but not essential for functioning demo.

### Redundancy/Cleanup Opportunities

| Item | Issue | Recommendation |
|------|-------|---------------|
| `create-plan` skill | Appears redundant with `planning` skill | Verify they're different or merge |
| `asset-creator` skill | Legacy Phaser SVG creator, not needed for 3D | Mark as deprecated or remove |
| `TaskAtmosphere.tsx` | LEGACY — replaced by VillageWorld atmosphere | Can remove to reduce bundle |
| `SceneEnvironment3D.tsx` | LEGACY — zone content now in VillageWorld | Can remove to reduce bundle |
| `TaskIntro.tsx` | LEGACY — replaced by zone transitions | Can remove to reduce bundle |
| Legacy Phaser prompts | `monster-party.ts`, `robot-pizza.ts`, `wizard-kitchen.ts`, `dinosaur-school.ts`, `dog-space.ts`, `octopus-band.ts` | 6 prompt files for deprecated tasks — remove if not in demo |

---

## 9. Recommendations

### Priority 1: Demo-Critical (Do Before Feb 14)

1. **Automated content validation** — Create a script (not necessarily a full agent) that validates all 220 story responses + 35 fallbacks for:
   - Valid actor/prop names
   - Brand voice compliance
   - Narration length
   - Action count limits

2. **Complete zone decoration** — Ensure all 7 zones have themed environments. Currently skeleton-birthday (dungeon) and adventurers-picnic (park) are rich, but others may need more props.

3. **End-to-end playtest** — Manually play through at least 1 full path per zone (3 stages × 1 successful attempt = 21 plays minimum).

### Priority 2: Polish (Feb 14-15)

4. **Expand fuzzy matching** — The story matcher threshold of 0.35 is generous, but test with actual child-like inputs. Kids type things like "make the knight do a cool thing" — does that match anything?

5. **Remove legacy files** — TaskAtmosphere.tsx, SceneEnvironment3D.tsx, TaskIntro.tsx, and legacy Phaser prompts add ~400 lines of dead code. Removing them reduces confusion and bundle size.

6. **Cache gap analysis** — For each stage, identify the 3 most likely "near miss" inputs (things a child would type that DON'T match any pre-rendered response) and either add them to the story responses or ensure the live API handles them well.

### Priority 3: Pitch Enhancement (Feb 15-16)

7. **Demo script** — Write a specific demo script: "First I'll show Zone 1 with a vague prompt, then a specific one. Then I'll skip to Zone 7 to show integration." Know exactly which zones to show and in what order.

8. **Lightweight analytics** — Even just `console.log` statements that track inputs would let you pull up the browser console during Q&A and say "here's what was typed."

9. **Backup recording** — Record a 3-minute video of the perfect demo flow. If anything breaks live, you can switch to video.

### Architectural Recommendations

10. **Consider reducing to 3-4 showcase zones** — 7 zones is ambitious for a hackathon demo. Judges typically see 3-5 minutes of demo. Consider making 3-4 zones the "showcase" and having the others as "bonus content" that exists but isn't part of the main demo flow. Recommended showcase:
    - Zone 1 (Specificity) — simplest, most accessible, shows the core concept
    - Zone 3 (Context) — demonstrates that skills go beyond "just be specific"
    - Zone 6 (Constraints) — most creative, most fun to watch
    - Zone 7 (Integration) — capstone, shows the full vision

11. **Streamline the response pipeline** — The current 4-tier system (Story Matcher → Cache → API → Fallback) is robust but complex. For the demo, consider:
    - Ensuring story matcher catches 90%+ of likely demo inputs
    - Having the presenter use prepared prompts that are guaranteed to hit cache
    - API calls as genuine demo of "live AI" capability

---

## 10. Modified Execution Plan

### Current Plan (Before Gap Analysis)

```
Feb 12: Story curriculum integration ✓, visual regression tests ✓
Feb 13: Building scale fix, zone polish
Feb 14: Playtesting, voice testing
Feb 15: Vercel deployment, demo prep
Feb 16: Pitch practice, submission
```

### Modified Plan (After Gap Analysis)

```
Feb 12 (TODAY):
  □ Run content validation on all 220 responses (brand voice + asset names)
  □ Fix any validation failures found
  □ Remove legacy files (TaskAtmosphere, SceneEnvironment3D, TaskIntro, legacy prompts)
  □ Verify production build still passes after cleanup

Feb 13:
  □ Complete zone decoration for all 7 zones
  □ Playtest Zones 1, 3, 6, 7 (showcase zones) — all 3-4 stages each
  □ Add 5-10 "near miss" responses per showcase zone
  □ Fix any issues found during playtesting

Feb 14:
  □ Full end-to-end test of all 7 zones (at least 1 path each)
  □ Voice input testing (Chrome)
  □ Mobile/responsive spot check
  □ Write demo script (which zones, which prompts, what order)
  □ Deploy to Vercel (staging)

Feb 15:
  □ Vercel production deployment
  □ Record backup demo video (3 min)
  □ Practice pitch 3× with timer
  □ Final cache gap review — add any missing "obvious" inputs
  □ Pre-demo checklist (/pre-demo skill)

Feb 16:
  □ Final deployment verification
  □ Pitch practice 2× more
  □ Submit
```

### Key Differences from Original Plan

1. **Added:** Content validation step (Feb 12) — catches bugs before they become demo-day surprises
2. **Added:** Legacy cleanup (Feb 12) — reduces confusion and bundle size
3. **Added:** Demo script writing (Feb 14) — knowing exactly what to show is as important as building it
4. **Added:** Near-miss response expansion (Feb 13) — fills gaps in fuzzy matching for demo prompts
5. **Shifted:** Playtesting starts Feb 13 (not Feb 14) — more time to fix issues found
6. **Preserved:** All original deadlines (Vercel by Feb 15, pitch practice, backup video)

---

## Appendix A: Visual Reference — Action Types

| Action | What Happens On Screen | Duration |
|--------|----------------------|----------|
| `spawn` | Character/prop appears with bounce animation (scale 0→1.2→1.0) | 300ms |
| `spawn_group` | Multiple actors appear with 150ms stagger between each | 150ms × count |
| `move` | Actor slides/arcs/bounces from current position to target | 600-2500ms (distance-based, ~4 units/sec) |
| `animate` | Character plays a KayKit animation (idle, walk, cheer, wave, etc.) | Variable (600-2000ms typical) |
| `react` | Emoji particle burst (7 emojis explode radially from position) | 2000ms |
| `emote` | Speech bubble with emoji/text appears above actor, fades out | 2000ms |
| `sfx` | Synthesized sound plays (spawn pop, move whoosh, celebration, etc.) | ~500ms |
| `wait` | Pause between actions (nothing visible happens) | Variable |
| `remove` | Actor fades out and is deleted from scene | 500ms |

## Appendix B: Available Effects

| Effect Name | Emojis | When Used |
|------------|--------|-----------|
| confetti-burst | 🎉 🎊 ✨ 🌟 | FULL_SUCCESS celebrations |
| sparkle-magic | ✨ 💜 🔮 | Magic/spell moments |
| hearts-float | 💕 ❤️ 💖 💝 | Friendship/love moments |
| stars-spin | ✨ ⭐ 🌟 💫 | Achievement/wonder |
| explosion-cartoon | 💥 💫 ⭐ | Dramatic comedy moments |
| laugh-tears | 😂 🤣 | FUNNY_FAIL comedy |
| question-marks | ❓ ❔ 🤔 | Confusion/vague input |
| fire-sneeze | 🔥 💨 | Fire/chaos moments |
| splash | 💦 🌊 💧 | Water/spill moments |
| sad-cloud | ☁️ 💧 😢 | Disappointed/lonely moments |

## Appendix C: Key Animation Clips (Most Used)

| Animation | When Used |
|-----------|-----------|
| Idle_A / Idle_B | Default standing, waiting |
| Walking_A / Walking_B | Moving between positions |
| Running_A | Urgent movement |
| Cheering | Celebration, success |
| Waving | Greeting, arrival |
| Sit_Chair_Down / Sit_Chair_Idle | Sitting scenes |
| PickUp | Grabbing items |
| Throw | Tossing items |
| Interact | General object interaction |
| Hit_A / Hit_B | Getting bonked/bumped (comedy) |
| Death_A | Dramatic falls (comedy) |
| Skeletons_Taunt | Skeleton-specific dance/taunt |
| Skeletons_Awaken_Floor | Skeleton rising from ground |
| Ranged_Magic_Spellcasting | Mage/witch casting spells |
| Jump_Full_Short | Jumping in surprise |

## Appendix D: File Reference Map

| Category | Key Files |
|----------|-----------|
| **3D Engine** | `game/R3FGame.tsx`, `game/VillageWorld.tsx`, `game/VillageCamera.tsx`, `game/ScenePlayer3D.tsx` |
| **Characters** | `game/Character3D.tsx`, `game/AnimationController.ts` |
| **Props** | `game/Prop3D.tsx`, `game/ScenePlayer3D.tsx` (PROP_PATHS) |
| **Stories** | `data/stories/*.ts`, `services/story-matcher.ts`, `services/story-resolver.ts` |
| **Prompts** | `prompts/*.ts` (7 task prompts) |
| **Cache** | `data/demo-cache.json`, `services/cache.ts` |
| **Fallbacks** | `data/fallback-scripts.ts` |
| **API** | `services/claude.ts`, `services/resolver.ts` |
| **State** | `stores/gameStore.ts` |
| **UI** | `components/PromptInput.tsx`, `components/LoadingScreen.tsx`, `App.tsx` |
| **Layout** | `services/stage-layout-engine.ts` |
| **Sound** | `game/SoundManager3D.ts` |
| **TTS** | `hooks/useTTS.ts` |
| **Brand** | `.claude/memory/context/brand-brief-v2.md` |
| **Assets** | `public/assets/3d/` (~128MB, 4,270+ models) |
