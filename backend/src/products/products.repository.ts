import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(SaleItem)
    private readonly saleItemsRepository: Repository<SaleItem>,
  ) {}

  findAll(categoryId?: number) {
    const where = categoryId
      ? { categoryId, deletedAt: IsNull() }
      : { deletedAt: IsNull() };

    return this.productsRepository.find({
      where,
      order: { id: 'ASC' },
    });
  }

  findCategoryById(id: number) {
    return this.categoriesRepository.findOneBy({ id });
  }

  create(payload: {
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    categoryId: number;
  }) {
    return this.productsRepository.create(payload);
  }

  save(product: Product) {
    return this.productsRepository.save(product);
  }

  findActiveById(id: number) {
    return this.productsRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
  }

  findById(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  countSaleUsage(productId: number) {
    return this.saleItemsRepository.countBy({ productId });
  }

  softDeleteById(id: number) {
    return this.productsRepository.update(id, { deletedAt: new Date() });
  }

  deleteInventoryByProductId(productId: number) {
    return this.inventoryRepository.delete({ productId });
  }

  hardDeleteById(id: number) {
    return this.productsRepository.delete(id);
  }
}
