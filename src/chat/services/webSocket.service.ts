import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { verifyJwt } from '../../utils/jwt';
import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../auth/models/user.model';
import { IncomingMessage } from 'http';
import WebSocketWithUserId from '../interfaces/webSocketWithUserId.interface';
import { ChatController } from '../controllers/chat.controller';

export class WebSocketService {
    constructor(
        private chatController: ChatController,
        private wss: WebSocket.Server,
    ) {
        this.init();
    }

    private init() {
        this.wss.on('connection', (ws: WebSocketWithUserId, req: IncomingMessage) => {
            // Extract JWT from headers
            const accessToken = req.headers.authorization?.split(' ')[1];

            if (!accessToken) {
                // If no token is provided, reject the connection
                ws.close();
                return;
            }

            // Verify the JWT
            const user = verifyJwt<DocumentType<User>>(accessToken, "accessTokenPublicKey")

            if (!user) {
                // If the JWT is invalid, reject the connection
                ws.close();
                return;
            }

            // Extract the user ID from the decoded JWT
            const userId = user._id!;

            // Associate the WebSocket connection with the authenticated user
            ws.userId = userId;

            // this.chatController.addWebSocketConnection(ws);

            // Handle incoming messages from the client
            ws.on('message', (message) => {
                this.chatController.handleMessage(ws, JSON.stringify(message));
            });

            // Remove the WebSocket connection when it's closed
            ws.on('close', () => {
                this.chatController.removeWebSocketConnection(ws);
            });
        });
    }
}

