/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * ThemeType - Represents the allowed UI theme modes for the application.
 *
 * This type is used throughout the platform to distinguish between light, dark, and system theme modes.
 * It enables type-safe theme selection, storage, and switching in user preferences and UI logic.
 *
 * Usage example:
 *   const theme: ThemeType = 'dark';
 *   if (theme === 'system') { follow OS preference }
 *
 * Notes:
 * - Only the three literal values are allowed: 'light', 'dark', 'system'.
 * - Use this type for all APIs and state that accept a theme mode argument to ensure type safety.
 * - 'system' means the theme should follow the user's OS/browser preference.
 */
export type ThemeType = 'light' | 'dark' | 'system';
