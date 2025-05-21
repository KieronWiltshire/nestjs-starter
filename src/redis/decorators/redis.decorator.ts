import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '@/redis/constants/redis.constants';

export const InjectRedis = () => Inject(REDIS_CLIENT);
