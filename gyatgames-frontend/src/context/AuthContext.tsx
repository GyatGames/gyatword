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
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    oAuthLogin: () => void; // Redirect user to Google OAuth
    handleOAuthCallback: (code: string) => Promise<void>; // Handle OAuth callback
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Function to handle login
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("https://test-gyatword.deploy.jensenhshoots.com/login", { email, password });
            setUser(response.data.user); // Assuming the backend returns user data
            localStorage.setItem("authToken", response.data.token); // Save token for future requests
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Rethrow error for the UI to handle
        } finally {
        }
    };

    // Function to handle signup
    const signup = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post("https://test-gyatword.deploy.jensenhshoots.com/signup", { username, email, password });
            setUser(response.data.user); // Assuming the backend returns user data
            localStorage.setItem("authToken", response.data.token); // Save token for future requests
        } catch (error) {
            console.error("Signup failed:", error);
            throw error; // Rethrow error for the UI to handle
        } finally {
        }
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
    };


    // **OAuth login function**
    const oAuthLogin = () => {
        // Redirect the user to the Google OAuth login page
        window.location.href = "https://test-gyatword.deploy.jensenhshoots.com/oAuth_login";
    };

    // **Handle OAuth callback function**
    const handleOAuthCallback = async (code: string) => {
        try {
            const response = await axios.get(`https://test-gyatword.deploy.jensenhshoots.com/oAuth_login?code=${code}`);
            setUser(response.data.user_info); // Update user info with response data
            localStorage.setItem("authToken", response.data.token); // Optional if backend sends a token
        } catch (error) {
            console.error("OAuth callback failed:", error);
            throw error;
        } finally {
        }
    };

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                return;
            }
            try {
                const response = await axios.get("https://test-gyatword.deploy.jensenhshoots.com/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.user); // Assuming the backend returns user data
            } catch (error) {
                console.error("Failed to fetch user:", error);
                localStorage.removeItem("authToken");
            } finally {
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                oAuthLogin,
                handleOAuthCallback,
            }}
        >
            {children}
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