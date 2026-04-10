import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { Inventory } from '../inventory/entities/inventory.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';

@Injectable()
export class ProductsService {
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

  async create(payload: CreateProductDto) {
    const category = await this.categoriesRepository.findOneBy({
      id: payload.categoryId,
    });

    if (!category) {
      throw new NotFoundException(
        `Category con id: ${payload.categoryId} no encontrada`,
      );
    }

    const product = this.productsRepository.create({
      name: payload.name,
      description: payload.description ?? null,
      price: payload.price.toFixed(2),
      imageUrl: payload.imageUrl ?? null,
      categoryId: payload.categoryId,
    });

    return this.productsRepository.save(product);
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con id: ${id} no encontrado`);
    }

    if (payload.categoryId !== undefined) {
      const category = await this.categoriesRepository.findOneBy({
        id: payload.categoryId,
      });

      if (!category) {
        throw new NotFoundException(
          `Category con id: ${payload.categoryId} no encontrada`,
        );
      }
    }

    if (payload.name !== undefined) {
      product.name = payload.name;
    }

    if (payload.description !== undefined) {
      product.description = payload.description ?? null;
    }

    if (payload.price !== undefined) {
      product.price = payload.price.toFixed(2);
    }

    if (payload.imageUrl !== undefined) {
      product.imageUrl = payload.imageUrl ?? null;
    }

    if (payload.categoryId !== undefined) {
      product.categoryId = payload.categoryId;
    }

    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Producto con id: ${id} no encontrado`);
    }

    if (product.deletedAt) {
      return {
        id,
        deleted: true,
        mode: 'soft' as const,
        alreadyDeleted: true,
      };
    }

    const saleUsageCount = await this.saleItemsRepository.countBy({ productId: id });

    if (saleUsageCount > 0) {
      await this.productsRepository.update(id, { deletedAt: new Date() });

      return {
        id,
        deleted: true,
        mode: 'soft' as const,
      };
    }

    await this.inventoryRepository.delete({ productId: id });
    await this.productsRepository.delete(id);

    return {
      id,
      deleted: true,
      mode: 'hard' as const,
    };
  }
}
