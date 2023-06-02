import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreTasksDto, UpdateTasksDto } from "./tasks.dto";
import { TasksEntity } from "./tasks.entity";
import { ProjectsService } from "../projects/projects.service";

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TasksEntity) private readonly tasksRepository: Repository<TasksEntity>,
    private readonly projectsService: ProjectsService
  ) {
  }


  async index() {
    return this.tasksRepository.find();
  }


  async store(data: StoreTasksDto) {
    await this.projectsService.findByIdOrFail(data.projectId);
    return this.tasksRepository.save(this.tasksRepository.create(data));
  }


  async show(id: string) {
    return this.findByIdOrFail(id);
  }


  async update(id: string, data: UpdateTasksDto) {
    const task = await this.findByIdOrFail(id);

    if (task.done) {
      throw new ForbiddenException();
    }

    task.doneDate = data.done === 1 ? new Date().toISOString() : null;
    this.tasksRepository.merge(task, data);

    return this.tasksRepository.save(task);
  }


  async destroy(id: string) {
    const task = await this.findByIdOrFail(id);
    if (task.done) {
      throw new ForbiddenException();
    }
    await this.tasksRepository.softDelete({ id });
  }


  private async findByIdOrFail(id: string) {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException("Not found...");
    }
    return task;
  }

}
