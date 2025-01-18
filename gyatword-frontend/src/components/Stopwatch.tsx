import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type StopwatchProps = {
    running: boolean;
    onComplete?: (elapsedTime: string) => void;
};

const StopwatchContainer = styled.div`
    font-size: 1em; /* Adjust font size for readability */
    font-weight: bold;
    color: #FFD700; /* Yellow text for high contrast */
    background-color: #000000; /* Very black background */
    padding: 0.5em 1em; /* Add spacing inside the container */
    border-radius: 8px; /* Rounded corners for aesthetics */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Subtle shadow for elevation */
    display: inline-block; /* Makes it behave as an inline block */
    min-width: 120px; /* Ensures consistent width */
    text-align: center; /* Center the text */
    margin: auto;
`;


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
        <StopwatchContainer>
            {minutes}:{seconds}
        </StopwatchContainer>
    );
};

export default Stopwatch;
