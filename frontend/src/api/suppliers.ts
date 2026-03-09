import api from './axios';

export interface Supplier {
    id: number;
    companyName: string;
    contactName?: string;
    contactTitle?: string;
    city?: string;
    country?: string;
    phone?: string;
}

export interface CreateSupplierDto {
    companyName: string;
    contactName?: string;
    contactTitle?: string;
    city?: string;
    country?: string;
    phone?: string;
}

export const supplierApi = {
    getAll: async () => {
        const response = await api.get<Supplier[]>('/Suppliers');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Supplier>(`/Suppliers/${id}`);
        return response.data;
    },

    create: async (data: CreateSupplierDto) => {
        const response = await api.post<Supplier>('/Suppliers', data);
        return response.data;
    },

    update: async (id: number, data: CreateSupplierDto) => {
        const response = await api.put<Supplier>(`/Suppliers/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/Suppliers/${id}`);
    }
};
