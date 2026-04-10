import { IsInt, Min } from 'class-validator';

export class UpdateInventoryDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  branchId: number;

  @IsInt()
  @Min(0)
  stock: number;
}
