# Prompt Quest: Story Curriculum & Integration Plan

> Consolidated from `.claude/plans/swirling-dazzling-falcon.md` (curriculum design) and `.claude/plans/story-integration-plan.md` (integration plan).

---

## TABLE OF CONTENTS

1. [Deliverable](#deliverable)
2. [Educational Framework](#part-1-educational-framework)
3. [Story Order & Zone Mapping](#part-2-story-order--zone-mapping)
4. [Complete Story Designs (220 responses)](#part-3-complete-story-designs)
5. [Pre-Rendering & Implementation Summary](#part-4-pre-rendering--implementation-summary)
6. [Asset Audit](#part-5-asset-audit)
7. [Integration Plan](#part-6-integration-plan)

---

## Deliverable

Create TypeScript data files that encode the full curriculum below as importable, type-safe story configs. No intermediate HTML doc — the curriculum goes straight into code.

## Context

Currently each of the 7 quest zones has a single open-ended prompt where the child types anything and gets one response. This plan redesigns every story into a **multi-stage guided experience** where each story teaches a specific prompt engineering skill, each stage asks a focused question, and every possible response is pre-rendered with characters, props, and effects. Children who go off-script receive Socratic guidance hints instead of answers.

---

## PART 1: EDUCATIONAL FRAMEWORK

### Prompt Engineering Skills Ladder (Ages 8-10)

| Level | Skill | Kid-Friendly Name | What It Means |
|-------|-------|-------------------|---------------|
| 1 | **Specificity** | "Paint the Picture" | "have a party" vs "a party with a chocolate cake, 10 blue balloons, and a dancing skeleton" |
| 2 | **Completeness** | "Don't Forget the List" | A pizza delivery needs: the pizza, the route, AND a plan for problems |
| 3 | **Context** | "Set the Scene" | Telling someone to cook vs telling a MAGE in a CURSED kitchen to cook |
| 4 | **Step-by-Step** | "First This, Then That" | Order matters! Can't make friends if you smash the desk first |
| 5 | **Perspective** | "Think Like Them" | A knight in space sees a solar panel as a "dragon wing" |
| 6 | **Creative Constraints** | "Color Inside the Lines (Then Add Sparkles)" | No instruments? Barrels become drums, torches become microphones |
| 7 | **Integration** | "Master Prompter" | All skills combined in one response |

### Progression Philosophy

- **Stories 1-2** (Specificity, Completeness): Foundational — most kid prompts fail because they're too vague or incomplete
- **Stories 3-4** (Context, Step-by-Step): Structural — separates "okay" from "great" prompts
- **Stories 5-6** (Perspective, Constraints): Advanced reasoning — thinking about WHO and WHAT limits exist
- **Story 7** (Integration): Capstone — all skills combined

---

## PART 2: STORY ORDER & ZONE MAPPING

| Order | Zone ID | Story Title | Skill Taught |
|-------|---------|-------------|--------------|
| 1 | `skeleton-birthday` | Skeleton's Surprise Birthday | **Specificity** |
| 2 | `skeleton-pizza` | Skeleton's Pizza Disaster | **Completeness** |
| 3 | `mage-kitchen` | Mage vs. The Cursed Kitchen | **Context** |
| 4 | `barbarian-school` | Barbarian's First Day of School | **Step-by-Step** |
| 5 | `knight-space` | Knight's Accidental Space Mission | **Perspective** |
| 6 | `dungeon-concert` | Dungeon Rock Concert | **Creative Constraints** |
| 7 | `adventurers-picnic` | Adventurers' Disastrous Picnic | **Integration** |

---

## PART 3: COMPLETE STORY DESIGNS

---

## STORY 1: Skeleton's Surprise Birthday Party

**Zone:** `skeleton-birthday` | **Skill:** Specificity — "Paint the Picture"
**Teaching Goal:** More details = better results. Vague instructions produce vague (and funny) outcomes.

**Characters:** skeleton_warrior, skeleton_mage, skeleton_minion (x4), knight, mage, rogue
**Props:** table_long, chair (x4), torch (x4), barrel (x3), banner_blue (x3), banner_red (x3), present (x5), present_B_blue (x3), present_C_green (x3), cake_birthday, cupcake (x4), balloon (x10)

### Stage 1: "Who's Invited?"

**Narrator:** "A skeleton just found out birthdays exist! He wants to throw a party but has no idea who to invite!"

**Question:** "Tell the skeleton WHO should come to the birthday party. Be as specific as you can!"

**FULL_SUCCESS responses (4):**

1. *"Invite the knight, the mage, and the rogue! The knight brings his shield, the mage does sparkly magic, and the rogue sneaks in with presents."*
   - Scene: skeleton_warrior (appear-center, Cheering), knight (enter-left, Waving), mage (enter-right, Ranged_Magic_Spellcasting), rogue (enter-left, Walking_A), present (x3, bounce-in), sparkle-magic
   - Feedback: "Brilliant! You named specific guests AND said what each one does. That's amazing detail!"

2. *"The skeleton mage and four skeleton minions should come. They're all his dungeon friends and they can do a skeleton dance together!"*
   - Scene: skeleton_warrior (appear-center, Skeletons_Taunt), skeleton_mage (enter-left, Skeletons_Walking), skeleton_minion (x4, enter-right), confetti-burst
   - Feedback: "Love it! You told us exactly who AND what they'd do together. Great specificity!"

3. *"Invite the knight in shiny armor, the sneaky rogue who hides behind barrels, and the mage who shoots sparkle spells. They should all wave hello when they arrive."*
   - Scene: skeleton_warrior (appear-center, Waving), knight (enter-left, Waving), rogue (enter-right, Walking_A), mage (enter-left, Waving), barrel (x2, appear), sparkle-magic
   - Feedback: "Perfect! You described each guest with details that make the scene come alive!"

4. *"The knight and skeleton mage are best friends so they should come in together from the left side. Then the rogue sneaks in from the right with a surprise gift."*
   - Scene: skeleton_warrior (appear-center, Cheering), knight (enter-left, Walking_A), skeleton_mage (enter-left, Skeletons_Walking), rogue (enter-right, Walking_A), present (x1, drop-center), stars-spin
   - Feedback: "You told us who, where they enter, and why! That's top-tier specificity!"

**PARTIAL_SUCCESS responses (3):**

5. *"Invite some friends"*
   - Scene: skeleton_warrior (appear-center, Skeletons_Idle), question-marks
   - Feedback: "Good start! But WHICH friends? Try naming the actual characters, like 'the knight' or 'the mage.'"

6. *"The knight should come"*
   - Scene: skeleton_warrior (appear-center, Waving), knight (enter-left, Walking_A)
   - Feedback: "Nice, you named one guest! Can you invite more people and describe what they do?"

7. *"Bring everyone to the party with decorations"*
   - Scene: skeleton_warrior (appear-center, Cheering), knight (enter-left, Walking_A), banner_red (x1, appear)
   - Feedback: "You mentioned decorations -- cool! But who exactly is 'everyone'? Name the characters!"

**FUNNY_FAIL responses (3):**

8. *"party"*
   - Scene: skeleton_warrior (appear-center, Skeletons_Idle), sad-cloud
   - Feedback: "The skeleton needs more to work with! WHO should come? Describe your guests!"

9. *"make a sandwich"*
   - Scene: skeleton_warrior (appear-center, Skeletons_Taunt), question-marks, laugh-tears
   - Feedback: "Ha! Sandwiches are great, but this is a birthday party! Who should the skeleton invite?"

10. *"yes"*
    - Scene: skeleton_warrior (appear-center, Skeletons_Idle), question-marks
    - Feedback: "The skeleton is confused! Try saying something like: 'Invite the knight and the mage to the party!'"

**Guidance Hints:**
- Hint 1: "Hmm, who do you want at this party? Can you name specific characters?"
- Hint 2: "What if you said which adventurers should come? Like the knight, the mage, or the rogue?"
- Hint 3: "The more people you name, the bigger the party gets! Who else should show up?"

---

### Stage 2: "Decorate the Dungeon!"

**Narrator:** "The guests are on their way! But the dungeon looks like... well, a dungeon. It needs decorations!"

**Question:** "Tell the skeleton how to decorate the dungeon for the party. What should it look like?"

**FULL_SUCCESS responses (4):**

1. *"Hang blue and red banners on the walls. Put torches everywhere so the dungeon is bright. Set up a long table in the middle with chairs around it."*
   - Scene: banner_blue (x2, appear-left), banner_red (x2, appear-right), torch (x4, appear), table_long (appear-center), chair (x4, appear)
   - Feedback: "Wow! You told us WHAT decorations, WHERE they go, and HOW MANY. That's incredible detail!"

2. *"Float 10 balloons above the table. Put red and blue banners along the back wall. Light up torches on both sides so everyone can see."*
   - Scene: balloon (x10, float-above), banner_blue (x2, appear), banner_red (x2, appear), torch (x4, appear), table_long (appear-center)
   - Feedback: "You said exactly how many balloons (10!), where the banners go, and how the torches work. Perfect!"

3. *"Stack barrels in the corners for spooky dungeon vibes. Hang the blue banner behind the table. Put four torches along the walls so it's not too dark and not too bright."*
   - Scene: barrel (x3, appear), banner_blue (x2, appear), torch (x4, appear), table_long (appear-center), sparkle-magic
   - Feedback: "Love the specific mood you described! 'Not too dark, not too bright' -- that's great detail!"

4. *"Put a long table in the center. Chairs on both sides for the guests. Red banners everywhere and balloons floating from the ceiling."*
   - Scene: table_long (appear-center), chair (x4, appear), banner_red (x3, appear), balloon (x6, float-above), confetti-burst
   - Feedback: "You covered the table, seating, wall decorations, AND ceiling decorations. Complete picture!"

**PARTIAL_SUCCESS responses (3):**

5. *"Make it look nice"*
   - Scene: torch (x1, appear), question-marks
   - Feedback: "What does 'nice' look like to you? Try describing specific decorations -- banners, balloons, torches?"

6. *"Put some balloons"*
   - Scene: balloon (x3, float-above)
   - Feedback: "Balloons are a great start! How many? And what else should the dungeon have? Tables? Banners?"

7. *"Decorations and lights"*
   - Scene: torch (x2, appear), banner_red (x1, appear)
   - Feedback: "You mentioned the right categories! Now be specific: WHICH decorations? HOW MANY lights? WHERE do they go?"

**FUNNY_FAIL responses (3):**

8. *"paint it"*
   - Scene: skeleton_warrior (appear-center, Skeletons_Taunt), explosion-cartoon, laugh-tears
   - Feedback: "Ha! We can't paint, but we CAN add banners, balloons, torches, and tables! What should the dungeon have?"

9. *"i dont know"*
   - Scene: skeleton_warrior (appear-center, Skeletons_Idle), sad-cloud
   - Feedback: "That's okay! Imagine a party room -- what would you see? Balloons? Banners? A big table?"

10. *"boo"*
    - Scene: skeleton_warrior (appear-center, Hit_A), explosion-cartoon
    - Feedback: "You scared him! Now help him decorate -- try listing things like 'red banners, torches, and a long table.'"

**Guidance Hints:**
- Hint 1: "What would make a dark dungeon look party-ready? Think about what you'd see at a real birthday!"
- Hint 2: "Can you describe specific things to hang on the walls or put on the tables?"
- Hint 3: "How many of each decoration? Where should they go? The more detail, the better the party looks!"

---

### Stage 3: "The Birthday Cake!"

**Narrator:** "Guests? Check. Decorations? Check. But wait -- there's no cake! And you can't have a birthday without cake!"

**Question:** "Describe the perfect birthday cake for a skeleton. Where does it go? What happens when it arrives?"

**FULL_SUCCESS responses (3):**

1. *"A giant birthday cake drops from the ceiling into the center of the table! The skeleton cheers and all the guests wave. Then confetti explodes everywhere!"*
   - Scene: cake_birthday (drop-center), skeleton_warrior (Cheering), knight (Waving), mage (Waving), confetti-burst, stars-spin
   - Feedback: "You described the cake, how it arrives (drops!), where it goes (center table), and what everyone does after. Masterful!"

2. *"The rogue sneaks in from the left carrying a big birthday cake. He puts it on the table. Cupcakes for the skeleton minions bounce in from the right. Everyone cheers!"*
   - Scene: rogue (enter-left, Walking_A), cake_birthday (drop-center), cupcake (x4, bounce-in), skeleton_minion (x4, Cheering), confetti-burst, hearts-float
   - Feedback: "You told a little story: who carries it, where it goes, AND what the others get. Beautiful detail!"

3. *"A huge cake with candles appears in the center. The skeleton walks up to it from the left, and the mage uses sparkle magic to light the candles. Then hearts float everywhere because everyone is happy."*
   - Scene: cake_birthday (appear-center), skeleton_warrior (enter-left, Walking_A), mage (Ranged_Magic_Spellcasting), sparkle-magic, hearts-float
   - Feedback: "You described the cake, the skeleton's reaction, AND the mage's role. Each detail makes the scene richer!"

**PARTIAL_SUCCESS responses (4):**

4. *"Put a cake there"*
   - Scene: cake_birthday (appear-center)
   - Feedback: "The cake is here! But how does it arrive? Who reacts? What happens next? Add more details!"

5. *"birthday cake and cupcakes"*
   - Scene: cake_birthday (drop-center), cupcake (x2, bounce-in)
   - Feedback: "Good food choices! Now describe HOW they arrive and what everyone DOES when they see the cake."

6. *"A big cake falls in and everyone is happy"*
   - Scene: cake_birthday (drop-center), confetti-burst
   - Feedback: "Nice action! But WHO is happy? What do they do? Do they cheer? Wave? Dance?"

7. *"Cake with presents"*
   - Scene: cake_birthday (appear-center), present (x2, bounce-in)
   - Feedback: "Great items! Try adding what the skeleton DOES when he sees the cake. Does he cheer? Jump?"

**FUNNY_FAIL responses (3):**

8. *"eat"*
   - Scene: skeleton_warrior (appear-center, Interact), question-marks
   - Feedback: "Skeletons have trouble eating! Describe what KIND of cake and how it gets to the party."

9. *"no cake"*
   - Scene: skeleton_warrior (appear-center, Hit_A), sad-cloud
   - Feedback: "Oh no, the skeleton is heartbroken! Every birthday needs cake. Describe one for him!"

10. *"a million pizzas"*
    - Scene: skeleton_warrior (appear-center, Skeletons_Taunt), explosion-cartoon, laugh-tears
    - Feedback: "Ha! This is a BIRTHDAY party, not a pizza party! Describe the birthday cake!"

**Guidance Hints:**
- Hint 1: "What does the cake look like? How does it get to the party? Does it drop from the ceiling? Does someone carry it?"
- Hint 2: "When the cake shows up, what does the skeleton do? Does he cheer? Jump? What about the guests?"
- Hint 3: "The best descriptions tell us WHAT happens AND HOW everyone reacts!"

---

## STORY 2: Skeleton's Pizza Disaster

**Zone:** `skeleton-pizza` | **Skill:** Completeness — "Don't Forget the List"
**Teaching Goal:** Leaving out key steps causes failures. A complete plan covers ALL pieces.

**Characters:** skeleton_warrior, skeleton_rogue, knight, ranger
**Props:** pizza (x3), table_round, chair (x4), plate, bench

### Stage 1: "Pick Up the Pizza"

**Narrator:** "The skeleton got a job delivering pizza! First step: pick up the order from the kitchen without dropping any bones!"

**Question:** "How does the skeleton pick up the pizza? What kind of pizza is it? How does he hold it without his arms falling off?"

*The task requires THREE elements: which pizza, how to carry it, keeping bones together.*

**FULL_SUCCESS responses (3):**

1. *"The skeleton warrior walks carefully to the counter and picks up a pepperoni pizza. The skeleton rogue ties the skeleton's arms on tight with rope so they don't fall off. He holds the pizza on a plate."*
   - Scene: skeleton_warrior (enter-left, Walking_A), pizza (appear-center), skeleton_rogue (enter-right, Interact), plate (drop-center), sparkle-magic
   - Feedback: "You covered all three things: the pizza type, how he carries it, AND how to keep his arms attached. Complete plan!"

2. *"It's a cheese pizza sitting on the round table. The skeleton rogue helps balance it on the warrior's head since his hands are wobbly. They tape his finger bones together first."*
   - Scene: skeleton_warrior (appear-center, Interact), skeleton_rogue (enter-left, Interact), pizza (appear-center), table_round (appear), hearts-float
   - Feedback: "Every detail matters: pizza type, carrying method, bone solution. Nothing forgotten!"

3. *"The skeleton warrior picks up a pepperoni pizza from the table. He holds it with both hands super carefully. The skeleton rogue walks behind him to catch any bones that fall."*
   - Scene: skeleton_warrior (enter-left, PickUp), pizza (appear-center), table_round (appear), skeleton_rogue (enter-right, Sneaking), stars-spin
   - Feedback: "Smart! You thought of the pizza, how to hold it, AND a backup plan for falling bones!"

**PARTIAL_SUCCESS responses (4):**

4. *"He picks up a pizza"*
   - Scene: skeleton_warrior (enter-left, Walking_A), pizza (appear-center)
   - Feedback: "He got the pizza! But WHAT kind? And how does he keep his bones from falling apart?"

5. *"The skeleton gets pepperoni pizza from the kitchen"*
   - Scene: skeleton_warrior (enter-left, PickUp), pizza (appear-center)
   - Feedback: "You named the pizza type -- nice! Now, how does he carry it without losing body parts?"

6. *"Tie his arms on with rope"*
   - Scene: skeleton_warrior (appear-center, Interact), sparkle-magic
   - Feedback: "Good bone solution! But you forgot the actual pizza. What kind is it? How does he grab it?"

7. *"Pepperoni pizza and cheese pizza"*
   - Scene: pizza (x2, appear-center)
   - Feedback: "Great pizza choices! Now describe how the skeleton picks them up AND keeps his bones together."

**FUNNY_FAIL responses (3):**

8. *"go"*
   - Scene: skeleton_warrior (enter-left, Running_A), explosion-cartoon, laugh-tears
   - Feedback: "Slow down! The skeleton needs to: 1) Get the pizza, 2) Hold it safely, 3) Keep his bones on."

9. *"eat the pizza himself"*
   - Scene: skeleton_warrior (appear-center, Interact), pizza (appear-center), laugh-tears
   - Feedback: "Ha! He's supposed to DELIVER it, not eat it! How does he pick it up to carry?"

10. *"pizza pizza pizza"*
    - Scene: skeleton_warrior (appear-center, Skeletons_Taunt), question-marks
    - Feedback: "We need more than the word! What KIND, how does the skeleton PICK IT UP, and how does he keep his BONES on?"

**Guidance Hints:**
- Hint 1: "There are three things to figure out: which pizza, how to carry it, and keeping bones from falling. Did you cover all three?"
- Hint 2: "What if his arms fall off? How would you solve that problem?"
- Hint 3: "A complete plan leaves nothing out. Check: pizza type? Carrying method? Bone fix?"

### Stage 2: "The Delivery Route"

**Narrator:** "Pizza secured! Now the skeleton has to deliver it across town. But there are obstacles everywhere!"

**Question:** "Describe the skeleton's delivery route. Where does he go? What obstacles does he face? How does he get past them?"

**FULL_SUCCESS responses (3):**

1. *"The skeleton warrior walks carefully from the restaurant on the left toward the knight waiting on the right. He has to dodge a bench in the middle -- the skeleton rogue pushes it out of the way. The skeleton runs the last bit to deliver it hot!"*
   - Scene: skeleton_warrior (enter-left, Walking_A), knight (appear-right, Waving), bench (appear-center), skeleton_rogue (enter-left, Interact), sparkle-magic, confetti-burst
   - Feedback: "Complete route: start, destination, obstacle, AND solution! Nothing missing!"

2. *"The skeleton walks from the kitchen to the round table where the ranger is sitting. On the way, he trips over a plate on the ground but the skeleton rogue catches the pizza just in time."*
   - Scene: skeleton_warrior (enter-left, Skeletons_Walking), ranger (appear-right, Sit_Chair_Idle), plate (appear-center), skeleton_rogue (enter-left, PickUp), table_round (appear-right), hearts-float
   - Feedback: "You described the path, the problem, the rescue, AND the delivery. Complete journey!"

3. *"From the kitchen counter, the skeleton sneaks past the benches going left to right. His knee falls off halfway but the rogue puts it back on. He reaches the knight at the table on the right side."*
   - Scene: skeleton_warrior (enter-left, Sneaking), bench (appear-center), skeleton_rogue (enter-left, Interact), knight (appear-right, Waving), table_round (appear-right), stars-spin
   - Feedback: "Route, obstacles, bone problem, solution, destination. Every piece of the plan is there!"

**PARTIAL_SUCCESS responses (4):**

4. *"Walk to the customer"*
   - Scene: skeleton_warrior (enter-left, Walking_A), question-marks
   - Feedback: "Walk where exactly? Who is the customer? Are there any obstacles on the way?"

5. *"Go to the knight but there's something blocking the way"*
   - Scene: skeleton_warrior (enter-left, Walking_A), knight (appear-right, Idle_A), bench (appear-center)
   - Feedback: "Good! You named the customer and an obstacle. Now HOW does the skeleton get past it?"

6. *"The skeleton runs really fast to deliver it"*
   - Scene: skeleton_warrior (enter-left, Running_A), explosion-cartoon
   - Feedback: "Fast is risky for a skeleton! Where is he running TO? What might go wrong?"

7. *"Deliver the pizza to the table and avoid dropping it"*
   - Scene: skeleton_warrior (enter-left, Walking_A), table_round (appear-right)
   - Feedback: "Good destination! But what specific obstacles could be in the way?"

**FUNNY_FAIL responses (3):**

8. *"throw it"*
   - Scene: skeleton_warrior (appear-center, Throw), pizza (appear-center), explosion-cartoon, laugh-tears
   - Feedback: "The pizza is NOT a frisbee! Describe a route: where does the skeleton walk, and what problems does he face?"

9. *"fly"*
   - Scene: skeleton_warrior (appear-center, Jump_Full_Long), question-marks, laugh-tears
   - Feedback: "Skeletons can't fly! Describe a walking route: from where, to where, past what?"

10. *"i like pizza"*
    - Scene: skeleton_warrior (appear-center, Skeletons_Idle), question-marks
    - Feedback: "We all do! But the skeleton needs a route. Where does he start? Where does he deliver? What's in the way?"

**Guidance Hints:**
- Hint 1: "A delivery needs a start, a destination, and what happens in between. Did you cover all three?"
- Hint 2: "What could go wrong on the way? Think about obstacles AND bone problems!"
- Hint 3: "Who is waiting for the pizza? Where are they sitting?"

### Stage 3: "The Handoff"

**Narrator:** "Almost there! The skeleton reaches the customer with the pizza ALMOST intact. But the final delivery is the trickiest part!"

**Question:** "Describe exactly how the skeleton delivers the pizza to the customer. What happens when they get it? Does anything go wrong at the last second?"

**FULL_SUCCESS responses (4):**

1. *"The skeleton warrior carefully places the pepperoni pizza on the round table in front of the knight. The knight cheers and waves. The skeleton does a victory taunt! Then confetti explodes to celebrate the successful delivery."*
   - Scene: skeleton_warrior (Interact), pizza (drop-center), table_round (appear), knight (Cheering), skeleton_warrior (Skeletons_Taunt), confetti-burst, stars-spin
   - Feedback: "Complete delivery: how he places it, customer's reaction, celebration, and finale. Nothing forgotten!"

2. *"The skeleton sets the pizza on the plate on the table. The ranger tastes it and gives a thumbs up with hearts floating. The skeleton rogue high-fives the warrior but both their hands fall off!"*
   - Scene: skeleton_warrior (Interact), plate (appear), pizza (drop-center), ranger (Cheering), hearts-float, skeleton_rogue (Interact), laugh-tears
   - Feedback: "The delivery, the reaction, AND a funny ending! Your completeness made this scene hilarious!"

3. *"He slides the pizza onto the table. The knight picks up a slice. The skeleton warrior takes a bow but his head falls off and rolls under the table. The rogue catches the head and puts it back!"*
   - Scene: skeleton_warrior (Interact), pizza (appear-center), knight (PickUp), skeleton_warrior (Hit_A), skeleton_rogue (PickUp), laugh-tears, confetti-burst
   - Feedback: "Every detail connects: delivery, eating, funny accident, AND rescue. Master of completeness!"

4. *"The skeleton places the pizza carefully with both hands on the table. The knight sits in the chair and says thank you by waving. Stars spin around because the delivery was perfect. The skeleton warrior does a happy dance."*
   - Scene: skeleton_warrior (Interact), pizza (drop-center), table_round (appear), knight (Sit_Chair_Down, Waving), stars-spin, skeleton_warrior (Skeletons_Taunt), confetti-burst
   - Feedback: "Placing, thanking, celebrating -- every part of the handoff is there. Complete!"

**PARTIAL_SUCCESS responses (3):**

5. *"give the pizza to the knight"*
   - Scene: skeleton_warrior (Interact), knight (Idle_A), pizza (appear-center)
   - Feedback: "He delivered it! But how? Does the knight react? Does anything funny happen?"

6. *"The knight gets the pizza and eats it"*
   - Scene: knight (PickUp), pizza (appear-center)
   - Feedback: "What does the skeleton DO after delivering? Does he celebrate? Does anything go wrong?"

7. *"Pizza on table, confetti"*
   - Scene: pizza (drop-center), table_round (appear), confetti-burst
   - Feedback: "Where's the skeleton? Where's the customer? A complete scene needs characters reacting!"

**FUNNY_FAIL responses (3):**

8. *"drop it"*
   - Scene: skeleton_warrior (appear-center, Throw), pizza (appear-center), explosion-cartoon
   - Feedback: "SPLAT! How does the skeleton CAREFULLY deliver the pizza? What happens when the customer gets it?"

9. *"bye"*
   - Scene: skeleton_warrior (appear-center, Waving), question-marks
   - Feedback: "Wait, don't leave! The pizza still needs to reach the customer. Describe the whole handoff!"

10. *"idk"*
    - Scene: skeleton_warrior (appear-center, Skeletons_Idle), sad-cloud
    - Feedback: "Think about it step by step: how does the skeleton hand over the pizza, and what does the customer do?"

**Guidance Hints:**
- Hint 1: "Three things make a complete delivery: how the pizza gets to the table, how the customer reacts, and what happens after."
- Hint 2: "Don't forget the skeleton! What does HE do when the delivery is done?"
- Hint 3: "The funniest moments come from including every detail -- even the things that go wrong!"

---

## STORY 3: Mage vs. The Cursed Kitchen

**Zone:** `mage-kitchen` | **Skill:** Context — "Set the Scene"
**Teaching Goal:** HOW you describe a situation matters. Context (who, where, what situation) changes the outcome. A MAGE in a CURSED kitchen needs MAGICAL solutions.

**Characters:** mage, witch, skeleton_minion
**Props:** (kitchen environment pre-loaded: stove, fridge, cabinet)

### Stage 1: "The Kitchen Is Alive!"

**Narrator:** "The mage tried a cooking spell and now the stove is angry, the pots are flying, and the fridge won't stop opening and slamming shut!"

**Question:** "Describe what's happening in the kitchen right now. Who is where? What's going wrong? Give us the full picture!"

**FULL_SUCCESS responses (3):**

1. *"The mage is standing on the left side looking scared because the stove on the right is shooting fire. Pots and pans are flying around the center. The fridge door keeps opening and slamming shut on its own."*
   - Scene: mage (enter-left, Hit_A), fire-sneeze, explosion-cartoon
   - Feedback: "Excellent context! You told us WHO, WHERE, and WHAT'S WRONG. The full picture!"

2. *"The mage is in the middle surrounded by disaster. The stove is burning out of control because the spell made it too powerful. Skeleton minions are running away from the fridge that keeps chasing them."*
   - Scene: mage (appear-center, Ranged_Magic_Raise), fire-sneeze, skeleton_minion (x3, enter-right), explosion-cartoon, laugh-tears
   - Feedback: "You set the scene perfectly: the mage's position, the stove's problem, AND why the skeletons are panicking!"

3. *"The witch came to help but she's hiding behind the cabinet because the oven exploded. The mage is trying to cast a calming spell but a pot keeps bonking him on the head."*
   - Scene: witch (appear-left, Idle_A), explosion-cartoon, mage (appear-center, Ranged_Magic_Spellcasting), laugh-tears
   - Feedback: "Two characters, each in a specific spot, each with a specific problem. That's rich context!"

**PARTIAL_SUCCESS responses (4):**

4. *"The kitchen is a mess"*
   - Scene: mage (appear-center, Idle_A), question-marks
   - Feedback: "What KIND of mess? Where is the mage? What appliances are going crazy?"

5. *"The stove is on fire and things are flying"*
   - Scene: fire-sneeze, explosion-cartoon
   - Feedback: "Where's the mage? What's HE doing about it?"

6. *"The mage messed up his spell and everything is breaking"*
   - Scene: mage (appear-center, Hit_A), explosion-cartoon
   - Feedback: "WHICH appliances are affected? Where is each one?"

7. *"Everything is on fire and the mage is scared"*
   - Scene: mage (appear-center, Hit_A), fire-sneeze
   - Feedback: "Where exactly? And what's the mage doing about it?"

**FUNNY_FAIL responses (3):**

8. *"cook dinner"*
   - Scene: mage (appear-center, Idle_A), question-marks
   - Feedback: "The kitchen is CURSED -- first describe what's going wrong!"

9. *"hi"*
   - Scene: mage (appear-center, Waving), question-marks
   - Feedback: "The kitchen is in chaos! Describe the situation: who is where, and what's going wrong?"

10. *"run away"*
    - Scene: mage (appear-center, Running_A), sad-cloud
    - Feedback: "Running doesn't help! Tell us what the scene looks like: where is the mage, what's broken?"

**Guidance Hints:**
- Hint 1: "Look around the kitchen -- what's going wrong? Where is the mage standing?"
- Hint 2: "Describe each problem: what's the stove doing? What's the fridge doing? Where is the mage?"
- Hint 3: "The best descriptions tell us WHO is where, WHAT is happening, and WHY it's going wrong."

### Stage 2: "Tame the Stove!"

**Narrator:** "First things first -- the fire-breathing stove needs to be stopped!"

**Question:** "How does the mage stop the angry stove? Remember: this is a MAGIC kitchen with a CURSED stove. The solution needs to fit the situation!"

**FULL_SUCCESS responses (4):**

1. *"The mage raises his staff and casts a frost spell from the left toward the stove on the right. The ice magic cools down the stove and puts out the fire. Sparkles appear when the spell works!"*
   - Scene: mage (appear-left, Ranged_Magic_Spellcasting_Long), sparkle-magic, stars-spin
   - Feedback: "A magical solution for a magical problem! Frost spell for fire -- context-perfect!"

2. *"The witch teaches the mage a calming enchantment. He stands in front of the stove and chants it. The fire gets smaller until it's just a gentle flame."*
   - Scene: witch (appear-left, Interact), mage (appear-center, Ranged_Magic_Spellcasting), sparkle-magic, witch (Cheering), hearts-float
   - Feedback: "You used BOTH characters in context! The witch as teacher, the mage as student!"

3. *"The mage uses a summoning spell to call a skeleton minion to throw water from the sink onto the stove. The magic fire goes out!"*
   - Scene: mage (appear-left, Ranged_Magic_Summon), skeleton_minion (enter-right, Interact), sparkle-magic, confetti-burst
   - Feedback: "Summoning, skeleton's help, AND the kitchen's own sink. Everything fits the context!"

4. *"The mage remembers the stove is cursed, not broken. So he uses a peaceful spell to remove the curse. Purple magic surrounds the stove. The fire changes from angry red to gentle blue."*
   - Scene: mage (appear-center, Ranged_Magic_Spellcasting_Long), sparkle-magic, stars-spin, hearts-float
   - Feedback: "You recognized the CONTEXT (cursed, not broken) and chose the right approach. That's exactly what context-awareness means!"

**PARTIAL_SUCCESS responses (3):**

5. *"Turn it off"*
   - Scene: mage (appear-center, Interact), question-marks
   - Feedback: "This is a CURSED magical stove -- normal solutions won't work! What SPELL could stop it?"

6. *"Use magic on it"*
   - Scene: mage (appear-center, Ranged_Magic_Spellcasting), sparkle-magic
   - Feedback: "What KIND of magic? A frost spell? A calming charm? Match the spell to the problem!"

7. *"The mage casts a spell"*
   - Scene: mage (appear-center, Ranged_Magic_Spellcasting)
   - Feedback: "WHICH spell? WHY that spell? Think about what the stove's problem is."

**FUNNY_FAIL responses (3):**

8. *"punch it"*
   - Scene: mage (appear-center, Hit_A), explosion-cartoon, laugh-tears
   - Feedback: "The mage is a WIZARD, not a boxer! What magical solution fits this magical problem?"

9. *"sit down"*
   - Scene: mage (appear-center, Sit_Floor_Down), fire-sneeze
   - Feedback: "The stove is still on fire! Think about what the mage has (magic!) and what the problem is (fire curse!)."

10. *"ask it nicely"*
    - Scene: mage (appear-center, Interact), question-marks, laugh-tears
    - Feedback: "Politeness is great but this stove is CURSED! What kind of magic spell could fix a fire curse?"

**Guidance Hints:**
- Hint 1: "The stove is cursed with fire magic. What kind of spell could fight fire?"
- Hint 2: "The mage could use frost, calming, or water magic. Which one fits this problem best?"
- Hint 3: "Remember the CONTEXT: it's a curse, not a regular fire. The solution needs to be magical too!"

### Stage 3: "Save the Dinner!"

**Narrator:** "The stove is tamed! But the kitchen is a mess and there's no dinner. Time to cook -- with magic!"

**Question:** "How does the mage cook dinner in this magical kitchen? Who helps? What do they make? Remember the context -- this is a MAGICAL kitchen!"

**FULL_SUCCESS responses (3):**

1. *"The mage uses a levitation spell to float the pots back onto the stove. The witch stirs with a magic wand while the mage heats it up with a gentle fire spell. Skeleton minions carry plates to the table. They make enchanted soup that glows purple!"*
   - Scene: mage (appear-left, Ranged_Magic_Spellcasting), witch (appear-center, Interact), skeleton_minion (x2, enter-right, Walking_A), sparkle-magic, hearts-float, stars-spin
   - Feedback: "Magical cooking with magical tools! Levitation for pots, wand for stirring, fire spell for heat -- every solution fits the context!"

2. *"The witch tells the mage to use a summoning spell to call fresh ingredients from the garden. The mage waves his staff and vegetables float in through the window. The skeleton minions chop them with tiny swords. The witch enchants the stove to cook at the perfect temperature."*
   - Scene: witch (appear-left, Interact), mage (appear-center, Ranged_Magic_Summon), sparkle-magic, skeleton_minion (x3, enter-right, Interact), witch (Ranged_Magic_Spellcasting), confetti-burst
   - Feedback: "You used the context perfectly: summoning spells for ingredients, enchantment for temperature, skeleton helpers with swords as knives!"

3. *"The mage casts a time-reverse spell on the mess so the broken dishes fix themselves. Then the witch brews a potion in the cauldron that turns into a feast. The skeleton minions set the table while the mage lights candles with tiny fire spells."*
   - Scene: mage (appear-center, Ranged_Magic_Spellcasting_Long), sparkle-magic, witch (appear-left, Ranged_Magic_Spellcasting), stars-spin, skeleton_minion (x2, Interact), mage (Ranged_Magic_Shoot), hearts-float
   - Feedback: "Time magic to fix the mess, potion-brewing for cooking, fire spells for candles -- every detail is magical. Context master!"

**PARTIAL_SUCCESS responses (4):**

4. *"They cook food"*
   - Scene: mage (appear-center, Idle_A), question-marks
   - Feedback: "Cook HOW? This is a magical kitchen! What spells do they use? Who does what?"

5. *"The mage makes dinner with the stove"*
   - Scene: mage (appear-center, Interact)
   - Feedback: "The stove was just cursed! How does the mage cook with MAGIC instead of normally?"

6. *"The witch helps cook something"*
   - Scene: witch (appear-left, Interact), mage (appear-center, Idle_A)
   - Feedback: "What does she cook? HOW does she cook it? Remember, she's a WITCH with magic!"

7. *"They make soup"*
   - Scene: mage (appear-center, Interact), sparkle-magic
   - Feedback: "Soup sounds good! But how do they make it in a MAGICAL kitchen? What spells are involved?"

**FUNNY_FAIL responses (3):**

8. *"order takeout"*
   - Scene: mage (appear-center, Skeletons_Idle), question-marks, laugh-tears
   - Feedback: "No delivery to a cursed kitchen! How would a MAGE cook using MAGIC?"

9. *"microwave it"*
   - Scene: mage (appear-center, Hit_A), explosion-cartoon, laugh-tears
   - Feedback: "No microwaves in a magical kitchen! Think about what spells could help cook dinner."

10. *"give up"*
    - Scene: mage (appear-center, Hit_A), sad-cloud
    - Feedback: "Never! The mage has MAGIC! Think about what spells could help: fire for heat, levitation for pots, summoning for ingredients!"

**Guidance Hints:**
- Hint 1: "What magical tools does the mage have? How could spells help with cooking?"
- Hint 2: "The witch knows potions and the mage knows spells. How could they BOTH contribute?"
- Hint 3: "Think about the context: magical ingredients, enchanted tools, spell-powered cooking. What does that dinner look like?"

---

## STORY 4: Barbarian's First Day of School

**Zone:** `barbarian-school` | **Skill:** Step-by-Step — "First This, Then That"
**Teaching Goal:** ORDER matters. Doing things in the right sequence produces better outcomes.

**Characters:** barbarian, knight, mage, ranger, rogue
**Props:** desk, chair_A (environment pre-loaded: slide, seesaw, sandbox)

*Stages 1-3: "Getting Through the Door", "Finding a Seat", "Making Friends at Recess"*
*30 responses (10 per stage). See TypeScript data file: `data/stories/barbarian-school.ts`*

---

## STORY 5: Knight's Accidental Space Mission

**Zone:** `knight-space` | **Skill:** Perspective — "Think Like Them"
**Teaching Goal:** Think about WHO is doing the action and WHY. A knight interprets space through medieval eyes.

**Characters:** knight, space_ranger
**Props:** (environment pre-loaded: basemodule_A, solarpanel, cargo_A, dome)

*Stages 1-3: "Lost in Space!", "Meeting the Space Ranger", "Working Together"*
*30 responses (10 per stage). See TypeScript data file: `data/stories/knight-space.ts`*

---

## STORY 6: Dungeon Rock Concert

**Zone:** `dungeon-concert` | **Skill:** Creative Constraints — "Color Inside the Lines"
**Teaching Goal:** Be creative WITHIN limits. No real instruments -- only dungeon stuff: barrels, torches, banners, tables, chairs.

**Characters:** knight, barbarian, mage, ranger, rogue, skeleton_warrior, clown
**Props:** torch (x4), barrel (x3), banner_blue (x3), banner_red (x3), table_long, chair

*Stages 1-3: "Assemble the Band!", "Set Up the Stage", "The Big Performance!"*
*30 responses (10 per stage). See TypeScript data file: `data/stories/dungeon-concert.ts`*

---

## STORY 7: Adventurers' Disastrous Picnic

**Zone:** `adventurers-picnic` | **Skill:** Integration — "Master Prompter"
**Teaching Goal:** Combine ALL skills: specificity, completeness, context, step-by-step, perspective, and creative constraints.

**Characters:** knight, barbarian, mage, ranger, rogue
**Props:** sandwich (x3), apple (x4), banana (x3), burger (x4), chips (x3), drink (x4), ice_cream (x3), cake_birthday, cupcake, pie, sausages, coffee, table_long, chair (x4), barrel, torch, banner_blue, banner_red, present, chest, balloon (x10)

*Stages 1-4: "Setting Up the Picnic", "Disaster Strikes!", "Save the Picnic!", "The Grand Finale"*
*40 responses (10 per stage). See TypeScript data file: `data/stories/adventurers-picnic.ts`*

---

## PART 4: PRE-RENDERING & IMPLEMENTATION SUMMARY

### Scene Configurations

| Story | Stages | Responses/Stage | Total Configs |
|-------|--------|-----------------|---------------|
| 1. Skeleton Birthday | 3 | 10 | 30 |
| 2. Skeleton Pizza | 3 | 10 | 30 |
| 3. Mage Kitchen | 3 | 10 | 30 |
| 4. Barbarian School | 3 | 10 | 30 |
| 5. Knight Space | 3 | 10 | 30 |
| 6. Dungeon Concert | 3 | 10 | 30 |
| 7. Adventurers' Picnic | 4 | 10 | 40 |
| **TOTAL** | **22** | -- | **220** |

### Cache Strategy

Each of the 220 responses becomes a golden cache entry keyed by `taskId` + normalized input. The three-tier resolver handles matching:

- **Tier 1 (Story Matcher):** Fuzzy keyword match against `StoryResponse.sampleInput[]` (threshold 0.35)
- **Tier 2 (Live API):** Claude evaluates with stage-specific system prompt
- **Tier 3 (Fallback):** Stage-specific fallback script (PARTIAL_SUCCESS with hints)

### Guidance System

Off-script responses trigger guidance when:
- Fuzzy match < threshold
- Live API returns FUNNY_FAIL
- Response is under 5 words

Each stage has 3 progressive hints:
- **Hint 1:** General Socratic question
- **Hint 2:** More specific nudge, names an element
- **Hint 3:** Most specific, names what's missing (still doesn't give the answer)

### Key Files Created

| File | Status |
|------|--------|
| `data/stories/types.ts` | DONE — `Story`, `StoryStage`, `StoryResponse`, `StoryElement`, `SkillId`, `Skill` |
| `data/stories/skeleton-birthday.ts` | DONE — 3 stages, 30 responses |
| `data/stories/skeleton-pizza.ts` | DONE — 3 stages, 30 responses |
| `data/stories/mage-kitchen.ts` | DONE — 3 stages, 30 responses |
| `data/stories/barbarian-school.ts` | DONE — 3 stages, 30 responses |
| `data/stories/knight-space.ts` | DONE — 3 stages, 30 responses |
| `data/stories/dungeon-concert.ts` | DONE — 3 stages, 30 responses |
| `data/stories/adventurers-picnic.ts` | DONE — 4 stages, 40 responses |
| `data/stories/index.ts` | DONE — Re-export all stories + `STORY_ORDER` array |

### Key Files to Modify

| File | Change |
|------|--------|
| `stores/gameStore.ts` | Add `currentStageIndex`, `stageComplete`, `hintsUsed`, `storyProgress`, `advanceStage()`, `getHint()` |
| `services/story-resolver.ts` | NEW — Convert `StoryResponse` → `SceneScript` via block-resolver pipeline |
| `services/story-matcher.ts` | NEW — Fuzzy match user input to `StoryResponse.sampleInput[]` |
| `data/fallback-scripts.ts` | Expand to 22 stage-level fallbacks |
| `data/block-library.ts` | Wire 4 missing props (bench, desk, table_round, plate) |
| `components/PromptInput.tsx` | Show stage question, progress indicator, hint/next buttons |
| `App.tsx` | Stage badge in zone header |

### Verification

1. Walk to each zone -> verify intro plays correctly
2. For each stage, test with one FULL_SUCCESS, one PARTIAL_SUCCESS, and one FUNNY_FAIL input
3. Verify guidance hints appear for off-script responses
4. Verify stage progression (stage 1 -> 2 -> 3)
5. Verify story matcher hits for all 220 pre-rendered responses
6. Kill API connection -> verify fallback scripts work per-stage

---

## PART 5: ASSET AUDIT

### Characters (12 needed — ALL EXIST)

| Character | Stories | Source | Status |
|-----------|---------|--------|--------|
| skeleton_warrior | 1, 2, 6 | KayKit Skeletons 1.1 | HAVE |
| skeleton_mage | 1 | KayKit Skeletons 1.1 | HAVE |
| skeleton_minion | 1, 3 | KayKit Skeletons 1.1 | HAVE |
| skeleton_rogue | 2 | KayKit Skeletons 1.1 | HAVE |
| knight | 1, 2, 4, 5, 6, 7 | KayKit Adventurers 2.0 | HAVE |
| mage | 1, 3, 4, 6, 7 | KayKit Adventurers 2.0 | HAVE |
| rogue | 1, 4, 6, 7 | KayKit Adventurers 2.0 | HAVE |
| ranger | 2, 4, 6, 7 | KayKit Adventurers 2.0 | HAVE |
| barbarian | 4, 6, 7 | KayKit Adventurers 2.0 | HAVE |
| witch | 3 | Series 5 Mystery Monthly | HAVE |
| space_ranger | 5 | Series 4 Mystery Monthly (Jan 2024) | HAVE |
| clown | 6 | Series 4 Mystery Monthly | HAVE |

### Animations (33 needed — ALL EXIST in 139-clip library)

Idle_A, Hit_A, Interact, PickUp, Throw, Walking_A, Running_A, Jump_Full_Long, Jump_Full_Short, Jump_Idle, Crawling, Sneaking, Melee_1H_Attack_Chop, Melee_Block, Ranged_Magic_Raise, Ranged_Magic_Shoot, Ranged_Magic_Spellcasting, Ranged_Magic_Spellcasting_Long, Ranged_Magic_Summon, Cheering, Waving, Sit_Chair_Down, Sit_Chair_Idle, Sit_Floor_Down, Skeletons_Idle, Skeletons_Taunt, Skeletons_Walking, Hammer, Lockpick, Work_A

### Effects (9 needed — ALL EXIST)

confetti-burst, sparkle-magic, question-marks, sad-cloud, laugh-tears, stars-spin, hearts-float, explosion-cartoon, fire-sneeze

### Props — Confirmed Available (22)

table_long, torch, barrel, banner_blue, banner_red, present, cake_birthday, cupcake, balloon, pizza, chair, chest, sandwich, pie, apple, banana, burger, chips, drink, ice_cream, sausages, coffee

### Props — NEED TO WIRE INTO BLOCK-LIBRARY (4)

| Prop | Story | GLB Path | Action |
|------|-------|----------|--------|
| **bench** | 2, 7 | tiny-treats/pretty-park/bench.gltf | Add block-library entry |
| **desk** | 4 | kaykit/packs/furniture/desk.gltf | Add block-library entry |
| **table_round** | 2 | kaykit/packs/restaurant/table_round_A.gltf | Add block-library entry |
| **plate** | 2 | kaykit/packs/restaurant/plate.gltf | Add block-library entry |

### Summary

| Category | Needed | Have | Gap |
|----------|--------|------|-----|
| Characters | 12 | 12 | **0** |
| Animations | 33 | 33 (of 139) | **0** |
| Effects | 9 | 9 (of 10) | **0** |
| Spawnable Props (confirmed) | 22 | 22 | **0** |
| Spawnable Props (need wiring) | 4 | GLBs exist | **4 to wire** |

---

## PART 6: INTEGRATION PLAN

### Architecture Decision

**Primary flow (pre-rendered):** User input -> fuzzy match against `StoryResponse.sampleInput[]` -> resolve `StoryElement[]` -> play SceneScript
**Fallback flow (live API):** No match -> stage-specific prompt -> Claude API -> cache result
**Emergency fallback:** API fails -> stage-level fallback script

**Key insight:** `StoryElement` is nearly identical to `BlockElement`. We reuse the existing `resolveBlocks()` pipeline by converting `StoryResponse` -> `BlockResponse` shape.

### Phase 1: Wire Missing Props

**File:** `data/block-library.ts`
- Add bench, desk, table_round, plate as prop entries
- Add chair_A as alias to existing chair

### Phase 2: Story Element Resolver

**File:** `services/story-resolver.ts` (NEW, ~60 lines)
- `resolveStoryResponse()` converts `StoryResponse` -> `SceneScript`
- Maps `StoryElement[]` -> `BlockResponse.elements[]`
- Handles `StoryElement.anim` override by injecting `animate` action after spawn
- Reuses `resolveBlocks()` from block-resolver.ts

### Phase 3: Story Matcher

**File:** `services/story-matcher.ts` (NEW, ~50 lines)
- `matchStoryInput()` fuzzy matcher
- Normalize, extract keywords, score via keyword overlap
- Threshold 0.35 (generous for pre-rendered responses)
- Returns best `StoryResponse` or null

### Phase 4: Game Store Stage Progression

**File:** `stores/gameStore.ts` (~80 lines changed)
- Add: `currentStageIndex`, `hintsUsed`, `stageComplete`, `storyProgress`
- Add: `advanceStage()`, `getHint()`, `completeStory()`
- Modify `enterZone()`: load story stage narration
- Modify `submitInput()`: try story matcher before three-tier resolver

### Phase 5: Fallback Scripts

**File:** `data/fallback-scripts.ts` (~120 lines added)
- 22 stage-keyed fallbacks: `'skeleton-birthday-0'`, `'skeleton-birthday-1'`, etc.
- Each is PARTIAL_SUCCESS with stage's first hint as feedback

### Phase 6: UI Updates

**Files:** `components/PromptInput.tsx` (~50 lines), `App.tsx` (~15 lines)
- Stage question as placeholder text
- Progress indicator: "Stage 1 of 3: Who's Invited?"
- "Next Stage" button after FULL_SUCCESS
- "Get a Hint" button (max 3 progressive hints)
- Stage badge in zone header

### Execution Order

1. Phase 1 (props) — unblocks story element resolution
2. Phase 2 (story-resolver) — converts StoryResponse -> SceneScript
3. Phase 3 (story-matcher) — fuzzy matches user input to responses
4. Phase 4 (gameStore) — wires everything together
5. Phase 5 (fallbacks) — safety net
6. Phase 6 (UI) — user-facing stage progression

### Files Changed Summary

| File | Type | Lines |
|------|------|-------|
| `services/story-resolver.ts` | NEW | ~60 |
| `services/story-matcher.ts` | NEW | ~50 |
| `stores/gameStore.ts` | MODIFY | ~80 |
| `data/fallback-scripts.ts` | MODIFY | ~120 |
| `data/block-library.ts` | MODIFY | ~30 |
| `components/PromptInput.tsx` | MODIFY | ~50 |
| `App.tsx` | MODIFY | ~15 |
| **Total** | | **~405** |
