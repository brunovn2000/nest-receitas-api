import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar usuário' })
  @ApiCreatedResponse({ description: 'Usuário cadastrado com sucesso' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
