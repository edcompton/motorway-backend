import app from './app';
import pool from './db';
import { PoolClient } from 'pg';

let pgClient: PoolClient;

const startServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    pgClient = await pool.connect();
    console.log('Connected to database.');

    app.listen(port, () => {
      console.log(`Server listening on port ${port}.`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

export { pgClient };
