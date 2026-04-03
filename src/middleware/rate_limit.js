/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    'You have sent too many requests in a given period of time, please try again later!',
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
