import { MigrationInterface, QueryRunner } from "typeorm";
import Technology from "../entities/technologies.entity";

export class createTech1673449497162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "React",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "JavaScript",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "TypeScript",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "HTML",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "CSS",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "Vue",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "SCSS",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "Styled Components",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "Git",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "GitHub",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "SCSS",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "C++",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "JAVA",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "Python",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "C#",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "Django",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "Express",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "Node JS",
    });
    await queryRunner.manager.insert<Technology>(Technology, {
      name: "TypeORM",
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
