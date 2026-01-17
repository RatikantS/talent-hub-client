/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { AppConfig, UserPreference } from '../../interfaces';
import { Environment, LogLevel } from '../../enums';

/**
 * Represents the global application state for the Talent Hub platform.
 *
 * This interface defines the structure of the root state object managed by the
 * application store. It includes configuration, user preferences, environment,
 * logging, and maintenance mode. All properties are intended to be serializable,
 * type-safe, and suitable for state management, debugging, and UI logic.
 */
export interface AppState {
  /** Indicates if the application has completed its initialization sequence. */
  isInitialized: boolean;

  /**
   * If true, the application is in maintenance mode and should display a maintenance UI or restrict user actions.
   * Use this flag in UI logic to block access or show maintenance notifications.
   */
  isMaintenanceModeEnabled: boolean;

  /** The current deployment environment (see Environment enum). */
  environment: Environment;

  /** The current log level for client-side logging (see LogLevel enum). */
  logLevel: LogLevel;

  /** The current application configuration (see AppConfig). */
  config: AppConfig | null;

  /** The user's active selection and preferences (see UserPreference). */
  preference: UserPreference | null;
}
