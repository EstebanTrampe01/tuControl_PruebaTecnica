import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { SalesService } from './sales.service';

describe('SalesService', () => {
  let service: SalesService;

  const dataSource = {
    transaction: jest.fn(),
  };

  const createManager = () => {
    const queryBuilder = {
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    const manager = {
      findOneBy: jest.fn(),
      findBy: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      create: jest.fn((_: unknown, payload: unknown) => payload),
      save: jest.fn(),
    };

    return { manager, queryBuilder };
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getDataSourceToken(),
          useValue: dataSource,
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

    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('lanza error cuando la sucursal no existe', async () => {
    const { manager } = createManager();
    manager.findOneBy.mockResolvedValueOnce(null);
    dataSource.transaction.mockImplementationOnce(
      async (callback: (m: typeof manager) => unknown) => callback(manager),
    );

    await expect(
      service.create({
        branchId: 99,
        items: [{ productId: 1, quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza error cuando el stock es insuficiente', async () => {
    const { manager, queryBuilder } = createManager();
    manager.findOneBy.mockResolvedValueOnce({ id: 1, name: 'Centro' });
    manager.findBy.mockResolvedValueOnce([{ id: 1, price: '149.90' }]);
    queryBuilder.getMany.mockResolvedValueOnce([
      { productId: 1, branchId: 1, stock: 0 },
    ]);
    dataSource.transaction.mockImplementationOnce(
      async (callback: (m: typeof manager) => unknown) => callback(manager),
    );

    await expect(
      service.create({
        branchId: 1,
        items: [{ productId: 1, quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('crea la venta y actualiza inventario dentro de una transaccion', async () => {
    const soldAt = new Date('2026-01-01T10:00:00.000Z');
    const { manager, queryBuilder } = createManager();

    manager.findOneBy.mockResolvedValueOnce({ id: 1, name: 'Centro' });
    manager.findBy.mockResolvedValueOnce([{ id: 1, price: '149.90' }]);
    queryBuilder.getMany.mockResolvedValueOnce([
      { productId: 1, branchId: 1, stock: 5 },
    ]);
    manager.save.mockImplementation(async (entity: Record<string, unknown>) => {
      if ('branchId' in entity && !('saleId' in entity)) {
        return { id: 10, branchId: entity.branchId, soldAt };
      }
      return entity;
    });

    dataSource.transaction.mockImplementationOnce(
      async (callback: (m: typeof manager) => unknown) => callback(manager),
    );

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
    expect(manager.save).toHaveBeenCalledTimes(3);
    expect((manager.save as jest.Mock).mock.calls[2][0]).toMatchObject({
      productId: 1,
      branchId: 1,
      stock: 3,
    });
  });
});
