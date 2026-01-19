/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services';

/**
 * AuthInterceptor automatically adds a Bearer token to outgoing HTTP requests if available.
 *
 * - Injects AuthService using Angular's inject() function.
 * - Retrieves the authentication token from AuthService.
 * - If a token exists and the request does not already have an Authorization header,
 *   it clones the request and adds the Authorization header as 'Bearer {token}'.
 * - If no token is present or the Authorization header already exists, the request is forwarded unchanged.
 *
 * @example
 *   // If token = 'abc123' and no Authorization header exists:
 *   // Adds header: Authorization: Bearer abc123
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Returns the AuthService instance for authentication.
   * Overridable for testing.
   */
  protected getAuthService(): AuthService {
    return inject(AuthService);
  }

  /**
   * Intercepts HTTP requests and adds the Authorization header if a token is available.
   *
   * @param req - The outgoing HTTP request.
   * @param next - The next handler in the HTTP pipeline.
   * @returns An Observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Use the overridable method to get the AuthService instance.
    const authService: AuthService = this.getAuthService();
    // Retrieve the authentication token from the AuthService.
    const token: string | null = authService.getToken();

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
