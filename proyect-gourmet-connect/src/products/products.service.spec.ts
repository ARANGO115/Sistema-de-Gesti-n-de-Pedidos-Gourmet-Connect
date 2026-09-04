import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { Product } from './entities/product.entity/product.entity';
import { Category } from 'src/categories/entities/category.entity/category.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const productRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const categoryRepositoryMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepositoryMock,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product with an existing category', async () => {
    const dto = {
      name: 'Jugo Natural',
      description: 'Jugo natural de frutas',
      price: 8000,
      stock: 20,
      isAvailable: true,
      categoryId: 1,
    };

    const category = {
      id: 1,
      name: 'Bebidas',
    };

    const product = {
      id: 1,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      isAvailable: dto.isAvailable,
      category,
    };

    categoryRepositoryMock.findOne.mockResolvedValue(category);
    productRepositoryMock.create.mockReturnValue(product);
    productRepositoryMock.save.mockResolvedValue(product);

    const result = await service.create(dto);

    expect(categoryRepositoryMock.findOne).toHaveBeenCalled();
    expect(productRepositoryMock.create).toHaveBeenCalled();
    expect(productRepositoryMock.save).toHaveBeenCalledWith(product);
    expect(result).toEqual(product);
  });

  it('should find all products', async () => {
    const products = [
      {
        id: 1,
        name: 'Jugo Natural',
      },
    ];

    productRepositoryMock.find.mockResolvedValue(products);

    const result = await service.findAll();

    expect(productRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(products);
  });

  it('should find a product by id', async () => {
    const product = {
      id: 1,
      name: 'Jugo Natural',
    };

    productRepositoryMock.findOne.mockResolvedValue(product);

    const result = await service.findOne(1);

    expect(productRepositoryMock.findOne).toHaveBeenCalled();
    expect(result).toEqual(product);
  });
});