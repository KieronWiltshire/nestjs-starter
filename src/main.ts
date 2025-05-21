import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIOAdapter } from './socketio.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { REDIS_CLIENT } from './redis/constants/redis.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: false,
  });

  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  const appName = config.get<string>('app.name');

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`${appName} API documentation`)
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description:
          'Enter your API key with the `ApiKey` prefix. Example: "ApiKey your-api-key"',
      },
      'ApiKey',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/reference', app, document);

  app.setGlobalPrefix('api');

  const socketAdapter = new SocketIOAdapter(app);
  socketAdapter.connect(app.get(REDIS_CLIENT));
  app.useWebSocketAdapter(socketAdapter);

  if (config.get<boolean>('app.debug')) {
    app.getHttpAdapter().getInstance().set('json spaces', 2);
  } else {
    app.useLogger(logger);
  }

  const port = config.get<string>('app.port');
  await app.listen(port);
}

bootstrap();
