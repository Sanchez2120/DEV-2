import api from './axios';

export interface Employee {
    id: number;
    lastName: string;
    firstName: string;
    title?: string;
    hireDate?: string;
    city?: string;
    country?: string;
    reportsToId?: number;
    managerName?: string;
}

export interface CreateEmployeeDto {
    lastName: string;
    firstName: string;
    title?: string;
    hireDate?: string;
    city?: string;
    country?: string;
    reportsToId?: number;
}

export const employeeApi = {
    getAll: async () => {
        const response = await api.get<Employee[]>('/Employees');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Employee>(`/Employees/${id}`);
        return response.data;
    },

    create: async (data: CreateEmployeeDto) => {
        const response = await api.post<Employee>('/Employees', data);
        return response.data;
    },

    update: async (id: number, data: CreateEmployeeDto) => {
        const response = await api.put<Employee>(`/Employees/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/Employees/${id}`);
    }
};
