import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserDao } from './daos/user.dao';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UserService, UserDao],
  exports: [UserService, UserDao],
  controllers: [UserController],
})
export class UserModule {}
