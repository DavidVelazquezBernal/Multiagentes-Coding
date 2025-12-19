import { describe, it, test, expect, vi } from 'vitest';
import { createVehicle } from './function_create_vehicle_type_string_details_make_s';

// Redefine interfaces for test file typing, as they are not exported from the source.
interface Vehicle {
    type: string;
    make: string;
    model: string;
    year: number;
}

interface Car extends Vehicle {
    numDoors: number;
}

interface Truck extends Vehicle {
    cargoCapacityKg: number;
}

interface Motorcycle extends Vehicle {
    engineSizeCc: number;
}

type SpecificVehicle = Car | Truck | Motorcycle;

describe('createVehicle', () => {
    // Dataset for successful vehicle creation (happy path)
    type HappyPathTest = {
        description: string;
        type: string;
        details: { make: string; model: string; year: number; [key: string]: any };
        expectedResult: SpecificVehicle;
    };

    const happyPathData: HappyPathTest[] = [
        {
            description: 'should create a Car successfully',
            type: 'Car',
            details: { make: 'Toyota', model: 'Corolla', year: 2022, numDoors: 4 },
            expectedResult: { type: 'Car', make: 'Toyota', model: 'Corolla', year: 2022, numDoors: 4 },
        },
        {
            description: 'should create a Truck successfully with integer cargo capacity',
            type: 'Truck',
            details: { make: 'Ford', model: 'F-150', year: 2023, cargoCapacityKg: 1500 },
            expectedResult: { type: 'Truck', make: 'Ford', model: 'F-150', year: 2023, cargoCapacityKg: 1500 },
        },
        {
            description: 'should create a Truck successfully with float cargo capacity',
            type: 'Truck',
            details: { make: 'Chevrolet', model: 'Silverado', year: 2024, cargoCapacityKg: 1234.56 },
            expectedResult: { type: 'Truck', make: 'Chevrolet', model: 'Silverado', year: 2024, cargoCapacityKg: 1234.56 },
        },
        {
            description: 'should create a Motorcycle successfully',
            type: 'Motorcycle',
            details: { make: 'Honda', model: 'CBR500R', year: 2021, engineSizeCc: 500 },
            expectedResult: { type: 'Motorcycle', make: 'Honda', model: 'CBR500R', year: 2021, engineSizeCc: 500 },
        },
    ];

    test.each(happyPathData)(
        '$description',
        ({ type, details, expectedResult }: HappyPathTest) => {
            // Arrange - data from dataset
            
            // Act
            const result = createVehicle(type, details);

            // Assert
            expect(result).toEqual(expectedResult);
        }
    );

    // Dataset for common validation errors (make, model, year)
    type CommonErrorTest = {
        description: string;
        type: string;
        details: Partial<{ make: string; model: string; year: number; numDoors: number; cargoCapacityKg: number; engineSizeCc: number; }>;
        expectedErrorMessage: string;
    };

    const commonErrorData: CommonErrorTest[] = [
        {
            description: 'should throw error if make is missing',
            type: 'Car',
            details: { model: 'Civic', year: 2020, numDoors: 4 }, // Add specific fields to avoid cascading errors
            expectedErrorMessage: "Vehicle details must include a non-empty 'make' (string).",
        },
        {
            description: 'should throw error if make is an empty string',
            type: 'Car',
            details: { make: '   ', model: 'Civic', year: 2020, numDoors: 4 },
            expectedErrorMessage: "Vehicle details must include a non-empty 'make' (string).",
        },
        {
            description: 'should throw error if make is not a string',
            type: 'Car',
            details: { make: 123 as any, model: 'Civic', year: 2020, numDoors: 4 },
            expectedErrorMessage: "Vehicle details must include a non-empty 'make' (string).",
        },
        {
            description: 'should throw error if model is missing',
            type: 'Car',
            details: { make: 'Honda', year: 2020, numDoors: 4 },
            expectedErrorMessage: "Vehicle details must include a non-empty 'model' (string).",
        },
        {
            description: 'should throw error if model is an empty string',
            type: 'Car',
            details: { make: 'Honda', model: ' ', year: 2020, numDoors: 4 },
            expectedErrorMessage: "Vehicle details must include a non-empty 'model' (string).",
        },
        {
            description: 'should throw error if model is not a string',
            type: 'Car',
            details: { make: 'Honda', model: true as any, year: 2020, numDoors: 4 },
            expectedErrorMessage: "Vehicle details must include a non-empty 'model' (string).",
        },
        {
            description: 'should throw error if year is missing',
            type: 'Car',
            details: { make: 'Honda', model: 'Civic', numDoors: 4 },
            expectedErrorMessage: "Vehicle 'year' must be a positive integer.",
        },
        {
            description: 'should throw error if year is not a number',
            type: 'Car',
            details: { make: 'Honda', model: 'Civic', year: 'two thousand' as any, numDoors: 4 },
            expectedErrorMessage: "Vehicle 'year' must be a positive integer.",
        },
        {
            description: 'should throw error if year is not an integer',
            type: 'Car',
            details: { make: 'Honda', model: 'Civic', year: 2020.5, numDoors: 4 },
            expectedErrorMessage: "Vehicle 'year' must be a positive integer.",
        },
        {
            description: 'should throw error if year is zero',
            type: 'Car',
            details: { make: 'Honda', model: 'Civic', year: 0, numDoors: 4 },
            expectedErrorMessage: "Vehicle 'year' must be a positive integer.",
        },
        {
            description: 'should throw error if year is negative',
            type: 'Car',
            details: { make: 'Honda', model: 'Civic', year: -1999, numDoors: 4 },
            expectedErrorMessage: "Vehicle 'year' must be a positive integer.",
        },
    ];

    test.each(commonErrorData)(
        '$description',
        ({ type, details, expectedErrorMessage }: CommonErrorTest) => {
            // Arrange - data from dataset
            
            // Act & Assert
            expect(() => createVehicle(type, details as any)).toThrowError(expectedErrorMessage);
        }
    );

    // Dataset for Car-specific validation errors (numDoors)
    const carSpecificErrorData: CommonErrorTest[] = [
        {
            description: 'should throw error if numDoors is missing for Car',
            type: 'Car',
            details: { make: 'VW', model: 'Golf', year: 2020 },
            expectedErrorMessage: "For 'Car', 'numDoors' must be a positive integer.",
        },
        {
            description: 'should throw error if numDoors is not a number for Car',
            type: 'Car',
            details: { make: 'VW', model: 'Golf', year: 2020, numDoors: 'four' as any },
            expectedErrorMessage: "For 'Car', 'numDoors' must be a positive integer.",
        },
        {
            description: 'should throw error if numDoors is not an integer for Car',
            type: 'Car',
            details: { make: 'VW', model: 'Golf', year: 2020, numDoors: 4.5 },
            expectedErrorMessage: "For 'Car', 'numDoors' must be a positive integer.",
        },
        {
            description: 'should throw error if numDoors is zero for Car',
            type: 'Car',
            details: { make: 'VW', model: 'Golf', year: 2020, numDoors: 0 },
            expectedErrorMessage: "For 'Car', 'numDoors' must be a positive integer.",
        },
        {
            description: 'should throw error if numDoors is negative for Car',
            type: 'Car',
            details: { make: 'VW', model: 'Golf', year: 2020, numDoors: -2 },
            expectedErrorMessage: "For 'Car', 'numDoors' must be a positive integer.",
        },
    ];

    test.each(carSpecificErrorData)(
        '$description',
        ({ type, details, expectedErrorMessage }: CommonErrorTest) => {
            // Arrange - data from dataset
            
            // Act & Assert
            expect(() => createVehicle(type, details as any)).toThrowError(expectedErrorMessage);
        }
    );

    // Dataset for Truck-specific validation errors (cargoCapacityKg)
    const truckSpecificErrorData: CommonErrorTest[] = [
        {
            description: 'should throw error if cargoCapacityKg is missing for Truck',
            type: 'Truck',
            details: { make: 'Scania', model: 'R450', year: 2023 },
            expectedErrorMessage: "For 'Truck', 'cargoCapacityKg' must be a positive number.",
        },
        {
            description: 'should throw error if cargoCapacityKg is not a number for Truck',
            type: 'Truck',
            details: { make: 'Scania', model: 'R450', year: 2023, cargoCapacityKg: 'heavy' as any },
            expectedErrorMessage: "For 'Truck', 'cargoCapacityKg' must be a positive number.",
        },
        {
            description: 'should throw error if cargoCapacityKg is zero for Truck',
            type: 'Truck',
            details: { make: 'Scania', model: 'R450', year: 2023, cargoCapacityKg: 0 },
            expectedErrorMessage: "For 'Truck', 'cargoCapacityKg' must be a positive number.",
        },
        {
            description: 'should throw error if cargoCapacityKg is negative for Truck',
            type: 'Truck',
            details: { make: 'Scania', model: 'R450', year: 2023, cargoCapacityKg: -100 },
            expectedErrorMessage: "For 'Truck', 'cargoCapacityKg' must be a positive number.",
        },
    ];

    test.each(truckSpecificErrorData)(
        '$description',
        ({ type, details, expectedErrorMessage }: CommonErrorTest) => {
            // Arrange - data from dataset
            
            // Act & Assert
            expect(() => createVehicle(type, details as any)).toThrowError(expectedErrorMessage);
        }
    );

    // Dataset for Motorcycle-specific validation errors (engineSizeCc)
    const motorcycleSpecificErrorData: CommonErrorTest[] = [
        {
            description: 'should throw error if engineSizeCc is missing for Motorcycle',
            type: 'Motorcycle',
            details: { make: 'Kawasaki', model: 'Ninja 400', year: 2021 },
            expectedErrorMessage: "For 'Motorcycle', 'engineSizeCc' must be a positive integer.",
        },
        {
            description: 'should throw error if engineSizeCc is not a number for Motorcycle',
            type: 'Motorcycle',
            details: { make: 'Kawasaki', model: 'Ninja 400', year: 2021, engineSizeCc: 'four hundred' as any },
            expectedErrorMessage: "For 'Motorcycle', 'engineSizeCc' must be a positive integer.",
        },
        {
            description: 'should throw error if engineSizeCc is not an integer for Motorcycle',
            type: 'Motorcycle',
            details: { make: 'Kawasaki', model: 'Ninja 400', year: 2021, engineSizeCc: 400.5 },
            expectedErrorMessage: "For 'Motorcycle', 'engineSizeCc' must be a positive integer.",
        },
        {
            description: 'should throw error if engineSizeCc is zero for Motorcycle',
            type: 'Motorcycle',
            details: { make: 'Kawasaki', model: 'Ninja 400', year: 2021, engineSizeCc: 0 },
            expectedErrorMessage: "For 'Motorcycle', 'engineSizeCc' must be a positive integer.",
        },
        {
            description: 'should throw error if engineSizeCc is negative for Motorcycle',
            type: 'Motorcycle',
            details: { make: 'Kawasaki', model: 'Ninja 400', year: 2021, engineSizeCc: -100 },
            expectedErrorMessage: "For 'Motorcycle', 'engineSizeCc' must be a positive integer.",
        },
    ];

    test.each(motorcycleSpecificErrorData)(
        '$description',
        ({ type, details, expectedErrorMessage }: CommonErrorTest) => {
            // Arrange - data from dataset
            
            // Act & Assert
            expect(() => createVehicle(type, details as any)).toThrowError(expectedErrorMessage);
        }
    );

    // Test for unsupported vehicle type
    it('should throw error for an unsupported vehicle type', () => {
        // Arrange
        const type = 'Bike';
        const details = { make: 'Giant', model: 'TCR', year: 2022, gears: 22 };

        // Act & Assert
        expect(() => createVehicle(type, details)).toThrowError(
            "Unsupported vehicle type: 'Bike'. Valid types are 'Car', 'Truck', 'Motorcycle'."
        );
    });
});