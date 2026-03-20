import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      order: {
        nome: 'ASC',
      },
    });
  }
}
