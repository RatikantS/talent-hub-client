/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { computed, inject, Injectable, Signal } from '@angular/core';

import { AppStore } from '../store';

/**
 * UserService - Provides access to the current user's roles from the global AppStore.
 *
 * This service uses Angular signals and the NgRx Signal Store (AppStore) to expose
 * the user's roles as a computed signal and a getter method. It expects the roles
 * property to be present on the UserPreference object in the global state.
 *
 * Usage:
 *   const userService = inject(UserService);
 *   const roles = userService.getUserRoles();
 *   if (roles.includes('admin')) { ... }
 *
 * - Uses strict typing and avoids any.
 * - Returns an empty array if roles are not set.
 * - Designed for use in guards, components, and services that require role-based logic.
 * - Provided in root (singleton).
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * Reference to the global AppStore (NgRx Signal Store).
   * Used to access the current user preference and roles.
   */
  private readonly appStore: typeof AppStore = inject(AppStore);

  /**
   * Computed signal for user roles.
   * Returns the roles array from UserPreference, or an empty array if not set.
   *
   * Example:
   *   userService.roles(); // ['admin', 'user']
   */
  readonly roles: Signal<string[]> = computed(
    (): string[] => this.appStore.getPreference()?.roles ?? [],
  );

  /**
   * Returns the current user's roles as a string array.
   *
   * Example:
   *   userService.getUserRoles(); // ['admin', 'user']
   *
   * @returns {string[]} The current user's roles, or an empty array if not set.
   */
  getUserRoles(): string[] {
    return this.roles();
  }
}
