// Load dotenv module before importing config module
import dotenv from "dotenv"
dotenv.config()

import http from 'http'
import log from './utils/logger';
import config from 'config';
import connectToDatabase from './utils/connectToDb';
import createServer from './utils/server';


const server = http.createServer(createServer());
// const app = createServer()

const port = config.get('port');

server.listen(port, async () => {
  log.info('App launched at http://localhost:3000');
  await connectToDatabase();
});
