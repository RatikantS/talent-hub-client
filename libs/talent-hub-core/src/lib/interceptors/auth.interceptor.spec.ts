/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

import { AuthInterceptor } from '../interceptors';

// Mock AuthService implementation
class MockAuthService {
  getToken = vi.fn();
}

// Subclass the interceptor to inject a mock AuthService
class TestAuthInterceptor extends AuthInterceptor {
  constructor(private authServiceMock: MockAuthService) {
    super();
  }
  protected override getAuthService() {
    return this.authServiceMock as any;
  }
}

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let next: { handle: ReturnType<typeof vi.fn> };
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    interceptor = new TestAuthInterceptor(mockAuthService);
    next = { handle: vi.fn().mockReturnValue(of({} as HttpEvent<unknown>)) };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should forward request unchanged if no token', () => {
    mockAuthService.getToken.mockReturnValue(null);
    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, next as any);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should forward request unchanged if Authorization header already exists', () => {
    mockAuthService.getToken.mockReturnValue('abc123');
    // Use Angular's HttpHeaders to create a headers object with Authorization
    const req = new HttpRequest('GET', '/api/data', {
      headers: new HttpHeaders({ Authorization: 'Bearer xyz' }),
    });
    interceptor.intercept(req, next as any);
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should add Authorization header if token exists and header is missing', () => {
    mockAuthService.getToken.mockReturnValue('abc123');
    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, next as any);
    const calledReq = next.handle.mock.calls[0][0];
    expect(calledReq.headers.get('Authorization')).toBe('Bearer abc123');
    expect(calledReq).not.toBe(req); // Should be a clone
  });

  it('should not mutate the original request', () => {
    mockAuthService.getToken.mockReturnValue('abc123');
    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, next as any);
    expect(req.headers.has('Authorization')).toBe(false);
  });
});
