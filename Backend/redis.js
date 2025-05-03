import { createClient } from 'redis';

const client = createClient({
    url: 'redis://localhost:6379' // default Redis URL
});

// Handle error events
// client.on('error', (err) => console.error('Redis Client Error', err));

// Function to connect to Redis
async function connectRedis() {
    if (!client.isOpen) {
        // await client.connect();
    }
}

export { client, connectRedis };
