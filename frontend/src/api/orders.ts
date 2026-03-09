import api from './axios';

export interface OrderDetail {
    productId: number;
    productName?: string;
    unitPrice: number;
    quantity: number;
    discount: number;
}

export interface Order {
    id: number;
    customerId: string;
    customerName?: string;
    employeeId: number;
    employeeName?: string;
    shipperId: number;
    shipperName?: string;
    orderDate: string;
    freight: number;
    details: OrderDetail[];
}

export interface CreateOrderDetailDto {
    productId: number;
    unitPrice: number;
    quantity: number;
    discount: number;
}

export interface CreateOrderDto {
    customerId: string;
    employeeId: number;
    shipperId: number;
    freight: number;
    details: CreateOrderDetailDto[];
}

export const orderApi = {
    getAll: async () => {
        const response = await api.get<Order[]>('/Orders');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Order>(`/Orders/${id}`);
        return response.data;
    },

    create: async (data: CreateOrderDto) => {
        const response = await api.post<Order>('/Orders', data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/Orders/${id}`);
    }
};
