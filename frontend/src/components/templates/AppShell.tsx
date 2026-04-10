'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Menu, Moon, Package, ReceiptText, Store, Sun, Warehouse, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Catalogo', href: '/products', icon: Package },
  { name: 'Inventario', href: '/inventory', icon: Warehouse },
  { name: 'Ventas', href: '/sales', icon: ReceiptText },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-slate-200 bg-white md:flex md:flex-col dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-slate-200 px-4 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-600 p-1.5 text-white">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">NovaTech Store</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-zinc-500">
                Operations Console
              </p>
            </div>
          </div>
        </div>

        <div className="py-4">
          <p className="sidebar-section-label">Navegacion</p>
          <nav className="mt-2 flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('sidebar-item', active && 'sidebar-item-active')}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="md:pl-[260px]">
        <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="h-9 w-9 !border-transparent !bg-transparent p-2 shadow-none hover:!bg-primary-100 dark:hover:!bg-zinc-800 md:hidden"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle Sidebar"
              >
                {mobileOpen ? <X className="h-4 w-4 text-muted-foreground" /> : <Menu className="h-4 w-4 text-muted-foreground" />}
              </Button>
              <span className="hidden text-xs uppercase tracking-[0.14em] text-slate-400 sm:inline dark:text-zinc-500">
                Retail Internal Tool
              </span>
            </div>

            <div className="flex items-center gap-3">
              {mounted && (
                <Button
                  variant="secondary"
                  className="h-9 w-9 !border-transparent !bg-transparent p-2 shadow-none hover:!bg-primary-100 dark:hover:!bg-zinc-800"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-secondary-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">{children}</main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/35"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menu"
          />

          <aside className="relative h-full w-[260px] border-r border-slate-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-slate-200 px-3 py-3 dark:border-zinc-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">NovaTech Store</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-zinc-500">
                Operations Console
              </p>
            </div>

            <p className="sidebar-section-label mt-3">Navegacion</p>
            <nav className="mt-2 flex flex-col gap-1 px-1">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('sidebar-item', active && 'sidebar-item-active')}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
