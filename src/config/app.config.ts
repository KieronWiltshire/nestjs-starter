import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  domain: (process.env.APP_DOMAIN || 'localhost').replace(/\/$/, ''),
  port: parseInt(process.env.APP_PORT, 10) || 80,
  secret: process.env.APP_SECRET,
  environment: process.env.NODE_ENV || 'local',
  debug: ['local', 'development'].includes(process.env.NODE_ENV?.toLowerCase()),
  instanceId: process.env.APP_INSTANCE_ID,
}));
