import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { QueryRecipesDto } from './dto/query-recipes.dto';

@ApiTags('Receitas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar receita' })
  create(@Req() req: any, @Body() dto: CreateRecipeDto) {
    return this.recipesService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar e pesquisar receitas do usuário' })
  findAll(@Req() req: any, @Query() query: QueryRecipesDto) {
    return this.recipesService.findAllByUser(req.user.userId, query.search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar receita' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOneOwnedByUser(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar receita' })
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir receita' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(id, req.user.userId);
  }

  @Get(':id/print')
  @ApiOperation({ summary: 'Impressão de receita' })
  printable(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.recipesService.printable(id, req.user.userId);
  }
}
