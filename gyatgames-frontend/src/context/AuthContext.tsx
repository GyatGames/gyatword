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
    setUser: (user: User | null) => void; 

    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    oAuthLogin: () => void; // Redirect user to Google OAuth
    handleOAuthCallback: (code: string) => Promise<void>; // Handle OAuth callback
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const refreshAccessToken = async (refreshToken: string) => {
        try {
            const response = await axios.post("https://your-backend.com/refresh", {
                refresh_token: refreshToken,
            });
    
            const { access_token, refresh_token, user } = response.data;
    
            // Save the new tokens to localStorage
            localStorage.setItem("authToken", access_token);
            if (refresh_token) {
                localStorage.setItem("refreshToken", refresh_token);
            }
    
            // Return the new user data
            return user;
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            throw error;
        }
    };

    // Function to handle login
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("https://gyatwordapi-test.deploy.jensenhshoots.com/login", { email, password });
            console.log("Login response:", response.data); // Debugging

            const { access_token, refresh_token, username } = response.data;

            if (!access_token) {
                throw new Error("Access token is missing in the response");
            }

            // Store tokens
            localStorage.setItem("authToken", access_token);
            if (refresh_token) {
                localStorage.setItem("refreshToken", refresh_token);
            }

            // Decode the access token if needed to extract user details
            const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
            console.log("Decoded Token:", decodedToken);

            const user = {
                email: decodedToken.email,
                id: decodedToken.sub, // Or other user-specific data
                username: username
            };

            setUser(user); // Set user in context
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Rethrow error for the UI to handle
        } finally {
        }
    };

    // Function to handle signup
    const signup = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post("https://gyatwordapi-test.deploy.jensenhshoots.com/signup", { username, email, password });
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
        localStorage.removeItem("refreshToken"); // Remove the refresh token
        console.log("User logged out, tokens cleared.");


    };

    // **OAuth login function**
    const oAuthLogin = () => {
        window.location.href = "https://gyatwordapi-test.deploy.jensenhshoots.com/oAuth_login";
    };
    // const handleOAuthCallback = async () => {
    //     try {
    //         // Parse query parameters from the current URL
    //         const urlParams = new URLSearchParams(window.location.search);
    //         const accessToken = urlParams.get("access_token");
    //         const refreshToken = urlParams.get("refresh_token");
    //         const username = urlParams.get("username");

    
    //         if (!accessToken) {
    //             throw new Error("Access token is missing from the OAuth callback URL.");
    //         }
    
    //         // Store tokens in localStorage
    //         localStorage.setItem("authToken", accessToken);
    //         if (refreshToken) {
    //             localStorage.setItem("refreshToken", refreshToken);
    //         }
    
    //         // Decode the access token to extract user information
    //         const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    //         console.log("Decoded Token:", decodedToken);
    
    //         const user = {
    //             username: username || "Unknown User", // Extracted from token
    //             email: decodedToken.email || "", // Extracted from token
    //             id: decodedToken.sub || "", // Extracted from token
    //         };
    
    //         // Set the user in context
    //         setUser(user);
    
    //         console.log("OAuth login successful, user set:", user);
    //     } catch (error) {
    //         console.error("OAuth callback failed:", error);
    //         throw error;
    //     }
    // };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            const refreshToken = localStorage.getItem("refreshToken");
    
            if (!token && refreshToken) {
                try {
                    const user = await refreshAccessToken(refreshToken);
                    setUser(user);
                    console.log("set user through refresh token");
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                    localStorage.removeItem("refreshToken");
                }
            } else if (token) {
                try {
                    const response = await axios.get("https://gyatwordapi-test.deploy.jensenhshoots.com/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    console.log("Response from /me:", response.data); // Log to ensure correctness

                    setUser(response.data);
                    console.log("set user through auth token: " + response.data);

                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    localStorage.removeItem("authToken");
                }
            }
        };
    
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                setUser,
                login,
                signup,
                logout,
                oAuthLogin,
                // handleOAuthCallback,
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