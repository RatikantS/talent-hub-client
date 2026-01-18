/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Environment } from '../enums';
import { LogConfig } from '../interfaces';

/**
 * Application configuration interface for the Talent Hub platform.
 *
 * This interface defines global, build-time, and runtime configuration options
 * for the host/shell application. It is intended to be used for environment-specific
 * and versioned settings that may be displayed in the UI or used for feature toggling.
 */
export interface AppConfig {
  /**
   * Human-readable name of the application (e.g., 'Talent Hub').
   * Used for display in the UI and for branding purposes.
   */
  appName: string;

  /**
   * The version of the application (set from environment or build process).
   * Should follow semantic versioning (e.g., '1.2.3').
   * Used for display, diagnostics, and cache busting.
   */
  appVersion: string;

  /**
   * CI/CD build number for traceability (optional).
   * Can be used to identify the exact build in deployment pipelines or support tickets.
   * If omitted, buildNumber is not shown in the UI.
   */
  buildNumber?: string;

  /**
   * ISO timestamp of the build (set at build time, optional).
   * Useful for debugging, support, and display in about dialogs.
   * If omitted, buildTimestamp is not shown in the UI.
   */
  buildTimestamp?: string;

  /**
   * List of supported language codes (e.g., ['en', 'de'], optional).
   * Used for internationalization (i18n) and language switchers.
   * If omitted, the app may default to a single language.
   */
  supportedLanguages?: string[];

  /**
   * The current deployment environment (see Environment enum).
   * Used to control environment-specific features, logging, and endpoints.
   * Should be set to one of the values from the Environment enum (e.g., 'Production', 'Development').
   */
  environment: Environment;

  /**
   * Logging configuration for the application.
   * Controls log levels, endpoints, and other logging-related settings.
   * If omitted, logging may be disabled or use defaults.
   */
  logConfig?: LogConfig;
}
