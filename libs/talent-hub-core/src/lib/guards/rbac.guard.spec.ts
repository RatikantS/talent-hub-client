/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEnvironmentInjector, Provider, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';

import { rbacGuard } from '../guards';
import { UserService } from '../services';

const getRoute = (data?: Record<string, unknown>) => ({ data }) as any;

// Create a minimal parent injector for test isolation
const rootInjector = createEnvironmentInjector([], createEnvironmentInjector([], {} as any));

describe('rbacGuard', () => {
  let mockUserService: { getUserRoles: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };
  let injector: ReturnType<typeof createEnvironmentInjector>;

  beforeEach(() => {
    mockUserService = { getUserRoles: vi.fn() };
    mockRouter = { createUrlTree: vi.fn((url) => url) };

    // Provide mocks to the injector
    injector = createEnvironmentInjector(
      [
        { provide: UserService, useValue: mockUserService } as Provider,
        { provide: Router, useValue: mockRouter } as Provider,
      ],
      rootInjector,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow access if user has required role', () => {
    mockUserService.getUserRoles.mockReturnValue(['admin', 'user']);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: ['admin'] }), {} as any),
    );
    expect(result).toBe(true);
  });

  it('should allow access if user has one of multiple required roles', () => {
    mockUserService.getUserRoles.mockReturnValue(['user', 'editor']);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: ['admin', 'editor', 'manager'] }), {} as any),
    );
    expect(result).toBe(true);
  });

  it('should allow access if no roles are required', () => {
    mockUserService.getUserRoles.mockReturnValue(['user']);
    const result = runInInjectionContext(injector, () => rbacGuard(getRoute(), {} as any));
    expect(result).toBe(true);
  });

  it('should allow access if roles array is empty', () => {
    mockUserService.getUserRoles.mockReturnValue(['user']);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: [] }), {} as any),
    );
    expect(result).toBe(true);
  });

  it('should redirect to /forbidden if user does not have required role', () => {
    mockUserService.getUserRoles.mockReturnValue(['user']);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: ['admin'] }), {} as any),
    );
    expect(result).toEqual(['/forbidden']);
  });

  it('should redirect to /forbidden if user has no roles', () => {
    mockUserService.getUserRoles.mockReturnValue([]);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: ['admin'] }), {} as any),
    );
    expect(result).toEqual(['/forbidden']);
  });

  it('should redirect to custom url if user lacks role and custom url provided', () => {
    mockUserService.getUserRoles.mockReturnValue(['user']);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: ['admin'], rbacRedirectUrl: ['/custom-forbidden'] }), {} as any),
    );
    expect(result).toEqual(['/custom-forbidden']);
  });

  it('should handle string redirect url', () => {
    mockUserService.getUserRoles.mockReturnValue(['user']);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: ['admin'], rbacRedirectUrl: '/custom-forbidden' }), {} as any),
    );
    expect(result).toEqual(['/custom-forbidden']);
  });

  it('should redirect to /forbidden if user does not have any of the required roles', () => {
    mockUserService.getUserRoles.mockReturnValue(['guest', 'viewer']);
    const result = runInInjectionContext(injector, () =>
      rbacGuard(getRoute({ roles: ['admin', 'manager', 'editor'] }), {} as any),
    );
    expect(result).toEqual(['/forbidden']);
  });
});
