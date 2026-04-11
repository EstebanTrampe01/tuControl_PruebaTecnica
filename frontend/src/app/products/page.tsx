'use client';

import * as React from 'react';
import { PageTransition } from '@/components/atoms/PageTransition';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { ProductTable } from '@/components/organisms/ProductTable';
import { ProductForm } from '@/components/organisms/ProductForm';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { ProductDetailsDialog } from '@/components/molecules/ProductDetailsDialog';
import { PageLead } from '@/components/molecules/PageLead';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { productsService } from '@/services/products.service';
import { ApiError } from '@/services/api';
import { Product, CreateProductDto } from '@/types/product.type';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { LedgerPanel } from '@/components/templates/LedgerPanel';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProductsPage() {
  // ─── Estado local ─────────────────────────────────────
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | number>('all');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Modal de formulario (crear / editar)
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);
  const [formLoading, setFormLoading] = React.useState(false);

  // Modal de confirmación (eliminar)
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Modal de detalles
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsProduct, setDetailsProduct] = React.useState<Product | null>(null);

  const loadProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar productos';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleRetry = () => {
    void loadProducts();
  };

  const filteredProducts = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchCategory =
        categoryFilter === 'all' || product.categoryId === categoryFilter;
      if (!matchCategory) return false;

      if (!query) return true;

      const category = (CATEGORIES[product.categoryId - 1] ?? '').toLowerCase();
      const description = (product.description ?? '').toLowerCase();

      return (
        product.name.toLowerCase().includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [categoryFilter, products, searchTerm]);

  // ─── Handlers ──────────────────────────────────────────

  const handleOpenCreate = () => {
    setEditingProduct(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleOpenDetails = (product: Product) => {
    setDetailsProduct(product);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setDetailsProduct(null);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleFormSubmit = async (data: CreateProductDto) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        // UPDATE — reemplazo por id
        const updated = await productsService.updateProduct(editingProduct.id, data);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success('Producto actualizado correctamente.');
      } else {
        // CREATE — append al array
        const created = await productsService.createProduct(data);
        setProducts((prev) => [...prev, created]);
        toast.success('Producto creado correctamente.');
      }
      handleCloseForm();
    } catch (err: unknown) {
      // Re-throw para que ProductForm lo capture y muestre inline
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeletingProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    try {
      await productsService.deleteProduct(deletingProduct.id);
      // DELETE — filter por id
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      toast.success('Producto eliminado correctamente.');
      handleCloseDelete();
    } catch (err: unknown) {
      // Contrato de errores: 409 = integridad referencial
      if (err instanceof ApiError && err.status === 409) {
        toast.error('No se puede eliminar porque tiene inventario o ventas asociadas.');
      } else {
        const message = err instanceof Error ? err.message : 'Error al eliminar el producto.';
        toast.error(message);
      }
      handleCloseDelete();
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────

  return (
    <PageTransition>
      <PageLead
        kicker="Catalog Control"
        title="Catálogo de productos"
        description="Administra altas, ajustes y bajas del catálogo compartido de NovaTech Store."
        actions={<Button onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nuevo Producto
        </Button>}
      />

      <LedgerPanel>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div className="space-y-1.5">
            <label htmlFor="products-search" className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Buscar producto
            </label>
            <Input
              id="products-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nombre, descripción o categoría"
              disabled={isHydrated ? isLoading : undefined}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-full md:w-auto">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                Todas las categorías
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {CATEGORIES.map((category, index) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setCategoryFilter(index + 1)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="text-xs text-muted-foreground md:text-right">
            {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-destructive mb-4">{loadError}</p>
            <Button
              variant="outline"
              onClick={handleRetry}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onView={handleOpenDetails}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            emptyMessage={
              searchTerm.trim().length > 0
                ? 'No hay productos que coincidan con la búsqueda.'
                : 'No hay productos registrados aún.'
            }
          />
        )}
      </LedgerPanel>

      <ProductDetailsDialog
        open={detailsOpen}
        product={detailsProduct}
        onClose={handleCloseDetails}
      />

      {/* Modal Crear / Editar */}
      <Dialog open={formOpen} onOpenChange={(nextOpen) => !nextOpen && handleCloseForm()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            key={editingProduct?.id ?? 'new'}
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            isLoading={formLoading}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Confirmar Eliminación */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        title="Eliminar producto"
        description={
          deletingProduct
            ? `¿Estás seguro de que deseas eliminar "${deletingProduct.name}"? Esta acción no se puede deshacer.`
            : 'Esta acción no se puede deshacer.'
        }
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
      />

    </PageTransition>
  );
}
