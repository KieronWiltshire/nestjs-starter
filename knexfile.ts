import { ConfigService, ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as path from 'path';
import databaseConfig from './src/config/sql.config';

module.exports = async () => {
  const app = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    {
      logger: ['error', 'warn'],
    },
  );

  const config = app.get(ConfigService);

  return {
    client: config.get<string>('sql.driver'),
    connection: {
      host: config.get<string>('sql.host'),
      port: config.get<number>('sql.port'),
      user: config.get<string>('sql.username'),
      password: config.get<string>('sql.password'),
      database: config.get<string>('sql.name'),
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'database', 'knex', 'migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'database', 'knex', 'seeds'),
    },
  };
};
