/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Theme } from '../enums';

/**
 * Represents a user's preference settings in the Talent Hub application.
 *
 * This interface defines the user's active selections for language and theme.
 * These preferences are stored per user and used to personalize the application
 * experience across sessions, devices, and micro-frontends.
 *
 * @remarks
 * **Properties:**
 * - `language` - The user's preferred language code for localization.
 * - `theme` - The user's preferred UI theme (light/dark).
 *
 * **Usage:**
 * This interface is used by the `AppStore` to manage user preferences and is
 * typically persisted to local storage, user profile, or backend API.
 *
 * **Best Practices:**
 * - Validate that `language` matches one of the `supportedLanguages` in `AppConfig`.
 * - Ensure `theme` is a valid value from the `Theme` enum.
 * - Sync preferences across devices via user profile API when possible.
 *
 * @example
 * ```typescript
 * // Create a user preference object
 * const preference: UserPreference = {
 *   language: 'en',
 *   theme: Theme.Dark,
 * };
 *
 * // Initialize the AppStore with preferences
 * appStore.initialize(appConfig, preference);
 *
 * // Update theme
 * appStore.setTheme(Theme.Light);
 *
 * // Update language
 * appStore.setLanguage('de');
 *
 * // Access current preferences
 * const currentTheme = appStore.currentTheme();
 * const currentLang = appStore.currentLanguage();
 * ```
 *
 * @see AppStore
 * @see AppConfig
 * @see Theme
 * @publicApi
 */
export interface UserPreference {
  /**
   * The user's preferred language code.
   *
   * Used for localization and internationalization (i18n) throughout the application.
   * Should be a valid ISO 639-1 language code (e.g., 'en', 'de', 'fr', 'es').
   *
   * @remarks
   * - Should match one of the `supportedLanguages` in `AppConfig`.
   * - Used by translation services to load the appropriate language pack.
   * - Affects date/time formatting, number formatting, and UI text.
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   language: 'de', // German
   *   theme: Theme.Light,
   * };
   *
   * // Apply language
   * translateService.use(pref.language);
   * ```
   */
  language: string;

  /**
   * The user's preferred UI theme.
   *
   * Used to personalize the application's visual appearance. Should be set to
   * a valid value from the `Theme` enum (e.g., `Theme.Light`, `Theme.Dark`).
   *
   * @remarks
   * - Affects colors, backgrounds, and overall visual styling.
   * - Respects user system preferences when auto-detection is enabled.
   * - Persisted across sessions for consistent experience.
   *
   * @see Theme
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   language: 'en',
   *   theme: Theme.Dark,
   * };
   *
   * // Apply theme class to body
   * document.body.classList.toggle('dark-theme', pref.theme === Theme.Dark);
   *
   * // Toggle theme
   * appStore.toggleTheme();
   * ```
   */
  theme: Theme;
}
