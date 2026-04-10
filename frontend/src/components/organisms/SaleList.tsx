'use client';

import { BRANCHES } from '@/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sale } from '@/types/sale.type';

interface SaleListProps {
  sales: Sale[];
  productNamesById: Record<number, string>;
}

export function SaleList({ sales, productNamesById }: SaleListProps) {
  if (sales.length === 0) {
    return (
      <div className="ledger-panel p-6 text-sm text-muted-foreground">
        No hay ventas registradas todavía.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => {
        const branchName = BRANCHES[sale.branchId - 1] ?? `Sucursal ${sale.branchId}`;

        return (
          <article
            key={sale.id}
            className="ledger-panel"
          >
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">Venta #{sale.id}</p>
                <p className="text-xs text-muted-foreground">
                  {branchName} · {formatDate(sale.soldAt)}
                </p>
              </div>
              <p className="text-sm font-semibold text-success">{formatCurrency(Number(sale.total))}</p>
            </div>

            <div className="space-y-2 border-t border-border pt-3">
              {sale.items.map((item, index) => (
                <div
                  key={`${sale.id}-${item.productId}-${index}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {productNamesById[item.productId] ?? `Producto ${item.productId}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x {formatCurrency(Number(item.unitPrice))}
                    </p>
                  </div>

                  <p className="shrink-0 font-medium text-foreground">
                    {formatCurrency(Number(item.lineTotal))}
                  </p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
