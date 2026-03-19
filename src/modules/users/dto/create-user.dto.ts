import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Bruno Vicente', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @ApiProperty({ example: 'bruno.dev' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  login: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  senha: string;
}
