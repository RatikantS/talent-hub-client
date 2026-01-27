/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { User } from '../../interfaces';

/**
 * Represents the authentication state for the Talent Hub application.
 *
 * This interface defines the structure of the authentication state object managed by the
 * `AuthStore`. It includes the authentication status, session token, and current user profile.
 * All properties are intended to be serializable, type-safe, and suitable for state management,
 * persistence, and debugging.
 *
 * @remarks
 * **State Properties:**
 * - `isAuthenticated` - Whether the user is currently logged in.
 * - `token` - The JWT or session token for API authorization.
 * - `user` - The authenticated user's profile with identity, roles, and permissions.
 *
 * **Usage:**
 * This interface is used as the state type for `AuthStore` and should not be
 * instantiated directly. Access state through the `AuthStore` signals and methods.
 *
 * @example
 * ```typescript
 * // The AuthStore uses AuthState internally
 * const initialState: AuthState = {
 *   isAuthenticated: false,
 *   token: null,
 *   user: null,
 * };
 *
 * // Access state via AuthStore
 * const authStore = inject(AuthStore);
 * if (authStore.isAuthenticated()) {
 *   console.log(`Welcome, ${authStore.fullName()}`);
 * }
 * ```
 *
 * @see AuthStore
 * @see User
 * @publicApi
 */
export interface AuthState {
  /**
   * Indicates whether the user is currently authenticated.
   *
   * This flag is `true` when the user has a valid session (token and user are set).
   * Use this to guard protected routes, show/hide UI elements, or trigger login flows.
   *
   * @remarks
   * This value is typically set to `true` after a successful login and `false` after logout
   * or session expiration.
   *
   * @example
   * ```typescript
   * // In a route guard
   * if (!authStore.isAuthenticated()) {
   *   router.navigate(['/login']);
   *   return false;
   * }
   *
   * // In a template
   * // @if (authStore.isAuthenticated()) {
   * //   <app-user-menu />
   * // } @else {
   * //   <app-login-button />
   * // }
   * ```
   */
  isAuthenticated: boolean;

  /**
   * The authentication token for the current user session.
   *
   * This is typically a JWT (JSON Web Token) or similar session token used to
   * authenticate API requests. The token is included in the `Authorization` header
   * of HTTP requests (e.g., `Bearer <token>`).
   *
   * Returns `null` if the user is not authenticated or the session has expired.
   *
   * @remarks
   * - Store this token securely; avoid exposing it in logs or URLs.
   * - The token may have an expiration time; handle token refresh as needed.
   * - Clear this value on logout or session invalidation.
   *
   * @example
   * ```typescript
   * const token = authStore.getToken();
   * if (token) {
   *   request.headers.set('Authorization', `Bearer ${token}`);
   * }
   * ```
   */
  token: string | null;

  /**
   * The currently authenticated user's profile.
   *
   * Contains the user's identity information including `id`, `email`, `firstName`,
   * `lastName`, `roles`, and `permissions`. Returns `null` if the user is not
   * authenticated.
   *
   * @remarks
   * Use this object to:
   * - Display user information in the UI (name, email, avatar).
   * - Perform role-based access control (RBAC) using `roles`.
   * - Perform permission-based access control using `permissions`.
   *
   * @see User
   *
   * @example
   * ```typescript
   * const user = authStore.user();
   * if (user) {
   *   console.log(`Hello, ${user.firstName} ${user.lastName}`);
   *   console.log(`Roles: ${user.roles.join(', ')}`);
   *   console.log(`Permissions: ${user.permissions.join(', ')}`);
   * }
   * ```
   */
  user: User | null;
}
