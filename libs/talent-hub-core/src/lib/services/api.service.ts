/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpOptions } from '../interfaces';
import { AppUtil } from '../utils';

/**
 * ApiService
 *
 * A wrapper around Angular's HttpClient for making HTTP requests in all MFEs.
 * Provides a consistent, type-safe, and testable API for GET, POST, PUT, PATCH, DELETE.
 *
 * - Uses the shared HttpOptions interface for all requests (headers, params, observe, responseType, etc.).
 * - In development mode (AppUtil.isDevMode()), all non-GET requests are routed as GET for safe local testing.
 * - Designed for extension (e.g., interceptors, error handling, auth).
 *
 * Usage:
 *   const api = inject(ApiService);
 *   api.get<T>('url').subscribe(...);
 *
 * @see HttpOptions for supported request options.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  /**
   * Angular HttpClient instance for making HTTP requests.
   */
  private readonly http: HttpClient = inject(HttpClient);

  /**
   * Performs a GET request.
   * @template T The expected response type.
   * @param url The endpoint URL.
   * @param options Optional HttpOptions (headers, params, etc.).
   * @returns Observable of type T.
   */
  get<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(url, options);
  }

  /**
   * Performs a POST request. In dev mode (AppUtil.isDevMode()), routes as GET for safe testing.
   * @template T The expected response type.
   * @param url The endpoint URL.
   * @param body The request payload.
   * @param options Optional HttpOptions (headers, params, etc.).
   * @returns Observable of type T.
   */
  post<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat POST as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.post<T>(url, body, options);
  }

  /**
   * Performs a PUT request. In dev mode (AppUtil.isDevMode()), routes as GET for safe testing.
   * @template T The expected response type.
   * @param url The endpoint URL.
   * @param body The request payload.
   * @param options Optional HttpOptions (headers, params, etc.).
   * @returns Observable of type T.
   */
  put<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat PUT as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.put<T>(url, body, options);
  }

  /**
   * Performs a PATCH request. In dev mode (AppUtil.isDevMode()), routes as GET for safe testing.
   * @template T The expected response type.
   * @param url The endpoint URL.
   * @param body The request payload.
   * @param options Optional HttpOptions (headers, params, etc.).
   * @returns Observable of type T.
   */
  patch<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat PATCH as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.patch<T>(url, body, options);
  }

  /**
   * Performs a DELETE request. In dev mode (AppUtil.isDevMode()), routes as GET for safe testing.
   * @template T The expected response type.
   * @param url The endpoint URL.
   * @param options Optional HttpOptions (headers, params, etc.).
   * @returns Observable of type T.
   */
  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat DELETE as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.delete<T>(url, options);
  }
}
