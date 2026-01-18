/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from '../guards';
import { AuthService } from '../services';

const getRoute = (data?: Record<string, unknown>) => ({ data }) as any;

describe('authGuard', () => {
  let mockAuthService: { isAuthenticated: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockAuthService = { isAuthenticated: vi.fn() };
    mockRouter = { createUrlTree: vi.fn((url) => url) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access if authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard(getRoute(), {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to /login if not authenticated and no custom url', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard(getRoute(), {} as any));
    expect(result).toEqual(['/login']);
  });

  it('should redirect to custom url if not authenticated and custom url provided', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      authGuard(getRoute({ authRedirectUrl: ['/custom-login'] }), {} as any),
    );
    expect(result).toEqual(['/custom-login']);
  });

  it('should handle string redirect url', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      authGuard(getRoute({ authRedirectUrl: '/custom-login' }), {} as any),
    );
    expect(result).toEqual(['/custom-login']);
  });
});
