/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { featureFlagGuard } from '../guards';
import { FeatureFlagService } from '../services';

const getRoute = (data?: Record<string, unknown>) => ({ data }) as any;

describe('featureFlagGuard', () => {
  let mockFeatureFlagService: { isEnabled: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockFeatureFlagService = { isEnabled: vi.fn() };
    mockRouter = { createUrlTree: vi.fn((url) => url) };

    TestBed.configureTestingModule({
      providers: [
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access if feature flag is enabled', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() =>
      featureFlagGuard(getRoute({ featureFlag: 'myFeature' }), {} as any),
    );
    expect(result).toBe(true);
  });

  it('should redirect to /not-available if feature flag is not enabled', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      featureFlagGuard(getRoute({ featureFlag: 'myFeature' }), {} as any),
    );
    expect(result).toEqual(['/not-available']);
  });

  it('should redirect to custom url if feature flag is not enabled and custom url provided', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      featureFlagGuard(
        getRoute({
          featureFlag: 'myFeature',
          featureFlagRedirectUrl: ['/custom-not-available'],
        }),
        {} as any,
      ),
    );
    expect(result).toEqual(['/custom-not-available']);
  });

  it('should handle string redirect url', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      featureFlagGuard(
        getRoute({
          featureFlag: 'myFeature',
          featureFlagRedirectUrl: '/custom-not-available',
        }),
        {} as any,
      ),
    );
    expect(result).toEqual(['/custom-not-available']);
  });

  it('should redirect to /not-available if no feature flag is provided', () => {
    const result = TestBed.runInInjectionContext(() => featureFlagGuard(getRoute(), {} as any));
    expect(result).toEqual(['/not-available']);
  });

  it('should redirect to /not-available if feature flag is undefined', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      featureFlagGuard(getRoute({ featureFlag: undefined }), {} as any),
    );
    expect(result).toEqual(['/not-available']);
  });
});
