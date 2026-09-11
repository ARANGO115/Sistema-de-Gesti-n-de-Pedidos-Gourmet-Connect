import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const categoriesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: categoriesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a category', async () => {
    const dto = {
      name: 'Bebidas',
      description: 'Bebidas frías y calientes',
      isActive: true,
    };

    const category = {
      id: 1,
      ...dto,
    };

    categoriesServiceMock.create.mockResolvedValue(category);

    const result = await controller.create(dto);

    expect(categoriesServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(category);
  });

  it('should find all categories', async () => {
    const categories = [
      {
        id: 1,
        name: 'Bebidas',
      },
    ];

    categoriesServiceMock.findAll.mockResolvedValue(categories);

    const result = await controller.findAll();

    expect(categoriesServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(categories);
  });

  it('should find a category by id', async () => {
    const category = {
      id: 1,
      name: 'Bebidas',
    };

    categoriesServiceMock.findOne.mockResolvedValue(category);

    const result = await controller.findOne(1);

    expect(categoriesServiceMock.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(category);
  });
});
