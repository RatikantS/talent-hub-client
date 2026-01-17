/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * Represents a user in the Talent Hub system.
 */
export interface User {
  /** Unique identifier for the user */
  id: string;

  /** User's email address */
  email: string;

  /** User's first name */
  firstName: string;

  /** User's last name */
  lastName: string;

  /** List of roles assigned to the user (e.g., 'admin', 'candidate') */
  roles: string[];

  /** List of permissions granted to the user */
  permissions: string[];
}
