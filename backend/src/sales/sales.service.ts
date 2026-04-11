import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async findAll() {
    const rows = await this.salesRepository.findAllRows();

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

    return this.salesRepository.runInTransaction(async (tx) => {
      const branch = await tx.findBranchById(payload.branchId);

      if (!branch) {
        throw new NotFoundException(
          `Scurusal con id: ${payload.branchId} no encontrada`,
        );
      }

      const productIds = payload.items.map((item) => item.productId);

      const products = await tx.findProductsByIds(productIds);

      if (products.length !== productIds.length) {
        const foundIds = new Set(products.map((product) => product.id));
        const missingProductIds = productIds.filter((id) => !foundIds.has(id));

        throw new NotFoundException(
          `productos no encontrados: ${missingProductIds.join(', ')}`,
        );
      }

      const inventoryRows = await tx.lockInventoryRows(
        payload.branchId,
        productIds,
      );

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

      const sale = await tx.createSale(payload.branchId);

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

        await tx.createSaleItem({
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: unitPrice.toFixed(2),
        });

        currentInventory.stock -= item.quantity;
        await tx.saveInventory(currentInventory);

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
