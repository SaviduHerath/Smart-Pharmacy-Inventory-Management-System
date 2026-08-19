import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/users";

export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

export interface CreateStaffUserRequest {
    fullName: string;
    email: string;
    password: string;
    role: "ADMIN" | "PHARMACIST";
}

// Get all users
export const getAllUsers = async (): Promise<AdminUser[]> => {

    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Create Admin / Pharmacist
export const createStaffUser = async (
    data: CreateStaffUserRequest
): Promise<AdminUser> => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


// Update user role
export const updateUserRole = async (
    id: number,
    role: "ADMIN" | "PHARMACIST" | "CUSTOMER"
): Promise<AdminUser> => {

    const token = localStorage.getItem("token");

    const response = await axios.put(
        `${API_URL}/${id}/role`,
        null,
        {
            params: {
                role,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


// Delete user
export const deleteUser = async (
    id: number
): Promise<void> => {

    const token = localStorage.getItem("token");

    await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};


