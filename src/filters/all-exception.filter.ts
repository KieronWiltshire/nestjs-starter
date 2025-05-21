import {
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { BaseExceptionFilter } from '@nestjs/core';
// import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  public constructor(
    // @InjectSentry() private readonly sentry: SentryService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);
    // const eventId = this.sentry.instance().captureException(exception);

    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      // const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();

      const payload = {
        type: exception.name,
        message: exception.message,
        meta: {
          // eventId,
          status,
        },
        stackTrace: undefined,
      };

      if (this.config.get<boolean>('app.debug')) {
        payload.stackTrace = exception.stack;
      }

      response.status(status).json(payload);
    } else {
      super.catch(exception, host);
    }
  }
}
