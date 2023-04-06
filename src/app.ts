// Load dotenv module before importing config module
import dotenv from "dotenv"
dotenv.config()

import http from 'http'
import log from './utils/logger';
import config from 'config';
import { WebSocketServer } from 'ws';
import connectToDatabase from './utils/connectToDb';
import createServer from './utils/server';
import { WebSocketService } from "./chat/services/webSocket.service";
import { ChatController } from "./chat/controllers/chat.controller";

const app = createServer()

const server = http.createServer(app);

const port = config.get('port');

export const wss: WebSocketServer = new WebSocketServer({ server })

new WebSocketService(ChatController.Instance, wss)

server.listen(port)

server.on("listening", async () => {
  log.info('App launched at http://localhost:3000')
  await connectToDatabase();
})

export { server }