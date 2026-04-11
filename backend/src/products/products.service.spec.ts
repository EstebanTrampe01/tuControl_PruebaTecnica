import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const productsRepository = {
    findAll: jest.fn(),
    findActiveById: jest.fn(),
    findById: jest.fn(),
    findCategoryById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDeleteById: jest.fn(),
    hardDeleteById: jest.fn(),
    deleteInventoryByProductId: jest.fn(),
    countSaleUsage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: productsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('devuelve todos los productos ordenados por su id', async () => {
    productsRepository.findAll.mockResolvedValueOnce([]);

    await service.findAll();

    expect(productsRepository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('devuelve productos filtrados por su categoria', async () => {
    productsRepository.findAll.mockResolvedValueOnce([]);

    await service.findAll(2);

    expect(productsRepository.findAll).toHaveBeenCalledWith(2);
  });

  it('lanza error cuando la categoria no existe', async () => {
    productsRepository.findCategoryById.mockResolvedValueOnce(null);

    await expect(
      service.create({
        name: 'Mouse Gamer X1',
        description: 'Mouse inalambrico',
        price: 149.9,
        categoryId: 999,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(productsRepository.create).not.toHaveBeenCalled();
    expect(productsRepository.save).not.toHaveBeenCalled();
  });

  it('crea un producto con campos normalizados', async () => {
    productsRepository.findCategoryById.mockResolvedValueOnce({ id: 2 });
    productsRepository.create.mockImplementationOnce((value: unknown) => value);
    productsRepository.save.mockImplementationOnce((value: unknown) => value);

    const result = await service.create({
      name: 'Mouse Gamer X1',
      description: 'Mouse inalambrico',
      price: 149.9,
      categoryId: 2,
    });

    expect(productsRepository.create).toHaveBeenCalledWith({
      name: 'Mouse Gamer X1',
      description: 'Mouse inalambrico',
      price: '149.90',
      imageUrl: null,
      categoryId: 2,
    });
    expect(productsRepository.save).toHaveBeenCalled();
    expect(result).toMatchObject({
      name: 'Mouse Gamer X1',
      price: '149.90',
      categoryId: 2,
    });
  });

  it('actualiza un producto existente', async () => {
    productsRepository.findActiveById.mockResolvedValueOnce({
      id: 1,
      name: 'Mouse Gamer X1',
      description: 'Mouse inalambrico',
      price: '149.90',
      imageUrl: null,
      categoryId: 2,
    });
    productsRepository.findCategoryById.mockResolvedValueOnce({ id: 3 });
    productsRepository.save.mockImplementationOnce((value: unknown) => value);

    const result = await service.update(1, {
      name: 'Mouse Gamer X2',
      price: 199.5,
      categoryId: 3,
    });

    expect(result).toMatchObject({
      id: 1,
      name: 'Mouse Gamer X2',
      price: '199.50',
      categoryId: 3,
    });
  });

  it('lanza error al actualizar un producto inexistente', async () => {
    productsRepository.findActiveById.mockResolvedValueOnce(null);

    await expect(service.update(999, { name: 'Nuevo' })).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(productsRepository.save).not.toHaveBeenCalled();
  });

  it('lanza error al actualizar con categoria inexistente', async () => {
    productsRepository.findActiveById.mockResolvedValueOnce({
      id: 1,
      name: 'Mouse Gamer X1',
      description: null,
      price: '149.90',
      imageUrl: null,
      categoryId: 2,
    });
    productsRepository.findCategoryById.mockResolvedValueOnce(null);

    await expect(service.update(1, { categoryId: 999 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('elimina un producto sin referencias', async () => {
    productsRepository.findById.mockResolvedValueOnce({
      id: 1,
      deletedAt: null,
    });
    productsRepository.countSaleUsage.mockResolvedValueOnce(0);
    productsRepository.hardDeleteById.mockResolvedValueOnce({ affected: 1 });
    productsRepository.deleteInventoryByProductId.mockResolvedValueOnce({
      affected: 0,
    });

    await expect(service.remove(1)).resolves.toEqual({
      id: 1,
      deleted: true,
      mode: 'hard',
    });
    expect(productsRepository.deleteInventoryByProductId).toHaveBeenCalledWith(
      1,
    );
    expect(productsRepository.hardDeleteById).toHaveBeenCalledWith(1);
  });

  it('aplica soft delete cuando tiene ventas asociadas', async () => {
    productsRepository.findById.mockResolvedValueOnce({
      id: 1,
      deletedAt: null,
    });
    productsRepository.countSaleUsage.mockResolvedValueOnce(2);
    productsRepository.softDeleteById.mockResolvedValueOnce({ affected: 1 });

    await expect(service.remove(1)).resolves.toEqual({
      id: 1,
      deleted: true,
      mode: 'soft',
    });
    expect(productsRepository.softDeleteById).toHaveBeenCalled();
    expect(productsRepository.hardDeleteById).not.toHaveBeenCalled();
  });

  it('responde idempotente si ya estaba soft-deleted', async () => {
    productsRepository.findById.mockResolvedValueOnce({
      id: 1,
      deletedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await expect(service.remove(1)).resolves.toEqual({
      id: 1,
      deleted: true,
      mode: 'soft',
      alreadyDeleted: true,
    });

    expect(productsRepository.hardDeleteById).not.toHaveBeenCalled();
    expect(productsRepository.softDeleteById).not.toHaveBeenCalled();
  });

  it('lanza error al eliminar un producto inexistente', async () => {
    productsRepository.findById.mockResolvedValueOnce(null);

    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
    expect(productsRepository.hardDeleteById).not.toHaveBeenCalled();
  });
});
