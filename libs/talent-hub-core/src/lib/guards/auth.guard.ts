/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services';

/**
 * authGuard - Prevents access to routes for unauthenticated users.
 *
 * This guard uses the AuthService to check authentication state. If the user is authenticated,
 * access is allowed. Otherwise, the user is redirected to /login or a custom URL provided in
 * route data as 'authRedirectUrl'.
 *
 * Usage Example (in route config):
 *   {
 *     path: 'dashboard',
 *     canActivate: [authGuard],
 *     data: { authRedirectUrl: ['/custom-login'] },
 *   }
 *
 * Implementation Details:
 * - Uses Angular's inject() for dependency injection (no constructor needed).
 * - Returns true if authenticated, otherwise returns a UrlTree to redirect to /login (or a custom authRedirectUrl from route data).
 * - Designed for use in standalone Angular applications with signals and strict typing.
 * - Should be used for all protected routes in the application.
 *
 * @param route The current ActivatedRouteSnapshot (used to read the custom redirect URL from route data)
 * @param _state The current RouterStateSnapshot (unused, but required by interface)
 * @returns true if authenticated, or a UrlTree to redirect to /login (or custom) if not
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the AuthService (signal-based, store-backed)
  const authService: AuthService = inject(AuthService);
  // Inject the Angular Router
  const router: Router = inject(Router);

  // If authenticated, allow access
  if (authService.isAuthenticated()) {
    return true;
  }
  // Otherwise, redirect to login page or custom authRedirectUrl
  const redirectUrl = route.data?.['authRedirectUrl'] ?? ['/login'];
  return router.createUrlTree(Array.isArray(redirectUrl) ? redirectUrl : [redirectUrl]);
};
