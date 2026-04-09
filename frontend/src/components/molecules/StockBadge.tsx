'use client';

import { STOCK_COLORS, getStockLevel } from '@/constants';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
  stock: number;
  className?: string;
}

export function StockBadge({ stock, className }: StockBadgeProps) {
  const level = getStockLevel(stock);
  const palette = STOCK_COLORS[level];

  return (
    <span
      className={cn(
        'inline-flex min-w-12 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold',
        palette.bg,
        palette.text,
        className
      )}
    >
      {stock}
    </span>
  );
}
