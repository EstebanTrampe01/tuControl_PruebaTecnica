'use client';

import { formatCurrency } from '@/lib/utils';
import { TopProductReportItem } from '@/types/report.type';

interface ReportsBarsProps {
  items: TopProductReportItem[];
}

type BranchTotal = {
  branchName: string;
  total: number;
};

export function ReportsBars({ items }: ReportsBarsProps) {
  const totalsByBranch = items.reduce<Map<string, number>>((acc, item) => {
    const current = acc.get(item.branchName) ?? 0;
    acc.set(item.branchName, current + Number(item.totalSold));
    return acc;
  }, new Map());

  const rows: BranchTotal[] = Array.from(totalsByBranch.entries())
    .map(([branchName, total]) => ({ branchName, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (rows.length === 0) return null;

  const maxTotal = rows[0]?.total || 1;

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Total vendido por sucursal
      </p>

      {rows.map((row) => {
        const percentage = Math.max(6, Math.round((row.total / maxTotal) * 100));

        return (
          <div key={row.branchName} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-foreground">{row.branchName}</span>
              <span className="text-muted-foreground">{formatCurrency(row.total)}</span>
            </div>

            <div className="h-2.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
