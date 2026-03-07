import './TimerCircle.css';
import { useTimerStore } from '../store';
import { formatTime, getTimerColorClass } from '../utils';

export function TimerCircle() {
    const timeRemaining = useTimerStore((state) => state.timeRemaining);
    const duration = useTimerStore((state) => state.duration);

    const percentComplete = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;

    // Using viewBox 0 0 100 100 for responsive scaling
    const radius = 46;
    const stroke = 2.5;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

    const colorClass = getTimerColorClass(timeRemaining);

    return (
        <div className="timer-container">
            <svg
                viewBox="0 0 100 100"
                className="timer-svg"
            >
                <circle
                    stroke="var(--panel-border)"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx="50"
                    cy="50"
                />
                <circle
                    className={`progress-ring ${colorClass}`}
                    stroke="currentColor"
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
            <div className="timer-text-container">
                <span className={`timer-text title-font ${colorClass}`}>
                    {formatTime(timeRemaining)}
                </span>
            </div>
        </div>
    );
}
