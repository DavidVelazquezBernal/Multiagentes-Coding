/**
 * Interface representing the properties required to initialize any vehicle.
 */
export interface VehicleProps {
    brand: string;
    model: string;
    year: number;
}

/**
 * Common interface for all vehicle types produced by the factory.
 */
export interface IVehicle {
    drive(): string;
    getDetails(): string;
}

/**
 * Concrete implementation of a Car.
 */
export class Car implements IVehicle {
    constructor(private props: VehicleProps) {}

    public drive(): string {
        return `Driving the car: ${this.props.brand} ${this.props.model}.`;
    }

    public getDetails(): string {
        return `Car Details - Brand: ${this.props.brand}, Model: ${this.props.model}, Year: ${this.props.year}`;
    }
}

/**
 * Concrete implementation of a Motorcycle.
 */
export class Motorcycle implements IVehicle {
    constructor(private props: VehicleProps) {}

    public drive(): string {
        return `Riding the motorcycle: ${this.props.brand} ${this.props.model}.`;
    }

    public getDetails(): string {
        return `Motorcycle Details - Brand: ${this.props.brand}, Model: ${this.props.model}, Year: ${this.props.year}`;
    }
}

/**
 * Concrete implementation of a Truck.
 */
export class Truck implements IVehicle {
    constructor(private props: VehicleProps) {}

    public drive(): string {
        return `Driving the heavy truck: ${this.props.brand} ${this.props.model}.`;
    }

    public getDetails(): string {
        return `Truck Details - Brand: ${this.props.brand}, Model: ${this.props.model}, Year: ${this.props.year}`;
    }
}

/**
 * Factory class to handle dynamic vehicle instantiation.
 */
export class VehicleFactory {
    /**
     * Creates a vehicle instance based on the provided type and properties.
     * 
     * @param type - The type of vehicle to create ('car' | 'motorcycle' | 'truck').
     * @param properties - The basic attributes of the vehicle.
     * @returns An instance of a class implementing IVehicle.
     * @throws Error if the vehicle type is unknown.
     */
    public static createVehicle(type: 'car' | 'motorcycle' | 'truck', properties: VehicleProps): IVehicle {
        // Basic validation of properties
        if (!properties.brand || !properties.model || properties.year === undefined) {
            throw new Error("Invalid properties: brand, model, and year are required.");
        }

        // Implementation of the Factory Pattern logic
        switch (type) {
            case 'car':
                return new Car(properties);
            case 'motorcycle':
                return new Motorcycle(properties);
            case 'truck':
                return new Truck(properties);
            default:
                // Type safety check for runtime (though TypeScript helps at compile time)
                const exhaustiveCheck: never = type;
                throw new Error(`Vehicle type "${exhaustiveCheck}" is not supported by the factory.`);
        }
    }
}

/* 
Example of usage (Do not execute automatically):
const myCar = VehicleFactory.createVehicle('car', { brand: 'Toyota', model: 'Corolla', year: 2024 });
console.log(myCar.getDetails());
*/