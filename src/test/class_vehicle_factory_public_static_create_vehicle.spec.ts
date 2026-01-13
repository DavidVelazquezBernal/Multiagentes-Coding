import { describe, it, test, expect } from 'vitest';
import { VehicleFactory, type VehicleProps, type IVehicle } from './class_vehicle_factory_public_static_create_vehicle';

describe('VehicleFactory', () => {
  test.each([
    {
      description: 'should create a car and return correct drive and details strings',
      type: 'car' as const,
      props: { brand: 'Toyota', model: 'Corolla', year: 2024 },
      expectedDrive: 'Driving the car: Toyota Corolla.',
      expectedDetails: 'Car Details - Brand: Toyota, Model: Corolla, Year: 2024'
    },
    {
      description: 'should create a motorcycle and return correct drive and details strings',
      type: 'motorcycle' as const,
      props: { brand: 'Honda', model: 'CBR', year: 2023 },
      expectedDrive: 'Riding the motorcycle: Honda CBR.',
      expectedDetails: 'Motorcycle Details - Brand: Honda, Model: CBR, Year: 2023'
    },
    {
      description: 'should create a truck and return correct drive and details strings',
      type: 'truck' as const,
      props: { brand: 'Volvo', model: 'FH16', year: 2022 },
      expectedDrive: 'Driving the heavy truck: Volvo FH16.',
      expectedDetails: 'Truck Details - Brand: Volvo, Model: FH16, Year: 2022'
    }
  ])('$description', ({ type, props, expectedDrive, expectedDetails }: { 
    description: string; 
    type: 'car' | 'motorcycle' | 'truck'; 
    props: VehicleProps; 
    expectedDrive: string; 
    expectedDetails: string; 
  }) => {
    // Arrange
    // Data provided by dataset

    // Act
    const vehicle: IVehicle = VehicleFactory.createVehicle(type, props);
    const driveResult: string = vehicle.drive();
    const detailsResult: string = vehicle.getDetails();

    // Assert
    expect(driveResult).toBe(expectedDrive);
    expect(detailsResult).toBe(expectedDetails);
  });

  test.each([
    { description: 'throws error when brand is missing', props: { model: 'Corolla', year: 2024 } as VehicleProps },
    { description: 'throws error when model is missing', props: { brand: 'Toyota', year: 2024 } as VehicleProps },
    { description: 'throws error when year is undefined', props: { brand: 'Toyota', model: 'Corolla' } as unknown as VehicleProps }
  ])('$description', ({ props }: { description: string; props: VehicleProps }) => {
    // Arrange
    const type = 'car';

    // Act & Assert
    expect(() => VehicleFactory.createVehicle(type, props)).toThrow("Invalid properties: brand, model, and year are required.");
  });

  it('should throw error for unknown vehicle type during runtime', () => {
    // Arrange
    const invalidType = 'airplane' as unknown as 'car';
    const props: VehicleProps = { brand: 'Boeing', model: '747', year: 2020 };

    // Act & Assert
    expect(() => VehicleFactory.createVehicle(invalidType, props)).toThrow('Vehicle type "airplane" is not supported by the factory.');
  });
});