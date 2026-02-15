/**
 * measure-assets.mjs — Puppeteer script to measure bounding boxes of all 3D models.
 *
 * Creates a temporary measurement HTML page, serves it via the Vite dev server,
 * loads each GLB/GLTF via Three.js GLTFLoader, computes bounding box dimensions,
 * and writes results to asset-dimensions.json.
 *
 * Usage: node frontend/tests/measure-assets.mjs
 * Prerequisites: Dev server running on http://localhost:5174
 *
 * Runtime: ~10-15 min for ~7800 models (batched, 10 at a time).
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', '3d')
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'asset-dimensions.json')
const DEV_SERVER = 'http://localhost:5174'
const BATCH_SIZE = 10
const PAGE_LOAD_TIMEOUT = 60_000
const MEASURE_PAGE = '_measure.html'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

/** Recursively find all .glb and .gltf files, returning paths relative to assets/3d/ */
function findModels(dir, base = '') {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      results.push(...findModels(path.join(dir, entry.name), rel))
    } else if (entry.name.endsWith('.glb') || entry.name.endsWith('.gltf')) {
      results.push(rel)
    }
  }
  return results
}

/** Create a minimal HTML page that loads Three.js + GLTFLoader for measurement */
function createMeasurePage() {
  const html = `<!DOCTYPE html>
<html><head><title>Asset Measure</title></head>
<body>
<script type="importmap">
{
  "imports": {
    "three": "/node_modules/three/build/three.module.js",
    "three/addons/": "/node_modules/three/examples/jsm/"
  }
}
</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/node_modules/three/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

window.__measureReady = true;

window.__measureModels = async function(modelPaths) {
  const results = {};

  for (const modelPath of modelPaths) {
    try {
      const url = '/assets/3d/' + modelPath;
      const gltf = await new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = new THREE.Vector3();
      box.getSize(size);

      results[modelPath] = {
        w: +size.x.toFixed(4),
        h: +size.y.toFixed(4),
        d: +size.z.toFixed(4),
      };

      // Dispose to free memory
      gltf.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    } catch (err) {
      results[modelPath] = { w: 0, h: 0, d: 0, error: (err && err.message) || 'load failed' };
    }
  }

  return results;
};
</script>
<p>Asset measurement page — used by measure-assets.mjs</p>
</body></html>`

  const pagePath = path.join(PUBLIC_DIR, MEASURE_PAGE)
  fs.writeFileSync(pagePath, html)
  return pagePath
}

async function run() {
  console.log('Scanning for 3D models...')
  const models = findModels(ASSETS_DIR)
  console.log(`Found ${models.length} models to measure`)

  // Load existing progress (resume support)
  let results = {}
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      results = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'))
      const measured = Object.keys(results).length
      console.log(`Resuming — ${measured} already measured, ${models.length - measured} remaining`)
    } catch { /* start fresh */ }
  }

  const toMeasure = models.filter(m => !results[m])
  if (toMeasure.length === 0) {
    console.log('All models already measured!')
    return
  }

  // Create measurement page
  const measurePagePath = createMeasurePage()
  console.log(`Created measurement page at ${measurePagePath}`)

  console.log(`Launching browser...`)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 800, height: 600 },
  })

  let page

  async function setupPage() {
    if (page) {
      try { await page.close() } catch {}
    }
    page = await browser.newPage()
    page.on('pageerror', () => {})

    console.log(`Navigating to ${DEV_SERVER}/${MEASURE_PAGE}...`)
    await page.goto(`${DEV_SERVER}/${MEASURE_PAGE}`, {
      waitUntil: 'domcontentloaded',
      timeout: PAGE_LOAD_TIMEOUT,
    })

    // Wait for Three.js + GLTFLoader to be ready
    let ready = false
    for (let attempt = 0; attempt < 20; attempt++) {
      ready = await page.evaluate(() => window.__measureReady === true)
      if (ready) break
      await sleep(500)
    }
    if (!ready) {
      throw new Error('Measurement page failed to initialize Three.js')
    }
    console.log('Three.js + GLTFLoader ready')
  }

  await setupPage()

  // Process in batches
  const totalBatches = Math.ceil(toMeasure.length / BATCH_SIZE)
  let measuredCount = Object.keys(results).length
  const startTime = Date.now()
  let consecutiveErrors = 0

  for (let i = 0; i < toMeasure.length; i += BATCH_SIZE) {
    const batch = toMeasure.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1

    try {
      const batchResults = await page.evaluate(async (paths) => {
        return window.__measureModels(paths)
      }, batch)

      Object.assign(results, batchResults)
      measuredCount += batch.length
      consecutiveErrors = 0

      // Save progress every batch
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
      const perSec = measuredCount / Math.max(1, (Date.now() - startTime) / 1000)
      const remaining = toMeasure.length - (i + batch.length)
      const eta = (remaining / perSec).toFixed(0)
      console.log(
        `[${batchNum}/${totalBatches}] ${measuredCount}/${models.length} measured ` +
        `(${elapsed}s, ~${(perSec * 60).toFixed(0)}/min, ETA ${eta}s)`
      )
    } catch (err) {
      consecutiveErrors++
      console.error(`Batch ${batchNum} failed: ${err.message}`)

      // Mark failed models
      for (const m of batch) {
        if (!results[m]) {
          results[m] = { w: 0, h: 0, d: 0, error: 'batch failed' }
        }
      }
      measuredCount += batch.length
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))

      if (consecutiveErrors >= 5) {
        console.error('Too many consecutive errors, stopping.')
        break
      }

      // Try to recover — reload page
      try {
        await setupPage()
        console.log('Page reloaded successfully, continuing...')
      } catch (reloadErr) {
        console.error('Failed to recover:', reloadErr.message)
        break
      }
    }
  }

  // Clean up measurement page
  try { fs.unlinkSync(measurePagePath) } catch {}

  console.log(`\nDone! Measured ${Object.keys(results).length} models.`)
  console.log(`Results saved to: ${OUTPUT_PATH}`)

  // Stats
  const entries = Object.values(results)
  const errors = entries.filter(e => e.error).length
  const valid = entries.length - errors
  console.log(`Valid: ${valid}, Errors: ${errors}`)

  await browser.close()
}

run().catch(err => {
  console.error('Fatal error:', err)
  // Clean up measurement page on failure too
  try { fs.unlinkSync(path.join(PUBLIC_DIR, MEASURE_PAGE)) } catch {}
  process.exit(1)
})
