/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../tokens';

/**
 * HTTP interceptor that automatically prefixes relative URLs with the API base URL.
 *
 * This interceptor ensures that all relative HTTP requests are routed to the correct
 * API server by prepending the configured base URL. It intelligently handles URL
 * formatting to prevent double slashes and skips requests that already have absolute URLs.
 *
 * @remarks
 * **Behavior:**
 * - Skips requests with absolute URLs (starting with `http://`, `https://`, or `//`).
 * - Normalizes URLs to prevent double slashes between base URL and path.
 * - Uses Angular's `inject()` function to resolve the `API_BASE_URL` token.
 *
 * **URL Transformation Examples:**
 * | Base URL | Request URL | Result |
 * |----------|-------------|--------|
 * | `https://api.example.com/` | `/users` | `https://api.example.com/users` |
 * | `https://api.example.com/` | `users` | `https://api.example.com/users` |
 * | `https://api.example.com` | `/users` | `https://api.example.com/users` |
 * | `https://api.example.com/` | `http://external.com` | `http://external.com` (unchanged) |
 *
 * **Registration:**
 * Register this interceptor in your application's `provideHttpClient` configuration:
 * ```typescript
 * provideHttpClient(
 *   withInterceptorsFromDi(),
 * )
 * ```
 *
 * Or use the functional interceptor approach:
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([apiPrefixInterceptorFn]),
 * )
 * ```
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     { provide: API_BASE_URL, useValue: 'https://api.talent-hub.com/v1' },
 *     provideHttpClient(withInterceptorsFromDi()),
 *   ],
 * };
 *
 * // API calls are automatically prefixed
 * httpClient.get('/users');
 * // Becomes: GET https://api.talent-hub.com/v1/users
 *
 * // External URLs are unchanged
 * httpClient.get('https://external-api.com/data');
 * // Remains: GET https://external-api.com/data
 * ```
 *
 * @see API_BASE_URL
 * @see HttpInterceptor
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class ApiPrefixInterceptor implements HttpInterceptor {
  /**
   * The base URL for all API requests.
   *
   * Injected from the `API_BASE_URL` token, which should be provided
   * in the application's root configuration.
   */
  private readonly baseUrl = inject(API_BASE_URL);

  /**
   * Intercepts HTTP requests and prefixes relative URLs with the API base URL.
   *
   * This method is called for every HTTP request made through Angular's `HttpClient`.
   * It checks if the request URL is relative, and if so, prepends the API base URL.
   *
   * @param req - The outgoing HTTP request to intercept.
   * @param next - The next handler in the HTTP interceptor chain.
   * @returns An `Observable` of the HTTP event stream.
   *
   * @remarks
   * **Processing Logic:**
   * 1. Check if the URL is already absolute (starts with `http://`, `https://`, or `//`).
   * 2. If absolute, pass the request through unchanged.
   * 3. If relative, construct the full URL by combining base URL and request path.
   * 4. Normalize slashes to prevent `//` in the middle of the URL.
   * 5. Clone the request with the new URL and pass it to the next handler.
   *
   * @example
   * ```typescript
   * // This happens automatically for all HttpClient requests
   * // Request: GET /api/users
   * // Intercepted URL: https://api.example.com/api/users
   *
   * // Request: GET https://external.com/data
   * // Intercepted URL: https://external.com/data (unchanged)
   * ```
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // If the URL is already absolute (http, https, or protocol-relative), do not prefix.
    if (/^(https?:)?\/\//.test(req.url)) {
      return next.handle(req);
    }

    // Remove trailing slash from baseUrl and leading slash from req.url to avoid double slashes.
    const url: string = this.baseUrl.replace(/\/$/, '') + '/' + req.url.replace(/^\//, '');

    // Clone the request with the new URL.
    const apiReq: HttpRequest<unknown> = req.clone({ url });

    return next.handle(apiReq);
  }
}
