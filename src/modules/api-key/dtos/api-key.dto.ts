import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ApiKeyDto {
  @ApiProperty({
    description: 'The unique identifier of the API key',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the API key',
    example: 'Production API Key',
  })
  name: string;

  @ApiProperty({
    description: 'The hashed API key value',
    example: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
  })
  @Exclude()
  key: string;

  @ApiProperty({
    description: 'The ID of the user who owns this API key',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({
    description: 'The timestamp when the API key was deleted, if applicable',
    example: '2024-03-20T12:00:00Z',
    required: false,
  })
  deleted_at?: Date;

  @ApiProperty({
    description: 'The timestamp when the API key expires, if applicable',
    example: '2024-03-20T12:00:00Z',
    required: false,
  })
  expires_at?: Date;

  @ApiProperty({
    description: 'Additional metadata associated with the API key',
    example: { environment: 'production', purpose: 'backend integration' },
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'The timestamp when the API key was created',
    example: '2024-03-20T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the API key was last updated',
    example: '2024-03-20T12:00:00Z',
  })
  updated_at: Date;
}
