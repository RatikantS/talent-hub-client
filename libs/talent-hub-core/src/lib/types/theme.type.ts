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
 * Type alias representing the allowed UI theme modes for the application.
 *
 * This type provides a string literal union for type-safe theme selection,
 * storage, and switching. It is used throughout the platform for user preferences,
 * UI logic, and theme persistence.
 *
 * @remarks
 * **Allowed Values:**
 * - `'light'` - Light theme with bright backgrounds and dark text.
 * - `'dark'` - Dark theme with dark backgrounds and light text.
 * - `'system'` - Follows the user's OS or browser theme preference.
 *
 * **Usage:**
 * Use this type for:
 * - Function parameters that accept theme values.
 * - Type-safe theme storage in local storage or cookies.
 * - API payloads for theme preferences.
 *
 * **Relationship to Theme Enum:**
 * This type mirrors the `Theme` enum values as string literals.
 * Use the `Theme` enum for code clarity and `ThemeType` for serialization
 * or external API compatibility.
 *
 * @example
 * ```typescript
 * // Type-safe theme variable
 * const theme: ThemeType = 'dark';
 *
 * // Function accepting theme parameter
 * function applyTheme(theme: ThemeType): void {
 *   document.documentElement.setAttribute('data-theme', theme);
 * }
 *
 * // Conditional logic based on theme
 * if (theme === 'system') {
 *   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
 *   applyTheme(prefersDark ? 'dark' : 'light');
 * } else {
 *   applyTheme(theme);
 * }
 *
 * // Store theme in localStorage
 * localStorage.setItem('theme', theme);
 *
 * // Retrieve and validate theme
 * const stored = localStorage.getItem('theme') as ThemeType | null;
 * ```
 *
 * @see Theme
 * @see UserPreference
 * @publicApi
 */
export type ThemeType = 'light' | 'dark' | 'system';
