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
  Directive,
  effect,
  inject,
  input,
  InputSignal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { AuthStore } from '@talent-hub/core/store';

/**
 * Checks if a user has the required role(s) based on the provided checker function.
 *
 * This is a pure utility function that can be used independently of the directive
 * for role checking logic. It supports both single role strings and
 * arrays of roles with configurable AND/OR logic.
 *
 * @param roles - Single role string or array of role strings to check
 * @param requireAll - If true, all roles must match (AND); if false, any role matches (OR)
 * @param hasRole - Function that checks if user has a specific role
 * @returns True if role check passes, false otherwise
 *
 * @example
 * ```typescript
 * // Single role
 * checkRoles('admin', false, (r) => userRoles.includes(r));
 *
 * // Multiple roles with OR logic
 * checkRoles(['admin', 'manager'], false, authStore.hasRole);
 *
 * // Multiple roles with AND logic
 * checkRoles(['admin', 'manager'], true, authStore.hasRole);
 * ```
 *
 * @publicApi
 */
export function checkRoles(
  roles: string | string[],
  requireAll: boolean,
  hasRole: (role: string) => boolean,
): boolean {
  // Handle single role string
  if (typeof roles === 'string') {
    // Empty string means no role was specified - deny access for safety
    // This prevents accidental access when role input is not set
    if (roles === '') {
      return false;
    }
    // Direct check: user either has the role or doesn't
    return hasRole(roles);
  }

  // Handle array of roles
  if (Array.isArray(roles)) {
    // Empty array means no roles specified - deny access for safety
    // This prevents accidental access when roles array is empty
    if (roles.length === 0) {
      return false;
    }

    if (requireAll) {
      // AND logic: User must have ALL specified roles
      // Short-circuits on first missing role (efficient for large arrays)
      return roles.every((role: string): boolean => hasRole(role));
    } else {
      // OR logic: User needs at least ONE of the specified roles
      // Short-circuits on first matching role (efficient for large arrays)
      return roles.some((role: string): boolean => hasRole(role));
    }
  }

  // Invalid input type (null, undefined, number, object, etc.)
  // Deny access by default to follow the principle of least privilege
  return false;
}

/**
 * Structural directive that conditionally renders content based on user roles.
 *
 * This directive checks if the current authenticated user has the required role(s)
 * and conditionally renders or hides the associated template. It leverages Angular signals
 * for reactive role checks and integrates with the `AuthStore` for authentication state.
 *
 * @remarks
 * - Uses Angular's structural directive pattern (`*thHasRole`)
 * - Reactive to role changes via Angular signals
 * - Supports both single role and array of roles
 * - Configurable AND/OR logic for multiple roles
 * - Integrates with `AuthStore` for centralized auth state
 *
 * @usageNotes
 *
 * ### Basic Usage - Single Role
 *
 * ```html
 * <!-- Show only if user has 'admin' role -->
 * <div *thHasRole="'admin'">Admin Panel</div>
 * ```
 *
 * ### Multiple Roles with OR Logic (Default)
 *
 * Content is shown if the user has **any** of the specified roles:
 *
 * ```html
 * <!-- Show if user is admin OR manager -->
 * <div *thHasRole="['admin', 'manager']">Management Dashboard</div>
 * ```
 *
 * ### Multiple Roles with AND Logic
 *
 * Use `requireAll: true` to require **all** specified roles:
 *
 * ```html
 * <!-- Show only if user has BOTH 'admin' AND 'superuser' roles -->
 * <div *thHasRole="['admin', 'superuser']; requireAll: true">
 *   Super Admin Panel
 * </div>
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Role-based navigation -->
 * <nav>
 *   <a routerLink="/dashboard">Dashboard</a>
 *   <a *thHasRole="'recruiter'" routerLink="/candidates">Candidates</a>
 *   <a *thHasRole="'admin'" routerLink="/settings">Settings</a>
 * </nav>
 *
 * <!-- Role-gated features -->
 * <button *thHasRole="['admin', 'hr_manager']">Manage Users</button>
 *
 * <!-- Multi-role requirements -->
 * <div *thHasRole="['interviewer', 'hiring_manager']; requireAll: true">
 *   <app-interview-feedback-form></app-interview-feedback-form>
 * </div>
 * ```
 *
 * ### Role Logic Summary
 *
 * | Input                    | requireAll | User Roles            | Result |
 * |--------------------------|------------|-----------------------|--------|
 * | `'admin'`                | -          | `['admin', 'user']`   | ✅ Show |
 * | `'superuser'`            | -          | `['admin', 'user']`   | ❌ Hide |
 * | `['admin', 'manager']`   | `false`    | `['admin']`           | ✅ Show |
 * | `['admin', 'manager']`   | `true`     | `['admin']`           | ❌ Hide |
 * | `['admin', 'manager']`   | `true`     | `['admin', 'manager']`| ✅ Show |
 *
 * @see {@link HasPermissionDirective} For permission-based access control
 * @see {@link AuthStore} For authentication state management
 *
 * @publicApi
 */
/* v8 ignore start - Directive class requires Angular TestBed for testing */
@Directive({
  selector: '[thHasRole]',
})
export class HasRoleDirective {
  /**
   * The role or array of roles to check against the current user.
   *
   * - Single string: Checks if user has that specific role
   * - Array of strings: Behavior depends on `thHasRoleRequireAll`
   *   - `false` (default): User needs **any** role (OR logic)
   *   - `true`: User needs **all** roles (AND logic)
   *
   * If no role is provided, content will not be rendered.
   */
  readonly thHasRole: InputSignal<string | string[]> = input<string | string[]>('');

  /**
   * Determines the matching logic when multiple roles are provided.
   *
   * - `false` (default): OR logic - user needs at least one role
   * - `true`: AND logic - user needs all roles
   *
   * @default false
   */
  readonly thHasRoleRequireAll: InputSignal<boolean> = input<boolean>(false);

  /** Template reference for the content to conditionally render. */
  private readonly templateRef: TemplateRef<unknown> = inject(TemplateRef<unknown>);

  /** View container for creating/clearing the embedded view. */
  private readonly viewContainer: ViewContainerRef = inject(ViewContainerRef);

  /** Authentication store providing role checking methods. */
  private readonly authStore = inject(AuthStore);

  /** Tracks whether the view is currently rendered to prevent duplicate creation. */
  private hasView = false;

  constructor() {
    // Reactive effect that runs whenever role inputs change
    // Angular's effect() automatically tracks signal dependencies and re-runs
    // when thHasRole() or thHasRoleRequireAll() signals change
    effect((): void => {
      // Read current role requirements from input signals
      // These reads register the signals as dependencies for this effect
      const roles: string | string[] = this.thHasRole();
      const requireAll: boolean = this.thHasRoleRequireAll();

      // Evaluate if user has the required role(s) using the exported utility function
      // The utility function handles all the AND/OR logic and edge cases
      const hasRole: boolean = checkRoles(roles, requireAll, (r: string) =>
        this.authStore.hasRole(r),
      );

      // View creation/destruction logic
      // We track hasView to prevent duplicate view creation/destruction
      // This is important for performance and to avoid Angular errors
      if (hasRole && !this.hasView) {
        // Role check passed and view doesn't exist yet
        // Create the embedded view from the template reference
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasRole && this.hasView) {
        // Role check failed and view currently exists
        // Clear all views from the container to hide the content
        this.viewContainer.clear();
        this.hasView = false;
      }
      // Note: If hasRole matches hasView state, no action needed
    });
  }
}
/* v8 ignore end */
