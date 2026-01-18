/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Injectable } from '@angular/core';

import { CookieOptions } from '../interfaces';

/**
 * CookieService - Provides a simple API for setting, getting, and removing browser cookies.
 *
 * This service supports cookie options for expiration, path, domain, secure, and SameSite policies.
 * All values are automatically encoded/decoded for safety. Designed for use in Angular applications
 * where direct document.cookie access is discouraged.
 *
 * Usage:
 *   const cookie = inject(CookieService);
 *   cookie.setCookie('token', 'abc', { expires: 7, path: '/' });
 *   const token = cookie.getCookie('token');
 *   cookie.removeCookie('token');
 *
 * - Uses strict typing, no any.
 * - Handles encoding/decoding and option formatting.
 * - Provided in root (singleton).
 */
@Injectable({ providedIn: 'root' })
export class CookieService {
  /**
   * Sets a cookie with the given name, value, and options.
   *
   * @param name The cookie name (will be encoded)
   * @param value The cookie value (will be encoded)
   * @param options Optional cookie options (expires, path, domain, secure, sameSite)
   *
   * If expires is a number, it is treated as days from now. If a Date, it is used as-is.
   * Path defaults to '/'.
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    let cookieStr: string = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (options.expires) {
      const expires: Date =
        typeof options.expires === 'number'
          ? new Date(Date.now() + options.expires * 864e5)
          : options.expires;
      cookieStr += '; Expires=' + expires.toUTCString();
    }
    cookieStr += '; Path=' + (options.path ?? '/');
    if (options.domain) cookieStr += '; Domain=' + options.domain;
    if (options.secure) cookieStr += '; Secure';
    if (options.sameSite) cookieStr += '; SameSite=' + options.sameSite;
    document.cookie = cookieStr;
  }

  /**
   * Gets a cookie value by name, or null if not found.
   *
   * @param name The cookie name (will be decoded)
   * @returns The decoded cookie value, or null if not found.
   */
  getCookie(name: string): string | null {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const c of cookies) {
      const [k, ...v] = c.split('=');
      if (decodeURIComponent(k) === name) {
        return decodeURIComponent(v.join('='));
      }
    }
    return null;
  }

  /**
   * Removes a cookie by name (sets expiration in the past).
   *
   * @param name The cookie name
   * @param options Optional cookie options (path, domain, sameSite, etc.)
   *
   * This sets the cookie's expiration to January 1, 1970, effectively deleting it.
   */
  removeCookie(name: string, options: CookieOptions = {}): void {
    this.setCookie(name, '', {
      ...options,
      expires: new Date(0),
    });
  }
}
