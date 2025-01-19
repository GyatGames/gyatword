import React, { useEffect, useState } from 'react';

type StopwatchProps = {
    running: boolean;
    onComplete?: (elapsedTime: string) => void;
};

const Stopwatch: React.FC<StopwatchProps> = ({ running, onComplete }) => {
    const [elapsedTime, setElapsedTime] = useState(1);

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
            const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
            const seconds = (elapsedTime % 60).toString().padStart(2, '0');
            onComplete(`${minutes}:${seconds}`);
        }
    }, [running, elapsedTime, onComplete]);

    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');

    return (
        <div className="w-fit text-yellow-500 bg-black p-4 rounded-lg inline-block min-w-[120px] text-center mx-auto font-bold text-base sm:py-2 sm:rounded-md sm:text-md">
            {minutes}:{seconds}
        </div>
    );
};

export default Stopwatch;
