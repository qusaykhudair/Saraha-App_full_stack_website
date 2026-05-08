import { createClient } from 'redis';

// Create a Redis client
export const redisClient = createClient(
    {
        // put your Redis configuration here if needed, for example:

        url: "rediss://default:gQAAAAAAAaR7AAIgcDJkMWIyYTA2NjEyNGU0MzUxYmJkNmUzN2ZjYmUxOGU5Yw@wise-titmouse-107643.upstash.io:6379",
    }
);
// Connect to Redis
export function connectRedis() {
     redisClient.connect()
        .then(() => console.log('✅ Connected to Redis'))
        .catch((err) => console.error('❌ Redis Connection Error:', err.message));
}