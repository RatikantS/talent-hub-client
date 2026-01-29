/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Environment } from '../types';
import { LogConfig } from '../interfaces';

/**
 * Application configuration interface for the Talent Hub platform.
 *
 * This interface defines global, build-time, and runtime configuration options
 * for the host/shell application. It is used for environment-specific settings,
 * versioning information, internationalization, and logging configuration.
 *
 * @remarks
 * **Required Properties:**
 * - `appName` - Display name of the application.
 * - `appVersion` - Semantic version string.
 * - `environment` - Current deployment environment.
 *
 * **Optional Properties:**
 * - `buildNumber` - CI/CD build identifier for traceability.
 * - `buildTimestamp` - ISO timestamp of when the build was created.
 * - `supportedLanguages` - List of supported language codes for i18n.
 * - `logConfig` - Logging configuration (levels, endpoints, etc.).
 *
 * **Usage:**
 * This interface is used by the `AppStore` to manage application-wide configuration.
 * It is typically loaded at application bootstrap from environment files or a remote
 * configuration service.
 *
 * @example
 * ```typescript
 * // Define application configuration
 * const appConfig: AppConfig = {
 *   appName: 'Talent Hub',
 *   appVersion: '2.1.0',
 *   buildNumber: '1234',
 *   buildTimestamp: '2026-01-27T10:30:00.000Z',
 *   environment: 'production',
 *   supportedLanguages: ['en', 'de', 'fr'],
 *   logConfig: {
 *     level: 'warn',
 *     logToServer: true,
 *     logEndpoint: '/api/logs',
 *   },
 * };
 *
 * // Initialize the AppStore with configuration
 * appStore.initialize(appConfig, userPreference);
 *
 * // Access configuration
 * console.log(`Running ${appStore.getConfig()?.appName} v${appStore.getConfig()?.appVersion}`);
 * ```
 *
 * @see AppStore
 * @see EnvironmentType
 * @see LogConfig
 * @publicApi
 */
export interface AppConfig {
  /**
   * Human-readable name of the application.
   *
   * Used for display in the UI, browser title, about dialogs, and branding.
   * This should be a user-friendly name like 'Talent Hub' or 'HR Portal'.
   *
   * @example
   * ```typescript
   * const config: AppConfig = {
   *   appName: 'Talent Hub',
   *   // ...other properties
   * };
   *
   * // Display in header
   * document.title = config.appName;
   * ```
   */
  appName: string;

  /**
   * The version of the application following semantic versioning.
   *
   * Should follow the semver format: `MAJOR.MINOR.PATCH` (e.g., '1.2.3').
   * Used for display in about dialogs, diagnostics, API headers, and cache busting.
   *
   * @remarks
   * - Typically set from `package.json` or build EnvironmentType variables.
   * - Increment MAJOR for breaking changes, MINOR for new features, PATCH for fixes.
   *
   * @example
   * ```typescript
   * const config: AppConfig = {
   *   appVersion: '2.1.0',
   *   // ...other properties
   * };
   *
   * // Show in footer
   * console.log(`Version: ${config.appVersion}`);
   * ```
   */
  appVersion: string;

  /**
   * CI/CD build number for traceability (optional).
   *
   * Used to identify the exact build in deployment pipelines, support tickets,
   * or diagnostic logs. This is typically set by the CI/CD system (e.g., Jenkins,
   * GitHub Actions, Azure DevOps).
   *
   * @remarks
   * If omitted, the build number is not displayed in the UI. Consider including
   * this in production builds for easier troubleshooting.
   *
   * @example
   * ```typescript
   * const config: AppConfig = {
   *   buildNumber: '1234',
   *   // ...other properties
   * };
   *
   * // Show in about dialog
   * console.log(`Build: #${config.buildNumber}`);
   * ```
   */
  buildNumber?: string;

  /**
   * ISO8601 timestamp of when the build was created (optional).
   *
   * Useful for debugging, support, and display in about dialogs.
   * Should be set at build time using `new Date().toISOString()` or equivalent.
   *
   * @remarks
   * If omitted, the build timestamp is not displayed in the UI.
   *
   * @example
   * ```typescript
   * const config: AppConfig = {
   *   buildTimestamp: '2026-01-27T10:30:00.000Z',
   *   // ...other properties
   * };
   *
   * // Display formatted date
   * const buildDate = new Date(config.buildTimestamp);
   * console.log(`Built on: ${buildDate.toLocaleDateString()}`);
   * ```
   */
  buildTimestamp?: string;

  /**
   * List of supported language codes for internationalization (optional).
   *
   * Used for i18n configuration and language switcher components.
   * Language codes should follow ISO 639-1 (e.g., 'en', 'de', 'fr', 'es').
   *
   * @remarks
   * - If omitted, the application may default to a single language.
   * - The first language in the array is typically the default/fallback language.
   * - Ensure translations are available for all listed languages.
   *
   * @example
   * ```typescript
   * const config: AppConfig = {
   *   supportedLanguages: ['en', 'de', 'fr', 'es'],
   *   // ...other properties
   * };
   *
   * // Populate language dropdown
   * config.supportedLanguages?.forEach(lang => {
   *   addLanguageOption(lang);
   * });
   * ```
   */
  supportedLanguages?: string[];

  /**
   * The current deployment environment.
   *
   * Used to control environment-specific features, logging verbosity, API endpoints,
   * and debug tools. Should be set to one of the values: 'development', 'staging', or 'production'.
   *
   * @remarks
   * Common environments include:
   * - `'development'` - Local development with verbose logging.
   * - `'staging'` - Pre-production testing environment.
   * - `'production'` - Live production environment with minimal logging.
   *
   * @see EnvironmentType
   *
   * @example
   * ```typescript
   * const config: AppConfig = {
   *   environment: 'production',
   *   // ...other properties
   * };
   *
   * // Conditionally enable features
   * if (config.environment === 'development') {
   *   enableDevTools();
   * }
   * ```
   */
  environment: Environment;

  /**
   * Logging configuration for the application (optional).
   *
   * Controls log levels, server-side logging endpoints, and other logging-related
   * settings. If omitted, logging may be disabled or use sensible defaults.
   *
   * @remarks
   * Use this to configure:
   * - Log verbosity (e.g., `LogLevel.Debug`, `LogLevel.Error`).
   * - Whether to send logs to a remote server.
   * - The endpoint URL for server-side logging.
   *
   * @see LogConfig
   *
   * @example
   * ```typescript
   * const config: AppConfig = {
   *   logConfig: {
   *     level: LogLevel.Warn,
   *     logToServer: true,
   *     logEndpoint: '/api/logs',
   *   },
   *   // ...other properties
   * };
   *
   * // Configure logger based on config
   * logger.setLevel(config.logConfig?.level ?? LogLevel.Info);
   * ```
   */
  logConfig?: LogConfig;
}
