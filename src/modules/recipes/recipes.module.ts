import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, CategoryEntity])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
