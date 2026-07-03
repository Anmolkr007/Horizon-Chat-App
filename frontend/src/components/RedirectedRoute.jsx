import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore.js";

export default function RedirectedRoute({ children }) {
    const {isAuthenticated} = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/home-page" replace/>;
    }

    return children;
}