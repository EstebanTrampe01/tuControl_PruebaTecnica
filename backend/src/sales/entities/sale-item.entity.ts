import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('sale_items')
@Unique(['saleId', 'productId'])
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sale_id', type: 'int' })
  saleId: number;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice: string;
}