/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { AppConfig, UserPreference } from '../../interfaces';

/**
 * Represents the global application state for the Talent Hub platform.
 *
 * This interface defines the structure of the root state object managed by the
 * application store. It includes configuration, user preferences, feature flags,
 * and maintenance mode. All properties are intended to be serializable,
 * type-safe, and suitable for state management, debugging, and UI logic.
 *
 * - isInitialized: Indicates if the application has completed its initialization sequence.
 * - isMaintenanceModeEnabled: If true, the application is in maintenance mode and should display a maintenance UI or restrict user actions.
 * - config: The current application configuration (see AppConfig).
 * - features: Feature flags for toggling application features at runtime (Record<string, boolean> | null).
 * - preference: The user's active selection and preferences (see UserPreference).
 */
export interface AppState {
  /** Indicates if the application has completed its initialization sequence. */
  isInitialized: boolean;

  /**
   * If true, the application is in maintenance mode and should display a maintenance UI or restrict user actions.
   * Use this flag in UI logic to block access or show maintenance notifications.
   */
  isMaintenanceModeEnabled: boolean;

  /**
   * The current application configuration (see AppConfig).
   * This includes environment, logging, and other global settings.
   */
  config: AppConfig | null;

  /**
   * Feature flags for toggling application features at runtime.
   * The key is the feature name, and the value is true (enabled) or false (disabled).
   * If null, no feature flags are set.
   */
  features: Record<string, boolean> | null;

  /**
   * The user's active selection and preferences (see UserPreference).
   * Includes theme, language, and other personalization options.
   */
  preference: UserPreference | null;
}
