import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type User = {
    id: string;
    username: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Function to handle login
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/login", { email, password });
            setUser(response.data.user); // Assuming the backend returns user data
            localStorage.setItem("authToken", response.data.token); // Save token for future requests
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Rethrow error for the UI to handle
        } finally {
            setLoading(false);
        }
    };

    // Function to handle signup
    const signup = async (username: string, email: string, password: string) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/signup", { username, email, password });
            setUser(response.data.user); // Assuming the backend returns user data
            localStorage.setItem("authToken", response.data.token); // Save token for future requests
        } catch (error) {
            console.error("Signup failed:", error);
            throw error; // Rethrow error for the UI to handle
        } finally {
            setLoading(false);
        }
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
    };

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get("/api/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.user); // Assuming the backend returns user data
            } catch (error) {
                console.error("Failed to fetch user:", error);
                localStorage.removeItem("authToken");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                signup,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};