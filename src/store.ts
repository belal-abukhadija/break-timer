import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerStatus = 'idle' | 'running' | 'paused';
export type ThemeMode = 'light' | 'dark' | 'focus-black' | 'gradient';

interface TimerState {
  // Config/Settings
  duration: number; // in seconds
  theme: ThemeMode;
  presets: number[]; // array of minutes
  alarmSoundEnabled: boolean;
  tickingSoundEnabled: boolean;
  autoRestart: boolean;
  
  // Runtime State
  timeRemaining: number;
  status: TimerStatus;
  startTime: number | null;
  expectedEndTime: number | null;
  
  // Actions
  setDuration: (seconds: number) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleAlarmSound: () => void;
  toggleTickingSound: () => void;
  toggleAutoRestart: () => void;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void; // called every requestAnimationFrame or specific interval
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      duration: 25 * 60, // Default 25 min
      theme: 'dark',
      presets: [5, 10, 15, 20, 25, 30, 45, 60],
      alarmSoundEnabled: true,
      tickingSoundEnabled: false,
      autoRestart: false,
      
      timeRemaining: 25 * 60,
      status: 'idle',
      startTime: null,
      expectedEndTime: null,
      
      setDuration: (seconds) => set({ duration: seconds, timeRemaining: seconds, status: 'idle' }),
      setTheme: (theme) => set({ theme }),
      toggleAlarmSound: () => set((state) => ({ alarmSoundEnabled: !state.alarmSoundEnabled })),
      toggleTickingSound: () => set((state) => ({ tickingSoundEnabled: !state.tickingSoundEnabled })),
      toggleAutoRestart: () => set((state) => ({ autoRestart: !state.autoRestart })),
      
      startTimer: () => {
        const { duration } = get();
        const now = Date.now();
        set({
          status: 'running',
          startTime: now,
          expectedEndTime: now + duration * 1000,
          timeRemaining: duration
        });
      },
      
      pauseTimer: () => {
        set({ status: 'paused', startTime: null, expectedEndTime: null });
      },
      
      resumeTimer: () => {
        const { timeRemaining } = get();
        const now = Date.now();
        set({
          status: 'running',
          startTime: now,
          expectedEndTime: now + timeRemaining * 1000
        });
      },
      
      resetTimer: () => {
        const { duration } = get();
        set({
          status: 'idle',
          timeRemaining: duration,
          startTime: null,
          expectedEndTime: null
        });
      },
      
      tick: () => {
        const { status, expectedEndTime } = get();
        if (status !== 'running' || !expectedEndTime) return;
        
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((expectedEndTime - now) / 1000));
        
        if (remaining === 0) {
          set({ status: 'idle', timeRemaining: 0, startTime: null, expectedEndTime: null });
          // Handle timer completion (sound, notification, auto-restart) is usually done in a component effect or via a store listener
        } else {
          set({ timeRemaining: remaining });
        }
      }
    }),
    {
      name: 'break-timer-storage',
      // Only persist settings, not runtime state
      partialize: (state) => ({
        duration: state.duration,
        theme: state.theme,
        presets: state.presets,
        alarmSoundEnabled: state.alarmSoundEnabled,
        tickingSoundEnabled: state.tickingSoundEnabled,
        autoRestart: state.autoRestart
      }),
    }
  )
);
