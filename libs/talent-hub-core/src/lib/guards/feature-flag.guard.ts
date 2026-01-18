/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { FeatureFlagService } from '../services';

/**
 * featureFlagGuard - Prevents access to routes if a required feature flag is not enabled.
 *
 * This guard uses the FeatureFlagService to check if a feature flag (provided in route data)
 * is enabled. If the flag is enabled, navigation is allowed. Otherwise, the user is redirected
 * to the /not-available page or a custom URL provided in route data as 'featureFlagRedirectUrl'.
 *
 * Usage Example (in route config):
 *   {
 *     path: 'feature',
 *     canActivate: [featureFlagGuard],
 *     data: { featureFlag: 'myFeature', featureFlagRedirectUrl: ['/custom-not-available'] },
 *   }
 *
 * Implementation Details:
 * - Uses Angular's inject() for dependency injection (no constructor needed).
 * - Returns true if the feature flag is enabled, otherwise returns a UrlTree to redirect to /not-available (or a custom featureFlagRedirectUrl from route data).
 * - Designed for use in standalone Angular applications with signals and strict typing.
 * - Should be used for all feature-flag-protected routes in the application.
 *
 * @param route The current ActivatedRouteSnapshot (used to read the feature flag key and custom redirect URL from route data)
 * @param _state The current RouterStateSnapshot (unused, but required by interface)
 * @returns true if the feature flag is enabled, otherwise a UrlTree to redirect to /not-available (or custom)
 */
export const featureFlagGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the FeatureFlagService (signal-based, store-backed)
  const featureFlagService: FeatureFlagService = inject(FeatureFlagService);
  // Inject the Angular Router
  const router: Router = inject(Router);
  // Get the feature flag key from route data
  const flag = route.data?.['featureFlag'] as string | undefined;

  // Allow navigation if the flag is set and enabled
  if (flag && featureFlagService.isEnabled(flag)) {
    return true;
  }
  // Otherwise, redirect to the not-available page or custom featureFlagRedirectUrl
  const redirectUrl = route.data?.['featureFlagRedirectUrl'] ?? ['/not-available'];
  return router.createUrlTree(Array.isArray(redirectUrl) ? redirectUrl : [redirectUrl]);
};
