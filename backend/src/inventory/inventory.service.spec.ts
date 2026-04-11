import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryRepository } from './inventory.repository';

describe('InventoryService', () => {
  let service: InventoryService;

  const inventoryRepository = {
    findAll: jest.fn(),
    findByProductAndBranch: jest.fn(),
    findProductById: jest.fn(),
    findBranchById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: InventoryRepository,
          useValue: inventoryRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('devuelve inventario ordenado y filtrado', async () => {
    inventoryRepository.findAll.mockResolvedValueOnce([]);

    await service.findAll({ branchId: 1, productId: 2 });

    expect(inventoryRepository.findAll).toHaveBeenCalledWith({
      branchId: 1,
      productId: 2,
    });
  });

  it('lanza error cuando el producto no existe', async () => {
    inventoryRepository.findProductById.mockResolvedValueOnce(null);
    inventoryRepository.findBranchById.mockResolvedValueOnce({ id: 1 });

    await expect(
      service.upsert({ productId: 1, branchId: 1, stock: 10 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza error cuando la sucursal no existe', async () => {
    inventoryRepository.findProductById.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.findBranchById.mockResolvedValueOnce(null);

    await expect(
      service.upsert({ productId: 1, branchId: 1, stock: 10 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('actualiza el registro de inventario existente', async () => {
    const existingInventory = { productId: 1, branchId: 1, stock: 5 };

    inventoryRepository.findProductById.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.findBranchById.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.findByProductAndBranch.mockResolvedValueOnce(
      existingInventory,
    );
    inventoryRepository.save.mockImplementationOnce((value: unknown) => value);

    const result = await service.upsert({
      productId: 1,
      branchId: 1,
      stock: 20,
    });

    expect(inventoryRepository.create).not.toHaveBeenCalled();
    expect(inventoryRepository.save).toHaveBeenCalledWith({
      productId: 1,
      branchId: 1,
      stock: 20,
    });
    expect(result).toMatchObject({ stock: 20 });
  });

  it('crea registro de inventario cuando no existe', async () => {
    inventoryRepository.findProductById.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.findBranchById.mockResolvedValueOnce({ id: 1 });
    inventoryRepository.findByProductAndBranch.mockResolvedValueOnce(null);
    inventoryRepository.create.mockImplementationOnce(
      (value: unknown) => value,
    );
    inventoryRepository.save.mockImplementationOnce((value: unknown) => value);

    const result = await service.upsert({
      productId: 1,
      branchId: 1,
      stock: 20,
    });

    expect(inventoryRepository.create).toHaveBeenCalledWith({
      productId: 1,
      branchId: 1,
      stock: 20,
    });
    expect(inventoryRepository.save).toHaveBeenCalled();
    expect(result).toMatchObject({ productId: 1, branchId: 1, stock: 20 });
  });
});
