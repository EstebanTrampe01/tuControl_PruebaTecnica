import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SalesRepository } from './sales.repository';
import { SalesService } from './sales.service';

describe('SalesService', () => {
  let service: SalesService;

  const tx = {
    findBranchById: jest.fn(),
    findProductsByIds: jest.fn(),
    lockInventoryRows: jest.fn(),
    createSale: jest.fn(),
    createSaleItem: jest.fn(),
    saveInventory: jest.fn(),
  };

  const salesRepository = {
    findAllRows: jest.fn(),
    runInTransaction: jest.fn((callback: (client: typeof tx) => unknown) =>
      callback(tx),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: SalesRepository,
          useValue: salesRepository,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  it('lanza error cuando el payload tiene productos duplicados', async () => {
    await expect(
      service.create({
        branchId: 1,
        items: [
          { productId: 1, quantity: 1 },
          { productId: 1, quantity: 2 },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(salesRepository.runInTransaction).not.toHaveBeenCalled();
  });

  it('lanza error cuando la sucursal no existe', async () => {
    tx.findBranchById.mockResolvedValueOnce(null);

    await expect(
      service.create({
        branchId: 99,
        items: [{ productId: 1, quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza error cuando el stock es insuficiente', async () => {
    tx.findBranchById.mockResolvedValueOnce({ id: 1, name: 'Centro' });
    tx.findProductsByIds.mockResolvedValueOnce([{ id: 1, price: '149.90' }]);
    tx.lockInventoryRows.mockResolvedValueOnce([
      { productId: 1, branchId: 1, stock: 0 },
    ]);

    await expect(
      service.create({
        branchId: 1,
        items: [{ productId: 1, quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('crea la venta y actualiza inventario dentro de una transaccion', async () => {
    const soldAt = new Date('2026-01-01T10:00:00.000Z');

    tx.findBranchById.mockResolvedValueOnce({ id: 1, name: 'Centro' });
    tx.findProductsByIds.mockResolvedValueOnce([{ id: 1, price: '149.90' }]);
    tx.lockInventoryRows.mockResolvedValueOnce([
      { productId: 1, branchId: 1, stock: 5 },
    ]);
    tx.createSale.mockResolvedValueOnce({
      id: 10,
      branchId: 1,
      soldAt,
    });
    tx.createSaleItem.mockResolvedValue(undefined);
    tx.saveInventory.mockImplementationOnce((value: unknown) => value);

    const result = await service.create({
      branchId: 1,
      items: [{ productId: 1, quantity: 2 }],
    });

    expect(result).toMatchObject({
      id: 10,
      branchId: 1,
      soldAt,
      total: 299.8,
      items: [
        {
          productId: 1,
          quantity: 2,
          unitPrice: 149.9,
          lineTotal: 299.8,
        },
      ],
    });
    expect(tx.createSaleItem).toHaveBeenCalledTimes(1);
    expect(tx.saveInventory).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 1,
        branchId: 1,
        stock: 3,
      }),
    );
  });
});
