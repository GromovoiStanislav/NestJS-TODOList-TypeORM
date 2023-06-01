import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("/auth")
@ApiTags("auth")
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

}
