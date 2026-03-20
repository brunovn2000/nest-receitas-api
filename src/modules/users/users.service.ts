import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.usersRepository.findOne({
      where: { login: dto.login },
    });

    if (existing) {
      throw new ConflictException('Login já está em uso');
    }

    const hashPassword = await bcrypt.hash(dto.senha, 10);

    const user = this.usersRepository.create({
      nome: dto.nome ?? null,
      login: dto.login,
      senha: hashPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByLogin(login: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { login },
      select: ['id', 'nome', 'login', 'senha'],
    });
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
