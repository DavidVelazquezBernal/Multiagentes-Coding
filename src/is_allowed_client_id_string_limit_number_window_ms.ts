/**
 * Almacenamiento en memoria para persistir los registros de tiempo de las peticiones.
 * En un entorno distribuido, esto se implementaría habitualmente con Redis.
 */
const requestHistory: Map<string, number[]> = new Map();

/**
 * Implementa un algoritmo de ventana deslizante (Sliding Window Log) para el control de flujo.
 * Este método garantiza precisión milimétrica al evaluar ráfagas de tráfico comparando
 * la marca de tiempo exacta de cada petición dentro del intervalo definido.
 * 
 * @param clientId - Identificador único del cliente/usuario.
 * @param limit - Número máximo de peticiones permitidas en la ventana.
 * @param windowMs - Tamaño de la ventana de tiempo en milisegundos.
 * @returns Promise<boolean> - true si la petición es aceptada, false si excede el límite.
 * @throws Error si los parámetros de entrada no son válidos.
 */
export async function isAllowed(clientId: string, limit: number, windowMs: number): Promise<boolean> {
    // Validaciones de entrada
    if (!clientId || typeof clientId !== 'string') {
        throw new Error("El 'clientId' debe ser un string válido y no estar vacío.");
    }
    if (typeof limit !== 'number' || limit <= 0) {
        throw new Error("El 'limit' debe ser un número entero positivo.");
    }
    if (typeof windowMs !== 'number' || windowMs <= 0) {
        throw new Error("El 'windowMs' debe ser un número positivo que represente el intervalo de tiempo.");
    }

    const now = Date.now();
    
    // Recuperar el historial de marcas de tiempo del cliente
    let timestamps = requestHistory.get(clientId) || [];

    /**
     * Cálculo de precisión para el umbral de expiración.
     * Aunque los timestamps son enteros, aplicamos la normalización de precisión según requerimiento
     * si se realizaran cálculos de ratios o pesos en futuras extensiones.
     */
    const expirationThreshold = Math.round((now - windowMs) * 1e10) / 1e10;

    // 1. Filtrar el historial: eliminar marcas de tiempo que han caído fuera de la ventana actual
    timestamps = timestamps.filter(timestamp => timestamp > expirationThreshold);

    // 2. Evaluar si la nueva petición entra dentro del límite permitido
    if (timestamps.length < limit) {
        // 3. Registrar la marca de tiempo de la petición actual
        timestamps.push(now);
        requestHistory.set(clientId, timestamps);
        return true;
    }

    // 4. Si se excede el límite, actualizar el almacén con la lista limpia pero denegar la petición
    requestHistory.set(clientId, timestamps);
    return false;
}