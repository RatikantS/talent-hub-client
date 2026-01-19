/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { LoadingIndicatorInterceptor } from '../interceptors';

class MockLoadingIndicatorService {
  show = vi.fn();
  hide = vi.fn();
}

class MockHandler {
  handle = vi.fn();
}

describe('LoadingIndicatorInterceptor', () => {
  let interceptor: LoadingIndicatorInterceptor;
  let loadingService: MockLoadingIndicatorService;
  let handler: MockHandler;

  beforeEach(() => {
    loadingService = new MockLoadingIndicatorService();
    // Subclass to inject mock service
    class TestInterceptor extends LoadingIndicatorInterceptor {
      constructor(private mockService: MockLoadingIndicatorService) {
        super();
      }
      protected override getLoadingIndicatorService() {
        return this.mockService as any;
      }
    }
    interceptor = new TestInterceptor(loadingService) as any;
    handler = new MockHandler();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show and hide loader on successful request', async () => {
    handler.handle.mockReturnValue(of(new HttpResponse({ body: { ok: true } })));
    const req = new HttpRequest('GET', '/api/data');
    await interceptor.intercept(req, handler as any).toPromise();
    expect(loadingService.show).toHaveBeenCalledTimes(1);
    expect(loadingService.hide).toHaveBeenCalledTimes(1);
    expect(loadingService.show).toHaveBeenCalledBefore(loadingService.hide);
  });

  it('should show and hide loader on error', async () => {
    handler.handle.mockReturnValue(throwError(() => new Error('fail')));
    const req = new HttpRequest('GET', '/api/data');
    await expect(interceptor.intercept(req, handler as any).toPromise()).rejects.toThrow('fail');
    expect(loadingService.show).toHaveBeenCalledTimes(1);
    expect(loadingService.hide).toHaveBeenCalledTimes(1);
  });

  it('should show and hide loader for non-GET requests', async () => {
    handler.handle.mockReturnValue(of(new HttpResponse({ body: { ok: true } })));
    const req = new HttpRequest('POST' as any, '/api/data');
    await interceptor.intercept(req, handler as any).toPromise();
    expect(loadingService.show).toHaveBeenCalledTimes(1);
    expect(loadingService.hide).toHaveBeenCalledTimes(1);
  });
});
