import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios' })
@Unique('login_UNIQUE', ['login'])
export class UserEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nome: string | null;

  @Column({ type: 'varchar', length: 100 })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string;

  @CreateDateColumn({ name: 'criado_em', type: 'datetime' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'alterado_em', type: 'datetime' })
  alteradoEm: Date;
}
