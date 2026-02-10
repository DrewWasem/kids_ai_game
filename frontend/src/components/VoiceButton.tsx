import { useState, useCallback, useRef } from 'react';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  const win = window as unknown as Record<string, unknown>;
  if (typeof win.SpeechRecognition === 'function') {
    return win.SpeechRecognition as unknown as SpeechRecognitionConstructor;
  }
  if (typeof win.webkitSpeechRecognition === 'function') {
    return win.webkitSpeechRecognition as unknown as SpeechRecognitionConstructor;
  }
  return null;
}

const SpeechRecognitionClass = getSpeechRecognition();

export default function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionClass || isListening) return;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [isListening, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Silently handle stop errors
      }
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Hide entirely if browser doesn't support Speech API
  if (!SpeechRecognitionClass) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Speak your prompt'}
      className={`p-2 rounded-xl transition-all duration-200 ${
        isListening
          ? 'bg-red-500 text-white shadow-lg animate-pulse-ring'
          : 'bg-quest-accent/20 text-quest-glow hover:bg-quest-accent/30 hover:text-white'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {isListening ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      )}
    </button>
  );
}
