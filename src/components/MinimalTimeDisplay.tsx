import { useTimerStore } from '../store';

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
        <div className="bt-times">
            <span>Started <strong>{formatClockTime(startTime)}</strong></span>
            <span>Ends <strong>{formatClockTime(expectedEndTime)}</strong></span>
        </div>
    );
}
