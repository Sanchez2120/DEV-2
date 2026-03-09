import api from './axios';

export interface Shipper {
    id: number;
    companyName: string;
    phone?: string;
}

export interface CreateShipperDto {
    companyName: string;
    phone?: string;
}

export const shipperApi = {
    getAll: async () => {
        const response = await api.get<Shipper[]>('/Shippers');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Shipper>(`/Shippers/${id}`);
        return response.data;
    },

    create: async (data: CreateShipperDto) => {
        const response = await api.post<Shipper>('/Shippers', data);
        return response.data;
    },

    update: async (id: number, data: CreateShipperDto) => {
        const response = await api.put<Shipper>(`/Shippers/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/Shippers/${id}`);
    }
};
