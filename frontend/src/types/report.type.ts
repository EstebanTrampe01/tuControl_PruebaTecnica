export interface TopProductReportItem {
  branchId: number;
  branchName: string;
  productId: number;
  productName: string;
  quantitySold: number;
  totalSold: string;
}

export interface ReportQueryDto {
  from: string;
  to: string;
  branchId?: number;
  limit?: number;
}
