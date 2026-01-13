import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { ConfigurationManager } from './class_configuration_manager_private_static_instanc';

describe('ConfigurationManager', () => {
  beforeEach(() => {
    // Arrange - Reset Singleton instance for isolation using reflection
    (ConfigurationManager as any).instance = undefined;
  });

  it('should implement the Singleton pattern returning the same instance', () => {
    // Arrange
    const instance1 = ConfigurationManager.getInstance();

    // Act
    const instance2 = ConfigurationManager.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
  });

  test.each([
    { description: 'store string values', key: 'env', value: 'production', expectedResult: 'production' },
    { description: 'store integer values', key: 'port', value: 3000, expectedResult: 3000 },
    { description: 'store boolean values', key: 'active', value: true, expectedResult: true },
    { description: 'store object values', key: 'db', value: { host: 'localhost' }, expectedResult: { host: 'localhost' } },
    { description: 'return undefined for non-existent keys', key: 'unknown', value: null, expectedResult: undefined }
  ])('$description', ({ key, value, expectedResult }: { description: string; key: string; value: any; expectedResult: any }) => {
    // Arrange
    const manager = ConfigurationManager.getInstance();

    // Act
    if (value !== null) {
      manager.set(key, value);
    }
    const result = manager.get(key);

    // Assert
    if (typeof expectedResult === 'object' && expectedResult !== null) {
      expect(result).toEqual(expectedResult);
    } else {
      expect(result).toBe(expectedResult);
    }
  });

  it('should handle floating point precision rounding', () => {
    // Arrange
    const manager = ConfigurationManager.getInstance();
    const preciseValue = 1.23456;

    // Act
    manager.set('version', preciseValue);
    const result = manager.get('version');

    // Assert
    expect(result).toBeCloseTo(1.23456);
  });

  test.each([
    { description: 'an empty string', key: '' },
    { description: 'only whitespace', key: '   ' },
    { description: 'a non-string type', key: 555 as unknown as string }
  ])('should throw error when key is $description', ({ key }: { description: string; key: string }) => {
    // Arrange
    const manager = ConfigurationManager.getInstance();
    const expectedError = 'La clave (key) debe ser un string no vacío.';

    // Act & Assert
    expect(() => manager.get(key)).toThrow(expectedError);
    expect(() => manager.set(key, 'someValue')).toThrow(expectedError);
  });
});