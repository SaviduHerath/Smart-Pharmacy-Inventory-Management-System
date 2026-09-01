import api from "./api";

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

export const getAllUsers = async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>("/admin/users");
    return response.data;
};

export const createStaffUser = async (
    data: CreateStaffUserRequest
): Promise<AdminUser> => {
    const response = await api.post<AdminUser>("/admin/users", data);
    return response.data;
};

export const updateUserRole = async (
    id: number,
    role: "ADMIN" | "PHARMACIST" | "CUSTOMER"
): Promise<AdminUser> => {
    const response = await api.put<AdminUser>(`/admin/users/${id}/role`, null, {
        params: { role },
    });
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
};
