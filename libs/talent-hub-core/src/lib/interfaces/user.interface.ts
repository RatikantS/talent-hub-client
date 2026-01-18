/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * User - Represents a user in the Talent Hub system.
 *
 * This interface defines the core user identity and authorization properties used throughout the platform.
 *
 * Usage:
 *   const user: User = { ... };
 *   user.roles.includes('admin');
 *
 * Notes:
 * - 'id' is a unique, immutable identifier (UUID or string).
 * - 'roles' and 'permissions' are used for access control and feature toggling.
 * - All properties are required for a valid user object.
 */
export interface User {
  /**
   * Unique identifier for the user (UUID or string).
   * Used as the primary key for user records and references.
   */
  id: string;

  /**
   * User's email address (must be unique).
   * Used for login, notifications, and user lookup.
   */
  email: string;

  /**
   * User's first name (given name).
   * Used for display and personalization.
   */
  firstName: string;

  /**
   * User's last name (family name).
   * Used for display and personalization.
   */
  lastName: string;

  /**
   * List of roles assigned to the user (e.g., 'admin', 'candidate').
   * Used for role-based access control (RBAC) and UI feature toggling.
   * Should always be a non-empty array for authenticated users.
   */
  roles: string[];

  /**
   * List of permissions granted to the user (fine-grained access control).
   * Used for permission checks in guards, services, and UI logic.
   * May be empty if the user has no special permissions.
   */
  permissions: string[];
}
