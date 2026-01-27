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
 * Represents a user in the Talent Hub system.
 *
 * This interface defines the core user identity and authorization properties used
 * throughout the platform for authentication, authorization, and personalization.
 * It is used by the `AuthStore`, `AuthService`, and throughout all micro-frontends.
 *
 * @remarks
 * **Identity Properties:**
 * - `id` - Unique identifier for the user (UUID or string).
 * - `email` - User's email address (unique, used for login).
 * - `firstName` - User's first/given name.
 * - `lastName` - User's last/family name.
 *
 * **Authorization Properties:**
 * - `roles` - Array of role strings for role-based access control (RBAC).
 * - `permissions` - Array of permission strings for fine-grained access control.
 *
 * **Usage:**
 * This interface is used wherever user information is needed, including:
 * - Authentication state in `AuthStore`
 * - User profile display in components
 * - Authorization checks in guards and services
 *
 * @example
 * ```typescript
 * // Create a user object
 * const user: User = {
 *   id: 'usr_123456',
 *   email: 'john.doe@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   roles: ['user', 'editor'],
 *   permissions: ['read', 'write', 'publish'],
 * };
 *
 * // Check user roles
 * if (user.roles.includes('admin')) {
 *   showAdminPanel();
 * }
 *
 * // Check user permissions
 * if (user.permissions.includes('delete')) {
 *   enableDeleteButton();
 * }
 *
 * // Display user name
 * console.log(`Welcome, ${user.firstName} ${user.lastName}`);
 * ```
 *
 * @see AuthStore
 * @see AuthService
 * @see AuthState
 * @publicApi
 */
export interface User {
  /**
   * Unique identifier for the user.
   *
   * This is the primary key used to identify the user across the system.
   * Typically a UUID or database-generated string ID. This value is immutable
   * and should never change for a given user.
   *
   * @remarks
   * - Use this ID for API calls, database lookups, and references.
   * - Do not expose internal database IDs; use UUIDs or similar for security.
   *
   * @example
   * ```typescript
   * const userId = user.id; // 'usr_123456' or '550e8400-e29b-41d4-a716-446655440000'
   * fetchUserProfile(userId);
   * ```
   */
  id: string;

  /**
   * User's email address.
   *
   * Must be unique across the system and is typically used as the login
   * identifier. Also used for notifications, password reset, and user lookup.
   *
   * @remarks
   * - Should be validated for proper email format.
   * - Consider case-insensitive comparison for lookups.
   * - Handle email changes carefully (may require re-verification).
   *
   * @example
   * ```typescript
   * console.log(`Contact: ${user.email}`);
   * sendWelcomeEmail(user.email);
   * ```
   */
  email: string;

  /**
   * User's first name (given name).
   *
   * Used for display, personalization, and addressing the user in the UI
   * and communications.
   *
   * @example
   * ```typescript
   * greetingMessage.textContent = `Hello, ${user.firstName}!`;
   * ```
   */
  firstName: string;

  /**
   * User's last name (family name).
   *
   * Used for display, personalization, and formal communications.
   * Combined with `firstName` to create the full name.
   *
   * @example
   * ```typescript
   * const fullName = `${user.firstName} ${user.lastName}`;
   * document.title = `Profile - ${fullName}`;
   * ```
   */
  lastName: string;

  /**
   * List of roles assigned to the user.
   *
   * Used for role-based access control (RBAC) throughout the application.
   * Common roles include 'admin', 'user', 'editor', 'viewer', 'candidate', etc.
   *
   * @remarks
   * - Should always be a non-empty array for authenticated users.
   * - Use `AuthStore.hasRole()` or `AuthService.hasRole()` to check roles.
   * - Roles are typically managed by administrators and synced from backend.
   *
   * @example
   * ```typescript
   * // Check for admin role
   * if (user.roles.includes('admin')) {
   *   showAdminDashboard();
   * }
   *
   * // Check for multiple roles
   * const canEdit = user.roles.some(r => ['admin', 'editor'].includes(r));
   *
   * // Display user roles
   * console.log(`Roles: ${user.roles.join(', ')}`);
   * ```
   */
  roles: string[];

  /**
   * List of permissions granted to the user.
   *
   * Used for fine-grained, permission-based access control. Permissions are
   * more granular than roles and control specific actions (e.g., 'read', 'write',
   * 'delete', 'publish', 'approve').
   *
   * @remarks
   * - May be empty if the user has no special permissions beyond their roles.
   * - Use `AuthStore.hasPermission()` or `AuthService.hasPermission()` to check.
   * - Permissions can be derived from roles or assigned individually.
   *
   * @example
   * ```typescript
   * // Check for specific permission
   * if (user.permissions.includes('delete')) {
   *   showDeleteButton();
   * }
   *
   * // Check for any of multiple permissions
   * const canModify = user.permissions.some(p => ['write', 'update'].includes(p));
   *
   * // List all permissions
   * console.log(`Permissions: ${user.permissions.join(', ')}`);
   * ```
   */
  permissions: string[];
}
