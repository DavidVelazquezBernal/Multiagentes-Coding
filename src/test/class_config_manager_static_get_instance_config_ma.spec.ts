import { describe, it, test, expect } from 'vitest';
import { ConfigManager } from './class_config_manager_static_get_instance_config_ma';

describe('ConfigManager', () => {
  it('should maintain a single instance identity (Singleton)', () => {
    // Arrange
    const instance1 = ConfigManager.getInstance();
    
    // Act
    const instance2 = ConfigManager.getInstance();
    
    // Assert
    expect(instance1).toBe(instance2);
  });

  it('should not have a clear method according to formal requirements', () => {
    // Arrange
    const instance = ConfigManager.getInstance() as any;
    
    // Act & Assert
    expect(instance.clear).toBeUndefined();
  });

  test.each([
    { description: 'store integer', key: 'port', value: 8080, expected: 8080 },
    { description: 'preserve floating point precision', key: 'version', value: 1.123, expected: 1.123 },
    { description: 'store string configuration', key: 'mode', value: 'production', expected: 'production' },
    { description: 'store boolean values', key: 'debug', value: false, expected: false },
  ])('should correctly set and get: $description', ({ key, value, expected }: { key: string; value: any; expected: any }) => {
    // Arrange
    const manager = ConfigManager.getInstance();
    
    // Act
    manager.set(key, value);
    const result = manager.get(key);
    
    // Assert
    if (typeof expected === 'number' && !Number.isInteger(expected)) {
      expect(result).toBeCloseTo(expected);
    } else {
      expect(result).toBe(expected);
    }
  });

  test.each([
    { description: 'empty string key', key: '' },
    { description: 'whitespace key', key: '   ' },
    { description: 'non-string key type', key: null as any },
  ])('should throw error for invalid key: $description', ({ key }: { key: string }) => {
    // Arrange
    const manager = ConfigManager.getInstance();
    
    // Act & Assert
    expect(() => manager.set(key, 'value')).toThrow('La clave debe ser un string no vacío.');
  });

  it('should return undefined when retrieving a key that was never set', () => {
    // Arrange
    const manager = ConfigManager.getInstance();
    
    // Act
    const result = manager.get('unknown_key_' + Math.random());
    
    // Assert
    expect(result).toBeUndefined();
  });
});