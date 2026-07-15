import Axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const axios = Axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// ========================
// Request Interceptor
// ========================
axios.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ========================
// Response Interceptor
// ========================
axios.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // If there is no request config, reject immediately
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Prevent infinite loop:
        // If refresh token request itself fails, don't try refreshing again.
        if (originalRequest.url === "/api/auth/refreshToken") {
            useAuthStore.getState().clearAuth();
            return Promise.reject(error);
        }

        // Access token expired
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Request a new access token
                const response = await axios.post("/api/auth/refreshToken");

                // Update Zustand store
                useAuthStore.setState({
                    accessToken: response.data.accessToken,
                    user: response.data.user,
                    isAuthenticated: true,
                });

                // Attach new token to the original request
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${response.data.accessToken}`,
                };

                // Retry original request
                return axios(originalRequest);

            } catch (refreshError) {
                // Refresh token is invalid/expired
                useAuthStore.getState().clearAuth();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axios;