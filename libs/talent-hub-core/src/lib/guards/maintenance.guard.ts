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

import { MaintenanceService } from '../services';

/**
 * Route guard that prevents access to routes when the application is in maintenance mode.
 *
 * This functional guard uses `MaintenanceService` to check if the application is currently
 * in maintenance mode. If not in maintenance mode, navigation is allowed. Otherwise, the user
 * is redirected to a maintenance page.
 *
 * @remarks
 * **Behavior:**
 * - Allows access when `MaintenanceService.getMaintenanceMode()` returns `false`.
 * - Redirects to `/maintenance` (or custom URL) when in maintenance mode.
 * - Designed to be applied to all non-maintenance routes.
 *
 * **Route Data Options:**
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `maintenanceRedirectUrl` | `string` \| `string[]` | `['/maintenance']` | Custom redirect URL for maintenance mode |
 *
 * **Implementation Details:**
 * - Uses Angular's functional guard pattern (`CanActivateFn`).
 * - Uses `inject()` for dependency injection.
 * - Works with signal-based `MaintenanceService` and `AppStore`.
 * - Designed for standalone Angular applications.
 *
 * **Usage Patterns:**
 * - Apply to all routes except the maintenance page itself.
 * - Combine with other guards (order matters: `maintenanceGuard` first).
 * - Toggle maintenance mode via `AppStore.setMaintenanceModeEnabled()`.
 *
 * **Maintenance Page Setup:**
 * Ensure the maintenance route does NOT have this guard, or you'll create a redirect loop:
 * ```typescript
 * { path: 'maintenance', component: MaintenanceComponent } // No guard!
 * ```
 *
 * @param route - The activated route snapshot containing custom redirect URL.
 * @param _state - The router state snapshot (unused but required by interface).
 * @returns `true` if not in maintenance mode, or a `UrlTree` to redirect to maintenance page.
 *
 * @example
 * ```typescript
 * // Apply to all protected routes
 * const routes: Routes = [
 *   {
 *     path: '',
 *     canActivate: [maintenanceGuard],
 *     children: [
 *       { path: 'dashboard', component: DashboardComponent },
 *       { path: 'users', component: UsersComponent },
 *       { path: 'settings', component: SettingsComponent },
 *     ],
 *   },
 *   // Maintenance page - NO guard here!
 *   { path: 'maintenance', component: MaintenanceComponent },
 * ];
 *
 * // Custom redirect URL
 * const routes: Routes = [
 *   {
 *     path: 'app',
 *     canActivate: [maintenanceGuard],
 *     data: { maintenanceRedirectUrl: '/system-maintenance' },
 *     children: [...],
 *   },
 * ];
 *
 * // Enable maintenance mode programmatically
 * appStore.setMaintenanceModeEnabled(true);
 *
 * // Disable maintenance mode
 * appStore.setMaintenanceModeEnabled(false);
 * ```
 *
 * @see MaintenanceService
 * @see AppStore
 * @see CanActivateFn
 * @publicApi
 */
export const maintenanceGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the MaintenanceService to check maintenance mode status
  const maintenanceService: MaintenanceService = inject(MaintenanceService);

  // Inject the Angular Router for redirect navigation
  const router: Router = inject(Router);

  // Allow navigation if not in maintenance mode
  if (!maintenanceService.getMaintenanceMode()) {
    return true;
  }

  // Otherwise, redirect to the maintenance page or custom maintenanceRedirectUrl
  const redirectUrl = route.data?.['maintenanceRedirectUrl'] ?? ['/maintenance'];
  return router.createUrlTree(Array.isArray(redirectUrl) ? redirectUrl : [redirectUrl]);
};
