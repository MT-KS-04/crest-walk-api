/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

export const genUsername = () => {
  const usernamePerfix = 'user';
  const randomChars = Math.random().toString(36).slice(2);
  const username = usernamePerfix + '-' + randomChars;
  return username;
};

export const genResetToken = () => {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
};
