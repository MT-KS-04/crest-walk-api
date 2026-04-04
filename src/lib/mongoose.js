/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import mongoose from 'mongoose';

/**
 * Custom Modules
 */
import config from '../config/env.config.js';
import logger from './winston.js';

/**
 * Client Options
 */
const clientOptions = {
  dbName: 'crest-walk-api',
  appName: 'Crest Walk',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

const connectToData = async () => {
  if (!config.MONGOOSE_URL) {
    throw new Error('MONGOOSE URL is not set in environment variables');
  }
  try {
    await mongoose.connect(config.MONGOOSE_URL, clientOptions);
    logger.info('✅ Connected to MongoDB successfully.', {
      url: config.MONGOOSE_URL,
      option: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Failed to connect to MongoDB!', error.message);
      throw error;
    }

    logger.error('❌ Failed to connect to MongoDB!', error.message);
  }
};

const disconnectFromData = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✅ Disconnect the database successfully.', {
      url: config.MONGOOSE_URL,
      option: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.warn('⚠️ Error disconnect from the database.', err);
  }
};

export { connectToData, disconnectFromData };
