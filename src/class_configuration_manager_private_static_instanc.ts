/**
 * ConfigurationManager implementa el patrón Singleton para la gestión centralizada
 * de la configuración de la aplicación. Garantiza la integridad total de los datos
 * recuperados, evitando cualquier transformación de precisión numérica.
 * 
 * @version TypeScript 5.0
 */
export class ConfigurationManager {
    private static instance: ConfigurationManager | null = null;
    private readonly settings: Map<string, any>;

    /**
     * El constructor es privado para prevenir la instanciación directa
     * mediante el operador 'new', cumpliendo con el patrón Singleton.
     */
    private constructor() {
        this.settings = new Map<string, any>();
    }

    /**
     * Obtiene la instancia única de la clase ConfigurationManager.
     * En el entorno de ejecución de TypeScript (JavaScript), la naturaleza
     * single-threaded del event loop garantiza la seguridad de este patrón.
     * 
     * @returns {ConfigurationManager} Instancia única de la clase.
     */
    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * Almacena un valor en el contenedor de configuración.
     * 
     * @param {string} key - Identificador único para la configuración.
     * @param {any} value - Valor asociado a la clave (soporta cualquier tipo de dato).
     * @throws {Error} Si la clave proporcionada no es válida.
     */
    public setConfig(key: string, value: any): void {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("ConfigurationManager.setConfig: La clave 'key' debe ser un string no vacío.");
        }
        
        this.settings.set(key, value);
    }

    /**
     * Recupera el valor almacenado para una clave específica.
     * Devuelve el valor original íntegro, sin aplicar redondeos ni
     * transformaciones de precisión numérica.
     * 
     * @param {string} key - Identificador de la configuración a recuperar.
     * @returns {any} El valor original almacenado o undefined si la clave no existe.
     * @throws {Error} Si la clave no es un string.
     */
    public getConfig(key: string): any {
        if (typeof key !== 'string') {
            throw new Error("ConfigurationManager.getConfig: La clave 'key' debe ser un string.");
        }

        if (!this.settings.has(key)) {
            return undefined;
        }

        // Se retorna el valor tal cual fue almacenado para mantener la integridad
        // de datos de alta precisión según los requerimientos formales.
        return this.settings.get(key);
    }
}