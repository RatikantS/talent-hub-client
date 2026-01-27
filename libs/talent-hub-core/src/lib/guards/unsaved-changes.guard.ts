/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';

/**
 * Interface for components that support unsaved changes detection.
 *
 * Implement this interface in components that have forms or editable content
 * to enable the `unsavedChangesGuard` to detect and warn users about unsaved data.
 *
 * @remarks
 * **Required Method:**
 * - `hasUnsavedChanges()` - Must return `true` if the component has unsaved changes.
 *
 * **Optional Property:**
 * - `unsavedChangesMessage` - Custom message for the confirmation dialog.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-edit-profile',
 *   template: `...`,
 * })
 * export class EditProfileComponent implements CanComponentDeactivate {
 *   private readonly form = inject(FormBuilder).group({
 *     name: [''],
 *     email: [''],
 *   });
 *
 *   // Custom confirmation message
 *   unsavedChangesMessage = 'Your profile changes will be lost. Continue?';
 *
 *   // Return true if form has been modified
 *   hasUnsavedChanges(): boolean {
 *     return this.form.dirty;
 *   }
 * }
 * ```
 *
 * @see unsavedChangesGuard
 * @publicApi
 */
export interface CanComponentDeactivate {
  /**
   * Returns `true` if the component has unsaved changes.
   *
   * This method is called by the `unsavedChangesGuard` before navigation.
   * If it returns `true`, the user is prompted with a confirmation dialog.
   *
   * @returns `true` if there are unsaved changes, `false` otherwise.
   *
   * @example
   * ```typescript
   * hasUnsavedChanges(): boolean {
   *   return this.form.dirty || this.dataModified;
   * }
   * ```
   */
  hasUnsavedChanges: () => boolean;

  /**
   * Optional custom message for the unsaved changes confirmation dialog.
   *
   * If not provided, the guard uses a default message:
   * "You have unsaved changes. Are you sure you want to leave?"
   *
   * @example
   * ```typescript
   * unsavedChangesMessage = 'Discard changes to this document?';
   * ```
   */
  unsavedChangesMessage?: string;
}

/**
 * Route guard that prevents navigation away from a route if there are unsaved changes.
 *
 * This functional deactivation guard checks if the component implements `CanComponentDeactivate`
 * and has unsaved changes. If so, it prompts the user with a browser confirmation dialog.
 * Navigation proceeds only if the user confirms; otherwise, it is cancelled.
 *
 * @remarks
 * **Behavior:**
 * - Calls `component.hasUnsavedChanges()` to check for unsaved data.
 * - If unsaved changes exist, shows a browser `confirm()` dialog.
 * - Returns `true` (allow navigation) if no changes or user confirms.
 * - Returns `false` (block navigation) if user cancels the dialog.
 *
 * **Customization:**
 * - Set `unsavedChangesMessage` on the component for a custom dialog message.
 * - Default message: "You have unsaved changes. Are you sure you want to leave?"
 *
 * **Implementation Details:**
 * - Uses Angular's functional guard pattern (`CanDeactivateFn`).
 * - Works with any component implementing `CanComponentDeactivate`.
 * - Uses browser's native `window.confirm()` for the dialog.
 * - Designed for standalone Angular applications.
 *
 * **Limitations:**
 * - Browser `confirm()` cannot be styled; consider custom modal for better UX.
 * - Does not prevent browser refresh or tab close (use `beforeunload` event).
 *
 * @param component - The component instance implementing `CanComponentDeactivate`.
 * @param _currentRoute - The current route snapshot (unused but required by interface).
 * @param _currentState - The current router state (unused but required by interface).
 * @param _nextState - The next router state (unused but required by interface).
 * @returns `true` if navigation is allowed, `false` if cancelled by user.
 *
 * @example
 * ```typescript
 * // Route configuration
 * const routes: Routes = [
 *   {
 *     path: 'edit/:id',
 *     component: EditComponent,
 *     canDeactivate: [unsavedChangesGuard],
 *   },
 * ];
 *
 * // Component implementation
 * @Component({ ... })
 * export class EditComponent implements CanComponentDeactivate {
 *   private isDirty = false;
 *
 *   unsavedChangesMessage = 'You have unsaved edits. Discard them?';
 *
 *   hasUnsavedChanges(): boolean {
 *     return this.isDirty;
 *   }
 *
 *   onFormChange(): void {
 *     this.isDirty = true;
 *   }
 *
 *   onSave(): void {
 *     this.isDirty = false;
 *     // Save logic...
 *   }
 * }
 * ```
 *
 * @see CanComponentDeactivate
 * @see CanDeactivateFn
 * @publicApi
 */
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
  _currentRoute: ActivatedRouteSnapshot,
  _currentState: RouterStateSnapshot,
  _nextState: RouterStateSnapshot,
): boolean => {
  // Use custom message from component if present, otherwise use default
  const message: string =
    component.unsavedChangesMessage || 'You have unsaved changes. Are you sure you want to leave?';

  // If the component has unsaved changes, prompt the user for confirmation
  if (component.hasUnsavedChanges()) {
    return window.confirm(message);
  }

  // No unsaved changes, allow navigation
  return true;
};
