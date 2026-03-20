import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({ example: 'Bolo de cenoura', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  nome?: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  tempoPreparoMinutos?: number;

  @ApiProperty({ example: 8, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  porcoes?: number;

  @ApiProperty({ example: 'Misture tudo e asse até dourar' })
  @IsString()
  modoPreparo: string;

  @ApiProperty({ example: 'cenoura, açúcar, ovos', required: false })
  @IsOptional()
  @IsString()
  ingredientes?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  imagem?: any;
}
