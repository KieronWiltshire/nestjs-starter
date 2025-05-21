import { Socket } from 'socket.io';
import { Auth } from '@/modules/auth/types/auth';

export interface AuthenticatedSocket extends Socket {
  user: Auth;
}
