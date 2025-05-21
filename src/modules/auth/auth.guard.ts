import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import type { Auth } from '@/modules/auth/types/auth';

interface AuthGuardOptions {
  allowAnonymous?: boolean;
}

@Injectable()
export class AuthGuard extends PassportAuthGuard(['jwt', 'api-key']) {
  private readonly allowAnonymous: boolean;

  constructor({ allowAnonymous = false }: AuthGuardOptions = {}) {
    super();
    this.allowAnonymous = allowAnonymous;
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || '';

    if (authHeader.startsWith('Bearer ')) {
      (this as any).strategy = 'jwt';
    } else if (authHeader.startsWith('ApiKey ')) {
      (this as any).strategy = 'api-key';
    } else {
      return this.allowAnonymous;
    }

    try {
      return super.canActivate(context);
    } catch (e) {
      return this.allowAnonymous;
    }
  }

  handleRequest<T = Auth>(err: any, user: any): T {
    if ((err || !user) && !this.allowAnonymous) {
      throw err || new UnauthorizedException();
    }

    if (user) {
      return user as T;
    }

    return {
      type: 'anon',
    } as T;
  }
}
