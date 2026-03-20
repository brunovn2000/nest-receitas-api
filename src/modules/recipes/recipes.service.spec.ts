import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipeEntity } from './entities/recipe.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { UserEntity } from '../users/entities/user.entity';

describe('RecipesService', () => {
  let service: RecipesService;
  let recipesRepository: Repository<RecipeEntity>;
  let categoriesRepository: Repository<CategoryEntity>;
  let configService: ConfigService;

  const mockRecipesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategoriesRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: mockRecipesRepository,
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: mockCategoriesRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    recipesRepository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));
    categoriesRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve criar e retornar uma receita', async () => {
      const userId = 1;
      const dto = { nome: 'Pasta', categoryId: 1, modoPreparo: 'Cook it', ingredientes: 'Paste, water' };
      const createdRecipe = { id: 1, ...dto, usuario: { id: userId } as UserEntity };
      
      mockRecipesRepository.create.mockReturnValue(createdRecipe);
      mockRecipesRepository.save.mockResolvedValue(createdRecipe);
      mockConfigService.get.mockReturnValue('http://localhost:3001');

      const result = await service.create(userId, dto as any);

      expect(mockRecipesRepository.create).toHaveBeenCalled();
      expect(mockRecipesRepository.save).toHaveBeenCalledWith(createdRecipe);
      expect(result).toHaveProperty('id', 1);
      expect(result.nome).toBe('Pasta');
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar receitas de um usuário', async () => {
      const userId = 1;
      const recipes = [{ id: 1, nome: 'Pasta', usuario: { id: userId } as UserEntity }];
      
      mockRecipesRepository.find.mockResolvedValue(recipes);
      mockConfigService.get.mockReturnValue('http://localhost:3001');

      const result = await service.findAllByUser(userId);

      expect(mockRecipesRepository.find).toHaveBeenCalledWith({
        where: { usuario: { id: userId } },
        relations: ['categoria', 'usuario'],
        order: { id: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });

    it('deve filtrar receitas por termo de busca', async () => {
      const userId = 1;
      const search = 'pasta';
      mockRecipesRepository.find.mockResolvedValue([]);

      await service.findAllByUser(userId, search);

      expect(mockRecipesRepository.find).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          nome: Like(`%${search}%`),
        }),
      }));
    });
  });

  describe('buscarUmaPorUsuario', () => {
    it('deve retornar uma receita se pertencer ao usuário', async () => {
      const id = 1;
      const userId = 1;
      const recipe = { id, nome: 'Pasta', usuario: { id: userId } as UserEntity };
      
      mockRecipesRepository.findOne.mockResolvedValue(recipe);
      mockConfigService.get.mockReturnValue('http://localhost:3001');

      const result = await service.findOneOwnedByUser(id, userId);

      expect(result).toEqual(recipe);
    });

    it('deve lançar NotFoundException se a receita não for encontrada', async () => {
      mockRecipesRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneOwnedByUser(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException se a receita não pertencer ao usuário', async () => {
      const recipe = { id: 1, usuario: { id: 2 } as UserEntity };
      mockRecipesRepository.findOne.mockResolvedValue(recipe);
      await expect(service.findOneOwnedByUser(1, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remover', () => {
    it('deve remover uma receita', async () => {
      const id = 1;
      const userId = 1;
      const recipe = { id, usuario: { id: userId } as UserEntity };
      
      mockRecipesRepository.findOne.mockResolvedValue(recipe);
      mockRecipesRepository.remove.mockResolvedValue(undefined);

      const result = await service.remove(id, userId);

      expect(mockRecipesRepository.remove).toHaveBeenCalledWith(recipe);
      expect(result.message).toBe('Receita removida com sucesso');
    });
  });
});
