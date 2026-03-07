import { useTimerStore } from '../store';
import './MinimalTimeDisplay.css';

export function MinimalTimeDisplay() {
    const startTime = useTimerStore((state) => state.startTime);
    const expectedEndTime = useTimerStore((state) => state.expectedEndTime);
    const status = useTimerStore((state) => state.status);

    if (status === 'idle') return null;

    const formatClockTime = (timestamp: number | null) => {
        if (!timestamp) return '--:--';
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="minimal-time-display title-font">
            <span className="time-endpoint">
                <span className="time-label">Break Start</span> {formatClockTime(startTime)}
            </span>
            <span className="time-separator">—</span>
            <span className="time-endpoint">
                <span className="time-label">Break End</span> {formatClockTime(expectedEndTime)}
            </span>
        </div>
    );
}
