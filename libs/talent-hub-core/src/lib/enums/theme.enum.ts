/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * Enum representing the available UI themes for the Talent Hub application.
 *
 * Use this enum to provide type safety and consistency when setting or switching
 * between supported themes. The 'System' option allows the application to follow
 * the user's operating system or browser preference.
 */
export enum Theme {
  Light = 'light', // Light theme (default)
  Dark = 'dark', // Dark theme
  System = 'system', // Follows OS/browser preference
}
