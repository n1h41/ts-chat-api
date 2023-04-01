import { IncomingMessage } from 'http';
import WebSocket from 'ws'
import crypto from 'crypto'
import { findUserById } from '../auth/services/user.service';

interface SClient {
  userId: string;
  c: WebSocket;
}

export let webSocketUsers = new Map<string, SClient>();

class Sockets {

  public async onConnection(conn: WebSocket, req: IncomingMessage) {
    if (!req.url!.includes('/?id=')) {
      conn.close()
      return null
    }
    const client: SClient = {
      userId: req.url!.replace('/?id=', ''),
      c: conn
    }
    const user = await findUserById(client.userId)
    if (!user) {
      client.c.emit('Error: User for the given user id not found')
      client.c.close()
      return null
    }
    webSocketUsers.set(client.userId, client)
    client.c.on("close", () => {
      webSocketUsers.delete(client.userId);
    })
  }
}

export default new Sockets()