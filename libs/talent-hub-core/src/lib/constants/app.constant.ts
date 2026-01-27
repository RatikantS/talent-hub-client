/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Environment, LogLevel, Theme } from '../enums';

/**
 * Application-wide constants for the Talent Hub platform.
 *
 * This object provides default values for core configuration options such as
 * application name, environment, theme, language, and log level. These constants
 * are used throughout the application for initialization, fallbacks, and as a
 * single source of truth for application-wide settings.
 *
 * @remarks
 * **Available Constants:**
 * - `APP_NAME` - Display name of the application.
 * - `DEFAULT_ENVIRONMENT` - Fallback deployment environment.
 * - `DEFAULT_THEME` - Fallback UI theme.
 * - `DEFAULT_LOG_LEVEL` - Fallback logging verbosity.
 * - `DEFAULT_LANGUAGE` - Fallback locale/language code.
 * - `EVENT_BUS_KEYS` - Standardized event keys for pub-sub messaging.
 *
 * **Usage:**
 * Import and use these constants wherever default values or standard keys are needed:
 * ```typescript
 * import { APP_CONSTANT } from '@talent-hub/core';
 *
 * const theme = userPreference?.theme ?? APP_CONSTANT.DEFAULT_THEME;
 * const language = userPreference?.language ?? APP_CONSTANT.DEFAULT_LANGUAGE;
 * ```
 *
 * **Best Practices:**
 * - Always use these constants instead of hardcoding values.
 * - Add new constants here when introducing new application-wide defaults.
 * - Use `EVENT_BUS_KEYS` for all event bus publish/subscribe operations.
 *
 * @example
 * ```typescript
 * // Use default values as fallbacks
 * const currentTheme = appStore.currentTheme() ?? APP_CONSTANT.DEFAULT_THEME;
 * const currentLanguage = appStore.currentLanguage() ?? APP_CONSTANT.DEFAULT_LANGUAGE;
 *
 * // Subscribe to HTTP error events
 * eventBus.on(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR).subscribe((meta) => {
 *   console.error('HTTP Error:', meta.data);
 * });
 *
 * // Display app name in header
 * document.title = APP_CONSTANT.APP_NAME;
 * ```
 *
 * @see AppConfig
 * @see AppStore
 * @see EventBusService
 * @publicApi
 */
export const APP_CONSTANT = {
  /**
   * The display name of the application.
   *
   * Used for branding, browser title, about dialogs, and anywhere the
   * application name needs to be displayed to users.
   *
   * @example
   * ```typescript
   * document.title = APP_CONSTANT.APP_NAME;
   * // Sets browser tab title to 'Talent Hub'
   * ```
   */
  APP_NAME: 'Talent Hub',

  /**
   * The default deployment environment.
   *
   * Used as a fallback when environment is not explicitly configured.
   * Defaults to `Environment.Development` for safety during local development.
   *
   * @see Environment
   *
   * @example
   * ```typescript
   * const env = appConfig?.environment ?? APP_CONSTANT.DEFAULT_ENVIRONMENT;
   * ```
   */
  DEFAULT_ENVIRONMENT: Environment.Development,

  /**
   * The default UI theme.
   *
   * Used as a fallback when user preference is not set. Defaults to
   * `Theme.Light` for broad accessibility and conventional appearance.
   *
   * @see Theme
   *
   * @example
   * ```typescript
   * const theme = userPreference?.theme ?? APP_CONSTANT.DEFAULT_THEME;
   * ```
   */
  DEFAULT_THEME: Theme.Light,

  /**
   * The default log level for client-side logging.
   *
   * Used as a fallback when log configuration is not specified. Defaults to
   * `LogLevel.Info` for balanced verbosity suitable for most environments.
   *
   * @see LogLevel
   *
   * @example
   * ```typescript
   * const logLevel = appConfig?.logConfig?.level ?? APP_CONSTANT.DEFAULT_LOG_LEVEL;
   * ```
   */
  DEFAULT_LOG_LEVEL: LogLevel.Info,

  /**
   * The default language code for localization.
   *
   * Used as a fallback when user language preference is not set. Defaults to
   * `'en'` (English). Should be a valid ISO 639-1 language code.
   *
   * @example
   * ```typescript
   * const language = userPreference?.language ?? APP_CONSTANT.DEFAULT_LANGUAGE;
   * translateService.use(language);
   * ```
   */
  DEFAULT_LANGUAGE: 'en',

  /**
   * Standardized event bus keys for application-wide pub-sub events.
   *
   * Use these keys with `EventBusService.publish()` and `EventBusService.on()`
   * to ensure consistent event naming across the application. All keys are
   * prefixed with `th:` (Talent Hub) to avoid conflicts with other event sources.
   *
   * @remarks
   * **Available Keys:**
   * - `HTTP_ERROR` - Published when an HTTP error occurs (4xx, 5xx responses).
   * - `HTTP_UNKNOWN_ERROR` - Published when an unknown/unexpected error occurs.
   *
   * **Naming Convention:**
   * - Prefix: `th:` (Talent Hub namespace)
   * - Format: `th:{category}.{event}` (e.g., `th:http.error`)
   *
   * @example
   * ```typescript
   * // Subscribe to HTTP errors
   * eventBus.on(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR).subscribe((meta) => {
   *   if (meta.data?.status === 401) {
   *     redirectToLogin();
   *   }
   * });
   *
   * // Publish an HTTP error (typically done by ErrorHandlingInterceptor)
   * eventBus.publish(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR, {
   *   status: 500,
   *   message: 'Internal Server Error',
   * });
   * ```
   */
  EVENT_BUS_KEYS: {
    /**
     * Event key for HTTP errors (HttpErrorResponse).
     *
     * Published by `ErrorHandlingInterceptor` when an HTTP request fails
     * with a 4xx or 5xx status code.
     *
     * **Payload:** `{ status, message, error, url, method, requestUrl }`
     */
    HTTP_ERROR: 'th:http.error',

    /**
     * Event key for unknown/unexpected HTTP errors.
     *
     * Published by `ErrorHandlingInterceptor` when an unexpected error
     * occurs that is not an `HttpErrorResponse`.
     *
     * **Payload:** `{ error }`
     */
    HTTP_UNKNOWN_ERROR: 'th:http.unknown.error',
  },
} as const;
