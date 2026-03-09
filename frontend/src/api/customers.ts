import api from './axios';

export interface Customer {
    id: string; // 5 characters
    companyName: string;
    contactName?: string;
    city?: string;
    country?: string;
    phone?: string;
}

export interface CreateCustomerDto {
    id: string; // En Northwind, los IDs de clientes (ej. ALFKI) suelen proveerse manualmente
    companyName: string;
    contactName?: string;
    city?: string;
    country?: string;
    phone?: string;
}

export const customerApi = {
    getAll: async () => {
        const response = await api.get<Customer[]>('/Customers');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Customer>(`/Customers/${id}`);
        return response.data;
    },

    create: async (data: CreateCustomerDto) => {
        const response = await api.post<Customer>('/Customers', data);
        return response.data;
    },

    update: async (id: string, data: CreateCustomerDto) => {
        const response = await api.put<Customer>(`/Customers/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/Customers/${id}`);
    }
};
