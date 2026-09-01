import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach JWT token
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = String(error.config?.url || "");
        const isAuthRequest =
            requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/register");

        if (error.response?.status === 401 && !isAuthRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export function getApiErrorMessage(
    error: unknown,
    fallback: string
): string {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code?: string }).code;
        if (code === "ERR_NETWORK") {
            return "Cannot reach the backend on http://localhost:8080. Start the Spring Boot API and try again.";
        }
    }

    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as {
            response?: { status?: number; data?: unknown };
        }).response;

        if (response?.status === 403) {
            return "Access denied while loading this data. Restart the backend so the latest security rules are applied.";
        }

        const data = response?.data;

        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (typeof data === "object" && data !== null && "message" in data) {
            const message = (data as { message?: unknown }).message;
            if (typeof message === "string" && message.trim()) {
                return message;
            }
        }
    }

    return fallback;
}

export default api;

