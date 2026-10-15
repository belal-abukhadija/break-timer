import { useTimerStore } from '../store';
import { formatTime, getTimerColorClass } from '../utils';

export function TimerCircle() {
    const timeRemaining = useTimerStore((state) => state.timeRemaining);
    const duration = useTimerStore((state) => state.duration);
    const status = useTimerStore((state) => state.status);

    const percentComplete = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;

    // viewBox 0 0 100 100 for responsive scaling
    const radius = 46;
    const stroke = 3;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

    const statusText = status === 'running' ? 'Break in progress' : status === 'paused' ? 'Paused' : 'Ready when you are';

    return (
        <div className={`bt-dial ${getTimerColorClass(timeRemaining)}`}>
            <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle className="bt-track" fill="transparent" strokeWidth={stroke} r={radius} cx="50" cy="50" />
                <circle
                    className="bt-progress"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                    r={radius}
                    cx="50"
                    cy="50"
                />
            </svg>
            <div className="bt-face">
                <span className="bt-time" role="timer">{formatTime(timeRemaining)}</span>
                <span className="bt-sub">{statusText}</span>
            </div>
        </div>
    );
}
