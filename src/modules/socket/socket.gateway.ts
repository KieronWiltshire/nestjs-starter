import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '@/modules/socket/types/authenticated-socket.interface';
import { AuthService } from '@/modules/auth/services/auth.service';
import { AuthType, type Auth } from '@/modules/auth/types/auth';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: AuthenticatedSocket) {
    const accessToken = client.handshake.auth?.access_token;

    let auth: Auth;

    if (accessToken) {
      try {
        auth = await this.authService.validateWebSocketAccessToken(accessToken);
      } catch (err) {
        client.disconnect();
      }
    } else {
      auth = {
        type: AuthType.Anonymous,
      };
    }

    client.user = auth;

    client.emit('auth_info', {
      authType: auth.type,
      userId: auth.type === 'anon' ? null : auth.user.id,
    });
  }
}
