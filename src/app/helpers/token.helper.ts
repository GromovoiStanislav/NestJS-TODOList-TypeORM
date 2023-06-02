import { Injectable, BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenHelper {

  constructor(
    private readonly configService: ConfigService
  ) {
  }

  verify(token: string) {
    return jwt.verify(token, this.configService.get("SECRET_KEY"));
  }

  decode(token: string) {
    try {
      return jwt.decode(token, { json: true });
    } catch (e) {
      throw new BadRequestException('Invalid token: ' + e.message);
    }
  }

}
