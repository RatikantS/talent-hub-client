/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @fileoverview Unit tests for ApiPrefixInterceptor.
 *
 * Tests use Angular's `Injector.create()` and `runInInjectionContext()` to properly
 * instantiate the interceptor with mocked dependencies. This approach works with
 * the interceptor's use of `inject()` at the class field level.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';

import { ApiPrefixInterceptor } from '../interceptors';
import { API_BASE_URL } from '../tokens';

describe('ApiPrefixInterceptor', () => {
  let interceptor: ApiPrefixInterceptor;
  let next: { handle: ReturnType<typeof vi.fn> };
  let injector: Injector;
  const baseUrl = 'https://api.example.com';

  function createInterceptor(url: string): ApiPrefixInterceptor {
    injector = Injector.create({
      providers: [{ provide: API_BASE_URL, useValue: url }],
    });
    return runInInjectionContext(injector, () => new ApiPrefixInterceptor());
  }

  beforeEach(() => {
    next = { handle: vi.fn().mockReturnValue(of({} as HttpEvent<unknown>)) };
    interceptor = createInterceptor(baseUrl);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not prefix absolute http URL', () => {
    const req = new HttpRequest('GET', 'http://external.com/data');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should not prefix absolute https URL', () => {
    const req = new HttpRequest('GET', 'https://external.com/data');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should not prefix protocol-relative URL', () => {
    const req = new HttpRequest('GET', '//external.com/data');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should prefix relative URL without leading slash', () => {
    const req = new HttpRequest('GET', 'users');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should prefix relative URL with leading slash', () => {
    const req = new HttpRequest('GET', '/users');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should handle baseUrl with trailing slash and url with leading slash', () => {
    interceptor = createInterceptor('https://api.example.com/');
    const req = new HttpRequest('GET', '/users');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should handle baseUrl without trailing slash and url without leading slash', () => {
    interceptor = createInterceptor('https://api.example.com');
    const req = new HttpRequest('GET', 'users');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should handle empty path', () => {
    const req = new HttpRequest('GET', '');
    interceptor.intercept(req, next as unknown as Parameters<typeof interceptor.intercept>[1]);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/');
  });
});
