/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Theme } from '../enums';

/**
 * Represents a user's preference settings in the Talent Hub application.
 *
 * This interface defines the user's active selections for language and theme.
 * These preferences are typically stored per user and used to personalize the
 * application experience across sessions and devices.
 */
export interface UserPreference {
  /** The user's preferred language code (e.g., 'en', 'de') */
  language: string;

  /** The user's preferred UI theme (see Theme enum) */
  theme: Theme;
}
