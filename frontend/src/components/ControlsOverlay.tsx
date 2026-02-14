import { useState, useEffect } from 'react';

export default function ControlsOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);

    const dismiss = () => setVisible(false);
    window.addEventListener('keydown', dismiss);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="bg-black/60 backdrop-blur-sm text-white rounded-2xl px-6 py-5 max-w-xs text-center shadow-lg">
        <p className="font-heading font-bold text-lg mb-3">Controls</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          <span className="text-white/60 text-right">Move</span>
          <span className="font-mono font-bold">W A S D</span>
          <span className="text-white/60 text-right">Run</span>
          <span className="font-mono font-bold">Shift</span>
          <span className="text-white/60 text-right">Turn</span>
          <span className="font-mono font-bold">Q / E</span>
          <span className="text-white/60 text-right">Zoom</span>
          <span className="font-mono font-bold">Scroll</span>
        </div>
        <p className="text-white/40 text-xs mt-3">Press any key to dismiss</p>
      </div>
    </div>
  );
}
