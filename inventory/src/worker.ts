// src/worker.ts
import amqp from 'amqplib';
import WebSocket from 'ws';

const QUEUE_NAME = 'cardmarket-sell';
const wsServerUrl = 'ws://127.0.0.1:4000';

export async function startWorker() {
    const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1);

    console.log(`[Worker] Listening for messages in ${QUEUE_NAME}...`);

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            const payload = JSON.parse(msg.content.toString());
            console.log(`[Worker] Processing card: ${JSON.stringify(payload)}`);

            const ws = new WebSocket(wsServerUrl);

            ws.on('open', async () => {
                try {
                    console.log(`[Worker] Done processing card ${payload.cardId}`);
                    channel.ack(msg);
                } catch (err) {
                    console.error(`[Worker] Error processing card:`, err);
                    ws.send(JSON.stringify({ cardId: payload.cardId, error: err }));
                    channel.nack(msg, false, false);
                } finally {
                    ws.close();
                }
            });

            ws.on('error', (err) => {
                console.error(`[Worker] WebSocket error:`, err);
            });
        }
    }, { noAck: false });
}
