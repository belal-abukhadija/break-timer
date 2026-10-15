import { useState } from 'react';
import { useTimerStore } from '../store';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function Controls() {
    const status = useTimerStore((state) => state.status);
    const duration = useTimerStore((state) => state.duration);
    const startTimer = useTimerStore((state) => state.startTimer);
    const pauseTimer = useTimerStore((state) => state.pauseTimer);
    const resumeTimer = useTimerStore((state) => state.resumeTimer);
    const resetTimer = useTimerStore((state) => state.resetTimer);
    const setDuration = useTimerStore((state) => state.setDuration);
    const presets = useTimerStore((state) => state.presets);
    const [custom, setCustom] = useState('');

    const applyCustom = () => {
        const val = parseInt(custom);
        if (!isNaN(val) && val > 0) setDuration(val * 60);
        setCustom('');
    };

    return (
        <div className="bt-controls">
            <div className="bt-actions">
                {status === 'idle' && (
                    <button className="wb-btn wb-btn--primary wb-btn--lg" onClick={startTimer} title="Start (Space)">
                        <Play /> Start break
                    </button>
                )}
                {status === 'running' && (
                    <button className="wb-btn wb-btn--ink wb-btn--lg" onClick={pauseTimer} title="Pause (Space)">
                        <Pause /> Pause
                    </button>
                )}
                {status === 'paused' && (
                    <button className="wb-btn wb-btn--primary wb-btn--lg" onClick={resumeTimer} title="Resume (Space)">
                        <Play /> Resume
                    </button>
                )}
                <button className="wb-btn wb-btn--lg" onClick={resetTimer} title="Reset (R)">
                    <RotateCcw /> Reset
                </button>
            </div>

            {status === 'idle' && (
                <>
                    <div className="wb-seg bt-presets" role="group" aria-label="Break length in minutes">
                        {presets.map((min) => (
                            <button
                                key={min}
                                type="button"
                                aria-pressed={duration === min * 60}
                                onClick={() => setDuration(min * 60)}
                                className="wb-num"
                            >
                                {min} min
                            </button>
                        ))}
                    </div>

                    <form
                        className="bt-custom"
                        onSubmit={(e) => { e.preventDefault(); applyCustom(); }}
                    >
                        <label htmlFor="custom-minutes" className="wb-note">Other length</label>
                        <input
                            id="custom-minutes"
                            className="wb-input wb-num"
                            type="number"
                            placeholder="Minutes"
                            min="1"
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                        />
                        <button type="submit" className="wb-btn" disabled={!custom}>Set</button>
                    </form>
                </>
            )}

            <p className="bt-keys">
                <span><kbd>Space</kbd> start or pause</span>
                <span><kbd>R</kbd> reset</span>
                <span><kbd>F</kbd> full screen</span>
                <span><kbd>M</kbd> mute alarm</span>
            </p>
        </div>
    );
}
