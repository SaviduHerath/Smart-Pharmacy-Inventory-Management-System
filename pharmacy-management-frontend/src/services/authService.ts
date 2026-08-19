import api from "./api";

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
} from "../types/auth";

// =========================================================
// REGISTER
// =========================================================

export const registerUser = async (
    data: RegisterRequest
) => {

    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};


// =========================================================
// LOGIN
// =========================================================

export const loginUser = async (
    data: LoginRequest
): Promise<LoginResponse> => {

    const response = await api.post<LoginResponse>(
        "/auth/login",
        data
    );

    return response.data;
};


// =========================================================
// LOGOUT
// =========================================================

export const logoutUser = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
};


// =========================================================
// GET TOKEN
// =========================================================

export const getToken = () => {

    return localStorage.getItem("token");
};

