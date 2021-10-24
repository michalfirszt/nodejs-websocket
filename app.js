import dotenv from 'dotenv';
import WebSocket, { WebSocketServer } from 'ws';

dotenv.config();

const wsServer = new WebSocketServer({ port: process.env.WS_PORT });

wsServer.on('connection', (ws) => {
  console.log(`New connection ${new Date()}`);

  ws.on('message', (action) => {
    const { type, payload } = JSON.parse(action);

    switch (type) {
      case 'message': {
        wsServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'message',
                payload,
              })
            );
          }
        });

        break;
      }
      case 'typing': {
        wsServer.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'typing',
                payload: {
                  user: { name: payload.currentUser.name },
                },
              })
            );
          }
        });

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
