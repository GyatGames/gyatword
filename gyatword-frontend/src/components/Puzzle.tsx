import React, { useCallback, useEffect, useRef, useState } from "react";
import "tailwindcss/tailwind.css";
import styled from "styled-components";
import {
    CrosswordGrid,
    CrosswordProvider,
    CrosswordProviderImperative,
    CrosswordProviderProps,
    DirectionClues,
    ThemeProvider,
} from "@jaredreisinger/react-crossword";
import Popup from "./Popup";
import PopupWrong from "./PopupWrong";
import { timer } from "./timer";
import Stopwatch from "./Stopwatch";

const CrosswordWrapper = styled.div`
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
      content: "\u2713";
      display: inline-block;
      text-decoration: none;
      color: rgb(100, 200, 100);
      margin-right: 0.25em;
    }

    text-decoration: line-through;
    color: rgb(130, 130, 130);
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
                const response = await fetch(
                    "https://gyatwordapi.deploy.jensenhshoots.com/getGyatword"
                );
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
            console.log("Page timer started");
        }

        // Cleanup logic for HMR
        return () => {
            console.log("Cleaning up timer due to HMR");
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
        Required<CrosswordProviderProps>["onCorrect"]
    >(
        (direction, number, answer) => {
            addMessageProvider(`onCorrect: "${direction}", "${number}", "${answer}"`);
        },
        [addMessageProvider]
    );

    const onLoadedCorrectProvider = useCallback<
        Required<CrosswordProviderProps>["onLoadedCorrect"]
    >(
        (answers) => {
            addMessageProvider(
                `onLoadedCorrect:\n${answers
                    .map(
                        ([direction, number, answer]) =>
                            `    - "${direction}", "${number}", "${answer}"`
                    )
                    .join("\n")}`
            );
        },
        [addMessageProvider]
    );

    const onCrosswordCompleteProvider = useCallback<
        Required<CrosswordProviderProps>["onCrosswordComplete"]
    >(
        (isCorrect) => {
            addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
            if (isCorrect) {
                if (pageTimer.current) {
                    setIsRunning(false);
                    console.log(
                        "Elapsed time when completed:",
                        pageTimer.current.seconds
                    );
                    Popup(`You completed the crossword in ${pageTimer.current.seconds}!`);
                }
            } else {
                PopupWrong();
            }
        },
        [addMessageProvider]
    );

    const onCellChangeProvider = useCallback<
        Required<CrosswordProviderProps>["onCellChange"]
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
        <div className="p-3 bg-slate-500 no-scrollbar overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col justify-between items-center ">
                    <img
                        src="/logo4.png"
                        alt="logo"
                        width="150"
                        height="150"
                        className=""
                    />
                    <div className="text-center px-2 py-1 sm:px-5">
                        <p className="text-xs whitespace-nowrap sm:text-2xl sm:font-bold">
                            Crossword, but brainrot
                        </p>
                        <p className="text-xs whitespace-nowrap font-thin sm:text-lg text-center">
                            Puzzle refreshes daily
                        </p>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 gap-y-4 max-w-2xl sm:pr-10 ">
                    <div className="gap-5">
                        <button
                            onClick={fillAllAnswersProvider}
                            className="mb-1 whitespace-nowrap mx-auto py-2 px-4 text-lg font-bold text-white bg-red-600 border-none rounded cursor-pointer transition-transform duration-200 ease-in-out hover:bg-red-700 hover:scale-105 active:bg-blue-800 active:scale-95 focus:outline-none focus:ring-3 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-600"
                        >
                            Reveal all
                        </button>
                        <button
                            onClick={resetProvider}
                            className="mx-auto py-2 px-4 text-lg font-bold text-white bg-red-600 border-none rounded cursor-pointer transition-transform duration-200 ease-in-out hover:bg-red-700 hover:scale-105 active:bg-blue-800 active:scale-95 focus:outline-none focus:ring-3 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="">
                        <Stopwatch
                            running={isRunning}
                            onComplete={(elapsedTime) =>
                                console.log(`Elapsed Time: ${elapsedTime}`)
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="h-screen mx-auto py-8 px-10">
                <div className="">
                    <ThemeProvider
                        theme={{
                            gridBackground: "#333", // Darker grey background
                            cellBackground: "#6f6e70",
                            cellBorder: "#656666", // Light grey borders
                            textColor: "#FFF",
                            numberColor: "#e8e3e3",
                            focusBackground: "#69b1f0",
                            highlightBackground: "#ae81d6",
                        }}
                    >
                        <CrosswordWrapper>
                            <CrosswordProvider
                                ref={crosswordProvider}
                                data={data}
                                storageKey="guesses"
                                onCorrect={onCorrectProvider}
                                onLoadedCorrect={onLoadedCorrectProvider}
                                onCrosswordComplete={onCrosswordCompleteProvider}
                                onCellChange={onCellChangeProvider}
                            >
                                <div className="flex sm:flex-row flex-col gap-1 text-sm  justify-around pr-4">
                                    <div className="w-full sm:w-5/12 sm:h-1/2 h-full">
                                        <CrosswordGrid
                                        />
                                    </div>
                                    <div className="flex flex-col h-2/3 sm:flex-row sm:w-1/3 sm:h-full text-left gap-8">
                                        <div className="w-full h-28 sm:h-full overflow-y-scroll">
                                            <DirectionClues
                                                direction="across"
                                                //@ts-ignore
                                                label={<span className="font-bold">ACROSS</span>}
                                            />
                                        </div>
                                        <div className="w-full h-28 sm:h-full overflow-y-scroll">
                                            <DirectionClues
                                                direction="down"
                                                //@ts-ignore
                                                label={<span className="font-bold">DOWN</span>}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CrosswordProvider>
                        </CrosswordWrapper>
                    </ThemeProvider>
                </div>
            </div>
            <a
                href="https://github.com/davidchanwz/gyatword"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-1 whitespace-nowrap inline-flex items-center justify-center bg-black  text-white sm:text-lg sm:font-bold py-2 px-3 rounded transition-transform duration-200 ease-in-out scale-101 hover:bg-gray-800 hover:scale-105"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    className="mr-2 fill-current"
                >
                    <path d="M12 .5C5.65.5.5 5.64.5 12.1c0 5.14 3.36 9.5 8.02 11.03.58.1.79-.25.79-.56 0-.27-.01-1.15-.02-2.08-3.27.71-3.96-1.59-3.96-1.59-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.72-1.54-2.61-.3-5.36-1.31-5.36-5.81 0-1.29.46-2.35 1.19-3.18-.12-.3-.52-1.52.11-3.17 0 0 .98-.32 3.22 1.2a11.14 11.14 0 0 1 5.84 0c2.24-1.52 3.22-1.2 3.22-1.2.63 1.65.23 2.87.11 3.17.73.83 1.19 1.89 1.19 3.18 0 4.52-2.75 5.51-5.37 5.8.41.36.77 1.08.77 2.18 0 1.57-.01 2.84-.01 3.22 0 .31.2.66.8.56A11.61 11.61 0 0 0 23.5 12.1C23.5 5.64 18.35.5 12 .5z" />
                </svg>
                By SharmaTech
            </a>
        </div>
    );
}

export default Puzzle;
