import { fetchApi } from './api';
import { Product, CreateProductDto, UpdateProductDto } from '../types/product.type';

export const productsService = {
  getProducts: (categoryId?: number) => {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return fetchApi<Product[]>(`/products${query}`);
  },

  createProduct: (data: CreateProductDto) => {
    return fetchApi<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProduct: (id: number, data: UpdateProductDto) => {
    return fetchApi<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProduct: (id: number) => {
    return fetchApi<{ id: number; deleted: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
