import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import 'express-async-errors';

import errorHandler from './middleware/error';
import router from './routes';

const app = express();

dotenv.config();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// Middleware for handling errors
app.use(errorHandler);

export default app;
