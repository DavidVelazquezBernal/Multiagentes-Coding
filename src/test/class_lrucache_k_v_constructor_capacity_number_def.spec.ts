import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { LRUCache } from './class_lrucache_k_v_constructor_capacity_number_def';

describe('LRUCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throw error when initialized with non-positive capacity', () => {
    // Arrange
    const invalidCapacity = 0;

    // Act & Assert
    expect(() => new LRUCache(invalidCapacity)).toThrow('Cache capacity must be a positive number.');
  });

  test.each([
    {
      description: 'evicts the least recently used item when capacity is reached',
      capacity: 2,
      actions: (c: LRUCache<string, number>) => {
        c.put('a', 1);
        c.put('b', 2);
        c.put('c', 3);
      },
      key: 'a',
      expectedResult: undefined
    },
    {
      description: 'updates item recency when accessed via get',
      capacity: 2,
      actions: (c: LRUCache<string, number>) => {
        c.put('a', 1);
        c.put('b', 2);
        c.get('a');
        c.put('c', 3);
      },
      key: 'b',
      expectedResult: undefined
    },
    {
      description: 'handles updates to existing keys by moving them to front',
      capacity: 2,
      actions: (c: LRUCache<string, number>) => {
        c.put('a', 1);
        c.put('b', 2);
        c.put('a', 10);
        c.put('c', 3);
      },
      key: 'b',
      expectedResult: undefined
    }
  ])('$description', ({ capacity, actions, key, expectedResult }: { description: string; capacity: number; actions: (c: LRUCache<string, number>) => void; key: string; expectedResult: number | undefined }) => {
    // Arrange
    const cache = new LRUCache<string, number>(capacity);

    // Act
    actions(cache);

    // Assert
    expect(cache.get(key)).toBe(expectedResult);
  });

  it('should handle TTL expiration both lazily and specifically', () => {
    // Arrange
    const cache = new LRUCache<string, number>(5, 100);
    cache.put('item1', 10);
    cache.put('item2', 20, 50);

    // Act
    vi.advanceTimersByTime(60);
    const result1 = cache.get('item1');
    const result2 = cache.get('item2');

    // Assert
    expect(result1).toBe(10);
    expect(result2).toBe(undefined);
  });

  it('should prune all expired entries and clear the cache completely', () => {
    // Arrange
    const cache = new LRUCache<string, number>(10, 50);
    cache.put('a', 1);
    cache.put('b', 2);

    // Act
    vi.advanceTimersByTime(100);
    cache.prune();
    const sizeAfterPrune = cache.size;
    cache.put('c', 3);
    cache.clear();

    // Assert
    expect(sizeAfterPrune).toBe(0);
    expect(cache.size).toBe(0);
    expect(cache.get('c')).toBe(undefined);
  });

  it('should handle numeric precision for expiry calculations with decimals', () => {
    // Arrange
    const cache = new LRUCache<string, number>(5);
    const ttl = 0.55555;

    // Act
    cache.put('key_precision', 99, ttl);
    vi.advanceTimersByTime(1);
    const result = cache.get('key_precision');

    // Assert
    expect(result).toBe(undefined);
    expect(cache.size).toBe(0);
  });
});