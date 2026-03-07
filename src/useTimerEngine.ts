import { useEffect, useRef } from 'react';
import { useTimerStore } from './store';

// Helper custom hook to run the timer tick efficiently
export function useTimerEngine() {
    const status = useTimerStore((state) => state.status);
    const tick = useTimerStore((state) => state.tick);
    const timeRemaining = useTimerStore((state) => state.timeRemaining);
    const duration = useTimerStore((state) => state.duration);
    const alarmSoundEnabled = useTimerStore((state) => state.alarmSoundEnabled);

    const wakeLockRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Request Notification Permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Handle Wake Lock
    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator && status === 'running') {
                    wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
                }
            } catch (err) {
                console.error('Wake Lock error:', err);
            }
        };

        if (status === 'running') {
            requestWakeLock();
        } else {
            if (wakeLockRef.current) {
                wakeLockRef.current.release().then(() => {
                    wakeLockRef.current = null;
                });
            }
        }
    }, [status]);

    // Main Timer Loop
    useEffect(() => {
        if (status !== 'running') return;

        // We use a combination of setInterval and the expectedEndTime logic in the store
        // This ensures accuracy even if the interval is throttled by the browser
        const intervalId = setInterval(() => {
            tick();
        }, 100); // Check every 100ms for accurate visual updates

        return () => clearInterval(intervalId);
    }, [status, tick]);

    // Handle Timer Finish
    useEffect(() => {
        if (status === 'idle' && timeRemaining === 0 && duration > 0) {
            // 1. Play Alarm
            if (alarmSoundEnabled) {
                playAlarmSound();
            }

            // 2. Show Notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Break Finished!', {
                    body: 'Your timer has ended. Time to get back to work!',
                });
            }
        }
    }, [status, timeRemaining, duration, alarmSoundEnabled]);

    function playAlarmSound() {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;

        // Simple synthesized alarm
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.5);
    }
}
