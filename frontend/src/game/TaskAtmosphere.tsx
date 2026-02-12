/**
 * TaskAtmosphere — Per-task atmospheric rendering for Quest AI.
 *
 * Renders fog, lighting, particles, sky/environment, post-processing,
 * and ground plane — all configured per task for unique moods.
 *
 * Architecture: Pure data-driven. TASK_CONFIGS defines the look.
 * R3FGame.tsx renders <TaskAtmosphere taskId={...} /> inside the Canvas.
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import {
  Sparkles,
  ContactShadows,
  Stars,
  Sky,
  Environment,
  Cloud,
  Clouds,
  SoftShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

// ============================================================================
// CONFIG TYPES
// ============================================================================

interface PointLightConfig {
  color: string
  intensity: number
  distance: number
  position: [number, number, number]
}

interface CloudConfig {
  bounds: [number, number, number]
  color: string
  opacity: number
  speed: number
  position: [number, number, number]
  segments?: number
  volume?: number
}

interface AtmosphereConfig {
  background: string
  fog: { color: string; near: number; far: number }
  hemisphere: { sky: string; ground: string; intensity: number }
  directionalLight: { color: string; intensity: number; position: [number, number, number] }
  sparkles: { count: number; color: string; size: number; speed: number; scale: number | [number, number, number] }
  contactShadows: { opacity: number; blur: number; far: number }
  ground: { color: string; radius: number }
  environment?: { preset: string; background?: boolean; backgroundBlurriness?: number }
  sky?: { sunPosition: [number, number, number]; turbidity: number; rayleigh: number }
  stars?: { count: number; radius: number; factor: number; speed: number }
  pointLights?: PointLightConfig[]
  clouds?: CloudConfig[]
  bloom?: { luminanceThreshold: number; intensity: number }
  vignette?: { offset: number; darkness: number }
}

// ============================================================================
// PER-TASK ATMOSPHERE CONFIGS
// ============================================================================

const DEFAULT_CONFIG: AtmosphereConfig = {
  background: '#1A0533',
  fog: { color: '#1A0533', near: 14, far: 35 },
  hemisphere: { sky: '#6633aa', ground: '#331155', intensity: 0.6 },
  directionalLight: { color: '#ffffff', intensity: 1.0, position: [5, 8, 5] },
  sparkles: { count: 60, color: '#aa88ff', size: 3, speed: 0.3, scale: [10, 5, 10] },
  contactShadows: { opacity: 0.4, blur: 2.5, far: 4 },
  ground: { color: '#2a1a4a', radius: 12 },
  bloom: { luminanceThreshold: 0.9, intensity: 0.6 },
  vignette: { offset: 0.1, darkness: 0.4 },
}

const TASK_CONFIGS: Record<string, Partial<AtmosphereConfig>> = {
  // T1: Skeleton's Surprise Birthday — Magical Dungeon
  'skeleton-birthday': {
    background: '#0a0015',
    fog: { color: '#0a0015', near: 12, far: 28 },
    hemisphere: { sky: '#6633aa', ground: '#331155', intensity: 0.5 },
    directionalLight: { color: '#ffffff', intensity: 0.8, position: [5, 8, 5] },
    sparkles: { count: 80, color: '#aa88ff', size: 3, speed: 0.3, scale: [8, 4, 8] },
    contactShadows: { opacity: 0.5, blur: 2, far: 4 },
    ground: { color: '#1a0f2e', radius: 12 },
    environment: { preset: 'night', background: true, backgroundBlurriness: 0.9 },
    stars: { count: 300, radius: 40, factor: 2, speed: 0.5 },
    pointLights: [
      { color: '#ff6600', intensity: 2, distance: 8, position: [-5, 3, -3] },
      { color: '#ff6600', intensity: 2, distance: 8, position: [5, 3, -3] },
    ],
    bloom: { luminanceThreshold: 0.9, intensity: 0.6 },
    vignette: { offset: 0.1, darkness: 0.5 },
  },

  // T2: Knight's Space Mission — Space Station
  'knight-space': {
    background: '#020208',
    fog: { color: '#020208', near: 18, far: 50 },
    hemisphere: { sky: '#000033', ground: '#111122', intensity: 0.4 },
    directionalLight: { color: '#ffffff', intensity: 1.2, position: [3, 6, 5] },
    sparkles: { count: 40, color: '#aaccff', size: 2, speed: 0.1, scale: 15 },
    contactShadows: { opacity: 0.3, blur: 3, far: 5 },
    ground: { color: '#0a0a2a', radius: 14 },
    environment: { preset: 'night', background: true, backgroundBlurriness: 0.5 },
    stars: { count: 5000, radius: 100, factor: 4, speed: 1 },
    bloom: { luminanceThreshold: 0.8, intensity: 1.0 },
    vignette: { offset: 0.15, darkness: 0.6 },
  },

  // T3: Mage vs. Kitchen — Warm Interior
  'mage-kitchen': {
    background: '#1a1008',
    fog: { color: '#1a1008', near: 14, far: 30 },
    hemisphere: { sky: '#ffcc88', ground: '#664422', intensity: 0.6 },
    directionalLight: { color: '#fff5e0', intensity: 0.9, position: [2, 6, 4] },
    sparkles: { count: 60, color: '#ffaa44', size: 2, speed: 0.4, scale: 6 },
    contactShadows: { opacity: 0.4, blur: 2, far: 3 },
    ground: { color: '#3a2a1a', radius: 10 },
    environment: { preset: 'apartment' },
    pointLights: [
      { color: '#ff8844', intensity: 1.5, distance: 6, position: [0, 3, -2] },
    ],
    bloom: { luminanceThreshold: 1.0, intensity: 0.5 },
    vignette: { offset: 0.1, darkness: 0.3 },
  },

  // T4: Barbarian's School — Outdoor Playground
  'barbarian-school': {
    background: '#87CEEB',
    fog: { color: '#87CEEB', near: 20, far: 45 },
    hemisphere: { sky: '#87CEEB', ground: '#556B2F', intensity: 0.8 },
    directionalLight: { color: '#fff8e0', intensity: 1.5, position: [8, 12, 6] },
    sparkles: { count: 30, color: '#88ff88', size: 2, speed: 0.2, scale: [10, 3, 10] },
    contactShadows: { opacity: 0.5, blur: 2, far: 5 },
    ground: { color: '#3a5a2a', radius: 14 },
    sky: { sunPosition: [5, 10, 8], turbidity: 8, rayleigh: 2 },
    clouds: [
      { bounds: [10, 2, 5] as [number, number, number], color: '#ffffff', opacity: 0.5, speed: 0.2, position: [0, 10, -15] as [number, number, number], segments: 15, volume: 6 },
    ],
    bloom: { luminanceThreshold: 1.2, intensity: 0.3 },
    vignette: { offset: 0.05, darkness: 0.2 },
  },

  // T5: Dungeon Rock Concert — Smoky Dungeon
  'dungeon-concert': {
    background: '#080410',
    fog: { color: '#080410', near: 8, far: 24 },
    hemisphere: { sky: '#4422aa', ground: '#221133', intensity: 0.4 },
    directionalLight: { color: '#ffffff', intensity: 0.5, position: [0, 6, 3] },
    sparkles: { count: 150, color: '#ff44ff', size: 4, speed: 0.6, scale: 8 },
    contactShadows: { opacity: 0.6, blur: 3, far: 4 },
    ground: { color: '#0f0a1a', radius: 12 },
    stars: { count: 200, radius: 30, factor: 2, speed: 0.3 },
    pointLights: [
      { color: '#ff4400', intensity: 3, distance: 10, position: [-4, 4, -2] },
      { color: '#4444ff', intensity: 2, distance: 8, position: [4, 4, -2] },
      { color: '#ff00ff', intensity: 2, distance: 6, position: [0, 3, 0] },
    ],
    clouds: [
      { bounds: [12, 1, 8] as [number, number, number], color: '#4422aa', opacity: 0.1, speed: 0.15, position: [0, 2, 0] as [number, number, number], segments: 8, volume: 2 },
    ],
    bloom: { luminanceThreshold: 0.7, intensity: 1.2 },
    vignette: { offset: 0.15, darkness: 0.7 },
  },

  // T6: Skeleton Pizza Delivery — Evening Street
  'skeleton-pizza': {
    background: '#1a2a40',
    fog: { color: '#1a2a40', near: 15, far: 35 },
    hemisphere: { sky: '#ff9966', ground: '#553322', intensity: 0.6 },
    directionalLight: { color: '#ffddaa', intensity: 0.8, position: [6, 5, 8] },
    sparkles: { count: 40, color: '#ffcc66', size: 2, speed: 0.2, scale: 10 },
    contactShadows: { opacity: 0.4, blur: 2, far: 4 },
    ground: { color: '#2a2a3a', radius: 12 },
    environment: { preset: 'sunset', background: true, backgroundBlurriness: 0.7 },
    bloom: { luminanceThreshold: 1.0, intensity: 0.4 },
    vignette: { offset: 0.1, darkness: 0.35 },
  },

  // T7: Adventurers' Picnic — Bright Outdoor
  'adventurers-picnic': {
    background: '#d4e8f0',
    fog: { color: '#d4e8f0', near: 25, far: 55 },
    hemisphere: { sky: '#87CEEB', ground: '#7CFC00', intensity: 0.9 },
    directionalLight: { color: '#fffff0', intensity: 1.8, position: [10, 15, 8] },
    sparkles: { count: 50, color: '#ffdd44', size: 1.5, speed: 0.15, scale: [12, 3, 12] },
    contactShadows: { opacity: 0.5, blur: 1.5, far: 5 },
    ground: { color: '#3a6a2a', radius: 14 },
    sky: { sunPosition: [8, 15, 5], turbidity: 6, rayleigh: 1.5 },
    environment: { preset: 'park' },
    clouds: [
      { bounds: [12, 2, 6] as [number, number, number], color: '#ffffff', opacity: 0.4, speed: 0.15, position: [-5, 12, -20] as [number, number, number], segments: 20, volume: 8 },
      { bounds: [8, 2, 4] as [number, number, number], color: '#ffffff', opacity: 0.35, speed: 0.1, position: [8, 14, -25] as [number, number, number], segments: 15, volume: 6 },
    ],
    bloom: { luminanceThreshold: 1.2, intensity: 0.2 },
    vignette: { offset: 0.05, darkness: 0.15 },
  },
}

// ============================================================================
// HELPER: Merge config with defaults
// ============================================================================

function getConfig(taskId: string): AtmosphereConfig {
  const overrides = TASK_CONFIGS[taskId] || {}
  return { ...DEFAULT_CONFIG, ...overrides }
}

// ============================================================================
// GROUND PLANE COMPONENT (Circular with fade via material)
// ============================================================================

function GroundPlane({ color, radius }: { color: string; radius: number }) {
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 0.9,
    })
  }, [color])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow material={material}>
      <circleGeometry args={[radius, 64]} />
    </mesh>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface TaskAtmosphereProps {
  taskId: string
}

export function TaskAtmosphere({ taskId }: TaskAtmosphereProps) {
  const config = getConfig(taskId)

  return (
    <>
      {/* Background color — replaces CSS background */}
      <color attach="background" args={[config.background]} />

      {/* Fog — eliminates the void, blends ground edges */}
      <fog attach="fog" args={[config.fog.color, config.fog.near, config.fog.far]} />

      {/* Soft shadows — global shader patch for softer shadow edges */}
      <SoftShadows size={25} samples={10} focus={0} />

      {/* Hemisphere light — replaces flat ambientLight */}
      <hemisphereLight
        color={config.hemisphere.sky}
        groundColor={config.hemisphere.ground}
        intensity={config.hemisphere.intensity}
      />

      {/* Directional light (key light) */}
      <directionalLight
        color={config.directionalLight.color}
        intensity={config.directionalLight.intensity}
        position={config.directionalLight.position}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Point lights (torches, stage lights, etc.) */}
      {config.pointLights?.map((light, i) => (
        <pointLight
          key={`pl-${i}`}
          color={light.color}
          intensity={light.intensity}
          distance={light.distance}
          decay={2}
          position={light.position}
        />
      ))}

      {/* Sparkles — instant ambient magic */}
      <Sparkles
        count={config.sparkles.count}
        speed={config.sparkles.speed}
        opacity={0.7}
        color={config.sparkles.color}
        size={config.sparkles.size}
        scale={config.sparkles.scale}
        noise={1}
      />

      {/* Stars — night/space/dungeon ceiling */}
      {config.stars && (
        <Stars
          radius={config.stars.radius}
          depth={config.stars.radius / 2}
          count={config.stars.count}
          factor={config.stars.factor}
          saturation={0}
          fade
          speed={config.stars.speed}
        />
      )}

      {/* Sky shader — outdoor scenes */}
      {config.sky && (
        <Sky
          distance={450000}
          sunPosition={config.sky.sunPosition}
          turbidity={config.sky.turbidity}
          rayleigh={config.sky.rayleigh}
        />
      )}

      {/* Environment map — HDR lighting and optional blurred background */}
      {config.environment && (
        <Environment
          preset={config.environment.preset as any}
          background={config.environment.background}
          backgroundBlurriness={config.environment.backgroundBlurriness}
        />
      )}

      {/* Clouds */}
      {config.clouds && config.clouds.length > 0 && (
        <Clouds limit={200} material={THREE.MeshLambertMaterial}>
          {config.clouds.map((cloud, i) => (
            <Cloud
              key={`cloud-${i}`}
              segments={cloud.segments || 15}
              bounds={cloud.bounds}
              volume={cloud.volume || 5}
              color={cloud.color}
              opacity={cloud.opacity}
              speed={cloud.speed}
              position={cloud.position}
            />
          ))}
        </Clouds>
      )}

      {/* Contact shadows — soft blob shadows under objects */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={config.contactShadows.opacity}
        scale={20}
        blur={config.contactShadows.blur}
        far={config.contactShadows.far}
        resolution={256}
        color="#000000"
      />

      {/* Ground plane — circular with fog-fade at edges */}
      <GroundPlane color={config.ground.color} radius={config.ground.radius} />

      {/* Post-processing — Bloom + Vignette */}
      {config.bloom && config.vignette && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={config.bloom.luminanceThreshold}
            luminanceSmoothing={0.4}
            intensity={config.bloom.intensity}
            mipmapBlur
          />
          <Vignette
            eskil={false}
            offset={config.vignette.offset}
            darkness={config.vignette.darkness}
          />
        </EffectComposer>
      )}
    </>
  )
}

// Export config getter for post-processing (used separately outside Canvas hierarchy)
export { getConfig, type AtmosphereConfig }
