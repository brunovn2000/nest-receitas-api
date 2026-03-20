import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImagemToReceitas1773901000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`receitas\` ADD \`imagem\` VARCHAR(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`receitas\` DROP COLUMN \`imagem\``);
  }
}
