/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpEvent, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

import { ApiPrefixInterceptor } from '../interceptors';

// Subclass the interceptor to inject a mock baseUrl
class TestApiPrefixInterceptor extends ApiPrefixInterceptor {
  constructor(private baseUrlMock: string) {
    super();
  }
  protected override getBaseUrl() {
    return this.baseUrlMock;
  }
}

describe('ApiPrefixInterceptor', () => {
  let interceptor: ApiPrefixInterceptor;
  let next: { handle: ReturnType<typeof vi.fn> };
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    next = { handle: vi.fn().mockReturnValue(of({} as HttpEvent<unknown>)) };
    interceptor = new TestApiPrefixInterceptor(baseUrl);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not prefix absolute http URL', () => {
    const req = new HttpRequest('GET', 'http://external.com/data');
    interceptor.intercept(req, next as any);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should not prefix absolute https URL', () => {
    const req = new HttpRequest('GET', 'https://external.com/data');
    interceptor.intercept(req, next as any);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should not prefix protocol-relative URL', () => {
    const req = new HttpRequest('GET', '//external.com/data');
    interceptor.intercept(req, next as any);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should prefix relative URL without leading slash', () => {
    const req = new HttpRequest('GET', 'users');
    interceptor.intercept(req, next as any);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should prefix relative URL with leading slash', () => {
    const req = new HttpRequest('GET', '/users');
    interceptor.intercept(req, next as any);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should handle baseUrl with trailing slash and url with leading slash', () => {
    interceptor = new TestApiPrefixInterceptor('https://api.example.com/');
    const req = new HttpRequest('GET', '/users');
    interceptor.intercept(req, next as any);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should handle baseUrl without trailing slash and url without leading slash', () => {
    interceptor = new TestApiPrefixInterceptor('https://api.example.com');
    const req = new HttpRequest('GET', 'users');
    interceptor.intercept(req, next as any);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/users');
  });

  it('should handle empty path', () => {
    const req = new HttpRequest('GET', '');
    interceptor.intercept(req, next as any);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.url).toBe('https://api.example.com/');
  });
});
