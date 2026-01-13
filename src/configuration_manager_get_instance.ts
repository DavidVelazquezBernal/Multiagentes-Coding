/**
 * ConfigurationManager implementa el patrón Singleton para gestionar la configuración
 * de la aplicación, asegurando una única instancia global y persistencia de datos.
 * Versión: 1.0. Estado: Aprobado.
 */
export class ConfigurationManager {
    private static instance: ConfigurationManager | null = null;
    private readonly settings: Map<string, any>;

    /**
     * El constructor es privado para evitar la instanciación externa y
     * garantizar la unicidad de la instancia.
     */
    private constructor() {
        this.settings = new Map<string, any>();
    }

    /**
     * Obtiene la instancia única de ConfigurationManager.
     * En el modelo de ejecución de un solo hilo de TypeScript/JavaScript,
     * esta implementación es segura contra condiciones de carrera.
     * 
     * @returns {ConfigurationManager} Instancia única de la clase.
     */
    public static getInstance(): ConfigurationManager {
        if (ConfigurationManager.instance === null) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * Almacena un valor asociado a una clave específica.
     * Aplica reglas de redondeo de precisión para valores numéricos.
     * 
     * @param key Clave de configuración.
     * @param value Valor a almacenar.
     * @throws Error si la clave no es válida.
     */
    public set(key: string, value: any): void {
        if (!key || typeof key !== 'string') {
            throw new Error("ConfigurationManager: La clave debe ser un string válido.");
        }

        let processedValue = value;

        // Requisito de manejo de precisión numérica para TypeScript
        if (typeof value === 'number' && Number.isFinite(value)) {
            processedValue = Math.round(value * 1e10) / 1e10;
        }

        this.settings.set(key, processedValue);
    }

    /**
     * Recupera el valor asociado a una clave.
     * 
     * @param key Clave de configuración.
     * @returns El valor almacenado o undefined si la clave no existe.
     * @throws Error si la clave no es un string.
     */
    public get(key: string): any {
        if (typeof key !== 'string') {
            throw new Error("ConfigurationManager: La clave proporcionada debe ser un string.");
        }
        
        return this.settings.get(key);
    }

    /**
     * Método opcional para limpiar la configuración (útil para pruebas unitarias).
     */
    public clear(): void {
        this.settings.clear();
    }
}