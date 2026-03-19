import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserEntity } from '../modules/users/entities/user.entity';
import { CategoryEntity } from '../modules/recipes/entities/category.entity';
import { RecipeEntity } from '../modules/recipes/entities/recipe.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity, CategoryEntity, RecipeEntity],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
});
