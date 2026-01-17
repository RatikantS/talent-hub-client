/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { User } from '../../interfaces';

/**
 * Represents the authentication state for the Talent Hub application.
 *
 * This interface defines the structure of the authentication state object managed by the
 * authentication store. It includes the authentication status, token, and the current user.
 * All properties are intended to be serializable and suitable for state management and debugging.
 */
export interface AuthState {
  /** Indicates if the user is currently authenticated. */
  isAuthenticated: boolean;

  /** The authentication token (JWT or similar) for the current session, or null if not authenticated. */
  token: string | null;

  /** The currently authenticated user's details (see User), or null if not authenticated. */
  user: User | null;
}
