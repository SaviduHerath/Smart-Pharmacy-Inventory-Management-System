import api from "./api";

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED";

export interface OrderItem {
    id: number;
    medicineId: number;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    items: OrderItem[];
}

export const createOrder = async (): Promise<Order> => {
    const response = await api.post<Order>("/orders");
    return response.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
    const response = await api.get<Order[]>("/orders/my");
    return response.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await api.get<Order[]>("/orders");
    return response.data;
};

export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/status/${status}`);
    return response.data;
};

export const cancelOrder = async (id: number): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/cancel`);
    return response.data;
};

export const updateOrderStatus = async (
    id: number,
    status: OrderStatus
): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/status`, null, {
        params: { status },
    });
    return response.data;
};
