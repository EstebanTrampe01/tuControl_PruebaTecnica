import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../branches/entities/branch.entity';
import { Product } from '../products/entities/product.entity';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryRepository {
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

  findProductById(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  findBranchById(id: number) {
    return this.branchesRepository.findOneBy({ id });
  }

  findByProductAndBranch(productId: number, branchId: number) {
    return this.inventoryRepository.findOneBy({ productId, branchId });
  }

  create(payload: { productId: number; branchId: number; stock: number }) {
    return this.inventoryRepository.create(payload);
  }

  save(inventory: Inventory) {
    return this.inventoryRepository.save(inventory);
  }
}
