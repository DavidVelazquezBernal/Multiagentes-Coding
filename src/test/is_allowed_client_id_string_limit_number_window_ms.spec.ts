import { describe, it, test, expect, vi, beforeEach } from 'vitest';
import { isAllowed } from './is_allowed_client_id_string_limit_number_window_ms';

describe('isAllowed', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test.each([
    { description: 'empty clientId string', clientId: '', limit: 5, windowMs: 1000, expectedError: "El 'clientId' debe ser un string válido y no estar vacío." },
    { description: 'non-string clientId', clientId: 123 as any, limit: 5, windowMs: 1000, expectedError: "El 'clientId' debe ser un string válido y no estar vacío." },
    { description: 'limit as zero', clientId: 'user-1', limit: 0, windowMs: 1000, expectedError: "El 'limit' debe ser un número entero positivo." },
    { description: 'negative limit', clientId: 'user-2', limit: -10, windowMs: 1000, expectedError: "El 'limit' debe ser un número entero positivo." },
    { description: 'windowMs as zero', clientId: 'user-3', limit: 5, windowMs: 0, expectedError: "El 'windowMs' debe ser un número positivo que represente el intervalo de tiempo." },
  ])('should throw error when $description', async ({ clientId, limit, windowMs, expectedError }: { description: string; clientId: string; limit: number; windowMs: number; expectedError: string }) => {
    // Arrange & Act & Assert
    await expect(isAllowed(clientId, limit, windowMs)).rejects.toThrow(expectedError);
  });

  it('should allow requests up to the limit and then deny further requests', async () => {
    // Arrange
    const clientId: string = 'test-limit-client';
    const limit: number = 2;
    const windowMs: number = 5000;
    vi.spyOn(Date, 'now').mockReturnValue(10000);

    // Act
    const firstRequest: boolean = await isAllowed(clientId, limit, windowMs);
    const secondRequest: boolean = await isAllowed(clientId, limit, windowMs);
    const thirdRequest: boolean = await isAllowed(clientId, limit, windowMs);

    // Assert
    expect(firstRequest).toBe(true);
    expect(secondRequest).toBe(true);
    expect(thirdRequest).toBe(false);
  });

  it('should allow a new request after the oldest one expires from the sliding window', async () => {
    // Arrange
    const clientId: string = 'test-expiration-client';
    const limit: number = 1;
    const windowMs: number = 1000;
    const dateSpy = vi.spyOn(Date, 'now');

    // Act & Assert - First request at T=1000
    dateSpy.mockReturnValue(1000);
    const req1: boolean = await isAllowed(clientId, limit, windowMs);
    expect(req1).toBe(true);

    // Act & Assert - Second request at T=1500 (denied)
    dateSpy.mockReturnValue(1500);
    const req2: boolean = await isAllowed(clientId, limit, windowMs);
    expect(req2).toBe(false);

    // Act & Assert - Third request at T=2001 (allowed because T=1000 is expired)
    dateSpy.mockReturnValue(2001);
    const req3: boolean = await isAllowed(clientId, limit, windowMs);
    expect(req3).toBe(true);
  });

  it('should maintain independent counters for different client IDs', async () => {
    // Arrange
    const clientAlpha: string = 'alpha-client';
    const clientBeta: string = 'beta-client';
    const limit: number = 1;
    const windowMs: number = 1000;
    vi.spyOn(Date, 'now').mockReturnValue(5000);

    // Act
    const alphaFirst: boolean = await isAllowed(clientAlpha, limit, windowMs);
    const betaFirst: boolean = await isAllowed(clientBeta, limit, windowMs);
    const alphaSecond: boolean = await isAllowed(clientAlpha, limit, windowMs);

    // Assert
    expect(alphaFirst).toBe(true);
    expect(betaFirst).toBe(true);
    expect(alphaSecond).toBe(false);
  });
});