/**
 * Clase ConfigurationManager que implementa el patrón Singleton.
 * Proporciona un punto de acceso global y centralizado para la configuración de la aplicación.
 */
export class ConfigurationManager {
    private static instance: ConfigurationManager | null = null;
    private settings: Map<string, any>;

    /**
     * El constructor es privado para evitar la instanciación directa mediante 'new'.
     */
    private constructor() {
        this.settings = new Map<string, any>();
    }

    /**
     * Devuelve la instancia única de ConfigurationManager.
     * En el entorno de ejecución de JavaScript/TypeScript, al ser monohilo, 
     * esta implementación básica es inherentemente segura.
     * 
     * @returns {ConfigurationManager} La instancia única.
     */
    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * Obtiene un valor de configuración basado en una clave.
     * 
     * @param {string} key - La clave de configuración a buscar.
     * @returns {any} El valor asociado a la clave o undefined si no existe.
     * @throws {Error} Si la clave proporcionada no es válida.
     */
    public get(key: string): any {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("ConfigurationManager: La clave proporcionada debe ser un string no vacío.");
        }
        return this.settings.get(key);
    }

    /**
     * Establece o actualiza un valor de configuración.
     * 
     * @param {string} key - La clave de configuración.
     * @param {any} value - El valor a almacenar.
     * @throws {Error} Si la clave proporcionada no es válida.
     */
    public set(key: string, value: any): void {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("ConfigurationManager: La clave proporcionada debe ser un string no vacío.");
        }

        // Manejo de precisión numérica según requisitos del sistema
        let valueToStore = value;
        if (typeof value === 'number') {
            valueToStore = Math.round(value * 1e10) / 1e10;
        }

        this.settings.set(key, valueToStore);
    }
}