import { IncomingMessage } from 'http';
import WebSocket from 'ws'
import crypto from 'crypto'
import { findUserById } from '../auth/services/user.service';
import { verifyJwt } from './jwt';
import { User } from '../auth/models/user.model';
import { DocumentType } from '@typegoose/typegoose';

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
    if (!req.url!.includes('/?accessToken=')) {
      client.close()
      return null
    }
    const accessToken = req.url!.replace('/?accessToken=', '')
    const user = verifyJwt<DocumentType<User>>(accessToken, "accessTokenPublicKey")
    if (!user) {
      client.emit('Error: User for the given user id not found')
      client.close()
      return null
    }
    client.userId = user.id
    webSocketUsers.set(client.userId, client)
    client.on("close", () => {
      webSocketUsers.delete(client.userId);
    })
  }
}

export default new Sockets()