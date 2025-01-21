import { clsx, type ClassValue } from "clsx"
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge"
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Auth from "@/pages/Auth"; 

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

