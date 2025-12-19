import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { NotificationSubject, Observer, NotificationData } from './notification_subject_clase_principal_que_gestiona_';

// Mock Observer implementation for testing purposes
class MockObserver implements Observer {
  // Use vi.fn() to create a mock function that can be spied on and tracked
  update: (data: NotificationData) => void = vi.fn();
  constructor(public id: string = 'test-observer') {}
}

describe('NotificationSubject', () => {
  let subject: NotificationSubject;
  let mockObserver1: MockObserver;
  let mockObserver2: MockObserver;

  beforeEach(() => {
    // Arrange: Initialize a new NotificationSubject and mock observers before each test
    subject = new NotificationSubject();
    mockObserver1 = new MockObserver('observer1');
    mockObserver2 = new MockObserver('observer2');
    vi.clearAllMocks(); // Clear any previous mock calls
    // Spy on console.error to suppress output and verify calls for error handling tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console.error implementation after each test
    vi.restoreAllMocks();
  });

  // Test 1: Subscribe method error cases using test.each
  // This test also implicitly covers the happy path of subscription within the 'already subscribed' case's Arrange step.
  test.each([
    { description: 'should throw error when observer is null', observer: null, expectedError: 'NotificationSubject: El observador no puede ser nulo o indefinido.' },
    { description: 'should throw error when observer is undefined', observer: undefined, expectedError: 'NotificationSubject: El observador no puede ser nulo o indefinido.' },
    { description: 'should throw error when observer is already subscribed', observerToPreSubscribe: 'mockObserver1', expectedError: 'NotificationSubject: El observador ya está suscrito.' },
  ])('subscribe %s', ({ description, observer, observerToPreSubscribe, expectedError }: { description: string; observer: Observer | null | undefined; observerToPreSubscribe?: string; expectedError: string }) => {
    // Arrange
    if (observerToPreSubscribe === 'mockObserver1') {
      subject.subscribe(mockObserver1); // Happy path subscription: this covers the actual addition of an observer
      observer = mockObserver1; // Set observer for the 'already subscribed' scenario
      expect((subject as any).observers).toHaveLength(1); // Assert initial state for the 'already subscribed' test
    }
    const observerToTest = observer as Observer; // Cast to Observer for the method call

    // Act & Assert
    expect(() => subject.subscribe(observerToTest)).toThrow(expectedError);
  });

  // Test 2: Unsubscribe method happy path
  it('should unsubscribe a valid observer successfully', () => {
    // Arrange
    subject.subscribe(mockObserver1);
    expect((subject as any).observers).toHaveLength(1); // Verify observer is subscribed

    // Act
    subject.unsubscribe(mockObserver1);

    // Assert
    expect((subject as any).observers).toHaveLength(0); // Verify observer list is empty
    expect((subject as any).observers).not.toContain(mockObserver1); // Ensure observer is no longer in the list
  });

  // Test 3: Unsubscribe method error cases using test.each
  test.each([
    { description: 'should throw error when observer is null', observer: null, expectedError: 'NotificationSubject: El observador no puede ser nulo o indefinido.' },
    { description: 'should throw error when observer is undefined', observer: undefined, expectedError: 'NotificationSubject: El observador no puede ser nulo o indefinido.' },
    { description: 'should throw error when observer is not subscribed', observerToAttemptUnsubscribe: 'mockObserver1', expectedError: 'NotificationSubject: El observador no está suscrito.' },
  ])('unsubscribe %s', ({ description, observer, observerToAttemptUnsubscribe, expectedError }: { description: string; observer: Observer | null | undefined; observerToAttemptUnsubscribe?: string; expectedError: string }) => {
    // Arrange
    // For 'not subscribed' case, mockObserver1 is never subscribed to the subject
    let observerToTest: Observer | null | undefined = observer;
    if (observerToAttemptUnsubscribe === 'mockObserver1') {
      observerToTest = mockObserver1;
    }

    // Act & Assert
    expect(() => subject.unsubscribe(observerToTest as Observer)).toThrow(expectedError);
  });

  // Test 4: Notify method happy path and when no observers are subscribed
  it('should notify all subscribed observers with the correct data, and do nothing if no observers', () => {
    // Arrange
    const notificationData: NotificationData = { type: 'USER_LOGIN', message: 'User logged in', payload: { userId: 'abc-123' } };
    subject.subscribe(mockObserver1);
    subject.subscribe(mockObserver2);

    // Act
    subject.notify(notificationData);

    // Assert
    expect(mockObserver1.update).toHaveBeenCalledTimes(1);
    expect(mockObserver1.update).toHaveBeenCalledWith(notificationData);
    expect(mockObserver2.update).toHaveBeenCalledTimes(1);
    expect(mockObserver2.update).toHaveBeenCalledWith(notificationData);

    // Arrange: Test case with no observers
    const emptySubject = new NotificationSubject();
    const thirdMockObserver = new MockObserver('observer3'); // Another mock to ensure no accidental calls

    // Act: Notify a subject with no observers
    emptySubject.notify(notificationData);

    // Assert: No observer's update method should have been called
    expect(thirdMockObserver.update).not.toHaveBeenCalled();
    expect(mockObserver1.update).toHaveBeenCalledTimes(1); // Ensure previous calls are not affected
    expect(mockObserver2.update).toHaveBeenCalledTimes(1);
  });

  // Test 5: Notify method error cases for invalid notification data using test.each
  test.each([
    { description: 'should throw error for null notification data', data: null, expectedError: "NotificationSubject: Datos de notificación inválidos. Deben contener 'type' y 'message' (ambos cadenas)." },
    { description: 'should throw error for undefined notification data', data: undefined, expectedError: "NotificationSubject: Datos de notificación inválidos. Deben contener 'type' y 'message' (ambos cadenas)." },
    { description: 'should throw error for missing type in notification data', data: { message: 'Test message' } as Partial<NotificationData>, expectedError: "NotificationSubject: Datos de notificación inválidos. Deben contener 'type' y 'message' (ambos cadenas)." },
    { description: 'should throw error for missing message in notification data', data: { type: 'TEST_TYPE' } as Partial<NotificationData>, expectedError: "NotificationSubject: Datos de notificación inválidos. Deben contener 'type' y 'message' (ambos cadenas)." },
    { description: 'should throw error for type not being a string', data: { type: 123, message: 'Test message' } as unknown as NotificationData, expectedError: "NotificationSubject: Datos de notificación inválidos. Deben contener 'type' y 'message' (ambos cadenas)." },
    { description: 'should throw error for message not being a string', data: { type: 'TEST_TYPE', message: 123 } as unknown as NotificationData, expectedError: "NotificationSubject: Datos de notificación inválidos. Deben contener 'type' y 'message' (ambos cadenas)." },
  ])('notify %s', ({ description, data, expectedError }: { description: string; data: NotificationData | Partial<NotificationData> | null | undefined; expectedError: string }) => {
    // Arrange (observers are not relevant for these validation errors)

    // Act & Assert
    expect(() => subject.notify(data as NotificationData)).toThrow(expectedError);
  });

  // Test 6: Notify method gracefully handles errors in individual observer update methods
  it('should handle observer update method errors gracefully and continue notifying other observers', () => {
    // Arrange
    const notificationData: NotificationData = { type: 'ERROR_FLOW', message: 'Testing error handling' };

    // Create a mock observer whose update method will throw an error
    const errorObserver = new MockObserver('error-prone-observer');
    errorObserver.update.mockImplementationOnce(() => {
      throw new Error('Simulated observer update failure');
    });

    // Subscribe a mix of working and error-prone observers
    subject.subscribe(mockObserver1);
    subject.subscribe(errorObserver);
    subject.subscribe(mockObserver2);

    // Act
    subject.notify(notificationData);

    // Assert
    // Verify that the working observers were still notified
    expect(mockObserver1.update).toHaveBeenCalledTimes(1);
    expect(mockObserver1.update).toHaveBeenCalledWith(notificationData);

    expect(mockObserver2.update).toHaveBeenCalledTimes(1);
    expect(mockObserver2.update).toHaveBeenCalledWith(notificationData);

    // Verify that the error-prone observer's update method was called (and threw)
    expect(errorObserver.update).toHaveBeenCalledTimes(1);
    expect(errorObserver.update).toHaveBeenCalledWith(notificationData);

    // Verify that console.error was called exactly once for the failing observer
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `NotificationSubject: Error al notificar al observador ${errorObserver.constructor.name}:`,
      expect.any(Error) // Expects any Error instance
    );
  });
});