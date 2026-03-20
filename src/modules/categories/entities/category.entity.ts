import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RecipeEntity } from '../../recipes/entities/recipe.entity';

@Entity({ name: 'categorias' })
@Unique('nome_UNIQUE', ['nome'])
export class CategoryEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nome: string | null;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.categoria)
  receitas: RecipeEntity[];
}
