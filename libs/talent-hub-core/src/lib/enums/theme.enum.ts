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
 * Enum representing the available UI themes for the Talent Hub application.
 *
 * This enum provides type safety and consistency when setting or switching
 * between supported themes. Use these values with `AppStore` and `UserPreference`
 * to manage the application's visual appearance.
 *
 * @remarks
 * **Available Themes:**
 * - `Light` - Light color scheme with bright backgrounds (default).
 * - `Dark` - Dark color scheme with dark backgrounds for reduced eye strain.
 * - `System` - Automatically follows the user's OS or browser preference.
 *
 * **Usage:**
 * This enum is typically used in:
 * - `UserPreference.theme` to store the user's theme preference.
 * - `AppStore` methods like `setTheme()` and `toggleTheme()`.
 * - CSS class bindings for theme-specific styling.
 * - Theme toggle components and settings pages.
 *
 * **Accessibility:**
 * - Provide sufficient color contrast in both light and dark themes.
 * - Test UI components in all theme modes.
 * - Consider users with visual impairments when designing color schemes.
 *
 * @example
 * ```typescript
 * // Set theme in user preferences
 * const preference: UserPreference = {
 *   language: 'en',
 *   theme: Theme.Dark,
 * };
 *
 * // Update theme via AppStore
 * appStore.setTheme(Theme.Dark);
 *
 * // Toggle between light and dark
 * appStore.toggleTheme();
 *
 * // Check current theme
 * if (appStore.isDarkMode()) {
 *   document.body.classList.add('dark-theme');
 * }
 *
 * // Apply theme class to document
 * const themeClass = appStore.currentTheme() === Theme.Dark ? 'dark' : 'light';
 * document.documentElement.setAttribute('data-theme', themeClass);
 *
 * // Respect system preference
 * const userPref: UserPreference = {
 *   language: 'en',
 *   theme: Theme.System, // Auto-detect from OS
 * };
 * ```
 *
 * @see UserPreference
 * @see AppStore
 * @publicApi
 */
export enum Theme {
  /**
   * Light theme with bright backgrounds.
   *
   * The default theme providing a traditional light color scheme. Suitable
   * for well-lit environments and users who prefer bright interfaces.
   *
   * @example
   * ```typescript
   * appStore.setTheme(Theme.Light);
   * // Applies light background colors and dark text
   * ```
   */
  Light = 'light',

  /**
   * Dark theme with dark backgrounds.
   *
   * A dark color scheme that reduces eye strain in low-light environments
   * and can help conserve battery on OLED screens. Features dark backgrounds
   * with light text.
   *
   * @example
   * ```typescript
   * appStore.setTheme(Theme.Dark);
   * // Applies dark background colors and light text
   * ```
   */
  Dark = 'dark',

  /**
   * System theme that follows OS or browser preference.
   *
   * Automatically detects and applies the user's operating system or browser
   * theme preference. Uses the `prefers-color-scheme` media query to determine
   * whether to apply light or dark mode.
   *
   * @remarks
   * When using this option, the application should listen for changes to
   * the system preference and update the theme accordingly.
   *
   * @example
   * ```typescript
   * appStore.setTheme(Theme.System);
   *
   * // Detect system preference
   * const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   * const effectiveTheme = prefersDark ? Theme.Dark : Theme.Light;
   * ```
   */
  System = 'system',
}
