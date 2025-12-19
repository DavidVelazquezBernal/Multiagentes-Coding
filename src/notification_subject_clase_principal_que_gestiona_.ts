/**
 * @interface NotificationData
 * @description Define la estructura de los datos que se enviarán con cada notificación.
 *              Debe contener un tipo de notificación y un mensaje, y opcionalmente un payload.
 */
export interface NotificationData {
  type: string;
  message: string;
  payload?: any;
}

/**
 * @interface Observer
 * @description Define la interfaz que cualquier observador debe implementar para poder
 *              suscribirse a un sujeto de notificación y recibir actualizaciones.
 */
export interface Observer {
  /**
   * Método invocado por el sujeto cuando se produce una actualización.
   * Los observadores deben implementar esta función para procesar la notificación.
   * @param data Un objeto NotificationData que contiene los detalles de la notificación.
   */
  update(data: NotificationData): void;
}

/**
 * @class NotificationSubject
 * @description Implementa el patrón de diseño Observer. Esta clase actúa como el "sujeto"
 *              al que los observadores se suscriben. Gestiona la lista de observadores
 *              y les envía notificaciones cuando su estado cambia.
 *              Permite la suscripción, desuscripción y notificación a múltiples observadores.
 */
export class NotificationSubject {
  private observers: Observer[] = [];

  /**
   * Suscribe un observador a la lista para que reciba futuras notificaciones.
   * @param observer La instancia del observador que se va a suscribir.
   * @throws {Error} Si el observador es nulo, indefinido o ya está suscrito.
   */
  public subscribe(observer: Observer): void {
    if (!observer) {
      throw new Error("NotificationSubject: El observador no puede ser nulo o indefinido.");
    }
    if (this.observers.includes(observer)) {
      throw new Error("NotificationSubject: El observador ya está suscrito.");
    }
    this.observers.push(observer);
    // console.log(`Observer subscribed: ${observer.constructor.name}`); // Para propósitos de depuración
  }

  /**
   * Desuscribe un observador de la lista, impidiendo que reciba futuras notificaciones.
   * @param observer La instancia del observador que se va a desuscribir.
   * @throws {Error} Si el observador es nulo, indefinido o no está suscrito.
   */
  public unsubscribe(observer: Observer): void {
    if (!observer) {
      throw new Error("NotificationSubject: El observador no puede ser nulo o indefinido.");
    }
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      throw new Error("NotificationSubject: El observador no está suscrito.");
    }
    this.observers.splice(index, 1);
    // console.log(`Observer unsubscribed: ${observer.constructor.name}`); // Para propósitos de depuración
  }

  /**
   * Notifica a todos los observadores suscritos con los datos de notificación proporcionados.
   * Cada observador recibirá un objeto NotificationData a través de su método 'update'.
   * @param data El objeto NotificationData que contiene los detalles de la notificación.
   * @throws {Error} Si los datos de notificación son inválidos (e.g., falta 'type' o 'message').
   */
  public notify(data: NotificationData): void {
    if (!data || typeof data.type !== 'string' || typeof data.message !== 'string') {
      throw new Error("NotificationSubject: Datos de notificación inválidos. Deben contener 'type' y 'message' (ambos cadenas).");
    }

    // console.log(`Notifying observers about type: ${data.type}, message: ${data.message}`); // Para propósitos de depuración
    for (const observer of this.observers) {
      try {
        observer.update(data);
      } catch (error) {
        // En caso de que un observador individual falle al procesar la actualización,
        // registramos el error pero permitimos que la notificación continúe para otros observadores.
        console.error(`NotificationSubject: Error al notificar al observador ${observer.constructor.name}:`, error);
      }
    }
  }
}

// --- EJEMPLOS DE USO (NO SE EJECUTAN AUTOMÁTICAMENTE AL IMPORTAR EL CÓDIGO) ---

/*
// Para utilizar NotificationSubject, primero se deben crear clases que implementen la interfaz Observer.
// A continuación se muestran ejemplos de cómo se podrían definir y usar.

// Ejemplo de un Observador de Email
export class EmailLogger implements Observer {
  private recipient: string;

  constructor(recipient: string) {
    this.recipient = recipient;
  }

  update(data: NotificationData): void {
    console.log(`[EmailLogger - ${this.recipient}] Enviando correo:`);
    console.log(`  Tipo: ${data.type}`);
    console.log(`  Mensaje: ${data.message}`);
    if (data.payload) {
      console.log(`  Payload: ${JSON.stringify(data.payload)}`);
    }
  }
}

// Ejemplo de un Observador de Consola
export class ConsoleLogger implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(data: NotificationData): void {
    console.log(`[ConsoleLogger - ${this.name}] Notificación recibida:`);
    console.log(`  Tipo: ${data.type}`);
    console.log(`  Mensaje: ${data.message}`);
    if (data.payload) {
      console.log(`  Payload: ${JSON.stringify(data.payload)}`);
    }
  }
}

// Cómo usar NotificationSubject y los observadores:
// const notificationSystem = new NotificationSubject();

// const emailUser = new EmailLogger("user@example.com");
// const adminConsole = new ConsoleLogger("Admin Panel");
// const auditConsole = new ConsoleLogger("Audit Log");

// try {
//   // Suscribir observadores
//   notificationSystem.subscribe(emailUser);
//   notificationSystem.subscribe(adminConsole);
//   notificationSystem.subscribe(auditConsole);

//   console.log("\n--- Enviando notificación de registro de usuario ---");
//   notificationSystem.notify({
//     type: "USER_REGISTERED",
//     message: "Nuevo usuario registrado en el sistema.",
//     payload: { userId: "user-12345", username: "alice" }
//   });

//   console.log("\n--- Desuscribiendo emailUser ---");
//   notificationSystem.unsubscribe(emailUser);

//   console.log("\n--- Enviando notificación de actualización de producto ---");
//   notificationSystem.notify({
//     type: "PRODUCT_UPDATE",
//     message: "El producto 'Awesome Widget' ha sido actualizado.",
//     payload: { productId: "prod-001", version: "2.0" }
//   });

//   console.log("\n--- Intentando suscribir un observador duplicado (debería lanzar error) ---");
//   notificationSystem.subscribe(adminConsole);
// } catch (error: any) {
//   console.error("\nError en el sistema de notificaciones:", error.message);
// }

// try {
//   console.log("\n--- Intentando notificar con datos inválidos (debería lanzar error) ---");
//   notificationSystem.notify({ message: "sin tipo" } as NotificationData); // Forzamos un tipo incorrecto
// } catch (error: any) {
//   console.error("\nError en el sistema de notificaciones:", error.message);
// }
*/