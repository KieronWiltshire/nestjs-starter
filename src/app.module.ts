import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { KnexModule } from 'nest-knexjs';

import appConfig from './config/app.config';
import sqlConfig from './config/sql.config';
import redisConfig from './config/redis.config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import cookieConfig from './config/cookie.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { BullModule } from '@nestjs/bull';
import { RedisOptions } from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, cookieConfig, sqlConfig, redisConfig],
    }),
    LoggerModule.forRoot(),
    CacheModule.registerAsync<RedisOptions>({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore(config.get<RedisOptions>('redis')),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        config: {
          client: config.get<string>('sql.driver'),
          connection: {
            host: config.get<string>('sql.host'),
            port: config.get<number>('sql.port'),
            user: config.get<string>('sql.username'),
            password: config.get<string>('sql.password'),
            database: config.get<string>('sql.name'),
          },
          migrations: {
            directory: path.join(
              __dirname,
              'src',
              'database',
              'knex',
              'migrations',
            ),
            extension: 'ts',
          },
          seeds: {
            directory: path.join(__dirname, 'src', 'database', 'knex', 'seeds'),
            extension: 'ts',
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: config.get<RedisOptions>('redis'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(
        helmet(),
        cookieParser(this.config.get('app.secret')),
        CsrfMiddleware,
      )
      .forRoutes('*');
  }
}
