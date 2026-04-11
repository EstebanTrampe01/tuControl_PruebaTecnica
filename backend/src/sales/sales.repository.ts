import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, In } from 'typeorm';
import { Branch } from '../branches/entities/branch.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Product } from '../products/entities/product.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Sale } from './entities/sale.entity';

export type SalesRawRow = {
  saleId: string;
  branchId: string;
  soldAt: string;
  productId: string | null;
  quantity: string | null;
  unitPrice: string | null;
};

export type SaleTransactionClient = {
  findBranchById: (id: number) => Promise<Branch | null>;
  findProductsByIds: (ids: number[]) => Promise<Product[]>;
  lockInventoryRows: (
    branchId: number,
    productIds: number[],
  ) => Promise<Inventory[]>;
  createSale: (branchId: number) => Promise<Sale>;
  createSaleItem: (payload: {
    saleId: number;
    productId: number;
    quantity: number;
    unitPrice: string;
  }) => Promise<SaleItem>;
  saveInventory: (inventory: Inventory) => Promise<Inventory>;
};

@Injectable()
export class SalesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  findAllRows() {
    return this.dataSource
      .createQueryBuilder()
      .select('s.id', 'saleId')
      .addSelect('s.branch_id', 'branchId')
      .addSelect('s.sold_at', 'soldAt')
      .addSelect('si.product_id', 'productId')
      .addSelect('si.quantity', 'quantity')
      .addSelect('si.unit_price', 'unitPrice')
      .from(Sale, 's')
      .leftJoin(SaleItem, 'si', 'si.sale_id = s.id')
      .orderBy('s.sold_at', 'DESC')
      .addOrderBy('s.id', 'DESC')
      .getRawMany<SalesRawRow>();
  }

  runInTransaction<T>(work: (tx: SaleTransactionClient) => Promise<T>) {
    return this.dataSource.transaction(async (manager) => {
      const txClient = this.createTransactionClient(manager);
      return work(txClient);
    });
  }

  private createTransactionClient(
    manager: EntityManager,
  ): SaleTransactionClient {
    return {
      findBranchById: (id) => manager.findOneBy(Branch, { id }),
      findProductsByIds: (ids) => manager.findBy(Product, { id: In(ids) }),
      lockInventoryRows: (branchId, productIds) =>
        manager
          .createQueryBuilder(Inventory, 'inventory')
          .setLock('pessimistic_write')
          .where('inventory.branch_id = :branchId', {
            branchId,
          })
          .andWhere('inventory.product_id IN (:...productIds)', { productIds })
          .getMany(),
      createSale: async (branchId) =>
        manager.save(
          manager.create(Sale, {
            branchId,
          }),
        ),
      createSaleItem: async (payload) =>
        manager.save(
          manager.create(SaleItem, {
            saleId: payload.saleId,
            productId: payload.productId,
            quantity: payload.quantity,
            unitPrice: payload.unitPrice,
          }),
        ),
      saveInventory: (inventory) => manager.save(inventory),
    };
  }
}
