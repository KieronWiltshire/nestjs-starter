import { ApiProperty } from '@nestjs/swagger';

export class WebSocketAccessTokenResponseDto {
  @ApiProperty({
    description: 'The JWT access token for WebSocket authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
