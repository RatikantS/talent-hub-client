/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Injectable } from '@angular/core';

import { StorageType } from '../types';

/**
 * StorageService - Provides a type-safe wrapper for browser localStorage and sessionStorage.
 *
 * This service abstracts direct storage access and provides methods for storing, retrieving,
 * removing, and clearing data. It handles JSON serialization/deserialization automatically
 * and gracefully handles storage errors to prevent application crashes.
 *
 * @remarks
 * - Supports both `localStorage` (persistent) and `sessionStorage` (session-only).
 * - All values are automatically serialized to JSON on write and parsed on read.
 * - All operations are wrapped in try-catch blocks; errors are silently ignored.
 * - Safe to use in environments where storage may be unavailable (e.g., private browsing, SSR).
 * - Handles common storage errors: quota exceeded, storage unavailable, invalid JSON.
 * - Uses strict typing with generics; avoids `any` type.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly storage = inject(StorageService);
 *
 * // Store an object in localStorage
 * this.storage.setItem('user', { id: '123', name: 'John' });
 *
 * // Retrieve with type safety
 * interface User { id: string; name: string; }
 * const user = this.storage.getItem<User>('user');
 * if (user) {
 *   console.log('Welcome back,', user.name);
 * }
 *
 * // Use sessionStorage for temporary data
 * this.storage.setItem('formDraft', formData, 'session');
 * const draft = this.storage.getItem<FormData>('formDraft', 'session');
 *
 * // Remove a specific item
 * this.storage.removeItem('user');
 *
 * // Clear all localStorage
 * this.storage.clear();
 * ```
 *
 * @see StorageType
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Retrieves a value from storage by key.
   *
   * Reads the value from the specified storage, parses it as JSON, and returns
   * the typed result. Returns `null` if the key doesn't exist, the value is
   * invalid JSON, or storage is unavailable.
   *
   * @template T - The expected type of the stored value.
   * @param key - The storage key to retrieve.
   * @param storageType - The storage type: `'local'` (default) or `'session'`.
   * @returns The parsed value of type `T` if present and valid, otherwise `null`.
   *
   * @example
   * ```typescript
   * // Get a simple value
   * const theme = this.storage.getItem<string>('theme');
   *
   * // Get a complex object with type safety
   * interface UserSettings {
   *   notifications: boolean;
   *   language: string;
   * }
   * const settings = this.storage.getItem<UserSettings>('settings');
   * if (settings) {
   *   console.log('Notifications:', settings.notifications);
   * }
   *
   * // Get from sessionStorage
   * const tempData = this.storage.getItem<string[]>('recentSearches', 'session');
   * ```
   */
  getItem<T>(key: string, storageType: StorageType = 'local'): T | null {
    try {
      const storage: Storage = this.getStorage(storageType);
      const value: string | null = storage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      // Intentionally ignore storage errors (e.g., unavailable, quota exceeded, invalid JSON)
      // Returning null ensures the app does not break due to storage issues.
      return null;
    }
  }

  /**
   * Stores a value in storage by key.
   *
   * Serializes the value as JSON and stores it in the specified storage.
   * Errors are silently ignored to prevent application crashes from storage
   * limitations (e.g., quota exceeded, private browsing mode).
   *
   * @template T - The type of the value to store.
   * @param key - The storage key under which to store the value.
   * @param value - The value to store (will be JSON stringified).
   * @param storageType - The storage type: `'local'` (default) or `'session'`.
   *
   * @remarks
   * - Objects, arrays, and primitives are all supported via JSON serialization.
   * - Circular references in objects will cause silent failures.
   * - `undefined` values are stored as `null` after JSON serialization.
   *
   * @example
   * ```typescript
   * // Store a primitive value
   * this.storage.setItem('theme', 'dark');
   *
   * // Store an object
   * this.storage.setItem('user', { id: '123', name: 'John', roles: ['admin'] });
   *
   * // Store in sessionStorage (cleared when browser closes)
   * this.storage.setItem('sessionToken', 'abc123', 'session');
   *
   * // Store an array
   * this.storage.setItem('recentItems', ['item1', 'item2', 'item3']);
   * ```
   */
  setItem<T>(key: string, value: T, storageType: StorageType = 'local'): void {
    try {
      const storage: Storage = this.getStorage(storageType);
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Intentionally ignore storage errors (e.g., quota exceeded, unavailable)
      // This prevents app crashes due to storage limitations.
    }
  }

  /**
   * Removes a value from storage by key.
   *
   * Deletes the specified key from the storage. This operation is idempotent;
   * calling it on a non-existent key has no effect.
   *
   * @param key - The storage key to remove.
   * @param storageType - The storage type: `'local'` (default) or `'session'`.
   *
   * @example
   * ```typescript
   * // Remove from localStorage
   * this.storage.removeItem('user');
   *
   * // Remove from sessionStorage
   * this.storage.removeItem('tempData', 'session');
   *
   * // Safe to call even if key doesn't exist
   * this.storage.removeItem('nonExistentKey');
   * ```
   */
  removeItem(key: string, storageType: StorageType = 'local'): void {
    try {
      const storage: Storage = this.getStorage(storageType);
      storage.removeItem(key);
    } catch {
      // Intentionally ignore storage errors (e.g., unavailable storage)
      // Safe to ignore as removal is best-effort.
    }
  }

  /**
   * Clears all keys from the specified storage.
   *
   * Removes all key-value pairs from the storage. Use with caution as this
   * affects all data in the storage, not just data set by your application.
   *
   * @param storageType - The storage type to clear: `'local'` (default) or `'session'`.
   *
   * @remarks
   * - This clears ALL data in the storage, including data from other applications
   *   on the same origin.
   * - Consider using `removeItem()` for selective removal instead.
   *
   * @example
   * ```typescript
   * // Clear all localStorage data
   * this.storage.clear();
   *
   * // Clear all sessionStorage data
   * this.storage.clear('session');
   *
   * // Logout scenario: clear user data
   * logout(): void {
   *   this.authStore.logout();
   *   this.storage.clear();
   *   this.storage.clear('session');
   *   this.router.navigate(['/login']);
   * }
   * ```
   */
  clear(storageType: StorageType = 'local'): void {
    try {
      const storage: Storage = this.getStorage(storageType);
      storage.clear();
    } catch {
      // Intentionally ignore storage errors (e.g., unavailable storage)
      // Safe to ignore as clearing is best-effort.
    }
  }

  /**
   * Returns the correct Storage object for the given type.
   *
   * Maps the `StorageType` string to the corresponding browser storage API.
   *
   * @param storageType - The storage type: `'local'` or `'session'`.
   * @returns The corresponding `Storage` object (`localStorage` or `sessionStorage`).
   * @internal
   */
  private getStorage(storageType: StorageType): Storage {
    if (storageType === 'session') {
      return window.sessionStorage;
    }
    return window.localStorage;
  }
}
