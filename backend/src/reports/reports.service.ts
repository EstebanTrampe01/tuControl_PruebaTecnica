import { Injectable } from '@nestjs/common';
import { ReportsDao } from './reports.dao';

type TopProductsParams = {
  from: string;
  to: string;
  branchId?: number;
  limit?: number;
};

@Injectable()
export class ReportsService {
  constructor(private readonly reportsDao: ReportsDao) {}
  
  getTopProducts(params: TopProductsParams) {
    return this.reportsDao.getTopProducts(params);
  }
}