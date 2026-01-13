/**
 * Interface defining the common properties for a Vehicle.
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
  getInfo(): string;
}

/**
 * Concrete implementation of a Car.
 */
class Car implements IVehicle {
  constructor(private props: VehicleProps) {}

  public drive(): string {
    return `Driving the car: ${this.props.brand} ${this.props.model}.`;
  }

  public getInfo(): string {
    return `Vehicle Type: Car | Brand: ${this.props.brand} | Model: ${this.props.model} | Year: ${this.props.year}`;
  }
}

/**
 * Concrete implementation of a Motorcycle.
 */
class Motorcycle implements IVehicle {
  constructor(private props: VehicleProps) {}

  public drive(): string {
    return `Riding the motorcycle: ${this.props.brand} ${this.props.model}.`;
  }

  public getInfo(): string {
    return `Vehicle Type: Motorcycle | Brand: ${this.props.brand} | Model: ${this.props.model} | Year: ${this.props.year}`;
  }
}

/**
 * Concrete implementation of a Truck.
 */
class Truck implements IVehicle {
  constructor(private props: VehicleProps) {}

  public drive(): string {
    return `Driving the heavy truck: ${this.props.brand} ${this.props.model}.`;
  }

  public getInfo(): string {
    return `Vehicle Type: Truck | Brand: ${this.props.brand} | Model: ${this.props.model} | Year: ${this.props.year}`;
  }
}

/**
 * Factory class to centralize and decouple the creation of vehicle objects.
 */
export class VehicleFactory {
  /**
   * Creates a vehicle instance based on the provided type and properties.
   * 
   * @param type - The literal type of the vehicle ('car', 'motorcycle', 'truck').
   * @param props - Configuration object containing brand, model, and year.
   * @returns An instance implementing the IVehicle interface.
   * @throws Error if the vehicle type is not supported.
   */
  export static createVehicle(
    type: 'car' | 'motorcycle' | 'truck',
    props: VehicleProps
  ): IVehicle {
    // Basic validation for numeric precision/integrity if year was used in calculations
    // In this context, we ensure the year is rounded to avoid floating point issues if passed incorrectly
    const sanitizedProps = {
      ...props,
      year: Math.round(props.year)
    };

    switch (type) {
      case 'car':
        return new Car(sanitizedProps);
      case 'motorcycle':
        return new Motorcycle(sanitizedProps);
      case 'truck':
        return new Truck(sanitizedProps);
      default:
        // Exhaustive check for unsupported types
        throw new Error(`Unsupported vehicle type: ${type}`);
    }
  }
}