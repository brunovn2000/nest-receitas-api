import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
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
    private readonly configService: ConfigService,
  ) {}

  private formatRecipeImageUrl(recipe: RecipeEntity): RecipeEntity {
    if (recipe.imagem && !recipe.imagem.startsWith('http')) {
      const appUrl = this.configService.get<string>('APP_URL');
      recipe.imagem = `${appUrl}${recipe.imagem}`;
    }
    return recipe;
  }

  async create(
    userId: number,
    dto: CreateRecipeDto,
    file?: Express.Multer.File,
  ) {
    const imagemUrl = file ? `/uploads/recipes/${file.filename}` : null;

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
      imagem: imagemUrl,
    });

    const result = await this.recipesRepository.save(recipe);
    return this.formatRecipeImageUrl(result);
  }

  async findAllByUser(userId: number, search?: string) {
    const recipes = await this.recipesRepository.find({
      where: {
        usuario: { id: userId },
        ...(search ? { nome: Like(`%${search}%`) } : {}),
      },
      relations: ['categoria', 'usuario'],
      order: { id: 'DESC' },
    });

    return recipes.map((recipe) => this.formatRecipeImageUrl(recipe));
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

    return this.formatRecipeImageUrl(recipe);
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateRecipeDto,
    file?: Express.Multer.File,
  ) {
    const recipe = await this.findOneOwnedByUser(id, userId);

    if (file) {
      recipe.imagem = `/uploads/recipes/${file.filename}`;
    }

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

    const result = await this.recipesRepository.save(recipe);
    return this.formatRecipeImageUrl(result);
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
      imagem: recipe.imagem,
    };
  }
}
