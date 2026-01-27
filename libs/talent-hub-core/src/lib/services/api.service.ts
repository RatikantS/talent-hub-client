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
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpOptions } from '../interfaces';
import { AppUtil } from '../utils';

/**
 * ApiService - A centralized HTTP client wrapper for all micro-frontends (MFEs).
 *
 * This service provides a consistent, type-safe, and testable API for making HTTP requests
 * across the Talent Hub application. It wraps Angular's HttpClient and adds development-mode
 * safety features to prevent accidental mutations during local testing.
 *
 * @remarks
 * - All HTTP methods (GET, POST, PUT, PATCH, DELETE) are strongly typed using generics.
 * - Uses the shared `HttpOptions` interface for consistent request configuration.
 * - In development mode (`AppUtil.isDevMode()`), all mutating requests (POST, PUT, PATCH, DELETE)
 *   are automatically routed as GET requests to prevent accidental backend state changes.
 * - Designed to be extended with interceptors for authentication, error handling, and logging.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly api = inject(ApiService);
 *
 * // GET request
 * this.api.get<User[]>('/api/users').subscribe(users => console.log(users));
 *
 * // POST request with body
 * this.api.post<User>('/api/users', { name: 'John', email: 'john@example.com' })
 *   .subscribe(newUser => console.log('Created:', newUser));
 *
 * // GET with options (headers, params)
 * this.api.get<User>('/api/users/1', {
 *   headers: new HttpHeaders({ 'X-Custom-Header': 'value' }),
 *   params: new HttpParams().set('include', 'roles')
 * }).subscribe(user => console.log(user));
 * ```
 *
 * @see HttpOptions
 * @see HttpClient
 * @see AppUtil.isDevMode
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  /**
   * Angular HttpClient instance for making HTTP requests.
   * Injected via the `inject()` function for cleaner dependency injection.
   * @internal
   */
  private readonly http: HttpClient = inject(HttpClient);

  /**
   * Performs an HTTP GET request.
   *
   * Retrieves data from the specified URL. This method does not modify server state
   * and behaves the same in both development and production modes.
   *
   * @template T - The expected response type.
   * @param url - The endpoint URL to request.
   * @param options - Optional HTTP options (headers, params, responseType, etc.).
   * @returns An Observable that emits the response of type `T`.
   *
   * @example
   * ```typescript
   * // Simple GET request
   * this.api.get<User[]>('/api/users').subscribe(users => {
   *   console.log('Users:', users);
   * });
   *
   * // GET with query parameters
   * this.api.get<User[]>('/api/users', {
   *   params: new HttpParams().set('role', 'admin').set('active', 'true')
   * }).subscribe(admins => console.log('Admins:', admins));
   * ```
   */
  get<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(url, options);
  }

  /**
   * Performs an HTTP POST request.
   *
   * Creates a new resource on the server. In development mode (`AppUtil.isDevMode()`),
   * this method is routed as a GET request to prevent accidental data creation.
   *
   * @template T - The expected response type.
   * @param url - The endpoint URL to request.
   * @param body - The request payload to send.
   * @param options - Optional HTTP options (headers, params, responseType, etc.).
   * @returns An Observable that emits the response of type `T`.
   *
   * @example
   * ```typescript
   * // Create a new user
   * const newUser = { firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
   * this.api.post<User>('/api/users', newUser).subscribe(created => {
   *   console.log('Created user:', created.id);
   * });
   *
   * // POST with custom headers
   * this.api.post<void>('/api/notifications', { message: 'Hello' }, {
   *   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   * }).subscribe();
   * ```
   */
  post<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat POST as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.post<T>(url, body, options);
  }

  /**
   * Performs an HTTP PUT request.
   *
   * Replaces an existing resource on the server. In development mode (`AppUtil.isDevMode()`),
   * this method is routed as a GET request to prevent accidental data modification.
   *
   * @template T - The expected response type.
   * @param url - The endpoint URL to request.
   * @param body - The request payload to send (full resource replacement).
   * @param options - Optional HTTP options (headers, params, responseType, etc.).
   * @returns An Observable that emits the response of type `T`.
   *
   * @example
   * ```typescript
   * // Update a user (full replacement)
   * const updatedUser = { id: '123', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' };
   * this.api.put<User>('/api/users/123', updatedUser).subscribe(user => {
   *   console.log('Updated user:', user);
   * });
   * ```
   */
  put<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat PUT as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.put<T>(url, body, options);
  }

  /**
   * Performs an HTTP PATCH request.
   *
   * Partially updates an existing resource on the server. In development mode (`AppUtil.isDevMode()`),
   * this method is routed as a GET request to prevent accidental data modification.
   *
   * @template T - The expected response type.
   * @param url - The endpoint URL to request.
   * @param body - The request payload containing partial updates.
   * @param options - Optional HTTP options (headers, params, responseType, etc.).
   * @returns An Observable that emits the response of type `T`.
   *
   * @example
   * ```typescript
   * // Partially update a user (only change email)
   * this.api.patch<User>('/api/users/123', { email: 'newemail@example.com' })
   *   .subscribe(user => console.log('Patched user:', user));
   * ```
   */
  patch<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat PATCH as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.patch<T>(url, body, options);
  }

  /**
   * Performs an HTTP DELETE request.
   *
   * Removes a resource from the server. In development mode (`AppUtil.isDevMode()`),
   * this method is routed as a GET request to prevent accidental data deletion.
   *
   * @template T - The expected response type.
   * @param url - The endpoint URL to request.
   * @param options - Optional HTTP options (headers, params, responseType, etc.).
   * @returns An Observable that emits the response of type `T`.
   *
   * @example
   * ```typescript
   * // Delete a user
   * this.api.delete<void>('/api/users/123').subscribe(() => {
   *   console.log('User deleted');
   * });
   *
   * // Delete with confirmation response
   * this.api.delete<{ success: boolean }>('/api/users/123').subscribe(result => {
   *   if (result.success) {
   *     console.log('Deletion confirmed');
   *   }
   * });
   * ```
   */
  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    if (AppUtil.isDevMode()) {
      // In dev mode, treat DELETE as GET to avoid mutating backend state.
      return this.http.get<T>(url, options);
    }
    return this.http.delete<T>(url, options);
  }
}
