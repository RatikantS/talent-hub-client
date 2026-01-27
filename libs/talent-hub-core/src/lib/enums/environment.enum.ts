/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

/**
 * Enum representing the deployment environment for the Talent Hub application.
 *
 * This enum defines the different runtime environments where the application
 * can be deployed. It is used throughout the application for environment-specific
 * configuration, logging levels, feature toggling, and API endpoint selection.
 *
 * @remarks
 * **Available Environments:**
 * - `Development` - Local development with verbose logging and debug tools.
 * - `Staging` - Pre-production environment for testing and QA.
 * - `Production` - Live production environment with optimized settings.
 *
 * **Usage:**
 * This enum is typically used in:
 * - `AppConfig.environment` to specify the current environment.
 * - Conditional logic for environment-specific behavior.
 * - Logging configuration to adjust verbosity.
 * - Feature flags that vary by environment.
 *
 * @example
 * ```typescript
 * // In environment configuration
 * const appConfig: AppConfig = {
 *   appName: 'Talent Hub',
 *   appVersion: '1.0.0',
 *   environment: Environment.Production,
 * };
 *
 * // Conditional logic based on environment
 * if (appStore.currentEnvironment() === Environment.Development) {
 *   enableDevTools();
 *   setLogLevel(LogLevel.Debug);
 * }
 *
 * // Environment-specific API endpoints
 * const apiUrl = environment === Environment.Production
 *   ? 'https://api.talent-hub.com'
 *   : 'https://api-staging.talent-hub.com';
 *
 * // Feature flags by environment
 * const showDebugPanel = environment !== Environment.Production;
 * ```
 *
 * @see AppConfig
 * @see AppStore
 * @publicApi
 */
export enum Environment {
  /**
   * Local or development environment.
   *
   * Used for local development with full debugging capabilities, verbose logging,
   * and development tools enabled. API calls may point to local or mock services.
   *
   * @example
   * ```typescript
   * if (environment === Environment.Development) {
   *   console.log('Running in development mode');
   * }
   * ```
   */
  Development = 'development',

  /**
   * Pre-production or staging environment.
   *
   * Used for testing and QA before deploying to production. Should mirror
   * production configuration as closely as possible while allowing for
   * testing-specific features.
   *
   * @example
   * ```typescript
   * if (environment === Environment.Staging) {
   *   enableTestingFeatures();
   * }
   * ```
   */
  Staging = 'staging',

  /**
   * Live production environment.
   *
   * The production environment serving real users. Logging should be minimal
   * (errors and warnings only), debugging tools disabled, and all optimizations
   * enabled for performance and security.
   *
   * @example
   * ```typescript
   * if (environment === Environment.Production) {
   *   disableDevTools();
   *   setLogLevel(LogLevel.Error);
   * }
   * ```
   */
  Production = 'production',
}
