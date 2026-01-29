/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @fileoverview Unit tests for LoadingIndicatorInterceptor.
 *
 * Tests use Angular's `Injector.create()` and `runInInjectionContext()` to properly
 * instantiate the interceptor with mocked dependencies. This approach works with
 * the interceptor's use of `inject()` at the class field level.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { of, throwError } from 'rxjs';

import { LoadingIndicatorInterceptor } from '../interceptors';
import { LoadingIndicatorService } from '../services';

describe('LoadingIndicatorInterceptor', () => {
  let interceptor: LoadingIndicatorInterceptor;
  let injector: Injector;
  let mockLoadingService: { show: ReturnType<typeof vi.fn>; hide: ReturnType<typeof vi.fn> };
  let handler: { handle: ReturnType<typeof vi.fn> };

  function createInterceptor(): LoadingIndicatorInterceptor {
    mockLoadingService = { show: vi.fn(), hide: vi.fn() };
    injector = Injector.create({
      providers: [{ provide: LoadingIndicatorService, useValue: mockLoadingService }],
    });
    return runInInjectionContext(injector, () => new LoadingIndicatorInterceptor());
  }

  beforeEach(() => {
    interceptor = createInterceptor();
    handler = { handle: vi.fn() };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show and hide loader on successful request', async () => {
    handler.handle.mockReturnValue(of(new HttpResponse({ body: { ok: true } })));
    const req = new HttpRequest('GET', '/api/data');
    await interceptor
      .intercept(req, handler as unknown as Parameters<typeof interceptor.intercept>[1])
      .toPromise();
    expect(mockLoadingService.show).toHaveBeenCalledTimes(1);
    expect(mockLoadingService.hide).toHaveBeenCalledTimes(1);
    expect(mockLoadingService.show).toHaveBeenCalledBefore(mockLoadingService.hide);
  });

  it('should show and hide loader on error', async () => {
    handler.handle.mockReturnValue(throwError(() => new Error('fail')));
    const req = new HttpRequest('GET', '/api/data');
    await expect(
      interceptor
        .intercept(req, handler as unknown as Parameters<typeof interceptor.intercept>[1])
        .toPromise(),
    ).rejects.toThrow('fail');
    expect(mockLoadingService.show).toHaveBeenCalledTimes(1);
    expect(mockLoadingService.hide).toHaveBeenCalledTimes(1);
  });

  it('should show and hide loader for non-GET requests', async () => {
    handler.handle.mockReturnValue(of(new HttpResponse({ body: { ok: true } })));
    const req = new HttpRequest('POST', '/api/data', {});
    await interceptor
      .intercept(req, handler as unknown as Parameters<typeof interceptor.intercept>[1])
      .toPromise();
    expect(mockLoadingService.show).toHaveBeenCalledTimes(1);
    expect(mockLoadingService.hide).toHaveBeenCalledTimes(1);
  });
});
