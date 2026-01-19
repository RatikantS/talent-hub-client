/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingIndicatorService } from '../services';

/**
 * LoadingIndicatorInterceptor
 *
 * HTTP interceptor that automatically shows a global loading indicator when an HTTP request starts
 * and hides it when the request completes (success or error).
 *
 * - Uses LoadingIndicatorService to manage loader visibility.
 * - Calls show() before forwarding the request, and hide() in finalize() after completion.
 * - Works for all HTTP requests (GET, POST, etc.).
 *
 * Accessibility:
 *   The loader UI should meet WCAG AA and ARIA requirements (see LoadingIndicatorService docs).
 *
 * Usage:
 *   Provide this interceptor in your application's HTTP interceptor providers.
 *
 * Example:
 *   providers: [
 *     { provide: HTTP_INTERCEPTORS, useClass: LoadingIndicatorInterceptor, multi: true },
 *   ]
 */
@Injectable({ providedIn: 'root' })
export class LoadingIndicatorInterceptor implements HttpInterceptor {
  /**
   * Returns the LoadingIndicatorService instance for loader control.
   * Overridable for testing.
   */
  protected getLoadingIndicatorService(): LoadingIndicatorService {
    return inject(LoadingIndicatorService);
  }

  /**
   * Intercepts HTTP requests to show/hide the loader.
   *
   * - Shows the loader before forwarding the request.
   * - Hides the loader when the request completes (success or error).
   *
   * @param req - The outgoing HTTP request.
   * @param next - The next handler in the HTTP pipeline.
   * @returns Observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const loadingIndicatorService = this.getLoadingIndicatorService();
    loadingIndicatorService.show();
    return next.handle(req).pipe(finalize((): void => loadingIndicatorService.hide()));
  }
}
