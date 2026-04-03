import config from '../config/env.config.js';

describe('Environment Configuration', () => {
  test('should have a default PORT if not specified', () => {
    expect(config.PORT).toBeDefined();
  });

  test('should have a default NODE_ENV', () => {
    expect(['development', 'production', 'test']).toContain(config.NODE_ENV);
  });
});
