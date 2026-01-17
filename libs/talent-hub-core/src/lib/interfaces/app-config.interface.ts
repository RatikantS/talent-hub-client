/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * Application configuration interface for the Talent Hub platform.
 *
 * This interface defines global, build-time, and runtime configuration options
 * for the host/shell application. It is intended to be used for environment-specific
 * and versioned settings that may be displayed in the UI or used for feature toggling.
 */
export interface AppConfig {
  /** Human-readable name of the application (e.g., 'Talent Hub') */
  appName: string;

  /** The version of the application (set from environment or build process) */
  appVersion: string;

  /** CI/CD build number for traceability (optional) */
  buildNumber?: string;

  /** ISO timestamp of the build (set at build time, optional) */
  buildTimestamp?: string;

  /** List of supported language codes (e.g., ['en', 'de'], optional) */
  supportedLanguages?: string[];

  /** Feature flags for toggling application features at runtime (optional) */
  features?: Record<string, boolean>;
}
