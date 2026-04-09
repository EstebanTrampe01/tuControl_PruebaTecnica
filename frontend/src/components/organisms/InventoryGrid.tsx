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
  onEditCell: (params: {
    productId: number;
    productName: string;
    branchId: number;
    branchName: string;
    stock: number;
  }) => void;
}

export function InventoryGrid({ rows, onEditCell }: InventoryGridProps) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        No hay productos para mostrar inventario.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          {BRANCHES.map((branch) => (
            <TableHead key={branch} className="text-center">
              {branch}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.productId}>
            <TableCell className="font-medium text-foreground">{row.productName}</TableCell>

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
                  className="rounded-lg p-1 transition-colors hover:bg-primary-50 dark:hover:bg-secondary"
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
  );
}
