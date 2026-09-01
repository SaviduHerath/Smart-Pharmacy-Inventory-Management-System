import api from "./api";

export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    active: boolean;
}

export interface SupplierRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export const getAllSuppliers = async (): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>("/suppliers");
    return response.data;
};

export const getActiveSuppliers = async (): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>("/suppliers/active");
    return response.data;
};

export const createSupplier = async (data: SupplierRequest): Promise<Supplier> => {
    const response = await api.post<Supplier>("/suppliers", data);
    return response.data;
};

export const updateSupplier = async (
    id: number,
    data: SupplierRequest
): Promise<Supplier> => {
    const response = await api.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
};
