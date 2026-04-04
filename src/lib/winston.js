/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import winston from 'winston';

/**
 * Custom Modules
 */
import config from '../config/env.config.js';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports = [];

// If the application is running in production, add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // Add color to log levels
        timestamp({ format: 'YYYY-MM-DD - hh:mm:ss A' }), // Add timestamp to log
        align(), // Align log message
        printf(({ timestamp, level, message, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';

          return stack
            ? `${timestamp} [${level}:${message}]\n\n => ERR:\n${stack}\n${metaStr}`
            : `${timestamp} [${level}:${message}${metaStr}]`;
        }),
      ),
    }),
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVELS || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV === 'test',
});

export default logger;
