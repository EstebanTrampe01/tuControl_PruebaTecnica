import { fetchApi } from './api';
import {
  GetInventoryQuery,
  InventoryItem,
  UpdateInventoryDto,
} from '../types/inventory.type';

export const inventoryService = {
  getInventory: ({ branchId, productId }: GetInventoryQuery = {}) => {
    const params = new URLSearchParams();
    if (branchId !== undefined) params.append('branchId', String(branchId));
    if (productId !== undefined) params.append('productId', String(productId));

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<InventoryItem[]>(`/inventory${query}`);
  },

  updateInventory: (data: UpdateInventoryDto) => {
    return fetchApi<InventoryItem>('/inventory', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
