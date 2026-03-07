import { useTimerStore } from '../store';
import './InfoPanel.css';

export function InfoPanel() {
    const duration = useTimerStore((state) => state.duration);
    const timeRemaining = useTimerStore((state) => state.timeRemaining);
    const startTime = useTimerStore((state) => state.startTime);
    const expectedEndTime = useTimerStore((state) => state.expectedEndTime);
    const status = useTimerStore((state) => state.status);

    const percentComplete = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;

    const formatClockTime = (timestamp: number | null) => {
        if (!timestamp) return '--:--';
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (status === 'idle') return null;

    return (
        <div className="info-panel title-font">
            <div className="info-item">
                <span className="info-label">Start</span>
                <span className="info-value">{formatClockTime(startTime)}</span>
            </div>

            <div className="info-progress">
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${percentComplete}%` }}
                    />
                </div>
                <span className="info-percent">{Math.round(percentComplete)}%</span>
            </div>

            <div className="info-item">
                <span className="info-label">End</span>
                <span className="info-value">{formatClockTime(expectedEndTime)}</span>
            </div>
        </div>
    );
}
