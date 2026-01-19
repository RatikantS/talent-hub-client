/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEnvironmentInjector, Provider, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';

import { featureFlagGuard } from '../guards';
import { FeatureFlagService } from '../services';

const getRoute = (data?: Record<string, unknown>) => ({ data }) as any;

// Create a minimal parent injector for test isolation
const rootInjector = createEnvironmentInjector([], createEnvironmentInjector([], {} as any));

describe('featureFlagGuard', () => {
  let mockFeatureFlagService: { isEnabled: ReturnType<typeof vi.fn> };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };
  let injector: ReturnType<typeof createEnvironmentInjector>;

  beforeEach(() => {
    mockFeatureFlagService = { isEnabled: vi.fn() };
    mockRouter = { createUrlTree: vi.fn((url) => url) };

    // Provide mocks to the injector
    injector = createEnvironmentInjector(
      [
        { provide: FeatureFlagService, useValue: mockFeatureFlagService } as Provider,
        { provide: Router, useValue: mockRouter } as Provider,
      ],
      rootInjector,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow access if feature flag is enabled', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(true);
    const result = runInInjectionContext(injector, () =>
      featureFlagGuard(getRoute({ featureFlag: 'myFeature' }), {} as any),
    );
    expect(result).toBe(true);
  });

  it('should redirect to /not-available if feature flag is not enabled', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = runInInjectionContext(injector, () =>
      featureFlagGuard(getRoute({ featureFlag: 'myFeature' }), {} as any),
    );
    expect(result).toEqual(['/not-available']);
  });

  it('should redirect to custom url if feature flag is not enabled and custom url provided', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = runInInjectionContext(injector, () =>
      featureFlagGuard(
        getRoute({ featureFlag: 'myFeature', featureFlagRedirectUrl: ['/custom-not-available'] }),
        {} as any,
      ),
    );
    expect(result).toEqual(['/custom-not-available']);
  });

  it('should handle string redirect url', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = runInInjectionContext(injector, () =>
      featureFlagGuard(
        getRoute({ featureFlag: 'myFeature', featureFlagRedirectUrl: '/custom-not-available' }),
        {} as any,
      ),
    );
    expect(result).toEqual(['/custom-not-available']);
  });

  it('should redirect to /not-available if no feature flag is provided', () => {
    const result = runInInjectionContext(injector, () => featureFlagGuard(getRoute(), {} as any));
    expect(result).toEqual(['/not-available']);
  });

  it('should redirect to /not-available if feature flag is undefined', () => {
    mockFeatureFlagService.isEnabled.mockReturnValue(false);
    const result = runInInjectionContext(injector, () =>
      featureFlagGuard(getRoute({ featureFlag: undefined }), {} as any),
    );
    expect(result).toEqual(['/not-available']);
  });
});
