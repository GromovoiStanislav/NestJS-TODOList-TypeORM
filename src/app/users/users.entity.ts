import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import * as bcrypt from "bcrypt";
import { ProjectsEntity } from "../projects/projects.entity";


@Entity({ name: "users" })
export class UsersEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => ProjectsEntity, (project) => project.user)
  projects: ProjectsEntity[];

  @CreateDateColumn({ name: "created_at", nullable: false })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updatedAt: string;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt: string;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPassword() {
    // Чтобы избажать повторного хеширования пароля !!!
    try {
      const rounds = bcrypt.getRounds(this.password);
      if (rounds === 0) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    } catch (error) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  constructor(data: Partial<UsersEntity>) {
    Object.assign(this, data);
  }
}
