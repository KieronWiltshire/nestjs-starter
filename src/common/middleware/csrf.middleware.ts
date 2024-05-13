import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import csrf from 'tiny-csrf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.Authorization) {
      csrf(this.config.get('app.secret'))(req, res, () => {
        res.cookie('XSRF-TOKEN', (req as any).csrfToken());
        next();
      });
    } else {
      next();
    }
  }
}
