import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportsDao } from './reports.dao';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const reportsDao = {
    getTopProducts: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: ReportsDao,
          useValue: reportsDao,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('lanza error cuando "from" es mayor que "to"', async () => {
    expect(() =>
      service.getTopProducts({
        from: '2026-04-10T23:59:59.999Z',
        to: '2026-04-08T00:00:00.000Z',
      }),
    ).toThrow(BadRequestException);

    expect(reportsDao.getTopProducts).not.toHaveBeenCalled();
  });

  it('usa el limite por defecto cuando no se envia', async () => {
    reportsDao.getTopProducts.mockResolvedValueOnce([]);

    await service.getTopProducts({
      from: '2026-04-08T00:00:00.000Z',
      to: '2026-04-10T23:59:59.999Z',
    });

    expect(reportsDao.getTopProducts).toHaveBeenCalledWith({
      from: '2026-04-08T00:00:00.000Z',
      to: '2026-04-10T23:59:59.999Z',
      branchId: undefined,
      limit: 1,
    });
  });

  it('aplica tope maximo de 100 al "limit"', async () => {
    reportsDao.getTopProducts.mockResolvedValueOnce([]);

    await service.getTopProducts({
      from: '2026-04-08T00:00:00.000Z',
      to: '2026-04-10T23:59:59.999Z',
      branchId: 1,
      limit: 1000,
    });

    expect(reportsDao.getTopProducts).toHaveBeenCalledWith({
      from: '2026-04-08T00:00:00.000Z',
      to: '2026-04-10T23:59:59.999Z',
      branchId: 1,
      limit: 100,
    });
  });
});
