import api from './axios';
import type {
    Product,
    PaginatedResult,
    ProductPaginationQuery,
    CreateProductDto,
    UpdateProductDto,
} from '../types';

export const getProducts = async (
    query: ProductPaginationQuery
): Promise<PaginatedResult<Product>> => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));
    if (query.search) params.set('search', query.search);
    if (query.categoryId) params.set('categoryId', String(query.categoryId));
    const response = await api.get<PaginatedResult<Product>>(`/product?${params.toString()}`);
    return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
};

export const createProduct = async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/product', data);
    return response.data;
};

export const updateProduct = async (id: number, data: UpdateProductDto): Promise<void> => {
    await api.put(`/product/${id}`, data);
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/product/${id}`);
};
