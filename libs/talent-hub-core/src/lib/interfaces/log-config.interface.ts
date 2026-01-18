/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { LogLevel } from '../enums';

/**
 * LogConfig - Configuration interface for application logging.
 *
 * This interface defines the structure for configuring logging behavior in the application.
 * It allows you to set the log level, enable/disable server-side logging, and specify the
 * endpoint for remote log storage.
 *
 * Usage example:
 *   logConfig: {
 *     level: LogLevel.Warn,
 *     logToServer: true,
 *     logEndpoint: '/api/logs'
 *   }
 *
 * Notes:
 * - 'level' controls the minimum severity to log (see LogLevel enum).
 * - If 'logToServer' is true, logs are sent to 'logEndpoint' (if provided).
 * - If 'logEndpoint' is omitted or falsy, logs are not sent to the server even if 'logToServer' is true.
 * - If 'logToServer' is false, logs are only written to the browser console.
 * - All properties are required except 'logEndpoint', which is optional for local/dev-only logging.
 */
export interface LogConfig {
  /**
   * The minimum log level to record (see LogLevel enum).
   * Only logs at this level or higher will be processed.
   * Example: LogLevel.Info, LogLevel.Error, etc.
   */
  level: LogLevel;

  /**
   * If true, logs will be sent to the server endpoint (see logEndpoint).
   * If false, logs are only written to the browser console.
   */
  logToServer: boolean;

  /**
   * The URL endpoint where logs should be sent if logToServer is enabled.
   * If omitted or falsy, logs are not sent to the server even if logToServer is true.
   * Example: '/api/logs'
   */
  logEndpoint?: string;
}
