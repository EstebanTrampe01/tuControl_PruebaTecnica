import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Inventory, SaleItem])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
