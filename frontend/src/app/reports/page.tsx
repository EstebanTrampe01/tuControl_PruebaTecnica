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
  const [hasSearched, setHasSearched] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const sortedResults = React.useMemo(() => {
    return [...results].sort((a, b) => {
      const branchSort = a.branchName.localeCompare(b.branchName, 'es');
      if (branchSort !== 0) return branchSort;
      return b.quantitySold - a.quantitySold;
    });
  }, [results]);

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
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-to">Fecha fin</Label>
            <Input
              id="report-to"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              disabled={isLoading}
            />
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
        ) : sortedResults.length === 0 ? (
          <LedgerPanel>
            <p className="text-sm text-muted-foreground">
              No hay resultados para el período seleccionado.
            </p>
          </LedgerPanel>
        ) : (
          <>
            <ReportsBars items={sortedResults} />
            <LedgerPanel>
              <ReportsTable items={sortedResults} />
            </LedgerPanel>
          </>
        )}
      </div>
    </PageTransition>
  );
}
