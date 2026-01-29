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
 * Type alias representing the allowed log severity levels for the application.
 *
 * This type provides a string literal union for type-safe log level selection
 * and filtering. It is used throughout the platform for client-side logging,
 * server-side log transport, and log configuration.
 *
 * @remarks
 * **Allowed Values (in order of decreasing severity):**
 * - `'fatal'` - Critical errors causing application shutdown or major failure.
 * - `'error'` - Error events that may still allow the application to continue.
 * - `'warn'` - Potentially harmful situations or recoverable issues.
 * - `'info'` - Informational messages highlighting application progress.
 * - `'debug'` - Fine-grained information useful for debugging.
 * - `'trace'` - Most detailed information for tracing program execution.
 *
 * **Severity Order:**
 * ```
 * fatal > error > warn > info > debug > trace
 * ```
 * When filtering logs, only messages at or above the configured level are shown.
 *
 * **Relationship to LogLevel Enum:**
 * This type mirrors the `LogLevel` enum values as string literals.
 * Use the `LogLevel` enum for code clarity and `LogLevelType` for serialization
 * or external API compatibility.
 *
 * **Usage:**
 * Use this type for:
 * - Function parameters that accept log levels.
 * - Log configuration in API payloads.
 * - Type-safe log filtering logic.
 *
 * @example
 * ```typescript
 * // Type-safe log level variable
 * const level: LogLevelType = 'warn';
 *
 * // Function accepting log level parameter
 * function shouldLog(messageLevel: LogLevelType, configLevel: LogLevelType): boolean {
 *   const levels: LogLevelType[] = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];
 *   return levels.indexOf(messageLevel) <= levels.indexOf(configLevel);
 * }
 *
 * // Log filtering
 * if (shouldLog('error', level)) {
 *   console.error('This error will be logged');
 * }
 *
 * // Configuration object
 * const logConfig = {
 *   level: 'warn' as LogLevelType,
 *   logToServer: true,
 * };
 * ```
 *
 * @see LogLevel
 * @see LogConfig
 * @see LoggerService
 * @publicApi
 */
export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
