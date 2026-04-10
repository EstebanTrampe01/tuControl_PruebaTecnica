import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'branch_id', type: 'int' })
  branchId: number;

  @Column({
    name: 'sold_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  soldAt: Date;
}
