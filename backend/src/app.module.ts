import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ReportsModule } from './reports/reports.module';
import { SalesModule } from './sales/sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductsModule } from './products/products.module';
import { BranchesModule } from './branches/branches.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    CategoriesModule,
    BranchesModule,
    ProductsModule,
    InventoryModule,
    SalesModule,
    ReportsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
