'use client';

import * as React from 'react';
import { Button } from '@/components/atoms/Button';
import { SaleItem } from '@/components/molecules/SaleItem';
import { Badge } from '@/components/atoms/Badge';
import { BRANCHES } from '@/constants';
import { Product } from '@/types/product.type';
import { SaleCartItem } from '@/types/sale.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SaleFormProps {
  products: Product[];
  selectedBranchId: string;
  searchTerm: string;
  cart: SaleCartItem[];
  isSubmitting: boolean;
  onBranchChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onAddProduct: (productId: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onSubmit: () => void;
  getAvailableStock: (productId: number, branchId: number) => number;
}

export function SaleForm({
  products,
  selectedBranchId,
  searchTerm,
  cart,
  isSubmitting,
  onBranchChange,
  onSearchChange,
  onAddProduct,
  onQuantityChange,
  onRemoveItem,
  onSubmit,
  getAvailableStock,
}: SaleFormProps) {
  const selectedBranchNumber = Number.parseInt(selectedBranchId, 10);

  const filteredProducts = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products.slice(0, 8);

    return products
      .filter((product) => product.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [products, searchTerm]);

  const productMap = React.useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const hasInsufficientStock =
    selectedBranchId !== '' &&
    cart.some((item) => item.quantity > getAvailableStock(item.productId, selectedBranchNumber));

  const isSubmitDisabled =
    isSubmitting || selectedBranchId === '' || cart.length === 0 || hasInsufficientStock;

  return (
    <div className="ledger-panel">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sale-branch">Sucursal</Label>
          <Select value={selectedBranchId} onValueChange={onBranchChange}>
            <SelectTrigger id="sale-branch" className="w-full">
              <SelectValue placeholder="Selecciona una sucursal" />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((branch, index) => (
                <SelectItem key={branch} value={String(index + 1)}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sale-search">Buscar producto</Label>
          <Input
            id="sale-search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ej: Mouse Gamer"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/80 bg-muted/20 p-3">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Resultados
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {filteredProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No se encontraron productos.</p>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                onClick={() => onAddProduct(product.id)}
                disabled={isSubmitting}
              >
                + {product.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {cart.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Aún no agregas productos al carrito.
          </p>
        ) : (
          cart.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) return null;

            const availableStock =
              selectedBranchId === ''
                ? 0
                : getAvailableStock(item.productId, selectedBranchNumber);

            return (
              <SaleItem
                key={item.productId}
                productId={item.productId}
                productName={product.name}
                unitPrice={Number(product.price)}
                quantity={item.quantity}
                availableStock={availableStock}
                onQuantityChange={(value) => onQuantityChange(item.productId, value)}
                onRemove={() => onRemoveItem(item.productId)}
                disabled={isSubmitting}
              />
            );
          })
        )}
      </div>

      {selectedBranchId === '' && cart.length > 0 && (
        <p className="mt-3 text-sm text-warning">Selecciona una sucursal para validar stock.</p>
      )}

      {hasInsufficientStock && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <Badge variant="danger">Atención</Badge>
          <span>Hay productos con stock insuficiente para la cantidad seleccionada.</span>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <Button
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitDisabled}
          className="bg-amber-500 text-white hover:bg-amber-600"
        >
          Confirmar venta
        </Button>
      </div>
    </div>
  );
}
