import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiKeyDao } from '../daos/api-key.dao';
import { ApiKeyDto } from '../dtos/api-key.dto';
import { CreateApiKeyDto } from '../dtos/create-api-key.dto';
import { CreateApiKeyResponseDto } from '../dtos/create-api-key-response.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyService {
  private readonly rounds: number = 10;

  constructor(private readonly apiKeyDao: ApiKeyDao) {}

  async create(
    createApiKeyDto: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
    const key = randomBytes(32).toString('hex');
    const hashedKey = await bcrypt.hash(key, this.rounds);

    const apiKey = await this.apiKeyDao.create({
      ...createApiKeyDto,
      key: hashedKey,
    });

    return {
      ...apiKey,
      key,
    };
  }

  async getApiKeyById(id: string): Promise<ApiKeyDto> {
    const apiKey = await this.apiKeyDao.findById(id);
    if (!apiKey) {
      throw new NotFoundException(`ApiKey with id ${id} not found`);
    }
    return apiKey;
  }

  async getApiKeyByKey(key: string): Promise<ApiKeyDto> {
    const hashedKey = await bcrypt.hash(key, this.rounds);
    const apiKey = await this.apiKeyDao.findByKey(hashedKey);
    if (!apiKey) {
      throw new NotFoundException(`ApiKey with key ${key} not found`);
    }
    return apiKey;
  }

  async getApiKeysByUserId(
    userId: string,
    includeDeleted = false,
  ): Promise<ApiKeyDto[]> {
    const results = await this.apiKeyDao.findByUserId(userId, includeDeleted);
    return results;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.apiKeyDao.delete(id);
    if (!deleted) {
      throw new NotFoundException(`ApiKey with id ${id} not found`);
    }
  }
}
