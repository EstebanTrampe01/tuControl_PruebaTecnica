export const CATEGORIES = ['Laptops', 'Periféricos', 'Componentes'] as const;
export type Category = (typeof CATEGORIES)[number];

export const BRANCHES = ['Centro', 'Norte', 'Occidente'] as const;
export type Branch = (typeof BRANCHES)[number];

export const STOCK_COLORS = {
  high: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
  },
  medium: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
  },
} as const;

export const getStockLevel = (stock: number) => {
  if (stock >= 10) return 'high';
  if (stock >= 5) return 'medium';
  return 'critical';
};
