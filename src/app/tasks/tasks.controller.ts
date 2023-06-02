import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { StoreTasksDto, UpdateTasksDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TasksController {

  constructor(
    private readonly tasksService: TasksService
  ) {}


  @Get()
  async index() {
    return this.tasksService.index();
  }


  @Post()
  async store(@Body() body: StoreTasksDto) {
    return this.tasksService.store(body);
  }


  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasksService.show(id);
  }


  @Patch(':id')
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTasksDto
  ) {
    return this.tasksService.update(id, body);
  }


  @Delete(':id')
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.tasksService.destroy(id);
  }

}
