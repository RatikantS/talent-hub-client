/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../tokens';

/**
 * ApiPrefixInterceptor automatically prefixes all relative HTTP request URLs with the API base URL.
 *
 * - Skips requests that already have an absolute URL (http://, https://, or protocol-relative //).
 * - Ensures no double slashes between base URL and request path.
 * - Uses Angular's inject() for base URL token resolution.
 *
 * Example:
 *   baseUrl: 'https://api.example.com/'
 *   req.url: '/users' => 'https://api.example.com/users'
 *   req.url: 'users'  => 'https://api.example.com/users'
 *   req.url: 'http://external.com' => 'http://external.com' (unchanged)
 */
@Injectable({ providedIn: 'root' })
export class ApiPrefixInterceptor implements HttpInterceptor {
  /**
   * Returns the base URL for all API requests, injected from the application token.
   * Overridable for testing.
   */
  protected getBaseUrl(): string {
    return inject(API_BASE_URL);
  }

  /**
   * Intercepts HTTP requests and prefixes relative URLs with the API base URL.
   *
   * @param req - The outgoing HTTP request.
   * @param next - The next handler in the HTTP pipeline.
   * @returns An Observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const baseUrl = this.getBaseUrl();
    // If the URL is already absolute (http, https, or protocol-relative), do not prefix.
    if (/^(https?:)?\/\//.test(req.url)) {
      return next.handle(req);
    }
    // Remove trailing slash from baseUrl and leading slash from req.url to avoid double slashes.
    const url: string = baseUrl.replace(/\/$/, '') + '/' + req.url.replace(/^\//, '');
    // Clone the request with the new URL.
    const apiReq: HttpRequest<unknown> = req.clone({ url });
    return next.handle(apiReq);
  }
}
