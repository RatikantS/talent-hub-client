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

import { UserService } from '../services';

/**
 * Route guard that implements Role-Based Access Control (RBAC) for protected routes.
 *
 * This functional guard uses `UserService` to check if the current user has at least one
 * of the required roles specified in the route's `data.roles` array. If the user has access,
 * navigation is allowed; otherwise, they are redirected to a forbidden page.
 *
 * @remarks
 * **Behavior:**
 * - Allows access if no roles are required (`data.roles` is empty or not set).
 * - Allows access if the user has at least one of the required roles.
 * - Redirects to `/forbidden` (or custom URL) if the user lacks required roles.
 *
 * **Route Data Options:**
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `roles` | `string[]` | `[]` | Required roles (user needs at least one) |
 * | `rbacRedirectUrl` | `string` \| `string[]` | `['/forbidden']` | Custom redirect URL for unauthorized users |
 *
 * **Implementation Details:**
 * - Uses Angular's functional guard pattern (`CanActivateFn`).
 * - Uses `inject()` for dependency injection.
 * - Performs OR logic: user needs ANY of the listed roles, not all.
 * - Works with signal-based `UserService` and `AuthStore`.
 *
 * **Security Considerations:**
 * - Always validate roles on the server; client-side guards are for UX only.
 * - Combine with `authGuard` to ensure user is authenticated first.
 * - Keep role names consistent between frontend and backend.
 *
 * @param route - The activated route snapshot containing role requirements.
 * @param _state - The router state snapshot (unused but required by interface).
 * @returns `true` if user has access, or a `UrlTree` to redirect to forbidden page.
 *
 * @example
 * ```typescript
 * // Require admin role
 * const routes: Routes = [
 *   {
 *     path: 'admin',
 *     component: AdminComponent,
 *     canActivate: [authGuard, rbacGuard],
 *     data: { roles: ['admin'] },
 *   },
 * ];
 *
 * // Require any of multiple roles (OR logic)
 * const routes: Routes = [
 *   {
 *     path: 'reports',
 *     component: ReportsComponent,
 *     canActivate: [authGuard, rbacGuard],
 *     data: { roles: ['admin', 'manager', 'analyst'] },
 *   },
 * ];
 *
 * // Custom redirect URL
 * const routes: Routes = [
 *   {
 *     path: 'super-admin',
 *     component: SuperAdminComponent,
 *     canActivate: [authGuard, rbacGuard],
 *     data: {
 *       roles: ['super-admin'],
 *       rbacRedirectUrl: '/access-denied',
 *     },
 *   },
 * ];
 *
 * // No roles required (guard allows all authenticated users)
 * const routes: Routes = [
 *   {
 *     path: 'profile',
 *     component: ProfileComponent,
 *     canActivate: [authGuard, rbacGuard],
 *     // data.roles not set - allows all authenticated users
 *   },
 * ];
 * ```
 *
 * @see UserService
 * @see authGuard
 * @see CanActivateFn
 * @publicApi
 */
export const rbacGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the UserService to get current user's roles
  const userService: UserService = inject(UserService);

  // Inject the Angular Router for redirect navigation
  const router: Router = inject(Router);

  // Get the required roles from route data (defaults to empty array)
  const requiredRoles = (route.data?.['roles'] ?? []) as string[];

  // Get the current user's roles from the UserService
  const userRoles: string[] = userService.getUserRoles();

  // Allow navigation if no roles are required OR user has at least one required role
  const hasAccess: boolean =
    requiredRoles.length === 0 ||
    requiredRoles.some((role: string): boolean => userRoles.includes(role));

  // If access is allowed, return true
  if (hasAccess) {
    return true;
  }

  // Otherwise, redirect to the forbidden page or custom rbacRedirectUrl
  const redirectUrl = route.data?.['rbacRedirectUrl'] ?? ['/forbidden'];
  return router.createUrlTree(Array.isArray(redirectUrl) ? redirectUrl : [redirectUrl]);
};
