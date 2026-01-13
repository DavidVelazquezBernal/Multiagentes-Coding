import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { ConfigurationManager } from './class_configuration_manager_private_static_instanc';

describe('ConfigurationManager', () => {
  let manager: ConfigurationManager;

  beforeEach(() => {
    // Arrange: Get instance and clear internal state using reflection to ensure test isolation
    manager = ConfigurationManager.getInstance();
    (manager as any).settings.clear();
  });

  it('should ensure getInstance returns the same singleton instance', () => {
    // Arrange
    const instance1 = ConfigurationManager.getInstance();
    const instance2 = ConfigurationManager.getInstance();

    // Act & Assert
    expect(instance1).toBe(instance2);
  });

  test.each([
    { description: 'empty string', key: '' },
    { description: 'whitespace string', key: '   ' },
    { description: 'non-string type', key: 123 as any },
  ])('should throw error when key is $description', ({ key }: { description: string; key: string }) => {
    // Arrange
    const expectedError = "La clave de configuración debe ser un string válido.";

    // Act & Assert
    expect(() => manager.set(key, 'value')).toThrow(expectedError);
    expect(() => manager.get(key)).toThrow(expectedError);
  });

  test.each([
    { description: 'a string', value: 'production' },
    { description: 'an object', value: { port: 8080 } },
    { description: 'null', value: null },
    { description: 'zero', value: 0 },
  ])('should store and retrieve $description correctly', ({ value }: { description: string; value: any }) => {
    // Arrange
    const key = 'settingKey';

    // Act
    manager.set(key, value);
    const result = manager.get(key);

    // Assert
    expect(result).toEqual(value);
  });

  it('should handle numeric precision for floating point numbers', () => {
    // Arrange
    const key = 'version';
    const value = 1.12345;

    // Act
    manager.set(key, value);
    const result = manager.get(key);

    // Assert
    expect(result).toBeCloseTo(1.12345);
  });

  it('should return undefined when retrieving a non-existent key', () => {
    // Arrange
    const key = 'nonExistent';

    // Act
    const result = manager.get(key);

    // Assert
    expect(result).toBeUndefined();
  });
});