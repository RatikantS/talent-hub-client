/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * StorageType - Represents the allowed browser storage types for the application.
 *
 * This type is used throughout the platform to distinguish between localStorage and sessionStorage
 * in a type-safe way. It enables clear intent and prevents invalid storage type usage in services
 * and utilities that interact with browser storage.
 *
 * Usage example:
 *   const type: StorageType = 'local';
 *   storageService.setItem('key', value, type);
 *
 * Notes:
 * - Only the two literal values are allowed: 'local' (for localStorage) and 'session' (for sessionStorage).
 * - Use this type for all APIs that accept a storage type argument to ensure type safety.
 */
export type StorageType = 'local' | 'session';
