import { clsx, type ClassValue } from "clsx"
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

const lightTheme = {
  gridBackground: "#f0f0f0",
  cellBackground: "#fff",
  cellBorder: "#D6D6D6",
  textColor: "#000",
  numberColor: "#333",
  focusBackground: "#ebd234",
  highlightBackground: "#ADD8E6",
};

const darkTheme = {
  gridBackground: "#333",
  cellBackground: "#6f6e70",
  cellBorder: "#656666",
  textColor: "#FFF",
  numberColor: "#e8e3e3",
  focusBackground: "#69b1f0",
  highlightBackground: "#ae81d6",
};

export { lightTheme, darkTheme };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Submit a new timing for the leaderboard
export async function submitTiming(userId: string, timing: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/submit_timing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, timing }),
    });
    const data = await response.json();
    console.log("Timing submission response:", data);
    return data;
  } catch (error) {
    console.error("Failed to submit timing:", error);
    throw error;
  }
}

// Fetch the top 10 global leaderboard entries for today
export async function fetchGlobalLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/globalLeaderboard`);
    const data = await response.json();
    console.log("Global Leaderboard:", data);

    // Ensure data is an array before returning
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No leaderboard data available.");
      return []; // Return an empty array instead of undefined/null
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch global leaderboard:", error);
    return [];
  }
}

// Fetch the top 10 leaderboard entries for today
export async function fetchFriendsLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/friendsLeaderboard`);
    const data = await response.json();
    console.log("Friends Leaderboard:", data);
    
    // Ensure data is an array before returning
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No leaderboard data available.");
      return []; // Return an empty array instead of undefined/null
    }


    return data;
  } catch (error) {
    console.error("Failed to fetch friends leaderboard:", error);
    return [];
  }
}

