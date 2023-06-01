import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { IAuthRequest } from '../auth/auth.interface';
import { StoreProjectsDto, UpdateProjectsDto } from './projects.dto';
import { ProjectsService } from './projects.service';

@Controller('api/v1/projects')
@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async index(@Req() req: IAuthRequest) {
    return await this.projectsService.index(req.user);
  }

  @Post()
  async store(@Body() body: StoreProjectsDto, @Req() req: IAuthRequest) {
    return await this.projectsService.store(body, req.user);
  }

  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.projectsService.show(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateProjectsDto,
  ) {
    return await this.projectsService.update(id, body);
  }

  @Delete(':id')
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.projectsService.destroy(id);
  }
}
