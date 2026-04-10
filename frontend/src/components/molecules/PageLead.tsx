import * as React from 'react';

interface PageLeadProps {
  kicker: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function PageLead({ kicker, title, description, actions }: PageLeadProps) {
  return (
    <header className="glass-soft relative mb-6 overflow-hidden rounded-2xl border px-4 py-6 md:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(249,115,22,0.26),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(113,113,122,0.22),transparent_40%)]" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="section-kicker">
            <span className="status-dot" aria-hidden="true" />
            {kicker}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">{title}</h1>
          <p className="max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">{description}</p>
        </div>

        <div className="flex items-center gap-4">
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
