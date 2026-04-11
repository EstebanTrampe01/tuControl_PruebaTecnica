'use client';

import { BRANCHES } from '@/constants';
import { InventoryMatrixRow } from '@/types/inventory.type';
import { StockBadge } from '@/components/molecules/StockBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InventoryGridProps {
  rows: InventoryMatrixRow[];
  emptyMessage?: string;
  onEditCell: (params: {
    productId: number;
    productName: string;
    branchId: number;
    branchName: string;
    stock: number;
  }) => void;
}

export function InventoryGrid({
  rows,
  onEditCell,
  emptyMessage = 'No hay productos para mostrar inventario.',
}: InventoryGridProps) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <Table className="min-w-[640px] [&_tbody_tr]:border-b-slate-100 [&_tbody_tr:hover]:bg-primary-50/60 dark:[&_tbody_tr]:border-zinc-800 dark:[&_tbody_tr:hover]:bg-zinc-800/60 [&_tr:last-child]:border-0">
      <TableHeader>
        <TableRow className="operational-table-head-row">
          <TableHead className="operational-table-head-cell">Producto</TableHead>
          {BRANCHES.map((branch) => (
            <TableHead key={branch} className="operational-table-head-cell text-center">
              {branch}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.productId}>
            <TableCell className="max-w-[240px] truncate font-medium text-foreground">{row.productName}</TableCell>

            {row.cells.map((cell) => (
              <TableCell key={`${row.productId}-${cell.branchId}`} className="text-center">
                <button
                  type="button"
                  onClick={() =>
                    onEditCell({
                      productId: row.productId,
                      productName: row.productName,
                      branchId: cell.branchId,
                      branchName: cell.branchName,
                      stock: cell.stock,
                    })
                  }
                  className="rounded-lg p-1 transition-colors hover:bg-primary-50 dark:hover:bg-zinc-800"
                  aria-label={`Ajustar stock de ${row.productName} en ${cell.branchName}`}
                >
                  <StockBadge stock={cell.stock} />
                </button>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
