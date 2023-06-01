import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsEntity } from './projects.entity';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let projectService: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(ProjectsEntity),
          useValue: {},
        },
      ],
    }).compile();

    projectService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });
});
