/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @fileoverview Unit tests for AuthInterceptor.
 *
 * Tests use Angular's `Injector.create()` and `runInInjectionContext()` to properly
 * instantiate the interceptor with mocked dependencies. This approach works with
 * the interceptor's use of `inject()` at the class field level.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';

import { AuthInterceptor } from '../interceptors';
import { AuthService } from '../services';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let next: { handle: ReturnType<typeof vi.fn> };
  let injector: Injector;
  let mockAuthService: { getToken: ReturnType<typeof vi.fn> };

  function createInterceptor(): AuthInterceptor {
    mockAuthService = { getToken: vi.fn() };
    injector = Injector.create({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    return runInInjectionContext(injector, () => new AuthInterceptor());
  }

  beforeEach(() => {
    interceptor = createInterceptor();
    next = { handle: vi.fn().mockReturnValue(of({} as HttpEvent<unknown>)) };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should forward request unchanged if no token', () => {
    mockAuthService.getToken.mockReturnValue(null);
    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should forward request unchanged if Authorization header already exists', () => {
    mockAuthService.getToken.mockReturnValue('abc123');
    const req = new HttpRequest('GET', '/api/data', {
      headers: new HttpHeaders({ Authorization: 'Bearer xyz' }),
    });
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should add Authorization header if token exists and header is missing', () => {
    mockAuthService.getToken.mockReturnValue('abc123');
    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.headers.get('Authorization')).toBe('Bearer abc123');
    expect(calledReq).not.toBe(req); // Should be a clone
  });

  it('should not mutate the original request', () => {
    mockAuthService.getToken.mockReturnValue('abc123');
    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    expect(req.headers.has('Authorization')).toBe(false);
  });
});
