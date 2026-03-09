export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  categoryName?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductPaginationQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}

export interface UpdateProductDto extends CreateProductDto { }

export interface CreateCategoryDto {
  name: string;
  description: string;
}
