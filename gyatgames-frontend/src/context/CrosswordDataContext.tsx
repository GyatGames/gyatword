import React, { createContext, useContext, useState, useEffect } from 'react';

interface CrosswordData {
    across: Record<string, any>;
    down: Record<string, any>;
}

interface CrosswordDataContextProps {
    data: CrosswordData;
    loading: boolean;
    error: string | null;
}

const CrosswordDataContext = createContext<CrosswordDataContextProps | undefined>(undefined);

export const CrosswordDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<CrosswordData>({ across: {}, down: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://gyatwordapi-test.deploy.jensenhshoots.com/getGyatword');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err: any) {
                console.error('Error fetching crossword data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <CrosswordDataContext.Provider value={{ data, loading, error }}>
            {children}
        </CrosswordDataContext.Provider>
    );
};

export const useCrosswordData = () => {
    const context = useContext(CrosswordDataContext);
    if (context === undefined) {
        throw new Error('useCrosswordData must be used within a CrosswordDataProvider');
    }
    return context;
};
