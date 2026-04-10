import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsDao } from './reports.dao';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportsDao],
})
export class ReportsModule {}
