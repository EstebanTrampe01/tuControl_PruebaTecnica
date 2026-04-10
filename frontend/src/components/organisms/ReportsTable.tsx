'use client';

import { formatCurrency } from '@/lib/utils';
import { TopProductReportItem } from '@/types/report.type';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ReportsTableProps {
  items: TopProductReportItem[];
}

export function ReportsTable({ items }: ReportsTableProps) {
  return (
    <Table className="[&_tbody_tr]:border-b-slate-100 [&_tbody_tr:hover]:bg-primary-50/60 dark:[&_tbody_tr]:border-zinc-800 dark:[&_tbody_tr:hover]:bg-zinc-800/60 [&_tr:last-child]:border-0">
      <TableHeader>
        <TableRow className="operational-table-head-row">
          <TableHead className="operational-table-head-cell">Sucursal</TableHead>
          <TableHead className="operational-table-head-cell">Producto</TableHead>
          <TableHead className="operational-table-head-cell text-right">Cant. vendida</TableHead>
          <TableHead className="operational-table-head-cell text-right">Total vendido</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item, index) => (
          <TableRow key={`${item.branchId}-${item.productId}-${index}`}>
            <TableCell className="font-medium text-foreground">{item.branchName}</TableCell>
            <TableCell>{item.productName}</TableCell>
            <TableCell className="text-right">{item.quantitySold}</TableCell>
            <TableCell className="text-right font-medium text-foreground">
              {formatCurrency(Number(item.totalSold))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
