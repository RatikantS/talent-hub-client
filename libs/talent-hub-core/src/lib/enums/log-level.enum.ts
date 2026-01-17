/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * Enum representing the log levels for the Talent Hub application.
 *
 * Use this enum to control the verbosity of client-side logging and to filter
 * logs based on severity. These levels are commonly used in enterprise and
 * production-grade applications for diagnostics and monitoring.
 */
export enum LogLevel {
  Fatal = 'fatal', // Critical error causing application shutdown or major failure
  Error = 'error', // Error events that might still allow the application to continue running
  Warn = 'warn', // Potentially harmful situations or recoverable issues
  Info = 'info', // Informational messages that highlight the progress of the application
  Debug = 'debug', // Fine-grained informational events useful for debugging
  Trace = 'trace', // Most detailed information, typically for tracing program execution
}
