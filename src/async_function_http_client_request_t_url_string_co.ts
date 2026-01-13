/**
 * Error lanzado cuando una petición excede el tiempo de espera configurado.
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Error lanzado cuando se agotan todos los reintentos permitidos sin éxito.
 */
export class MaxRetriesExceeded extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaxRetriesExceeded';
  }
}

/**
 * Error lanzado ante problemas de conectividad o respuestas HTTP no exitosas (4xx, 5xx).
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Función auxiliar para aplicar la precisión numérica requerida a valores de punto flotante.
 * @param value Valor a redondear.
 */
const applyPrecision = (value: any): any => {
  if (typeof value === 'number') {
    return Math.round(value * 1e10) / 1e10;
  }
  if (Array.isArray(value)) {
    return value.map(applyPrecision);
  }
  if (value !== null && typeof value === 'object') {
    const roundedObj: Record<string, any> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        roundedObj[key] = applyPrecision(value[key]);
      }
    }
    return roundedObj;
  }
  return value;
};

/**
 * Cliente HTTP resiliente con reintentos automáticos, gestión de timeout y manejo estructurado de errores.
 * 
 * @param url URL de destino de la petición.
 * @param config Objeto de configuración (método, cuerpo, cabeceras, reintentos y timeout).
 * @returns Promesa que resuelve con los datos de la respuesta tipados como T.
 */
export async function httpClientRequest<T>(
  url: string,
  config: {
    method: string;
    body?: any;
    headers?: Record<string, string>;
    retries: number;
    timeoutMs: number;
  }
): Promise<T> {
  let lastError: Error | null = null;
  const maxAttempts = config.retries + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch(url, {
        method: config.method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {}),
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Si la respuesta no es exitosa (200-299)
      if (!response.ok) {
        // Solo reintentamos si es un error de servidor (5xx)
        if (response.status >= 500 && attempt < maxAttempts) {
          continue;
        }
        throw new NetworkError(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // Procesamiento de datos exitoso
      const data = await response.json();
      
      // Aplicar redondeo de precisión requerido para TypeScript
      return applyPrecision(data) as T;

    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        lastError = new TimeoutError(`Request timed out after ${config.timeoutMs}ms (Attempt ${attempt}/${maxAttempts})`);
      } else if (error instanceof NetworkError) {
        lastError = error;
      } else {
        lastError = new NetworkError(error.message || 'Unknown network error');
      }

      // Si aún quedan intentos, continuar el bucle
      if (attempt < maxAttempts) {
        // Implementación básica de retardo entre reintentos para evitar saturación
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        continue;
      }
    }
  }

  // Si salimos del bucle sin retornar, lanzamos el error de reintentos agotados envolviendo el último error
  throw new MaxRetriesExceeded(
    `Failed after ${config.retries} retries. Last error: ${lastError?.message}`
  );
}