import { Controller, Get, Query } from '@nestjs/common';
import { TopProductsQueryDto } from './dto/top-products-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('top-products')
  getTopProducts(@Query() query: TopProductsQueryDto) {
    return this.reportsService.getTopProducts(query);
  }
}
