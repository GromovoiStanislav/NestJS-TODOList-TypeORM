import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreUsersDto, UpdateUsersDto } from "./users.dto";
import { UsersEntity } from "./users.entity";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>
  ) {
  }


  async index() {
    return this.usersRepository.find();
  }


  async store(data: StoreUsersDto) {
    const user = await this.usersRepository.findOneBy({ email:data.email });
    if (user) {
      throw new ConflictException("Email already exists");
    }
    return this.usersRepository.save(this.usersRepository.create(data));
  }


  async show(id: string) {
    return this.findByIdOrFail(id);
  }


  async update(id: string, data: UpdateUsersDto) {
    const user = await this.findByIdOrFail(id );
    this.usersRepository.merge(user, data);
    return this.usersRepository.save(user);
  }


  async destroy(id: string) {
    await this.findByIdOrFail(id);
    await this.usersRepository.softDelete({ id });
  }


  async findByEmailOrFail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException("Not found...");
    }
    return user;
  }


  private async findByIdOrFail(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("Not found...");
    }
    return user;
  }

}
