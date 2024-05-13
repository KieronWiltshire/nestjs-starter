import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: false,
  });

  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  if (config.get<boolean>('app.debug')) {
    app.getHttpAdapter().getInstance().set('json spaces', 2);
  } else {
    app.useLogger(logger);
  }

  const port = config.get<string>('app.port');
  await app.listen(port);
}

bootstrap();
