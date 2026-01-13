/**
 * ConfigurationManager implementa un patrón Singleton para la gestión centralizada
 * de la configuración de la aplicación, asegurando una única instancia global.
 * 
 * Versión: 1.0
 * Estado: Aprobado
 */
export class ConfigurationManager {
    private static instance: ConfigurationManager | null = null;
    private settings: Map<string, any>;

    /**
     * El constructor es privado para evitar la instanciación directa vía 'new'.
     */
    private constructor() {
        this.settings = new Map<string, any>();
    }

    /**
     * Obtiene la instancia única de ConfigurationManager.
     * @returns {ConfigurationManager} La instancia singleton.
     */
    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * Establece un parámetro de configuración.
     * Si el valor es un número de punto flotante, se aplica redondeo de precisión.
     * 
     * @param key - Identificador único del parámetro.
     * @param value - Valor a almacenar.
     * @throws {Error} Si la clave no es un string válido.
     */
    public set(key: string, value: any): void {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("ConfigurationManager: La clave debe ser un string no vacío.");
        }

        let processedValue = value;

        // Requisito de precisión numérica para TypeScript:
        // Si el valor es un número decimal, aplicamos el redondeo especificado.
        if (typeof value === 'number' && !Number.isInteger(value)) {
            processedValue = Math.round(value * 1e10) / 1e10;
        }

        this.settings.set(key, processedValue);
    }

    /**
     * Recupera un parámetro de configuración.
     * 
     * @param key - Identificador único del parámetro.
     * @returns El valor almacenado o 'undefined' si la clave no existe.
     * @throws {Error} Si la clave no es un string.
     */
    public get(key: string): any {
        if (typeof key !== 'string') {
            throw new Error("ConfigurationManager: La clave debe ser un string.");
        }
        
        return this.settings.get(key);
    }

    /**
     * Elimina todas las configuraciones almacenadas.
     */
    public clear(): void {
        this.settings.clear();
    }
}