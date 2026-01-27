/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { AuthState } from './auth-state.interface';
import { AsyncState } from '../async-state.interface';
import { User } from '../../interfaces';

/**
 * Initial authentication state for AuthStore.
 *
 * This object defines the default values for all authentication-related state properties.
 * The state is reset to these values when the user logs out or the application first loads.
 *
 * @remarks
 * - `isAuthenticated` - Whether the user is currently authenticated.
 * - `token` - The JWT or session token for the current user session.
 * - `user` - The authenticated user's profile (id, email, name, roles, permissions).
 * - `isLoading` - Whether an authentication operation is in progress.
 * - `error` - Holds any authentication error (login failure, token expiration, etc.).
 *
 * @internal
 */
const initialState: AuthState & AsyncState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: false,
  error: undefined,
};

/**
 * AuthStore - Global signal-based authentication state store for Talent Hub.
 *
 * This store manages authentication state, user identity, and authorization details.
 * It leverages Angular signals and NgRx SignalStore for reactive, type-safe, and
 * immutable state management. All state is kept immutable and updated via pure methods.
 *
 * @remarks
 * **Key Responsibilities:**
 * - Holds authentication state (`isAuthenticated`, `token`, `user`).
 * - Provides computed signals for user identity (`userId`, `userEmail`, `fullName`).
 * - Provides computed signals for authorization (`userRoles`, `userPermissions`, `isAdmin`).
 * - Exposes methods for role and permission checks (`hasRole()`, `hasPermission()`).
 * - Exposes setters for authentication state (`setToken()`, `setUser()`).
 *
 * **State Signals (Readable):**
 * - `isAuthenticated()` - Whether the user is authenticated.
 * - `token()` - The current authentication token or `null`.
 * - `user()` - The current `User` object or `null`.
 * - `isLoading()` - Whether an auth operation is in progress.
 * - `error()` - The current error object, if any.
 *
 * **Computed Signals:**
 * - `authToken()` - The authentication token (alias for `token()`).
 * - `userId()` - The user's unique identifier.
 * - `userEmail()` - The user's email address.
 * - `fullName()` - The user's full name (firstName + lastName).
 * - `userRoles()` - Array of roles assigned to the user.
 * - `userPermissions()` - Array of permissions granted to the user.
 * - `isAdmin()` - Whether the user has the 'admin' role.
 *
 * @example
 * ```typescript
 * // Inject the store in a component or service
 * private readonly authStore = inject(AuthStore);
 *
 * // Check authentication status
 * if (this.authStore.isAuthenticated()) {
 *   console.log(`Welcome, ${this.authStore.fullName()}`);
 * }
 *
 * // Check roles and permissions
 * if (this.authStore.hasRole('admin')) {
 *   showAdminPanel();
 * }
 * if (this.authStore.hasPermission('delete')) {
 *   enableDeleteButton();
 * }
 *
 * // Use computed signals in templates
 * // @if (authStore.isAdmin()) {
 * //   <app-admin-dashboard />
 * // }
 *
 * // Set user after login
 * this.authStore.setToken(response.token);
 * this.authStore.setUser(response.user);
 * ```
 *
 * @see AuthState
 * @see User
 * @see AsyncState
 * @publicApi
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED SIGNALS
  // ─────────────────────────────────────────────────────────────────────────────
  withComputed(({ token, user }) => ({
    /**
     * Computed signal that returns the authentication token for the current session.
     *
     * Returns `null` if the user is not authenticated or no token is available.
     *
     * @returns The JWT or session token string, or `null`.
     *
     * @example
     * ```typescript
     * const token = authStore.authToken();
     * if (token) {
     *   headers.set('Authorization', `Bearer ${token}`);
     * }
     * ```
     */
    authToken: computed((): string | null => token() ?? null),

    /**
     * Computed signal that returns the user's unique identifier.
     *
     * Returns an empty string if the user is not authenticated.
     *
     * @returns The user's ID string, or an empty string.
     *
     * @example
     * ```typescript
     * const userId = authStore.userId();
     * fetchUserData(userId);
     * ```
     */
    userId: computed((): string => user()?.id ?? ''),

    /**
     * Computed signal that returns the user's email address.
     *
     * Returns an empty string if the user is not authenticated.
     *
     * @returns The user's email string, or an empty string.
     *
     * @example
     * ```typescript
     * const email = authStore.userEmail();
     * console.log(`Logged in as: ${email}`);
     * ```
     */
    userEmail: computed((): string => user()?.email ?? ''),

    /**
     * Computed signal that returns the user's full name.
     *
     * Concatenates `firstName` and `lastName` with a space. Returns an empty
     * string if the user is not authenticated.
     *
     * @returns The user's full name, or an empty string.
     *
     * @example
     * ```typescript
     * const name = authStore.fullName();
     * greetingMessage.textContent = `Welcome, ${name}!`;
     * ```
     */
    fullName: computed((): string => {
      const currentUser: User | null = user();
      return currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
    }),

    /**
     * Computed signal that returns all roles assigned to the user.
     *
     * Returns an empty array if the user is not authenticated or has no roles.
     *
     * @returns An array of role strings.
     *
     * @example
     * ```typescript
     * const roles = authStore.userRoles();
     * console.log(`User roles: ${roles.join(', ')}`);
     * ```
     */
    userRoles: computed((): string[] => user()?.roles ?? []),

    /**
     * Computed signal that returns all permissions granted to the user.
     *
     * Returns an empty array if the user is not authenticated or has no permissions.
     *
     * @returns An array of permission strings.
     *
     * @example
     * ```typescript
     * const permissions = authStore.userPermissions();
     * if (permissions.includes('write')) {
     *   enableEditMode();
     * }
     * ```
     */
    userPermissions: computed((): string[] => user()?.permissions ?? []),

    /**
     * Computed signal that returns `true` if the user has the 'admin' role.
     *
     * @returns `true` if the user is an admin, `false` otherwise.
     *
     * @example
     * ```typescript
     * if (authStore.isAdmin()) {
     *   showAdminControls();
     * }
     * ```
     */
    isAdmin: computed(
      (): boolean => !!(Array.isArray(user()?.roles) && user()?.roles.includes('admin')),
    ),
  })),

  // ─────────────────────────────────────────────────────────────────────────────
  // METHODS
  // ─────────────────────────────────────────────────────────────────────────────
  withMethods((store) => ({
    /**
     * Checks if the user has a specific role.
     *
     * Performs a case-sensitive check against the user's roles array.
     *
     * @param role - The role string to check (e.g., 'admin', 'editor', 'viewer').
     * @returns `true` if the user has the role, `false` otherwise.
     *
     * @example
     * ```typescript
     * if (authStore.hasRole('editor')) {
     *   enableEditing();
     * }
     * ```
     */
    hasRole(role: string): boolean {
      const roles: string[] | undefined = store.user()?.roles;
      return Array.isArray(roles) && roles.includes(role);
    },

    /**
     * Checks if the user has a specific permission.
     *
     * Performs a case-sensitive check against the user's permissions array.
     *
     * @param permission - The permission string to check (e.g., 'read', 'write', 'delete').
     * @returns `true` if the user has the permission, `false` otherwise.
     *
     * @example
     * ```typescript
     * if (authStore.hasPermission('delete')) {
     *   showDeleteButton();
     * }
     * ```
     */
    hasPermission(permission: string): boolean {
      const permissions: string[] | undefined = store.user()?.permissions;
      return Array.isArray(permissions) && permissions.includes(permission);
    },

    /**
     * Returns all roles assigned to the user.
     *
     * Use this method for imperative checks. For reactive bindings, use the
     * `userRoles` computed signal instead.
     *
     * @returns An array of role strings, or an empty array if not authenticated.
     *
     * @example
     * ```typescript
     * const roles = authStore.getRoles();
     * logUserActivity(`User has roles: ${roles.join(', ')}`);
     * ```
     */
    getRoles(): string[] {
      return store.user()?.roles ?? [];
    },

    /**
     * Returns all permissions granted to the user.
     *
     * Use this method for imperative checks. For reactive bindings, use the
     * `userPermissions` computed signal instead.
     *
     * @returns An array of permission strings, or an empty array if not authenticated.
     *
     * @example
     * ```typescript
     * const permissions = authStore.getPermissions();
     * validateAccess(permissions);
     * ```
     */
    getPermissions(): string[] {
      return store.user()?.permissions ?? [];
    },

    /**
     * Returns the user's unique identifier.
     *
     * Use this method for imperative checks. For reactive bindings, use the
     * `userId` computed signal instead.
     *
     * @returns The user's ID string, or an empty string if not authenticated.
     *
     * @example
     * ```typescript
     * const id = authStore.getUserId();
     * fetchUserProfile(id);
     * ```
     */
    getUserId(): string {
      return store.user()?.id ?? '';
    },

    /**
     * Returns the user's email address.
     *
     * Use this method for imperative checks. For reactive bindings, use the
     * `userEmail` computed signal instead.
     *
     * @returns The user's email string, or an empty string if not authenticated.
     *
     * @example
     * ```typescript
     * const email = authStore.getUserEmail();
     * sendNotification(email);
     * ```
     */
    getUserEmail(): string {
      return store.user()?.email ?? '';
    },

    /**
     * Returns the user's full name (firstName + lastName).
     *
     * Use this method for imperative checks. For reactive bindings, use the
     * `fullName` computed signal instead.
     *
     * @returns The user's full name, or an empty string if not authenticated.
     *
     * @example
     * ```typescript
     * const name = authStore.getFullName();
     * displayWelcomeMessage(name);
     * ```
     */
    getFullName(): string {
      const currentUser: User | null = store.user();
      return currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
    },

    /**
     * Returns the authentication token for the current session.
     *
     * Use this method for imperative checks (e.g., in interceptors). For reactive
     * bindings, use the `authToken` computed signal instead.
     *
     * @returns The JWT or session token string, or `null` if not authenticated.
     *
     * @example
     * ```typescript
     * const token = authStore.getToken();
     * if (token) {
     *   request.headers.set('Authorization', `Bearer ${token}`);
     * }
     * ```
     */
    getToken(): string | null {
      const token: string | null = store.token?.();
      return token ?? null;
    },

    /**
     * Sets the authentication token for the current session.
     *
     * Call this method after a successful login to store the token.
     * Pass `null` to clear the token (e.g., on logout).
     *
     * @param token - The JWT or session token string, or `null` to clear.
     *
     * @example
     * ```typescript
     * // After successful login
     * authStore.setToken(response.accessToken);
     *
     * // On logout
     * authStore.setToken(null);
     * ```
     */
    setToken(token: string | null): void {
      patchState(store, { token });
    },

    /**
     * Sets the authenticated user's details.
     *
     * Call this method after a successful login to store the user profile.
     * Pass `null` to clear the user (e.g., on logout).
     *
     * @param user - The `User` object containing id, email, name, roles, and permissions, or `null` to clear.
     *
     * @example
     * ```typescript
     * // After successful login
     * authStore.setUser({
     *   id: '123',
     *   email: 'user@example.com',
     *   firstName: 'John',
     *   lastName: 'Doe',
     *   roles: ['user', 'editor'],
     *   permissions: ['read', 'write'],
     * });
     *
     * // On logout
     * authStore.setUser(null);
     * ```
     */
    setUser(user: User | null): void {
      patchState(store, { user });
    },
  })),
);
