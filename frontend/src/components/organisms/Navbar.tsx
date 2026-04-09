'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Package, BarChart3, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '../atoms/Button';

export const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Mounted check to avoid hydration mismatch on theme toggle
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Cierra el menú al cambiar de ruta
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Catálogo', href: '/products', icon: Package },
    { name: 'Inventario', href: '/inventory', icon: Store },
    { name: 'Ventas', href: '/sales', icon: Store },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary-200/50 bg-white/60 backdrop-blur-md dark:border-border dark:bg-background/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-foreground">
              NovaTech
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-secondary dark:text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-primary-50/50 hover:text-foreground dark:hover:bg-secondary/70'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="secondary"
              className="h-9 w-9 !border-transparent !bg-transparent p-2 shadow-none hover:!bg-primary-100 dark:hover:!bg-secondary"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-secondary-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </Button>
          )}

          {/* Mobile Menu Button */}
            <Button
              variant="secondary"
              className="h-9 w-9 !border-transparent !bg-transparent p-2 shadow-none hover:!bg-primary-100 dark:hover:!bg-secondary md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X className="h-4 w-4 text-muted-foreground" /> : <Menu className="h-4 w-4 text-muted-foreground" />}
            </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="absolute left-0 top-16 w-full border-t border-primary-200/50 bg-card shadow-lg dark:border-border dark:bg-background/95 md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-secondary dark:text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-primary-50/50 hover:text-foreground dark:hover:bg-secondary/70'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
