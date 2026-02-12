#!/usr/bin/env node
/**
 * Visual Regression Test — Quest AI Story Progression
 *
 * Runs all 22 stages across 7 stories via Puppeteer, taking screenshots
 * and validating scene rendering, character positions, and progression.
 *
 * Usage:
 *   node tests/visual-regression.js                          # Run all stories
 *   node tests/visual-regression.js --story=skeleton-birthday # Single story
 *   node tests/visual-regression.js --story=skeleton-birthday --stage=1  # Single stage
 *   node tests/visual-regression.js --fail-fast              # Stop on first failure
 *
 * Prerequisites: Dev server running on localhost:5174 (`npm run dev`)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:5174';
const OUTPUT_DIR = '/tmp/pq-visual-test';
const VIEWPORT = { width: 1280, height: 800 };
const RENDER_WAIT_BASE_MS = 4000;
const RENDER_WAIT_PER_ACTION_MS = 700;
const TRANSITION_WAIT_MS = 2000;

// ─── Test Data: FULL_SUCCESS sampleInputs for each stage ─────────────────────

const STORY_TEST_DATA = {
  'skeleton-birthday': [
    { stageIndex: 0, title: "Who's Invited?", sampleInput: "Invite the knight, the mage, and the rogue! The knight brings his shield, the mage does sparkly magic, and the rogue sneaks in with presents." },
    { stageIndex: 1, title: "Decorate the Dungeon!", sampleInput: "Hang blue and red banners on the walls. Put torches everywhere so the dungeon is bright. Set up a long table in the middle with chairs around it." },
    { stageIndex: 2, title: "The Birthday Cake!", sampleInput: "A giant birthday cake drops from the ceiling into the center of the table! The skeleton cheers and all the guests wave. Then confetti explodes everywhere!" },
  ],
  'skeleton-pizza': [
    { stageIndex: 0, title: "Pick Up the Pizza", sampleInput: "The skeleton warrior walks carefully to the counter and picks up a pepperoni pizza. The skeleton rogue ties the skeleton's arms on tight with rope so they don't fall off. He holds the pizza on a plate." },
    { stageIndex: 1, title: "The Delivery Route", sampleInput: "The skeleton warrior walks carefully from the restaurant on the left toward the knight waiting on the right. He has to dodge a bench in the middle -- the skeleton rogue pushes it out of the way. The skeleton runs the last bit to deliver it hot!" },
    { stageIndex: 2, title: "The Handoff", sampleInput: "The skeleton warrior carefully places the pepperoni pizza on the round table in front of the knight. The knight cheers and waves. The skeleton does a victory taunt! Then confetti explodes to celebrate the successful delivery." },
  ],
  'mage-kitchen': [
    { stageIndex: 0, title: "The Kitchen Is Alive!", sampleInput: "The mage is standing on the left side looking scared because the stove on the right is shooting fire. Pots and pans are flying around the center. The fridge door keeps opening and slamming shut on its own." },
    { stageIndex: 1, title: "Tame the Stove!", sampleInput: "The mage raises his staff and casts a frost spell from the left toward the stove on the right. The ice magic cools down the stove and puts out the fire. Sparkles appear when the spell works!" },
    { stageIndex: 2, title: "Save the Dinner!", sampleInput: "The mage uses a levitation spell to float the pots back onto the stove. The witch stirs with a magic wand while the mage heats it up with a gentle fire spell. Skeleton minions carry plates to the table. They make enchanted soup that glows purple!" },
  ],
  'barbarian-school': [
    { stageIndex: 0, title: "Getting Through the Door", sampleInput: "First, the barbarian walks up to the door from the left. Then he tries to squeeze through but gets stuck. Next, the knight pushes him from behind. Finally, he pops through and stumbles to the center!" },
    { stageIndex: 1, title: "Finding a Seat", sampleInput: "First, the barbarian walks to the nearest desk. Then he looks at it and realizes it's tiny. Next, he tries to sit but the chair breaks! Finally, the knight brings two chairs and the barbarian sits on both of them at once." },
    { stageIndex: 2, title: "Making Friends at Recess", sampleInput: "First, the barbarian sees the knight playing near the sandbox. Then he walks over slowly so he doesn't scare anyone. Next, he waves and says hi. The knight waves back. Then the barbarian asks if he can play too. Finally, the knight shows him how to build a sandcastle together!" },
  ],
  'knight-space': [
    { stageIndex: 0, title: "Lost in Space!", sampleInput: "The knight floats in looking confused. He sees the dome and thinks it's a giant shield! He tries to pick it up. The solar panels look like dragon wings and he tries to fight them with his sword." },
    { stageIndex: 1, title: "Meeting the Space Ranger", sampleInput: "The knight sees the space ranger's helmet and thinks it's a magical crystal ball head. He bows and says 'Greetings, crystal wizard!' The space ranger sees the knight's armor and thinks it's an old-fashioned spacesuit. She says 'Nice retro gear!' They're both confused but friendly." },
    { stageIndex: 2, title: "Working Together", sampleInput: "The knight thinks the solar panel is a fallen dragon wing and tries to lift it back into place with his strength. The space ranger realizes the knight's brute force is actually useful! She points to where it needs to go. The knight holds it while the ranger reconnects the wires. The knight thinks she's weaving enchantment threads." },
  ],
  'dungeon-concert': [
    { stageIndex: 0, title: "Assemble the Band!", sampleInput: "The skeleton warrior is the drummer -- he bangs on three barrels! The knight uses a torch as a microphone and sings. The mage waves the blue banner like a rock star flag. The barbarian pounds on the table like a bass drum!" },
    { stageIndex: 1, title: "Set Up the Stage", sampleInput: "Stack three barrels as the drum platform in the center. Put the long table on its side as the main stage in front. The knight and barbarian stand on the table. The skeleton stands behind the barrels. Audience sits on chairs in a row facing the stage. Hang red and blue banners behind the stage as a backdrop!" },
    { stageIndex: 2, title: "The Big Performance!", sampleInput: "The skeleton warrior rattles his jaw and sings into a torch microphone. The barbarian pounds on three barrels going boom-boom-crash! The knight waves a red banner like a rock star windmill. The mage shoots sparkle magic into the air as fireworks. The clown does backflips off the table. The audience of rogue and ranger stomp their feet and cheer!" },
  ],
  'adventurers-picnic': [
    { stageIndex: 0, title: "Setting Up the Picnic", sampleInput: "First, the knight lays the blanket in the center near the fountain. Then the ranger sets up plates and mugs because she's organized. The rogue sneaks over with sandwiches -- he probably stole extra. The barbarian carries the heavy stuff: cake and pie. The mage uses sparkle magic to hang apples from tree branches as decoration. Everyone sits down when it's ready." },
    { stageIndex: 1, title: "Disaster Strikes!", sampleInput: "First, the barbarian spots the birthday cake and charges at it. He trips over the table and flips it! Sandwiches fly everywhere. The knight tries to catch the cake but bumps into the mage, who accidentally casts a spell that makes all the drinks float. The rogue dives to save the pie but slides into the ranger's lap. The ranger screams because there's pie on her map. Apples roll everywhere." },
    { stageIndex: 2, title: "Save the Picnic!", sampleInput: "First, the knight takes charge and tells everyone to stop panicking. The ranger picks up the fallen food and sorts what's still good. The barbarian uses his strength to flip the table back up. The mage casts a cleaning spell on the dirty sandwiches -- sparkles make them fresh again. The rogue secretly replaces the ruined cake with a pie he had hidden in a barrel." },
    { stageIndex: 3, title: "The Grand Finale", sampleInput: "The knight raises his cup and makes a toast: 'To the worst picnic that became the best!' Everyone cheers. The barbarian shares the last burger with the ranger because she helped the most. The mage makes sparkle fireworks above the trees. The rogue reveals he saved the birthday cake the whole time and puts it on the table with candles. Balloons float up from behind the barrel. Everyone sits in a circle and laughs about the disaster." },
  ],
};

const STORY_ORDER = [
  'skeleton-birthday',
  'skeleton-pizza',
  'mage-kitchen',
  'barbarian-school',
  'knight-space',
  'dungeon-concert',
  'adventurers-picnic',
];

// ─── CLI Arguments ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const filterStory = getArg('story');
const filterStage = getArg('stage') !== null ? parseInt(getArg('stage')) : null;
const failFast = hasFlag('fail-fast');
const headed = hasFlag('headed');

// ─── Utility Functions ───────────────────────────────────────────────────────

async function waitMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkDevServer() {
  try {
    const http = require('http');
    return new Promise((resolve) => {
      const req = http.get(BASE_URL, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(3000, () => { req.destroy(); resolve(false); });
    });
  } catch { return false; }
}

async function getStoreState(page) {
  return page.evaluate(() => {
    const s = window.__gameStore.getState();
    // Zustand getState() returns all fields — extract what we need
    // Use JSON parse/stringify to ensure serializable
    return JSON.parse(JSON.stringify({
      currentZone: s.currentZone,
      currentTask: s.currentTask,
      currentStageIndex: s.currentStageIndex,
      stageComplete: s.stageComplete,
      isLoading: s.isLoading,
      hintsUsed: s.hintsUsed,
      storyProgress: s.storyProgress,
      lastScript: s.lastScript,
      lastSource: s.lastSource,
      error: s.error,
      playerPosition: s.playerPosition,
    }));
  });
}

async function captureScreenshot(page, storyId, stageIndex, label) {
  const dir = path.join(OUTPUT_DIR, storyId);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `stage-${stageIndex}-${label}.png`;
  const filepath = path.join(dir, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  return filepath;
}

async function enterZone(page, zoneId) {
  await page.evaluate((id) => {
    window.__gameStore.getState().enterZone(id);
  }, zoneId);
  await waitMs(TRANSITION_WAIT_MS);

  const state = await getStoreState(page);
  return {
    pass: state.currentZone === zoneId && state.currentStageIndex === 0,
    state,
  };
}

async function exitZone(page) {
  await page.evaluate(() => {
    window.__gameStore.getState().exitZone();
  });
  await waitMs(1500);
}

async function submitInput(page, inputText) {
  await page.evaluate((text) => {
    const store = window.__gameStore.getState();
    store.setInput(text);
  }, inputText);

  // Small delay to let React re-render the input
  await waitMs(100);

  await page.evaluate(() => {
    window.__gameStore.getState().submitInput();
  });

  // Wait for loading to complete (poll every 200ms, max 15s)
  const maxWait = 15000;
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const loading = await page.evaluate(() => window.__gameStore.getState().isLoading);
    if (!loading) break;
    await waitMs(200);
  }

  return getStoreState(page);
}

async function waitForSceneRender(page, script) {
  const actionCount = script?.actions?.length || 0;
  const waitTime = Math.max(RENDER_WAIT_BASE_MS, actionCount * RENDER_WAIT_PER_ACTION_MS);
  await waitMs(waitTime);
}

async function advanceStage(page) {
  const beforeState = await getStoreState(page);
  await page.evaluate(() => {
    window.__gameStore.getState().advanceStage();
  });
  await waitMs(1500);
  const afterState = await getStoreState(page);
  return {
    pass: afterState.currentStageIndex === beforeState.currentStageIndex + 1,
    beforeIndex: beforeState.currentStageIndex,
    afterIndex: afterState.currentStageIndex,
    state: afterState,
  };
}

function analyzeScript(script) {
  if (!script) return { actors: [], reactions: [], positions: [], issues: [] };

  const issues = [];
  const actors = [];
  const reactions = [];
  const positionMap = new Map(); // position key -> actor names

  for (const action of (script.actions || [])) {
    if (action.type === 'spawn') {
      const pos = action.position || 'center';
      actors.push({ target: action.target, position: pos });
      const key = pos;
      if (!positionMap.has(key)) positionMap.set(key, []);
      positionMap.get(key).push(action.target);
    }
    if (action.type === 'spawn_group') {
      for (const t of (action.targets || [])) {
        actors.push({ target: t.id || t.target, position: t.position || 'center' });
      }
    }
    if (action.type === 'react') {
      reactions.push({ effect: action.effect, position: action.position || 'center' });
    }
  }

  // Check for position overlaps (same named position, different actors)
  for (const [pos, actorNames] of positionMap) {
    if (actorNames.length > 1) {
      issues.push({
        type: 'OVERLAP',
        severity: 'warning',
        message: `${actorNames.length} actors at position "${pos}": ${actorNames.join(', ')}`,
      });
    }
  }

  return { actors, reactions, positions: Array.from(positionMap.entries()), issues };
}

// ─── Main Test Runner ────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Quest AI — Visual Regression Test Suite             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  // Check dev server
  const serverUp = await checkDevServer();
  if (!serverUp) {
    console.error('❌ Dev server not running at ' + BASE_URL);
    console.error('   Run: cd frontend && npm run dev');
    process.exit(1);
  }
  console.log('✓ Dev server running at ' + BASE_URL);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: headed ? false : 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Navigate and verify store access
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitMs(6000); // Let React/R3F initialize + GLTF models load

  const storeAvailable = await page.evaluate(() => typeof window.__gameStore !== 'undefined');
  if (!storeAvailable) {
    console.error('❌ Store not exposed at window.__gameStore. Ensure DEV mode.');
    await browser.close();
    process.exit(1);
  }
  console.log('✓ Store API available\n');

  // Determine which stories to test
  const storiesToTest = filterStory
    ? [filterStory]
    : STORY_ORDER;

  const results = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;

  for (const storyId of storiesToTest) {
    const stages = STORY_TEST_DATA[storyId];
    if (!stages) {
      console.error(`❌ Unknown story: ${storyId}`);
      continue;
    }

    const stageCount = stages.length;
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📖 ${storyId} (${stageCount} stages)`);
    console.log(`${'═'.repeat(60)}`);

    // Enter zone
    const entryResult = await enterZone(page, storyId);
    if (!entryResult.pass) {
      console.error(`  ❌ Failed to enter zone: currentZone=${entryResult.state.currentZone}, stageIndex=${entryResult.state.currentStageIndex}, stageComplete=${entryResult.state.stageComplete}`);
      console.error(`     storyProgress:`, JSON.stringify(entryResult.state.storyProgress));
      results.push({ storyId, stageIndex: -1, pass: false, issues: ['Zone entry failed'] });
      if (failFast) break;
      continue;
    }
    console.log(`  ✓ Entered zone (stage 0)`);

    // Screenshot initial state
    const introPath = await captureScreenshot(page, storyId, 0, 'intro');
    console.log(`  📸 ${introPath}`);

    for (const stageData of stages) {
      if (filterStage !== null && stageData.stageIndex !== filterStage) continue;

      const stageResult = {
        storyId,
        stageIndex: stageData.stageIndex,
        title: stageData.title,
        pass: true,
        issues: [],
        screenshots: [],
        scriptAnalysis: null,
      };

      console.log(`\n  ── Stage ${stageData.stageIndex + 1}: "${stageData.title}" ──`);

      try {
        // Submit the FULL_SUCCESS input
        console.log(`  ⏳ Submitting input (${stageData.sampleInput.slice(0, 60)}...)`);
        const afterSubmit = await submitInput(page, stageData.sampleInput);

        if (afterSubmit.error) {
          stageResult.issues.push({ type: 'ERROR', severity: 'blocker', message: `Submit error: ${afterSubmit.error}` });
          stageResult.pass = false;
        }

        if (!afterSubmit.lastScript) {
          stageResult.issues.push({ type: 'NO_SCRIPT', severity: 'blocker', message: 'No script returned after submit' });
          stageResult.pass = false;
        }

        // Wait for scene to render
        await waitForSceneRender(page, afterSubmit.lastScript);

        // Screenshot after render
        const renderPath = await captureScreenshot(page, storyId, stageData.stageIndex, 'rendered');
        stageResult.screenshots.push(renderPath);
        console.log(`  📸 ${renderPath}`);

        // Analyze the script for positioning issues
        if (afterSubmit.lastScript) {
          const analysis = analyzeScript(afterSubmit.lastScript);
          stageResult.scriptAnalysis = analysis;

          console.log(`     Actors: ${analysis.actors.length}, Reactions: ${analysis.reactions.length}`);

          if (analysis.issues.length > 0) {
            for (const issue of analysis.issues) {
              stageResult.issues.push(issue);
              console.log(`     ⚠️  ${issue.message}`);
              totalWarnings++;
            }
          }

          // Log success level
          console.log(`     Success: ${afterSubmit.lastScript.success_level}`);
          console.log(`     Narration: "${afterSubmit.lastScript.narration?.slice(0, 80)}..."`);
        }

        // Validate stage completion
        const stateAfter = await getStoreState(page);
        if (!stateAfter.stageComplete) {
          stageResult.issues.push({
            type: 'NOT_COMPLETE',
            severity: 'major',
            message: `Stage not marked complete (success_level=${afterSubmit.lastScript?.success_level})`,
          });
          stageResult.pass = false;
          console.log(`  ❌ Stage NOT complete`);
        } else {
          console.log(`  ✓ Stage complete`);
        }

        // Advance to next stage (or complete story)
        const isLastStage = stageData.stageIndex === stages.length - 1;
        if (!isLastStage && stateAfter.stageComplete) {
          const advance = await advanceStage(page);
          if (advance.pass) {
            console.log(`  ✓ Advanced to stage ${advance.afterIndex + 1}`);
            // Screenshot next stage intro
            const advancePath = await captureScreenshot(page, storyId, advance.afterIndex, 'intro');
            console.log(`  📸 ${advancePath}`);
          } else {
            stageResult.issues.push({
              type: 'ADVANCE_FAILED',
              severity: 'blocker',
              message: `Failed to advance: index ${advance.beforeIndex} → ${advance.afterIndex}`,
            });
            stageResult.pass = false;
          }
        } else if (isLastStage && stateAfter.stageComplete) {
          // Complete story — advanceStage triggers completeStory internally
          console.log(`  ⏳ Completing story...`);
          await page.evaluate(() => {
            window.__gameStore.getState().advanceStage();
          });
          await waitMs(3000); // Wait for completeStory + exitZone timeout

          const finalState = await getStoreState(page);
          const expectedProgress = stages.length;
          const actualProgress = finalState.storyProgress[storyId] || 0;

          if (actualProgress >= expectedProgress) {
            console.log(`  ✓ Story complete! (progress: ${actualProgress}/${expectedProgress})`);
          } else {
            stageResult.issues.push({
              type: 'STORY_INCOMPLETE',
              severity: 'major',
              message: `Story not fully complete: progress=${actualProgress}, expected=${expectedProgress}`,
            });
            stageResult.pass = false;
          }

          // Screenshot final state
          const finalPath = await captureScreenshot(page, storyId, stageData.stageIndex, 'complete');
          stageResult.screenshots.push(finalPath);
          console.log(`  📸 ${finalPath}`);
        }

      } catch (err) {
        stageResult.issues.push({
          type: 'EXCEPTION',
          severity: 'blocker',
          message: `Exception: ${err.message}`,
        });
        stageResult.pass = false;

        // Error screenshot
        try {
          const errPath = await captureScreenshot(page, storyId, stageData.stageIndex, 'error');
          stageResult.screenshots.push(errPath);
          console.log(`  📸 ERROR: ${errPath}`);
        } catch {}

        console.error(`  ❌ EXCEPTION: ${err.message}`);
      }

      if (stageResult.pass) {
        totalPassed++;
        console.log(`  ✅ PASS`);
      } else {
        totalFailed++;
        console.log(`  ❌ FAIL (${stageResult.issues.length} issues)`);
      }

      results.push(stageResult);

      if (!stageResult.pass && failFast) {
        console.log('\n⛔ --fail-fast: stopping on first failure');
        break;
      }
    }

    // Exit zone if still in one (cleanup for next story)
    const currentState = await getStoreState(page);
    if (currentState.currentZone) {
      await exitZone(page);
      await waitMs(1000);
    }

    if (failFast && totalFailed > 0) break;
  }

  // ─── Report ──────────────────────────────────────────────────────────────

  console.log(`\n${'═'.repeat(60)}`);
  console.log('RESULTS SUMMARY');
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Passed:   ${totalPassed}`);
  console.log(`  Failed:   ${totalFailed}`);
  console.log(`  Warnings: ${totalWarnings}`);
  console.log(`  Total:    ${totalPassed + totalFailed}`);
  console.log();

  // List failures
  const failures = results.filter(r => !r.pass);
  if (failures.length > 0) {
    console.log('FAILURES:');
    for (const f of failures) {
      console.log(`  ❌ ${f.storyId} stage ${f.stageIndex + 1} (${f.title || ''})`);
      for (const issue of f.issues) {
        console.log(`     [${issue.severity}] ${issue.message}`);
      }
    }
    console.log();
  }

  // List warnings
  const warnings = results.filter(r => r.scriptAnalysis?.issues?.length > 0);
  if (warnings.length > 0) {
    console.log('WARNINGS (position overlaps, etc.):');
    for (const w of warnings) {
      for (const issue of w.scriptAnalysis.issues) {
        console.log(`  ⚠️  ${w.storyId} stage ${w.stageIndex + 1}: ${issue.message}`);
      }
    }
    console.log();
  }

  // Save JSON report
  const report = {
    timestamp: new Date().toISOString(),
    totalStages: totalPassed + totalFailed,
    passed: totalPassed,
    failed: totalFailed,
    warnings: totalWarnings,
    results,
  };
  const reportPath = path.join(OUTPUT_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 JSON report: ${reportPath}`);

  // Save HTML report
  const htmlReport = generateHtmlReport(report);
  const htmlPath = path.join(OUTPUT_DIR, 'report.html');
  fs.writeFileSync(htmlPath, htmlReport);
  console.log(`📄 HTML report: ${htmlPath}`);

  console.log(`\n📁 Screenshots: ${OUTPUT_DIR}/`);

  await browser.close();

  process.exit(totalFailed > 0 ? 1 : 0);
}

// ─── HTML Report Generator ──────────────────────────────────────────────────

function generateHtmlReport(report) {
  const storyGroups = {};
  for (const r of report.results) {
    if (!storyGroups[r.storyId]) storyGroups[r.storyId] = [];
    storyGroups[r.storyId].push(r);
  }

  let html = `<!DOCTYPE html>
<html><head>
<title>Quest AI Visual Regression Report</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 1400px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
  h1 { color: #333; }
  .summary { display: flex; gap: 20px; margin: 20px 0; }
  .stat { padding: 15px 25px; border-radius: 12px; font-size: 24px; font-weight: bold; color: white; }
  .stat-pass { background: #22c55e; }
  .stat-fail { background: #ef4444; }
  .stat-warn { background: #f59e0b; }
  .story { margin: 30px 0; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .story h2 { margin-top: 0; }
  .stage { margin: 15px 0; padding: 15px; border: 2px solid #e5e7eb; border-radius: 8px; }
  .stage.pass { border-color: #22c55e; }
  .stage.fail { border-color: #ef4444; background: #fef2f2; }
  .stage-header { display: flex; justify-content: space-between; align-items: center; }
  .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-pass { background: #dcfce7; color: #166534; }
  .badge-fail { background: #fecaca; color: #991b1b; }
  .screenshots { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
  .screenshots img { max-width: 400px; border-radius: 8px; border: 1px solid #ddd; cursor: pointer; }
  .screenshots img:hover { border-color: #7c3aed; }
  .issue { margin: 5px 0; padding: 5px 10px; border-radius: 4px; font-size: 13px; }
  .issue-blocker { background: #fecaca; color: #991b1b; }
  .issue-major { background: #fed7aa; color: #9a3412; }
  .issue-warning { background: #fef3c7; color: #92400e; }
  .analysis { font-size: 13px; color: #666; margin-top: 8px; }
</style>
</head><body>
<h1>Quest AI Visual Regression Report</h1>
<p>Generated: ${report.timestamp}</p>
<div class="summary">
  <div class="stat stat-pass">${report.passed} Passed</div>
  <div class="stat stat-fail">${report.failed} Failed</div>
  <div class="stat stat-warn">${report.warnings} Warnings</div>
</div>`;

  for (const [storyId, stages] of Object.entries(storyGroups)) {
    const allPass = stages.every(s => s.pass);
    html += `
<div class="story">
  <h2>${allPass ? '✅' : '❌'} ${storyId} (${stages.length} stages)</h2>`;

    for (const stage of stages) {
      html += `
  <div class="stage ${stage.pass ? 'pass' : 'fail'}">
    <div class="stage-header">
      <strong>Stage ${stage.stageIndex + 1}: ${stage.title || ''}</strong>
      <span class="badge ${stage.pass ? 'badge-pass' : 'badge-fail'}">${stage.pass ? 'PASS' : 'FAIL'}</span>
    </div>`;

      if (stage.issues.length > 0) {
        for (const issue of stage.issues) {
          const cls = issue.severity === 'blocker' ? 'issue-blocker' : issue.severity === 'major' ? 'issue-major' : 'issue-warning';
          html += `\n    <div class="issue ${cls}">[${issue.severity}] ${issue.message}</div>`;
        }
      }

      if (stage.scriptAnalysis) {
        html += `\n    <div class="analysis">Actors: ${stage.scriptAnalysis.actors.length} | Reactions: ${stage.scriptAnalysis.reactions.length}</div>`;
      }

      if (stage.screenshots && stage.screenshots.length > 0) {
        html += `\n    <div class="screenshots">`;
        for (const ss of stage.screenshots) {
          html += `\n      <img src="file://${ss}" alt="Stage ${stage.stageIndex}" onclick="window.open('file://${ss}')"/>`;
        }
        html += `\n    </div>`;
      }

      html += `\n  </div>`;
    }

    html += `\n</div>`;
  }

  html += `\n</body></html>`;
  return html;
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
