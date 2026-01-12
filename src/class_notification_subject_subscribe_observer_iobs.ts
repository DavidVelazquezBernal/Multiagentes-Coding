/**
 * Interfaz que deben implementar todos los observadores que deseen 
 * recibir notificaciones del NotificationSubject.
 */
export interface IObserver {
    /**
     * Método invocado por el sujeto para notificar un cambio o mensaje.
     * @param message El mensaje de notificación enviado por el sujeto.
     */
    update(message: string): void;
}

/**
 * Clase que actúa como el Sujeto (Subject) en el patrón de diseño Observer.
 * Gestiona una lista de suscriptores y les notifica eventos de forma desacoplada.
 */
export class NotificationSubject {
    private observers: Set<IObserver>;

    constructor() {
        // Usamos Set para garantizar que un observador no se suscriba múltiples veces
        this.observers = new Set<IObserver>();
    }

    /**
     * Registra un nuevo observador en el sistema de notificaciones.
     * @param observer Instancia que implementa IObserver.
     * @throws Error si el observador no es válido.
     */
    export subscribe(observer: IObserver): void {
        if (!observer) {
            throw new Error("El observador proporcionado no es válido.");
        }
        if (this.observers.has(observer)) {
            return; // Ya está suscrito
        }
        this.observers.add(observer);
    }

    /**
     * Elimina un observador del sistema para que deje de recibir notificaciones.
     * @param observer Instancia previamente registrada.
     */
    export unsubscribe(observer: IObserver): void {
        if (!observer) {
            throw new Error("El observador proporcionado no es válido.");
        }
        this.observers.delete(observer);
    }

    /**
     * Envía un mensaje a todos los observadores registrados actualmente.
     * @param message Cadena de texto con la información a notificar.
     */
    export notify(message: string): void {
        if (typeof message !== "string") {
            throw new Error("El mensaje de notificación debe ser una cadena de texto.");
        }

        // Iteramos sobre los observadores y ejecutamos su método de actualización
        this.observers.forEach((observer) => {
            try {
                observer.update(message);
            } catch (error) {
                // Manejo de errores individual por observador para no interrumpir el flujo global
                console.error("Error al notificar a un observador:", error);
            }
        });
    }

    /**
     * Método de utilidad para obtener el número de suscriptores activos.
     * @returns Cantidad de observadores.
     */
    export get observerCount(): number {
        return this.observers.size;
    }
}

/**
 * Ejemplo de implementación de un Observador concreto (Solo para referencia, no se ejecuta).
 */
export class ConcreteObserver implements IObserver {
    public lastMessage: string = "";

    constructor(private name: string) {}

    update(message: string): void {
        this.lastMessage = message;
        // Lógica de negocio al recibir la notificación
    }
}