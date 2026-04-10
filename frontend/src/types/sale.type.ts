export interface SaleItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Sale {
  id: number;
  branchId: number;
  soldAt: string;
  items: SaleItem[];
  total: number;
}

export interface CreateSaleItemDto {
  productId: number;
  quantity: number;
}

export interface CreateSaleDto {
  branchId: number;
  items: CreateSaleItemDto[];
}

export interface SaleCartItem {
  productId: number;
  quantity: number;
}
