import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  @ApiResponse({ type: [CategoryDto] })
  async findAll(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll();
  }
}
