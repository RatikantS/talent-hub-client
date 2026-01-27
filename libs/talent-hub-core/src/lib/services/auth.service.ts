/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { inject, Injectable } from '@angular/core';

import { AuthStore } from '../store';
import { User } from '../interfaces';

/**
 * AuthService - Provides authentication-related utilities and state selectors for guards and components.
 *
 * This service acts as a facade over the global AuthStore (NgRx Signal Store), exposing
 * authentication state, role checks, permission checks, and user/token retrieval methods.
 * It is designed for use in guards, components, interceptors, and other services that
 * require authentication logic.
 *
 * @remarks
 * - Uses the `inject()` function for dependency injection (Angular 14+).
 * - All methods delegate to the AuthStore for state access.
 * - The service is provided in root and is a singleton across the application.
 * - Designed to be used across all micro-frontends (MFEs) for consistent auth logic.
 *
 * @example
 * ```typescript
 * @Component({ ... })
 * export class ProfileComponent {
 *   private readonly auth = inject(AuthService);
 *
 *   ngOnInit() {
 *     if (this.auth.isAuthenticated()) {
 *       const user = this.auth.getUser();
 *       console.log('Welcome', user?.firstName);
 *     }
 *     if (this.auth.hasRole('admin')) {
 *       // Show admin controls
 *     }
 *     if (this.auth.hasPermission('edit')) {
 *       // Enable edit button
 *     }
 *   }
 * }
 * ```
 *
 * @see AuthStore
 * @see User
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Reference to the global AuthStore (NgRx Signal Store).
   * Used to access authentication state, user info, roles, and permissions.
   * @internal
   */
  private readonly authStore = inject(AuthStore);

  /**
   * Checks if the current user is authenticated.
   *
   * This method returns the current authentication state from the AuthStore.
   * The value is reactive and reflects the latest state.
   *
   * @returns `true` if the user is authenticated, `false` otherwise.
   *
   * @example
   * ```typescript
   * if (authService.isAuthenticated()) {
   *   // User is logged in
   * }
   * ```
   */
  isAuthenticated(): boolean {
    return this.authStore.isAuthenticated();
  }

  /**
   * Checks if the current user has the specified role.
   *
   * Delegates to the AuthStore's `hasRole` method to check if the user's
   * roles array includes the given role string.
   *
   * @param role - The role to check (e.g., 'admin', 'editor', 'viewer').
   * @returns `true` if the user has the role, `false` otherwise.
   *
   * @example
   * ```typescript
   * if (authService.hasRole('admin')) {
   *   // Show admin dashboard
   * }
   * ```
   */
  hasRole(role: string): boolean {
    return this.authStore.hasRole(role);
  }

  /**
   * Checks if the current user has the specified permission.
   *
   * Delegates to the AuthStore's `hasPermission` method to check if the user's
   * permissions array includes the given permission string.
   *
   * @param permission - The permission to check (e.g., 'read', 'write', 'delete').
   * @returns `true` if the user has the permission, `false` otherwise.
   *
   * @example
   * ```typescript
   * if (authService.hasPermission('delete')) {
   *   // Enable delete button
   * }
   * ```
   */
  hasPermission(permission: string): boolean {
    return this.authStore.hasPermission(permission);
  }

  /**
   * Retrieves the current user's authentication token.
   *
   * Returns the JWT or session token stored in the AuthStore.
   * Returns `null` if the user is not authenticated or no token is available.
   *
   * @returns The authentication token string, or `null` if not available.
   *
   * @example
   * ```typescript
   * const token = authService.getToken();
   * if (token) {
   *   headers.set('Authorization', `Bearer ${token}`);
   * }
   * ```
   */
  getToken(): string | null {
    return this.authStore.getToken();
  }

  /**
   * Retrieves the current authenticated user object.
   *
   * Returns the full User object from the AuthStore, including id, email,
   * firstName, lastName, roles, and permissions. Returns `null` if the user
   * is not authenticated.
   *
   * @returns The current `User` object, or `null` if not authenticated.
   *
   * @example
   * ```typescript
   * const user = authService.getUser();
   * if (user) {
   *   console.log(`Hello, ${user.firstName} ${user.lastName}`);
   * }
   * ```
   *
   * @see User
   */
  getUser(): User | null {
    return this.authStore.user();
  }
}
