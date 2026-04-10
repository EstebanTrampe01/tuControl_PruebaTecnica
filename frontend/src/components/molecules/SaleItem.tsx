'use client';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { formatCurrency } from '@/lib/utils';
import { NumberStepper } from '@/components/molecules/NumberStepper';

interface SaleItemProps {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  availableStock: number;
  onQuantityChange: (value: number) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function SaleItem({
  productId,
  productName,
  unitPrice,
  quantity,
  availableStock,
  onQuantityChange,
  onRemove,
  disabled,
}: SaleItemProps) {
  const hasInsufficientStock = quantity > availableStock;

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{productName}</p>
          <p className="text-xs text-muted-foreground">Precio unitario: {formatCurrency(unitPrice)}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-8 px-2 text-xs"
          onClick={onRemove}
          disabled={disabled}
        >
          Quitar
        </Button>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Disponible:</span>
          <Badge
            variant={hasInsufficientStock ? 'danger' : availableStock === 0 ? 'warning' : 'success'}
          >
            {availableStock}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={`qty-${productId}`} className="text-xs text-muted-foreground">
            Cantidad
          </label>
          <NumberStepper
            id={`qty-${productId}`}
            min={1}
            step={1}
            value={quantity}
            onChange={(value) => onQuantityChange(Number.parseInt(value, 10) || 1)}
            className="w-auto"
            inputClassName="w-16"
            disabled={disabled}
          />
        </div>
      </div>

      {hasInsufficientStock && (
        <p className="mt-2 text-xs font-medium text-destructive">
          Stock insuficiente para esta cantidad.
        </p>
      )}
    </div>
  );
}
