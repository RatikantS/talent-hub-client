/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { computed, inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppStore } from '../store';
import { LogLevel } from '../enums';
import { AppUtil } from '../utils';

/**
 * LoggerService - Provides UI logging for browser and server.
 *
 * This service supports multiple log levels (info, warn, error, debug, trace, fatal) and can log
 * to the browser console and/or send logs to a backend server for persistent storage.
 *
 * Usage:
 *   const logger = inject(LoggerService);
 *   logger.info('User logged in', { userId: 123 });
 *   logger.error('API failed', error);
 *
 * - Uses strict typing, no any.
 * - Extendable for batching, user/session context, etc.
 * - Only sends logs to server in production (configurable via AppStore logConfig).
 * - Reads log endpoint dynamically from global state (AppStore).
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  /**
   * Angular HttpClient for sending logs to the server.
   */
  private readonly http: HttpClient = inject(HttpClient);
  /**
   * Reference to the global AppStore (NgRx Signal Store).
   * Used to access the current log configuration (logConfig).
   */
  private readonly appStore: typeof AppStore = inject(AppStore);

  /**
   * Computed signal for the log endpoint URL from app store config.
   * Returns the logEndpoint string if set, otherwise undefined.
   * This ensures the logger always uses the latest endpoint from global state.
   */
  private readonly logEndpoint: Signal<string> = computed(
    (): string => this.appStore.getConfig()?.logConfig?.logEndpoint,
  );

  /**
   * Logs a message at the specified log level.
   *
   * This method logs to the browser console using the appropriate console method for the log level.
   * If the application is running in production mode (as determined by AppUtil.isDevMode()) and a log endpoint is configured
   * in the global AppStore, the log is also sent to the server via HTTP POST. This is fire-and-forget: errors in logging
   * should not affect application flow.
   *
   * @param level LogLevel enum value (e.g., Info, Warn, Error, Debug, Trace, Fatal)
   * @param message Log message string
   * @param meta Optional metadata (object, error, etc.)
   */
  log(level: LogLevel, message: string, meta?: unknown): void {
    // Log to browser console using the appropriate method for the level
    switch (level) {
      case LogLevel.Info:
        console.info(message, meta);
        break;
      case LogLevel.Warn:
        console.warn(message, meta);
        break;
      case LogLevel.Error:
      case LogLevel.Fatal:
        console.error(message, meta);
        break;
      case LogLevel.Debug:
        console.debug(message, meta);
        break;
      case LogLevel.Trace:
        console.trace(message, meta);
        break;
    }
    // Optionally send to server in production and if logEndpoint is defined
    const endpoint = this.logEndpoint();
    if (!AppUtil.isDevMode() && endpoint) {
      // Fire-and-forget: errors in logging should not affect app flow
      this.http.post(endpoint, { level, message, meta }).subscribe({});
    }
  }

  /**
   * Logs an info message (LogLevel.Info).
   *
   * @param message Log message
   * @param meta Optional metadata (object, error, etc.)
   */
  info(message: string, meta?: unknown): void {
    this.log(LogLevel.Info, message, meta);
  }

  /**
   * Logs a warning message (LogLevel.Warn).
   *
   * @param message Log message
   * @param meta Optional metadata (object, error, etc.)
   */
  warn(message: string, meta?: unknown): void {
    this.log(LogLevel.Warn, message, meta);
  }

  /**
   * Logs an error message (LogLevel.Error).
   *
   * @param message Log message
   * @param meta Optional metadata (object, error, etc.)
   */
  error(message: string, meta?: unknown): void {
    this.log(LogLevel.Error, message, meta);
  }

  /**
   * Logs a fatal error message (LogLevel.Fatal).
   *
   * @param message Log message
   * @param meta Optional metadata (object, error, etc.)
   */
  fatal(message: string, meta?: unknown): void {
    this.log(LogLevel.Fatal, message, meta);
  }

  /**
   * Logs a debug message (LogLevel.Debug).
   *
   * @param message Log message
   * @param meta Optional metadata (object, error, etc.)
   */
  debug(message: string, meta?: unknown): void {
    this.log(LogLevel.Debug, message, meta);
  }

  /**
   * Logs a trace message (LogLevel.Trace).
   *
   * @param message Log message
   * @param meta Optional metadata (object, error, etc.)
   */
  trace(message: string, meta?: unknown): void {
    this.log(LogLevel.Trace, message, meta);
  }
}
