import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { CategoryEntity } from './entities/category.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipesRepository: Repository<RecipeEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {}

  async create(userId: number, dto: CreateRecipeDto) {
    const recipe = this.recipesRepository.create({
      nome: dto.nome ?? null,
      tempoPreparoMinutos: dto.tempoPreparoMinutos ?? null,
      porcoes: dto.porcoes ?? null,
      modoPreparo: dto.modoPreparo,
      ingredientes: dto.ingredientes ?? null,
      usuario: { id: userId } as UserEntity,
      categoria: dto.categoryId
        ? ({ id: dto.categoryId } as CategoryEntity)
        : null,
    });

    return this.recipesRepository.save(recipe);
  }

  async findAllByUser(userId: number, search?: string) {
    return this.recipesRepository.find({
      where: {
        usuario: { id: userId },
        ...(search ? { nome: Like(`%${search}%`) } : {}),
      },
      relations: ['categoria', 'usuario'],
      order: { id: 'DESC' },
    });
  }

  async findOneOwnedByUser(id: number, userId: number) {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: ['categoria', 'usuario'],
    });

    if (!recipe) {
      throw new NotFoundException('Receita não encontrada');
    }

    if (recipe.usuario.id !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return recipe;
  }

  async update(id: number, userId: number, dto: UpdateRecipeDto) {
    const recipe = await this.findOneOwnedByUser(id, userId);

    if (dto.categoryId !== undefined) {
      recipe.categoria = dto.categoryId
        ? ({ id: dto.categoryId } as CategoryEntity)
        : null;
    }

    Object.assign(recipe, {
      nome: dto.nome ?? recipe.nome,
      tempoPreparoMinutos:
        dto.tempoPreparoMinutos ?? recipe.tempoPreparoMinutos,
      porcoes: dto.porcoes ?? recipe.porcoes,
      modoPreparo: dto.modoPreparo ?? recipe.modoPreparo,
      ingredientes: dto.ingredientes ?? recipe.ingredientes,
    });

    return this.recipesRepository.save(recipe);
  }

  async remove(id: number, userId: number) {
    const recipe = await this.findOneOwnedByUser(id, userId);
    await this.recipesRepository.remove(recipe);
    return { message: 'Receita removida com sucesso' };
  }

  async printable(id: number, userId: number) {
    const recipe = await this.findOneOwnedByUser(id, userId);

    return {
      titulo: recipe.nome,
      categoria: recipe.categoria?.nome ?? null,
      tempoPreparoMinutos: recipe.tempoPreparoMinutos,
      porcoes: recipe.porcoes,
      ingredientes: recipe.ingredientes,
      modoPreparo: recipe.modoPreparo,
    };
  }
}
