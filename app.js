import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';

dotenv.config();

const wsServer = new WebSocketServer({ port: process.env.WS_PORT });

wsServer.on('connection', (ws) => {
  console.log(`New connection ${new Date()}`);
});
