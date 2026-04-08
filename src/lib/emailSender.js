/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from './winston.js';

const getEmailProvider = () => {
  return (process.env.EMAIL_PROVIDER || '').trim().toLowerCase();
};

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const provider = getEmailProvider();
  const from = process.env.EMAIL_FROM;

  if (!provider || provider === 'noop') {
    return;
  }

  if (provider === 'console') {
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Password reset email (console provider)', { to, resetUrl });
    } else {
      logger.info('Password reset email (console provider)', { to });
    }
    return;
  }

  if (provider === 'resend') {
    const apiKey = process.env.EMAIL_API_KEY;
    if (!apiKey || !from) {
      throw new Error(
        'Missing EMAIL_API_KEY or EMAIL_FROM for resend provider',
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: 'Reset your password',
        text: `Reset your password using this link: ${resetUrl}`,
        html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      const error = new Error('Failed to send reset email');
      error.details = text;
      throw error;
    }

    return;
  }

  throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`);
};
