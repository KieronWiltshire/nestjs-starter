import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyService } from '../services/api-key.service';
import { CreateApiKeyDto } from '../dtos/create-api-key.dto';
import { ApiKeyDto } from '../dtos/api-key.dto';
import { CreateApiKeyResponseDto } from '../dtos/create-api-key-response.dto';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { CurrentAuth } from '@/modules/auth/decorators/current-auth.decorator';
import type { ApiKeyAuth, UserAuth } from '@/modules/auth/types/auth';

@ApiTags('api-keys')
@Controller('api-keys')
@UseGuards(AuthGuard)
@ApiBearerAuth('Bearer')
@ApiSecurity('ApiKey')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @SerializeOptions({ type: CreateApiKeyResponseDto })
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({
    status: 201,
    description: 'The API key has been successfully created',
    type: CreateApiKeyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createApiKeyDto: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
    // TODO: auth check if user_id specified can make the request

    return this.apiKeyService.create(createApiKeyDto);
  }

  @Get()
  @SerializeOptions({ type: ApiKeyDto })
  @ApiOperation({ summary: 'Get all API keys for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The API keys have been successfully retrieved',
    type: [ApiKeyDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getById(
    @CurrentAuth() auth: UserAuth | ApiKeyAuth,
  ): Promise<ApiKeyDto[]> {
    return this.apiKeyService.getApiKeysByUserId(auth.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiResponse({
    status: 204,
    description: 'The API key has been successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async delete(@Param('id') id: string): Promise<void> {
    // TODO: auth check if user_id specified can make the request

    await this.apiKeyService.delete(id);
  }
}
