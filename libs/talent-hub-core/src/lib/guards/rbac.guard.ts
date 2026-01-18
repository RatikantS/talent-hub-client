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

import { UserService } from '../services';

/**
 * rbacGuard - Prevents access to routes for users lacking required roles (Role-Based Access Control).
 *
 * This guard uses the UserService to check if the current user has at least one of the roles
 * specified in the route's data.roles array. If no roles are required, access is allowed.
 * If the user has at least one required role, access is allowed. Otherwise, the user is redirected
 * to the /forbidden page or a custom URL provided in route data as 'rbacRedirectUrl'.
 *
 * Usage Example (in route config):
 *   {
 *     path: 'admin',
 *     canActivate: [rbacGuard],
 *     data: { roles: ['admin', 'manager'], rbacRedirectUrl: ['/custom-forbidden'] },
 *   }
 *
 * Implementation Details:
 * - Uses Angular's inject() for dependency injection (no constructor needed).
 * - Returns true if the user has access, otherwise returns a UrlTree to redirect to /forbidden (or a custom rbacRedirectUrl from route data).
 * - Designed for use in standalone Angular applications with signals and strict typing.
 * - Should be used for all RBAC-protected routes in the application.
 *
 * @param route The current ActivatedRouteSnapshot (used to read the required roles and custom redirect URL from route data)
 * @param _state The current RouterStateSnapshot (unused, but required by interface)
 * @returns true if the user has access, otherwise a UrlTree to redirect to /forbidden (or custom)
 */
export const rbacGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): UrlTree | boolean => {
  // Inject the UserService (signal-based, store-backed)
  const userService: UserService = inject(UserService);
  // Inject the Angular Router
  const router: Router = inject(Router);

  // Get the required roles from route data (defaults to empty array)
  const requiredRoles = (route.data?.['roles'] ?? []) as string[];
  // Get the current user's roles from the UserService
  const userRoles: string[] = userService.getUserRoles();

  // Allow navigation if no roles are required or user has at least one required role
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
