import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type UserAuth, type ApiKeyAuth, AuthType } from '../types/auth';
import { ApiKeyService } from '../../api-key/services/api-key.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly apiKeyService: ApiKeyService,
    private readonly userService: UserService,
  ) {}

  generateWebSocketAccessToken(auth: UserAuth | ApiKeyAuth): string {
    const payload = {
      sub: auth.type === 'api-key' ? auth.apiKey.id : auth.user.id,
      type: auth.type,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '5m',
    });
  }

  async validateWebSocketAccessToken(
    token: string,
  ): Promise<ApiKeyAuth | UserAuth> {
    const payload = this.jwtService.verify(token);

    switch (payload.type) {
      case AuthType.ApiKey:
        const apiKey = await this.apiKeyService.getApiKeyById(payload.id);
        return {
          type: AuthType.ApiKey,
          subjectId: apiKey.id,
          apiKey,
          user: await this.userService.getUserById(payload.sub),
        };
      case AuthType.User:
        return {
          type: AuthType.User,
          subjectId: payload.sub,
          user: await this.userService.getUserById(payload.sub),
        };
      default:
        throw new UnauthorizedException('Invalid Token');
    }
  }

  async validateApiKey(key: string): Promise<ApiKeyAuth> {
    try {
      const apiKey = await this.apiKeyService.getApiKeyByKey(key);

      if (apiKey.expires_at && new Date(apiKey.expires_at) > new Date()) {
        throw new UnauthorizedException('API key has expired');
      }

      return {
        type: AuthType.ApiKey,
        subjectId: apiKey.id,
        apiKey,
        user: await this.userService.getUserById(apiKey.user_id),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid API key');
      }

      throw error;
    }
  }

  async validateJwt(payload: any): Promise<UserAuth> {
    try {
      const user = await this.userService.getUserByIdentityId(payload.sub);

      return {
        type: AuthType.User,
        subjectId: user.id,
        user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('User not found');
      }

      throw error;
    }
  }
}
