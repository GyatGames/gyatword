import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthCallback() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Raw query string:", window.location.search); // ✅ Debug query string
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        console.log("accesstoken 1: " + accessToken)

        if (accessToken) {
            // Store tokens
            console.log("accesstoken 2: " + accessToken)
            localStorage.setItem("authToken", accessToken.toString());
            localStorage.setItem("key", "value");

            console.log("stored access token");
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // ✅ Fetch user details from /me after setting the token
            axios.get("https://gyatwordapi-test.deploy.jensenhshoots.com/o_me", {
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