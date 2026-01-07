import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1767814751024 implements MigrationInterface {
  name = 'NewMigrations1767814751024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" character varying NOT NULL, "hash" character varying NOT NULL, "roles" character varying DEFAULT 'EMPLOYEE', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_f1a9842e79756a9f25ba8dbe46e" UNIQUE ("hash"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
