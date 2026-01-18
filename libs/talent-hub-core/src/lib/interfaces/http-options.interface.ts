/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * HttpOptions - Type-safe interface for HTTP request options.
 *
 * This interface provides a consistent, type-safe way to specify HTTP headers and query parameters
 * for use in ApiService and all micro frontends (MFEs). It supports both Angular's HttpHeaders/HttpParams
 * and plain object representations for flexibility and compatibility.
 *
 * Usage example:
 *   apiService.get<T>('url', { headers: { Authorization: 'Bearer token' }, params: { page: 1 } });
 *
 * Notes:
 * - 'headers' can be an Angular HttpHeaders instance or a plain object. If both are provided, HttpHeaders takes precedence.
 * - 'params' can be an Angular HttpParams instance or a plain object. If both are provided, HttpParams takes precedence.
 * - All properties are optional; defaults are applied by the service if not provided.
 * - This interface is designed for compatibility with Angular's HttpClient and custom wrappers.
 */
export interface HttpOptions {
  /**
   * Custom HTTP headers for the request.
   * Can be an Angular HttpHeaders instance or a plain object.
   *
   * Example:
   *   headers: { 'Authorization': 'Bearer token' }
   *   headers: new HttpHeaders({ 'X-Custom': 'value' })
   */
  headers?: HttpHeaders | Record<string, string | string[]>;

  /**
   * Query parameters for the request.
   * Can be an Angular HttpParams instance or a plain object.
   *
   * Example:
   *   params: { page: 1, search: 'test' }
   *   params: new HttpParams().set('page', '1')
   */
  params?:
    | HttpParams
    | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
}
