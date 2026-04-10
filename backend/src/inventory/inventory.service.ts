import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../branches/entities/branch.entity';
import { Product } from '../products/entities/product.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
  ) {}

  findAll(filters?: { productId?: number; branchId?: number }) {
    const where: { productId?: number; branchId?: number } = {};

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.branchId) {
      where.branchId = filters.branchId;
    }

    return this.inventoryRepository.find({
      where,
      order: { productId: 'ASC', branchId: 'ASC' },
    });
  }

  async upsert(payload: UpdateInventoryDto) {
    const [product, branch] = await Promise.all([
      this.productsRepository.findOneBy({ id: payload.productId }),
      this.branchesRepository.findOneBy({ id: payload.branchId }),
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

    const existingInventory = await this.inventoryRepository.findOneBy({
      productId: payload.productId,
      branchId: payload.branchId,
    });

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
