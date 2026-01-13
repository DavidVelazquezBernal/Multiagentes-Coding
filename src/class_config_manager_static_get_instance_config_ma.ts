/**
 * Clase ConfigManager que implementa el patrón Singleton de forma robusta.
 * Gestiona la configuración de la aplicación permitiendo almacenar y recuperar valores.
 * 
 * Requisitos específicos cumplidos:
 * - Identidad de instancia única (Singleton).
 * - Preservación de precisión numérica (sin redondeo).
 * - Ausencia del método 'clear'.
 */
export class ConfigManager {
    private static instance: ConfigManager;
    private readonly settings: Map<string, any>;

    /**
     * Constructor privado para evitar la instanciación directa desde fuera de la clase.
     */
    private constructor() {
        this.settings = new Map<string, any>();
    }

    /**
     * Devuelve la instancia única de ConfigManager.
     * En el entorno de ejecución de JavaScript/TypeScript, la naturaleza de hilo único
     * del bucle de eventos garantiza que la comprobación e instanciación sea segura.
     * 
     * @returns {ConfigManager} La instancia única del gestor de configuración.
     */
    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    /**
     * Establece un valor de configuración para una clave dada.
     * 
     * @param key Identificador de la configuración.
     * @param value Valor a almacenar. Se mantiene la precisión original en tipos numéricos.
     * @throws Error si la clave no es válida.
     */
    public set(key: string, value: any): void {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error("La clave debe ser un string no vacío.");
        }
        this.settings.set(key, value);
    }

    /**
     * Recupera un valor de configuración asociado a una clave.
     * 
     * @param key Identificador de la configuración.
     * @returns El valor almacenado o undefined si la clave no existe.
     */
    public get(key: string): any {
        return this.settings.get(key);
    }

    // Nota: El método 'clear' ha sido omitido intencionadamente según los requisitos formales.
}