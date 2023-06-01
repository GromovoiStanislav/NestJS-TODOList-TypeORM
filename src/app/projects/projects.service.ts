import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUser } from "../users/users.interface";
import { StoreProjectsDto, UpdateProjectsDto } from "./projects.dto";
import { ProjectsEntity } from "./projects.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>
  ) {
  }

  async index(user: IUser) {
    return await this.projectsRepository
      .createQueryBuilder("projects")
      .select(["projects.id", "projects.name"])
      .addSelect([
        "tasks.id",
        "tasks.description",
        "tasks.done",
        "tasks.doneDate"
      ])
      .leftJoin("projects.tasks", "tasks")
      .where("projects.userId = :userId", { userId: user.id })
      .orderBy("projects.createdAt", "DESC")
      .addOrderBy("tasks.createdAt", "ASC")
      .getMany();
  }

  async store(data: StoreProjectsDto, user: IUser) {
    const project = this.projectsRepository.create(data);
    project.userId = user.id;

    return await this.projectsRepository.save(project);
  }

  async show(id: string) {
    return await this.findByIdOrFail(id);
  }

  async update(id: string, data: UpdateProjectsDto) {
    const user = await this.projectsRepository.findOneOrFail({ where: { id } });

    this.projectsRepository.merge(user, data);
    return await this.projectsRepository.save(user);
  }

  async destroy(id: string) {
    await this.findByIdOrFail(id);

    await this.projectsRepository.softDelete({ id });
  }

  private async findByIdOrFail(id: string) {
    try {
      return await this.projectsRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
