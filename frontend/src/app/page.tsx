import { PageTransition } from '@/components/atoms/PageTransition';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { inventoryService } from '@/services/inventory.service';
import { productsService } from '@/services/products.service';
import { reportsService } from '@/services/reports.service';
import { salesService } from '@/services/sales.service';
import { Sale } from '@/types/sale.type';
import { TopProductReportItem } from '@/types/report.type';
import Link from 'next/link';
import { PageLead } from '@/components/molecules/PageLead';
import { LedgerPanel } from '@/components/templates/LedgerPanel';
import { BRANCHES } from '@/constants';
import { DashboardSalesDonut } from '@/components/organisms/DashboardSalesDonut';

export const dynamic = 'force-dynamic';

const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE ?? 'UTC';

const formatDateForApi = (value: Date) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
};

export default async function Home() {
  const now = new Date();

  // 1. Total Productos
  const productsReq = productsService.getProducts().catch(() => []);

  // 2. Ventas hoy
  const salesReq = salesService.getSales().catch(() => [] as Sale[]);

  // 3. Stock crítico
  const inventoryReq = inventoryService.getInventory().catch(() => []);

  // 4. Top 5 semana
  const monday = new Date(now);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const fromStr = formatDateForApi(monday);
  const toStr = formatDateForApi(now);

  const reportsReq = reportsService
    .getTopProducts({
      from: fromStr,
      to: toStr,
      limit: 5,
    })
    .catch(() => [] as TopProductReportItem[]);

  const [products, sales, inventory, topProducts] = await Promise.all([
    productsReq,
    salesReq,
    inventoryReq,
    reportsReq,
  ]);

  // Cálculos
  const totalProducts = products.length;

  // Ventas de hoy: filtrar por zona horaria configurada
  const todayFormatted = formatDateForApi(new Date());

  const todaySales = sales.filter((s: Sale) => {
    const saleDateStr = formatDateForApi(new Date(s.soldAt));
    return saleDateStr === todayFormatted;
  });

  const todaySalesTotal = todaySales.reduce(
    (acc: number, sale: Sale) => acc + Number(sale.total),
    0
  );

  const salesTodayByBranch = BRANCHES.map((branchName, index) => {
    const branchId = index + 1;
    const total = todaySales
      .filter((sale: Sale) => sale.branchId === branchId)
      .reduce((acc: number, sale: Sale) => acc + Number(sale.total), 0);

    return {
      branchName,
      total,
    };
  });

  // Stock critico: producto donde ALGUNA sucursal tenga < 5.
  // Contar productos únicos
  const criticalItems = inventory.filter((item) => item.stock < 5);
  const uniqueCriticalProducts = new Set(
    criticalItems.map((item) => item.productId)
  ).size;

  return (
    <PageTransition>
      <PageLead
        kicker="Operational Ledger"
        title="Dashboard de control"
        description="Visibilidad operativa en tiempo real para catálogo, ventas e inventario crítico."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <LedgerPanel className="glass-kpi">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Total catálogo</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{totalProducts}</p>
        </LedgerPanel>

        <LedgerPanel className="glass-kpi">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Ventas de hoy</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-success">{formatCurrency(todaySalesTotal)}</p>
        </LedgerPanel>

        <LedgerPanel className="glass-kpi">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Stock crítico</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-danger">{uniqueCriticalProducts}</p>
        </LedgerPanel>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <LedgerPanel className="min-w-0 md:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Top 5 más vendidos</h2>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Semana actual</p>
          </div>

          {topProducts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/80 p-4 text-sm text-muted-foreground">
              No hay ventas registradas esta semana.
            </p>
          ) : (
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow className="operational-table-head-row">
                    <TableHead className="operational-table-head-cell">Producto</TableHead>
                    <TableHead className="operational-table-head-cell">Sucursal</TableHead>
                    <TableHead className="operational-table-head-cell text-right">Cant. Vendida</TableHead>
                    <TableHead className="operational-table-head-cell text-right">Ingreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p) => (
                    <TableRow key={`${p.productId}-${p.branchId}`}>
                      <TableCell className="max-w-[220px] truncate font-medium">{p.productName}</TableCell>
                      <TableCell>{p.branchName}</TableCell>
                      <TableCell className="text-right">{p.quantitySold}</TableCell>
                      <TableCell className="text-right">{formatCurrency(Number(p.totalSold))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Ir a Catálogo
            </Link>
            <Link
              href="/sales"
              className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Ir a Ventas
            </Link>
          </div>
        </LedgerPanel>

        <LedgerPanel>
          <DashboardSalesDonut items={salesTodayByBranch} total={todaySalesTotal} />
        </LedgerPanel>
      </section>
    </PageTransition>
  );
}
