import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    // CrosswordImperative,
    CrosswordGrid,
    // CrosswordProps,
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
  padding: 2em;
  margin-bottom: 8em;
`;

const Header = styled.h1`
//   margin-bottom: 1em;
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
`;



const CrosswordMessageBlock = styled.div`
  margin: 2em 0 4em;
  display: flex;
  gap: 2em;
  max-height: 20em;
`;

// const Messages = styled.pre`
//   flex: auto;
//   background-color: rgb(230, 230, 230);
//   margin: 0;
//   padding: 1em;
//   overflow: auto;
// `;

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
  padding-bottom: 5em;
  overflow: hidden;

  .grid{width: 20em;}

@media (min-width: 468px) {
    flex-direction: row;
    align-items: flex-start;

    .direction {
        width: 10em;
        max-height: 7em;
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

    .direction {
        width: 10em;
        max-height: 30em;
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
  margin: 0 auto;
  max-width: 600px; /* Restrict the container's width */
  align-items: center;
  gap: 1em; /* Adjust spacing between items */
  margin-bottom: 1em; /* Add spacing below the row if needed */
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
`;

function Puzzle() {
    // const crossword = useRef<CrosswordImperative>(null);

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

    // const focus = useCallback<React.MouseEventHandler>((event) => {
    //     crossword.current?.focus();
    // }, []);

    // const fillOneCell = useCallback<React.MouseEventHandler>((event) => {
    //     crossword.current?.setGuess(0, 2, 'O');
    // }, []);

    // const fillAllAnswers = useCallback<React.MouseEventHandler>((event) => {
    //     crossword.current?.fillAllAnswers();
    // }, []);

    // const reset = useCallback<React.MouseEventHandler>((event) => {
    //     crossword.current?.reset();
    // }, []);

    // We don't really *do* anything with callbacks from the Crossword component,
    // but we can at least show that they are happening.  You would want to do
    // something more interesting than simply collecting them as messages.
    const messagesRef = useRef<HTMLPreElement>(null);
    const [messages] = useState<string[]>([]);

    // const clearMessages = useCallback<React.MouseEventHandler>((event) => {
    //     setMessages([]);
    // }, []);

    // const addMessage = useCallback((message: string) => {
    //     setMessages((m) => m.concat(`${message}\n`));
    // }, []);

    useEffect(() => {
        if (!messagesRef.current) {
            return;
        }
        const { scrollHeight } = messagesRef.current;
        messagesRef.current.scrollTo(0, scrollHeight);
    }, [messages]);

    // onCorrect is called with the direction, number, and the correct answer.
    // const onCorrect = useCallback<Required<CrosswordProps>['onCorrect']>(
    //     (direction, number, answer) => {
    //         addMessage(`onCorrect: "${direction}", "${number}", "${answer}"`);
    //     },
    //     [addMessage]
    // );

    // onLoadedCorrect is called with an array of the already-correct answers,
    // each element itself is an array with the same values as in onCorrect: the
    // direction, number, and the correct answer.
    // const onLoadedCorrect = useCallback<
    //     Required<CrosswordProps>['onLoadedCorrect']
    // >(
    //     (answers) => {
    //         addMessage(
    //             `onLoadedCorrect:\n${answers
    //                 .map(
    //                     ([direction, number, answer]) =>
    //                         `    - "${direction}", "${number}", "${answer}"`
    //                 )
    //                 .join('\n')}`
    //         );
    //     },
    //     [addMessage]
    // );

    // onCrosswordCorrect is called with a truthy/falsy value.
    // const onCrosswordCorrect = useCallback<
    //     Required<CrosswordProps>['onCrosswordCorrect']
    // >(
    //     (isCorrect) => {
    //         addMessage(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    //     },
    //     [addMessage]
    // );

    // onCellChange is called with the row, column, and character.
    // const onCellChange = useCallback<Required<CrosswordProps>['onCellChange']>(
    //     (row, col, char) => {
    //         addMessage(`onCellChange: "${row}", "${col}", "${char}"`);
    //     },
    //     [addMessage]
    // );

    // all the same functionality, but for the decomposed CrosswordProvider
    const crosswordProvider = useRef<CrosswordProviderImperative>(null);

    // const focusProvider = useCallback<React.MouseEventHandler>((event) => {
    //     crosswordProvider.current?.focus();
    // }, []);

    // const fillOneCellProvider = useCallback<React.MouseEventHandler>((event) => {
    //     crosswordProvider.current?.setGuess(0, 2, 'O');
    // }, []);

    const fillAllAnswersProvider = useCallback<React.MouseEventHandler>(
        (_event) => {
            crosswordProvider.current?.fillAllAnswers();
        },
        []
    );

    const resetProvider = useCallback<React.MouseEventHandler>((_event) => {
        crosswordProvider.current?.reset();
    }, []);

    // We don't really *do* anything with callbacks from the Crossword component,
    // but we can at least show that they are happening.  You would want to do
    // something more interesting than simply collecting them as messages.
    const messagesProviderRef = useRef<HTMLPreElement>(null);
    const [messagesProvider, setMessagesProvider] = useState<string[]>([]);

    // const clearMessagesProvider = useCallback<React.MouseEventHandler>(
    //     (event) => {
    //         setMessagesProvider([]);
    //     },
    //     []
    // );

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

    // onCorrect is called with the direction, number, and the correct answer.
    const onCorrectProvider = useCallback<
        Required<CrosswordProviderProps>['onCorrect']
    >(
        (direction, number, answer) => {
            addMessageProvider(`onCorrect: "${direction}", "${number}", "${answer}"`);
        },
        [addMessageProvider]
    );

    // onLoadedCorrect is called with an array of the already-correct answers,
    // each element itself is an array with the same values as in onCorrect: the
    // direction, number, and the correct answer.
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

    // onCrosswordComplete is called with a truthy/falsy value.
    const onCrosswordCompleteProvider = useCallback<
        Required<CrosswordProviderProps>['onCrosswordComplete']
    >(
        (isCorrect) => {
            addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
            if (isCorrect) {
                if (pageTimer.current) {
                    setIsRunning(false);
                    console.log('Elapsed time when completed:', pageTimer.current.seconds);
                    Popup(`You completed the crossword in ${pageTimer.current.seconds}!`);
                }
            } else {
                PopupWrong();
            }
        },
        [addMessageProvider]
    );

    // onCellChange is called with the row, column, and character.
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
            <img src="/logo4.png" alt="logo" width="150" height="150" />
            <Header>Crossword, but brainrot</Header>
            <p>
                Puzzle refreshes daily
            </p>
            <Controls>
                <GitHubButton
                    href="https://github.com/davidchanwz/gyatword-frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                            // allowNonSquare: true,
                            columnBreakpoint: '9999px',
                            // gridBackground: '#acf',
                            cellBackground: '#ffe',
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
                            // onCrosswordCorrect={onCrosswordCorrectProvider}
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

                {/* <Messages ref={messagesProviderRef}>{messagesProvider}</Messages> */}
            </CrosswordMessageBlock>

        </Page>
    );
}

export default Puzzle;