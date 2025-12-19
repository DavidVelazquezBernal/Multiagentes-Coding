/**
 * Represents a node in the doubly linked list, which also holds the cache data.
 * This class is used internally by LRUCacheWithExpiration to manage both data and LRU order.
 */
class CacheNode {
    key: string;
    value: any;
    // The timestamp in milliseconds when this item will expire.
    // Null if the item does not have an expiration time.
    expirationTime: number | null;
    prev: CacheNode | null;
    next: CacheNode | null;

    /**
     * Creates an instance of CacheNode.
     * @param key The key associated with the cache entry.
     * @param value The value stored in the cache entry.
     * @param expirationTime The timestamp (in ms) when the entry expires, or null for no expiration.
     */
    constructor(key: string, value: any, expirationTime: number | null) {
        this.key = key;
        this.value = value;
        this.expirationTime = expirationTime;
        this.prev = null;
        this.next = null;
    }
}

/**
 * Implements an LRU (Least Recently Used) cache with support for individual item expiration times.
 * When the cache reaches its capacity, the least recently used item is evicted.
 * Expired items are automatically removed upon retrieval attempts.
 */
export class LRUCacheWithExpiration {
    private capacity: number;
    // Default expiration time in milliseconds for items without a specific expiration.
    // Null if no default expiration is set.
    private defaultExpirationMs: number | null;
    // Map to store key-to-CacheNode references for O(1) access.
    private cache: Map<string, CacheNode>;
    // Head of the doubly linked list, points to the Least Recently Used (LRU) item.
    private head: CacheNode | null;
    // Tail of the doubly linked list, points to the Most Recently Used (MRU) item.
    private tail: CacheNode | null;

    /**
     * Creates an instance of LRUCacheWithExpiration.
     * @param capacity The maximum number of items the cache can hold. Must be a positive integer.
     * @param defaultExpirationMs Optional, the default time in milliseconds after which an item expires
     *                            if no specific expirationMs is provided during 'put'. Must be a positive integer.
     * @throws Error if capacity or defaultExpirationMs (if provided) are not positive integers.
     */
    constructor(capacity: number, defaultExpirationMs?: number) {
        if (capacity <= 0 || !Number.isInteger(capacity)) {
            throw new Error("Capacity must be a positive integer.");
        }
        if (defaultExpirationMs !== undefined && (defaultExpirationMs <= 0 || !Number.isInteger(defaultExpirationMs))) {
            throw new Error("Default expiration time (if provided) must be a positive integer in milliseconds.");
        }

        this.capacity = capacity;
        this.defaultExpirationMs = defaultExpirationMs !== undefined ? defaultExpirationMs : null;
        this.cache = new Map<string, CacheNode>();
        this.head = null; // LRU end
        this.tail = null; // MRU end
    }

    /**
     * Adds a node to the tail (Most Recently Used end) of the doubly linked list.
     * This operation marks the node as recently used.
     * @param node The CacheNode to add.
     */
    private _addNode(node: CacheNode): void {
        if (!this.head) { // List is empty
            this.head = node;
            this.tail = node;
        } else if (this.tail) { // List has elements
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
    }

    /**
     * Removes an arbitrary node from the doubly linked list.
     * Handles cases where the node is the head, tail, or in the middle.
     * @param node The CacheNode to remove.
     */
    private _removeNode(node: CacheNode): void {
        if (node === this.head && node === this.tail) { // Only one node in the list
            this.head = null;
            this.tail = null;
        } else if (node === this.head) { // Node is the current head (LRU)
            this.head = node.next;
            if (this.head) {
                this.head.prev = null;
            }
        } else if (node === this.tail) { // Node is the current tail (MRU)
            this.tail = node.prev;
            if (this.tail) {
                this.tail.next = null;
            }
        } else { // Node is in the middle of the list
            if (node.prev) {
                node.prev.next = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            }
        }
        // Clean up node's references for garbage collection
        node.prev = null;
        node.next = null;
    }

    /**
     * Moves an existing node to the tail (Most Recently Used end) of the list.
     * This is typically called when an item is accessed or updated.
     * @param node The CacheNode to move.
     */
    private _moveToTail(node: CacheNode): void {
        this._removeNode(node);
        this._addNode(node);
    }

    /**
     * Checks if a given cache node has expired based on the current time.
     * @param node The CacheNode to check.
     * @returns True if the node has an expiration time and that time is in the past, false otherwise.
     */
    private _isExpired(node: CacheNode): boolean {
        return node.expirationTime !== null && Date.now() >= node.expirationTime;
    }

    /**
     * Removes the least recently used item (the head of the linked list) from the cache.
     * This method is called when the cache reaches its capacity and a new item needs to be added.
     */
    private _evictLRU(): void {
        if (this.head) {
            this.cache.delete(this.head.key); // Remove from Map
            this._removeNode(this.head); // Remove from linked list
        }
    }

    /**
     * Inserts or updates an item in the cache.
     * If the cache is full, the least recently used item is removed to make space.
     * @param key The key of the item to store.
     * @param value The value of the item. Can be of any type.
     * @param expirationMs Optional, the specific expiration time in milliseconds for this item.
     *                     If not provided, the default expiration (if set) will be used.
     *                     If neither is set, the item will not expire. Must be a positive integer.
     * @throws Error if expirationMs (if provided) is not a positive integer.
     */
    public put(key: string, value: any, expirationMs?: number): void {
        if (expirationMs !== undefined && (expirationMs <= 0 || !Number.isInteger(expirationMs))) {
            throw new Error("Item expiration time (if provided) must be a positive integer in milliseconds.");
        }

        const now = Date.now();
        let calculatedExpirationTime: number | null = null;

        // Determine the expiration timestamp
        if (expirationMs !== undefined) {
            calculatedExpirationTime = now + expirationMs;
        } else if (this.defaultExpirationMs !== null) {
            calculatedExpirationTime = now + this.defaultExpirationMs;
        }
        // If both are undefined/null, calculatedExpirationTime remains null, meaning no expiration.

        if (this.cache.has(key)) {
            // Item already exists, update its value, expiration, and mark as most recently used
            const node = this.cache.get(key)!; // '!' asserts that node is not undefined
            node.value = value;
            node.expirationTime = calculatedExpirationTime;
            this._moveToTail(node); // Move to MRU end
        } else {
            // Item is new
            if (this.cache.size >= this.capacity) {
                this._evictLRU(); // Evict the LRU item if capacity is reached
            }
            // Create a new node and add it to the cache and MRU end of the list
            const newNode = new CacheNode(key, value, calculatedExpirationTime);
            this.cache.set(key, newNode);
            this._addNode(newNode);
        }
    }

    /**
     * Retrieves an item from the cache.
     * If the item is found and has not expired, its value is returned, and it's marked as most recently used.
     * If the item is not found or has expired, it is removed from the cache and undefined is returned.
     * @param key The key of the item to retrieve.
     * @returns The value of the item, or undefined if the key is not found or the item has expired.
     */
    public get(key: string): any | undefined {
        const node = this.cache.get(key);

        if (!node) {
            return undefined; // Item not found in cache
        }

        if (this._isExpired(node)) {
            // Item found but has expired, remove it from cache and linked list
            this.cache.delete(key);
            this._removeNode(node);
            return undefined;
        }

        // Item found and is valid, move it to the MRU end as it was just accessed
        this._moveToTail(node);
        return node.value;
    }
}

/*
// --- Ejemplos de uso (no se ejecutan automáticamente) ---

// 1. Inicialización con capacidad y sin expiración por defecto
try {
    const cache1 = new LRUCacheWithExpiration(2);
    cache1.put("a", 1);
    cache1.put("b", 2);
    console.log("Cache1 get 'a':", cache1.get("a")); // 1 (moved to MRU)
    cache1.put("c", 3); // 'b' is evicted (LRU)
    console.log("Cache1 get 'b':", cache1.get("b")); // undefined
    console.log("Cache1 get 'c':", cache1.get("c")); // 3
    console.log("Cache1 get 'a':", cache1.get("a")); // 1
} catch (error: any) {
    console.error("Error en ejemplo 1:", error.message);
}

// 2. Inicialización con capacidad y expiración por defecto
try {
    const cache2 = new LRUCacheWithExpiration(2, 100); // Default expiration 100ms
    cache2.put("x", "valueX");
    cache2.put("y", "valueY");
    console.log("Cache2 get 'x' (before expiration):", cache2.get("x")); // valueX

    // Esperar a que 'y' expire (aproximadamente 100ms)
    setTimeout(() => {
        console.log("Cache2 get 'y' (after expiration):", cache2.get("y")); // undefined
        cache2.put("z", "valueZ"); // 'x' should be LRU (as 'y' was removed, and 'x' was accessed)
        console.log("Cache2 get 'z':", cache2.get("z")); // valueZ
        console.log("Cache2 get 'x':", cache2.get("x")); // valueX
    }, 120);
} catch (error: any) {
    console.error("Error en ejemplo 2:", error.message);
}

// 3. Expiración individual sobreescribiendo el valor por defecto
try {
    const cache3 = new LRUCacheWithExpiration(3, 5000); // Default 5s
    cache3.put("item1", 100, 100); // Expires in 100ms
    cache3.put("item2", 200);     // Expires in 5000ms
    cache3.put("item3", 300, 10000); // Expires in 10000ms

    console.log("Cache3 get 'item1' (before expiration):", cache3.get("item1")); // 100

    setTimeout(() => {
        console.log("Cache3 get 'item1' (after 100ms expiration):", cache3.get("item1")); // undefined
        console.log("Cache3 get 'item2' (before 5s expiration):", cache3.get("item2")); // 200
    }, 120);
} catch (error: any) {
    console.error("Error en ejemplo 3:", error.message);
}

// 4. Manejo de errores en la inicialización
try {
    const invalidCache1 = new LRUCacheWithExpiration(0);
} catch (error: any) {
    console.error("Error esperado (capacidad 0):", error.message); // Capacity must be a positive integer.
}

try {
    const invalidCache2 = new LRUCacheWithExpiration(10, -50);
} catch (error: any) {
    console.error("Error esperado (defaultExpirationMs negativo):", error.message); // Default expiration time... must be a positive integer.
}

// 5. Manejo de errores en put
try {
    const cache5 = new LRUCacheWithExpiration(1);
    cache5.put("test", "value", -100);
} catch (error: any) {
    console.error("Error esperado (expirationMs negativo):", error.message); // Item expiration time... must be a positive integer.
}
*/