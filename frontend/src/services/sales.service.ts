import { fetchApi } from './api';
import { Sale, CreateSaleDto } from '../types/sale.type';

export const salesService = {
  createSale: (data: CreateSaleDto) => {
    return fetchApi<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
