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

import { AuthStore } from 'talent-hub-core';

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
   * @required
   */
  readonly thHasRole: InputSignal<string | string[]> = input.required<string | string[]>();

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
  private readonly authStore: typeof AuthStore = inject(AuthStore);

  /** Tracks whether the view is currently rendered to prevent duplicate creation. */
  private hasView = false;

  constructor() {
    effect((): void => {
      // Read current role requirements from inputs
      const roles: string | string[] = this.thHasRole();
      const requireAll: boolean = this.thHasRoleRequireAll();

      // Evaluate if user has the required role(s)
      const hasRole: boolean = this.checkRoles(roles, requireAll);

      // Create the view if role check passes and view doesn't exist
      if (hasRole && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
      // Clear the view if role check fails and view exists
      else if (!hasRole && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  /**
   * Checks if the user has the required role(s).
   *
   * @param roles - Single role or array of roles
   * @param requireAll - If true, all roles must match; if false, any role matches
   * @returns True if role check passes, false otherwise
   */
  private checkRoles(roles: string | string[], requireAll: boolean): boolean {
    // Handle single role string - direct check against AuthStore
    if (typeof roles === 'string') {
      return this.authStore.hasRole(roles);
    }

    // Handle array of roles
    if (Array.isArray(roles)) {
      // Empty roles array means no access
      if (roles.length === 0) {
        return false;
      }

      if (requireAll) {
        // AND logic: User must have ALL specified roles
        // Returns false as soon as any role is missing
        return roles.every((role: string): boolean => this.authStore.hasRole(role));
      } else {
        // OR logic: User needs at least ONE of the specified roles
        // Returns true as soon as any role matches
        return roles.some((role: string): boolean => this.authStore.hasRole(role));
      }
    }

    // Invalid input type - deny access by default
    return false;
  }
}
