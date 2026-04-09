import { fetchApi } from './api';
import { Product, CreateProductDto } from '../types/product.type';

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
};
