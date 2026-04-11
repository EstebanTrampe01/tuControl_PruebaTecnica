'use client';

import * as React from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NumberStepper } from '@/components/molecules/NumberStepper';
import { CATEGORIES } from '@/constants';
import { CreateProductDto, Product } from '@/types/product.type';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductDto) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProductForm({ initialData, onSubmit, isLoading, onCancel }: ProductFormProps) {
  const [name, setName] = React.useState(initialData?.name ?? '');
  const [description, setDescription] = React.useState(initialData?.description ?? '');
  const [price, setPrice] = React.useState(initialData?.price ?? '');
  const [imageUrl, setImageUrl] = React.useState(initialData?.imageUrl ?? '');
  const [categoryId, setCategoryId] = React.useState<string>(
    initialData?.categoryId?.toString() ?? ''
  );
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validaciones
    if (!name.trim()) {
      setFormError('El nombre es obligatorio.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }

    if (!categoryId) {
      setFormError('La categoría es obligatoria.');
      return;
    }

    if (imageUrl.trim() && !/^https?:\/\/.+/.test(imageUrl.trim())) {
      setFormError('La URL de la imagen debe comenzar con http:// o https://.');
      return;
    }

    const data: CreateProductDto = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: parsedPrice,
      imageUrl: imageUrl.trim() || undefined,
      categoryId: parseInt(categoryId, 10),
    };

    try {
      await onSubmit(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar el producto.';
      setFormError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="product-name">Nombre</Label>
        <Input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Teclado Mecánico RGB"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-category">Categoría</Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
        >
          <SelectTrigger id="product-category" className="w-full" disabled={isLoading}>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat, idx) => (
              <SelectItem key={cat} value={(idx + 1).toString()}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-price">Precio ($)</Label>
        <NumberStepper
          id="product-price"
          step={0.01}
          min={0}
          value={price}
          onChange={setPrice}
          disabled={isLoading}
          className="w-full"
          inputClassName="w-auto flex-1"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-image">URL de la Imagen (opcional)</Label>
        <Input
          id="product-image"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-description">Descripción (opcional)</Label>
        <Textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles adicionales del producto"
          rows={3}
          disabled={isLoading}
          className="resize-none"
        />
      </div>

      <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {initialData ? 'Guardar Cambios' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  );
}
