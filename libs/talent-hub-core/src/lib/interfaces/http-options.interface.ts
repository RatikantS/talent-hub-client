/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * Type-safe interface for HTTP request options.
 *
 * This interface provides a consistent, type-safe way to specify HTTP headers
 * and query parameters for use in `ApiService` and all micro-frontends (MFEs).
 * It supports both Angular's `HttpHeaders`/`HttpParams` and plain object
 * representations for flexibility and compatibility.
 *
 * @remarks
 * **Properties:**
 * - `headers` - Custom HTTP headers for the request.
 * - `params` - Query parameters for the request.
 *
 * **Flexibility:**
 * - Both properties accept Angular's typed classes (`HttpHeaders`, `HttpParams`)
 *   or plain JavaScript objects for convenience.
 * - If both are provided, Angular's typed classes take precedence.
 * - All properties are optional; defaults are applied by the service if not provided.
 *
 * **Compatibility:**
 * - Designed for compatibility with Angular's `HttpClient` and custom wrappers.
 * - Supports string, number, boolean, and array values for query parameters.
 *
 * @example
 * ```typescript
 * // Using plain objects (most common)
 * apiService.get<User[]>('/api/users', {
 *   headers: { Authorization: 'Bearer token123' },
 *   params: { page: 1, pageSize: 20, active: true },
 * });
 *
 * // Using Angular's HttpHeaders and HttpParams
 * const headers = new HttpHeaders().set('X-Custom-Header', 'value');
 * const params = new HttpParams().set('search', 'john');
 * apiService.get<User[]>('/api/users', { headers, params });
 *
 * // Mixed usage
 * apiService.post<User>('/api/users', userData, {
 *   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 *   params: { notify: true },
 * });
 *
 * // No options (uses defaults)
 * apiService.get<Config>('/api/config');
 * ```
 *
 * @see ApiService
 * @see https://angular.io/api/common/http/HttpHeaders
 * @see https://angular.io/api/common/http/HttpParams
 * @publicApi
 */
export interface HttpOptions {
  /**
   * Custom HTTP headers for the request.
   *
   * Can be an Angular `HttpHeaders` instance or a plain object where keys are
   * header names and values are header values (string or array of strings).
   *
   * @remarks
   * Common headers include:
   * - `Authorization` - Bearer tokens for authentication.
   * - `Content-Type` - Request body format (usually set automatically).
   * - `Accept` - Expected response format.
   * - `X-*` - Custom application-specific headers.
   *
   * @example
   * ```typescript
   * // Plain object
   * { headers: { 'Authorization': 'Bearer token123' } }
   *
   * // Multiple values for a header
   * { headers: { 'Accept': ['application/json', 'text/plain'] } }
   *
   * // Using HttpHeaders
   * { headers: new HttpHeaders({ 'X-Custom': 'value' }) }
   *
   * // Adding multiple headers
   * {
   *   headers: {
   *     'Authorization': 'Bearer token',
   *     'X-Request-ID': 'req-123',
   *     'Accept-Language': 'en-US',
   *   }
   * }
   * ```
   */
  headers?: HttpHeaders | Record<string, string | string[]>;

  /**
   * Query parameters for the request.
   *
   * Can be an Angular `HttpParams` instance or a plain object where keys are
   * parameter names and values are parameter values. Supports string, number,
   * boolean, and arrays of these types.
   *
   * @remarks
   * - Parameters are appended to the URL as query string (e.g., `?page=1&size=20`).
   * - Array values are serialized as multiple parameters with the same key.
   * - `null` and `undefined` values are typically ignored.
   *
   * @example
   * ```typescript
   * // Plain object with various types
   * {
   *   params: {
   *     page: 1,
   *     pageSize: 20,
   *     active: true,
   *     search: 'john',
   *   }
   * }
   * // Results in: ?page=1&pageSize=20&active=true&search=john
   *
   * // Array values
   * { params: { status: ['pending', 'approved'] } }
   * // Results in: ?status=pending&status=approved
   *
   * // Using HttpParams
   * {
   *   params: new HttpParams()
   *     .set('page', '1')
   *     .set('sort', 'name')
   *     .set('order', 'asc')
   * }
   * ```
   */
  params?:
    | HttpParams
    | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
}
