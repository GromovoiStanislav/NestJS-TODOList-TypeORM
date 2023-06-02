import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { ProjectsController } from "./projects.controller";
import { ProjectsEntity } from "./projects.entity";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectsEntity]),
    AuthModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {
}
