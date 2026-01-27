/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
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
 * Route guard that prevents access to routes for unauthenticated users.
 *
 * This functional guard uses `AuthService` to check authentication state. If the user
 * is authenticated, access is allowed. Otherwise, the user is redirected to `/login`
 * or a custom URL provided in the route's `data.authRedirectUrl` property.
 *
 * @remarks
 * **Behavior:**
 * - Returns `true` if the user is authenticated (allows navigation).
 * - Returns a `UrlTree` to redirect unauthenticated users to the login page.
 * - Supports custom redirect URLs via route data configuration.
 *
 * **Route Data Options:**
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `authRedirectUrl` | `string` \| `string[]` | `['/login']` | Custom redirect URL for unauthenticated users |
 *
 * **Implementation Details:**
 * - Uses Angular's functional guard pattern (`CanActivateFn`).
 * - Uses `inject()` for dependency injection (no class or constructor needed).
 * - Works with signal-based `AuthService` and `AuthStore`.
 * - Designed for standalone Angular applications.
 *
 * **Security Considerations:**
 * - This guard only protects client-side routing; always validate on the server.
 * - Consider combining with route resolvers for data pre-fetching.
 * - For role-based access, use additional guards (e.g., `roleGuard`).
 *
 * @param route - The activated route snapshot containing route data and parameters.
 * @param _state - The router state snapshot (unused but required by the interface).
 * @returns `true` if authenticated, or a `UrlTree` to redirect to the login page.
 *
 * @example
 * ```typescript
 * // Basic usage - redirects to /login
 * const routes: Routes = [
 *   {
 *     path: 'dashboard',
 *     component: DashboardComponent,
 *     canActivate: [authGuard],
 *   },
 * ];
 *
 * // Custom redirect URL
 * const routes: Routes = [
 *   {
 *     path: 'admin',
 *     component: AdminComponent,
 *     canActivate: [authGuard],
 *     data: { authRedirectUrl: '/admin-login' },
 *   },
 * ];
 *
 * // Redirect with query parameters (array format)
 * const routes: Routes = [
 *   {
 *     path: 'settings',
 *     component: SettingsComponent,
 *     canActivate: [authGuard],
 *     data: { authRedirectUrl: ['/login', { returnUrl: '/settings' }] },
 *   },
 * ];
 *
 * // Protecting lazy-loaded modules
 * const routes: Routes = [
 *   {
 *     path: 'reports',
 *     loadChildren: () => import('./reports/reports.routes'),
 *     canActivate: [authGuard],
 *   },
 * ];
 * ```
 *
 * @see AuthService
 * @see AuthStore
 * @see CanActivateFn
 * @publicApi
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the AuthService (signal-based, store-backed)
  const authService: AuthService = inject(AuthService);

  // Inject the Angular Router for redirect navigation
  const router: Router = inject(Router);

  // If authenticated, allow access to the route
  if (authService.isAuthenticated()) {
    return true;
  }

  // Get custom redirect URL from route data, or use default '/login'
  const redirectUrl = route.data?.['authRedirectUrl'] ?? ['/login'];

  // Create and return a UrlTree for redirection
  // Supports both string ('/login') and array (['/login', { returnUrl: '...' }]) formats
  return router.createUrlTree(Array.isArray(redirectUrl) ? redirectUrl : [redirectUrl]);
};
