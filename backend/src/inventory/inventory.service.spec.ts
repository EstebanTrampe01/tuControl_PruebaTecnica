import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Branch } from '../branches/entities/branch.entity';
import { Product } from '../products/entities/product.entity';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';

describe('InventoryService', () => {
  let service: InventoryService;

  const inventoryRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const productsRepository = {
    findOneBy: jest.fn(),
  };

  const branchesRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: inventoryRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: productsRepository,
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: branchesRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('devuelve inventario ordenado y filtrado', async () => {
    inventoryRepository.find.mockResolvedValueOnce([]);

    await service.findAll({ branchId: 1, productId: 2 });

    expect(inventoryRepository.find).toHaveBeenCalledWith({
      where: { productId: 2, branchId: 1 },
      order: { productId: 'ASC', branchId: 'ASC' },
    });
  });

  it('lanza error cuando el producto no existe', async () => {
    productsRepository.findOneBy.mockResolvedValueOnce(null);
    branchesRepository.findOneBy.mockResolvedValueOnce({ id: 1 });

    await expect(
      service.upsert({ productId: 1, branchId: 1, stock: 10 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza error cuando la sucursal no existe', async () => {
    productsRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
    branchesRepository.findOneBy.mockResolvedValueOnce(null);

    await expect(
      service.upsert({ productId: 1, branchId: 1, stock: 10 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('actualiza el registro de inventario existente', async () => {
    const existingInventory = { productId: 1, branchId: 1, stock: 5 };

    productsRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
    branchesRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.findOneBy.mockResolvedValueOnce(existingInventory);
    inventoryRepository.save.mockImplementationOnce(async (value: unknown) => value);

    const result = await service.upsert({ productId: 1, branchId: 1, stock: 20 });

    expect(inventoryRepository.create).not.toHaveBeenCalled();
    expect(inventoryRepository.save).toHaveBeenCalledWith({
      productId: 1,
      branchId: 1,
      stock: 20,
    });
    expect(result).toMatchObject({ stock: 20 });
  });

  it('crea registro de inventario cuando no existe', async () => {
    productsRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
    branchesRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.findOneBy.mockResolvedValueOnce(null);
    inventoryRepository.create.mockImplementationOnce((value: unknown) => value);
    inventoryRepository.save.mockImplementationOnce(async (value: unknown) => value);

    const result = await service.upsert({ productId: 1, branchId: 1, stock: 20 });

    expect(inventoryRepository.create).toHaveBeenCalledWith({
      productId: 1,
      branchId: 1,
      stock: 20,
    });
    expect(inventoryRepository.save).toHaveBeenCalled();
    expect(result).toMatchObject({ productId: 1, branchId: 1, stock: 20 });
  });
});
