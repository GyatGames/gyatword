import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
    const { handleOAuthCallback } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            handleOAuthCallback(code).then(() => {
                // Redirect to the homepage after successful OAuth handling
                navigate("/");
            }).catch((error) => {
                console.error("OAuth handling failed:", error);
            });
        }
    }, []);

    return <div>Loading...</div>; // Show a spinner or loading state
}

export default AuthCallback;