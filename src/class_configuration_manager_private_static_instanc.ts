/**
 * ConfigurationManager implementation using the Singleton pattern.
 * Ensures a single point of access for application-wide settings with thread-safe instantiation logic.
 */
export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private readonly settings: Map<string, any>;

    /**
     * Private constructor to prevent direct instantiation from outside the class.
     */
    private constructor() {
        this.settings = new Map<string, any>();
    }

    /**
     * Returns the unique instance of the ConfigurationManager.
     * In a TypeScript/JavaScript environment, this implementation is safe against 
     * race conditions due to the single-threaded nature of the event loop.
     */
    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * Stores a configuration value associated with a specific key.
     * @param key - The unique identifier for the configuration setting.
     * @param value - The value to be stored (can be any type).
     * @throws Error if the key is invalid.
     */
    public setConfig(key: string, value: any): void {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("Configuration key must be a non-empty string.");
        }
        this.settings.set(key, value);
    }

    /**
     * Retrieves a configuration value by its key.
     * If the value is a number, it applies precision rounding to avoid floating point errors.
     * @param key - The identifier of the configuration to retrieve.
     * @returns The value associated with the key, or undefined if it does not exist.
     */
    public getConfig(key: string): any {
        const value = this.settings.get(key);

        // Precision handling for floating point numbers as per requirements
        if (typeof value === 'number') {
            return Math.round(value * 1e10) / 1e10;
        }

        return value;
    }
}