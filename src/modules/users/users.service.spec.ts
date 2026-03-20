import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve criar um novo usuário com senha criptografada', async () => {
      const dto = { nome: 'Test User', login: 'testuser', senha: 'password123' };
      const hashedPassword = 'hashedPassword';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersRepository.findOne.mockResolvedValue(null);
      mockUsersRepository.create.mockReturnValue({ ...dto, senha: hashedPassword });
      mockUsersRepository.save.mockResolvedValue({ id: 1, ...dto, senha: hashedPassword });

      const result = await service.create(dto);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { login: dto.login } });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.senha, 10);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        nome: dto.nome,
        login: dto.login,
        senha: hashedPassword,
      });
      expect(result).toHaveProperty('id', 1);
      expect(result.senha).toBe(hashedPassword);
    });

    it('deve lançar ConflictException se o login já existir', async () => {
      const dto = { nome: 'Test User', login: 'testuser', senha: 'password123' };
      mockUsersRepository.findOne.mockResolvedValue({ id: 1, login: dto.login });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByLogin', () => {
    it('deve encontrar um usuário pelo login e incluir campos sensíveis', async () => {
      const login = 'testuser';
      const user = { id: 1, login, nome: 'Test User', senha: 'hashedPassword' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findByLogin(login);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { login },
        select: ['id', 'nome', 'login', 'senha'],
      });
      expect(result).toEqual(user);
    });
  });

  describe('findById', () => {
    it('deve retornar um usuário se for encontrado', async () => {
      const id = 1;
      const user = { id, login: 'testuser', nome: 'Test User' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(id);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(user);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const id = 1;
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
  });
});
