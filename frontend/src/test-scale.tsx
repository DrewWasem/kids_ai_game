/**
 * Scale Comparison Test — Character vs Building side-by-side
 *
 * Shows a KayKit Knight (2.61 units tall) next to medieval hex buildings
 * at the current 3.0x scale so you can see the proportion problem.
 *
 * Also shows height reference poles with labels.
 */
import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Html, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'

const ASSET_BASE = '/assets/3d/'
const CHAR_BASE = ASSET_BASE + 'kaykit/characters/'
const ANIM_BASE = ASSET_BASE + 'kaykit/animations/'
const HEX = ASSET_BASE + 'kaykit/packs/medieval_hex/'

// --- Height reference pole ---
function HeightPole({ height, label, position, color = '#ff4444' }: {
  height: number
  label: string
  position: [number, number, number]
  color?: string
}) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.05, height, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Top tick */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[0.4, 0.03, 0.03]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Bottom tick */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.03, 0.03]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Label */}
      <Html position={[0, height + 0.4, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.85)',
          color: color,
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '13px',
          fontFamily: 'Fredoka, sans-serif',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          border: `2px solid ${color}`,
        }}>
          {label}
          <div style={{ fontSize: '10px', opacity: 0.7 }}>{height.toFixed(1)}u tall</div>
        </div>
      </Html>
    </group>
  )
}

// --- Animated character ---
function AnimatedKnight({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(CHAR_BASE + 'Knight.glb')
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const animGltf = useGLTF(ANIM_BASE + 'Rig_Medium_General.glb')
  const clips = useMemo(() => animGltf.animations.filter(c => c.name !== 'T-Pose'), [animGltf])
  const { actions } = useAnimations(clips, groupRef)

  // Play idle
  useMemo(() => {
    setTimeout(() => {
      const idle = actions['Idle_A']
      if (idle) idle.reset().play()
    }, 100)
  }, [actions])

  return (
    <group ref={groupRef} position={position}>
      <primitive object={cloned} />
    </group>
  )
}

// --- Building piece (reusable) ---
function Building({ model, position, scale = 1, rotation }: {
  model: string
  position: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}) {
  const { scene } = useGLTF(model)
  const cloned = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  return (
    <group position={position} rotation={rotation || [0, 0, 0]} scale={[scale, scale, scale]}>
      <primitive object={cloned} />
    </group>
  )
}

// --- Ground plane ---
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#3a5a2a" />
    </mesh>
  )
}

// --- Grid lines for reference ---
function GridLines() {
  return (
    <gridHelper args={[60, 60, '#555555', '#333333']} position={[0, 0.01, 0]} />
  )
}

// --- Scene content ---
function ScaleScene({ buildingScale }: { buildingScale: number }) {
  // Real-world target ratios (character = 1.8m person):
  // 1-story house: ~5m = 2.8x person
  // 2-story house: ~8m = 4.4x person
  // Townhall: ~12m = 6.7x person
  // Church spire: ~20m = 11x person
  // Windmill: ~15m = 8.3x person

  const charHeight = 2.61 // KayKit character height in units

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 5]} intensity={1.5} color="#fff8e0" castShadow />
      <directionalLight position={[-5, 8, -3]} intensity={0.4} color="#aaccff" />
      <Sky sunPosition={[8, 15, 5]} turbidity={6} rayleigh={1.5} />

      <Ground />
      <GridLines />

      {/* === CHARACTER (Knight, scale 1.0) === */}
      <Suspense fallback={null}>
        <AnimatedKnight position={[0, 0, 0]} />
      </Suspense>
      <HeightPole height={charHeight} label="Knight" position={[1, 0, 0]} color="#22cc66" />

      {/* === TOWNHALL at current scale === */}
      <Suspense fallback={null}>
        <Building
          model={HEX + 'buildings/blue/building_townhall_blue.gltf'}
          position={[5, 0, 0]}
          scale={buildingScale}
        />
      </Suspense>
      <HeightPole
        height={2.08 * buildingScale}
        label={`Townhall @${buildingScale}x`}
        position={[8, 0, 0]}
        color="#ff4444"
      />

      {/* === HOME_A at current scale === */}
      <Suspense fallback={null}>
        <Building
          model={HEX + 'buildings/blue/building_home_A_blue.gltf'}
          position={[-5, 0, 0]}
          scale={buildingScale}
        />
      </Suspense>
      <HeightPole
        height={0.84 * buildingScale}
        label={`Home_A @${buildingScale}x`}
        position={[-3, 0, 0]}
        color="#ff8800"
      />

      {/* === CHURCH at current scale === */}
      <Suspense fallback={null}>
        <Building
          model={HEX + 'buildings/blue/building_church_blue.gltf'}
          position={[12, 0, 0]}
          scale={buildingScale}
        />
      </Suspense>
      <HeightPole
        height={1.81 * buildingScale}
        label={`Church @${buildingScale}x`}
        position={[15, 0, 0]}
        color="#cc44ff"
      />

      {/* === TAVERN at current scale === */}
      <Suspense fallback={null}>
        <Building
          model={HEX + 'buildings/blue/building_tavern_blue.gltf'}
          position={[-11, 0, 0]}
          scale={buildingScale}
        />
      </Suspense>
      <HeightPole
        height={1.40 * buildingScale}
        label={`Tavern @${buildingScale}x`}
        position={[-9, 0, 0]}
        color="#4488ff"
      />

      {/* === WINDMILL at current scale === */}
      <Suspense fallback={null}>
        <Building
          model={HEX + 'buildings/blue/building_windmill_blue.gltf'}
          position={[20, 0, 0]}
          scale={buildingScale}
        />
      </Suspense>
      <HeightPole
        height={1.60 * buildingScale}
        label={`Windmill @${buildingScale}x`}
        position={[23, 0, 0]}
        color="#ffcc00"
      />
    </>
  )
}

// --- Main component ---
export default function TestScale() {
  const [buildingScale, setBuildingScale] = useState(3.0)

  const charHeight = 2.61
  const buildings = [
    { name: 'Townhall', native: 2.08, ideal: '6-8x char (~17u)' },
    { name: 'Church', native: 1.81, ideal: '8-11x char (~23u)' },
    { name: 'Windmill', native: 1.60, ideal: '5-8x char (~17u)' },
    { name: 'Tavern', native: 1.40, ideal: '2-3x char (~7u)' },
    { name: 'Home_A', native: 0.84, ideal: '2.5-3.5x char (~8u)' },
    { name: 'Stables', native: 0.61, ideal: '1.5-2x char (~5u)' },
  ]

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#0d0520' }}>
      <Canvas
        camera={{ position: [0, 8, 25], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        shadows
      >
        <ScaleScene buildingScale={buildingScale} />
        <OrbitControls target={[5, 2, 0]} />
      </Canvas>

      {/* Controls panel */}
      <div style={{
        position: 'absolute', top: 10, left: 10, padding: '16px',
        background: 'rgba(0,0,0,0.9)', color: '#fff', borderRadius: '12px',
        fontSize: '13px', width: '320px', fontFamily: 'Fredoka, sans-serif',
        maxHeight: 'calc(100vh - 20px)', overflowY: 'auto',
      }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: '#fbbf24' }}>
          Scale Comparison
        </h2>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
            Building Scale: {buildingScale.toFixed(1)}x
          </label>
          <input
            type="range" min="1" max="10" step="0.5"
            value={buildingScale}
            onChange={(e) => setBuildingScale(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.6 }}>
            <span>1x (native)</span>
            <span>3x (current)</span>
            <span>10x</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: '10px', marginTop: '10px' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', color: '#22cc66' }}>
            Knight: {charHeight.toFixed(2)}u tall
          </div>

          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #444' }}>
                <th style={{ textAlign: 'left', padding: '3px' }}>Building</th>
                <th style={{ textAlign: 'right', padding: '3px' }}>Current</th>
                <th style={{ textAlign: 'right', padding: '3px' }}>Ratio</th>
                <th style={{ textAlign: 'right', padding: '3px' }}>Target</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map(b => {
                const currentH = b.native * buildingScale
                const ratio = currentH / charHeight
                const tooSmall = ratio < 2.0
                return (
                  <tr key={b.name} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '3px' }}>{b.name}</td>
                    <td style={{ textAlign: 'right', padding: '3px' }}>{currentH.toFixed(1)}u</td>
                    <td style={{
                      textAlign: 'right', padding: '3px',
                      color: tooSmall ? '#ff4444' : ratio < 3.0 ? '#ff8800' : '#22cc66'
                    }}>
                      {ratio.toFixed(1)}x
                    </td>
                    <td style={{ textAlign: 'right', padding: '3px', opacity: 0.6 }}>{b.ideal}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: '10px', marginTop: '10px', fontSize: '11px', opacity: 0.7 }}>
          Drag the slider to see how different scales look. At 3.0x (current), the tavern is barely taller than the character and Home_A is the same height.
        </div>
      </div>
    </div>
  )
}

// Preload key assets
useGLTF.preload(CHAR_BASE + 'Knight.glb')
useGLTF.preload(ANIM_BASE + 'Rig_Medium_General.glb')
useGLTF.preload(HEX + 'buildings/blue/building_townhall_blue.gltf')
useGLTF.preload(HEX + 'buildings/blue/building_home_A_blue.gltf')
useGLTF.preload(HEX + 'buildings/blue/building_church_blue.gltf')
useGLTF.preload(HEX + 'buildings/blue/building_tavern_blue.gltf')
useGLTF.preload(HEX + 'buildings/blue/building_windmill_blue.gltf')
