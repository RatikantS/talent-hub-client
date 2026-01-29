/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
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
 * HTTP interceptor that provides centralized error handling for all HTTP requests.
 *
 * This interceptor catches HTTP errors, logs them using `LoggerService`, and publishes
 * error events via `EventBusService` for global error handling, notifications, or UI feedback.
 * It enables consistent error handling across all micro-frontends without duplicating code.
 *
 * @remarks
 * **Behavior:**
 * - Catches all HTTP errors from `HttpClient` requests.
 * - Logs errors with detailed context using `LoggerService`.
 * - Publishes error events via `EventBusService` for application-wide handling.
 * - Re-throws errors so they can be handled by calling code if needed.
 *
 * **Event Keys:**
 * | Event Key | Trigger | Payload |
 * |-----------|---------|---------|
 * | `th:http.error` | `HttpErrorResponse` | `{ status, message, error, url, method, requestUrl }` |
 * | `th:http.unknown.error` | Non-HTTP errors | `{ error }` |
 *
 * **Error Types Handled:**
 * - `HttpErrorResponse` - Server errors (4xx, 5xx), network errors, timeout.
 * - Unknown errors - Unexpected JavaScript errors during request processing.
 *
 * **Integration:**
 * Subscribe to error events in a global error handler or notification service:
 * ```typescript
 * eventBus.on(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR).subscribe((meta) => {
 *   showErrorNotification(meta.data.message);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // In app.config.ts - Register the interceptor
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptorsFromDi()),
 *   ],
 * };
 *
 * // Errors are automatically logged and published
 * httpClient.get('/api/invalid-endpoint').subscribe({
 *   error: (err) => {
 *     // Error is already logged by interceptor
 *     // Event is already published to event bus
 *     console.log('Handle in component if needed');
 *   }
 * });
 *
 * // Subscribe to global error events
 * eventBus.on<HttpErrorPayload>(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR)
 *   .subscribe((meta) => {
 *     if (meta.data?.status === 401) {
 *       redirectToLogin();
 *     } else if (meta.data?.status === 500) {
 *       showServerErrorModal();
 *     }
 *   });
 * ```
 *
 * @see LoggerService
 * @see EventBusService
 * @see APP_CONSTANT
 * @see HttpInterceptor
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlingInterceptor implements HttpInterceptor {
  /**
   * The LoggerService instance for error logging.
   *
   * Injected from Angular's DI system to log error details for diagnostics and auditing.
   */
  private readonly logger = inject(LoggerService);

  /**
   * The EventBusService instance for publishing error events.
   *
   * Injected from Angular's DI system to broadcast error events across the application
   * for centralized handling.
   */
  private readonly eventBus = inject(EventBusService);

  /**
   * Intercepts HTTP requests and provides centralized error handling.
   *
   * This method is called for every HTTP request made through Angular's `HttpClient`.
   * It catches errors, logs them, publishes events, and re-throws for local handling.
   *
   * @param req - The outgoing HTTP request to intercept.
   * @param next - The next handler in the HTTP interceptor chain.
   * @returns An `Observable` of the HTTP event stream.
   *
   * @remarks
   * **Processing Logic:**
   * 1. Forward the request to the next handler.
   * 2. If an error occurs, determine if it's an `HttpErrorResponse` or unknown error.
   * 3. Log the error with appropriate context using `LoggerService`.
   * 4. Publish the error event via `EventBusService` with relevant details.
   * 5. Re-throw the error so calling code can handle it if needed.
   *
   * **Error Payload for `HttpErrorResponse`:**
   * ```typescript
   * {
   *   status: 404,
   *   message: 'Not Found',
   *   error: { ... },
   *   url: 'https://api.example.com/users/123',
   *   method: 'GET',
   *   requestUrl: '/users/123'
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Error handling happens automatically
   * // Console output: 'HTTP Error: { status: 404, message: "Not Found", ... }'
   * // Event published: 'th:http.error' with payload
   * ```
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          // Log HTTP errors with detailed context
          this.logger.error('HTTP Error:', {
            status: error.status,
            message: error.message,
            error: error.error,
          });

          // Publish error event for global handling (notifications, redirects, etc.)
          this.eventBus.publish(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR, {
            status: error.status,
            message: error.message,
            error: error.error,
            url: error.url,
            method: req.method,
            requestUrl: req.url,
          });
        } else {
          // Handle unexpected non-HTTP errors
          this.logger.error('Unknown HTTP Error:', error);

          // Publish unknown error event
          this.eventBus.publish(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_UNKNOWN_ERROR, { error });
        }

        // Re-throw the error so it can be handled by calling code if needed
        return throwError((): unknown => error);
      }),
    );
  }
}
