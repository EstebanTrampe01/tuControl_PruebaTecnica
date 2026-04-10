import { fetchApi } from './api';
import { TopProductReportItem, ReportQueryDto } from '../types/report.type';

export const reportsService = {
  getTopProducts: ({ from, to, branchId, limit }: ReportQueryDto) => {
    const params = new URLSearchParams({ from, to });
    if (branchId !== undefined) params.append('branchId', String(branchId));
    if (limit !== undefined) params.append('limit', String(limit));

    return fetchApi<TopProductReportItem[]>(
      `/reports/top-products?${params.toString()}`,
    );
  },
};
