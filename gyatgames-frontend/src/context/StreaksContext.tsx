import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type Streak = {
    id: string;
    curr: string;
    max: string;
};

type StreaksContextType = {
    streak: Streak | null;
    curr: number;
    max: number;
    setStreak: (streak: Streak | null) => void; 
    fetchStreaks: (userID: string) => Promise<void>;
};

export const StreaksContext = createContext<StreaksContextType | undefined>(undefined);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const StreaksProvider = ({ children }: { children: ReactNode }) => {
    const [streak, setStreak] = useState<Streak | null>(null);
    const [curr, setCurr] = useState<number>(0);
    const [max, setMax] = useState<number>(0);

    const fetchStreaks = async (userID: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getStreaks`, {
                params: { userID },
            });
            const { current_streak, max_streak } = response.data;
            setStreak({ id: userID, curr: current_streak, max: max_streak });
            setCurr(current_streak);
            setMax(max_streak);
        } catch (error) {
            console.error("Failed to fetch streaks:", error);
            throw error;
        }
    };

    useEffect(() => {
        // Example: Fetch streaks for a specific user ID on mount
        const userID = "1f79dbd7-4c12-44fe-a1e9-66b277cd42a0"; // Replace with actual user ID
        fetchStreaks(userID);
        console.log("Fetching streaks for user ID:", userID); // Debugging
        console.log(streak?.id, streak?.curr, streak?.max); // Debugging
    }, []);

    return (
        <StreaksContext.Provider
            value={{
                streak,
                curr,
                max,
                setStreak,
                fetchStreaks,
            }}
        >
            {children}
        </StreaksContext.Provider>
    );
};

export const useStreaks = () => {
    const context = useContext(StreaksContext);
    if (!context) {
        throw new Error("useStreaks must be used within a StreaksProvider");
    }
    return context;
};