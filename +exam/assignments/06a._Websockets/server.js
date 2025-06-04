import { WebSocketServer } from "ws";

const PORT = process.PORT ?? 8080;

const server = new WebSocketServer({ port: PORT });

server.on('connection', (ws) => {
	ws.on('message', (message) => {
		console.log('Recived message from he client:', String(message));

		server.clients.forEach(client => client.send(String(message)))
	});

	ws.on('close', () => {
		console.log('Client disconnected:', server.clients.size)
	});
});

