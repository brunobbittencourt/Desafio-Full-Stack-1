import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1673994865240 implements MigrationInterface {
    name = 'initialMigration1673994865240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pendings', "userId" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_to_technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "added_in" TIMESTAMP NOT NULL DEFAULT now(), "technologiesId" uuid, "userId" uuid, CONSTRAINT "PK_59a92abcbbd82edc0ff53354fdf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(120) NOT NULL, "github" character varying NOT NULL, "linkedin" character varying NOT NULL, "profilePicture" character varying NOT NULL, "location" character varying DEFAULT 'Localização não encontrada', "isAdm" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "site" character varying NOT NULL, "img" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ongs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "cnpj" character varying NOT NULL, "phone" integer NOT NULL, "ownerName" character varying, "profilePicture" character varying, "github" character varying, "linkedin" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, CONSTRAINT "UQ_0969876d463a63c64efb5fcd683" UNIQUE ("email"), CONSTRAINT "UQ_ae65ca28fb8a9cbe8f100c82a31" UNIQUE ("cnpj"), CONSTRAINT "REL_24f39ccbe9183223c33255c806" UNIQUE ("projectId"), CONSTRAINT "PK_bcd0edd4e9d5fb34b6e0b8c06d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_to_projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "applied_in_project" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "projectId" uuid, CONSTRAINT "PK_4dc526c94241f7b7f3949014a17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "projectsPicture" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP COLUMN "applied_in_project"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD "applied_in_project" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD "added_in" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD "taskId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_technologies" ADD CONSTRAINT "FK_2b112816e123dc05c2feb3fc5c0" FOREIGN KEY ("technologiesId") REFERENCES "technologies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_technologies" ADD CONSTRAINT "FK_7aab906fcd19399654d7f7bfdb9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_9198b86c4c22bf6852c43f3b44e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ongs" ADD CONSTRAINT "FK_24f39ccbe9183223c33255c806e" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD CONSTRAINT "FK_74ee66dfd2ae778715224481af3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD CONSTRAINT "FK_48f79ba6ea516d1334c40520615" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD CONSTRAINT "FK_f88ecad9e4f8ac55ae5f6baf179" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP CONSTRAINT "FK_f88ecad9e4f8ac55ae5f6baf179"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP CONSTRAINT "FK_48f79ba6ea516d1334c40520615"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP CONSTRAINT "FK_74ee66dfd2ae778715224481af3"`);
        await queryRunner.query(`ALTER TABLE "ongs" DROP CONSTRAINT "FK_24f39ccbe9183223c33255c806e"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_9198b86c4c22bf6852c43f3b44e"`);
        await queryRunner.query(`ALTER TABLE "users_to_technologies" DROP CONSTRAINT "FK_7aab906fcd19399654d7f7bfdb9"`);
        await queryRunner.query(`ALTER TABLE "users_to_technologies" DROP CONSTRAINT "FK_2b112816e123dc05c2feb3fc5c0"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP COLUMN "taskId"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP COLUMN "added_in"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" DROP COLUMN "applied_in_project"`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "users_to_projects" ADD "applied_in_project" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "users_to_projects"`);
        await queryRunner.query(`DROP TABLE "ongs"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "users_to_technologies"`);
        await queryRunner.query(`DROP TABLE "technologies"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
