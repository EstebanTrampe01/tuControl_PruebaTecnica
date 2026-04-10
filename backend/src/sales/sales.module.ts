import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Product } from '../products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '../branches/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, Inventory, Product, Branch]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [TypeOrmModule],
})
export class SalesModule {}
