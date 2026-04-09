'use client';

import * as React from 'react';
import { PageTransition } from '@/components/atoms/PageTransition';
import { Spinner } from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import { SaleForm } from '@/components/organisms/SaleForm';
import { SaleList } from '@/components/organisms/SaleList';
import { productsService } from '@/services/products.service';
import { inventoryService } from '@/services/inventory.service';
import { salesService } from '@/services/sales.service';
import { ApiError } from '@/services/api';
import { InventoryItem } from '@/types/inventory.type';
import { Product } from '@/types/product.type';
import { Sale, SaleCartItem } from '@/types/sale.type';
import { toast } from 'sonner';

const getInventoryKey = (productId: number, branchId: number) => `${productId}-${branchId}`;

export default function SalesPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [selectedBranchId, setSelectedBranchId] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cart, setCart] = React.useState<SaleCartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadSalesData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [productsResponse, inventoryResponse, salesResponse] = await Promise.all([
        productsService.getProducts(),
        inventoryService.getInventory(),
        salesService.getSales(),
      ]);

      setProducts(productsResponse);
      setInventory(inventoryResponse);
      setSales(salesResponse);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar la sección de ventas.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadSalesData();
  }, [loadSalesData]);

  const inventoryMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const row of inventory) {
      map.set(getInventoryKey(row.productId, row.branchId), row.stock);
    }
    return map;
  }, [inventory]);

  const productNamesById = React.useMemo(() => {
    const names: Record<number, string> = {};
    for (const product of products) {
      names[product.id] = product.name;
    }
    return names;
  }, [products]);

  const getAvailableStock = React.useCallback(
    (productId: number, branchId: number) => {
      return inventoryMap.get(getInventoryKey(productId, branchId)) ?? 0;
    },
    [inventoryMap]
  );

  const handleAddProduct = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);

      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    const safeQuantity = Math.max(1, Number.isFinite(quantity) ? Math.trunc(quantity) : 1);

    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: safeQuantity } : item))
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const hasInsufficientStock = React.useMemo(() => {
    if (selectedBranchId === '') return true;

    const branchId = Number.parseInt(selectedBranchId, 10);

    return cart.some((item) => item.quantity > getAvailableStock(item.productId, branchId));
  }, [cart, getAvailableStock, selectedBranchId]);

  const handleSubmitSale = async () => {
    if (selectedBranchId === '' || cart.length === 0) return;
    if (hasInsufficientStock) {
      toast.error('No se puede confirmar: hay productos con stock insuficiente.');
      return;
    }

    const branchId = Number.parseInt(selectedBranchId, 10);

    try {
      setIsSubmitting(true);

      const createdSale = await salesService.createSale({
        branchId,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      setSales((prev) => [createdSale, ...prev]);

      setInventory((prev) => {
        const updated = [...prev];

        for (const cartItem of cart) {
          const idx = updated.findIndex(
            (row) => row.productId === cartItem.productId && row.branchId === branchId
          );

          if (idx >= 0) {
            const nextStock = Math.max(0, updated[idx].stock - cartItem.quantity);
            updated[idx] = {
              ...updated[idx],
              stock: nextStock,
            };
          } else {
            updated.push({
              productId: cartItem.productId,
              branchId,
              stock: 0,
            });
          }
        }

        return updated;
      });

      setCart([]);
      setSearchTerm('');
      toast.success('Venta registrada correctamente.');
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error('Stock insuficiente. Revisa las cantidades y vuelve a intentar.');
      } else {
        const message = err instanceof Error ? err.message : 'No se pudo registrar la venta.';
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Ventas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registra ventas y valida disponibilidad por sucursal en tiempo real.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-14 shadow-sm dark:border-[#1E3A5F] dark:bg-[#162032]">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card py-14 text-center shadow-sm dark:border-[#1E3A5F] dark:bg-[#162032]">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button variant="outline" onClick={() => void loadSalesData()}>
            Reintentar
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <SaleForm
            products={products}
            selectedBranchId={selectedBranchId}
            searchTerm={searchTerm}
            cart={cart}
            isSubmitting={isSubmitting}
            onBranchChange={setSelectedBranchId}
            onSearchChange={setSearchTerm}
            onAddProduct={handleAddProduct}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
            onSubmit={handleSubmitSale}
            getAvailableStock={getAvailableStock}
          />

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Ventas registradas</h2>
            <SaleList sales={sales} productNamesById={productNamesById} />
          </section>
        </div>
      )}
    </PageTransition>
  );
}
