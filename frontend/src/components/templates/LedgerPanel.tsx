import * as React from 'react';
import { cn } from '@/lib/utils';

interface LedgerPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function LedgerPanel({ children, className }: LedgerPanelProps) {
  return <section className={cn('ledger-panel', className)}>{children}</section>;
}
