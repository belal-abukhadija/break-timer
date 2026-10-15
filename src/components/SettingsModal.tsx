import { useEffect } from 'react';
import { useTimerStore, type ThemeMode } from '../store';
import { X } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const themes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'focus-black', label: 'Focus' },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const theme = useTimerStore((state) => state.theme);
    const setTheme = useTimerStore((state) => state.setTheme);
    const alarmSoundEnabled = useTimerStore((state) => state.alarmSoundEnabled);
    const toggleAlarmSound = useTimerStore((state) => state.toggleAlarmSound);
    const tickingSoundEnabled = useTimerStore((state) => state.tickingSoundEnabled);
    const toggleTickingSound = useTimerStore((state) => state.toggleTickingSound);
    const autoRestart = useTimerStore((state) => state.autoRestart);
    const toggleAutoRestart = useTimerStore((state) => state.toggleAutoRestart);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const activeTheme = theme === 'gradient' ? 'dark' : theme;

    return (
        <div className="wb-scrim" onClick={onClose}>
            <div
                className="wb-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bt-dialog-head">
                    <h2 id="settings-title" className="wb-h2">Settings</h2>
                    <button className="wb-btn wb-btn--quiet wb-btn--icon" onClick={onClose} aria-label="Close settings">
                        <X />
                    </button>
                </div>

                <div className="bt-group">
                    <h3 className="wb-h3">Appearance</h3>
                    <div className="wb-seg wb-seg--block" role="group" aria-label="Appearance">
                        {themes.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                aria-pressed={activeTheme === t.value}
                                onClick={() => setTheme(t.value)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bt-group">
                    <h3 className="wb-h3">Sound</h3>
                    <label className="wb-toggle-row">
                        <span>Alarm when the break ends</span>
                        <input type="checkbox" role="switch" className="wb-switch" checked={alarmSoundEnabled} onChange={toggleAlarmSound} />
                    </label>
                    <label className="wb-toggle-row">
                        <span>Ticking while it runs</span>
                        <input type="checkbox" role="switch" className="wb-switch" checked={tickingSoundEnabled} onChange={toggleTickingSound} />
                    </label>
                </div>

                <div className="bt-group">
                    <h3 className="wb-h3">Automation</h3>
                    <label className="wb-toggle-row">
                        <span>Start again when it ends</span>
                        <input type="checkbox" role="switch" className="wb-switch" checked={autoRestart} onChange={toggleAutoRestart} />
                    </label>
                </div>
            </div>
        </div>
    );
}
