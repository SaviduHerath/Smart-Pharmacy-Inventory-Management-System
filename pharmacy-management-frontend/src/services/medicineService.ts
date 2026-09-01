import api from "./api";

export interface Medicine {
    id: number;
    medicineName: string;
    genericName: string;
    category: string;
    supplier: string;
    batchNumber: string;
    quantity: number;
    unitPrice: number;
    expiryDate: string;
    reorderLevel: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface MedicineRequest {
    medicineName: string;
    genericName: string;
    category: string;
    supplier: string;
    batchNumber: string;
    quantity: number;
    unitPrice: number;
    expiryDate: string;
    reorderLevel: number;
}

export interface DashboardSummary {
    totalMedicines: number;
    lowStock: number;
    outOfStock: number;
    expired: number;
    nearExpiry: number;
    totalSuppliers: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export const getAllMedicines = async (): Promise<Medicine[]> => {
    const response = await api.get<Medicine[]>("/medicines");
    return response.data;
};

export const getCatalogMedicines = async (): Promise<Medicine[]> => {
    const response = await api.get<Medicine[]>("/customer/medicines");
    return response.data;
};

export const getMedicineById = async (id: number): Promise<Medicine> => {
    const response = await api.get<Medicine>(`/medicines/${id}`);
    return response.data;
};

export const createMedicine = async (data: MedicineRequest): Promise<Medicine> => {
    const response = await api.post<Medicine>("/medicines", data);
    return response.data;
};

export const updateMedicine = async (
    id: number,
    data: MedicineRequest
): Promise<Medicine> => {
    const response = await api.put<Medicine>(`/medicines/${id}`, data);
    return response.data;
};

export const deleteMedicine = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/medicines/${id}`);
    return response.data;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/medicines/dashboard");
    return response.data;
};

export const getMedicinesWithFilter = async (
    keyword: string = "",
    filter: string = "ALL",
    page: number = 0,
    size: number = 10,
    sortBy: string = "id",
    direction: string = "asc"
): Promise<PageResponse<Medicine>> => {
    const response = await api.get<PageResponse<Medicine>>("/medicines/page", {
        params: { keyword, filter, page, size, sortBy, direction },
    });
    return response.data;
};
