/**
 * A highly efficient Least Recently Used (LRU) Cache with Time-To-Live (TTL) support.
 * Implements O(1) time complexity for both 'get' and 'put' operations using Map's insertion order.
 */
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly defaultTTL: number;
  private readonly cache: Map<K, { value: V; expiry: number }>;

  /**
   * Initializes the LRU Cache.
   * @param capacity - Maximum number of elements allowed in the cache.
   * @param defaultTTL - Global expiration time in milliseconds. Defaults to Infinity.
   */
  constructor(capacity: number, defaultTTL: number = Infinity) {
    if (capacity <= 0) {
      throw new Error("Cache capacity must be a positive number.");
    }
    this.capacity = capacity;
    this.defaultTTL = defaultTTL;
    this.cache = new Map();
  }

  /**
   * Retrieves a value from the cache.
   * If the entry exists and is not expired, it is moved to the most-recently-used position.
   * @param key - The key to look up.
   * @returns The value associated with the key, or undefined if not found or expired.
   */
  public get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Lazy expiration check: verify if the current time exceeds the expiry timestamp
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    // Update recency: re-insert the entry to move it to the end of the Map
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Adds or updates an element in the cache.
   * If capacity is reached, the least recently used (oldest) item is evicted.
   * @param key - Key to store.
   * @param value - Value to store.
   * @param ttl - Optional specific TTL for this entry in milliseconds (overrides global default).
   */
  public put(key: K, value: V, ttl?: number): void {
    // If key exists, remove it first to handle value/TTL update and position refresh
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict Least Recently Used: the first element in the Map iterator
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    const duration = ttl !== undefined ? ttl : this.defaultTTL;
    
    /**
     * Numeric precision handling: rounding the expiry timestamp to avoid 
     * binary floating-point precision issues in long-running environments.
     */
    const expiry = Math.round((Date.now() + duration) * 1e10) / 1e10;

    this.cache.set(key, { value, expiry });
  }

  /**
   * Manually removes all entries that have exceeded their TTL.
   * Useful for periodic maintenance if memory footprint is a concern.
   */
  public prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears all entries from the cache.
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Returns the current number of valid entries in the cache.
   */
  public get size(): number {
    return this.cache.size;
  }
}