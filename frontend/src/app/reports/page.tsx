'use client';

import { PageTransition } from '@/components/atoms/PageTransition';
import { PageLead } from '@/components/molecules/PageLead';
import { LedgerPanel } from '@/components/templates/LedgerPanel';

export default function ReportsPage() {
  return (
    <PageTransition>
      <PageLead
        kicker="Reports Hub"
        title="Reportes comerciales"
        description="Esta vista queda preparada para la Fase 5 con filtros por rango y tabla de top productos por sucursal."
      />

      <LedgerPanel>
        <p className="text-sm text-muted-foreground">
          La implementación funcional del reporte se habilitará en la siguiente fase.
        </p>
      </LedgerPanel>
    </PageTransition>
  );
}
