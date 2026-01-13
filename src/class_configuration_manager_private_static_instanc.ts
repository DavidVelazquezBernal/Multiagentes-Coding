/**
 * Clase ConfigurationManager que implementa el patrón de diseño Singleton
 * para centralizar y gestionar la configuración de la aplicación de manera segura.
 */
export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private settings: Record<string, any>;

    /**
     * Constructor privado para evitar la instanciación directa desde fuera de la clase.
     */
    private constructor() {
        this.settings = {};
    }

    /**
     * Retorna la instancia única de ConfigurationManager. 
     * Si no existe, la crea.
     * @returns {ConfigurationManager} La instancia única del gestor de configuración.
     */
    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * Obtiene el valor asociado a una clave específica.
     * @param {string} key - El nombre del parámetro de configuración.
     * @returns {any} El valor almacenado o undefined si la clave no existe.
     * @throws {Error} Si la clave proporcionada no es válida.
     */
    public get(key: string): any {
        if (typeof key !== 'string' || !key.trim()) {
            throw new Error("La clave (key) debe ser un string no vacío.");
        }
        return this.settings[key];
    }

    /**
     * Establece o actualiza un valor de configuración para una clave dada.
     * Incluye manejo de precisión para valores numéricos de punto flotante.
     * @param {string} key - El nombre del parámetro de configuración.
     * @param {any} value - El valor a almacenar.
     * @throws {Error} Si la clave proporcionada no es válida.
     */
    public set(key: string, value: any): void {
        if (typeof key !== 'string' || !key.trim()) {
            throw new Error("La clave (key) debe ser un string no vacío.");
        }

        let valueToStore = value;

        // Requisito de precisión numérica: Redondear números de punto flotante
        if (typeof value === 'number' && !Number.isInteger(value)) {
            valueToStore = Math.round(value * 1e10) / 1e10;
        }

        this.settings[key] = valueToStore;
    }
}