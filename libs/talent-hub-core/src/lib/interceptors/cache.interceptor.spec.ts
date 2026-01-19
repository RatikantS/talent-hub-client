/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, Subject } from 'rxjs';

import { CacheInterceptor } from '../interceptors';

class MockHandler {
  handle = vi.fn();
}

describe('CacheInterceptor', () => {
  let interceptor: CacheInterceptor;
  let handler: MockHandler;
  const response = new HttpResponse({ body: { data: 'test' } });
  const url = '/api/data';

  beforeEach(() => {
    interceptor = new CacheInterceptor();
    handler = new MockHandler();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should cache successful GET requests', async () => {
    handler.handle.mockReturnValueOnce(of(response));
    const req = new HttpRequest('GET', url);
    // First call: goes to network
    const res1 = await interceptor.intercept(req, handler as any).toPromise();
    expect(res1).toEqual(response);
    expect(handler.handle).toHaveBeenCalledTimes(1);
    // Second call: served from cache
    const res2 = await interceptor.intercept(req, handler as any).toPromise();
    expect(res2).toEqual(response);
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it('should bypass cache for non-GET requests', async () => {
    handler.handle.mockReturnValue(of(response));
    const req = new HttpRequest('POST' as any, url);
    await interceptor.intercept(req, handler as any).toPromise();
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it('should bypass cache if x-refresh header is set', async () => {
    handler.handle.mockReturnValue(of(response));
    const req = new HttpRequest('GET', url, { headers: reqHeaders({ 'x-refresh': 'true' }) });
    await interceptor.intercept(req, handler as any).toPromise();
    expect(handler.handle).toHaveBeenCalledTimes(1);
    // Second call with x-refresh: true should also go to network
    await interceptor.intercept(req, handler as any).toPromise();
    expect(handler.handle).toHaveBeenCalledTimes(2);
  });

  it('should expire cache after duration', async () => {
    handler.handle.mockReturnValue(of(response));
    const req = new HttpRequest('GET', url);
    await interceptor.intercept(req, handler as any).toPromise();
    expect(handler.handle).toHaveBeenCalledTimes(1);
    // Advance time past cache duration
    vi.setSystemTime(Date.now() + 6 * 60 * 1000);
    await interceptor.intercept(req, handler as any).toPromise();
    expect(handler.handle).toHaveBeenCalledTimes(2);
  });

  it('should prevent duplicate network requests for the same GET URL', async () => {
    const subject = new Subject<HttpEvent<unknown>>();
    handler.handle.mockReturnValue(subject.asObservable());
    const req = new HttpRequest('GET', url);
    // Start two requests before the first completes
    const p1 = interceptor.intercept(req, handler as any).toPromise();
    const p2 = interceptor.intercept(req, handler as any).toPromise();
    expect(handler.handle).toHaveBeenCalledTimes(1);
    subject.next(response);
    subject.complete();
    expect(await p1).toEqual(response);
    expect(await p2).toEqual(response);
  });
});

// Helper to create HttpHeaders for test requests
function reqHeaders(headers: Record<string, string>) {
  return {
    get: (name: string) => headers[name.toLowerCase()] ?? null,
    has: (name: string) => name.toLowerCase() in headers,
    keys: () => Object.keys(headers),
    forEach: (cb: any) => Object.entries(headers).forEach(([k, v]) => cb(v, k)),
    append: () => {
      throw new Error('not implemented');
    },
    set: () => {
      throw new Error('not implemented');
    },
    delete: (name: string) =>
      reqHeaders(
        Object.fromEntries(Object.entries(headers).filter(([k]) => k !== name.toLowerCase())),
      ),
  };
}
