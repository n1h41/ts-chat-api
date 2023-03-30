import { IncomingMessage } from 'http';
import WebSocket from 'ws'
import crypto from 'crypto'
import { createChatClient, findChatClientByUserId, updateChatClient } from '../chat/services/chat.service';
import { findUserById } from '../auth/services/user.service';

interface SClient {
  socketId: string;
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
      socketId: crypto.randomUUID(),
      userId: req.url!.replace('/?id=', ''),
      c: conn
    }
    webSocketUsers.set(client.socketId, client)
    const user = await findUserById(client.userId)
    if (!user) {
      client.c.emit('Error: User for the given user id not found')
      client.c.close()
      return null
    }
    const chatClient = await findChatClientByUserId(client.userId)
    if (chatClient) {
      await updateChatClient(chatClient._id, client.socketId)
    } else {
      await createChatClient({ user: user, websocketId: client.socketId });
    }
    client.c.on("close", () => {
      webSocketUsers.delete(client.socketId);
    })
  }
}

export default new Sockets()