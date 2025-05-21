import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwksUri: process.env.AUTH_JWKS_URI,
}));
