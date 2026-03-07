import { useTimerStore } from '../store';
import { X } from 'lucide-react';
import './SettingsModal.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const theme = useTimerStore((state) => state.theme);
    const setTheme = useTimerStore((state) => state.setTheme);
    const alarmSoundEnabled = useTimerStore((state) => state.alarmSoundEnabled);
    const toggleAlarmSound = useTimerStore((state) => state.toggleAlarmSound);
    const tickingSoundEnabled = useTimerStore((state) => state.tickingSoundEnabled);
    const toggleTickingSound = useTimerStore((state) => state.toggleTickingSound);
    const autoRestart = useTimerStore((state) => state.autoRestart);
    const toggleAutoRestart = useTimerStore((state) => state.toggleAutoRestart);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="title-font">Settings</h2>
                    <button className="btn close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="settings-group">
                    <h3 className="settings-title">Theme & Appearance</h3>
                    <div className="theme-options">
                        <button
                            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => setTheme('light')}
                        >Light</button>
                        <button
                            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => setTheme('dark')}
                        >Dark</button>
                        <button
                            className={`theme-btn ${theme === 'focus-black' ? 'active' : ''}`}
                            onClick={() => setTheme('focus-black')}
                        >Focus Black</button>
                        <button
                            className={`theme-btn ${theme === 'gradient' ? 'active' : ''}`}
                            onClick={() => setTheme('gradient')}
                        >Gradient Aura</button>
                    </div>
                </div>

                <div className="settings-group">
                    <h3 className="settings-title">Audio & Notifications</h3>

                    <label className="toggle-label">
                        <span>Alarm Sound</span>
                        <input
                            type="checkbox"
                            checked={alarmSoundEnabled}
                            onChange={toggleAlarmSound}
                            className="toggle-input"
                        />
                    </label>

                    <label className="toggle-label">
                        <span>Ticking Sound</span>
                        <input
                            type="checkbox"
                            checked={tickingSoundEnabled}
                            onChange={toggleTickingSound}
                            className="toggle-input"
                        />
                    </label>
                </div>

                <div className="settings-group">
                    <h3 className="settings-title">Automation</h3>

                    <label className="toggle-label">
                        <span>Auto-Restart Timer</span>
                        <input
                            type="checkbox"
                            checked={autoRestart}
                            onChange={toggleAutoRestart}
                            className="toggle-input"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}
