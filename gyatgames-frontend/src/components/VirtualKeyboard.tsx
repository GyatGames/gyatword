import React, { useContext } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { CrosswordContext } from '@jaredreisinger/react-crossword';

const VirtualKeyboard: React.FC = () => {
    const { handleInputChange, handleInputKeyDown, selectedPosition } = useContext(CrosswordContext);

    const handleKeyPress = (button: string) => {
        console.log('Button pressed:', button);
        
        // Check if a cell is selected
        if (!selectedPosition) {
            console.warn("No cell selected in the crossword grid.");
            return;
        }
        if (button === '{bksp}') {
            // Handle Backspace
            const backspaceEvent = new KeyboardEvent('keydown', {
                key: 'Backspace',
                bubbles: true,
                cancelable: true,
            });
            backspaceEvent.preventDefault(); // Prevent default before passing it

            handleInputKeyDown?.(backspaceEvent as unknown as React.KeyboardEvent<HTMLInputElement>);
        } else if (/^[A-Z]$/.test(button)) {
            // Handle letter keys
            const inputEvent = new Event('input', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>;
            Object.defineProperty(inputEvent, 'target', {
                writable: false,
                value: { value: button },
            });
            inputEvent.preventDefault();
            handleInputChange?.(inputEvent);
        } else {
            console.warn('Unhandled button press:', button);
        }
    };

    return (
        <div className="virtual-keyboard">
            <Keyboard
                onKeyPress={handleKeyPress}
                layout={{
                    default: [
                        'Q W E R T Y U I O P',
                        'A S D F G H J K L',
                        'Z X C V B N M {bksp}',
                    ],
                }}
                display={{
                    '{bksp}': '⌫',
                }}
                theme="my-keyboard-theme"
            />
        </div>
    );
};

export default VirtualKeyboard;