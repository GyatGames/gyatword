import { useContext, useState, useEffect } from 'react';
import { CrosswordContext } from '@jaredreisinger/react-crossword';

type CurrentClue = {
    direction: string;
    number: string;
};

function MobileClueDisplay() {
    const { selectedDirection, selectedNumber, clues, handleClueSelected } = useContext(CrosswordContext);

    const [currentClue, setCurrentClue] = useState<CurrentClue>({
        direction: 'across', // Default to "across"
        number: '',
    });

    const toggleDirection = (currentDirection: 'across' | 'down') =>
        currentDirection === 'across' ? 'down' : 'across';

    const handlePreviousClue = () => {
        if (!clues) return;

        const currentClues = clues[currentClue.direction as 'across' | 'down'];
        const currentIndex = currentClues.findIndex(c => c.number === currentClue.number);

        if (currentIndex > 0) {
            // Move to the previous clue in the current direction
            const previousClue = currentClues[currentIndex - 1];
            setCurrentClue({
                direction: currentClue.direction,
                number: previousClue.number,
            });
            handleClueSelected(currentClue.direction as 'across' | 'down', previousClue.number);
        } else {
            // Move to the last clue of the other direction
            const otherDirection = toggleDirection(currentClue.direction as 'across' | 'down');
            const otherClues = clues[otherDirection];
            if (otherClues.length > 0) {
                const lastClue = otherClues[otherClues.length - 1];
                setCurrentClue({
                    direction: otherDirection,
                    number: lastClue.number,
                });
                handleClueSelected(otherDirection, lastClue.number);
            }
        }
    };

    const handleNextClue = () => {
        if (!clues) return;

        const currentClues = clues[currentClue.direction as 'across' | 'down'];
        const currentIndex = currentClues.findIndex(c => c.number === currentClue.number);

        if (currentIndex < currentClues.length - 1) {
            // Move to the next clue in the current direction
            const nextClue = currentClues[currentIndex + 1];
            setCurrentClue({
                direction: currentClue.direction,
                number: nextClue.number,
            });
            handleClueSelected(currentClue.direction as 'across' | 'down', nextClue.number);
        } else {
            // Move to the first clue of the other direction
            const otherDirection = toggleDirection(currentClue.direction as 'across' | 'down');
            const otherClues = clues[otherDirection];
            if (otherClues.length > 0) {
                const firstClue = otherClues[0];
                setCurrentClue({
                    direction: otherDirection,
                    number: firstClue.number,
                });
                handleClueSelected(otherDirection, firstClue.number);
            }
        }
    };

    useEffect(() => {
        if (selectedDirection && selectedNumber) {
            setCurrentClue({ direction: selectedDirection, number: selectedNumber });
        }
    }, [selectedDirection, selectedNumber]);

    const currentClueText =
        clues?.[currentClue.direction as 'across' | 'down']?.find(c => c.number === currentClue.number)
            ?.clue || 'No clue available';

    return (
        <div className="mobile-clue-display flex max-h-11 items-center justify-between bg-primary p-2 rounded shadow-md">
            <button
                onClick={handlePreviousClue}
                className="px-4 py-2 rounded focus:outline-none"
            >
                &lt;
            </button>
            <div className="text-left text-xxs overflow-y-scroll font-bold">
                {currentClue.number ? `${currentClue.number}: ${currentClueText}` : 'No clue selected'}
            </div>
            <button
                onClick={handleNextClue}
                className="px-4 py-2 rounded focus:outline-none"
            >
                &gt;
            </button>
        </div>
    );
}

export default MobileClueDisplay;