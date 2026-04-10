'use client';

import * as React from 'react';
import { PageTransition } from '@/components/atoms/PageTransition';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { InventoryGrid } from '@/components/organisms/InventoryGrid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BRANCHES, getStockLevel } from '@/constants';
import { PageLead } from '@/components/molecules/PageLead';
import { inventoryService } from '@/services/inventory.service';
import { productsService } from '@/services/products.service';
import { ApiError } from '@/services/api';
import { InventoryItem, InventoryMatrixRow } from '@/types/inventory.type';
import { Product } from '@/types/product.type';
import { toast } from 'sonner';
import { LedgerPanel } from '@/components/templates/LedgerPanel';
import { SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NumberStepper } from '@/components/molecules/NumberStepper';

type EditingCell = {
  productId: number;
  productName: string;
  branchId: number;
  branchName: string;
  stock: number;
};

const buildInventoryRows = (
  products: Product[],
  inventory: InventoryItem[]
): InventoryMatrixRow[] => {
  const inventoryByKey = new Map<string, number>();

  for (const item of inventory) {
    inventoryByKey.set(`${item.productId}-${item.branchId}`, item.stock);
  }

  return products.map((product) => ({
    productId: product.id,
    productName: product.name,
    cells: BRANCHES.map((branchName, index) => {
      const branchId = index + 1;

      return {
        branchId,
        branchName,
        stock: inventoryByKey.get(`${product.id}-${branchId}`) ?? 0,
      };
    }),
  }));
};

export default function InventoryPage() {
  const [rows, setRows] = React.useState<InventoryMatrixRow[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [stockFilter, setStockFilter] = React.useState<'all' | 'high' | 'medium' | 'critical'>('all');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [editingCell, setEditingCell] = React.useState<EditingCell | null>(null);
  const [newStock, setNewStock] = React.useState('0');
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const loadInventory = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [products, inventory] = await Promise.all([
        productsService.getProducts(),
        inventoryService.getInventory(),
      ]);

      setRows(buildInventoryRows(products, inventory));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar inventario';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const handleEditCell = (cell: EditingCell) => {
    setEditingCell(cell);
    setNewStock(String(cell.stock));
    setFormError(null);
  };

  const handleCloseDialog = () => {
    if (saveLoading) return;
    setEditingCell(null);
    setFormError(null);
  };

  const handleSaveStock = async () => {
    if (!editingCell) return;

    const parsed = Number.parseInt(newStock, 10);

    if (!Number.isInteger(parsed) || parsed < 0) {
      setFormError('El stock debe ser un número entero mayor o igual a 0.');
      return;
    }

    try {
      setSaveLoading(true);
      setFormError(null);

      const updated = await inventoryService.updateInventory({
        productId: editingCell.productId,
        branchId: editingCell.branchId,
        stock: parsed,
      });

      setRows((prev) =>
        prev.map((row) => {
          if (row.productId !== updated.productId) return row;

          return {
            ...row,
            cells: row.cells.map((cell) =>
              cell.branchId === updated.branchId ? { ...cell, stock: updated.stock } : cell
            ),
          };
        })
      );

      toast.success('Stock actualizado correctamente.');
      setEditingCell(null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        toast.error(err.message);
      } else {
        const message = err instanceof Error ? err.message : 'Error al actualizar stock.';
        setFormError(message);
        toast.error(message);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const filteredRows = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const matchSearch = query.length === 0 || row.productName.toLowerCase().includes(query);
      if (!matchSearch) return false;

      if (stockFilter === 'all') return true;

      return row.cells.some((cell) => getStockLevel(cell.stock) === stockFilter);
    });
  }, [rows, searchTerm, stockFilter]);

  return (
    <PageTransition>
      <PageLead
        kicker="Stock Matrix"
        title="Inventario por sucursal"
        description="Ajusta existencias por producto con señales de riesgo operativo por cada sucursal."
      />

      <LedgerPanel>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="inventory-search">Buscar producto</Label>
            <Input
              id="inventory-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nombre del producto"
              disabled={isHydrated ? isLoading : undefined}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setStockFilter('all')}>
                Todos los niveles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStockFilter('high')}>
                Solo stock alto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStockFilter('medium')}>
                Solo stock medio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStockFilter('critical')}>
                Solo stock crítico
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="text-xs text-muted-foreground md:text-right">
            {filteredRows.length} de {rows.length} productos
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <p className="text-sm text-destructive">{loadError}</p>
            <Button variant="outline" onClick={() => void loadInventory()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <InventoryGrid
            rows={filteredRows}
            onEditCell={handleEditCell}
            emptyMessage={
              searchTerm.trim().length > 0
                ? 'No hay productos que coincidan con la búsqueda en inventario.'
                : 'No hay productos para mostrar inventario.'
            }
          />
        )}
      </LedgerPanel>

      <Dialog open={Boolean(editingCell)} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar stock</DialogTitle>
            <DialogDescription>
              {editingCell
                ? `${editingCell.productName} · ${editingCell.branchName}`
                : 'Selecciona una celda para editar.'}
            </DialogDescription>
          </DialogHeader>

          {editingCell && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p className="text-muted-foreground">Stock actual</p>
                <p className="mt-1 text-base font-semibold text-foreground">{editingCell.stock}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-stock">Nuevo stock</Label>
                <NumberStepper
                  id="new-stock"
                  min={0}
                  step={1}
                  value={newStock}
                  onChange={setNewStock}
                  disabled={saveLoading}
                  className="w-full"
                  inputClassName="w-auto flex-1"
                />
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={saveLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStock} isLoading={saveLoading} disabled={saveLoading}>
              Guardar ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
