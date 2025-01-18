import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    CrosswordGrid,
    CrosswordProvider,
    CrosswordProviderImperative,
    CrosswordProviderProps,
    DirectionClues,
    ThemeProvider,
} from '@jaredreisinger/react-crossword';
import styled from 'styled-components';
import Popup from './Popup';
import PopupWrong from './PopupWrong';
import { timer } from './timer';
import Stopwatch from './Stopwatch';

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  max-height: 30em;
  text-align: left;
  font-size: 14px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Page = styled.div`
    padding: 0.5em;
`;

const Header = styled.h1`
    font-size: 1.5rem;

`;

const Command = styled.button`
  margin: auto;
  padding: 0.5em 1em;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color:rgb(222, 38, 38);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color:rgb(234, 0, 0);
    transform: scale(1.05);
  }

  &:active {
    background-color: #004080;
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    color: #666666;
  }  

    /* Mobile-specific styling */
  @media (max-width: 768px) {
    font-size: 0.9rem; /* Slightly smaller font for smaller screens */
    padding: 0.5em 0.8em; /* Reduced padding */
  }

  @media (max-width: 480px) {
    font-size: 0.8rem; /* Smaller font for very small screens */
    padding: 0.4em 0.8em; /* Compact padding */
    border-radius: 3px; /* Slightly less rounded corners for compactness */
  }
`;

const CrosswordMessageBlock = styled.div`
  margin: 2em 0 4em;
  display: flex;
  gap: 2em;
  max-height: 20em;
`;

const CrosswordWrapper = styled.div`
  max-width: 20em;
  margin: auto;

  /* and some fun making use of the defined class names */
  .crossword.correct {
    rect {
      stroke: rgb(100, 200, 100) !important;
    }
    svg > rect {
      fill: rgb(100, 200, 100) !important;
    }
    text {
      fill: rgb(100, 200, 100) !important;
    }
  }

  .clue.correct {
    &::before {
      content: '\u2713';
      display: inline-block;
      text-decoration: none;
      color: rgb(100, 200, 100);
      margin-right: 0.25em;
    }

    text-decoration: line-through;
    color: rgb(130, 130, 130);
  }
`;

const CrosswordProviderWrapper = styled(CrosswordWrapper)`
  max-width: 50em;
  display: flex;
  gap: 1em;
  flex-direction: column;
  overflow: hidden;

  .grid{
    width: 20em;
    margin: auto;
  }
    .direction {
        max-height: 7em;
        overflow-y: scroll;
    }

@media (min-width: 468px) {
    flex-direction: row;
    align-items: flex-start;

    .direction {
        width: 10em;
        max-height: 11em;
        overflow: scroll;
        
        .header {
            margin-top: 0;
        }
    }
    
    .grid {
        width: 30em;
    }
  }

  @media (min-width: 549px) {
    flex-direction: row;
    align-items: flex-start;
    max-width: 60em;


    .direction {
        width: 15em;
        max-height: 35em;
        overflow: scroll;
        
        .header {
            margin-top: 0;
        }
    }
    
    .grid {
        width: 30em;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  margin: 0 auto;
  max-width: 600px; /* Restrict the container's width */
  align-items: center;
  gap: 1em; /* Adjust spacing between items */
  margin-bottom: 1em; /* Add spacing below the row if needed */

  /* Adjust the layout for smaller screens */
  @media (max-width: 480px) {
    flex-direction: row; /* Ensure it's still row-based */
    justify-content: center; /* Center the grid */
    gap: 0.5em; /* Slightly smaller gaps */
    & > * {
      flex: 1 1 calc(50% - 1em); /* 50% width with space for the gap */
      max-width: calc(50% - 1em); /* Prevent overflow */
      text-align: center; /* Center align buttons */
    }
  }
`;

const GitHubButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5em 1em;
  border-radius: 5px;
  transition: transform 0.2s ease, background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #333;
    transform: scale(1.05);
  }

  svg {
    margin-right: 0.5em;
    fill: #fff;
  }

    /* Mobile-specific styling */
  @media (max-width: 768px) {
    font-size: 0.9rem; /* Slightly smaller text */
    padding: 0.5em 0.8em; /* Adjust padding for smaller screens */

    svg {
      margin-right: 0.3em; /* Reduce space between icon and text */
    }
  }

  @media (max-width: 480px) {
    font-size: 0.7rem; /* Further reduce text size for very small screens */
    padding: 0.4em 0.1em; /* Smaller padding */
    margin-left: 2px; /* Offset slightly to the left */
    svg {
      margin-right: 0.1em; /* Minimal margin for small screens */
    }
  }
`;

function Puzzle() {

    const pageTimer = useRef<ReturnType<typeof timer> | null>(null);

    const [isRunning, setIsRunning] = useState(true);

    const [data, setData] = useState(() => ({ across: {}, down: {} })); // Default data structure
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://gyatwordapi.deploy.jensenhshoots.com/getGyatword');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!pageTimer.current) {
            pageTimer.current = timer();
            console.log('Page timer started');
        }

        // Cleanup logic for HMR
        return () => {
            console.log('Cleaning up timer due to HMR');
            pageTimer.current = null;
        };
    }, []);

    const messagesRef = useRef<HTMLPreElement>(null);
    const [messages] = useState<string[]>([]);

    useEffect(() => {
        if (!messagesRef.current) {
            return;
        }
        const { scrollHeight } = messagesRef.current;
        messagesRef.current.scrollTo(0, scrollHeight);
    }, [messages]);

    const crosswordProvider = useRef<CrosswordProviderImperative>(null);

    const fillAllAnswersProvider = useCallback<React.MouseEventHandler>(
        (_event) => {
            crosswordProvider.current?.fillAllAnswers();
        },
        []
    );

    const resetProvider = useCallback<React.MouseEventHandler>((_event) => {
        crosswordProvider.current?.reset();
    }, []);

    const messagesProviderRef = useRef<HTMLPreElement>(null);
    const [messagesProvider, setMessagesProvider] = useState<string[]>([]);

    const addMessageProvider = useCallback((message: string) => {
        setMessagesProvider((m) => m.concat(`${message}\n`));
    }, []);

    useEffect(() => {
        if (!messagesProviderRef.current) {
            return;
        }
        const { scrollHeight } = messagesProviderRef.current;
        messagesProviderRef.current.scrollTo(0, scrollHeight);
    }, [messagesProvider]);

    const onCorrectProvider = useCallback<
        Required<CrosswordProviderProps>['onCorrect']
    >(
        (direction, number, answer) => {
            addMessageProvider(`onCorrect: "${direction}", "${number}", "${answer}"`);
        },
        [addMessageProvider]
    );

    const onLoadedCorrectProvider = useCallback<
        Required<CrosswordProviderProps>['onLoadedCorrect']
    >(
        (answers) => {
            addMessageProvider(
                `onLoadedCorrect:\n${answers
                    .map(
                        ([direction, number, answer]) =>
                            `    - "${direction}", "${number}", "${answer}"`
                    )
                    .join('\n')}`
            );
        },
        [addMessageProvider]
    );

    const onCrosswordCompleteProvider = useCallback<
        Required<CrosswordProviderProps>['onCrosswordComplete']
    >(
        (isCorrect) => {
            addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
            if (isCorrect) {
                if (pageTimer.current) {
                    setIsRunning(false);
                    console.log('Elapsed time when completed:', pageTimer.current.seconds);
                    Popup(`You completed the gyatword in ${pageTimer.current.seconds}!`);
                }
            } else {
                PopupWrong();
            }
        },
        [addMessageProvider]
    );

    const onCellChangeProvider = useCallback<
        Required<CrosswordProviderProps>['onCellChange']
    >(
        (row, col, char) => {
            addMessageProvider(`onCellChange: "${row}", "${col}", "${char}"`);
        },
        [addMessageProvider]
    );

    if (loading) {
        return <p>Loading crossword...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Page>
            <img src="/logo4.png" alt="logo" width="100" height="100" />
            <Header>Crossword, but brainrot</Header>

            <Controls>
                <GitHubButton
                    href="https://github.com/davidchanwz/gyatword"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 .5C5.65.5.5 5.64.5 12.1c0 5.14 3.36 9.5 8.02 11.03.58.1.79-.25.79-.56 0-.27-.01-1.15-.02-2.08-3.27.71-3.96-1.59-3.96-1.59-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.72-1.54-2.61-.3-5.36-1.31-5.36-5.81 0-1.29.46-2.35 1.19-3.18-.12-.3-.52-1.52.11-3.17 0 0 .98-.32 3.22 1.2a11.14 11.14 0 0 1 5.84 0c2.24-1.52 3.22-1.2 3.22-1.2.63 1.65.23 2.87.11 3.17.73.83 1.19 1.89 1.19 3.18 0 4.52-2.75 5.51-5.37 5.8.41.36.77 1.08.77 2.18 0 1.57-.01 2.84-.01 3.22 0 .31.2.66.8.56A11.61 11.61 0 0 0 23.5 12.1C23.5 5.64 18.35.5 12 .5z" />
                    </svg>
                    By SharmaTech
                </GitHubButton>
                <Stopwatch
                    running={isRunning}
                    onComplete={(elapsedTime) => console.log(`Elapsed Time: ${elapsedTime}`)}
                />
                <Command onClick={resetProvider}>Reset</Command>
                <Command onClick={fillAllAnswersProvider}>Reveal all</Command>
            </Controls>
            <CrosswordMessageBlock>
                <CrosswordProviderWrapper>
                    <ThemeProvider
                        theme={{
                            columnBreakpoint: '9999px',
                            cellBackground: '#ffe',
                            gridBackground: '#C0C2C9',
                            cellBorder: '#fca',
                            numberColor: '#000',
                            focusBackground: '#66ccff',
                            highlightBackground: '#99ccff',
                        }}
                    >
                        <CrosswordProvider
                            ref={crosswordProvider}
                            data={data}
                            storageKey="guesses"
                            onCorrect={onCorrectProvider}
                            onLoadedCorrect={onLoadedCorrectProvider}
                            onCrosswordComplete={onCrosswordCompleteProvider}
                            onCellChange={onCellChangeProvider}
                        >
                            <CrosswordGrid />
                            <ResponsiveContainer>
                                <DirectionClues direction="across" />
                                <DirectionClues direction="down" />
                            </ResponsiveContainer>
                        </CrosswordProvider>
                    </ThemeProvider>
                </CrosswordProviderWrapper>

            </CrosswordMessageBlock>

        </Page>
    );
}

export default Puzzle;