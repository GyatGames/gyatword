import React, { useContext } from "react";
import { CrosswordContext } from "@jaredreisinger/react-crossword";
//import { buttonVariants } from "./ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type FillSelectedAnswerProps = {
    crosswordProvider: React.RefObject<any>;
    onHintUsed: () => void; // Callback for tracking hints

};

const FillSelectedAnswer: React.FC<FillSelectedAnswerProps> = ({ crosswordProvider, onHintUsed }) => {
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
        console.log("FillSelectedAnswer button clicked.");
        onHintUsed(); // Increment hint count

    };

    return (
        <a
            target="_blank"
            rel="noreferrer noopener"
            onClick={handleFillSelectedAnswer}
        //className={`cursor-pointer text-xs h-6 md:h-10 md:text-sm w-16 ${buttonVariants({
        //variant: "outline",
        //})}`}
        >
            <DropdownMenuItem className="flex justify-between items-center">
                <span>Word</span>
                <span className="text-muted-foreground text-sm">+60s</span>
            </DropdownMenuItem>
        </a>

    );
};

export default FillSelectedAnswer;
