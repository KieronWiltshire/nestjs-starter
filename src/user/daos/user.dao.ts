import { UserDto } from '../dtos/user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Injectable } from '@nestjs/common';
import { KnexDao } from '../../database/knex/knex.dao';

@Injectable()
export class UserDao extends KnexDao<UserDao> {
  async findById(userId: number): Promise<UserDto | undefined> {
    return this.knex<UserDto>('users').where('id', userId).first();
  }

  async findByEmail(email: string): Promise<UserDto | undefined> {
    return this.knex<UserDto>('users').where('email', email).first();
  }

  async create(createUserDto: CreateUserDto) {
    return this.knex<UserDto>('users').insert(createUserDto);
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    return this.knex<UserDto>('users')
      .update(updateUserDto)
      .where('id', userId);
  }
}
