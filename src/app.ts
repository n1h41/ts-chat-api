// Load dotenv module before importing config module
import dotenv from "dotenv"
dotenv.config()

import http from 'http'
import log from './utils/logger';
import config from 'config';
import { WebSocketServer } from 'ws';
import connectToDatabase from './utils/connectToDb';
import createServer from './utils/server';
import WebSockets from './utils/webSocket'
import Sockets from "./utils/webSocket";

const app = createServer()

const server = http.createServer(app);

const port = config.get('port');

export const wss: WebSocketServer = new WebSocketServer({ server })

wss.on('connection', Sockets.onConnection);

server.listen(port)

server.on("listening", () => {
  log.info('App launched at http://localhost:3000')
})
//server.listen(port, async () => {
//  log.info('App launched at http://localhost:3000');
//  await connectToDatabase();
//});
