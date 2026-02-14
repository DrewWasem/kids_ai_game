export default function ScreenshotButton() {
  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quest-ai-screenshot.png';
    a.click();
  };

  return (
    <button
      onClick={handleScreenshot}
      className="absolute top-2 right-12 z-20 bg-black/50 hover:bg-black/70 text-white rounded-lg px-2 py-1.5 text-sm backdrop-blur-sm transition-colors"
      title="Take screenshot"
    >
      {'\uD83D\uDCF7'}
    </button>
  );
}
