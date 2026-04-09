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
import { BRANCHES } from '@/constants';
import { inventoryService } from '@/services/inventory.service';
import { productsService } from '@/services/products.service';
import { ApiError } from '@/services/api';
import { InventoryItem, InventoryMatrixRow } from '@/types/inventory.type';
import { Product } from '@/types/product.type';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = React.useState(true);
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

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Inventario por sucursal</h1>
        <p className="text-sm text-muted-foreground">
          Ajusta existencias por producto y sucursal sin recargar la página.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-[#1E3A5F] dark:bg-[#162032]">
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
          <InventoryGrid rows={rows} onEditCell={handleEditCell} />
        )}
      </div>

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
                <Input
                  id="new-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={newStock}
                  onChange={(event) => setNewStock(event.target.value)}
                  disabled={saveLoading}
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
