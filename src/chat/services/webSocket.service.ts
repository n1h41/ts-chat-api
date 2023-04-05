import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { verifyJwt } from '../../utils/jwt';
import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../auth/models/user.model';
import { IncomingMessage } from 'http';
import WebSocketWithUserId from '../interfaces/webSocketWithUserId.interface';
import { ChatController } from '../controllers/chat.controller';
import { Msg } from '../types/msg.type';

export class WebSocketService {
    constructor(
        private chatController: ChatController,
        private wss: WebSocket.Server,
    ) {
        this.init();
    }

    private init() {
        this.wss.on('connection', (ws: WebSocketWithUserId, req: IncomingMessage) => {
            const accessToken = req.headers.authorization?.split(' ')[1];
            if (!accessToken) {
                ws.close();
                return;
            }
            const user = verifyJwt<DocumentType<User>>(accessToken, "accessTokenPublicKey")
            if (!user) {
                ws.close();
                return;
            }
            const userId = user._id!;
            ws.userId = userId;
            this.chatController.addWebSocketConnection(ws);
            ws.on('message', (message) => {
                this.chatController.handleMessage(ws, JSON.parse(message.toString()) as Msg);
            });
            ws.on('close', () => {
                this.chatController.removeWebSocketConnection(ws);
            });
        });
    }
}

