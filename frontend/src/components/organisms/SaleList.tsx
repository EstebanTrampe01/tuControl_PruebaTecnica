'use client';

import * as React from 'react';
import { Button } from '@/components/atoms/Button';
import { BRANCHES } from '@/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sale } from '@/types/sale.type';

interface SaleListProps {
  sales: Sale[];
  productNamesById: Record<number, string>;
}

export function SaleList({ sales, productNamesById }: SaleListProps) {
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const normalizedSales = [...sales].sort((a, b) => {
    const dateSort = new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime();
    if (dateSort !== 0) return dateSort;
    return b.id - a.id;
  });

  const filteredSales = normalizedSales.filter((sale) => {
    const matchBranch =
      branchFilter === 'all' || sale.branchId === Number.parseInt(branchFilter, 10);
    const query = searchTerm.trim().toLowerCase();

    if (!matchBranch) return false;
    if (query.length === 0) return true;

    const saleIdMatch = String(sale.id).includes(query);
    const itemMatch = sale.items.some((item) => {
      const productName = productNamesById[item.productId] ?? `producto ${item.productId}`;
      return productName.toLowerCase().includes(query);
    });

    return saleIdMatch || itemMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / pageSize));
  const paginatedSales = filteredSales.slice((page - 1) * pageSize, page * pageSize);
  const filteredSalesTotal = filteredSales.reduce((acc, sale) => acc + Number(sale.total), 0);

  React.useEffect(() => {
    setPage(1);
  }, [branchFilter, searchTerm, sales]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-4">
      <div className="ledger-panel">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="sales-branch-filter" className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Sucursal
            </label>
            <select
              id="sales-branch-filter"
              value={branchFilter}
              onChange={(event) => setBranchFilter(event.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
            >
              <option value="all">Todas</option>
              {BRANCHES.map((branch, index) => (
                <option key={branch} value={String(index + 1)}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-1 lg:col-span-2">
            <label htmlFor="sales-search" className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Buscar venta o producto
            </label>
            <input
              id="sales-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej: 120 o Mouse Gamer"
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{filteredSales.length} ventas encontradas</span>
          <span>Total mostrado: {formatCurrency(filteredSalesTotal)}</span>
        </div>
      </div>

      <div className="max-h-[640px] space-y-4 overflow-y-auto pr-1">
        {paginatedSales.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            {sales.length === 0
              ? 'No hay ventas registradas todavía.'
              : 'No hay ventas que coincidan con los filtros actuales.'}
          </div>
        ) : (
          paginatedSales.map((sale) => {
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
          })
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">
          Página {page} de {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
