import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { loggingMiddleware } from './function_logging_middleware_req_any_res_any_next_a';

// Define a type for a partial Request/Response object for clarity
interface MockRequest {
  method: string;
  url: string;
  originalUrl?: string;
}

interface MockResponse {
  statusCode: number;
  on: (event: string, listener: (...args: any[]) => void) => void;
  writableEnded: boolean;
}

describe('loggingMiddleware', () => {
  let mockConsoleInfo: ReturnType<typeof vi.spyOn>;
  let mockConsoleWarn: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockHrtime: ReturnType<typeof vi.spyOn>;

  let finishCallback: () => void; // This will store the callback registered with res.on('finish')
  let mockRes: MockResponse;
  let mockNext: vi.Mock;

  beforeEach(() => {
    // Arrange: Spy on console methods and mock their implementation
    mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Arrange: Mock process.hrtime.bigint for consistent duration calculation
    mockHrtime = vi.spyOn(process.hrtime, 'bigint');

    // Arrange: Initialize finishCallback and mock response object
    finishCallback = vi.fn(); // Initialize as a mock function to capture the actual callback
    mockRes = {
      statusCode: 200, // Default status for successful requests
      on: vi.fn((event, callback) => {
        if (event === 'finish') {
          // Store the actual callback function that _simpleLogger.info will use
          (finishCallback as vi.Mock).mockImplementation(callback);
        }
      }),
      writableEnded: false,
    };

    // Arrange: Setup mock next function
    mockNext = vi.fn();
  });

  afterEach(() => {
    // Clean up: Restore all mocks after each test
    mockConsoleInfo.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
    mockHrtime.mockRestore();
  });

  test.each([
    {
      description: 'logs successful request with originalUrl and 200 status',
      req: { method: 'GET', url: '/test', originalUrl: '/api/test' },
      resStatus: 200,
      startTime: 1000000000n, // Start time (1 second)
      endTime: 1500000000n, // End time (1.5 seconds), duration 500ms
      expectedIncomingLogPartial: '--> GET /api/test',
      expectedOutgoingLogPartial: '<-- GET /api/test 200 - 500ms',
    },
    {
      description: 'uses req.url if originalUrl is not available',
      req: { method: 'POST', url: '/data/submit' }, // No originalUrl
      resStatus: 200,
      startTime: 2000000000n, // Start time
      endTime: 2250000000n, // End time, duration 250ms
      expectedIncomingLogPartial: '--> POST /data/submit',
      expectedOutgoingLogPartial: '<-- POST /data/submit 200 - 250ms',
    },
    {
      description: 'logs an outgoing response with a 404 status code',
      req: { method: 'GET', url: '/non-existent' },
      resStatus: 404, // Simulate a 404 Not Found response
      startTime: 4000000000n, // Start time
      endTime: 4123456789n, // End time, duration ~123.456ms
      expectedIncomingLogPartial: '--> GET /non-existent',
      expectedOutgoingLogPartial: '<-- GET /non-existent 404 - 123.456789ms',
    },
    {
      description: 'logs zero duration for an instantaneous request',
      req: { method: 'GET', url: '/instant' },
      resStatus: 200,
      startTime: 5000000000n, // Start time
      endTime: 5000000000n, // End time, duration 0ms
      expectedIncomingLogPartial: '--> GET /instant',
      expectedOutgoingLogPartial: '<-- GET /instant 200 - 0ms',
    },
    {
      description: 'logs a precise decimal duration correctly',
      req: { method: 'PATCH', url: '/update/1' },
      resStatus: 200,
      startTime: 7000000000n,
      endTime: 7123456789n, // Duration: 123456789 nanoseconds = 123.45679 milliseconds
      expectedIncomingLogPartial: '--> PATCH /update/1',
      expectedOutgoingLogPartial: '<-- PATCH /update/1 200 - 123.456789ms',
    },
  ])('should $description', ({ req, resStatus, startTime, endTime, expectedIncomingLogPartial, expectedOutgoingLogPartial }) => {
    // Arrange
    mockRes.statusCode = resStatus;
    mockHrtime.mockReturnValueOnce(startTime).mockReturnValueOnce(endTime);

    // Act
    loggingMiddleware(req, mockRes, mockNext);
    (finishCallback as Function)(); // Explicitly trigger the finish event captured by res.on('finish')

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockConsoleInfo).toHaveBeenCalledTimes(2); // One for incoming, one for outgoing

    // Verify incoming request log
    expect(mockConsoleInfo).toHaveBeenNthCalledWith(1, expect.stringContaining(expectedIncomingLogPartial));

    // Verify outgoing response log
    expect(mockConsoleInfo).toHaveBeenNthCalledWith(2, expect.stringContaining(expectedOutgoingLogPartial));
    expect(mockConsoleError).not.toHaveBeenCalled();
    expect(mockConsoleWarn).not.toHaveBeenCalled();
  });

  it('should log error and call next with error when next() throws synchronously', () => {
    // Arrange
    const mockReq: MockRequest = { method: 'PUT', url: '/items/123', originalUrl: '/api/items/123' };
    const testErrorMessage = 'Something went wrong synchronously!';
    const testError = new Error(testErrorMessage);

    // Simulate a subsequent middleware throwing a synchronous error
    mockNext.mockImplementationOnce(() => {
      throw testError;
    });

    mockHrtime.mockReturnValueOnce(3000000000n) // Start time
              .mockReturnValueOnce(3000000000n); // End time (duration 0ms for the finish log)

    // Act
    // The middleware's try-catch will catch the error thrown by mockNext
    loggingMiddleware(mockReq, mockRes, mockNext);
    // The 'finish' event listener is registered outside the try-catch, so it should still fire.
    (finishCallback as Function)();

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(2); // First call (throws), second call (next(error))
    expect(mockNext).toHaveBeenNthCalledWith(1); // The first call to next() is without arguments
    expect(mockNext).toHaveBeenNthCalledWith(2, testError); // The second call to next() is with the caught error

    expect(mockConsoleInfo).toHaveBeenCalledTimes(2); // One for incoming request, one for outgoing (even if it's an error)
    expect(mockConsoleInfo).toHaveBeenNthCalledWith(1, expect.stringContaining(`--> PUT /api/items/123`));
    // The middleware logs the `res.statusCode` which is 200 by default in our mock unless explicitly changed.
    expect(mockConsoleInfo).toHaveBeenNthCalledWith(2, expect.stringContaining(`<-- PUT /api/items/123 200 - 0ms`));

    expect(mockConsoleError).toHaveBeenCalledTimes(1); // Error should be logged
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(`Error procesando PUT /api/items/123: ${testErrorMessage}`),
      testError
    );
    expect(mockConsoleWarn).not.toHaveBeenCalled();
  });
});