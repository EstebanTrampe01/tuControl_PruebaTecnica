import { PageTransition } from '@/components/atoms/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Stock critico: producto donde ALGUNA sucursal tenga < 5.
  // Contar productos únicos
  const criticalItems = inventory.filter((item) => item.stock < 5);
  const uniqueCriticalProducts = new Set(
    criticalItems.map((item) => item.productId)
  ).size;

  return (
    <PageTransition>
      <section className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total productos en catálogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ventas registradas hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(todaySalesTotal)}
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Productos con stock crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-danger">
              {uniqueCriticalProducts}
            </p>
          </CardContent>
        </Card>

        {/* Table Top 5 */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Top 5 más vendidos (Semana actual)</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No hay ventas registradas esta semana.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead className="text-right">Cant. Vendida</TableHead>
                    <TableHead className="text-right">Ingreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p) => (
                    <TableRow key={`${p.productId}-${p.branchId}`}>
                      <TableCell className="font-medium">
                        {p.productName}
                      </TableCell>
                      <TableCell>{p.branchName}</TableCell>
                      <TableCell className="text-right">
                        {p.quantitySold}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(p.totalSold))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="mt-6 flex gap-4">
              <Link
                href="/products"
                className="text-sm text-primary hover:underline"
              >
                Ir a Catálogo →
              </Link>
              <Link
                href="/sales"
                className="text-sm text-primary hover:underline"
              >
                Ir a Ventas →
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
