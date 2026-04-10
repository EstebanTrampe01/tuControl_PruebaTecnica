'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Menu, Moon, Package, ReceiptText, Store, Sun, Warehouse, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
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
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isThemeAnimating, setIsThemeAnimating] = React.useState(false);
  const [themeReveal, setThemeReveal] = React.useState<{
    x: number;
    y: number;
    diameter: number;
    overlayColor: string;
  } | null>(null);
  const themeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const themeEndTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    return () => {
      if (themeEndTimerRef.current) clearTimeout(themeEndTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleThemeToggle = () => {
    const currentTheme = resolvedTheme ?? theme ?? 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (typeof window === 'undefined') {
      setTheme(nextTheme);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !themeButtonRef.current || isThemeAnimating) {
      setTheme(nextTheme);
      return;
    }

    const rect = themeButtonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const distances = [
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y),
    ];

    const radius = Math.max(...distances);
    const oldThemeColor = currentTheme === 'dark' ? '#0B0B0C' : '#FFFBF5';

    setIsThemeAnimating(true);
    setThemeReveal({
      x,
      y,
      diameter: radius * 2,
      overlayColor: oldThemeColor,
    });

    setTheme(nextTheme);

    themeEndTimerRef.current = setTimeout(() => {
      setThemeReveal(null);
      setIsThemeAnimating(false);
    }, 620);
  };

  return (
    <div className="min-h-screen bg-background">
      {themeReveal && (
        <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
          <motion.span
            className="absolute block rounded-full"
            style={{
              left: themeReveal.x,
              top: themeReveal.y,
              backgroundColor: 'transparent',
              boxShadow: `0 0 0 9999px ${themeReveal.overlayColor}`,
              transformOrigin: 'center',
            }}
            initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
            animate={{ width: themeReveal.diameter, height: themeReveal.diameter, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-orange-300/75 bg-orange-200/50 supports-backdrop-filter:backdrop-blur-md md:flex md:flex-col dark:border-zinc-800/80 dark:bg-zinc-900/55">
        <div className="border-b border-orange-300/70 px-5 py-5 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-600 p-2 text-white shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <div>
               <p className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-100">NovaTech Store</p>
               <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-orange-900/50 dark:text-zinc-400">
                Operations Console
              </p>
            </div>
          </div>
        </div>

        <div className="pt-7 pb-4">
          <p className="sidebar-section-label">Navegacion</p>
          <nav className="mt-3 flex flex-col gap-1.5 px-2.5">
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
        <div className="glass-nav sticky top-0 z-30 border-b border-slate-200/80 dark:border-zinc-800">
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
                  ref={themeButtonRef}
                  variant="secondary"
                  className="h-9 w-9 !border-transparent !bg-transparent p-2 shadow-none hover:!bg-primary-100 dark:hover:!bg-zinc-800"
                  onClick={handleThemeToggle}
                  disabled={isThemeAnimating}
                  aria-label="Toggle Theme"
                >
                  {(resolvedTheme ?? theme) === 'dark' ? (
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

          <aside className="relative h-full w-[260px] border-r border-orange-300/80 bg-orange-200/70 p-2.5 supports-backdrop-filter:backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70">
            <div className="border-b border-orange-300/70 px-3.5 py-4 dark:border-zinc-800/80">
              <p className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-100">NovaTech Store</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-orange-900/50 dark:text-zinc-400">
                Operations Console
              </p>
            </div>

            <p className="sidebar-section-label mt-5">Navegacion</p>
            <nav className="mt-3 flex flex-col gap-1.5 px-1">
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
