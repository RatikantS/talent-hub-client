/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
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
 * Route guard that controls route access based on feature flag configuration.
 *
 * This functional guard uses `FeatureFlagService` to check if a feature flag (specified
 * in route data) is enabled. If the flag is enabled, navigation is allowed. Otherwise,
 * the user is redirected to a "not available" page.
 *
 * @remarks
 * **Behavior:**
 * - Reads the feature flag key from `route.data.featureFlag`.
 * - Allows access if the feature flag is enabled via `FeatureFlagService.isEnabled()`.
 * - Redirects to `/not-available` (or custom URL) if the flag is disabled or missing.
 *
 * **Route Data Options:**
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `featureFlag` | `string` | (required) | The feature flag key to check |
 * | `featureFlagRedirectUrl` | `string` \| `string[]` | `['/not-available']` | Custom redirect URL when feature is disabled |
 *
 * **Implementation Details:**
 * - Uses Angular's functional guard pattern (`CanActivateFn`).
 * - Uses `inject()` for dependency injection.
 * - Works with signal-based `FeatureFlagService` and `AppStore`.
 * - Designed for standalone Angular applications.
 *
 * **Use Cases:**
 * - Controlled rollout of new features to specific users or environments.
 * - A/B testing different application features.
 * - Hiding incomplete or beta features in production.
 * - Environment-specific feature availability.
 *
 * **Best Practices:**
 * - Use descriptive, consistent feature flag names (e.g., 'newDashboard', 'betaReports').
 * - Define feature flags in a central constants file or enum.
 * - Combine with other guards as needed (e.g., `authGuard`, `rbacGuard`).
 *
 * @param route - The activated route snapshot containing the feature flag key.
 * @param _state - The router state snapshot (unused but required by interface).
 * @returns `true` if feature is enabled, or a `UrlTree` to redirect to not-available page.
 *
 * @example
 * ```typescript
 * // Basic usage - protect a route with a feature flag
 * const routes: Routes = [
 *   {
 *     path: 'new-dashboard',
 *     component: NewDashboardComponent,
 *     canActivate: [authGuard, featureFlagGuard],
 *     data: { featureFlag: 'newDashboard' },
 *   },
 * ];
 *
 * // Custom redirect URL
 * const routes: Routes = [
 *   {
 *     path: 'beta-reports',
 *     component: BetaReportsComponent,
 *     canActivate: [featureFlagGuard],
 *     data: {
 *       featureFlag: 'betaReports',
 *       featureFlagRedirectUrl: '/coming-soon',
 *     },
 *   },
 * ];
 *
 * // Lazy-loaded module with feature flag
 * const routes: Routes = [
 *   {
 *     path: 'analytics',
 *     loadChildren: () => import('./analytics/analytics.routes'),
 *     canActivate: [featureFlagGuard],
 *     data: { featureFlag: 'analyticsModule' },
 *   },
 * ];
 *
 * // Set feature flags programmatically
 * appStore.setFeatures({
 *   newDashboard: true,
 *   betaReports: false,
 *   analyticsModule: true,
 * });
 * ```
 *
 * @see FeatureFlagService
 * @see AppStore
 * @see CanActivateFn
 * @publicApi
 */
export const featureFlagGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the FeatureFlagService to check feature flag status
  const featureFlagService: FeatureFlagService = inject(FeatureFlagService);

  // Inject the Angular Router for redirect navigation
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
