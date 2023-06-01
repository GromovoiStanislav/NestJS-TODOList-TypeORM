import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import * as jsonwebtoken from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./auth.dto";

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmailOrFail(data.email);
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const token = jsonwebtoken.sign(
      { user: user.id },
      this.configService.get("SECRET_KEY"),
      { expiresIn: "1d" }
    );
    return { token, user };
  }
}
