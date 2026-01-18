/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { inject } from '@angular/core';

import { AuthStore } from '../store';
import { User } from '../interfaces';

/**
 * AuthService - Provides authentication-related utilities and state selectors for guards and components.
 *
 * This service uses the global AuthStore (NgRx Signal Store) to expose authentication state and selectors.
 * It provides methods to check authentication, roles, permissions, and to retrieve the current user and token.
 *
 * Usage:
 *   const auth = inject(AuthService);
 *   if (auth.isAuthenticated()) { ... }
 *   if (auth.hasRole('admin')) { ... }
 *   if (auth.hasPermission('read')) { ... }
 *   const token = auth.getToken();
 *   const user = auth.getUser();
 *
 * - Uses signals for state (reactive, type-safe).
 * - Uses computed for derived state (if needed).
 * - Provided in root (singleton).
 */
export class AuthService {
  /**
   * Reference to the global AuthStore (NgRx Signal Store).
   * Used to access authentication state and selectors.
   */
  private readonly authStore: typeof AuthStore = inject(AuthStore);

  /**
   * Returns true if the user is authenticated (reactive signal).
   *
   * @returns {boolean} True if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    // AuthStore exposes isAuthenticated as a signal property
    return this.authStore.isAuthenticated();
  }

  /**
   * Returns true if the user has the given role.
   *
   * @param role The role to check (e.g., 'admin').
   * @returns {boolean} True if the user has the role, false otherwise.
   */
  hasRole(role: string): boolean {
    return this.authStore.hasRole(role);
  }

  /**
   * Returns true if the user has the given permission.
   *
   * @param permission The permission to check (e.g., 'read').
   * @returns {boolean} True if the user has the permission, false otherwise.
   */
  hasPermission(permission: string): boolean {
    return this.authStore.hasPermission(permission);
  }

  /**
   * Returns the current user's token (if any).
   *
   * @returns {string | null} The user's auth token, or null if not authenticated.
   */
  getToken(): string | null {
    return this.authStore.getToken();
  }

  /**
   * Returns the current user object (if any).
   *
   * @returns {User | null} The current user object, or null if not authenticated.
   */
  getUser(): User | null {
    return this.authStore.user();
  }
}
