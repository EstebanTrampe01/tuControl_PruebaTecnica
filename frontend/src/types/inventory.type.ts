export interface InventoryItem {
  productId: number;
  branchId: number;
  stock: number;
}

export interface UpdateInventoryDto {
  productId: number;
  branchId: number;
  stock: number;
}

export interface GetInventoryQuery {
  productId?: number;
  branchId?: number;
}
