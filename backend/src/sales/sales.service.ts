import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Branch } from '../branches/entities/branch.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Product } from '../products/entities/product.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleItem } from './entities/sale-item.entity';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll() {
    const rows = await this.dataSource
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
      .getRawMany<{
        saleId: string;
        branchId: string;
        soldAt: string;
        productId: string | null;
        quantity: string | null;
        unitPrice: string | null;
      }>();

    const salesMap = new Map<
      number,
      {
        id: number;
        branchId: number;
        soldAt: string;
        items: Array<{
          productId: number;
          quantity: number;
          unitPrice: number;
          lineTotal: number;
        }>;
        total: number;
      }
    >();

    for (const row of rows) {
      const id = Number(row.saleId);
      const branchId = Number(row.branchId);

      let sale = salesMap.get(id);

      if (!sale) {
        sale = {
          id,
          branchId,
          soldAt: row.soldAt,
          items: [],
          total: 0,
        };

        salesMap.set(id, sale);
      }

      if (
        row.productId === null ||
        row.quantity === null ||
        row.unitPrice === null
      ) {
        continue;
      }

      const productId = Number(row.productId);
      const quantity = Number(row.quantity);
      const unitPrice = Number(row.unitPrice);
      const lineTotal = this.roundMoney(quantity * unitPrice);

      sale.items.push({
        productId,
        quantity,
        unitPrice: this.roundMoney(unitPrice),
        lineTotal,
      });

      sale.total = this.roundMoney(sale.total + lineTotal);
    }

    return Array.from(salesMap.values());
  }

  async create(payload: CreateSaleDto) {
    this.validateNoDuplicateProducts(payload);

    return this.dataSource.transaction(async (manager) => {
      const branch = await manager.findOneBy(Branch, { id: payload.branchId });

      if (!branch) {
        throw new NotFoundException(
          `Scurusal con id: ${payload.branchId} no encontrada`,
        );
      }

      const productIds = payload.items.map((item) => item.productId);

      const products = await manager.findBy(Product, {
        id: In(productIds),
      });

      if (products.length !== productIds.length) {
        const foundIds = new Set(products.map((product) => product.id));
        const missingProductIds = productIds.filter((id) => !foundIds.has(id));

        throw new NotFoundException(
          `productos no encontrados: ${missingProductIds.join(', ')}`,
        );
      }

      const inventoryRows = await manager
        .createQueryBuilder(Inventory, 'inventory')
        .setLock('pessimistic_write')
        .where('inventory.branch_id = :branchId', {
          branchId: payload.branchId,
        })
        .andWhere('inventory.product_id IN (:...productIds)', { productIds })
        .getMany();

      const inventoryByProductId = new Map(
        inventoryRows.map((inventory) => [inventory.productId, inventory]),
      );

      for (const item of payload.items) {
        const currentInventory = inventoryByProductId.get(item.productId);

        if (!currentInventory || currentInventory.stock < item.quantity) {
          throw new ConflictException(
            `Stock insuficiente para El producto: ${item.productId}`,
          );
        }
      }

      const sale = await manager.save(
        manager.create(Sale, {
          branchId: payload.branchId,
        }),
      );

      const productById = new Map(
        products.map((product) => [product.id, product]),
      );

      let total = 0;
      const saleItemsResponse: Array<{
        productId: number;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
      }> = [];

      for (const item of payload.items) {
        const product = productById.get(item.productId);
        const currentInventory = inventoryByProductId.get(item.productId);

        if (!product || !currentInventory) {
          throw new BadRequestException('payload de venta invalidos');
        }

        const unitPrice = Number(product.price);
        const lineTotal = this.roundMoney(unitPrice * item.quantity);
        total += lineTotal;

        await manager.save(
          manager.create(SaleItem, {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: unitPrice.toFixed(2),
          }),
        );

        currentInventory.stock -= item.quantity;
        await manager.save(currentInventory);

        saleItemsResponse.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: this.roundMoney(unitPrice),
          lineTotal,
        });
      }

      return {
        id: sale.id,
        branchId: sale.branchId,
        soldAt: sale.soldAt,
        items: saleItemsResponse,
        total: this.roundMoney(total),
      };
    });
  }

  private validateNoDuplicateProducts(payload: CreateSaleDto) {
    const productIds = payload.items.map((item) => item.productId);
    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      throw new BadRequestException('productos duplicaods');
    }
  }

  private roundMoney(value: number) {
    return Number(value.toFixed(2));
  }
}
