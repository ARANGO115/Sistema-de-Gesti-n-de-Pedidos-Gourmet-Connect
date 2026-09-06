import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const productsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(
      ProductsController,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = {
      name: 'Jugo Natural',
      description: 'Jugo natural de frutas',
      price: 8000,
      stock: 20,
      isAvailable: true,
      categoryId: 1,
    };

    const product = {
      id: 1,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      isAvailable: dto.isAvailable,
      category: {
        id: 1,
        name: 'Bebidas',
      },
    };

    productsServiceMock.create.mockResolvedValue(product);

    const result = await controller.create(dto);

    expect(productsServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(product);
  });

  it('should find all products', async () => {
    const products = [
      {
        id: 1,
        name: 'Jugo Natural',
      },
    ];

    productsServiceMock.findAll.mockResolvedValue(products);

    const result = await controller.findAll();

    expect(productsServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(products);
  });

  it('should find a product by id', async () => {
    const product = {
      id: 1,
      name: 'Jugo Natural',
    };

    productsServiceMock.findOne.mockResolvedValue(product);

    const result = await controller.findOne(1);

    expect(productsServiceMock.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(product);
  });
});