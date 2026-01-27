/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

/**
 * Represents a single cache entry for a GET request.
 *
 * @internal
 */
interface CacheEntry {
  /**
   * The cached response observable.
   * Stored as an Observable to support request deduplication.
   */
  response: Observable<HttpEvent<unknown>>;

  /**
   * The timestamp (ms since epoch) when the response was cached.
   * Used for cache expiration checks.
   */
  timestamp: number;
}

/**
 * HTTP interceptor that caches GET requests to reduce network calls and improve performance.
 *
 * This interceptor implements a simple in-memory cache for HTTP GET requests. It stores
 * successful responses and serves them from cache for subsequent identical requests,
 * reducing server load and improving perceived performance.
 *
 * @remarks
 * **Behavior:**
 * - Only caches GET requests; other HTTP methods bypass the cache.
 * - Caches successful `HttpResponse` events only (not errors).
 * - Cache entries expire after 5 minutes (configurable via `cacheDurationMs`).
 * - Supports cache-busting via the `x-refresh: true` header.
 * - Uses `shareReplay(1)` to deduplicate concurrent identical requests.
 *
 * **Cache Key:**
 * The cache key is the full URL including query parameters (`req.urlWithParams`).
 *
 * **Cache-Busting:**
 * To force a fresh request and bypass the cache, add the header `x-refresh: true`:
 * ```typescript
 * httpClient.get('/api/data', {
 *   headers: new HttpHeaders({ 'x-refresh': 'true' })
 * });
 * ```
 * The `x-refresh` header is automatically removed before sending the request to the server.
 *
 * **Limitations:**
 * - Uses in-memory storage; cache is cleared on page reload.
 * - Not suitable for large responses or sensitive data.
 * - For production, consider using service workers or HTTP cache headers.
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
 * // First request - fetches from server and caches
 * httpClient.get('/api/users').subscribe(users => console.log(users));
 *
 * // Second request within 5 minutes - served from cache
 * httpClient.get('/api/users').subscribe(users => console.log(users));
 *
 * // Force refresh - bypasses cache
 * httpClient.get('/api/users', {
 *   headers: new HttpHeaders({ 'x-refresh': 'true' })
 * }).subscribe(users => console.log(users));
 * ```
 *
 * @see HttpInterceptor
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class CacheInterceptor implements HttpInterceptor {
  /**
   * In-memory cache storage for GET request responses.
   *
   * Maps request URLs (including query params) to their cached responses
   * and timestamps. Entries are automatically expired based on `cacheDurationMs`.
   *
   * @internal
   */
  private readonly cache: Map<string, CacheEntry> = new Map<string, CacheEntry>();

  /**
   * Cache duration in milliseconds.
   *
   * Cached responses older than this duration are considered stale and
   * will be refreshed on the next request. Default: 5 minutes (300,000 ms).
   *
   * @remarks
   * Adjust this value based on your data freshness requirements:
   * - Lower values for frequently changing data.
   * - Higher values for static or rarely changing data.
   */
  private readonly cacheDurationMs: number = 5 * 60 * 1000;

  /**
   * Intercepts HTTP requests and serves cached responses for GET requests.
   *
   * This method is called for every HTTP request made through Angular's `HttpClient`.
   * For GET requests, it checks the cache and returns cached responses when available
   * and not expired.
   *
   * @param req - The outgoing HTTP request to intercept.
   * @param next - The next handler in the HTTP interceptor chain.
   * @returns An `Observable` of the HTTP event stream.
   *
   * @remarks
   * **Processing Logic:**
   * 1. Non-GET requests bypass the cache entirely.
   * 2. Check for `x-refresh: true` header for cache-busting.
   * 3. If cached response exists and is not expired, return it immediately.
   * 4. If cached response is expired, delete it and fetch fresh data.
   * 5. For new requests, store the observable in cache immediately (deduplication).
   * 6. On successful response, update the cache with the actual response.
   *
   * @example
   * ```typescript
   * // Automatic caching for GET requests
   * httpClient.get('/api/config'); // Fetches and caches
   * httpClient.get('/api/config'); // Returns from cache
   *
   * // POST requests are not cached
   * httpClient.post('/api/users', data); // Always fetches
   * ```
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Check for cache-busting header
    const refresh: boolean = req.headers.get('x-refresh') === 'true';
    const cacheKey: string = req.urlWithParams;
    const cached: CacheEntry | undefined = this.cache.get(cacheKey);
    const now: number = Date.now();

    // Serve from cache if not refreshing and cache is valid
    if (!refresh && cached) {
      if (now - cached.timestamp < this.cacheDurationMs) {
        return cached.response;
      } else {
        // Cache expired, remove stale entry
        this.cache.delete(cacheKey);
      }
    }

    // Remove the cache-busting header before sending to backend
    const cleanReq = refresh ? req.clone({ headers: req.headers.delete('x-refresh') }) : req;

    // Make the network request and cache the response
    const request$ = next.handle(cleanReq).pipe(
      tap((event): void => {
        // Only cache successful HttpResponse events
        if (event instanceof HttpResponse) {
          this.cache.set(cacheKey, { response: of(event), timestamp: Date.now() });
        }
      }),
      // Share the observable to prevent duplicate requests
      shareReplay(1),
    );

    // Store the observable in cache immediately to prevent duplicate requests
    this.cache.set(cacheKey, { response: request$, timestamp: now });

    return request$;
  }
}
