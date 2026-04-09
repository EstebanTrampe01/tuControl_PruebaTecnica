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

export interface InventoryMatrixCell {
  branchId: number;
  branchName: string;
  stock: number;
}

export interface InventoryMatrixRow {
  productId: number;
  productName: string;
  cells: InventoryMatrixCell[];
}
