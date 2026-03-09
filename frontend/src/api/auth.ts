import api from './axios';
import type { AuthResponse, LoginDto } from '../types';

export const login = async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};
