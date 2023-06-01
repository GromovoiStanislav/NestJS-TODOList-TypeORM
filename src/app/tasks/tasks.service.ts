import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreTasksDto, UpdateTasksDto } from './tasks.dto';
import { TasksEntity } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private readonly tasksRepository: Repository<TasksEntity>,
  ) {}

  async index() {
    return await this.tasksRepository.find();
  }

  async store(data: StoreTasksDto) {
    return await this.tasksRepository.save(this.tasksRepository.create(data));
  }

  async show(id: string) {
    return await this.findByIdOrFail(id);
  }

  async update(id: string, data: UpdateTasksDto) {
    const task = await this.tasksRepository.findOneOrFail({ where: { id } });

    if (task.done) throw new ForbiddenException();

    task.doneDate = data.done === 1 ? new Date().toISOString() : null;
    this.tasksRepository.merge(task, data);

    return await this.tasksRepository.save(task);
  }

  async destroy(id: string) {
    const task = await this.findByIdOrFail(id);

    if (task.done) throw new ForbiddenException();

    await this.tasksRepository.softDelete({ id });
  }

  private async findByIdOrFail(id: string) {
    try {
      return await this.tasksRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
