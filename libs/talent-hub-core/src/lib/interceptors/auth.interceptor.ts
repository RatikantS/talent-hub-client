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

import { AuthService } from '../services';

/**
 * HTTP interceptor that automatically adds Bearer authentication tokens to outgoing requests.
 *
 * This interceptor ensures that authenticated API requests include the `Authorization` header
 * with a Bearer token. It retrieves the token from `AuthService` and intelligently skips
 * requests that already have an `Authorization` header or when no token is available.
 *
 * @remarks
 * **Behavior:**
 * - Retrieves the authentication token from `AuthService.getToken()`.
 * - Adds `Authorization: Bearer {token}` header to requests if a token exists.
 * - Skips adding the header if the request already has an `Authorization` header.
 * - Passes requests through unchanged if no token is available.
 *
 * **Security Considerations:**
 * - Tokens are only added to requests; they are not logged or exposed.
 * - Consider combining with HTTPS to protect tokens in transit.
 * - For sensitive operations, verify token validity before making requests.
 *
 * **Request Transformation:**
 * | Scenario | Result |
 * |----------|--------|
 * | Token exists, no Auth header | Adds `Authorization: Bearer {token}` |
 * | Token exists, Auth header present | Request unchanged (respects existing header) |
 * | No token available | Request unchanged |
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
 * // All authenticated requests automatically include the token
 * httpClient.get('/api/users');
 * // Request headers: { Authorization: 'Bearer abc123...' }
 *
 * // Requests with existing Authorization headers are unchanged
 * httpClient.get('/api/external', {
 *   headers: { Authorization: 'Basic xyz' }
 * });
 * // Request headers: { Authorization: 'Basic xyz' } (unchanged)
 * ```
 *
 * @see AuthService
 * @see AuthStore
 * @see HttpInterceptor
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  /**
   * The AuthService instance for retrieving authentication tokens.
   *
   * Injected from Angular's DI system to provide the current user's
   * authentication token via `getToken()`.
   */
  private readonly authService = inject(AuthService);

  /**
   * Intercepts HTTP requests and adds the Authorization header if a token is available.
   *
   * This method is called for every HTTP request made through Angular's `HttpClient`.
   * It checks for an available authentication token and adds it to the request headers.
   *
   * @param req - The outgoing HTTP request to intercept.
   * @param next - The next handler in the HTTP interceptor chain.
   * @returns An `Observable` of the HTTP event stream.
   *
   * @remarks
   * **Processing Logic:**
   * 1. Retrieve the authentication token from `AuthService`.
   * 2. If no token exists, pass the request through unchanged.
   * 3. If the request already has an `Authorization` header, pass it through unchanged.
   * 4. Otherwise, clone the request and add `Authorization: Bearer {token}`.
   * 5. Forward the modified request to the next handler.
   *
   * @example
   * ```typescript
   * // This happens automatically for all HttpClient requests
   * // If user is authenticated with token 'abc123':
   * // Original request: GET /api/profile
   * // Modified request: GET /api/profile
   * //   Headers: { Authorization: 'Bearer abc123' }
   * ```
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Retrieve the authentication token from the AuthService.
    const token: string | null = this.authService.getToken();

    // If no token is present or the Authorization header already exists, forward the request unchanged.
    if (!token || req.headers.has('Authorization')) {
      return next.handle(req);
    }

    // Clone the request and add the Authorization header with the Bearer token.
    const authReq: HttpRequest<unknown> = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next.handle(authReq);
  }
}
