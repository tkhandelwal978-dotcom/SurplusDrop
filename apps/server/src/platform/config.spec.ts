import { describe, expect, it } from 'vitest';
import { ConfigError, loadConfig } from './config.js';

const validEnv = {
  DATABASE_URL: 'postgres://user:s3cret@localhost:5432/db',
  REDIS_URL: 'redis://localhost:6379',
};

describe('loadConfig', () => {
  it('applies defaults for optional settings', () => {
    const config = loadConfig(validEnv);
    expect(config).toMatchObject({
      NODE_ENV: 'development',
      HOST: '127.0.0.1',
      PORT: 3000,
      LOG_LEVEL: 'info',
      CORS_ORIGINS: ['http://localhost:5173'],
    });
  });

  it('coerces PORT from a string and splits CORS_ORIGINS on commas', () => {
    const config = loadConfig({
      ...validEnv,
      PORT: '8080',
      CORS_ORIGINS: 'http://localhost:5173, https://surplusdrop.example',
    });
    expect(config.PORT).toBe(8080);
    expect(config.CORS_ORIGINS).toEqual(['http://localhost:5173', 'https://surplusdrop.example']);
  });

  it('names every missing or invalid variable', () => {
    const run = () => loadConfig({ PORT: 'not-a-number' });
    expect(run).toThrow(ConfigError);
    try {
      run();
    } catch (error) {
      const message = (error as ConfigError).message;
      expect(message).toContain('DATABASE_URL');
      expect(message).toContain('REDIS_URL');
      expect(message).toContain('PORT');
    }
  });

  it('never includes variable values in the error, because they can be secrets', () => {
    try {
      loadConfig({ ...validEnv, REDIS_URL: 'not a url with s3cret-value' });
      expect.unreachable('loadConfig should have thrown');
    } catch (error) {
      expect((error as ConfigError).message).not.toContain('s3cret');
    }
  });
});
