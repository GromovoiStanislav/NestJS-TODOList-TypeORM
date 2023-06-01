import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./app/users/users.module";
import { ProjectsModule } from "./app/projects/projects.module";
import { TasksModule } from "./app/tasks/tasks.module";
import { AuthModule } from "./app/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<any>("TYPEORM_CONNECTION"),
        host: configService.get<string>("TYPEORM_HOST"),
        database: configService.get<string>("TYPEORM_DATABASE"),
        username: configService.get<string>("TYPEORM_USERNAME"),
        password: configService.get<string>("TYPEORM_PASSWORD"),
        port: Number(configService.get<number>("TYPEORM_PORT", 3306)),
        entities: [__dirname + "/**/*.entity.js"],
        synchronize:
          configService.get("TYPEORM_SYNCHRONIZE", "false") === "true",
        // logging: "all"
      })
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
