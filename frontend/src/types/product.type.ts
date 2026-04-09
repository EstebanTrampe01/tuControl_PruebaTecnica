export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  categoryId: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
}
