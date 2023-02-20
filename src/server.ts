import app from './app';
import { connectToDatabase, connectToRedis } from './db';

const startServer = async () => {
  const port = process.env.PORT || 3000;

  await connectToDatabase();
  await connectToRedis();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
