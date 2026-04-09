import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

type TopProductsParams = {
  from: string;
  to: string;
  branchId?: number;
  limit?: number;
};

@Injectable()
export class ReportsDao {
  constructor(private readonly dataSource: DataSource) {}

  async getTopProducts(params: TopProductsParams) {
    const values: Array<string | number> = [params.from, params.to];
    let whereBranch = '';

    if (params.branchId !== undefined) {
      values.push(params.branchId);
      whereBranch = ` AND s.branch_id = $${values.length}`;
    }

    values.push(params.limit ?? 10);
    const limitPlaceholder = `$${values.length}`;

    const query = `
      SELECT
        b.id AS "branchId",
        b.name AS "branchName",
        p.id AS "productId",
        p.name AS "productName",
        SUM(si.quantity)::int AS "quantitySold",
        ROUND(SUM(si.quantity * si.unit_price), 2) AS "totalSold"
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      JOIN products p ON p.id = si.product_id
      JOIN branches b ON b.id = s.branch_id
      WHERE s.sold_at BETWEEN $1::timestamptz AND $2::timestamptz
      ${whereBranch}
      GROUP BY b.id, b.name, p.id, p.name
      ORDER BY "quantitySold" DESC, "totalSold" DESC
      LIMIT ${limitPlaceholder};
    `;

    return this.dataSource.query(query, values);
  }
}
