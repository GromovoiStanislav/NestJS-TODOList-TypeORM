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
import { StoreUsersDto, UpdateUsersDto } from './users.dto';
import { UsersService } from './users.service';
import { UsersEntity } from "./users.entity";

@Controller('users')
@ApiTags('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) {}


  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async index() {
    return this.usersService.index();
  }


  @Post()
  async store(@Body() body: StoreUsersDto):Promise<UsersEntity> {
    return this.usersService.store(body);
  }


  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.show(id);
  }


  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUsersDto,
  ) {
    return this.usersService.update(id, body);
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.usersService.destroy(id);
  }

}
