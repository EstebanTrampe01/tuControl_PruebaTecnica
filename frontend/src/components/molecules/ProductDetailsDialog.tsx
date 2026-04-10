'use client';

import * as React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/atoms/Badge';
import { CATEGORIES } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/product.type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductDetailsDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsDialog({ open, product, onClose }: ProductDetailsDialogProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    setImageFailed(false);
  }, [product?.id, open]);

  if (!product) return null;

  const category = CATEGORIES[product.categoryId - 1] ?? 'Desconocida';

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles del producto</DialogTitle>
          <DialogDescription>
            Vista detallada para revisión de catálogo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl border border-border bg-muted/25 p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              {product.imageUrl && !imageFailed ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  Sin imagen disponible
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Nombre</p>
              <p className="mt-1 text-base font-semibold text-foreground">{product.name}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Categoría</p>
              <div className="mt-1">
                <Badge>{category}</Badge>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Precio</p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatCurrency(Number(product.price))}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 sm:col-span-2 md:col-span-1">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Descripción</p>
              <div className="mt-1 max-h-28 overflow-y-auto pr-1 text-sm text-foreground/90">
                {product.description?.trim() || 'Sin descripción registrada.'}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
