import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiKeyAuth } from './types/auth';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<ApiKeyAuth> {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('ApiKey ')) {
      throw new UnauthorizedException('Invalid API key format');
    }

    const key = authHeader.replace('ApiKey ', '');

    return this.authService.validateApiKey(key);
  }
}
