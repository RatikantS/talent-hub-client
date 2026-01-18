/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { CookieService } from '../services';

describe('CookieService', () => {
  let service: CookieService;
  let cookieStr = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService],
    });
    cookieStr = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieStr;
      },
      set cookie(val: string) {
        cookieStr = val;
      },
    });
    service = TestBed.inject(CookieService);
  });

  it('should create an instance', () => {
    expect(new CookieService()).toBeInstanceOf(CookieService);
  });

  it('should set and get a cookie', () => {
    service.setCookie('foo', 'bar');
    expect(service.getCookie('foo')).toBe('bar');
  });

  it('should encode/decode cookie values', () => {
    service.setCookie('sp ace', 'b@r=1');
    expect(service.getCookie('sp ace')).toBe('b@r=1');
  });

  it('should remove a cookie', () => {
    service.setCookie('foo', 'bar');
    service.removeCookie('foo');
    const value = service.getCookie('foo');
    expect(value === null || value === '').toBe(true);
  });

  it('should set cookie with options', () => {
    service.setCookie('foo', 'bar', {
      path: '/x',
      domain: 'test.com',
      secure: true,
      sameSite: 'Strict',
    });
    expect(cookieStr).toMatch(/Path=\/x/);
    expect(cookieStr).toMatch(/Domain=test.com/);
    expect(cookieStr).toMatch(/Secure/);
    expect(cookieStr).toMatch(/SameSite=Strict/);
  });

  it('should set cookie with expires (days)', () => {
    service.setCookie('foo', 'bar', { expires: 1 });
    expect(cookieStr).toMatch(/Expires=/);
  });

  it('should set cookie with expires (Date)', () => {
    const date = new Date(Date.now() + 10000);
    service.setCookie('foo', 'bar', { expires: date });
    expect(cookieStr).toMatch(/Expires=/);
  });

  it('should return null for missing cookie', () => {
    expect(service.getCookie('nope')).toBeNull();
  });

  it('should return null if document.cookie is empty', () => {
    cookieStr = '';
    expect(service.getCookie('foo')).toBeNull();
  });

  it('should return null for malformed cookie string', () => {
    cookieStr = 'malformed_cookie_without_equals';
    expect(service.getCookie('foo')).toBeNull();
  });
});
