import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const repositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    repositoryMock.create.mockReturnValue(category);
    repositoryMock.save.mockResolvedValue(category);

    const result = await service.create(dto);

    expect(repositoryMock.create).toHaveBeenCalledWith(dto);
    expect(repositoryMock.save).toHaveBeenCalledWith(category);
    expect(result).toEqual(category);
  });

  it('should find all categories', async () => {
    const categories = [
      {
        id: 1,
        name: 'Bebidas',
      },
    ];

    repositoryMock.find.mockResolvedValue(categories);

    const result = await service.findAll();

    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(categories);
  });

  it('should find a category by id', async () => {
    const category = {
      id: 1,
      name: 'Bebidas',
    };

    repositoryMock.findOne.mockResolvedValue(category);

    const result = await service.findOne(1);

    expect(repositoryMock.findOne).toHaveBeenCalled();
    expect(result).toEqual(category);
  });
});