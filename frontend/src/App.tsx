import { useState, useEffect, useMemo } from 'react';
import R3FGame from './game/R3FGame';
import ScenePlayer3D from './game/ScenePlayer3D';
import PromptInput from './components/PromptInput';
import MadLibsInput from './components/MadLibsInput';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { useGameStore } from './stores/gameStore';
import { preloadAllAnimations } from './game/AnimationController';
import { WORLDS } from './data/worlds';
import { BADGES } from './services/badge-system';
import { getQuestStage } from './data/quest-stages';
import CameraControls from './components/CameraControls';

export default function App() {
  const currentZone = useGameStore((s) => s.currentZone);
  const currentTask = useGameStore((s) => s.currentTask);
  const lastScript = useGameStore((s) => s.lastScript);
  const vignetteSteps = useGameStore((s) => s.vignetteSteps);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const exitZone = useGameStore((s) => s.exitZone);
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const badges = useGameStore((s) => s.badges);
  const [loading3D, setLoading3D] = useState(true);

  // Get the current quest stage (if any) for Mad Libs mode
  const questStage = useMemo(() => {
    if (!currentZone) return null;
    return getQuestStage(currentZone);
  }, [currentZone]);

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

  const world = currentZone ? WORLDS[currentZone] : null;
  const earnedBadges = BADGES.filter(b => badges[b.id]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-quest-page-bg stars-bg-light">
        {/* Header */}
        <header className="relative px-5 py-3 flex items-center justify-between z-10">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-quest-purple/30 to-transparent" />

          <div className="font-display text-2xl font-bold flex items-center gap-2">
            <span className="text-xl animate-sparkle">{'\u{2728}'}</span>
            <span className="bg-gradient-to-r from-quest-purple via-quest-orange to-quest-yellow bg-clip-text text-transparent">
              Quest AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Badge tray — small icons showing earned badges */}
            {earnedBadges.length > 0 && (
              <div className="flex items-center gap-1 bg-white/60 px-2.5 py-1.5 rounded-xl border border-quest-purple/20" title={earnedBadges.map(b => b.label).join(', ')}>
                {earnedBadges.map(b => (
                  <span key={b.id} className="text-sm" title={`${b.label}: ${b.description}`}>
                    {b.emoji}
                  </span>
                ))}
                <span className="text-[10px] font-bold text-quest-text-muted ml-1">
                  {earnedBadges.length}/{BADGES.length}
                </span>
              </div>
            )}

            <button
              onClick={toggleMute}
              className="btn-game text-sm px-3 py-2 rounded-xl border-2
                bg-white/60 text-quest-text-mid border-quest-border hover:border-quest-purple/50 hover:text-quest-text-dark"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '\u{1F507}' : '\u{1F50A}'}
            </button>

            {currentZone && !isTransitioning && (
              <button
                onClick={exitZone}
                className="btn-game text-sm px-4 py-2 rounded-xl border-2
                  bg-white/60 text-quest-text-mid border-quest-border hover:border-quest-orange/50 hover:text-quest-text-dark hover:bg-quest-panel-bg"
              >
                {'\u{1F6AA}'} Leave Quest
              </button>
            )}

            {world && (
              <span className="text-sm font-heading font-bold text-quest-text-dark bg-white/80 px-3 py-1.5 rounded-xl border border-quest-purple/20">
                {world.emoji} {world.label}
              </span>
            )}
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col">
          {/* Game Canvas */}
          <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-2">
            <div className="relative rounded-game-lg overflow-hidden border-2 border-quest-canvas-border/50 shadow-glow-purple/30"
                 style={{ width: 1024, height: 576, maxWidth: '100%', maxHeight: '60vh' }}>
              <R3FGame>
                <ScenePlayer3D
                  script={lastScript}
                  vignetteSteps={vignetteSteps}
                  taskId={currentTask}
                  onComplete={() => console.log('[App] Scene complete')}
                />
              </R3FGame>
              {!currentZone && !isTransitioning && <CameraControls />}
            </div>
          </div>

          {/* Input Panel — Mad Libs if quest stage exists, otherwise free-text */}
          {currentZone ? (
            <div className="transition-opacity duration-500">
              {questStage ? <MadLibsInput stage={questStage} /> : <PromptInput />}
            </div>
          ) : (
            <div className="px-5 py-4 text-center">
              <p className="font-heading font-bold text-lg text-quest-text-dark">
                {isTransitioning ? 'Traveling...' : 'Walk to a glowing circle to start a quest!'}
              </p>
              <p className="text-sm text-quest-text-light mt-1">
                {isTransitioning ? '' : 'WASD to move \u2022 Shift to run \u2022 Drag or Q/E to turn \u2022 Scroll or +/\u2212 to zoom'}
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
