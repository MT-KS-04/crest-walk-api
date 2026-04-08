/**
 * @file server.js
 * @description File init and main setup for Backend API.
 * @author MK-TS-04
 * @copyright 2026
 * @license Apache 2.0
 */

/**
 * Node Modules
 */
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

/**
 * Custom Modules
 */
import limiter from './lib/rate_limit.js';
import logger from './lib/winston.js';
import config from './config/env.config.js';
import { connectToData, disconnectFromData } from './lib/mongoose.js';

/**
 * Routers
 */
import routerV1 from './router/index.router.js';

// Init setup
const app = express();

// Init Cors
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }),
);

// Enable json
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
app.use(express.urlencoded({ extended: true }));

// Init cookie
app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024,
  }),
);

// Enable helmet
app.use(helmet());

// Init rateLimit
app.use(limiter);

(async () => {
  try {
    await connectToData();

    // Init Router v1
    app.use('/api/v1/', routerV1);

    app.listen(config.PORT, () => {
      logger.info('✅ Server is running ....');
      logger.info(`✅ Link-Api: http://localhost:${config.PORT}/`);
    });
  } catch (error) {
    logger.error('❌ Failed to start the Server', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

// Handles server shutdown
const handelServerShutdown = async () => {
  try {
    await disconnectFromData();
    logger.info('⭕ Shutting down server...');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown!');
  }
};

// Listens for termination signals (`SIGTERM` and `SIGINT`).
process.on('SIGTERM', handelServerShutdown);
process.on('SIGINT', handelServerShutdown);
