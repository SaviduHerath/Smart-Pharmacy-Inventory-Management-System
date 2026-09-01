import api from "./api";

export type TransactionType = "IN" | "OUT";

export interface StockTransaction {
    id: number;
    medicineId: number;
    medicineName: string;
    transactionType: TransactionType;
    quantity: number;
    reason: string;
    createdAt: string;
    userId?: number;
    userName?: string;
}

export interface StockRequest {
    medicineId: number;
    transactionType: TransactionType;
    quantity: number;
    reason: string;
}

export const processStock = async (data: StockRequest): Promise<StockTransaction> => {
    const response = await api.post<StockTransaction>("/stock", data);
    return response.data;
};

export const getAllStockTransactions = async (): Promise<StockTransaction[]> => {
    const response = await api.get<StockTransaction[]>("/stock");
    return response.data;
};
