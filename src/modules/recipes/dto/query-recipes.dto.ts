import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryRecipesDto {
  @ApiPropertyOptional({ example: 'bolo' })
  @IsOptional()
  @IsString()
  search?: string;
}
