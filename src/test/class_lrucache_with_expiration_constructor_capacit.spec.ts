import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { LRUCacheWithExpiration } from './class_lrucache_with_expiration_constructor_capacit';

describe('LRUCacheWithExpiration', () => {
    // Arrange: Set up fake timers for consistent time management across tests
    beforeEach(() => {
        vi.useFakeTimers();
        // Set a fixed starting point for Date.now() for reproducible tests.
        // It's crucial for expiration logic to have a known 'now'.
        vi.setSystemTime(new Date(2023, 1, 1, 10, 0, 0));
    });

    // Arrange: Restore real timers after each test to avoid interference
    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize correctly with valid parameters', () => {
        // Arrange
        const capacity = 5;
        const defaultExpiration = 1000; // 1 second

        // Act
        const cache = new LRUCacheWithExpiration(capacity, defaultExpiration);

        // Assert
        expect(cache).toBeDefined();
        // Indirectly verify internal setup by performing a basic operation
        cache.put('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');
    });

    test.each([
        { description: 'should throw error for zero capacity', capacity: 0, defaultExpiration: undefined, expectedError: 'Capacity must be a positive integer.' },
        { description: 'should throw error for negative capacity', capacity: -1, defaultExpiration: undefined, expectedError: 'Capacity must be a positive integer.' },
        { description: 'should throw error for non-integer capacity', capacity: 1.5, defaultExpiration: undefined, expectedError: 'Capacity must be a positive integer.' },
        { description: 'should throw error for zero defaultExpirationMs', capacity: 1, defaultExpiration: 0, expectedError: 'Default expiration time (if provided) must be a positive integer in milliseconds.' },
        { description: 'should throw error for negative defaultExpirationMs', capacity: 1, defaultExpiration: -100, expectedError: 'Default expiration time (if provided) must be a positive integer in milliseconds.' },
        { description: 'should throw error for non-integer defaultExpirationMs', capacity: 1, defaultExpiration: 100.5, expectedError: 'Default expiration time (if provided) must be a positive integer in milliseconds.' },
    ])('constructor $description', ({ capacity, defaultExpiration, expectedError }) => {
        // Arrange, Act & Assert
        expect(() => {
            new LRUCacheWithExpiration(capacity, defaultExpiration);
        }).toThrow(expectedError);
    });

    it('should handle put, get, update, eviction, and various value types', () => {
        // Arrange
        const cache = new LRUCacheWithExpiration(2); // Capacity 2

        // Act & Assert - Initial puts with different value types
        cache.put('string', 'hello');
        cache.put('number', 123);
        // At this point, LRU: 'string', MRU: 'number'. Cache size = 2.

        // Act & Assert - Eviction
        cache.put('boolean', true); // Capacity reached, 'string' (LRU) should be evicted.
        // LRU: 'number', MRU: 'boolean'. Cache size = 2.
        expect(cache.get('string')).toBeUndefined(); // Verify 'string' was evicted

        // Assert - Retrieve remaining items
        expect(cache.get('number')).toBe(123); // 'number' moved to MRU
        // LRU: 'boolean', MRU: 'number'. Cache size = 2.
        expect(cache.get('boolean')).toBe(true); // 'boolean' moved to MRU
        // LRU: 'number', MRU: 'boolean'. Cache size = 2.

        // Act & Assert - Update existing item
        cache.put('number', 456); // Update 'number', it's already in cache, moves to MRU.
        // LRU: 'boolean', MRU: 'number'. Cache size = 2.
        expect(cache.get('number')).toBe(456); // Verify value updated and it's still accessible
        // LRU: 'boolean', MRU: 'number'. Cache size = 2.

        // Act & Assert - Eviction after update and access
        cache.put('newKey', 'newValue'); // Capacity reached, 'boolean' (LRU) should be evicted.
        // LRU: 'number', MRU: 'newKey'. Cache size = 2.
        expect(cache.get('boolean')).toBeUndefined(); // Verify 'boolean' was evicted
        expect(cache.get('number')).toBe(456);
        expect(cache.get('newKey')).toBe('newValue');
    });

    it('should handle item expiration with default and specific expirationMs, and non-expiring items', async () => {
        // Arrange
        const cacheWithDefault = new LRUCacheWithExpiration(3, 500); // Default expiration 500ms
        const cacheNoDefault = new LRUCacheWithExpiration(1); // No default expiration

        // Put items with different expiration settings relative to current system time (2023-02-01 10:00:00)
        cacheWithDefault.put('short', 's', 100); // Expires at +100ms
        cacheWithDefault.put('long', 'l', 1000); // Expires at +1000ms
        cacheWithDefault.put('default', 'd'); // Uses default 500ms, expires at +500ms
        cacheNoDefault.put('noExpireExplicitly', 'ne'); // Should not expire as no default is set and no expirationMs provided

        // Assert - Initial state: all items should be present and valid
        expect(cacheWithDefault.get('short')).toBe('s');
        expect(cacheWithDefault.get('long')).toBe('l');
        expect(cacheWithDefault.get('default')).toBe('d');
        expect(cacheNoDefault.get('noExpireExplicitly')).toBe('ne');

        // Act - Advance time past 'short' expiration
        vi.advanceTimersByTime(120); // Current system time is now 120ms past start
        // Assert - 'short' should be expired and removed
        expect(cacheWithDefault.get('short')).toBeUndefined();
        expect(cacheWithDefault.get('long')).toBe('l');
        expect(cacheWithDefault.get('default')).toBe('d');
        expect(cacheNoDefault.get('noExpireExplicitly')).toBe('ne');

        // Act - Advance time past 'default' expiration
        vi.advanceTimersByTime(380); // Total advanced: 120 + 380 = 500ms. 'default' expires at 500ms.
        vi.advanceTimersByTime(1);  // Current system time is now 501ms past start, ensuring 'default' is past its expiration
        // Assert - 'default' should be expired and removed
        expect(cacheWithDefault.get('default')).toBeUndefined();
        expect(cacheWithDefault.get('long')).toBe('l');
        expect(cacheNoDefault.get('noExpireExplicitly')).toBe('ne');

        // Act - Advance time past 'long' expiration
        vi.advanceTimersByTime(499); // Total advanced: 501 + 499 = 1000ms. 'long' expires at 1000ms.
        vi.advanceTimersByTime(1);  // Current system time is now 1001ms past start, ensuring 'long' is past its expiration
        // Assert - 'long' should be expired and removed
        expect(cacheWithDefault.get('long')).toBeUndefined();
        expect(cacheNoDefault.get('noExpireExplicitly')).toBe('ne'); // Should still be present
    });

    test.each([
        { description: 'should throw error for zero expirationMs in put', expirationMs: 0, expectedError: 'Item expiration time (if provided) must be a positive integer in milliseconds.' },
        { description: 'should throw error for negative expirationMs in put', expirationMs: -100, expectedError: 'Item expiration time (if provided) must be a positive integer in milliseconds.' },
        { description: 'should throw error for non-integer expirationMs in put', expirationMs: 100.5, expectedError: 'Item expiration time (if provided) must be a positive integer in milliseconds.' },
    ])('put $description', ({ expirationMs, expectedError }) => {
        // Arrange
        const cache = new LRUCacheWithExpiration(1);

        // Act & Assert
        expect(() => {
            cache.put('key', 'value', expirationMs);
        }).toThrow(expectedError);
    });
});