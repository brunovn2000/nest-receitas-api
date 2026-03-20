import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Bolos e tortas doces', nullable: true })
  nome: string | null;
}
