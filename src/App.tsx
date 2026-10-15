import { useEffect, useState } from 'react';
import { useTimerStore } from './store';
import { useTimerEngine } from './useTimerEngine';
import { TimerCircle } from './components/TimerCircle';
import { Controls } from './components/Controls';
import { MinimalTimeDisplay } from './components/MinimalTimeDisplay';
import { SettingsModal } from './components/SettingsModal';
import { Coffee, Maximize2, Settings } from 'lucide-react';
import './App.css';

// Older saved themes map onto the current three.
const themeAttribute: Record<string, string> = {
  light: 'light',
  dark: 'dark',
  'focus-black': 'focus',
  gradient: 'dark',
};

function App() {
  const theme = useTimerStore((state) => state.theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Initialize the timer engine loop
  useTimerEngine();

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeAttribute[theme] ?? 'dark');
  }, [theme]);

  // Keyboard shortcuts
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resumeTimer = useTimerStore((state) => state.resumeTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const toggleAlarmSound = useTimerStore((state) => state.toggleAlarmSound);
  const status = useTimerStore((state) => state.status);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (status === 'idle') startTimer();
          else if (status === 'running') pauseTimer();
          else if (status === 'paused') resumeTimer();
          break;
        case 'KeyR':
          resetTimer();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyM':
          toggleAlarmSound();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, startTimer, pauseTimer, resumeTimer, resetTimer, toggleAlarmSound]);

  return (
    <div className="bt-app">
      {!isFullscreen && (
        <header className="wb-bar" style={{ width: '100%' }}>
          <a className="wb-brand" href="/">
            <span className="wb-mark" aria-hidden="true"><Coffee /></span>
            <span className="wb-brand-text">
              <span className="wb-brand-name">Break Timer</span>
              <span className="wb-brand-owner">Belal's tools</span>
            </span>
          </a>
          <div className="wb-bar-end">
            <button className="wb-btn wb-btn--quiet wb-btn--icon" onClick={toggleFullscreen} aria-label="Full screen (F)" title="Full screen (F)">
              <Maximize2 />
            </button>
            <button className="wb-btn wb-btn--quiet wb-btn--icon" onClick={() => setIsSettingsOpen(true)} aria-label="Settings" title="Settings">
              <Settings />
            </button>
          </div>
        </header>
      )}

      <main className="bt-main">
        <div className={`bt-stage ${isFullscreen ? 'is-fullscreen' : ''}`}>
          <TimerCircle />
          <MinimalTimeDisplay />
        </div>

        {!isFullscreen && <Controls />}
      </main>

      {!isFullscreen && (
        <footer className="wb-foot" style={{ width: '100%' }}>
          <span>Made by <a href="mailto:belalabukhadija97@gmail.com">Belal</a></span>
          <span>More free tools at <a href="https://belal.work" target="_blank" rel="noopener noreferrer">belal.work</a></span>
        </footer>
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
