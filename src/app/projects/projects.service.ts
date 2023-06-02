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
    return this.projectsRepository
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
      //.where({ userId: user.id })
      .orderBy("projects.createdAt", "DESC")
      .addOrderBy("tasks.createdAt", "ASC")
      .getMany();
  }


  async store(data: StoreProjectsDto, user: IUser) {
    const project = this.projectsRepository.create(data);
    project.userId = user.id;
    return this.projectsRepository.save(project);
  }


  async show(id: string) {
    return this.findByIdOrFail(id);
  }


  async update(id: string, data: UpdateProjectsDto) {
    const project = await this.findByIdOrFail(id)
    this.projectsRepository.merge(project, data);
    return this.projectsRepository.save(project);
  }


  async destroy(id: string) {
    await this.findByIdOrFail(id);
    await this.projectsRepository.softDelete({ id });
  }


  async findByIdOrFail(id: string) {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException("Not found...");
    }
    return project;
  }

}
