/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { AuthState } from './auth-state.interface';
import { AsyncState } from '../async-state.interface';
import { User } from '../../interfaces';

/**
 * AuthStore - Signal-based authentication state store for Talent Hub.
 *
 * This store manages authentication state, user identity, and authorization details.
 * It exposes computed properties and methods for querying authentication status,
 * user details, roles, and permissions. All state is kept immutable and updated
 * via pure methods, following Angular and TypeScript best practices.
 *
 * Key responsibilities:
 * - Holds authentication state (isAuthenticated, token, user)
 * - Provides computed properties for user identity, roles, and permissions
 * - Exposes methods for querying roles and permissions
 *
 * Usage:
 *   const authStore = inject(AuthStore);
 *   if (authStore.isAdmin()) { ... }
 *   if (authStore.hasRole('editor')) { ... }
 *   if (authStore.hasPermission('read')) { ... }
 *   const token = authStore.authToken();
 *   const user = authStore.user();
 *
 * All queries are performed via signals and pure methods, ensuring reactivity and
 * strict type safety. This store is intended to be used across all MFEs for
 * consistent authentication and authorization logic.
 */

/**
 * Initial authentication state for AuthStore.
 *
 * - isAuthenticated: Indicates if the user is authenticated.
 * - token: The authentication token for the current user session.
 * - user: The authenticated user's details (id, email, name, roles, permissions).
 */
const initialState: AuthState & AsyncState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: false,
  error: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthStore: any = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ token, user }) => ({
    /**
     * Returns the authentication token for the current user session.
     */
    authToken: computed(() => token() ?? null),
    /**
     * Returns the user's unique identifier.
     */
    userId: computed(() => user()?.id ?? ''),
    /**
     * Returns the user's email address.
     */
    userEmail: computed(() => user()?.email ?? ''),
    /**
     * Returns the user's full name (firstName + lastName).
     */
    fullName: computed(() => {
      const currentUser = user();
      return currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
    }),
    /**
     * Returns all roles assigned to the user.
     */
    userRoles: computed(() => user()?.roles ?? []),
    /**
     * Returns all permissions granted to the user.
     */
    userPermissions: computed(() => user()?.permissions ?? []),
    /**
     * Returns true if the user has the 'admin' role.
     */
    isAdmin: computed(() => !!(Array.isArray(user()?.roles) && user()?.roles.includes('admin'))),
  })),
  withMethods((store) => ({
    /**
     * Returns true if the user has a specific role.
     * @param role - Role string to check
     */
    hasRole(role: string): boolean {
      const roles: string[] | undefined = store.user()?.roles;
      return Array.isArray(roles) && roles.includes(role);
    },
    /**
     * Returns true if the user has a specific permission.
     * @param permission - Permission string to check
     */
    hasPermission(permission: string): boolean {
      const permissions: string[] | undefined = store.user()?.permissions;
      return Array.isArray(permissions) && permissions.includes(permission);
    },
    /**
     * Returns all roles assigned to the user.
     */
    getRoles(): string[] {
      return store.user()?.roles ?? [];
    },
    /**
     * Returns all permissions granted to the user.
     */
    getPermissions(): string[] {
      return store.user()?.permissions ?? [];
    },
    /**
     * Returns the user's unique identifier.
     */
    getUserId(): string {
      return store.user()?.id ?? '';
    },
    /**
     * Returns the user's email address.
     */
    getUserEmail(): string {
      return store.user()?.email ?? '';
    },
    /**
     * Returns the user's full name (firstName + lastName).
     */
    getFullName(): string {
      const currentUser = store.user();
      return currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
    },
    /**
     * Returns the authentication token for the current user session.
     */
    getToken(): string | null {
      const token: string | null = store.token?.();
      return token ?? null;
    },
    /**
     * Sets the authentication token for the current user session.
     */
    setToken(token: string | null): void {
      patchState(store, { token });
    },
    /**
     * Sets the authenticated user's details.
     */
    setUser(user: User | null): void {
      patchState(store, { user });
    },
  })),
);
