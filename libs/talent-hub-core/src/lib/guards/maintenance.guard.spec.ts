/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { maintenanceGuard } from '../guards';
import { MaintenanceService } from '../services';

const getRoute = (data?: Record<string, unknown>) => ({ data }) as any;

describe('maintenanceGuard', () => {
  let mockMaintenanceService: { getMaintenanceMode: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockMaintenanceService = { getMaintenanceMode: vi.fn() };
    mockRouter = { createUrlTree: vi.fn((url) => url) };

    TestBed.configureTestingModule({
      providers: [
        { provide: MaintenanceService, useValue: mockMaintenanceService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access if not in maintenance mode', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() => maintenanceGuard(getRoute(), {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to /maintenance if in maintenance mode', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => maintenanceGuard(getRoute(), {} as any));
    expect(result).toEqual(['/maintenance']);
  });

  it('should redirect to custom url if in maintenance mode and custom url provided', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() =>
      maintenanceGuard(
        getRoute({
          maintenanceRedirectUrl: ['/custom-maintenance'],
        }),
        {} as any,
      ),
    );
    expect(result).toEqual(['/custom-maintenance']);
  });

  it('should handle string redirect url', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() =>
      maintenanceGuard(
        getRoute({
          maintenanceRedirectUrl: '/custom-maintenance',
        }),
        {} as any,
      ),
    );
    expect(result).toEqual(['/custom-maintenance']);
  });

  it('should redirect to /maintenance if in maintenance mode with no custom url', () => {
    mockMaintenanceService.getMaintenanceMode.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => maintenanceGuard(getRoute({}), {} as any));
    expect(result).toEqual(['/maintenance']);
  });
});
