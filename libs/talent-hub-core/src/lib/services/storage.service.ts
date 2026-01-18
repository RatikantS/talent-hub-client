/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Injectable } from '@angular/core';

import { StorageType } from '../types';

/**
 * StorageService - Provides a wrapper for localStorage and sessionStorage with type safety and error handling.
 *
 * This service allows storing, retrieving, removing, and clearing data in browser storage.
 * It handles JSON serialization/deserialization and gracefully ignores storage errors (e.g., quota exceeded, unavailable storage, invalid JSON).
 *
 * Usage:
 *   const storage = inject(StorageService);
 *   storage.setItem('user', { id: 1 });
 *   const user = storage.getItem<{ id: number }>('user');
 *
 * - Uses strict typing, no any.
 * - All methods are safe to call in environments where storage may be unavailable.
 * - All errors are intentionally ignored to avoid breaking the app due to storage issues.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Gets a value from storage by key.
   * @template T The expected type of the stored value.
   * @param key Storage key
   * @param storageType 'local' (default) or 'session'
   * @returns The parsed value if present and valid, otherwise null.
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
   * Sets a value in storage by key.
   * Serializes the value as JSON before storing.
   *
   * @template T The type of the value to store.
   * @param key Storage key
   * @param value Value to store (will be JSON stringified)
   * @param storageType 'local' (default) or 'session'
   *
   * Errors are intentionally ignored to prevent app crashes due to storage limitations (e.g., quota exceeded, unavailable storage).
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
   * @param key Storage key
   * @param storageType 'local' (default) or 'session'
   *
   * Errors are intentionally ignored to ensure removal is best-effort and does not break the app.
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
   * @param storageType 'local' (default) or 'session'
   *
   * Errors are intentionally ignored to ensure clearing is best-effort and does not break the app.
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
   * @param storageType 'local' or 'session'
   * @returns The corresponding Storage object (localStorage or sessionStorage).
   */
  private getStorage(storageType: StorageType): Storage {
    if (storageType === 'session') {
      return window.sessionStorage;
    }
    return window.localStorage;
  }
}
