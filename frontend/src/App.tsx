import { useState, useEffect, useMemo } from 'react';
import R3FGame from './game/R3FGame';
import ScenePlayer3D from './game/ScenePlayer3D';
import PromptInput from './components/PromptInput';
import MadLibsInput from './components/MadLibsInput';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import TitleScreen from './components/TitleScreen';
import { useGameStore } from './stores/gameStore';
import { preloadAllAnimations } from './game/AnimationController';
import { useGLTF } from '@react-three/drei';
import { CHARACTERS, ASSET_BASE } from './data/asset-manifest';
import { PLAYER_CHARACTERS } from './data/player-characters';
import { WORLDS } from './data/worlds';
import { BADGES } from './services/badge-system';
import { getQuestStage, getQuestStages } from './data/quest-stages';
import CameraControls from './components/CameraControls';
import { Minimap } from './game/Minimap';
import ControlsOverlay from './components/ControlsOverlay';
import BadgeToast from './components/BadgeToast';
import { CompassRose } from './game/CompassRose';
import ScreenshotButton from './components/ScreenshotButton';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const currentZone = useGameStore((s) => s.currentZone);
  const currentTask = useGameStore((s) => s.currentTask);
  const lastScript = useGameStore((s) => s.lastScript);
  const vignetteSteps = useGameStore((s) => s.vignetteSteps);
  const exitZone = useGameStore((s) => s.exitZone);
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const badges = useGameStore((s) => s.badges);
  const [loading3D, setLoading3D] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const setSelectedCharacter = useGameStore((s) => s.setSelectedCharacter);
  const [started, setStarted] = useState(false);
  const [playingIntro, setPlayingIntro] = useState(false);

  // Get the current quest stage (if any) for Mad Libs mode
  const stageNumber = useGameStore(s => s.stageNumbers[s.currentZone ?? ''] ?? 1);
  const questStage = useMemo(() => {
    if (!currentZone) return null;
    return getQuestStage(currentZone, stageNumber);
  }, [currentZone, stageNumber]);

  // Preload shared animations + selectable character GLBs on mount
  useEffect(() => {
    try {
      preloadAllAnimations();
      for (const char of PLAYER_CHARACTERS) {
        useGLTF.preload(`${ASSET_BASE}${CHARACTERS[char.id]}`);
      }
    } catch {
      // Preload is best-effort
    }
    const timer = setTimeout(() => setLoading3D(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const world = currentZone ? WORLDS[currentZone] : null;
  const earnedBadges = BADGES.filter(b => badges[b.id]);

  if (!started) {
    return <TitleScreen onSelectCharacter={(id) => { setSelectedCharacter(id); setStarted(true); setPlayingIntro(true); }} />;
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-quest-page-bg stars-bg-light">
        {/* Header */}
        <header className={`relative px-5 py-3 flex items-center justify-between z-10 ${expanded || playingIntro ? 'hidden' : ''}`}>
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

            <SettingsPanel />

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
              <span className="text-sm font-heading font-bold text-quest-text-dark bg-white/80 px-3 py-1.5 rounded-xl border border-quest-purple/20 flex items-center gap-2">
                <span>{world.emoji} {world.label}</span>
                {currentZone && (() => {
                  const totalStages = getQuestStages(currentZone).length;
                  if (totalStages <= 1) return null;
                  return (
                    <span className="flex items-center gap-0.5 text-xs">
                      <span className="text-quest-text-muted">Lv{stageNumber}</span>
                      <span className="flex gap-0.5">
                        {Array.from({ length: totalStages }, (_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < stageNumber ? 'bg-quest-purple' : 'bg-quest-border'
                            }`}
                          />
                        ))}
                      </span>
                    </span>
                  );
                })()}
              </span>
            )}
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col">
          {/* Game Canvas */}
          <div className={`flex-1 min-h-0 flex items-center justify-center ${expanded || playingIntro ? 'px-0 py-0' : 'px-4 py-2'}`}>
            <div className={`relative overflow-hidden border-2 border-quest-canvas-border/50 shadow-glow-purple/30 ${expanded || playingIntro ? 'rounded-none' : 'rounded-game-lg'}`}
                 style={expanded || playingIntro
                   ? { width: '100%', height: '100%' }
                   : { width: 1024, height: 576, maxWidth: '100%', maxHeight: '60vh' }
                 }>
              <R3FGame playingIntro={playingIntro} onIntroComplete={() => setPlayingIntro(false)}>
                <ScenePlayer3D
                  script={lastScript}
                  vignetteSteps={vignetteSteps}
                  taskId={currentTask}
                  onComplete={() => console.log('[App] Scene complete')}
                />
              </R3FGame>
              {!currentZone && !isTransitioning && !playingIntro && <CameraControls />}
              {!playingIntro && <Minimap />}
              {!currentZone && !isTransitioning && !playingIntro && <CompassRose />}
              {!currentZone && !playingIntro && <ControlsOverlay />}

              {/* Screenshot + Expand / Collapse toggle */}
              {!playingIntro && <ScreenshotButton />}
              {!playingIntro && <button
                onClick={() => setExpanded(e => !e)}
                className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-lg px-2 py-1.5 text-sm backdrop-blur-sm transition-colors"
                title={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? '\u{2199}\u{FE0F}' : '\u{2197}\u{FE0F}'}
              </button>}
            </div>
          </div>

          {/* Input Panel — Mad Libs if quest stage exists, otherwise free-text */}
          {!expanded && !playingIntro && (
            currentZone ? (
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
            )
          )}
        </div>
      </div>

      {/* Badge unlock toast — always rendered, self-hides when empty */}
      <BadgeToast />

      {/* "Click to skip" hint during cinematic */}
      {playingIntro && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="text-white/70 text-sm font-heading bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            Click anywhere to skip
          </span>
        </div>
      )}

      {/* Loading overlay */}
      {loading3D && <LoadingScreen />}
    </ErrorBoundary>
  );
}
