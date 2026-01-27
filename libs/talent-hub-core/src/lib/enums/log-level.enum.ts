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
 * Enum representing the log levels for the Talent Hub application.
 *
 * This enum controls the verbosity of client-side logging and filters logs
 * based on severity. The levels follow standard logging conventions used in
 * enterprise and production-grade applications for diagnostics and monitoring.
 *
 * @remarks
 * **Severity Order (lowest to highest):**
 * 1. `Trace` - Most verbose, detailed execution tracing.
 * 2. `Debug` - Debugging information for developers.
 * 3. `Info` - General informational messages.
 * 4. `Warn` - Warning conditions that may require attention.
 * 5. `Error` - Error conditions that should be investigated.
 * 6. `Fatal` - Critical errors causing application failure.
 *
 * **Usage:**
 * This enum is typically used in:
 * - `LogConfig.level` to set the minimum log level.
 * - `LoggerService` to filter which messages are logged.
 * - Environment-specific configuration (verbose in dev, minimal in prod).
 *
 * **Best Practices:**
 * - Use `Trace`/`Debug` in development for detailed troubleshooting.
 * - Use `Info` for normal operational messages.
 * - Use `Warn` for recoverable issues that may need attention.
 * - Use `Error` for failures that affect functionality.
 * - Use `Fatal` only for critical failures requiring immediate attention.
 * - Set to `Warn` or `Error` in production to reduce noise.
 *
 * @example
 * ```typescript
 * // Configure logging level in AppConfig
 * const appConfig: AppConfig = {
 *   appName: 'Talent Hub',
 *   appVersion: '1.0.0',
 *   environment: Environment.Production,
 *   logConfig: {
 *     level: LogLevel.Warn, // Only log warnings and above
 *     logToServer: true,
 *     logEndpoint: '/api/logs',
 *   },
 * };
 *
 * // Use in LoggerService
 * logger.trace('Entering function xyz', { param1, param2 });
 * logger.debug('Processing data', { count: items.length });
 * logger.info('User logged in', { userId });
 * logger.warn('API response slow', { duration: 3000 });
 * logger.error('Failed to save data', { error });
 * logger.fatal('Database connection lost', { connectionId });
 *
 * // Environment-specific log levels
 * const logLevel = environment === Environment.Development
 *   ? LogLevel.Debug
 *   : LogLevel.Warn;
 * ```
 *
 * @see LogConfig
 * @see LoggerService
 * @see AppConfig
 * @publicApi
 */
export enum LogLevel {
  /**
   * Critical error causing application shutdown or major failure.
   *
   * The highest severity level indicating a catastrophic failure that
   * requires immediate attention. Use sparingly for truly critical errors
   * that prevent the application from functioning.
   *
   * @example
   * ```typescript
   * logger.fatal('Database connection lost - application cannot continue', {
   *   connectionString: '[redacted]',
   *   error: err.message,
   * });
   * ```
   */
  Fatal = 'fatal',

  /**
   * Error events that might still allow the application to continue running.
   *
   * Indicates a significant problem that should be investigated but doesn't
   * necessarily require immediate shutdown. The application may be able to
   * recover or continue with degraded functionality.
   *
   * @example
   * ```typescript
   * logger.error('Failed to fetch user profile', {
   *   userId: '123',
   *   statusCode: 500,
   *   error: err.message,
   * });
   * ```
   */
  Error = 'error',

  /**
   * Potentially harmful situations or recoverable issues.
   *
   * Indicates something unexpected happened or a potential problem was
   * detected, but the application can continue. These should be monitored
   * and may require future investigation.
   *
   * @example
   * ```typescript
   * logger.warn('API response time exceeded threshold', {
   *   endpoint: '/api/users',
   *   duration: 3500,
   *   threshold: 2000,
   * });
   * ```
   */
  Warn = 'warn',

  /**
   * Informational messages that highlight the progress of the application.
   *
   * General operational information useful for understanding application
   * flow and state. Should be used for significant events that are part
   * of normal operation.
   *
   * @example
   * ```typescript
   * logger.info('User successfully logged in', {
   *   userId: '123',
   *   loginMethod: 'SSO',
   * });
   * ```
   */
  Info = 'info',

  /**
   * Fine-grained informational events useful for debugging.
   *
   * Detailed information primarily useful during development and debugging.
   * Should not be enabled in production due to verbosity and potential
   * performance impact.
   *
   * @example
   * ```typescript
   * logger.debug('Processing batch item', {
   *   batchId: 'batch-123',
   *   itemIndex: 42,
   *   itemData: item,
   * });
   * ```
   */
  Debug = 'debug',

  /**
   * Most detailed information, typically for tracing program execution.
   *
   * The most verbose logging level, used for detailed tracing of program
   * execution flow. Only enable during deep debugging sessions as it
   * generates significant log volume.
   *
   * @example
   * ```typescript
   * logger.trace('Entering calculateTax function', {
   *   amount: 1000,
   *   taxRate: 0.08,
   *   region: 'US-CA',
   * });
   * ```
   */
  Trace = 'trace',
}
