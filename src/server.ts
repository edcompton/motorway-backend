import app from './app';
import pool from './db';
import { PoolClient } from 'pg';
import * as redis from 'redis';
import { RedisClientType } from 'redis';

let pgClient: PoolClient;
let redisClient: RedisClientType;

const startServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    pgClient = await pool.connect();
    console.log('Connected to database.');

    redisClient = redis.createClient({ url: process.env.REDIS_URL });

    redisClient.on('error', (error) => console.error(`Error : ${error}`));

    await redisClient.connect();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}.`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

export { pgClient, redisClient };
