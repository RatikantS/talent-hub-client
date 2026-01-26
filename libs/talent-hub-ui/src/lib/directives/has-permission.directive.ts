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
 * Structural directive that conditionally renders content based on user permissions.
 *
 * This directive checks if the current authenticated user has the required permission(s)
 * and conditionally renders or hides the associated template. It leverages Angular signals
 * for reactive permission checks and integrates with the `AuthStore` for authentication state.
 *
 * @remarks
 * - Uses Angular's structural directive pattern (`*thHasPermission`)
 * - Reactive to permission changes via Angular signals
 * - Supports both single permission and array of permissions
 * - Configurable AND/OR logic for multiple permissions
 * - Integrates with `AuthStore` for centralized auth state
 *
 * @usageNotes
 *
 * ### Basic Usage - Single Permission
 *
 * ```html
 * <!-- Show button only if user has 'candidate.edit' permission -->
 * <button *thHasPermission="'candidate.edit'">Edit Candidate</button>
 * ```
 *
 * ### Multiple Permissions with OR Logic (Default)
 *
 * Content is shown if the user has **any** of the specified permissions:
 *
 * ```html
 * <!-- Show if user has 'edit' OR 'delete' permission -->
 * <button *thHasPermission="['candidate.edit', 'candidate.delete']">
 *   Actions
 * </button>
 * ```
 *
 * ### Multiple Permissions with AND Logic
 *
 * Use `requireAll: true` to require **all** specified permissions:
 *
 * ```html
 * <!-- Show only if user has BOTH 'edit' AND 'approve' permissions -->
 * <button *thHasPermission="['candidate.edit', 'candidate.approve']; requireAll: true">
 *   Edit & Approve
 * </button>
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Admin-only actions -->
 * <div *thHasPermission="'admin.access'">
 *   <app-admin-panel></app-admin-panel>
 * </div>
 *
 * <!-- Feature-gated content -->
 * <button *thHasPermission="'reports.export'">Export Report</button>
 *
 * <!-- Multi-permission features -->
 * <div *thHasPermission="['requisition.create', 'requisition.edit']; requireAll: true">
 *   <app-requisition-form></app-requisition-form>
 * </div>
 * ```
 *
 * ### Permission Logic Summary
 *
 * | Input                      | requireAll | User Permissions        | Result |
 * |----------------------------|------------|-------------------------|--------|
 * | `'edit'`                   | -          | `['edit', 'view']`      | ✅ Show |
 * | `'delete'`                 | -          | `['edit', 'view']`      | ❌ Hide |
 * | `['edit', 'delete']`       | `false`    | `['edit']`              | ✅ Show |
 * | `['edit', 'delete']`       | `true`     | `['edit']`              | ❌ Hide |
 * | `['edit', 'delete']`       | `true`     | `['edit', 'delete']`    | ✅ Show |
 *
 * @see {@link HasRoleDirective} For role-based access control
 * @see {@link AuthStore} For authentication state management
 *
 * @publicApi
 */
@Directive({
  selector: '[thHasPermission]',
})
export class HasPermissionDirective {
  /**
   * The permission or array of permissions to check against the current user.
   *
   * - Single string: Checks if user has that specific permission
   * - Array of strings: Behavior depends on `thHasPermissionRequireAll`
   *   - `false` (default): User needs **any** permission (OR logic)
   *   - `true`: User needs **all** permissions (AND logic)
   *
   * @required
   */
  readonly thHasPermission: InputSignal<string | string[]> = input.required<string | string[]>();

  /**
   * Determines the matching logic when multiple permissions are provided.
   *
   * - `false` (default): OR logic - user needs at least one permission
   * - `true`: AND logic - user needs all permissions
   *
   * @default false
   */
  readonly thHasPermissionRequireAll: InputSignal<boolean> = input<boolean>(false);

  /** Template reference for the content to conditionally render. */
  private readonly templateRef: TemplateRef<unknown> = inject(TemplateRef<unknown>);

  /** View container for creating/clearing the embedded view. */
  private readonly viewContainer: ViewContainerRef = inject(ViewContainerRef);

  /** Authentication store providing permission checking methods. */
  private readonly authStore: typeof AuthStore = inject(AuthStore);

  /** Tracks whether the view is currently rendered to prevent duplicate creation. */
  private hasView = false;

  constructor() {
    effect((): void => {
      // Read current permission requirements from inputs
      const permissions: string | string[] = this.thHasPermission();
      const requireAll: boolean = this.thHasPermissionRequireAll();

      // Evaluate if user has the required permission(s)
      const hasPermission: boolean = this.checkPermissions(permissions, requireAll);

      // Create the view if permission check passes and view doesn't exist
      if (hasPermission && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
      // Clear the view if permission check fails and view exists
      else if (!hasPermission && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  /**
   * Checks if the user has the required permission(s).
   *
   * @param permissions - Single permission or array of permissions
   * @param requireAll - If true, all permissions must match; if false, any permission matches
   * @returns True if permission check passes, false otherwise
   */
  private checkPermissions(permissions: string | string[], requireAll: boolean): boolean {
    // Handle single permission string - direct check against AuthStore
    if (typeof permissions === 'string') {
      return this.authStore.hasPermission(permissions);
    }

    // Handle array of permissions
    if (Array.isArray(permissions)) {
      // Empty permissions array means no access
      if (permissions.length === 0) {
        return false;
      }

      if (requireAll) {
        // AND logic: User must have ALL specified permissions
        // Returns false as soon as any permission is missing
        return permissions.every((permission: string): boolean =>
          this.authStore.hasPermission(permission),
        );
      } else {
        // OR logic: User needs at least ONE of the specified permissions
        // Returns true as soon as any permission matches
        return permissions.some((permission: string): boolean =>
          this.authStore.hasPermission(permission),
        );
      }
    }

    // Invalid input type - deny access by default
    return false;
  }
}
