import { Inject, MiddlewareConsumer, Module, NestModule, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { KnexModule } from 'nest-knexjs';
import appConfig from '@/config/app.config';
import sqlConfig from '@/config/sql.config';
import redisConfig from '@/config/redis.config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { SocketModule } from '@/modules/socket/socket.module';
import helmet from 'helmet';
import { AllExceptionFilter } from '@/filters/all-exception.filter';
import cookieConfig from '@/config/cookie.config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { KeyvAnyRedis } from 'keyv-anyredis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import authConfig from '@/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import Keyv from 'keyv';
import { RedisModule } from '@/redis/redis.module';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/redis/constants/redis.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, cookieConfig, sqlConfig, redisConfig, authConfig],
    }),
    LoggerModule.forRoot(),
    EventEmitterModule.forRoot(),
    RedisModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService, redisClient: Redis) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvAnyRedis(redisClient),
            }),
          ],
        };
      },
      inject: [ConfigService, REDIS_CLIENT],
      isGlobal: true,
    }),
    KnexModule.forRootAsync({
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
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('app.secret'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    SocketModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(helmet()).forRoutes('*');
  }
}
