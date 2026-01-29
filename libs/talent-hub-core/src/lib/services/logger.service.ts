/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { computed, inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppStore } from '../store';
import { LogLevel } from '../types';
import { AppUtil } from '../utils';

/**
 * LoggerService - Provides structured logging for browser console and server-side persistence.
 *
 * This service offers a unified logging API with multiple log levels (info, warn, error,
 * debug, trace, fatal). Logs are written to the browser console and optionally sent to
 * a backend server for centralized logging and monitoring.
 *
 * @remarks
 * - Supports six log levels via the `LogLevel` type: Info, Warn, Error, Debug, Trace, Fatal.
 * - Console output uses the appropriate `console.*` method for each log level.
 * - Server-side logging is only enabled in production mode (`!AppUtil.isDevMode()`).
 * - The log endpoint is dynamically read from `AppStore.config.logConfig.logEndpoint`.
 * - Server logging is fire-and-forget; failures do not affect application flow.
 * - Designed for extension with features like log batching, user context, session tracking.
 * - Uses strict typing throughout; avoids `any` type.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly logger = inject(LoggerService);
 *
 * // Log at various levels
 * this.logger.info('User logged in', { userId: '123', timestamp: Date.now() });
 * this.logger.warn('Deprecated API used', { endpoint: '/api/v1/users' });
 * this.logger.error('Failed to load data', { error: err.message, stack: err.stack });
 * this.logger.debug('Component initialized', { componentName: 'Dashboard' });
 *
 * // Log with structured metadata
 * this.logger.info('Order placed', {
 *   orderId: 'ORD-456',
 *   amount: 99.99,
 *   items: 3
 * });
 *
 * // Log fatal errors (application-breaking issues)
 * this.logger.fatal('Database connection lost', { retryAttempts: 3 });
 * ```
 *
 * @see LogLevel
 * @see AppStore
 * @see AppUtil.isDevMode
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  /**
   * Angular HttpClient for sending logs to the backend server.
   * Used only in production mode when a log endpoint is configured.
   * @internal
   */
  private readonly http: HttpClient = inject(HttpClient);

  /**
   * Reference to the global AppStore (NgRx Signal Store).
   * Used to access the current log configuration (`logConfig`).
   * @internal
   */
  private readonly appStore = inject(AppStore);

  /**
   * Computed signal for the log endpoint URL from the app store configuration.
   *
   * Returns the `logEndpoint` string if configured in `AppStore.config.logConfig`,
   * otherwise `undefined`. This ensures the logger dynamically reads the latest
   * endpoint from global state.
   * @internal
   */
  private readonly logEndpoint: Signal<string | undefined> = computed(
    () => this.appStore.getConfig()?.logConfig?.logEndpoint,
  );

  /**
   * Logs a message at the specified log level.
   *
   * This is the core logging method used by all convenience methods (`info`, `warn`, etc.).
   * It performs two operations:
   * 1. Logs to the browser console using the appropriate `console.*` method.
   * 2. Optionally sends the log to a backend server (production mode only).
   *
   * @param level - The log level from the `LogLevel` type (Info, Warn, Error, Debug, Trace, Fatal).
   * @param message - The log message string describing the event.
   * @param meta - Optional metadata to include with the log (object, error, context, etc.).
   *
   * @remarks
   * - Console methods are mapped as follows:
   *   - `Info` → `console.info()`
   *   - `Warn` → `console.warn()`
   *   - `Error`, `Fatal` → `console.error()`
   *   - `Debug` → `console.debug()`
   *   - `Trace` → `console.trace()`
   * - Server logging is fire-and-forget; subscription errors are silently ignored.
   * - Server logging is disabled in development mode to avoid polluting logs.
   *
   * @example
   * ```typescript
   * // Direct usage with LogLevel type
   * this.logger.log('info', 'Application started', { version: '1.0.0' });
   * this.logger.log('error', 'Unhandled exception', { error: err });
   * ```
   */
  log(level: LogLevel, message: string, meta?: unknown): void {
    // Log to browser console using the appropriate method for the level
    switch (level) {
      case 'info':
        console.info(message, meta);
        break;
      case 'warn':
        console.warn(message, meta);
        break;
      case 'error':
      case 'fatal':
        console.error(message, meta);
        break;
      case 'debug':
        console.debug(message, meta);
        break;
      case 'trace':
        console.trace(message, meta);
        break;
    }

    // Send to server in production mode if logEndpoint is configured
    const endpoint = this.logEndpoint();
    if (!AppUtil.isDevMode() && endpoint) {
      // Fire-and-forget: errors in logging should not affect app flow
      this.http.post(endpoint, { level, message, meta }).subscribe({});
    }
  }

  /**
   * Logs an informational message.
   *
   * Use for general application events, user actions, and operational information.
   *
   * @param message - The log message describing the event.
   * @param meta - Optional metadata to include with the log.
   *
   * @example
   * ```typescript
   * this.logger.info('User signed in', { userId: '123', method: 'SSO' });
   * this.logger.info('Feature flag enabled', { flag: 'newDashboard' });
   * ```
   */
  info(message: string, meta?: unknown): void {
    this.log('info', message, meta);
  }

  /**
   * Logs a warning message.
   *
   * Use for potentially harmful situations, deprecated API usage, or recoverable issues.
   *
   * @param message - The warning message describing the issue.
   * @param meta - Optional metadata to include with the log.
   *
   * @example
   * ```typescript
   * this.logger.warn('API rate limit approaching', { remaining: 10, limit: 100 });
   * this.logger.warn('Using deprecated method', { method: 'oldFetch', replacement: 'newFetch' });
   * ```
   */
  warn(message: string, meta?: unknown): void {
    this.log('warn', message, meta);
  }

  /**
   * Logs an error message.
   *
   * Use for error conditions that the application can recover from but should be investigated.
   *
   * @param message - The error message describing what went wrong.
   * @param meta - Optional metadata such as error objects, stack traces, or context.
   *
   * @example
   * ```typescript
   * this.logger.error('Failed to save user preferences', { userId: '123', error: err.message });
   * this.logger.error('API request failed', { url: '/api/data', status: 500 });
   * ```
   */
  error(message: string, meta?: unknown): void {
    this.log('error', message, meta);
  }

  /**
   * Logs a fatal error message.
   *
   * Use for critical failures that may require immediate attention or cause application shutdown.
   *
   * @param message - The fatal error message describing the critical issue.
   * @param meta - Optional metadata such as error objects, stack traces, or recovery attempts.
   *
   * @example
   * ```typescript
   * this.logger.fatal('Database connection lost', { host: 'db.example.com', retries: 3 });
   * this.logger.fatal('Critical configuration missing', { configKey: 'API_URL' });
   * ```
   */
  fatal(message: string, meta?: unknown): void {
    this.log('fatal', message, meta);
  }

  /**
   * Logs a debug message.
   *
   * Use for detailed diagnostic information useful during development and debugging.
   * Debug logs are typically filtered out in production log aggregators.
   *
   * @param message - The debug message with diagnostic details.
   * @param meta - Optional metadata for debugging context.
   *
   * @example
   * ```typescript
   * this.logger.debug('Component state updated', { prevState, nextState });
   * this.logger.debug('Cache hit', { key: 'user:123', ttl: 300 });
   * ```
   */
  debug(message: string, meta?: unknown): void {
    this.log('debug', message, meta);
  }

  /**
   * Logs a trace message with stack trace.
   *
   * Use for extremely detailed logs that include the call stack. Helpful for tracing
   * execution flow and debugging complex issues.
   *
   * @param message - The trace message.
   * @param meta - Optional metadata for tracing context.
   *
   * @remarks
   * Uses `console.trace()` which includes a full stack trace in the console output.
   *
   * @example
   * ```typescript
   * this.logger.trace('Entering method', { method: 'processOrder', orderId: '456' });
   * this.logger.trace('Event handler called', { event: 'click', target: 'submitBtn' });
   * ```
   */
  trace(message: string, meta?: unknown): void {
    this.log('trace', message, meta);
  }
}
