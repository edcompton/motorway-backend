import { Pool } from 'pg';
import redis, { RedisClientType } from 'redis';
import redisMock from 'redis-mock';

let redisClient: RedisClientType;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT),
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection to become available
});

export const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to database pool.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export const connectToRedis = async () => {
  try {
    if (process.env.REDIS_URL) {
      redisClient = redis.createClient({ url: process.env.REDIS_URL });

      await redisClient.connect();

      redisClient.on('error', (error) => console.error(`Error : ${error}`));

      redisClient.on('error', (error) => console.error(`Error : ${error}`));

      console.log('Connected to Redis client.');
    } else {
      redisClient = redisMock.createClient();
    }
  } catch (err) {
    console.error(err);
  }
};

export { pool, redisClient };
