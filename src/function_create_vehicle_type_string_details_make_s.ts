/**
 * @fileoverview
 * Implements a Factory Pattern in TypeScript to generate instances of different vehicle types.
 * This file contains the necessary interfaces and the factory function `createVehicle`
 * to produce 'Car', 'Truck', or 'Motorcycle' objects with their specific characteristics.
 */

// Define the base interface for all vehicles.
// It includes common properties shared across all vehicle types.
interface Vehicle {
    type: string;
    make: string;
    model: string;
    year: number;
}

// Define the interface for a Car, extending the base Vehicle interface.
// It adds the 'numDoors' property specific to cars.
interface Car extends Vehicle {
    numDoors: number;
}

// Define the interface for a Truck, extending the base Vehicle interface.
// It adds the 'cargoCapacityKg' property specific to trucks.
interface Truck extends Vehicle {
    cargoCapacityKg: number;
}

// Define the interface for a Motorcycle, extending the base Vehicle interface.
// It adds the 'engineSizeCc' property specific to motorcycles.
interface Motorcycle extends Vehicle {
    engineSizeCc: number;
}

// Define a union type for the specific vehicle types that the factory can produce.
// This allows the function's return type to be accurately represented as one of these specific types,
// enabling TypeScript to correctly infer the properties available on the returned object.
type SpecificVehicle = Car | Truck | Motorcycle;

/**
 * Implements the Factory Pattern to generate instances of different types of vehicles.
 *
 * This function acts as a factory, creating and returning vehicle objects based on the
 * provided type and details. It ensures that each vehicle type has its specific
 * properties and performs basic validation for required fields, throwing an error
 * if conditions are not met.
 *
 * @param type - A string specifying the type of vehicle to create ('Car', 'Truck', 'Motorcycle').
 *               This string is case-sensitive.
 * @param details - An object containing the common and specific properties of the vehicle.
 *                  It must include 'make: string', 'model: string', and 'year: number'.
 *                  - For 'Car': additionally requires 'numDoors: number'.
 *                  - For 'Truck': additionally requires 'cargoCapacityKg: number'.
 *                  - For 'Motorcycle': additionally requires 'engineSizeCc: number'.
 *                  The `[key: string]: any` allows for additional properties in the input
 *                  details beyond the strict definition, which is common in flexible factory inputs.
 * @returns An object conforming to the 'SpecificVehicle' union type (Car, Truck, or Motorcycle),
 *          with all specified properties properly typed.
 * @throws Error if the provided vehicle `type` is unsupported, or if any required details
 *         are missing, have an incorrect type, or fail validation checks for the specified
 *         vehicle type.
 */
export function createVehicle(
    type: string,
    details: { make: string; model: string; year: number; [key: string]: any }
): SpecificVehicle {
    // --- Common Validation for all Vehicle Types ---
    // Ensure 'make' is provided and is a non-empty string.
    if (typeof details.make !== 'string' || details.make.trim() === '') {
        throw new Error("Vehicle details must include a non-empty 'make' (string).");
    }
    // Ensure 'model' is provided and is a non-empty string.
    if (typeof details.model !== 'string' || details.model.trim() === '') {
        throw new Error("Vehicle details must include a non-empty 'model' (string).");
    }
    // Ensure 'year' is a positive integer.
    if (typeof details.year !== 'number' || !Number.isInteger(details.year) || details.year <= 0) {
        throw new Error("Vehicle 'year' must be a positive integer.");
    }

    // --- Type-Specific Vehicle Creation ---
    // Use a switch statement to handle different vehicle types,
    // ensuring type-specific properties are present and valid.
    switch (type) {
        case 'Car':
            // Validate 'numDoors' specific to Car: must be a positive integer.
            if (typeof details.numDoors !== 'number' || !Number.isInteger(details.numDoors) || details.numDoors <= 0) {
                throw new Error("For 'Car', 'numDoors' must be a positive integer.");
            }
            // Create and return a Car object. Type assertion `as Car` is used to inform
            // TypeScript that the constructed object conforms to the Car interface.
            return {
                type: 'Car',
                make: details.make,
                model: details.model,
                year: details.year,
                numDoors: details.numDoors,
            } as Car;

        case 'Truck':
            // Validate 'cargoCapacityKg' specific to Truck: must be a positive number (can be float).
            if (typeof details.cargoCapacityKg !== 'number' || details.cargoCapacityKg <= 0) {
                throw new Error("For 'Truck', 'cargoCapacityKg' must be a positive number.");
            }
            // Create and return a Truck object.
            return {
                type: 'Truck',
                make: details.make,
                model: details.model,
                year: details.year,
                cargoCapacityKg: details.cargoCapacityKg,
            } as Truck;

        case 'Motorcycle':
            // Validate 'engineSizeCc' specific to Motorcycle: must be a positive integer.
            if (typeof details.engineSizeCc !== 'number' || !Number.isInteger(details.engineSizeCc) || details.engineSizeCc <= 0) {
                throw new Error("For 'Motorcycle', 'engineSizeCc' must be a positive integer.");
            }
            // Create and return a Motorcycle object.
            return {
                type: 'Motorcycle',
                make: details.make,
                model: details.model,
                year: details.year,
                engineSizeCc: details.engineSizeCc,
            } as Motorcycle;

        default:
            // If the provided `type` does not match any known vehicle types, throw an error.
            throw new Error(`Unsupported vehicle type: '${type}'. Valid types are 'Car', 'Truck', 'Motorcycle'.`);
    }
}

// --- Ejemplos de uso (NO deben ejecutarse automáticamente al importar el código) ---
/*
// Ejemplo 1: Creación exitosa de un Coche
try {
    const myCar = createVehicle('Car', {
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        numDoors: 4
    });
    console.log('Coche creado:', myCar);
    // Expected output: { type: 'Car', make: 'Toyota', model: 'Corolla', year: 2022, numDoors: 4 }
} catch (error: any) {
    console.error('Error al crear coche:', error.message);
}

// Ejemplo 2: Creación exitosa de un Camión
try {
    const myTruck = createVehicle('Truck', {
        make: 'Ford',
        model: 'F-150',
        year: 2023,
        cargoCapacityKg: 1500.5 // cargoCapacityKg can be a float
    });
    console.log('Camión creado:', myTruck);
    // Expected output: { type: 'Truck', make: 'Ford', model: 'F-150', year: 2023, cargoCapacityKg: 1500.5 }
} catch (error: any) {
    console.error('Error al crear camión:', error.message);
}

// Ejemplo 3: Creación exitosa de una Motocicleta
try {
    const myMotorcycle = createVehicle('Motorcycle', {
        make: 'Honda',
        model: 'CBR500R',
        year: 2021,
        engineSizeCc: 500
    });
    console.log('Motocicleta creada:', myMotorcycle);
    // Expected output: { type: 'Motorcycle', make: 'Honda', model: 'CBR500R', year: 2021, engineSizeCc: 500 }
} catch (error: any) {
    console.error('Error al crear motocicleta:', error.message);
}

// Ejemplo 4: Error - Tipo de vehículo no soportado
try {
    const myBike = createVehicle('Bike', {
        make: 'Giant',
        model: 'TCR',
        year: 2202,
        gears: 22
    });
    console.log('Bicicleta creada:', myBike); // This line will not be reached
} catch (error: any) {
    console.error('Error al crear bicicleta:', error.message);
    // Expected output: Error al crear bicicleta: Unsupported vehicle type: 'Bike'. Valid types are 'Car', 'Truck', 'Motorcycle'.
}

// Ejemplo 5: Error - Faltan detalles comunes ('make')
try {
    const invalidCar = createVehicle('Car', {
        model: 'Civic',
        year: 2020,
        numDoors: 4
    });
    console.log('Coche inválido creado:', invalidCar); // This line will not be reached
} catch (error: any) {
    console.error('Error al crear coche inválido:', error.message);
    // Expected output: Error al crear coche inválido: Vehicle details must include a non-empty 'make' (string).
}

// Ejemplo 6: Error - Faltan detalles específicos ('numDoors') para Car
try {
    const carWithoutDoors = createVehicle('Car', {
        make: 'Nissan',
        model: 'Leaf',
        year: 2024,
        // numDoors is intentionally missing
    });
    console.log('Coche sin puertas creado:', carWithoutDoors); // This line will not be reached
} catch (error: any) {
    console.error('Error al crear coche sin puertas:', error.message);
    // Expected output: Error al crear coche sin puertas: For 'Car', 'numDoors' must be a positive integer.
}

// Ejemplo 7: Error - 'year' no es un número entero válido
try {
    const carInvalidYear = createVehicle('Car', {
        make: 'Tesla',
        model: 'Model 3',
        year: 'dos mil veinticuatro' as any, // Simulate invalid year type
        numDoors: 4
    });
    console.log('Coche con año inválido creado:', carInvalidYear); // This line will not be reached
} catch (error: any) {
    console.error('Error al crear coche con año inválido:', error.message);
    // Expected output: Error al crear coche con año inválido: Vehicle 'year' must be a positive integer.
}
*/