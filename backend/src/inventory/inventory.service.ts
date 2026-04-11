import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  findAll(filters?: { productId?: number; branchId?: number }) {
    return this.inventoryRepository.findAll(filters);
  }

  async upsert(payload: UpdateInventoryDto) {
    const [product, branch] = await Promise.all([
      this.inventoryRepository.findProductById(payload.productId),
      this.inventoryRepository.findBranchById(payload.branchId),
    ]);

    if (!product) {
      throw new NotFoundException(
        `Producto con id: ${payload.productId} no encontrada`,
      );
    }

    if (!branch) {
      throw new NotFoundException(
        `Scursusal con id: ${payload.branchId} no encontrada`,
      );
    }

    const existingInventory =
      await this.inventoryRepository.findByProductAndBranch(
        payload.productId,
        payload.branchId,
      );

    if (existingInventory) {
      existingInventory.stock = payload.stock;
      return this.inventoryRepository.save(existingInventory);
    }

    const newInventory = this.inventoryRepository.create({
      productId: payload.productId,
      branchId: payload.branchId,
      stock: payload.stock,
    });

    return this.inventoryRepository.save(newInventory);
  }
}
