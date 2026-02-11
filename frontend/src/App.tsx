import { useState, useEffect } from 'react';
import R3FGame from './game/R3FGame';
import ScenePlayer3D from './game/ScenePlayer3D';
import PromptInput from './components/PromptInput';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { useGameStore } from './stores/gameStore';
import { preloadAllAnimations } from './game/AnimationController';

export default function App() {
  const currentZone = useGameStore((s) => s.currentZone);
  const currentTask = useGameStore((s) => s.currentTask);
  const lastScript = useGameStore((s) => s.lastScript);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const exitZone = useGameStore((s) => s.exitZone);
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const [loading3D, setLoading3D] = useState(true);

  // Preload shared animations on mount, then dismiss loading screen
  useEffect(() => {
    try {
      preloadAllAnimations();
    } catch {
      // Preload is best-effort
    }
    const timer = setTimeout(() => setLoading3D(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Zone labels for display
  const ZONE_LABELS: Record<string, { label: string; emoji: string }> = {
    'skeleton-birthday': { label: "Skeleton's Surprise Birthday", emoji: '💀' },
    'knight-space':      { label: "Knight's Space Mission", emoji: '🚀' },
    'mage-kitchen':      { label: "Mage vs. Kitchen", emoji: '🧙' },
    'barbarian-school':  { label: "Barbarian's School", emoji: '📚' },
    'dungeon-concert':   { label: "Dungeon Rock Concert", emoji: '🎸' },
    'skeleton-pizza':    { label: "Skeleton Pizza Delivery", emoji: '🍕' },
    'adventurers-picnic': { label: "Adventurers' Picnic", emoji: '🧺' },
  };

  const zoneInfo = currentZone ? ZONE_LABELS[currentZone] : null;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-quest-page-bg stars-bg-light">
        {/* Header */}
        <header className="relative px-5 py-3 flex items-center justify-between z-10">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-quest-purple/30 to-transparent" />

          <div className="font-display text-2xl font-bold flex items-center gap-2">
            <span className="text-xl animate-sparkle">✨</span>
            <span className="bg-gradient-to-r from-quest-purple via-quest-orange to-quest-yellow bg-clip-text text-transparent">
              Prompt Quest
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="btn-game text-sm px-3 py-2 rounded-xl border-2
                bg-white/60 text-quest-text-mid border-quest-border hover:border-quest-purple/50 hover:text-quest-text-dark"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            {currentZone && !isTransitioning && (
              <button
                onClick={exitZone}
                className="btn-game text-sm px-4 py-2 rounded-xl border-2
                  bg-white/60 text-quest-text-mid border-quest-border hover:border-quest-orange/50 hover:text-quest-text-dark hover:bg-quest-panel-bg"
              >
                🏘️ Village
              </button>
            )}

            {zoneInfo && (
              <span className="text-sm font-heading font-bold text-quest-text-dark bg-white/80 px-3 py-1.5 rounded-xl border border-quest-purple/20">
                {zoneInfo.emoji} {zoneInfo.label}
              </span>
            )}
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col">
          {/* Game Canvas — full village always visible */}
          <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-2">
            <div className="relative rounded-game-lg overflow-hidden border-2 border-quest-canvas-border/50 shadow-glow-purple/30"
                 style={{ width: 1024, height: 576, maxWidth: '100%', maxHeight: '60vh' }}>
              <R3FGame>
                <ScenePlayer3D
                  script={lastScript}
                  taskId={currentTask}
                  onComplete={() => console.log('[App] Scene complete')}
                />
              </R3FGame>
            </div>
          </div>

          {/* Prompt Input — only visible when in a zone */}
          {currentZone && !isTransitioning ? (
            <div className="transition-opacity duration-500">
              <PromptInput />
            </div>
          ) : (
            <div className="px-5 py-4 text-center">
              <p className="font-heading font-bold text-lg text-quest-text-dark">
                {isTransitioning ? 'Traveling...' : 'Click a glowing marker to start a quest!'}
              </p>
              <p className="text-sm text-quest-text-light mt-1">
                {isTransitioning ? '' : 'Explore the village and find quest zones'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading3D && <LoadingScreen />}
    </ErrorBoundary>
  );
}
