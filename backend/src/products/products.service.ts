import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  findAll(categoryId?: number) {
    return this.productsRepository.findAll(categoryId);
  }

  async create(payload: CreateProductDto) {
    const category = await this.productsRepository.findCategoryById(
      payload.categoryId,
    );

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
    const product = await this.productsRepository.findActiveById(id);

    if (!product) {
      throw new NotFoundException(`Producto con id: ${id} no encontrado`);
    }

    if (payload.categoryId !== undefined) {
      const category = await this.productsRepository.findCategoryById(
        payload.categoryId,
      );

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
    const product = await this.productsRepository.findById(id);

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

    const saleUsageCount = await this.productsRepository.countSaleUsage(id);

    if (saleUsageCount > 0) {
      await this.productsRepository.softDeleteById(id);

      return {
        id,
        deleted: true,
        mode: 'soft' as const,
      };
    }

    await this.productsRepository.deleteInventoryByProductId(id);
    await this.productsRepository.hardDeleteById(id);

    return {
      id,
      deleted: true,
      mode: 'hard' as const,
    };
  }
}
