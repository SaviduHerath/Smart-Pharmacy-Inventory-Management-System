import api from "./api";

export interface CartItem {
    id: number;
    medicineId: number;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Cart {
    cartId: number;
    userId: number;
    items: CartItem[];
    total: number;
}

export const getCart = async (): Promise<Cart> => {
    const response = await api.get<Cart>("/cart");
    return response.data;
};

export const addToCart = async (
    medicineId: number,
    quantity: number
): Promise<Cart> => {
    const response = await api.post<Cart>("/cart", { medicineId, quantity });
    return response.data;
};

export const updateCartItem = async (
    cartItemId: number,
    medicineId: number,
    quantity: number
): Promise<Cart> => {
    const response = await api.put<Cart>(`/cart/items/${cartItemId}`, {
        medicineId,
        quantity,
    });
    return response.data;
};

export const removeCartItem = async (cartItemId: number): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${cartItemId}`);
    return response.data;
};

export const clearCart = async (): Promise<Cart> => {
    const response = await api.delete<Cart>("/cart/clear");
    return response.data;
};
