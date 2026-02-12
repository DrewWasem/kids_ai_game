# Plan: Puppeteer Visual Regression Tests for Story Progression

**Created:** 2026-02-11
**Status:** draft
**Research:** N/A (new test infrastructure)

## Goal
Create a Puppeteer-based visual regression test that validates all 22 stages across 7 stories in Prompt Quest, capturing screenshots after each action and verifying character rendering, positioning, reactions, and progression mechanics.

## Approach
Build a standalone Node.js script that launches a headless browser, connects to the dev server, uses the exposed `window.__gameStore` API to programmatically enter zones and submit known FULL_SUCCESS inputs, waits for scene rendering to complete, captures screenshots, and validates DOM/store state. The script will organize screenshots by story/stage and produce a detailed pass/fail report highlighting any rendering issues (off-screen characters, overlapping positions, missing reactions, broken progression).

## Phase 1: Setup and Infrastructure

### Task 1.1: Install Puppeteer dependency
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/package.json`
**Action:** Add Puppeteer as a dev dependency if not already present
**Verify:**
- [ ] Automated: `npm ls puppeteer` shows installed version
- [ ] Manual: Check that node_modules/.bin/puppeteer exists

### Task 1.2: Create test directory structure
**File:** N/A (filesystem operation)
**Action:** Create `/tmp/pq-visual-test/` directory and subdirectories for each story: `skeleton-birthday/`, `skeleton-pizza/`, `mage-kitchen/`, `barbarian-school/`, `knight-space/`, `dungeon-concert/`, `adventurers-picnic/`
**Verify:**
- [ ] Manual: Run `ls /tmp/pq-visual-test` and confirm all 7 story directories exist

### Task 1.3: Create test script scaffold
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Create a new Node.js script with imports for Puppeteer, path, fs, and a main async function that launches browser, navigates to localhost:5174, and closes gracefully
**Verify:**
- [ ] Automated: `node tests/visual-regression.js` runs without errors (should just launch browser and exit)
- [ ] Manual: Check that script logs "Browser launched" and "Test complete"

### Task 1.4: Add test data constants
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add a STORY_TEST_DATA constant with all 7 stories, each containing an array of stage objects with `{ stageIndex, sampleInput }` using the FIRST FULL_SUCCESS input from each stage
**Verify:**
- [ ] Manual: Inspect STORY_TEST_DATA and confirm it has 3 stages for skeleton-birthday, 3 for skeleton-pizza, 3 for mage-kitchen, 3 for barbarian-school, 3 for knight-space, 3 for dungeon-concert, 4 for adventurers-picnic (total 22)

### Task 1.5: Add utility functions
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add helper functions: `waitForRender(page, durationMs)` (waits for scene actions to complete), `captureScreenshot(page, storyId, stageIndex, label)` (saves PNG to /tmp/pq-visual-test/{storyId}/stage-{stageIndex}-{label}.png), `getStoreState(page)` (calls `window.__gameStore.getState()` and returns JSON)
**Verify:**
- [ ] Automated: Add a test call to `captureScreenshot(page, 'test', 0, 'init')` and confirm `/tmp/pq-visual-test/test/stage-0-init.png` is created
- [ ] Manual: Open the screenshot and verify it captured the page

## Phase 2: Core Test Implementation

### Task 2.1: Implement dev server startup check
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Before launching browser, add a check that attempts to fetch `http://localhost:5174` and retries up to 10 times with 1-second delays. If server is not running, log an error instructing user to run `npm run dev` first, then exit.
**Verify:**
- [ ] Automated: Run script with server OFF → script exits with "Dev server not running" message
- [ ] Automated: Run script with server ON → script proceeds to browser launch
- [ ] Manual: Check that error message includes the port number (5174)

### Task 2.2: Implement store API access verification
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** After page.goto('http://localhost:5174'), add a check that evaluates `typeof window.__gameStore !== 'undefined'`. If false, throw an error: "Store not exposed. Ensure DEV mode is enabled."
**Verify:**
- [ ] Automated: Script logs "Store API available" when run against dev server
- [ ] Manual: Temporarily comment out the store exposure in gameStore.ts, run script, and confirm it throws the error

### Task 2.3: Implement zone entry logic
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `enterZone(page, zoneId)` function that calls `window.__gameStore.getState().enterZone(zoneId)`, waits 500ms for transition, then verifies `currentZone === zoneId` and `currentStageIndex === 0`
**Verify:**
- [ ] Automated: Call `enterZone(page, 'skeleton-birthday')` and assert store state shows `currentZone: 'skeleton-birthday'`, `currentStageIndex: 0`
- [ ] Manual: Run script and check console logs confirm zone entry

### Task 2.4: Implement input submission and validation
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `submitInput(page, inputText)` function that calls `window.__gameStore.getState().setInput(inputText)`, then `submitInput()`, waits for `isLoading: false` (poll every 100ms, max 10 seconds), then returns the `lastScript` object
**Verify:**
- [ ] Automated: Submit "Invite the knight" and assert `lastScript` is not null
- [ ] Manual: Check that function times out gracefully if isLoading never becomes false

### Task 2.5: Implement scene render wait
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `waitForSceneRender(page, script)` function that examines `script.actions.length`, calculates wait time as `Math.max(3000, actions.length * 600)` (minimum 3s, +600ms per action), and uses `page.waitForTimeout()`
**Verify:**
- [ ] Automated: Test with a script containing 0 actions → waits 3000ms
- [ ] Automated: Test with a script containing 6 actions → waits 3600ms (6 * 600)
- [ ] Manual: Confirm in browser that animations finish before screenshot

### Task 2.6: Implement stage completion validation
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `validateStageComplete(page, expectedComplete)` function that reads `window.__gameStore.getState().stageComplete` and compares to expectedComplete boolean. Return { pass: boolean, actual: boolean }
**Verify:**
- [ ] Automated: After submitting FULL_SUCCESS input, assert `stageComplete === true`
- [ ] Automated: After submitting non-success input, assert `stageComplete === false`

### Task 2.7: Implement stage advancement
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `advanceStage(page)` function that calls `window.__gameStore.getState().advanceStage()`, waits 1000ms, then verifies `currentStageIndex` incremented by 1
**Verify:**
- [ ] Automated: After stage 0 complete, call `advanceStage()` and assert `currentStageIndex === 1`
- [ ] Manual: Check that lastScript shows the next stage's narration text

### Task 2.8: Implement character position validation
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `validateCharacterPositions(page)` function that queries the Three.js scene (if accessible via window) or parses `lastScript.actions` to extract all actor positions. Flag any two actors at same position (x,z within 0.5 units). Return { pass: boolean, overlaps: [{actor1, actor2, position}] }
**Verify:**
- [ ] Automated: Create a mock script with two actors at position [0,0] → function returns `pass: false` with overlap details
- [ ] Manual: Run against real scene and confirm no false positives

### Task 2.9: Implement visibility check
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `validateVisibility(page)` function that attempts to query visible actors via DOM or canvas inspection. For MVP, read `lastScript.actions` and count spawn/move actions. Return { pass: boolean, actorCount: number }
**Verify:**
- [ ] Automated: Script with 3 spawn actions → actorCount = 3
- [ ] Manual: Compare actorCount to visual inspection of screenshot

### Task 2.10: Implement reaction/effect validation
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add `validateReactions(page, script)` function that reads `script.actions` and filters for `type === 'react'`. Count expected reactions and compare to what's rendered (via DOM query for effect elements or just return action count). Return { pass: boolean, reactionsExpected: number }
**Verify:**
- [ ] Automated: Script with 2 react actions → reactionsExpected = 2
- [ ] Manual: Check screenshot shows confetti/sparkles if reaction type is specified

## Phase 3: Test Execution and Reporting

### Task 3.1: Implement main test loop
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Write main async function that iterates through STORY_TEST_DATA. For each story: call `enterZone(page, storyId)`, screenshot initial state, then for each stage: submit sampleInput, wait for render, screenshot after-submit, validate completion, validate positions, validate visibility, validate reactions, advance stage (unless last stage), record results in an array of { storyId, stageIndex, pass, issues: [] }
**Verify:**
- [ ] Automated: Run full loop and confirm it completes all 22 stages without crashing
- [ ] Manual: Check `/tmp/pq-visual-test/` contains screenshots for all stories/stages

### Task 3.2: Implement story completion handling
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** After the last stage of each story, instead of calling `advanceStage()`, verify that `completeStory()` was auto-called and `currentZone === null` after 2500ms (story completion exits zone). Add a `validateStoryComplete(page, storyId)` function that checks `storyProgress[storyId]` equals the total stage count.
**Verify:**
- [ ] Automated: Complete skeleton-birthday (3 stages) → `storyProgress['skeleton-birthday'] === 3`
- [ ] Manual: Observe that browser returns to village center after story completion

### Task 3.3: Implement screenshot diff detection (optional stretch)
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add optional baseline comparison: if `/tmp/pq-visual-test/baselines/{storyId}/stage-{stageIndex}.png` exists, use Pixelmatch library to compare screenshots and flag if diff exceeds 5% pixels. Store diff image at `/tmp/pq-visual-test/diffs/{storyId}/stage-{stageIndex}-diff.png`
**Verify:**
- [ ] Automated: Copy a screenshot to baselines, run test → diff = 0%
- [ ] Automated: Manually alter a baseline → diff > 0%
- [ ] Manual: Inspect diff image shows highlighted differences in red

### Task 3.4: Implement summary report generation
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** At end of test run, generate a JSON report at `/tmp/pq-visual-test/report.json` containing { timestamp, totalStages: 22, passedStages, failedStages, results: [{storyId, stageIndex, pass, issues, screenshot}] }. Also print a human-readable summary to console showing pass/fail counts and listing any failures.
**Verify:**
- [ ] Automated: Run full test → report.json is created with 22 entries
- [ ] Manual: Inspect JSON and confirm structure matches spec

### Task 3.5: Implement HTML report generation
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Generate `/tmp/pq-visual-test/report.html` that displays screenshots in a grid, color-coded by pass/fail, with expandable details showing validation issues. Embed screenshots as base64 or link to file paths.
**Verify:**
- [ ] Automated: Run test → report.html is created
- [ ] Manual: Open report.html in browser and confirm all 22 screenshots are visible and clickable

### Task 3.6: Add CLI arguments for selective testing
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Add command-line argument parsing (using `process.argv`) to support `--story=skeleton-birthday` (test single story) and `--stage=1` (test single stage within story). Default behavior tests all stories.
**Verify:**
- [ ] Automated: Run `node tests/visual-regression.js --story=skeleton-birthday` → only 3 stages tested
- [ ] Automated: Run `node tests/visual-regression.js --story=skeleton-birthday --stage=1` → only stage 1 tested
- [ ] Manual: Confirm report reflects filtered scope

### Task 3.7: Add error recovery and retry logic
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
**Action:** Wrap each stage test in try/catch. If a stage fails (error thrown), log the error, mark stage as failed in results, capture an error screenshot, and continue to next stage. Add `--fail-fast` flag to exit on first failure.
**Verify:**
- [ ] Automated: Temporarily inject a failing assertion → script continues to next stage
- [ ] Automated: Run with `--fail-fast` → script exits on first failure
- [ ] Manual: Check that error screenshot is captured and saved

### Task 3.8: Run full test suite baseline
**File:** N/A (test execution)
**Action:** Execute `npm run dev` in terminal 1, then `node tests/visual-regression.js` in terminal 2. Let test run through all 22 stages. Review report.html and report.json.
**Verify:**
- [ ] Automated: All 22 stages pass (or document known failures)
- [ ] Manual: Visually inspect screenshots for any obvious rendering issues (characters off-screen, missing, overlapping)

### Task 3.9: Document known issues and create issue tickets
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/.claude/plans/visual-regression-issues.md`
**Action:** Create a markdown file listing any discovered issues from Task 3.8 with the format: `- [Story ID] Stage X: Issue description (screenshot: path/to/screenshot.png)`. Prioritize by severity (blocker, major, minor).
**Verify:**
- [ ] Manual: Review issue list and confirm each has a screenshot reference
- [ ] Manual: Triage issues and assign to blocker/major/minor categories

### Task 3.10: Fix critical rendering issues (if any)
**File:** (varies based on issues found)
**Action:** For each blocker/major issue found in Task 3.9, identify the root cause (e.g., character spawn position out of bounds, missing animation, reaction effect not rendering), fix in the appropriate source file (likely in `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/src/game/` or `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/src/data/stories/`), and re-run the test for that specific story/stage.
**Verify:**
- [ ] Automated: Re-run `node tests/visual-regression.js --story={affected-story}` → stage now passes
- [ ] Manual: Compare before/after screenshots to confirm fix

### Task 3.11: Create baseline screenshots for future regression testing
**File:** N/A (filesystem operation)
**Action:** After all issues are fixed, copy all screenshots from `/tmp/pq-visual-test/{storyId}/` to `/tmp/pq-visual-test/baselines/{storyId}/` to establish golden baseline images for future runs.
**Verify:**
- [ ] Manual: Run `cp -r /tmp/pq-visual-test/skeleton-birthday/*.png /tmp/pq-visual-test/baselines/skeleton-birthday/` for each story
- [ ] Automated: Re-run test with baseline comparison enabled → all diffs = 0%

### Task 3.12: Add test script to package.json
**File:** `/Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/package.json`
**Action:** Add a new script: `"test:visual": "node tests/visual-regression.js"` and `"test:visual:baseline": "node tests/visual-regression.js && cp -r /tmp/pq-visual-test/*/*.png /tmp/pq-visual-test/baselines/"`
**Verify:**
- [ ] Automated: Run `npm run test:visual` → test executes successfully
- [ ] Automated: Run `npm run test:visual:baseline` → baselines are updated
- [ ] Manual: Confirm package.json scripts section contains both new entries

## Success Criteria

### Automated
- [ ] `node tests/visual-regression.js` completes all 22 stages across 7 stories
- [ ] Report shows 22/22 stages passed (or documents known acceptable failures)
- [ ] All screenshots saved to `/tmp/pq-visual-test/{storyId}/stage-{N}-*.png`
- [ ] `npm run test:visual` script executes without errors
- [ ] Validation functions correctly identify overlapping characters, missing reactions, and progression state
- [ ] Story completion correctly exits zone and updates `storyProgress`

### Manual
- [ ] Visual inspection of screenshots confirms characters are visible and properly positioned
- [ ] No characters are rendered off-screen (outside camera frustum)
- [ ] No two characters occupy the same position (within 0.5 units)
- [ ] Reactions/effects (confetti, sparkles) are visible in screenshots when expected
- [ ] Each stage screenshot shows visual progression from previous stage
- [ ] Report.html renders cleanly in browser with all images embedded/linked
- [ ] Test runs in under 5 minutes for full suite (22 stages * ~5s/stage = ~2min + overhead)

## Rollback

To remove this test infrastructure:

1. Delete test script: `rm /Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend/tests/visual-regression.js`
2. Delete test output: `rm -rf /tmp/pq-visual-test/`
3. Uninstall Puppeteer: `cd /Users/LuffyDMonkey/claude_projects/pq-game-dynamics/frontend && npm uninstall puppeteer`
4. Remove package.json scripts: delete `test:visual` and `test:visual:baseline` entries
5. Remove issues doc: `rm /Users/LuffyDMonkey/claude_projects/pq-game-dynamics/.claude/plans/visual-regression-issues.md`

The core game code is untouched by this test infrastructure, so rollback is non-destructive.

## Notes

- **Puppeteer headless mode:** Use `{ headless: 'new' }` for faster execution. Set `{ headless: false }` for debugging.
- **Dev server requirement:** Tests MUST run against a live dev server (`npm run dev`). Consider adding a pre-check or auto-start script.
- **3D scene access:** Puppeteer cannot directly inspect Three.js scene graph. Validation relies on `lastScript.actions` and store state. For deeper inspection, expose scene objects to `window` in dev mode.
- **Timing sensitivity:** Adjust `waitForSceneRender()` duration if animations are cut off in screenshots. Current formula: `Math.max(3000, actions.length * 600)`.
- **Screenshot size:** Use `page.setViewport({ width: 1920, height: 1080 })` for consistent high-res screenshots.
- **Parallelization:** Current design is serial (one story at a time). For faster execution, consider launching multiple browser instances in parallel (one per story).
- **CI integration:** This script can be added to GitHub Actions or other CI pipelines by installing Puppeteer in CI environment and running `npm run test:visual` after build step.
- **Baseline drift:** Baselines may need periodic updates as game content evolves. Document baseline update policy (e.g., manual review + approval before committing new baselines).

## Test Data Reference

Full STORY_TEST_DATA structure (all FULL_SUCCESS sampleInputs):

```javascript
const STORY_TEST_DATA = {
  'skeleton-birthday': [
    { stageIndex: 0, sampleInput: "Invite the knight, the mage, and the rogue! The knight brings his shield, the mage does sparkly magic, and the rogue sneaks in with presents." },
    { stageIndex: 1, sampleInput: "Hang blue and red banners on the walls. Put torches everywhere so the dungeon is bright. Set up a long table in the middle with chairs around it." },
    { stageIndex: 2, sampleInput: "A giant birthday cake drops from the ceiling into the center of the table! The skeleton cheers and all the guests wave. Then confetti explodes everywhere!" }
  ],
  'skeleton-pizza': [
    { stageIndex: 0, sampleInput: "The skeleton warrior walks carefully to the counter and picks up a pepperoni pizza. The skeleton rogue ties the skeleton's arms on tight with rope so they don't fall off. He holds the pizza on a plate." },
    { stageIndex: 1, sampleInput: "The skeleton warrior walks carefully from the restaurant on the left toward the knight waiting on the right. He has to dodge a bench in the middle -- the skeleton rogue pushes it out of the way. The skeleton runs the last bit to deliver it hot!" },
    { stageIndex: 2, sampleInput: "The skeleton warrior carefully places the pepperoni pizza on the round table in front of the knight. The knight cheers and waves. The skeleton does a victory taunt! Then confetti explodes to celebrate the successful delivery." }
  ],
  'mage-kitchen': [
    { stageIndex: 0, sampleInput: "The mage is standing on the left side looking scared because the stove on the right is shooting fire. Pots and pans are flying around the center. The fridge door keeps opening and slamming shut on its own." },
    { stageIndex: 1, sampleInput: "The mage raises his staff and casts a frost spell from the left toward the stove on the right. The ice magic cools down the stove and puts out the fire. Sparkles appear when the spell works!" },
    { stageIndex: 2, sampleInput: "The mage uses a levitation spell to float the pots back onto the stove. The witch stirs with a magic wand while the mage heats it up with a gentle fire spell. Skeleton minions carry plates to the table. They make enchanted soup that glows purple!" }
  ],
  'barbarian-school': [
    { stageIndex: 0, sampleInput: "First, the barbarian walks up to the door from the left. Then he tries to squeeze through but gets stuck. Next, the knight pushes him from behind. Finally, he pops through and stumbles to the center!" },
    { stageIndex: 1, sampleInput: "First, the barbarian walks to the nearest desk. Then he looks at it and realizes it's tiny. Next, he tries to sit but the chair breaks! Finally, the knight brings two chairs and the barbarian sits on both of them at once." },
    { stageIndex: 2, sampleInput: "First, the barbarian sees the knight playing near the sandbox. Then he walks over slowly so he doesn't scare anyone. Next, he waves and says hi. The knight waves back. Then the barbarian asks if he can play too. Finally, the knight shows him how to build a sandcastle together!" }
  ],
  'knight-space': [
    { stageIndex: 0, sampleInput: "The knight floats in looking confused. He sees the dome and thinks it's a giant shield! He tries to pick it up. The solar panels look like dragon wings and he tries to fight them with his sword." },
    { stageIndex: 1, sampleInput: "The knight sees the space ranger's helmet and thinks it's a magical crystal ball head. He bows and says 'Greetings, crystal wizard!' The space ranger sees the knight's armor and thinks it's an old-fashioned spacesuit. She says 'Nice retro gear!' They're both confused but friendly." },
    { stageIndex: 2, sampleInput: "The knight thinks the solar panel is a fallen dragon wing and tries to lift it back into place with his strength. The space ranger realizes the knight's brute force is actually useful! She points to where it needs to go. The knight holds it while the ranger reconnects the wires. The knight thinks she's weaving enchantment threads." }
  ],
  'dungeon-concert': [
    { stageIndex: 0, sampleInput: "The skeleton warrior is the drummer -- he bangs on three barrels! The knight uses a torch as a microphone and sings. The mage waves the blue banner like a rock star flag. The barbarian pounds on the table like a bass drum!" },
    { stageIndex: 1, sampleInput: "Stack three barrels as the drum platform in the center. Put the long table on its side as the main stage in front. The knight and barbarian stand on the table. The skeleton stands behind the barrels. Audience sits on chairs in a row facing the stage. Hang red and blue banners behind the stage as a backdrop!" },
    { stageIndex: 2, sampleInput: "The skeleton warrior rattles his jaw and sings into a torch microphone. The barbarian pounds on three barrels going boom-boom-crash! The knight waves a red banner like a rock star windmill. The mage shoots sparkle magic into the air as fireworks. The clown does backflips off the table. The audience of rogue and ranger stomp their feet and cheer!" }
  ],
  'adventurers-picnic': [
    { stageIndex: 0, sampleInput: "First, the knight lays the blanket in the center near the fountain. Then the ranger sets up plates and mugs because she's organized. The rogue sneaks over with sandwiches -- he probably stole extra. The barbarian carries the heavy stuff: cake and pie. The mage uses sparkle magic to hang apples from tree branches as decoration. Everyone sits down when it's ready." },
    { stageIndex: 1, sampleInput: "First, the barbarian spots the birthday cake and charges at it. He trips over the table and flips it! Sandwiches fly everywhere. The knight tries to catch the cake but bumps into the mage, who accidentally casts a spell that makes all the drinks float. The rogue dives to save the pie but slides into the ranger's lap. The ranger screams because there's pie on her map. Apples roll everywhere." },
    { stageIndex: 2, sampleInput: "First, the knight takes charge and tells everyone to stop panicking. The ranger picks up the fallen food and sorts what's still good. The barbarian uses his strength to flip the table back up. The mage casts a cleaning spell on the dirty sandwiches -- sparkles make them fresh again. The rogue secretly replaces the ruined cake with a pie he had hidden in a barrel." },
    { stageIndex: 3, sampleInput: "The knight raises his cup and makes a toast: 'To the worst picnic that became the best!' Everyone cheers. The barbarian shares the last burger with the ranger because she helped the most. The mage makes sparkle fireworks above the trees. The rogue reveals he saved the birthday cake the whole time and puts it on the table with candles. Balloons float up from behind the barrel. Everyone sits in a circle and laughs about the disaster." }
  ]
};
```

Total stages: 3+3+3+3+3+3+4 = 22
