import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Auth } from '../types/auth';

export const CurrentAuth = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): Auth => {
    let user: Auth;

    switch (ctx.getType()) {
      case 'http':
        const request = ctx.switchToHttp().getRequest();
        user = request.user as Auth;
        break;
      case 'ws':
        const client = ctx.switchToWs().getClient();
        user = client.user as Auth;
        break;
      default:
        throw new Error('Invalid context type');
    }

    return data ? user?.[data] : user;
  },
);
