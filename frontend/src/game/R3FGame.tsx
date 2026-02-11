import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, ReactNode } from 'react';
import * as THREE from 'three';
import { VillageWorld } from './VillageWorld';
import { VillageCamera } from './VillageCamera';

/** Exposes window.__measureScene() for 3D size debugging */
function SceneMeasurer() {
  const { scene } = useThree();
  useEffect(() => {
    (window as any).__measureScene = () => {
      const results: Record<string, { height: number; width: number; depth: number; worldY: number }> = {};
      scene.traverse((obj: THREE.Object3D) => {
        if (!obj.name || obj.type === 'Scene') return;
        const box = new THREE.Box3().setFromObject(obj);
        if (box.isEmpty()) return;
        const size = box.getSize(new THREE.Vector3());
        if (size.x > 0.01 && size.y > 0.01) {
          results[obj.name] = {
            height: Math.round(size.y * 100) / 100,
            width: Math.round(size.x * 100) / 100,
            depth: Math.round(size.z * 100) / 100,
            worldY: Math.round(box.min.y * 100) / 100,
          };
        }
      });
      return results;
    };
    (window as any).__measureByPattern = (pattern: string) => {
      const results: Array<{ name: string; height: number; width: number; scale: number[] }> = [];
      scene.traverse((obj: THREE.Object3D) => {
        if (!obj.name && obj.type !== 'Group') return;
        const label = obj.name || obj.userData?.name || '';
        if (label.toLowerCase().includes(pattern.toLowerCase()) || obj.type === 'Group') {
          const box = new THREE.Box3().setFromObject(obj);
          if (box.isEmpty()) return;
          const size = box.getSize(new THREE.Vector3());
          if (size.y > 0.1) {
            results.push({
              name: label || `${obj.type}@${Math.round(obj.position.x)},${Math.round(obj.position.z)}`,
              height: Math.round(size.y * 100) / 100,
              width: Math.round(size.x * 100) / 100,
              scale: [obj.scale.x, obj.scale.y, obj.scale.z],
            });
          }
        }
      });
      return results.sort((a, b) => b.height - a.height).slice(0, 30);
    };
  }, [scene]);
  return null;
}

interface R3FGameProps {
  children?: ReactNode;
}

export default function R3FGame({ children }: R3FGameProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Camera with zone transition support */}
        <VillageCamera />
        {import.meta.env.DEV && <SceneMeasurer />}

        {/* Persistent village world with all zones */}
        <VillageWorld />

        {/* Scene content (ScenePlayer3D actors) */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
