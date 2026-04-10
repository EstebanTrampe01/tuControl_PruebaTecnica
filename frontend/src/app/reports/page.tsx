'use client';

import * as React from 'react';
import { Button } from '@/components/atoms/Button';
import { PageTransition } from '@/components/atoms/PageTransition';
import { PageLead } from '@/components/molecules/PageLead';
import { LedgerPanel } from '@/components/templates/LedgerPanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { reportsService } from '@/services/reports.service';
import { TopProductReportItem } from '@/types/report.type';
import { ReportsTable } from '@/components/organisms/ReportsTable';
import { ReportsBars } from '@/components/organisms/ReportsBars';
import { toast } from 'sonner';
import { BRANCHES } from '@/constants';
import { formatCurrency } from '@/lib/utils';

const toIsoDate = (value: Date) => value.toISOString().slice(0, 10);

const buildDefaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);

  return {
    from: toIsoDate(start),
    to: toIsoDate(end),
  };
};

export default function ReportsPage() {
  const defaults = React.useMemo(buildDefaultRange, []);

  const [fromDate, setFromDate] = React.useState(defaults.from);
  const [toDate, setToDate] = React.useState(defaults.to);
  const [results, setResults] = React.useState<TopProductReportItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [productFilter, setProductFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const sortedResults = React.useMemo(() => {
    return [...results].sort((a, b) => {
      const branchSort = a.branchName.localeCompare(b.branchName, 'es');
      if (branchSort !== 0) return branchSort;
      return b.quantitySold - a.quantitySold;
    });
  }, [results]);

  const visibleResults = React.useMemo(() => {
    return sortedResults.filter((item) => {
      const matchBranch =
        branchFilter === 'all' || item.branchId === Number.parseInt(branchFilter, 10);
      const query = productFilter.trim().toLowerCase();
      const matchProduct =
        query.length === 0 || item.productName.toLowerCase().includes(query);

      return matchBranch && matchProduct;
    });
  }, [branchFilter, productFilter, sortedResults]);

  const totalPages = Math.max(1, Math.ceil(visibleResults.length / pageSize));

  const paginatedResults = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleResults.slice(start, start + pageSize);
  }, [page, pageSize, visibleResults]);

  const visibleTotal = React.useMemo(() => {
    return visibleResults.reduce((acc, item) => acc + Number(item.totalSold), 0);
  }, [visibleResults]);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [branchFilter, productFilter, pageSize, results]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleGenerateReport = async () => {
    if (!fromDate || !toDate) {
      setFormError('Selecciona fecha inicio y fecha fin.');
      return;
    }

    if (fromDate > toDate) {
      setFormError('La fecha inicio no puede ser mayor que la fecha fin.');
      return;
    }

    try {
      setIsLoading(true);
      setFormError(null);
      setHasSearched(true);

      const data = await reportsService.getTopProducts({
        from: fromDate,
        to: toDate,
        limit: 100,
      });

      setResults(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo generar el reporte.';
      setResults([]);
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <PageLead
        kicker="Reports Hub"
        title="Reportes comerciales"
        description="Filtra por rango de fechas y revisa ventas por sucursal y producto con orden operativo."
        actions={
          <Button onClick={handleGenerateReport} isLoading={isLoading}>
            Generar reporte
          </Button>
        }
      />

      <LedgerPanel>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="report-from">Fecha inicio</Label>
            <Input
              id="report-from"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              disabled={isHydrated ? isLoading : undefined}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-to">Fecha fin</Label>
            <Input
              id="report-to"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              disabled={isHydrated ? isLoading : undefined}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="report-branch-filter">Sucursal</Label>
            <select
              id="report-branch-filter"
              value={branchFilter}
              onChange={(event) => setBranchFilter(event.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
              disabled={isHydrated ? isLoading : undefined}
            >
              <option value="all">Todas</option>
              {BRANCHES.map((branch, index) => (
                <option key={branch} value={String(index + 1)}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-product-filter">Producto</Label>
            <Input
              id="report-product-filter"
              value={productFilter}
              onChange={(event) => setProductFilter(event.target.value)}
              placeholder="Buscar por nombre"
              disabled={isHydrated ? isLoading : undefined}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-page-size">Filas por página</Label>
            <select
              id="report-page-size"
              value={String(pageSize)}
              onChange={(event) => setPageSize(Number.parseInt(event.target.value, 10))}
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
              disabled={isHydrated ? isLoading : undefined}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {formError && <p className="mt-3 text-sm text-destructive">{formError}</p>}
      </LedgerPanel>

      <div className="mt-4 space-y-4">
        {isLoading ? (
          <LedgerPanel>
            <p className="text-sm text-muted-foreground">Generando reporte...</p>
          </LedgerPanel>
        ) : !hasSearched ? (
          <LedgerPanel>
            <p className="text-sm text-muted-foreground">
              Selecciona un rango y pulsa &quot;Generar reporte&quot; para ver resultados.
            </p>
          </LedgerPanel>
        ) : visibleResults.length === 0 ? (
          <LedgerPanel>
            <p className="text-sm text-muted-foreground">
              No hay resultados para el período seleccionado.
            </p>
          </LedgerPanel>
        ) : (
          <>
            <ReportsBars items={visibleResults} />
            <LedgerPanel>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{visibleResults.length} resultados</span>
                <span>Total vendido: {formatCurrency(visibleTotal)}</span>
              </div>

              <ReportsTable items={paginatedResults} />

              <div className="mt-3 flex items-center justify-between text-sm">
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
            </LedgerPanel>
          </>
        )}
      </div>
    </PageTransition>
  );
}
