import { BadRequestException, Injectable } from '@nestjs/common';
import { TopProductsQueryDto } from './dto/top-products-query.dto';
import { ReportsDao } from './reports.dao';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsDao: ReportsDao) {}

  getTopProducts(query: TopProductsQueryDto) {
    const fromDate = new Date(query.from);
    const toDate = new Date(query.to);

    if (fromDate > toDate) {
      throw new BadRequestException(
        'La fecha "from" no puede ser mayor que la fecha "to"',
      );
    }

    const DEFAULT_LIMIT = 100;
    const MAX_LIMIT = 100;
    const normalizedLimit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

    return this.reportsDao.getTopProducts({
      from: query.from,
      to: query.to,
      branchId: query.branchId,
      limit: normalizedLimit,
    });
  }
}
