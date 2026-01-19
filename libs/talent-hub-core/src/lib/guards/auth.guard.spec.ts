/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEnvironmentInjector, Provider, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';

import { authGuard } from '../guards';
import { AuthService } from '../services';

const getRoute = (data?: Record<string, unknown>) => ({ data }) as any;

// Create a minimal parent injector for test isolation
const rootInjector = createEnvironmentInjector([], createEnvironmentInjector([], {} as any));

describe('authGuard', () => {
  let mockAuthService: { isAuthenticated: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };
  let injector: ReturnType<typeof createEnvironmentInjector>;

  beforeEach(() => {
    mockAuthService = { isAuthenticated: vi.fn() };
    mockRouter = { createUrlTree: vi.fn((url) => url) };

    // Provide mocks to the injector
    injector = createEnvironmentInjector(
      [
        { provide: AuthService, useValue: mockAuthService } as Provider,
        { provide: Router, useValue: mockRouter } as Provider,
      ],
      rootInjector,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow access if authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    const result = runInInjectionContext(injector, () => authGuard(getRoute(), {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to /login if not authenticated and no custom url', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = runInInjectionContext(injector, () => authGuard(getRoute(), {} as any));
    expect(result).toEqual(['/login']);
  });

  it('should redirect to custom url if not authenticated and custom url provided', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = runInInjectionContext(injector, () =>
      authGuard(getRoute({ authRedirectUrl: ['/custom-login'] }), {} as any),
    );
    expect(result).toEqual(['/custom-login']);
  });

  it('should handle string redirect url', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = runInInjectionContext(injector, () =>
      authGuard(getRoute({ authRedirectUrl: '/custom-login' }), {} as any),
    );
    expect(result).toEqual(['/custom-login']);
  });
});
