import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore.js";

export default function ProtectedRoute({ children }) {
    const {isAuthenticated} = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}