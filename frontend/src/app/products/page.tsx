'use client';

import * as React from 'react';
import { PageTransition } from '@/components/atoms/PageTransition';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { ProductTable } from '@/components/organisms/ProductTable';
import { ProductForm } from '@/components/organisms/ProductForm';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { productsService } from '@/services/products.service';
import { ApiError } from '@/services/api';
import { Product, CreateProductDto } from '@/types/product.type';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  // ─── Estado local ─────────────────────────────────────
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Modal de formulario (crear / editar)
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);
  const [formLoading, setFormLoading] = React.useState(false);

  // Modal de confirmación (eliminar)
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

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
    void loadProducts();
  }, [loadProducts]);

  const handleRetry = () => {
    void loadProducts();
  };

  // ─── Handlers ──────────────────────────────────────────

  const handleOpenCreate = () => {
    setEditingProduct(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
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
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catálogo de Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los productos de NovaTech Store
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm dark:bg-[#162032] dark:border-[#1E3A5F]">
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
            products={products}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        )}
      </div>

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
