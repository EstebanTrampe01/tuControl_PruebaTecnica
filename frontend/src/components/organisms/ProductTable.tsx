'use client';

import * as React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product.type';
import { CATEGORIES } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  emptyMessage?: string;
}

/**
 * ProductTable — organismo que lista productos en una tabla.
 * Columnas: Imagen, Nombre, Categoría, Precio, Acciones.
 * Usa Table de ui/ (ya instalado en el proyecto), atoms (Button, Badge).
 * Mobile-first: en pantallas pequeñas la tabla tiene overflow-x-auto (ya en Table).
 * No usa Framer Motion para tablas (regla de explicacion.md).
 */
export function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
  emptyMessage = 'No hay productos registrados aún.',
}: ProductTableProps) {
  const [failedImageIds, setFailedImageIds] = React.useState<Set<number>>(
    () => new Set()
  );

  const getCategoryName = (categoryId: number): string => {
    return CATEGORIES[categoryId - 1] ?? 'Desconocida';
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <path d="m21 16-4 4-4-4" />
            <path d="M17 20V4" />
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <Table className="[&_tbody_tr]:border-b-slate-100 [&_tbody_tr:hover]:bg-primary-50/60 dark:[&_tbody_tr]:border-zinc-800 dark:[&_tbody_tr:hover]:bg-zinc-800/60 [&_tr:last-child]:border-0">
      <TableHeader>
        <TableRow className="operational-table-head-row">
          <TableHead className="operational-table-head-cell w-16">Imagen</TableHead>
          <TableHead className="operational-table-head-cell">Nombre</TableHead>
          <TableHead className="operational-table-head-cell">Categoría</TableHead>
          <TableHead className="operational-table-head-cell text-right">Precio</TableHead>
          <TableHead className="operational-table-head-cell w-28 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.imageUrl && !failedImageIds.has(product.id) ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg border border-border object-cover"
                  onError={() => {
                    setFailedImageIds((prev) => {
                      const next = new Set(prev);
                      next.add(product.id);
                      return next;
                    });
                  }}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
            </TableCell>

            {/* Nombre + descripción */}
            <TableCell>
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                    {product.description}
                  </p>
                )}
              </div>
            </TableCell>

            {/* Categoría */}
            <TableCell>
              <Badge>{getCategoryName(product.categoryId)}</Badge>
            </TableCell>

            {/* Precio */}
            <TableCell className="text-right font-medium">
              {formatCurrency(Number(product.price))}
            </TableCell>

            {/* Acciones */}
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Acciones de ${product.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(product)}>
                    <Eye className="h-4 w-4" />
                    Detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Pencil className="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
