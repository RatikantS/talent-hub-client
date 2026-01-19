/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */
import { Environment, LogLevel, Theme } from '../enums';

/**
 * Application-wide constants for the Talent Hub platform.
 *
 * This object provides default values for core configuration options such as
 * application name, environment, theme, and log level. These constants are intended
 * to be used throughout the application for initialization, fallbacks, and display.
 */
export const APP_CONSTANT = {
  /** The name of the application */
  APP_NAME: 'Talent Hub',

  /** The default deployment environment */
  DEFAULT_ENVIRONMENT: Environment.Development,

  /** The default UI theme */
  DEFAULT_THEME: Theme.Light,

  /** The default log level for client-side logging */
  DEFAULT_LOG_LEVEL: LogLevel.Info,

  /** The default language for localization */
  DEFAULT_LANGUAGE: 'en',

  /**
   * Event bus keys for application-wide pub-sub events.
   */
  EVENT_BUS_KEYS: {
    HTTP_ERROR: 'th:http.error',
    HTTP_UNKNOWN_ERROR: 'th:http.unknown.error',
  },
};
