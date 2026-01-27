/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { computed, inject, Injectable, Signal } from '@angular/core';

import { AuthStore } from '../store';

/**
 * UserService - Provides access to the current user's roles from the global AuthStore.
 *
 * This service acts as a facade over the AuthStore's user role functionality,
 * exposing the user's roles as both a reactive signal and a getter method.
 * It is designed for use in guards, components, interceptors, and services
 * that require role-based authorization logic.
 *
 * @remarks
 * - Uses Angular signals for reactive, efficient change detection.
 * - Roles are stored in the AuthStore as part of the authenticated User object.
 * - Use `roles` signal for reactive UI bindings that update automatically.
 * - Use `getUserRoles()` for one-time checks in guards or services.
 * - Returns an empty array if the user is not authenticated or has no roles.
 * - Uses strict typing; avoids `any` type.
 * - Designed for use across all micro-frontends (MFEs) for consistent authorization.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly userService = inject(UserService);
 *
 * // Check roles in a guard
 * canActivate(): boolean {
 *   const roles = this.userService.getUserRoles();
 *   return roles.includes('admin');
 * }
 *
 * // Use reactive signal in a component
 * readonly isAdmin = computed(() => this.userService.roles().includes('admin'));
 *
 * // In template (using the signal)
 * // @if (userService.roles().includes('editor')) {
 * //   <button>Edit</button>
 * // }
 * ```
 *
 * @see AuthStore
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * Reference to the global AuthStore (NgRx Signal Store).
   * Used to access the current authenticated user and their roles.
   * @internal
   */
  private readonly authStore = inject(AuthStore);

  /**
   * Computed signal for user roles.
   *
   * Returns the roles array from the authenticated user. This signal updates
   * automatically when the user's roles change in the AuthStore, making it
   * ideal for reactive UI bindings and computed values.
   *
   * @returns A `Signal<string[]>` containing the user's roles, or an empty array if not set.
   *
   * @example
   * ```typescript
   * // In component class
   * readonly userRoles = this.userService.roles;
   * readonly canEdit = computed(() => this.userRoles().includes('editor'));
   *
   * // In template
   * // @for (role of userService.roles(); track role) {
   * //   <span class="badge">{{ role }}</span>
   * // }
   * ```
   */
  readonly roles: Signal<string[]> = computed((): string[] => this.authStore.userRoles() ?? []);

  /**
   * Returns the current user's roles as a string array.
   *
   * Performs a one-time lookup of the user's roles. Use this method for
   * imperative checks in guards, services, or lifecycle hooks.
   *
   * @returns The current user's roles as `string[]`, or an empty array if not authenticated or no roles assigned.
   *
   * @example
   * ```typescript
   * // Check in a route guard
   * canActivate(): boolean {
   *   const roles = this.userService.getUserRoles();
   *   if (!roles.includes('admin')) {
   *     this.router.navigate(['/unauthorized']);
   *     return false;
   *   }
   *   return true;
   * }
   *
   * // Check multiple roles
   * hasAnyRole(requiredRoles: string[]): boolean {
   *   const userRoles = this.userService.getUserRoles();
   *   return requiredRoles.some(role => userRoles.includes(role));
   * }
   *
   * // Use in conditional logic
   * ngOnInit(): void {
   *   const roles = this.userService.getUserRoles();
   *   if (roles.includes('manager')) {
   *     this.loadManagerDashboard();
   *   }
   * }
   * ```
   */
  getUserRoles(): string[] {
    return this.roles();
  }
}
