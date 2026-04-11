import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Branch } from '../branches/entities/branch.entity';
import { InventoryRepository } from './inventory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Product, Branch])],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository],
  exports: [TypeOrmModule],
})
export class InventoryModule {}
