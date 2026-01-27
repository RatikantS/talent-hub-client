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
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingIndicatorService } from '../services';

/**
 * HTTP interceptor that automatically manages a global loading indicator during HTTP requests.
 *
 * This interceptor shows a loading indicator when an HTTP request starts and hides it
 * when the request completes (success or error). It provides a seamless loading experience
 * across all HTTP operations without manual management in each component or service.
 *
 * @remarks
 * **Behavior:**
 * - Calls `LoadingIndicatorService.show()` before each HTTP request.
 * - Calls `LoadingIndicatorService.hide()` when the request completes or errors.
 * - Works for all HTTP methods (GET, POST, PUT, DELETE, etc.).
 * - Uses RxJS `finalize()` to ensure the loader is hidden even if errors occur.
 *
 * **Request Lifecycle:**
 * ```
 * Request Start → show() → Request Processing → Response/Error → hide()
 * ```
 *
 * **Concurrent Requests:**
 * The `LoadingIndicatorService` should handle concurrent requests appropriately.
 * Consider implementing a reference counter if multiple simultaneous requests
 * should keep the loader visible until all complete.
 *
 * **Accessibility:**
 * The loader UI component should meet WCAG AA requirements:
 * - Use `aria-busy="true"` on the loading region.
 * - Provide screen reader announcements for loading state changes.
 * - Ensure focus management doesn't trap users.
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
 * // Loading indicator is automatically managed for all HTTP requests
 * httpClient.get('/api/users').subscribe(users => {
 *   // Loader was shown during request, now hidden
 *   console.log(users);
 * });
 *
 * // In your app component template
 * // @if (loadingService.loading()) {
 * //   <app-spinner aria-label="Loading content" />
 * // }
 *
 * // Using the loading signal in a component
 * @Component({
 *   template: `
 *     <div [attr.aria-busy]="loadingService.loading()">
 *       <ng-content />
 *     </div>
 *   `
 * })
 * export class ContentComponent {
 *   protected readonly loadingService = inject(LoadingIndicatorService);
 * }
 * ```
 *
 * @see LoadingIndicatorService
 * @see HttpInterceptor
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class LoadingIndicatorInterceptor implements HttpInterceptor {
  /**
   * Returns the LoadingIndicatorService instance for loader control.
   *
   * The `LoadingIndicatorService` manages the global loading state via signals.
   * This method is protected to allow subclasses to override it for testing.
   *
   * @returns The `LoadingIndicatorService` instance.
   *
   * @remarks
   * Override this method in tests to provide a mock service:
   * ```typescript
   * class MockLoadingInterceptor extends LoadingIndicatorInterceptor {
   *   protected override getLoadingIndicatorService(): LoadingIndicatorService {
   *     return mockLoadingService;
   *   }
   * }
   * ```
   */
  protected getLoadingIndicatorService(): LoadingIndicatorService {
    return inject(LoadingIndicatorService);
  }

  /**
   * Intercepts HTTP requests to show/hide the global loading indicator.
   *
   * This method is called for every HTTP request made through Angular's `HttpClient`.
   * It shows the loader before the request and hides it when the request completes.
   *
   * @param req - The outgoing HTTP request to intercept.
   * @param next - The next handler in the HTTP interceptor chain.
   * @returns An `Observable` of the HTTP event stream.
   *
   * @remarks
   * **Processing Logic:**
   * 1. Call `show()` on the `LoadingIndicatorService` to display the loader.
   * 2. Forward the request to the next handler.
   * 3. Use `finalize()` to call `hide()` when the observable completes or errors.
   *
   * **Why `finalize()`?**
   * The `finalize()` operator ensures `hide()` is called regardless of whether
   * the request succeeds, fails, or is cancelled. This prevents the loader from
   * getting stuck in a visible state.
   *
   * @example
   * ```typescript
   * // This happens automatically for all HttpClient requests
   * // 1. Loader appears
   * // 2. Request is sent
   * // 3. Response received (or error occurs)
   * // 4. Loader disappears
   * ```
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const loadingIndicatorService: LoadingIndicatorService = this.getLoadingIndicatorService();

    // Show the loading indicator before the request starts
    loadingIndicatorService.show();

    // Forward the request and hide the loader when complete (success or error)
    return next.handle(req).pipe(finalize((): void => loadingIndicatorService.hide()));
  }
}
