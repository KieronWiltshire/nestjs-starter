import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/services/user.service';
import { UserController } from '@/modules/user/controllers/user.controller';
import { UserDao } from '@/modules/user/daos/user.dao';

@Module({
  imports: [],
  providers: [UserService, UserDao],
  exports: [UserService, UserDao],
  controllers: [UserController],
})
export class UserModule {}
