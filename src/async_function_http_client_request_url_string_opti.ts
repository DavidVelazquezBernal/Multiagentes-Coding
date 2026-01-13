/**
 * Realiza una petición HTTP asíncrona con soporte para reintentos, tiempo de espera (timeout)
 * y gestión centralizada de errores utilizando la API Fetch nativa.
 * 
 * @param url - La URL del recurso al que se desea acceder.
 * @param options - Configuración opcional de la petición.
 * @returns Promesa con el cuerpo de la respuesta parseado (JSON o texto).
 * @throws Error si se agotan los reintentos, ocurre un timeout o la respuesta no es exitosa.
 */
export async function httpClientRequest(
  url: string,
  options: {
    method?: string;
    timeout?: number;
    retries?: number;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<any> {
  const {
    method = 'GET',
    timeout = 10000, // Timeout por defecto de 10 segundos
    retries = 0,     // Reintentos adicionales (0 por defecto)
    body,
    headers = {}
  } = options;

  const requestConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Serialización automática del cuerpo si es un objeto
  if (body) {
    requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let lastError: Error | null = null;

  // Ciclo de ejecución para gestionar reintentos
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      // Limpiar el timeout al recibir respuesta
      clearTimeout(timeoutId);

      // Si la respuesta no es exitosa (fuera del rango 200-299), lanzamos error para disparar catch
      if (!response.ok) {
        throw new Error(`HTTP Request failed with status ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data: any;

      // Parseo centralizado según tipo de contenido
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Requisito de precisión numérica: Redondeo de seguridad si el resultado es numérico
      if (typeof data === 'number') {
        return Math.round(data * 1e10) / 1e10;
      }

      return data;

    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        lastError = new Error(`Request exceeded timeout of ${timeout}ms`);
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      // Si no quedan reintentos disponibles, salimos del ciclo
      if (attempt >= retries) {
        break;
      }

      // Opcional: Pequeña pausa antes del siguiente reintento (Backoff exponencial simple)
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  // Si llegamos aquí es porque todos los intentos fallaron
  throw lastError || new Error(`Failed to complete request to ${url} after ${retries} retries`);
}