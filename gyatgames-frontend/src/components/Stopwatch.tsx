import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

type StopwatchProps = {
    running: boolean;
    onComplete?: (elapsedTime: string) => void;
};

// ✅ Define the StopwatchRef type
export type StopwatchRef = {
    addTime: (seconds: number) => void;
};

const Stopwatch = forwardRef<StopwatchRef, StopwatchProps>(({ running, onComplete }, ref) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (running) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else if (!running && interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [running]);

    useEffect(() => {
        if (!running && onComplete) {
            onComplete(formatTime(elapsedTime));
        }
    }, [running, elapsedTime, onComplete]);

    // ✅ Expose addTime method using useImperativeHandle
    useImperativeHandle(ref, () => ({
        addTime: (seconds: number) => {
            setElapsedTime((prev) => prev + seconds);
        },
    }));

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return <div className="px-2 w-14">{formatTime(elapsedTime)}</div>;
});

export default Stopwatch;