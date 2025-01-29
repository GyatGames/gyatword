import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AuthCallback() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
            // Store tokens
            localStorage.setItem("OauthToken", accessToken);
            localStorage.setItem("key", "value");
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // ✅ Fetch user details from /me after setting the token
            axios.get(`${API_BASE_URL}/o_me`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then(response => {
                console.log("Fetched user profile:", response.data);
                setUser(response.data); // ✅ Set user in context
                navigate("/"); // Redirect home
            })
            .catch(error => {
                console.error("Failed to fetch user profile:", error);
                navigate("/error"); // Redirect if failed
            });
        } else {
            console.error("OAuth callback failed: Missing access token");
            navigate("/error");
        }
    }, [navigate, setUser]);

    return <div>Loading...</div>; // Show a loading indicator
}

export default AuthCallback;