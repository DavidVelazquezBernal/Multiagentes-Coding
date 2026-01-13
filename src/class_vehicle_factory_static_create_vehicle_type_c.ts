/**
 * Interfaz base que define la estructura común para todos los vehículos.
 */
export interface IVehicle {
    brand: string;
    model: string;
    drive(): string;
}

/**
 * Clase que representa un vehículo de tipo Coche.
 */
export class Car implements IVehicle {
    brand: string;
    model: string;
    doors: number;

    constructor(properties: Record<string, any>) {
        this.brand = properties.brand || "Generic";
        this.model = properties.model || "Base";
        this.doors = typeof properties.doors === 'number' ? properties.doors : 5;
    }

    public drive(): string {
        return `Conduciendo un coche ${this.brand} ${this.model} con ${this.doors} puertas.`;
    }
}

/**
 * Clase que representa un vehículo de tipo Moto.
 */
export class Motorcycle implements IVehicle {
    brand: string;
    model: string;
    displacement: number;

    constructor(properties: Record<string, any>) {
        this.brand = properties.brand || "Generic";
        this.model = properties.model || "Base";
        // Aplicamos redondeo de precisión según los requisitos
        const rawDisplacement = typeof properties.displacement === 'number' ? properties.displacement : 0;
        this.displacement = Math.round(rawDisplacement * 1e10) / 1e10;
    }

    public drive(): string {
        return `Conduciendo una moto ${this.brand} ${this.model} de ${this.displacement}cc.`;
    }
}

/**
 * Clase que representa un vehículo de tipo Camión.
 */
export class Truck implements IVehicle {
    brand: string;
    model: string;
    loadCapacity: number;

    constructor(properties: Record<string, any>) {
        this.brand = properties.brand || "Generic";
        this.model = properties.model || "Base";
        // Aplicamos redondeo de precisión según los requisitos
        const rawCapacity = typeof properties.loadCapacity === 'number' ? properties.loadCapacity : 0;
        this.loadCapacity = Math.round(rawCapacity * 1e10) / 1e10;
    }

    public drive(): string {
        return `Conduciendo un camión ${this.brand} ${this.model} con capacidad de ${this.loadCapacity}kg.`;
    }
}

/**
 * Implementación del patrón Factory para la creación dinámica de vehículos.
 */
export class VehicleFactory {
    /**
     * Crea una instancia de un vehículo basada en el tipo proporcionado.
     * 
     * @param type - El identificador del tipo de vehículo ('car', 'motorcycle', 'truck').
     * @param properties - Objeto de configuración con las propiedades del vehículo.
     * @returns Una instancia que implementa IVehicle.
     * @throws Error si el tipo de vehículo no es soportado o los datos son inválidos.
     */
    static createVehicle(type: 'car' | 'motorcycle' | 'truck', properties: Record<string, any>): IVehicle {
        if (!properties || typeof properties !== 'object') {
            throw new Error("Se requiere un objeto de propiedades válido para crear un vehículo.");
        }

        switch (type) {
            case 'car':
                return new Car(properties);
            case 'motorcycle':
                return new Motorcycle(properties);
            case 'truck':
                return new Truck(properties);
            default:
                // Lanzamos excepción descriptiva para tipos no soportados
                const exhaustiveCheck: never = type;
                throw new Error(`Tipo de vehículo '${exhaustiveCheck}' no reconocido por la factoría.`);
        }
    }
}