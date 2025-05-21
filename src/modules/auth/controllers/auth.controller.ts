import { Controller, Post, UseGuards, SerializeOptions } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../auth.guard';
import { CurrentAuth } from '../decorators/current-auth.decorator';
import type { UserAuth, ApiKeyAuth } from '../types/auth';
import { WebSocketAccessTokenResponseDto } from '../dtos/web-socket-access-token-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('ws-token')
  @UseGuards(AuthGuard)
  @SerializeOptions({ type: WebSocketAccessTokenResponseDto })
  @ApiOperation({ summary: 'Generate a WebSocket authentication token' })
  @ApiResponse({
    status: 200,
    description:
      'The WebSocket authentication token has been successfully generated',
    type: WebSocketAccessTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  generateWebSocketAuthToken(
    @CurrentAuth() auth: UserAuth | ApiKeyAuth,
  ): WebSocketAccessTokenResponseDto {
    return {
      access_token: this.authService.generateWebSocketAccessToken(auth),
    };
  }
}
