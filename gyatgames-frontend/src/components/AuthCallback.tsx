import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
    const { setUser } = useAuth(); // ✅ Make sure `setUser` is available
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token") || ""; // Handle empty refresh token
        const username = params.get("username") || "Unknown"; // Use default if missing

        console.log("Extracted OAuth Data:", { accessToken, refreshToken, username }); // ✅ Debugging

        if (accessToken) {
            // Store tokens
            localStorage.setItem("authToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // Set user in context
            setUser({
                username,
                email: "", // Google OAuth does not return email in URL
                id: "", // Google OAuth ID isn't stored in this response
            });

            navigate("/"); // ✅ Redirect to homepage after login
        } else {
            console.error("No access token found in callback URL");
            navigate("/auth"); // Redirect to auth page on failure
        }
    }, []);

    return <div>Loading...</div>; // Show a spinner or loading state
}

export default AuthCallback;