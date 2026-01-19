/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EventBusService, LoggerService } from '../services';
import { APP_CONSTANT } from '../constants';

/**
 * ErrorHandlingInterceptor
 *
 * This HTTP interceptor logs all HTTP errors and publishes them as events via the EventBusService.
 *
 * - Logs errors using LoggerService for diagnostics and audit.
 * - Publishes error details to the event bus for global error handling, notifications, or UI feedback.
 * - Uses event keys from APP_CONSTANT.EVENT_BUS_KEYS for consistency and maintainability.
 *
 * Usage:
 *   Provided in root; automatically intercepts all HTTP requests in the app.
 *
 * Event keys:
 *   - th:http.error: Published for all HttpErrorResponse errors, with details (status, message, error, url, method, requestUrl).
 *   - th:http.unknown.error: Published for unknown errors, with the error object.
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlingInterceptor implements HttpInterceptor {
  /**
   * Returns the LoggerService instance for error logging.
   * Overridable for testing.
   */
  protected getLogger(): LoggerService {
    return inject(LoggerService);
  }
  /**
   * Returns the EventBusService instance for publishing error events.
   * Overridable for testing.
   */
  protected getEventBus(): EventBusService {
    return inject(EventBusService);
  }

  /**
   * Intercepts HTTP requests and handles errors.
   *
   * - Logs HTTP errors using LoggerService.
   * - Publishes error events using EventBusService.
   *
   * @param req - The outgoing HTTP request.
   * @param next - The next handler in the HTTP pipeline.
   * @returns Observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const logger: LoggerService = this.getLogger();
    const eventBus: EventBusService = this.getEventBus();
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        // Log the error using LoggerService
        if (error instanceof HttpErrorResponse) {
          logger.error('HTTP Error:', {
            status: error.status,
            message: error.message,
            error: error.error,
          });
          // Publish the error event for global error handling
          eventBus.publish(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR, {
            status: error.status,
            message: error.message,
            error: error.error,
            url: error.url,
            method: req.method,
            requestUrl: req.url,
          });
        } else {
          // Handle non-HTTP errors
          logger.error('Unknown HTTP Error:', error);
          // Publish unknown error event
          eventBus.publish(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_UNKNOWN_ERROR, { error });
        }
        // Rethrow the error so it can be handled elsewhere if needed
        return throwError((): unknown => error);
      }),
    );
  }
}
