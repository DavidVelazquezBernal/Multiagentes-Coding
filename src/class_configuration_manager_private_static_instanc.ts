/**
 * ConfigurationManager implementa el patrón de diseño Singleton para centralizar
 * la gestión de configuración de la aplicación de manera global y segura.
 */
export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private settings: Map<string, any>;

    /**
     * Constructor privado para prevenir la instanciación externa y
     * garantizar una única instancia global.
     */
    private constructor() {
        this.settings = new Map<string, any>();
    }

    /**
     * Obtiene la instancia única de ConfigurationManager.
     * @returns {ConfigurationManager} La instancia global.
     */
    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * Recupera un valor de configuración asociado a una clave.
     * @param {string} key - La clave del parámetro de configuración.
     * @returns {any} El valor asociado a la clave o undefined si no existe.
     * @throws {Error} Si la clave no es una cadena válida.
     */
    public get(key: string): any {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("La clave de configuración debe ser un string válido.");
        }
        return this.settings.get(key);
    }

    /**
     * Establece o actualiza un valor de configuración.
     * @param {string} key - La clave del parámetro de configuración.
     * @param {any} value - El valor a almacenar.
     * @throws {Error} Si la clave no es válida.
     */
    public set(key: string, value: any): void {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("La clave de configuración debe ser un string válido.");
        }

        let valueToStore = value;

        // Requisito de manejo de precisión numérica para TypeScript
        if (typeof value === 'number' && !Number.isInteger(value)) {
            valueToStore = Math.round(value * 1e10) / 1e10;
        }

        this.settings.set(key, valueToStore);
    }
}