import { Injectable } from '@nestjs/common';
import { KnexDao } from '@/database/knex/knex.dao';
import { ApiKeyDto } from '../dtos/api-key.dto';
import { CreateApiKeyDto } from '../dtos/create-api-key.dto';

@Injectable()
export class ApiKeyDao extends KnexDao<ApiKeyDao> {
  protected tableName = 'api_keys';

  async findById(
    id: string,
    includeDeleted = false,
  ): Promise<ApiKeyDto | undefined> {
    const query = this.knex<ApiKeyDto>(this.tableName).where('id', id);
    if (!includeDeleted) {
      query.whereNull('deleted_at');
    }
    const result = await query.first();
    return result;
  }

  async findByKey(key: string): Promise<ApiKeyDto | undefined> {
    const result = await this.knex<ApiKeyDto>(this.tableName)
      .where('key', key)
      .whereNull('deleted_at')
      .first();
    return result;
  }

  async findByUserId(
    userId: string,
    includeDeleted = false,
  ): Promise<ApiKeyDto[]> {
    const query = this.knex<ApiKeyDto>(this.tableName).where('user_id', userId);
    if (!includeDeleted) {
      query.whereNull('deleted_at');
    }
    const results = await query;
    return results;
  }

  async create(createApiKeyDto: CreateApiKeyDto): Promise<ApiKeyDto> {
    const [result] = await this.knex<ApiKeyDto>(this.tableName)
      .insert(createApiKeyDto)
      .returning('*');
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.knex<ApiKeyDto>(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .update({ deleted_at: new Date() });
    return affectedRows > 0;
  }
}
