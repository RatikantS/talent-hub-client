/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';

/**
 * CanComponentDeactivate - Interface for components that support unsaved changes detection.
 *
 * Implement this interface in your component to use the unsavedChangesGuard.
 *
 * @property hasUnsavedChanges - Returns true if the component has unsaved changes.
 * @property unsavedChangesMessage - Optional custom message for the confirmation dialog.
 */
export interface CanComponentDeactivate {
  /**
   * Returns true if the component has unsaved changes.
   */
  hasUnsavedChanges: () => boolean;
  /**
   * Optional custom unsaved changes message for the confirmation dialog.
   * If not provided, a default message will be used.
   */
  unsavedChangesMessage?: string;
}

/**
 * unsavedChangesGuard - Prevents navigation away from a route if there are unsaved changes.
 *
 * This guard checks if the component implements the CanComponentDeactivate interface and
 * has unsaved changes. If so, it prompts the user with a confirmation dialog. If the user
 * confirms, navigation proceeds; otherwise, navigation is cancelled.
 *
 * Usage Example (in route config):
 *   {
 *     path: 'edit',
 *     canDeactivate: [unsavedChangesGuard],
 *     // ...
 *   }
 *
 * Implementation Details:
 * - Uses Angular's CanDeactivateFn for type safety.
 * - Designed for use in standalone Angular applications with signals and strict typing.
 * - Follows best practices for user experience and data loss prevention.
 * - The confirmation message can be customized by setting unsavedChangesMessage on the component.
 *
 * @param component The component instance implementing CanComponentDeactivate
 * @param _currentRoute The current ActivatedRouteSnapshot (unused, but required by interface)
 * @param _currentState The current RouterStateSnapshot (unused, but required by interface)
 * @param _nextState The next RouterStateSnapshot (unused, but required by interface)
 * @returns true if navigation is allowed, false if cancelled by the user
 */
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
  _currentRoute: ActivatedRouteSnapshot,
  _currentState: RouterStateSnapshot,
  _nextState: RouterStateSnapshot,
): boolean => {
  // Use message from component if present, otherwise use the default message
  const message: string =
    component.unsavedChangesMessage || 'You have unsaved changes. Are you sure you want to leave?';
  // If the component has unsaved changes, prompt the user for confirmation
  if (component.hasUnsavedChanges()) {
    return window.confirm(message);
  }
  // Otherwise, allow navigation
  return true;
};
