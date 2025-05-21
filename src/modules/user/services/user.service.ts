import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDao } from '@/modules/user/daos/user.dao';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly userDao: UserDao,
  ) {}

  async createUser(data: Partial<UserDto>): Promise<UserDto> {
    return this.userDao.create(data);
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.userDao.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByIdentityId(identityId: string): Promise<UserDto> {
    const user = await this.userDao.findByIdentityId(identityId);
    if (!user) {
      throw new NotFoundException(
        `User with identityId ${identityId} not found`,
      );
    }
    return user;
  }

  async updateUser(id: string, data: Partial<UserDto>): Promise<UserDto> {
    const user = await this.userDao.update(id, data);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userDao.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
