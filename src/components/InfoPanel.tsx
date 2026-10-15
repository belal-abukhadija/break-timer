import { useTimerStore } from '../store';

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
        <div className="wb-panel wb-row wb-row--between" style={{ width: '100%', flexWrap: 'nowrap', gap: 16 }}>
            <span className="wb-num">Start <strong>{formatClockTime(startTime)}</strong></span>
            <div style={{ flex: 1 }}>
                <div className="wb-progress"><span style={{ width: `${percentComplete}%` }} /></div>
                <span className="wb-hint wb-num">{Math.round(percentComplete)}%</span>
            </div>
            <span className="wb-num">End <strong>{formatClockTime(expectedEndTime)}</strong></span>
        </div>
    );
}
