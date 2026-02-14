import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export default function SettingsPanel() {
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-game text-sm px-3 py-2 rounded-xl border-2
          bg-white/60 text-quest-text-mid border-quest-border hover:border-quest-purple/50 hover:text-quest-text-dark"
        title="Settings"
      >
        {'\u2699\uFE0F'}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-quest-border/50 p-3 z-50">
          <button
            onClick={toggleMute}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-quest-purple/10 transition-colors text-sm"
          >
            <span className="text-quest-text-dark font-heading font-bold">Sound</span>
            <span className="text-lg">{isMuted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
