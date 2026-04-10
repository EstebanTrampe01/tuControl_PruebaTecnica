import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MaxLength(150, { message: 'El nombre debe tener como máximo 150 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  description?: string | null;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número válido con hasta 2 decimales.' },
  )
  @Min(0, { message: 'El precio no puede ser menor que 0.' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'La URL de imagen debe ser texto.' })
  @MaxLength(500, {
    message: 'La URL de imagen debe tener como máximo 500 caracteres.',
  })
  imageUrl?: string | null;

  @IsOptional()
  @IsInt({ message: 'La categoría debe ser un identificador numérico.' })
  @Min(1, { message: 'La categoría debe ser válida.' })
  categoryId?: number;
}
