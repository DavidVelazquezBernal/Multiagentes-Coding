import { describe, it, test, expect, beforeEach } from 'vitest';
import { ConfigurationManager } from './configuration_manager_get_instance';

describe('ConfigurationManager', () => {
  const config = ConfigurationManager.getInstance();

  beforeEach(() => {
    // Arrange - Reset internal settings map before each test
    config.clear();
  });

  it('should maintain a single instance across multiple calls', () => {
    // Arrange & Act
    const instance1 = ConfigurationManager.getInstance();
    const instance2 = ConfigurationManager.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
  });

  test.each([
    { description: 'stores a string value', key: 'env', value: 'production', expected: 'production' },
    { description: 'stores a boolean value', key: 'debug', value: false, expected: false },
    { description: 'stores an object value', key: 'db', value: { port: 5432 }, expected: { port: 5432 } },
    { description: 'stores zero as a valid number', key: 'retries', value: 0, expected: 0 },
  ])('should persist different types: $description', ({ key, value, expected }: { description: string; key: string; value: any; expected: any }) => {
    // Act
    config.set(key, value);
    const result = config.get(key);

    // Assert
    expect(result).toEqual(expected);
  });

  it('should handle numerical precision and rounding', () => {
    // Arrange
    const key = 'threshold';
    const value = 0.12346; // Testing value close to the 5 decimal limit
    const expected = 0.12346;

    // Act
    config.set(key, 0.12346); // Original logic rounds to 10 digits
    const result = config.get(key);

    // Assert
    expect(result).toBeCloseTo(0.12346);
  });

  test.each([
    { description: 'throw when key is an empty string', key: '', value: 'val', method: 'set' },
    { description: 'throw when key is not a string in set', key: 100 as any, value: 'val', method: 'set' },
    { description: 'throw when key is not a string in get', key: null as any, value: null, method: 'get' },
  ])('should $description', ({ key, value, method }: { description: string; key: string; value: any; method: string }) => {
    // Act & Assert
    if (method === 'set') {
      expect(() => config.set(key, value)).toThrow();
    } else {
      expect(() => config.get(key)).toThrow();
    }
  });

  it('should return undefined when retrieving a non-existent key', () => {
    // Act
    const result = config.get('non_existent_key');

    // Assert
    expect(result).toBeUndefined();
  });

  it('should clear all stored configuration settings', () => {
    // Arrange
    config.set('apiKey', 'secret_123');
    config.set('timeout', 5000);

    // Act
    config.clear();

    // Assert
    expect(config.get('apiKey')).toBeUndefined();
    expect(config.get('timeout')).toBeUndefined();
  });
});