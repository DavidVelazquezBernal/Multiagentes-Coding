import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigurationManager } from './class_configuration_manager_static_get_instance_co';

describe('ConfigurationManager', () => {
  let manager: ConfigurationManager;

  beforeEach(() => {
    // Arrange - Ensure a clean state before each test
    manager = ConfigurationManager.getInstance();
    manager.clear();
  });

  it('should implement the singleton pattern correctly', () => {
    // Arrange & Act
    const instance1 = ConfigurationManager.getInstance();
    const instance2 = ConfigurationManager.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
    expect(instance1).toBeInstanceOf(ConfigurationManager);
  });

  it.each([
    { description: 'store and retrieve a string', key: 'app_name', value: 'TestApp', expectedResult: 'TestApp' },
    { description: 'store and retrieve an integer', key: 'port', value: 8080, expectedResult: 8080 },
    { description: 'return undefined for non-existent keys', key: 'unknown', value: null, expectedResult: undefined },
  ])('should $description', ({ key, value, expectedResult }: { description: string; key: string; value: any; expectedResult: any }) => {
    // Act
    if (value !== null) {
      manager.set(key, value);
    }
    const result = manager.get(key);

    // Assert
    expect(result).toBe(expectedResult);
  });

  it('should apply numeric precision rounding to decimal values', () => {
    // Arrange
    const key = 'precision_test';
    const rawValue = 0.1 + 0.2; // 0.3
    const expected = 0.3;

    // Act
    manager.set(key, rawValue);
    const result = manager.get(key);

    // Assert
    expect(result).toBeCloseTo(expected);
  });

  it.each([
    { description: 'throw error for empty string key', key: '', value: 'data', method: 'set' },
    { description: 'throw error for non-string key in set', key: 123 as any, value: 'data', method: 'set' },
    { description: 'throw error for non-string key in get', key: { id: 1 } as any, value: null, method: 'get' },
  ])('should $description', ({ key, value, method }: { description: string; key: string; value: any; method: string }) => {
    // Act & Assert
    if (method === 'set') {
      expect(() => manager.set(key, value)).toThrow("ConfigurationManager: La clave debe ser un string no vacío.");
    } else {
      expect(() => manager.get(key)).toThrow("ConfigurationManager: La clave debe ser un string.");
    }
  });

  it('should remove all settings when clear is called', () => {
    // Arrange
    manager.set('key1', 'val1');
    manager.set('key2', 'val2');

    // Act
    manager.clear();

    // Assert
    expect(manager.get('key1')).toBe(undefined);
    expect(manager.get('key2')).toBe(undefined);
  });
});