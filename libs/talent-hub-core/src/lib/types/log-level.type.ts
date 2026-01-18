/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * LogLevel - Represents the allowed log severity levels for application logging.
 *
 * This type is used throughout the platform to distinguish between different log severities
 * for both client-side and server-side logging. It enables type-safe log filtering, display,
 * and transport.
 *
 * Usage example:
 *   const level: LogLevel = 'warn';
 *   if (level === 'error' || level === 'fatal') { ... }
 *
 * Notes:
 * - Only the six literal values are allowed: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'.
 * - Use this type for log filtering, logConfig, and log transport.
 * - The order (fatal > error > warn > info > debug > trace) reflects decreasing severity.
 */
export type LogLevelType = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
