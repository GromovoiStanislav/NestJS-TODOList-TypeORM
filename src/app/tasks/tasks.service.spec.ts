import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreTasksDto, UpdateTasksDto } from "./tasks.dto";
import { TasksEntity } from "./tasks.entity";
import { TasksService } from "./tasks.service";
import { ProjectsService } from "../projects/projects.service";

const taskEntityMock = new TasksEntity({
  id: "be349b88-9097-4435-ad63-f35c4f85c505",
  description: "fake task",
  doneDate: "2021-04-04T15:00:00",
  done: 0,
  projectId: "6c3e3c70-a0e7-4e8b-bf25-456087e7bc57",
  createdAt: "2021-04-04T10:00:00",
  updatedAt: "2021-04-04T15:00:00",
  deletedAt: null
});

describe("TasksService", () => {
  let tasksService: TasksService;
  let tasksRepository: Repository<TasksEntity>;
  let projectsService: ProjectsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: ProjectsService,
          useValue: {
            findByIdOrFail: jest.fn().mockResolvedValue({id:"6c3e3c70-a0e7-4e8b-bf25-456087e7bc57"})
          }
        },
        {
          provide: getRepositoryToken(TasksEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([taskEntityMock]),
            save: jest.fn().mockResolvedValue(taskEntityMock),
            create: jest.fn().mockReturnValue(taskEntityMock),
            findOneBy: jest.fn().mockResolvedValue(taskEntityMock),
            merge: jest.fn(),
            softDelete: jest.fn().mockResolvedValue(undefined)
          }
        }
      ]
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<TasksEntity>>(getRepositoryToken(TasksEntity));
    projectsService = module.get<ProjectsService>(ProjectsService);
  });


  it("should be defined", () => {
    expect(tasksService).toBeDefined();
    expect(tasksRepository).toBeDefined();
  });


  describe("index", () => {

    it("should return a tasks list", async () => {
      const result = await tasksService.index();
      //assert
      expect(result).toEqual([taskEntityMock]);
      expect(tasksRepository.find).toBeCalledTimes(1);
    });

    it("should throw an exception when something was wrong", () => {
      jest.spyOn(tasksRepository, "find").mockRejectedValueOnce(new Error());
      //assert
      expect(tasksService.index()).rejects.toThrowError(Error);
    });

  });


  describe("store", () => {

    it("should save new tasks successfully", async () => {
      const data: StoreTasksDto = {
        description: "fake task",
        done: 0,
        projectId: "6c3e3c70-a0e7-4e8b-bf25-456087e7bc57"
      };
      const result = await tasksService.store(data);
      //assert
      expect(result).toEqual(taskEntityMock);
      expect(tasksRepository.create).toBeCalledTimes(1);
      expect(projectsService.findByIdOrFail).toBeCalledTimes(1);
      expect(tasksRepository.save).toBeCalledTimes(1);
    });

    it("should throw an exception when something was wrong", () => {
      const data: StoreTasksDto = {
        description: "fake task",
        done: 0,
        projectId: "6c3e3c70-a0e7-4e8b-bf25-456087e7bc57"
      };
      jest.spyOn(tasksRepository, "save").mockRejectedValueOnce(new Error());
      //assert
      expect(tasksService.store(data)).rejects.toThrowError();
      expect(tasksRepository.create).toBeCalledTimes(0);
      expect(tasksRepository.save).toBeCalledTimes(0);
    });

  });


  describe("show", () => {

    it("should return a task successfully", async () => {
      const id = taskEntityMock.id;
      const result = await tasksService.show(id);
      //assert
      expect(result).toEqual(taskEntityMock);
      expect(tasksRepository.findOneBy).toBeCalledTimes(1);
      expect(tasksRepository.findOneBy).toBeCalledWith({ id });
    });

    it("should throw an exception when something was wrong", () => {
      const id = taskEntityMock.id;
      jest.spyOn(tasksRepository, "findOneBy").mockRejectedValueOnce(new NotFoundException());
      //assert
      expect(tasksService.show(id)).rejects.toThrowError(NotFoundException);
      expect(tasksRepository.findOneBy).toBeCalledTimes(1);
      expect(tasksRepository.findOneBy).toBeCalledWith({ id });
    });

  });


  describe("update", () => {

    it("should update tasks data successfully", async () => {
      const id = taskEntityMock.id;
      const data: UpdateTasksDto = {
        description: "fake task",
        done: 1,
        projectId: "6c3e3c70-a0e7-4e8b-bf25-456087e7bc57"
      };
      const taskEntityUpdatedMock = new TasksEntity(data);
      jest.spyOn(tasksRepository, "save").mockResolvedValueOnce(taskEntityUpdatedMock);
      const result = await tasksService.update(id, data);
      //assert
      expect(result).toEqual(taskEntityUpdatedMock);
      expect(tasksRepository.findOneBy).toBeCalledTimes(1);
      expect(tasksRepository.findOneBy).toBeCalledWith({ id });
      expect(tasksRepository.merge).toBeCalledTimes(1);
      expect(tasksRepository.save).toBeCalledTimes(1);
    });

    it("should throw an exception when something was wrong", () => {
      const id = taskEntityMock.id;
      const data: UpdateTasksDto = {
        description: "fake task abc",
        done: 1,
        projectId: "6c3e3c70-a0e7-4e8b-bf25-456087e7bc57"
      };
      jest.spyOn(tasksRepository, "save").mockRejectedValueOnce(new NotFoundException());
      //assert
      expect(tasksService.update(id, data)).rejects.toThrowError(NotFoundException);
      expect(tasksRepository.findOneBy).toBeCalledTimes(1);
      expect(tasksRepository.findOneBy).toBeCalledWith({ id });
    });

  });


  describe("destroy", () => {

    it("should soft delete a task successfully", async () => {
      const id = taskEntityMock.id;
      const result = await tasksService.destroy(id);
      //assert
      expect(result).toBeUndefined();
      expect(tasksRepository.findOneBy).toBeCalledTimes(1);
      expect(tasksRepository.findOneBy).toBeCalledWith({ id });
      expect(tasksRepository.softDelete).toBeCalledTimes(1);
      expect(tasksRepository.softDelete).toBeCalledWith({ id });
    });

    it("should throw an exception when something was wrong", () => {
      const id = taskEntityMock.id;
      jest.spyOn(tasksRepository, "softDelete").mockRejectedValueOnce(new NotFoundException());
      //assert
      expect(tasksService.destroy(id)).rejects.toThrowError(NotFoundException);
      expect(tasksRepository.findOneBy).toBeCalledTimes(1);
      expect(tasksRepository.findOneBy).toBeCalledWith({ id })
      expect(tasksRepository.softDelete).toBeCalledTimes(0);
    });

  });

});
