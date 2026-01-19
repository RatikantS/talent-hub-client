/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
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
 */
interface CacheEntry {
  /** The cached response observable */
  response: Observable<HttpEvent<unknown>>;
  /** The timestamp (ms) when the response was cached */
  timestamp: number;
}

/**
 * CacheInterceptor - Caches GET requests to reduce network calls and improve performance.
 *
 * Only caches successful GET requests. Does not cache errors or non-GET requests.
 * Uses a simple in-memory Map for demonstration. Replace with a more robust solution for production.
 *
 * Usage:
 *   Provide this interceptor in your application's provider array.
 *
 * Best practices:
 * - Single responsibility: only caches GET requests.
 * - No side effects except caching.
 *
 * Cache-busting:
 * - To force a fresh request and bypass the cache, add the header 'x-refresh: true' to your GET request.
 * - The cache-busting header is removed before sending the request to the backend.
 *
 * Example (in a service or component):
 *   this.http.get('/api/data', { headers: new HttpHeaders({ 'x-refresh': 'true' }) });
 */
@Injectable({ providedIn: 'root' })
export class CacheInterceptor implements HttpInterceptor {
  /** In-memory cache for GET requests with expiration */
  private readonly cache: Map<string, CacheEntry> = new Map<string, CacheEntry>();
  /** Cache duration in milliseconds (default: 5 minutes) */
  private readonly cacheDurationMs: number = 5 * 60 * 1000;

  /**
   * Intercepts HTTP requests and caches successful GET responses.
   *
   * - Only caches GET requests.
   * - Skips cache if 'x-refresh: true' header is present (cache-busting).
   * - Removes expired cache entries.
   * - Stores new responses in cache.
   *
   * @param req - The outgoing HTTP request.
   * @param next - The next handler in the HTTP pipeline.
   * @returns Observable of the HTTP event stream.
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
      shareReplay(1),
    );

    // Store the observable in cache immediately to prevent duplicate requests
    this.cache.set(cacheKey, { response: request$, timestamp: now });
    return request$;
  }
}
