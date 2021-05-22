/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1621696186712 implements MigrationInterface {
  name = 'InitDatabase1621696186712'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime(\'now\')), "updatedAt" datetime NOT NULL DEFAULT (datetime(\'now\')), "authProvider" varchar NOT NULL, "externalUserId" varchar NOT NULL, "name" varchar(128) NOT NULL, "bio" varchar(256), "language" varchar DEFAULT (\'en\'), "picture" varchar, "email" varchar NOT NULL, "confirmed" boolean DEFAULT (0), "confirmToken" varchar, "confirmTokenExpiresAt" datetime, "resetToken" varchar, "resetTokenExpiresAt" datetime, "password" varchar, "invalidateTokensAt" datetime)');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_2ba0acc497ad3e252051cec0a3" ON "User" ("confirmToken") ');
    await queryRunner.query('CREATE INDEX "IDX_4c5fde3d712fe316b8d8f0a39d" ON "User" ("confirmed", "confirmToken", "confirmTokenExpiresAt") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_02445ee393633c277ff1f27054" ON "User" ("resetToken") ');
    await queryRunner.query('CREATE INDEX "IDX_515e9f91cc80ff273b8b40b717" ON "User" ("resetToken", "resetTokenExpiresAt") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_2ccc59558a6684f3cb80a42ea2" ON "User" ("authProvider", "externalUserId") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_2ccc59558a6684f3cb80a42ea2"');
    await queryRunner.query('DROP INDEX "IDX_515e9f91cc80ff273b8b40b717"');
    await queryRunner.query('DROP INDEX "IDX_02445ee393633c277ff1f27054"');
    await queryRunner.query('DROP INDEX "IDX_4c5fde3d712fe316b8d8f0a39d"');
    await queryRunner.query('DROP INDEX "IDX_2ba0acc497ad3e252051cec0a3"');
    await queryRunner.query('DROP TABLE "User"');
  }
}
