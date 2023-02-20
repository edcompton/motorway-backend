import app from './app';
import pool from './db';
import * as redis from 'redis';
import { RedisClientType } from 'redis';

let redisClient: RedisClientType;

const startServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    await pool.connect();
    console.log('Connected to database pool.');

    redisClient = redis.createClient({ url: process.env.REDIS_URL });

    redisClient.on('error', (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
    console.log('Connected to Redis client.');

    app.listen(port, () => {
      console.log(`Server listening on port ${port}.`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

export { redisClient };
