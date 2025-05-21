import { Injectable } from '@nestjs/common';
import { KnexDao } from '@/database/knex/knex.dao';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserDao extends KnexDao<UserDao> {
  protected tableName = 'users';

  async create(data: Partial<UserDto>): Promise<UserDto> {
    const [user] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return user;
  }

  async findById(id: string): Promise<UserDto | null> {
    const result = await this.knex(this.tableName).where({ id }).first();
    return result || null;
  }

  async findByIdentityId(identityId: string): Promise<UserDto | null> {
    const result = await this.knex(this.tableName)
      .where({ identity_id: identityId })
      .first();
    return result || null;
  }

  async update(id: string, data: Partial<UserDto>): Promise<UserDto | null> {
    const [user] = await this.knex(this.tableName)
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return user || null;
  }

  async delete(id: string): Promise<boolean> {
    const count = await this.knex(this.tableName).where({ id }).delete();
    return count > 0;
  }
}
