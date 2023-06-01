import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { TokenHelper } from '../helpers/token.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenHelper: TokenHelper) {}

  canActivate(context: ExecutionContext): boolean {
    const [request, authorization] = [
      context.switchToHttp().getRequest(),
      context.switchToHttp().getRequest().headers['authorization'],
    ];

    if (!authorization) throw new UnauthorizedException();

    const token = authorization.split(' ').pop();

    try {
      this.tokenHelper.verify(token);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    const payload = this.tokenHelper.decode(token);
    if (!payload) throw new UnauthorizedException();

    const { user } = payload;
    request.user = user;
    request.token = token;

    return true;
  }
}
