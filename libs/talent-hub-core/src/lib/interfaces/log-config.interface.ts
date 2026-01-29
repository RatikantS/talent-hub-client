/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { LogLevel } from '../types';

/**
 * Configuration interface for application logging.
 *
 * This interface defines the structure for configuring logging behavior in the
 * application. It allows you to set the log level, enable/disable server-side
 * logging, and specify the endpoint for remote log storage.
 *
 * @remarks
 * **Properties:**
 * - `level` - Minimum severity level to log (see `LogLevelType` enum).
 * - `logToServer` - Whether to send logs to a remote server.
 * - `logEndpoint` - URL endpoint for server-side log collection.
 *
 * **Behavior:**
 * - Only logs at or above the configured `level` are processed.
 * - If `logToServer` is `true` and `logEndpoint` is provided, logs are sent to the server.
 * - If `logToServer` is `false`, logs are only written to the browser console.
 * - If `logEndpoint` is omitted, server logging is disabled even if `logToServer` is `true`.
 *
 * **Best Practices:**
 * - Use `'debug'` or `'trace'` in development for verbose output.
 * - Use `'warn'` or `'error'` in production to reduce noise.
 * - Enable `logToServer` in production for centralized log monitoring.
 *
 * @example
 * ```typescript
 * // Development configuration (verbose, local only)
 * const devLogConfig: LogConfig = {
 *   level: 'debug',
 *   logToServer: false,
 * };
 *
 * // Production configuration (errors only, send to server)
 * const prodLogConfig: LogConfig = {
 *   level: 'error',
 *   logToServer: true,
 *   logEndpoint: '/api/logs',
 * };
 *
 * // Use in AppConfig
 * const appConfig: AppConfig = {
 *   appName: 'Talent Hub',
 *   appVersion: '1.0.0',
 *   environment: Environment.Production,
 *   logConfig: prodLogConfig,
 * };
 * ```
 *
 * @see LogLevelType
 * @see LoggerService
 * @see AppConfig
 * @publicApi
 */
export interface LogConfig {
  /**
   * The minimum log level to record.
   *
   * Only logs at this level or higher severity will be processed. Logs below
   * this level are ignored. Use `LogLevelType` enum values to set this property.
   *
   * @remarks
   * Log levels in order of severity (lowest to highest):
   * - `'trace'` - Most verbose, detailed tracing information.
   * - `'debug'` - Debugging information for developers.
   * - `'info'` - General informational messages.
   * - `'warn'` - Warning conditions that may require attention.
   * - `'error'` - Error conditions that should be investigated.
   * - `'fatal'` - Critical errors that may cause application failure.
   *
   * @see LogLevelType
   *
   * @example
   * ```typescript
   * // Only log warnings and above
   * { level: 'warn' }
   *
   * // Log everything including debug messages
   * { level: 'debug' }
   *
   * // Only log errors and fatal messages
   * { level: 'error' }
   * ```
   */
  level: LogLevel;

  /**
   * Whether to send logs to a remote server endpoint.
   *
   * When `true`, logs are sent to the URL specified in `logEndpoint` in addition
   * to being written to the browser console. When `false`, logs are only written
   * to the console.
   *
   * @remarks
   * - Requires `logEndpoint` to be set for server logging to work.
   * - Consider the performance impact of sending logs to the server.
   * - Use batching and throttling for high-volume logging scenarios.
   *
   * @example
   * ```typescript
   * // Enable server logging
   * { logToServer: true, logEndpoint: '/api/logs' }
   *
   * // Disable server logging (console only)
   * { logToServer: false }
   * ```
   */
  logToServer: boolean;

  /**
   * The URL endpoint where logs should be sent.
   *
   * Required when `logToServer` is `true`. If omitted or falsy, logs are not
   * sent to the server even if `logToServer` is enabled.
   *
   * @remarks
   * - Should be a relative or absolute URL to your log collection service.
   * - Consider security: use HTTPS in production.
   * - The endpoint should accept POST requests with log data in the body.
   *
   * @example
   * ```typescript
   * // Relative endpoint
   * { logEndpoint: '/api/logs' }
   *
   * // Absolute endpoint
   * { logEndpoint: 'https://logs.example.com/v1/ingest' }
   *
   * // Omitted (no server logging)
   * { logToServer: false }
   * ```
   */
  logEndpoint?: string;
}
