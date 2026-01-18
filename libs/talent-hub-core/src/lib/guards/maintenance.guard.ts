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

import { MaintenanceService } from '../services';

/**
 * maintenanceGuard - Prevents access to routes when the application is in maintenance mode.
 *
 * This guard uses the MaintenanceService to check if the app is currently in maintenance mode.
 * If not in maintenance mode, navigation is allowed. If in maintenance mode, the user is redirected
 * to the /maintenance page or a custom URL provided in route data as 'maintenanceRedirectUrl'.
 *
 * Usage Example (in route config):
 *   {
 *     path: 'protected',
 *     canActivate: [maintenanceGuard],
 *     data: { maintenanceRedirectUrl: ['/custom-maintenance'] },
 *   }
 *
 * Implementation Details:
 * - Uses Angular's inject() for dependency injection (no constructor needed).
 * - Returns true if not in maintenance mode, otherwise returns a UrlTree to redirect to /maintenance (or a custom maintenanceRedirectUrl from route data).
 * - Designed for use in standalone Angular applications with signals and strict typing.
 * - Should be used for all routes that must be inaccessible during maintenance.
 *
 * @param _route The current ActivatedRouteSnapshot (used to read the custom redirect URL from route data)
 * @param _state The current RouterStateSnapshot (unused, but required by interface)
 * @returns true if not in maintenance mode, otherwise a UrlTree to redirect to /maintenance (or custom)
 */
export const maintenanceGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the MaintenanceService (signal-based, store-backed)
  const maintenanceService: MaintenanceService = inject(MaintenanceService);
  // Inject the Angular Router
  const router: Router = inject(Router);

  // Allow navigation if not in maintenance mode
  if (!maintenanceService.getMaintenanceMode()) {
    return true;
  }
  // Otherwise, redirect to the maintenance page or custom maintenanceRedirectUrl
  const redirectUrl = _route.data?.['maintenanceRedirectUrl'] ?? ['/maintenance'];
  return router.createUrlTree(Array.isArray(redirectUrl) ? redirectUrl : [redirectUrl]);
};
