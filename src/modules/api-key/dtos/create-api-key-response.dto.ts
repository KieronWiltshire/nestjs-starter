import { ApiProperty } from '@nestjs/swagger';
import { ApiKeyDto } from './api-key.dto';
import { Expose } from 'class-transformer';

export class CreateApiKeyResponseDto extends ApiKeyDto {
  @ApiProperty({
    description:
      'The unhashed API key value. This is only shown once when the key is created.',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  })
  @Expose()
  key: string;
}
