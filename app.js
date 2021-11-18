import dotenv from 'dotenv';
import WebSocket, { WebSocketServer } from 'ws';
import axios from 'axios';

dotenv.config();

// eslint-disable-next-line no-undef
const wsServer = new WebSocketServer({ port: process.env.WS_PORT });

wsServer.on('connection', (ws) => {
  console.log(`New connection ${new Date()}`);

  ws.on('message', (action) => {
    const { type, payload } = JSON.parse(action);
    let messageId;

    switch (type) {
      case 'connect': {
        if (payload.channelId) {
          ws.channelId = payload.channelId;
        }

        break;
      }
      case 'message': {
        messageId = Date.now();

        wsServer.clients.forEach((client) => {
          if (
            client.channelId === payload.channelId &&
            client.readyState === WebSocket.OPEN
          ) {
            client.send(
              JSON.stringify({
                type: 'message',
                payload: {
                  id: messageId,
                  ...payload,
                },
              })
            );
          }
        });

        axios.post('http://localhost:4000/messages', {
          id: messageId,
          channelId: payload.channelId,
          content: payload.content,
          username: payload.username,
        });

        messageId = undefined;
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
