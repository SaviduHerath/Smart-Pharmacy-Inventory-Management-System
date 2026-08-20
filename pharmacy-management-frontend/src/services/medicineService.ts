import axios from "axios";

const API_URL = "http://localhost:8080/api/medicines";

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
    createdAt: string;
    updatedAt: string;
}

export interface CreateMedicineRequest {
    name: string;
    category: string;
    description?: string;
    price: number;
    quantity: number;
}

// ============================================
// GET ALL MEDICINES
// ============================================

export const getAllMedicines = async (): Promise<Medicine[]> => {

    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};


// ============================================
// GET MEDICINE BY ID
// ============================================

export const getMedicineById = async (
    id: number
): Promise<Medicine> => {

    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


export const createMedicine = async (
    data: MedicineRequest
): Promise<Medicine> => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};


// =========================================================
// UPDATE MEDICINE
// =========================================================

export const updateMedicine = async (
    id: number,
    data: MedicineRequest
): Promise<Medicine> => {

    const token = localStorage.getItem("token");

    const response = await axios.put(
        `${API_URL}/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};


// =========================================================
// DELETE MEDICINE
// =========================================================

export const deleteMedicine = async (
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