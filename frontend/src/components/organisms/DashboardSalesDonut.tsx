'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

type SalesSlice = {
  branchName: string;
  total: number;
};

interface DashboardSalesDonutProps {
  items: SalesSlice[];
  total: number;
}

const COLORS = ['#EA580C', '#FB923C', '#FDBA74'];

export function DashboardSalesDonut({ items, total }: DashboardSalesDonutProps) {
  const prefersReducedMotion = useReducedMotion();
  const circumference = 2 * Math.PI * 42;

  const slices = React.useMemo(() => {
    if (total <= 0) {
      return items.map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
        percentage: 0,
        strokeLength: 0,
        strokeOffset: 0,
      }));
    }

    let cumulative = 0;

    return items.map((item, index) => {
      const percentage = (item.total / total) * 100;
      const strokeLength = (percentage / 100) * circumference;
      const strokeOffset = -cumulative;

      cumulative += strokeLength;

      return {
        ...item,
        color: COLORS[index % COLORS.length],
        percentage,
        strokeLength,
        strokeOffset,
      };
    });
  }, [circumference, items, total]);

  return (
    <motion.div
      className="donut-shell"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Ventas hoy por sucursal</p>

      <div className="mt-3">
        <div className="relative mx-auto aspect-square w-full max-w-[220px] sm:max-w-[240px]">
          <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
            <circle cx="56" cy="56" r="42" stroke="currentColor" strokeWidth="12" className="text-muted/80" fill="none" />

            {slices.map((slice, index) => (
              <motion.circle
                key={slice.branchName}
                className="donut-segment"
                cx="56"
                cy="56"
                r="42"
                fill="none"
                stroke={slice.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDashoffset={slice.strokeOffset}
                initial={
                  prefersReducedMotion
                    ? false
                    : { strokeDasharray: `0 ${circumference}` }
                }
                animate={{
                  strokeDasharray: `${slice.strokeLength} ${circumference - slice.strokeLength}`,
                }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: 'easeOut' }}
              />
            ))}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <span className="text-center text-[11px] font-semibold leading-tight text-foreground sm:text-xs">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="mt-4 min-w-0 space-y-2">
          {slices.map((slice, index) => (
            <motion.div
              key={slice.branchName}
              className="donut-legend-item flex min-w-0 items-center justify-between gap-2 text-xs"
              initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + index * 0.06, ease: 'easeOut' }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                <span className="truncate text-muted-foreground">{slice.branchName}</span>
              </div>
              <span className="shrink-0 font-medium text-foreground">{Math.round(slice.percentage)}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
