import React from 'react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-quest-bg stars-bg">
          <div className="max-w-md text-center p-8 bg-quest-card/80 backdrop-blur-sm rounded-2xl border-2 border-quest-border shadow-glow-purple animate-scale-in">
            <div className="text-5xl mb-4">🔮</div>
            <h2 className="font-heading text-xl font-bold text-quest-orange mb-2">Oops! A spell went wrong</h2>
            <p className="text-quest-text-secondary text-sm mb-6">The magic got a bit tangled! Let's try that again.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-game bg-gradient-to-br from-quest-accent to-quest-purple text-white
                         border-2 border-quest-accent/50 shadow-glow-purple px-6 py-3"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
