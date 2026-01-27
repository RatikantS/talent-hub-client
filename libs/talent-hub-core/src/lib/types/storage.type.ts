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
 * Type alias representing the allowed browser storage types for the application.
 *
 * This type provides a string literal union for type-safe selection between
 * `localStorage` and `sessionStorage`. It is used by storage services and utilities
 * to ensure consistent and type-safe browser storage operations.
 *
 * @remarks
 * **Allowed Values:**
 * - `'local'` - Uses `localStorage` for persistent storage across browser sessions.
 * - `'session'` - Uses `sessionStorage` for storage that clears when the tab/window closes.
 *
 * **Storage Differences:**
 * | Type | Persistence | Scope | Use Case |
 * |------|-------------|-------|----------|
 * | `'local'` | Until cleared | All tabs | User preferences, tokens |
 * | `'session'` | Until tab closes | Single tab | Temporary form data |
 *
 * **Usage:**
 * Use this type for:
 * - Function parameters in storage services.
 * - Configuration options for data persistence.
 * - Type-safe storage type selection in utilities.
 *
 * @example
 * ```typescript
 * // Type-safe storage type variable
 * const storageType: StorageType = 'local';
 *
 * // Storage service method signature
 * function setItem(key: string, value: unknown, type: StorageType): void {
 *   const storage = type === 'local' ? localStorage : sessionStorage;
 *   storage.setItem(key, JSON.stringify(value));
 * }
 *
 * // Using with storage service
 * storageService.setItem('userPrefs', preferences, 'local');
 * storageService.setItem('tempData', formState, 'session');
 *
 * // Get item with type
 * const prefs = storageService.getItem<UserPreference>('userPrefs', 'local');
 * ```
 *
 * @see StorageService
 * @publicApi
 */
export type StorageType = 'local' | 'session';
