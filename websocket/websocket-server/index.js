const WebSocket = require('ws');

const port = process.env.PORT || 4000;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws, req) => {
    ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));

    const ip = req.socket.remoteAddress;
    console.log(`[WebSocket] Client connected from IP: ${ip}`);

    ws.on('message', (message) => {
        const jsonString = message.toString();
        console.log('[WebSocket] Received:', jsonString);

        try {
            const data = JSON.parse(jsonString);
            console.log('[WebSocket] Parsed JSON:', data);

            // Diffuser à tous les clients connectés
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });

        } catch (error) {
            console.error('[WebSocket] Invalid JSON:', error);
        }
    });

    ws.on('close', () => {
        console.log('[WebSocket] Client disconnected');
    });
});

console.log(`[WebSocket] Server listening on ws://localhost:${port}`);
