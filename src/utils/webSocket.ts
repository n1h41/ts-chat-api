import { IncomingMessage } from 'http';
import WebSocket from 'ws'
import crypto from 'crypto'
import { findUserById } from '../auth/services/user.service';

interface ExtWebSocket extends WebSocket {
  userId: string
}

interface SClient {
  userId: string;
  c: WebSocket;
}

export let webSocketUsers = new Map<string, ExtWebSocket>();

class Sockets {

  public async onConnection(client: ExtWebSocket, req: IncomingMessage) {
    if (!req.url!.includes('/?id=')) {
      client.close()
      return null
    }
    client.userId = req.url!.replace('/?id=', '')
    const user = await findUserById(client.userId)
    if (!user) {
      client.emit('Error: User for the given user id not found')
      client.close()
      return null
    }
    webSocketUsers.set(client.userId, client)
    client.on("close", () => {
      webSocketUsers.delete(client.userId);
    })
  }
}

export default new Sockets()