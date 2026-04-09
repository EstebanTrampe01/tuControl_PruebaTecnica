import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  findAll(categoryId?: number) {
    return this.productsRepository.find({
      where: categoryId ? { categoryId } : {},
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
}
