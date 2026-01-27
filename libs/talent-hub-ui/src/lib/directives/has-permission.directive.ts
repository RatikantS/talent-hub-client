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
 * Checks if a user has the required permission(s) based on the provided checker function.
 *
 * This is a pure utility function that can be used independently of the directive
 * for permission checking logic. It supports both single permission strings and
 * arrays of permissions with configurable AND/OR logic.
 *
 * @param permissions - Single permission string or array of permission strings to check
 * @param requireAll - If true, all permissions must match (AND); if false, any permission matches (OR)
 * @param hasPermission - Function that checks if user has a specific permission
 * @returns True if permission check passes, false otherwise
 *
 * @example
 * ```typescript
 * // Single permission
 * checkPermissions('view', false, (p) => userPermissions.includes(p));
 *
 * // Multiple permissions with OR logic
 * checkPermissions(['view', 'edit'], false, authStore.hasPermission);
 *
 * // Multiple permissions with AND logic
 * checkPermissions(['view', 'edit'], true, authStore.hasPermission);
 * ```
 *
 * @publicApi
 */
export function checkPermissions(
  permissions: string | string[],
  requireAll: boolean,
  hasPermission: (permission: string) => boolean,
): boolean {
  // Handle single permission string
  if (typeof permissions === 'string') {
    // Empty string means no permission was specified - deny access for safety
    // This prevents accidental access when permission input is not set
    if (permissions === '') {
      return false;
    }
    // Direct check: user either has the permission or doesn't
    return hasPermission(permissions);
  }

  // Handle array of permissions
  if (Array.isArray(permissions)) {
    // Empty array means no permissions specified - deny access for safety
    // This prevents accidental access when permissions array is empty
    if (permissions.length === 0) {
      return false;
    }

    if (requireAll) {
      // AND logic: User must have ALL specified permissions
      // Short-circuits on first missing permission (efficient for large arrays)
      return permissions.every((permission: string): boolean => hasPermission(permission));
    } else {
      // OR logic: User needs at least ONE of the specified permissions
      // Short-circuits on first matching permission (efficient for large arrays)
      return permissions.some((permission: string): boolean => hasPermission(permission));
    }
  }

  // Invalid input type (null, undefined, number, object, etc.)
  // Deny access by default to follow the principle of least privilege
  return false;
}

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
/* v8 ignore start - Directive class requires Angular TestBed for testing */
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
   * If no permission is provided, content will not be rendered.
   */
  readonly thHasPermission: InputSignal<string | string[]> = input<string | string[]>('');

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
  private readonly authStore = inject(AuthStore);

  /** Tracks whether the view is currently rendered to prevent duplicate creation. */
  private hasView = false;

  constructor() {
    // Reactive effect that runs whenever permission inputs change
    // Angular's effect() automatically tracks signal dependencies and re-runs
    // when thHasPermission() or thHasPermissionRequireAll() signals change
    effect((): void => {
      // Read current permission requirements from input signals
      // These reads register the signals as dependencies for this effect
      const permissions: string | string[] = this.thHasPermission();
      const requireAll: boolean = this.thHasPermissionRequireAll();

      // Evaluate if user has the required permission(s) using the exported utility function
      // The utility function handles all the AND/OR logic and edge cases
      const hasPermission: boolean = checkPermissions(permissions, requireAll, (p: string) =>
        this.authStore.hasPermission(p),
      );

      // View creation/destruction logic
      // We track hasView to prevent duplicate view creation/destruction
      // This is important for performance and to avoid Angular errors

      if (hasPermission && !this.hasView) {
        // Permission check passed and view doesn't exist yet
        // Create the embedded view from the template reference
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasPermission && this.hasView) {
        // Permission check failed and view currently exists
        // Clear all views from the container to hide the content
        this.viewContainer.clear();
        this.hasView = false;
      }
      // Note: If hasPermission matches hasView state, no action needed
    });
  }
}
/* v8 ignore end */
