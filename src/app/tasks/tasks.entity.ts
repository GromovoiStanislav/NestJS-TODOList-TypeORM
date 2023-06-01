import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectsEntity } from '../projects/projects.entity';

@Entity({ name: 'tasks' })
export class TasksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ name: 'done_date', type: 'timestamp', default: null })
  doneDate: string;

  @Column({ type: 'smallint', width: 1, default: 0 })
  done: number;

  @ManyToOne(() => ProjectsEntity, (project) => project.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: ProjectsEntity;

  @Column({ name: 'project_id', type: 'uuid', nullable: false })
  projectId: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: string;

  constructor(data: Partial<TasksEntity>) {
    Object.assign(this, data);
  }
}
