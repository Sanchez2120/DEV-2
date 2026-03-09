import api from './axios';
import type { Category, CreateCategoryDto } from '../types';

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/category');
    return response.data;
};

export const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/category', data);
    return response.data;
};
