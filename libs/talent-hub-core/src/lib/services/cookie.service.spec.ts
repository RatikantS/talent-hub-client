/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CookieService } from '../services';

describe('CookieService', () => {
  let service: CookieService;
  let cookieStr = '';

  beforeEach(() => {
    cookieStr = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieStr;
      },
      set cookie(val: string) {
        cookieStr = val;
      },
    });
    service = new CookieService();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create an instance', () => {
    expect(new CookieService()).toBeInstanceOf(CookieService);
  });

  describe('setCookie', () => {
    it('should set and get a cookie', () => {
      service.setCookie('foo', 'bar');
      expect(service.getCookie('foo')).toBe('bar');
    });

    it('should encode/decode cookie values', () => {
      service.setCookie('sp ace', 'b@r=1');
      expect(service.getCookie('sp ace')).toBe('b@r=1');
    });

    it('should set a cookie with domain option', () => {
      service.setCookie('foo', 'bar', { domain: 'example.com' });
      expect(cookieStr).toContain('Domain=example.com');
    });

    it('should set a cookie with secure option', () => {
      service.setCookie('foo', 'bar', { secure: true });
      expect(cookieStr).toContain('Secure');
    });

    it('should set a cookie with sameSite option', () => {
      service.setCookie('foo', 'bar', { sameSite: 'Strict' });
      expect(cookieStr).toContain('SameSite=Strict');
    });

    it('should set a cookie with all options', () => {
      service.setCookie('foo', 'bar', {
        domain: 'example.com',
        secure: true,
        sameSite: 'Lax',
        path: '/test',
        expires: new Date('2030-01-01T00:00:00Z'),
      });
      expect(cookieStr).toContain('Domain=example.com');
      expect(cookieStr).toContain('Secure');
      expect(cookieStr).toContain('SameSite=Lax');
      expect(cookieStr).toContain('Path=/test');
      expect(cookieStr).toContain('Expires=Tue, 01 Jan 2030 00:00:00 GMT');
    });

    it('should set a cookie with expires as number (days)', () => {
      // Freeze time for predictable Expires value
      const now = new Date('2026-01-19T12:00:00Z');
      vi.setSystemTime(now);
      service.setCookie('foo', 'bar', { expires: 2 });
      // Expires should be 2 days from now
      const expectedDate = new Date(now.getTime() + 2 * 864e5).toUTCString();
      expect(cookieStr).toContain(`Expires=${expectedDate}`);
      vi.useRealTimers();
    });
  });

  describe('getCookie', () => {
    it('should get a cookie value', () => {
      service.setCookie('foo', 'bar');
      expect(service.getCookie('foo')).toBe('bar');
    });

    it('should return null if cookie is not found', () => {
      expect(service.getCookie('notfound')).toBeNull();
    });

    it('should decode cookie value', () => {
      service.setCookie('sp ace', 'b@r=1');
      expect(service.getCookie('sp ace')).toBe('b@r=1');
    });

    it('should return null if cookie name does not match any key', () => {
      service.setCookie('foo', 'bar');
      service.setCookie('baz', 'qux');
      expect(service.getCookie('notfound')).toBeNull();
    });
  });

  describe('removeCookie', () => {
    it('should remove a cookie', () => {
      service.setCookie('foo', 'bar');
      service.removeCookie('foo');
      const value = service.getCookie('foo');
      expect(value).toBe('');
    });
  });
});
