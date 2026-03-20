import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity({ name: 'receitas' })
export class RecipeEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_usuarios' })
  usuario: UserEntity;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_categorias' })
  categoria: CategoryEntity | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  nome: string | null;

  @Column({ name: 'tempo_preparo_minutos', type: 'int', unsigned: true, nullable: true })
  tempoPreparoMinutos: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  porcoes: number | null;

  @Column({ name: 'modo_preparo', type: 'text' })
  modoPreparo: string;

  @Column({ type: 'text', nullable: true })
  ingredientes: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagem: string | null;

  @CreateDateColumn({ name: 'criado_em', type: 'datetime' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'alterado_em', type: 'datetime' })
  alteradoEm: Date;
}
