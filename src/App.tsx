import { useEffect, useState, useRef } from 'react';
import { useTimerStore } from './store';
import { useTimerEngine } from './useTimerEngine';
import { TimerCircle } from './components/TimerCircle';
import { Controls } from './components/Controls';
import { MinimalTimeDisplay } from './components/MinimalTimeDisplay';
import { SettingsModal } from './components/SettingsModal';
import { Settings } from 'lucide-react';
import './App.css';

function App() {
  const theme = useTimerStore((state) => state.theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Initialize the timer engine loop
  useTimerEngine();

  // Handle Fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'gradient') {
      document.body.classList.add('bg-gradient');
    } else {
      document.body.classList.remove('bg-gradient');
    }
  }, [theme]);

  // Keyboard Shortcuts
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
    <div className={`app-container ${isFullscreen ? 'fullscreen-active' : ''}`}>
      {!isFullscreen && (
        <div className="top-right-actions">
          <button
            className="btn icon-btn subtle-glass-btn"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={28} />
          </button>
        </div>
      )}

      {/* Main Focus Area */}
      <main className="focus-main">
        {!isFullscreen && (
          <h1 className="main-title title-font">Break</h1>
        )}

        {/* Dedicated Fullscreen Target Wrapper */}
        <div
          ref={timerContainerRef}
          className={`timer-fullscreen-wrapper ${isFullscreen ? 'is-fullscreen' : ''}`}
          style={{ background: isFullscreen ? 'var(--bg-primary)' : 'transparent' }}
        >
          <TimerCircle />
          <MinimalTimeDisplay />
        </div>

        {!isFullscreen && (
          <Controls toggleFullscreen={toggleFullscreen} />
        )}
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
