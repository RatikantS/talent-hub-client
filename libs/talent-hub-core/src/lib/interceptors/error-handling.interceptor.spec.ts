/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { lastValueFrom, of, throwError } from 'rxjs';

import { ErrorHandlingInterceptor } from '../interceptors';
import { APP_CONSTANT } from '../constants';

// Mock LoggerService
class MockLoggerService {
  error = vi.fn();
}
// Mock EventBusService
class MockEventBusService {
  publish = vi.fn();
}

// Subclass the interceptor to inject mocks
class TestErrorHandlingInterceptor extends ErrorHandlingInterceptor {
  constructor(
    private loggerMock: any,
    private eventBusMock: any,
  ) {
    super();
  }
  protected override getLogger() {
    return this.loggerMock;
  }
  protected override getEventBus() {
    return this.eventBusMock;
  }
}

describe('ErrorHandlingInterceptor', () => {
  let interceptor: ErrorHandlingInterceptor;
  let next: { handle: ReturnType<typeof vi.fn> };
  let mockLogger: MockLoggerService;
  let mockEventBus: MockEventBusService;

  beforeEach(() => {
    mockLogger = new MockLoggerService();
    mockEventBus = new MockEventBusService();
    interceptor = new TestErrorHandlingInterceptor(mockLogger, mockEventBus);
    next = { handle: vi.fn() };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log and publish http.error event for HttpErrorResponse', async () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: '/api/test',
      error: 'Not found',
      headers: undefined,
    });
    next.handle.mockReturnValue(throwError(() => error));
    const req = new HttpRequest('GET', '/api/test');
    await lastValueFrom(
      interceptor
        .intercept(req, next as any)
        .pipe
        // catchError is not needed, we want the error to be thrown
        (),
    ).catch(() => {
      expect(mockLogger.error).toHaveBeenCalledWith('HTTP Error:', {
        status: 404,
        message: error.message,
        error: 'Not found',
      });
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR,
        expect.objectContaining({
          status: 404,
          message: error.message,
          error: 'Not found',
          url: '/api/test',
          method: 'GET',
          requestUrl: '/api/test',
        }),
      );
    });
  });

  it('should log and publish http.unknown.error event for unknown error', async () => {
    const error = { foo: 'bar' };
    next.handle.mockReturnValue(throwError(() => error));
    const req = new HttpRequest('POST' as any, '/api/unknown');
    await lastValueFrom(interceptor.intercept(req, next as any)).catch(() => {
      expect(mockLogger.error).toHaveBeenCalledWith('Unknown HTTP Error:', error);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        APP_CONSTANT.EVENT_BUS_KEYS.HTTP_UNKNOWN_ERROR,
        { error },
      );
    });
  });

  it('should rethrow the error after handling', async () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      url: '/api/fail',
      error: 'fail',
      headers: undefined,
    });
    next.handle.mockReturnValue(throwError(() => error));
    const req = new HttpRequest('DELETE', '/api/fail');
    await expect(lastValueFrom(interceptor.intercept(req, next as any))).rejects.toBe(error);
  });

  it('should pass through successful responses', async () => {
    const response = { body: { ok: true } } as HttpEvent<unknown>;
    next.handle.mockReturnValue(of(response));
    const req = new HttpRequest('GET', '/api/success');
    const res = await lastValueFrom(interceptor.intercept(req, next as any));
    expect(res).toBe(response);
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });
});
