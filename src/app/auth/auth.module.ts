import { forwardRef, Module } from '@nestjs/common';
import { TokenHelper } from '../helpers/token.helper';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService, TokenHelper],
  exports: [AuthService, TokenHelper],
})
export class AuthModule {}
