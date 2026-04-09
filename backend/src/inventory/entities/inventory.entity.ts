import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryColumn({ name: 'product_id', type: 'int' })
  productId: number;

  @PrimaryColumn({ name: 'branch_id', type: 'int' })
  branchId: number;

  @Column({ type: 'int', default: 0 })
  stock: number;
}