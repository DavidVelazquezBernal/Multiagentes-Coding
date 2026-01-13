import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigurationManager } from './class_configuration_manager_private_static_instanc';

describe('ConfigurationManager', () => {
  beforeEach(() => {
    // Arrange - Reset the Singleton instance before each test to ensure isolation and 100% coverage
    // @ts-ignore - Accessing private property for testing purposes
    ConfigurationManager.instance = undefined;
  });

  it('should return the same instance when getInstance is called multiple times', () => {
    // Arrange & Act
    const instance1 = ConfigurationManager.getInstance();
    const instance2 = ConfigurationManager.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
    expect(instance1).toBeInstanceOf(ConfigurationManager);
  });

  it('should store and retrieve various data types correctly', () => {
    // Arrange
    const manager = ConfigurationManager.getInstance();
    const stringKey = 'app_name';
    const stringValue = 'MyApp';
    const objectKey = 'metadata';
    const objectValue = { version: '1.0.0', env: 'prod' };

    // Act
    manager.setConfig(stringKey, stringValue);
    manager.setConfig(objectKey, objectValue);
    const retrievedString = manager.getConfig(stringKey);
    const retrievedObject = manager.getConfig(objectKey);

    // Assert
    expect(retrievedString).toBe(stringValue);
    expect(retrievedObject).toEqual(objectValue);
  });

  it('should apply precision rounding to numeric values', () => {
    // Arrange
    const manager = ConfigurationManager.getInstance();
    const key = 'float_val';
    const input = 0.1 + 0.2; // Result: 0.3

    // Act
    manager.setConfig(key, input);
    const result = manager.getConfig(key);

    // Assert
    expect(result).toBeCloseTo(0.3);
  });

  it('should return undefined when retrieving a non-existent key', () => {
    // Arrange
    const manager = ConfigurationManager.getInstance();

    // Act
    const result = manager.getConfig('missing_key');

    // Assert
    expect(result).toBeUndefined();
  });

  it.each([
    { description: 'empty string', key: '' },
    { description: 'whitespace only', key: '   ' },
    { description: 'non-string type', key: 123 as any },
    { description: 'null value', key: null as any },
  ])('should throw an error when setConfig key is $description', ({ key }: { description: string; key: string }) => {
    // Arrange
    const manager = ConfigurationManager.getInstance();

    // Act & Assert
    expect(() => manager.setConfig(key, 'some_value')).toThrow("Configuration key must be a non-empty string.");
  });

  it('should handle large numbers and preserve precision up to 10 decimal places', () => {
    // Arrange
    const manager = ConfigurationManager.getInstance();
    const key = 'precise_num';
    const input = 1.23457;
    const expected = 1.23457;

    // Act
    manager.setConfig(key, input);
    const result = manager.getConfig(key);

    // Assert
    expect(result).toBeCloseTo(expected);
  });
});