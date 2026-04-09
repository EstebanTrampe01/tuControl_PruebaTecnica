import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const productsRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const categoriesRepository = {
    findOneBy: jest.fn(),
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
});
