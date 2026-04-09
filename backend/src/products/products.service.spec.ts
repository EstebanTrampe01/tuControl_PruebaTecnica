import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../categories/entities/category.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const productsRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const categoriesRepository = {
    findOneBy: jest.fn(),
  };

  const inventoryRepository = {
    countBy: jest.fn(),
  };

  const saleItemsRepository = {
    countBy: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productsRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoriesRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: inventoryRepository,
        },
        {
          provide: getRepositoryToken(SaleItem),
          useValue: saleItemsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('devuelve todos los productos ordenados por su id', async () => {
    productsRepository.find.mockResolvedValueOnce([]);

    await service.findAll();

    expect(productsRepository.find).toHaveBeenCalledWith({
      where: {},
      order: { id: 'ASC' },
    });
  });

  it('devuelve productos filtrados por su categoria', async () => {
    productsRepository.find.mockResolvedValueOnce([]);

    await service.findAll(2);

    expect(productsRepository.find).toHaveBeenCalledWith({
      where: { categoryId: 2 },
      order: { id: 'ASC' },
    });
  });

  it('lanza error cuando la categoria no existe', async () => {
    categoriesRepository.findOneBy.mockResolvedValueOnce(null);

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
    categoriesRepository.findOneBy.mockResolvedValueOnce({ id: 2 });
    productsRepository.create.mockImplementationOnce((value: unknown) => value);
    productsRepository.save.mockImplementationOnce(async (value: unknown) => value);

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
    productsRepository.findOneBy.mockResolvedValueOnce({
      id: 1,
      name: 'Mouse Gamer X1',
      description: 'Mouse inalambrico',
      price: '149.90',
      imageUrl: null,
      categoryId: 2,
    });
    categoriesRepository.findOneBy.mockResolvedValueOnce({ id: 3 });
    productsRepository.save.mockImplementationOnce(async (value: unknown) => value);

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
    productsRepository.findOneBy.mockResolvedValueOnce(null);

    await expect(service.update(999, { name: 'Nuevo' })).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(productsRepository.save).not.toHaveBeenCalled();
  });

  it('lanza error al actualizar con categoria inexistente', async () => {
    productsRepository.findOneBy.mockResolvedValueOnce({
      id: 1,
      name: 'Mouse Gamer X1',
      description: null,
      price: '149.90',
      imageUrl: null,
      categoryId: 2,
    });
    categoriesRepository.findOneBy.mockResolvedValueOnce(null);

    await expect(service.update(1, { categoryId: 999 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('elimina un producto sin referencias', async () => {
    productsRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.countBy.mockResolvedValueOnce(0);
    saleItemsRepository.countBy.mockResolvedValueOnce(0);
    productsRepository.delete.mockResolvedValueOnce({ affected: 1 });

    await expect(service.remove(1)).resolves.toEqual({ id: 1, deleted: true });
    expect(productsRepository.delete).toHaveBeenCalledWith(1);
  });

  it('rechaza eliminar un producto con referencias', async () => {
    productsRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.countBy.mockResolvedValueOnce(1);
    saleItemsRepository.countBy.mockResolvedValueOnce(0);

    await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
    expect(productsRepository.delete).not.toHaveBeenCalled();
  });

  it('lanza error al eliminar un producto inexistente', async () => {
    productsRepository.findOneBy.mockResolvedValueOnce(null);

    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
    expect(productsRepository.delete).not.toHaveBeenCalled();
  });
});
