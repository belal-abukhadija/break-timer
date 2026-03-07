import { useTimerStore } from '../store';
import { Play, Pause, RotateCcw, Monitor } from 'lucide-react';
import './Controls.css';

interface ControlsProps {
    toggleFullscreen: () => void;
}

export function Controls({ toggleFullscreen }: ControlsProps) {
    const status = useTimerStore((state) => state.status);
    const startTimer = useTimerStore((state) => state.startTimer);
    const pauseTimer = useTimerStore((state) => state.pauseTimer);
    const resumeTimer = useTimerStore((state) => state.resumeTimer);
    const resetTimer = useTimerStore((state) => state.resetTimer);
    const setDuration = useTimerStore((state) => state.setDuration);
    const presets = useTimerStore((state) => state.presets);

    return (
        <div className="controls-container">
            <div className="main-actions">
                {status === 'idle' && (
                    <button className="btn primary-btn" onClick={startTimer} title="Start (Space)">
                        <Play size={28} />
                    </button>
                )}
                {status === 'running' && (
                    <button className="btn warning-btn" onClick={pauseTimer} title="Pause (Space)">
                        <Pause size={28} />
                    </button>
                )}
                {status === 'paused' && (
                    <button className="btn primary-btn" onClick={resumeTimer} title="Resume (Space)">
                        <Play size={28} />
                    </button>
                )}
                <button className="btn outline-btn" onClick={resetTimer} title="Reset (R)">
                    <RotateCcw size={24} />
                </button>
            </div>

            {status === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <div className="presets-container">
                        {presets.map((min) => (
                            <button
                                key={min}
                                className="btn preset-btn title-font"
                                onClick={() => setDuration(min * 60)}
                            >
                                {min}m
                            </button>
                        ))}
                    </div>

                    <div className="custom-duration-input">
                        <input
                            type="number"
                            placeholder="Min"
                            min="1"
                            title="Custom Minutes"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = parseInt(e.currentTarget.value);
                                    if (!isNaN(val) && val > 0) setDuration(val * 60);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                        <span className="info-label" style={{ marginLeft: '0.5rem', alignSelf: 'center' }}>Press Enter</span>
                    </div>
                </div>
            )}

            <div className="utility-actions">
                <button className="btn icon-btn" onClick={toggleFullscreen} title="Fullscreen (F)">
                    <Monitor size={20} />
                </button>
            </div>
        </div>
    );
}
