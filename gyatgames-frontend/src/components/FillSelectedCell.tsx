import React, { useContext } from "react";
import { CrosswordContext } from "@jaredreisinger/react-crossword";
//import { buttonVariants } from "./ui/button";

type FillSelectedCellProps = {
    crosswordProvider: React.RefObject<any>;
    onHintUsed: () => void; // Callback for tracking hints

};
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const FillSelectedCell: React.FC<FillSelectedCellProps> = ({ crosswordProvider, onHintUsed }) => {
    const { selectedPosition, selectedDirection, selectedNumber, clues } = useContext(CrosswordContext);

    const FillSelectedCell = () => {
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

        const { row, col } = selectedPosition; // Use clue's starting position
        const { row: startRow, col: startCol } = selectedClue; // Use clue's starting position
        const answer = selectedClue.answer;
        console.log(answer);

        const diff = row - startRow + col - startCol;
        console.log("diff", diff);

        crosswordProvider.current?.setGuess(row, col, answer[diff]);


        console.log(`Filled answer for clue ${selectedDirection} ${selectedNumber}`);
        console.log("FillSelectedAnswer button clicked.");
        onHintUsed(); // Increment hint count

    };
    return (

        <a
            target="_blank"
            rel="noreferrer noopener"
            onClick={FillSelectedCell}
        //className={`cursor-pointer text-xs h-6 md:h-10 md:text-sm w-16 ${buttonVariants({
        //variant: "outline",
        //})}`}
        >
            <DropdownMenuItem className="flex justify-between items-center">
                <span>Cell</span>
                <span className="text-muted-foreground text-sm">+20s</span>
            </DropdownMenuItem>
        </a>

    );
};

export default FillSelectedCell;
