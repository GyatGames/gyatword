import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Auth from "@/pages/Auth"; // Ensure this points to your Auth component

function AuthRoute() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        // Redirect to home if the user is already logged in
        return <Navigate to="/" replace />;
    }

    // Render the Auth component if the user is not logged in
    return <Auth />;
}

export default AuthRoute;