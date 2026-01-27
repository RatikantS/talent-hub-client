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

import { maintenanceGuard } from '../guards';
import { MaintenanceService } from '../services';

const getRoute = (data?: Record<string, unknown>) => ({ data }) as any;

// Create a minimal parent injector for test isolation
const rootInjector = createEnvironmentInjector([], createEnvironmentInjector([], {} as any));

describe('maintenanceGuard', () => {
  let mockMaintenanceService: { getMaintenanceMode: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };
  let injector: ReturnType<typeof createEnvironmentInjector>;

  beforeEach(() => {
    mockMaintenanceService = { getMaintenanceMode: vi.fn() };
    mockRouter = { createUrlTree: vi.fn((url) => url) };

    // Provide mocks to the injector
    injector = createEnvironmentInjector(
      [
        { provide: MaintenanceService, useValue: mockMaintenanceService } as Provider,
        { provide: Router, useValue: mockRouter } as Provider,
      ],
      rootInjector,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow access if not in maintenance mode', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(false);
    const result = runInInjectionContext(injector, () => maintenanceGuard(getRoute(), {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to /maintenance if in maintenance mode', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = runInInjectionContext(injector, () => maintenanceGuard(getRoute(), {} as any));
    expect(result).toEqual(['/maintenance']);
  });

  it('should redirect to custom url if in maintenance mode and custom url provided', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = runInInjectionContext(injector, () =>
      maintenanceGuard(getRoute({ maintenanceRedirectUrl: ['/custom-maintenance'] }), {} as any),
    );
    expect(result).toEqual(['/custom-maintenance']);
  });

  it('should handle string redirect url', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = runInInjectionContext(injector, () =>
      maintenanceGuard(getRoute({ maintenanceRedirectUrl: '/custom-maintenance' }), {} as any),
    );
    expect(result).toEqual(['/custom-maintenance']);
  });

  it('should redirect to /maintenance if in maintenance mode with no custom url', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = runInInjectionContext(injector, () => maintenanceGuard(getRoute({}), {} as any));
    expect(result).toEqual(['/maintenance']);
  });
});
