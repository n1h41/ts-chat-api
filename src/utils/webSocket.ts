import WebSocket from 'ws';
import jwt from 'jsonwebtoken';

interface WebSocketWithUserId extends WebSocket {
  userId?: string;
}

export class WebSocketService {
  constructor(
    // private chatController: ChatController,
    private wss: WebSocket.Server,
    private secretKey: string
  ) {
    this.init();
  }

  private init() {
    this.wss.on('connection', (ws: WebSocketWithUserId, req) => {
      // Extract JWT from headers
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        // If no token is provided, reject the connection
        ws.close();
        return;
      }

      try {
        // Verify the JWT
        const decoded = jwt.verify(token, this.secretKey);

        // Extract the user ID from the decoded JWT
        const userId = (decoded as { userId: string }).userId;

        // Associate the WebSocket connection with the authenticated user
        ws.userId = userId;

        // Register the WebSocket connection with the chat controller
        // this.chatController.addWebSocketConnection(ws);

        // Handle incoming messages from the client
        ws.on('message', (message: string) => {
          // this.chatController.handleMessage(ws, message);
        });

        // Remove the WebSocket connection when it's closed
        ws.on('close', () => {
          // this.chatController.removeWebSocketConnection(ws);
        });
      } catch (error) {
        // If the JWT is invalid, reject the connection
        ws.close();
      }
    });
  }
}

