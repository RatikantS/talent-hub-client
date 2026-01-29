/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @fileoverview Unit tests for ErrorHandlingInterceptor.
 *
 * Tests use Angular's `Injector.create()` and `runInInjectionContext()` to properly
 * instantiate the interceptor with mocked dependencies. This approach works with
 * the interceptor's use of `inject()` at the class field level.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { lastValueFrom, of, throwError } from 'rxjs';

import { ErrorHandlingInterceptor } from '../interceptors';
import { EventBusService, LoggerService } from '../services';
import { APP_CONSTANT } from '../constants';

describe('ErrorHandlingInterceptor', () => {
  let interceptor: ErrorHandlingInterceptor;
  let next: { handle: ReturnType<typeof vi.fn> };
  let injector: Injector;
  let mockLogger: { error: ReturnType<typeof vi.fn> };
  let mockEventBus: { publish: ReturnType<typeof vi.fn> };

  function createInterceptor(): ErrorHandlingInterceptor {
    mockLogger = { error: vi.fn() };
    mockEventBus = { publish: vi.fn() };
    injector = Injector.create({
      providers: [
        { provide: LoggerService, useValue: mockLogger },
        { provide: EventBusService, useValue: mockEventBus },
      ],
    });
    return runInInjectionContext(injector, () => new ErrorHandlingInterceptor());
  }

  beforeEach(() => {
    interceptor = createInterceptor();
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
      interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]),
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
    const req = new HttpRequest('POST', '/api/unknown', {});
    await lastValueFrom(
      interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]),
    ).catch(() => {
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
    await expect(
      lastValueFrom(
        interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]),
      ),
    ).rejects.toBe(error);
  });

  it('should pass through successful responses', async () => {
    const response = { body: { ok: true } } as HttpEvent<unknown>;
    next.handle.mockReturnValue(of(response));
    const req = new HttpRequest('GET', '/api/success');
    const res = await lastValueFrom(
      interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]),
    );
    expect(res).toBe(response);
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });
});
