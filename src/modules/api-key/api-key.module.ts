import { Module } from '@nestjs/common';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyController } from './controllers/api-key.controller';
import { ApiKeyDao } from './daos/api-key.dao';

@Module({
  imports: [],
  providers: [ApiKeyService, ApiKeyDao],
  exports: [ApiKeyService, ApiKeyDao],
  controllers: [ApiKeyController],
})
export class ApiKeyModule {}