/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { DateFormat, Environment, LogLevel, Theme, TimeFormat } from '../types';

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
   * @see EnvironmentType
   *
   * @example
   * ```typescript
   * const env = appConfig?.environment ?? APP_CONSTANT.DEFAULT_ENVIRONMENT;
   * ```
   */
  DEFAULT_ENVIRONMENT: 'development' as Environment,

  /**
   * The default UI theme.
   *
   * Used as a fallback when user preference is not set. Defaults to
   * `Theme.Light` for broad accessibility and conventional appearance.
   *
   * @see ThemeType
   *
   * @example
   * ```typescript
   * const theme = userPreference?.theme ?? APP_CONSTANT.DEFAULT_THEME;
   * ```
   */
  DEFAULT_THEME: 'light' as Theme,

  /**
   * The default log level for client-side logging.
   *
   * Used as a fallback when log configuration is not specified. Defaults to
   * `'info'` for balanced verbosity suitable for most environments.
   *
   * @see LogLevelType
   *
   * @example
   * ```typescript
   * const logLevel = appConfig?.logConfig?.level ?? APP_CONSTANT.DEFAULT_LOG_LEVEL;
   * ```
   */
  DEFAULT_LOG_LEVEL: 'info' as LogLevel,

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
   * The default timezone for date/time operations.
   *
   * Used as a fallback when user or tenant timezone preference is not set.
   * Defaults to `'UTC'` for consistent, unambiguous time handling.
   * Should be a valid IANA timezone identifier.
   *
   * @remarks
   * Common IANA timezone identifiers:
   * - `'UTC'` - Coordinated Universal Time
   * - `'America/New_York'` - Eastern Time
   * - `'Europe/London'` - British Time
   * - `'Asia/Tokyo'` - Japan Standard Time
   *
   * @example
   * ```typescript
   * const timezone = userPreference?.timezone ?? APP_CONSTANT.DEFAULT_TIME_ZONE;
   * const localTime = new Date().toLocaleString('en-US', { timeZone: timezone });
   * ```
   */
  DEFAULT_TIME_ZONE: 'UTC',

  /**
   * The default date format pattern for displaying dates.
   *
   * Used as a fallback when user or tenant date format preference is not set.
   * Defaults to `'MM/DD/YYYY'` (US format) for broad compatibility.
   *
   * @remarks
   * Available formats from `DateFormat`:
   * - `'MM/DD/YYYY'` - US format (01/28/2026)
   * - `'DD/MM/YYYY'` - European format (28/01/2026)
   * - `'YYYY-MM-DD'` - ISO 8601 format (2026-01-28)
   * - `'DD.MM.YYYY'` - German format (28.01.2026)
   *
   * @see DateFormat
   *
   * @example
   * ```typescript
   * const dateFormat = userPreference?.dateFormat ?? APP_CONSTANT.DEFAULT_DATE_FORMAT;
   * const formattedDate = formatDate(new Date(), dateFormat);
   * ```
   */
  DEFAULT_DATE_FORMAT: 'MM/DD/YYYY' as DateFormat,

  /**
   * The default time format for displaying times.
   *
   * Used as a fallback when user or tenant time format preference is not set.
   * Defaults to `'12h'` (12-hour format with AM/PM).
   *
   * @remarks
   * Available formats from `TimeFormat`:
   * - `'12h'` - 12-hour format with AM/PM (e.g., 2:30 PM)
   * - `'24h'` - 24-hour format (e.g., 14:30)
   *
   * @see TimeFormat
   *
   * @example
   * ```typescript
   * const timeFormat = userPreference?.timeFormat ?? APP_CONSTANT.DEFAULT_TIME_FORMAT;
   * const options: Intl.DateTimeFormatOptions = {
   *   hour: 'numeric',
   *   minute: '2-digit',
   *   hour12: timeFormat === '12h',
   * };
   * const formattedTime = new Date().toLocaleTimeString('en-US', options);
   * ```
   */
  DEFAULT_TIME_FORMAT: '12h' as TimeFormat,

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
