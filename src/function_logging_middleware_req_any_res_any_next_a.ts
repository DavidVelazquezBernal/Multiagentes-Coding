/**
 * Un objeto de logger simple para simular diferentes niveles de logging.
 * En una aplicación real, esto se integraría con una librería de logging robusta (e.g., Winston, Pino).
 * Se define de esta manera para cumplir con el requisito de ser autocontenido sin dependencias externas.
 */
const _simpleLogger = {
  /**
   * Registra mensajes informativos.
   * @param message El mensaje principal a registrar.
   * @param args Argumentos adicionales para el log.
   */
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  /**
   * Registra mensajes de advertencia.
   * @param message El mensaje principal a registrar.
   * @param args Argumentos adicionales para el log.
   */
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  /**
   * Registra mensajes de error.
   * @param message El mensaje principal a registrar.
   * @param args Argumentos adicionales para el log.
   */
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  /**
   * Registra mensajes de depuración. Solo se registra si NODE_ENV es 'development'.
   * @param message El mensaje principal a registrar.
   * @param args Argumentos adicionales para el log.
   */
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }
};

/**
 * Middleware de logging para registrar solicitudes HTTP entrantes, respuestas salientes
 * y errores de la aplicación, utilizando diferentes niveles de logging.
 *
 * Este middleware está diseñado para entornos como Express.js, donde `req`, `res`
 * y `next` son parte de la interfaz estándar de middleware.
 *
 * @param req El objeto de solicitud HTTP, que contiene detalles de la petición (método, URL).
 *            Debe ser un objeto similar a `http.IncomingMessage` de Node.js,
 *            o `express.Request`.
 * @param res El objeto de respuesta HTTP, utilizado para manipular y enviar la respuesta.
 *            Debe ser un objeto similar a `http.ServerResponse` de Node.js,
 *            o `express.Response`.
 * @param next La función `next` para pasar el control al siguiente middleware en la cadena.
 *             Si se le pasa un error, indica que un error ha ocurrido y que la cadena
 *             debe saltar a los middlewares de manejo de errores.
 */
export function loggingMiddleware(req: any, res: any, next: any): void {
  // Captura el tiempo de inicio de la solicitud para calcular la duración total.
  // `process.hrtime.bigint()` proporciona alta precisión en nanosegundos.
  const start: bigint = process.hrtime.bigint();

  // 1. Registrar la solicitud HTTP entrante a nivel de información.
  // Se utiliza `req.originalUrl` si está disponible (común en Express),
  // de lo contrario, se recurre a `req.url`.
  _simpleLogger.info(`--> ${req.method} ${req.originalUrl || req.url}`);

  // 2. Configurar un listener para registrar la respuesta HTTP saliente.
  // El evento 'finish' se emite cuando la respuesta ha sido completamente enviada al cliente.
  res.on('finish', () => {
    const end: bigint = process.hrtime.bigint();
    // Calcula la duración de la solicitud en milisegundos.
    const durationMs: number = Number(end - start) / 1_000_000;

    // Redondea el resultado de la duración para evitar errores de precisión binaria
    // inherentes a los números de punto flotante.
    const roundedDurationMs: number = Math.round(durationMs * 1e10) / 1e10;

    // Registra la respuesta saliente, incluyendo el método, URL, código de estado
    // y la duración de la solicitud, a nivel de información.
    _simpleLogger.info(
      `<-- ${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${roundedDurationMs}ms`
    );
  });

  // 3. Manejo de errores durante la ejecución del siguiente middleware o ruta.
  try {
    // Pasa el control al siguiente middleware o ruta en la cadena.
    // Se envuelve en un bloque try-catch para capturar errores sincrónicos
    // que puedan ser lanzados por los middlewares subsiguientes.
    next();
  } catch (error: any) {
    // Si se captura un error sincrónico, se registra a nivel de error.
    _simpleLogger.error(
      `Error procesando ${req.method} ${req.originalUrl || req.url}: ${error.message}`,
      error
    );

    // Luego, el error se propaga al siguiente middleware de manejo de errores
    // en la cadena (si existe uno), o al manejador de errores predeterminado de la aplicación.
    next(error);
  }
}

// --- EJEMPLOS DE USO (NO SE EJECUTAN AUTOMÁTICAMENTE) ---
// Para usar este middleware, necesitarías una estructura de aplicación que soporte
// el patrón de middleware (como Express.js o un framework similar).

/*
import { loggingMiddleware } from './loggingMiddleware'; // Asume que el archivo se llama loggingMiddleware.ts
import http from 'http'; // Para la simulación de objetos req/res

// Simulación de un servidor HTTP básico para demostrar el middleware
const server = http.createServer((req, res) => {
  // Simulación de la función 'next' que pasa al siguiente handler o finaliza la respuesta
  const next = (err?: any) => {
    if (err) {
      _simpleLogger.error(`Error en la cadena de middleware: ${err.message}`);
      res.statusCode = err.status || 500;
      res.end(`Error: ${err.message || 'Internal Server Error'}`);
      return;
    }
    // Si no hay más middlewares, o el middleware no llamó a `res.end`,
    // se puede simular el comportamiento de una ruta.
    if (!res.writableEnded) { // Comprueba si la respuesta ya fue enviada
      if (req.url === '/test-success') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        setTimeout(() => { // Simula un procesamiento asíncrono
          res.end('¡Solicitud exitosa!');
        }, 100);
      } else if (req.url === '/test-error-sync') {
        // Simula un error sincrónico en un handler posterior
        throw new Error('¡Error sincrónico en el handler!');
      } else if (req.url === '/test-error-async') {
        // Simula un error asincrónico que debe ser capturado por un error handler posterior
        setTimeout(() => {
          // Si el error no se pasa a `next`, se convertirá en una excepción no capturada
          // a nivel de proceso, ya que está fuera del try-catch del middleware.
          // En un sistema real, un error handler de Express capturaría esto
          // si se envuelve en un async/await o con librerías como `express-async-errors`.
          next(new Error('¡Error asincrónico en el handler!'));
        }, 50);
      } else {
        res.statusCode = 404;
        res.end('No encontrado');
      }
    }
  };

  // Aplicar el middleware de logging
  // Nota: En un framework como Express, se haría `app.use(loggingMiddleware);`
  loggingMiddleware(req, res, next);
});

// Inicia el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor de prueba escuchando en http://localhost:${PORT}`);
  console.log('Intenta visitar:');
  console.log(' - http://localhost:3000/test-success');
  console.log(' - http://localhost:3000/test-error-sync');
  console.log(' - http://localhost:3000/test-error-async');
  console.log(' - http://localhost:3000/non-existent');
});

// Ejemplo de cómo manejar errores globales del proceso que no son capturados por middlewares
process.on('uncaughtException', (err) => {
  _simpleLogger.error('Excepción no capturada a nivel de proceso:', err);
  // Es crucial salir del proceso después de un uncaughtException si no se puede recuperar.
  // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  _simpleLogger.error('Promesa rechazada no manejada a nivel de proceso:', reason, promise);
});
*/