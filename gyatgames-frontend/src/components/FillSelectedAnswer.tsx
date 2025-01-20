import React, { useContext } from "react";
import { CrosswordContext } from "@jaredreisinger/react-crossword";
import { buttonVariants } from "./ui/button";

type FillSelectedAnswerProps = {
    crosswordProvider: React.RefObject<any>;
};

const FillSelectedAnswer: React.FC<FillSelectedAnswerProps> = ({ crosswordProvider }) => {
    const { selectedPosition, selectedDirection, selectedNumber, clues } = useContext(CrosswordContext);

    const handleFillSelectedAnswer = () => {
        console.log("selectedPosition:", selectedPosition);
        console.log("selectedDirection:", selectedDirection);
        console.log("selectedNumber:", selectedNumber);
        console.log("clues:", clues);

        if (!selectedPosition || !selectedDirection || !selectedNumber || !clues) {
            console.warn("Incomplete data for filling the selected answer.");
            return;
        }

        // Find the selected clue
        const selectedClue = clues[selectedDirection]?.find((clue) => clue.number === selectedNumber);
        if (!selectedClue) {
            console.warn("Selected clue not found in clues data.");
            return;
        }

        const { row: startRow, col: startCol } = selectedClue; // Use clue's starting position
        const answer = selectedClue.answer;

        // Fill the answer starting from the clue's starting position
        for (let i = 0; i < answer.length; i++) {
            const guessRow = selectedDirection === "across" ? startRow : startRow + i;
            const guessCol = selectedDirection === "across" ? startCol + i : startCol;

            crosswordProvider.current?.setGuess(guessRow, guessCol, answer[i]);
        }

        console.log(`Filled answer for clue ${selectedDirection} ${selectedNumber}`);
    };

    return (
        <a
            target="_blank"
            rel="noreferrer noopener"
            onClick={handleFillSelectedAnswer}
            className={`cursor-pointer text-xs h-6 md:h-10 md:text-sm w-16 ${buttonVariants({
                variant: "outline",
            })}`}
        >
            Hint
        </a>

    );
};

export default FillSelectedAnswer;