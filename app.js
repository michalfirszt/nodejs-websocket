import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';

dotenv.config();

// eslint-disable-next-line no-undef
const wsServer = new WebSocketServer({ port: process.env.WS_PORT });

wsServer.on('connection', (ws) => {
  console.log(`New connection ${new Date()}`);

  ws.on('message', (action) => {
    const { type, payload } = JSON.parse(action);

    switch (type) {
      case 'connect': {
        break;
      }
      case 'message': {
        break;
      }
      default: {
        console.log(`Unknown action type: ${type}`);
        break;
      }
    }
  });

  ws.on('close', () => {
    console.log(`Disconnect ${new Date()}`);
  });
});
