import { ApiKeyDto } from './api-key.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateApiKeyDto extends OmitType(ApiKeyDto, [
  'id',
  'deleted_at',
  'created_at',
  'updated_at',
] as const) {}
