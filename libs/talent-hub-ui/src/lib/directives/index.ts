/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

/**
 * Directives Module - Barrel Export
 *
 * This file serves as the public API for all Angular directives and utility functions
 * in the talent-hub-ui library. Import directives from this index for cleaner imports
 * throughout the application.
 *
 * @usageNotes
 *
 * ### Importing Directives
 *
 * ```typescript
 * // Import individual directives
 * import { HasRoleDirective, NumericOnlyDirective } from '@talent-hub/ui/directives';
 *
 * // Use in standalone components
 * @Component({
 *   imports: [HasRoleDirective, NumericOnlyDirective],
 *   template: `
 *     <div *thHasRole="'admin'">Admin Only</div>
 *     <input thNumericOnly formControlName="age" />
 *   `
 * })
 * ```
 *
 * ### Importing Utility Functions
 *
 * ```typescript
 * // Import utility functions for programmatic access control
 * import { checkPermissions, checkRoles } from '@talent-hub/ui/directives';
 *
 * // Use in services or components
 * const canEdit = checkPermissions('edit', false, authStore.hasPermission);
 * const isAdmin = checkRoles('admin', false, authStore.hasRole);
 * ```
 *
 * ### Available Directives
 *
 * | Directive                | Selector                | Purpose                                   |
 * |--------------------------|-------------------------|-------------------------------------------|
 * | `AlphaOnlyDirective`     | `input[thAlphaOnly]`    | Restrict input to alphabetic characters   |
 * | `CopyToClipboardDirective`| `[thCopyToClipboard]`  | Copy text to clipboard on click           |
 * | `DragDropDirective`      | `[thDragDrop]`          | Enable HTML5 drag and drop                |
 * | `HasPermissionDirective` | `*thHasPermission`      | Conditionally render by permission        |
 * | `HasRoleDirective`       | `*thHasRole`            | Conditionally render by role              |
 * | `NumericOnlyDirective`   | `input[thNumericOnly]`  | Restrict input to numeric characters      |
 * | `TrimInputDirective`     | `input[thTrimInput]`    | Auto-trim whitespace on blur              |
 *
 * ### Available Utility Functions
 *
 * | Function           | Purpose                                          |
 * |--------------------|--------------------------------------------------|
 * | `checkPermissions` | Check if user has required permission(s)         |
 * | `checkRoles`       | Check if user has required role(s)               |
 *
 * ### Directive Categories
 *
 * - **Authorization**: `HasPermissionDirective`, `HasRoleDirective`
 * - **Input Validation**: `AlphaOnlyDirective`, `NumericOnlyDirective`, `TrimInputDirective`
 * - **UI/UX Utilities**: `CopyToClipboardDirective`, `DragDropDirective`
 *
 * @module Directives
 */

// ============================================================================
// Authorization Directives
// ============================================================================

/** Conditionally renders content based on user permissions */
export * from './has-permission.directive';

/** Conditionally renders content based on user roles */
export * from './has-role.directive';

// ============================================================================
// Input Validation Directives
// ============================================================================

/** Restricts input to alphabetic characters only (A-Z, a-z) */
export * from './alpha-only.directive';

/** Restricts input to numeric characters only (0-9, optional decimal/negative) */
export * from './numeric-only.directive';

/** Automatically trims leading/trailing whitespace on blur */
export * from './trim-input.directive';

// ============================================================================
// UI/UX Utility Directives
// ============================================================================

/** Copies text to clipboard on click with success/error feedback */
export * from './copy-to-clipboard.directive';

/** Enables native HTML5 drag and drop with type-safe data transfer */
export * from './drag-drop.directive';
