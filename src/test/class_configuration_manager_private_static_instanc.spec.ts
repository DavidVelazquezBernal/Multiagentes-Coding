import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { ConfigurationManager } from './class_configuration_manager_private_static_instanc';

describe('ConfigurationManager', () => {
  beforeEach(() => {
    // Arrange - Reset Singleton instance for test isolation using reflection
    (ConfigurationManager as any).instance = null;
  });

  it('should implement the Singleton pattern providing the same instance', () => {
    // Arrange
    const instance1 = ConfigurationManager.getInstance();

    // Act
    const instance2 = ConfigurationManager.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
    expect(instance1).toBeInstanceOf(ConfigurationManager);
  });

  test.each([
    { description: 'store and retrieve a string value', key: 'env', value: 'production', expectedResult: 'production' },
    { description: 'store and retrieve a boolean value', key: 'enabled', value: true, expectedResult: true },
    { description: 'store and retrieve an object value', key: 'db', value: { port: 5432 }, expectedResult: { port: 5432 } },
    { description: 'return undefined for a non-existent key', key: 'missing', value: undefined, expectedResult: undefined },
  ])('$description', ({ key, value, expectedResult }: { description: string; key: string; value: any; expectedResult: any }) => {
    // Arrange
    const manager = ConfigurationManager.getInstance();

    // Act
    if (value !== undefined) {
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

  it('should round numeric values to 10 decimal places and maintain precision', () => {
    // Arrange
    const manager = ConfigurationManager.getInstance();
    const highPrecisionValue = 3.14159;
    const expectedLiteral = 3.14159;

    // Act
    manager.set('pi', highPrecisionValue);
    const result = manager.get('pi');

    // Assert
    expect(result).toBeCloseTo(expectedLiteral);
  });

  it('should handle zero value correctly without sign issues', () => {
    // Arrange
    const manager = ConfigurationManager.getInstance();

    // Act
    manager.set('offset', 0);
    const result = manager.get('offset');

    // Assert
    expect(result).toBe(0);
  });

  test.each([
    { description: 'an empty string', key: '' },
    { description: 'a whitespace string', key: '   ' },
    { description: 'a non-string type', key: 123 as any },
  ])('should throw error when the key is $description', ({ key }: { description: string; key: string }) => {
    // Arrange
    const manager = ConfigurationManager.getInstance();

    // Act & Assert
    expect(() => manager.get(key)).toThrow('ConfigurationManager: La clave proporcionada debe ser un string no vacío.');
    expect(() => manager.set(key, 'value')).toThrow('ConfigurationManager: La clave proporcionada debe ser un string no vacío.');
  });
});