/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Theme } from '../enums';

/**
 * UserPreference - Represents a user's preference settings in the Talent Hub application.
 *
 * This interface defines the user's active selections for language and theme.
 * These preferences are typically stored per user and used to personalize the
 * application experience across sessions and devices.
 *
 * Usage example:
 *   const pref: UserPreference = { language: 'en', theme: Theme.Light };
 *
 * Notes:
 * - 'language' should be a valid ISO language code (e.g., 'en', 'de').
 * - 'theme' must be a value from the Theme enum (e.g., Theme.Light, Theme.Dark).
 * - All properties are required for a valid preference object.
 */
export interface UserPreference {
  /**
   * The user's preferred language code (e.g., 'en', 'de').
   * Used for localization and i18n throughout the application.
   * Should match one of the supportedLanguages in AppConfig.
   */
  language: string;

  /**
   * The user's preferred UI theme (see Theme enum).
   * Used to personalize the application's appearance.
   * Should be set to a valid Theme value.
   */
  theme: Theme;
}
