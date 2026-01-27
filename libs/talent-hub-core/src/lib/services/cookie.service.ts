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

import { CookieOptions } from '../interfaces';

/**
 * CookieService - Provides a simple, type-safe API for managing browser cookies.
 *
 * This service abstracts direct `document.cookie` access and provides methods for
 * setting, getting, and removing cookies with full support for cookie options
 * (expiration, path, domain, secure, SameSite).
 *
 * @remarks
 * - All cookie names and values are automatically URI-encoded/decoded for safety.
 * - Supports expiration as a `Date` object or as a number of days from now.
 * - Handles edge cases like cookies with `=` in the value.
 * - Designed for use in Angular applications where testability and abstraction are important.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly cookie = inject(CookieService);
 *
 * // Set a cookie that expires in 7 days
 * this.cookie.setCookie('authToken', 'abc123', { expires: 7, path: '/', secure: true });
 *
 * // Set a session cookie (no expiration)
 * this.cookie.setCookie('sessionId', 'xyz789');
 *
 * // Get a cookie value
 * const token = this.cookie.getCookie('authToken');
 * if (token) {
 *   console.log('Token:', token);
 * }
 *
 * // Remove a cookie
 * this.cookie.removeCookie('authToken', { path: '/' });
 * ```
 *
 * @see CookieOptions
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class CookieService {
  /**
   * Sets a cookie with the given name, value, and options.
   *
   * Creates or updates a browser cookie. The name and value are automatically
   * URI-encoded to handle special characters safely.
   *
   * @param name - The cookie name (will be URI-encoded).
   * @param value - The cookie value (will be URI-encoded).
   * @param options - Optional cookie configuration options.
   *
   * @remarks
   * - If `options.expires` is a number, it is treated as the number of days from now.
   * - If `options.expires` is a `Date`, it is used directly.
   * - If `options.expires` is not provided, the cookie becomes a session cookie
   *   (deleted when the browser is closed).
   * - `options.path` defaults to `'/'` if not specified.
   * - Set `options.secure` to `true` for HTTPS-only cookies.
   * - Use `options.sameSite` to control cross-site request behavior ('Strict', 'Lax', 'None').
   *
   * @example
   * ```typescript
   * // Set a cookie that expires in 30 days
   * this.cookie.setCookie('preferences', JSON.stringify({ theme: 'dark' }), {
   *   expires: 30,
   *   path: '/',
   *   secure: true,
   *   sameSite: 'Strict'
   * });
   *
   * // Set a cookie with a specific expiration date
   * const expirationDate = new Date('2026-12-31');
   * this.cookie.setCookie('campaign', 'holiday2026', { expires: expirationDate });
   *
   * // Set a session cookie (no expiration)
   * this.cookie.setCookie('tempData', 'value');
   * ```
   *
   * @see CookieOptions
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    let cookieStr: string = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    if (options.expires) {
      const expires: Date =
        typeof options.expires === 'number'
          ? new Date(Date.now() + options.expires * 864e5) // 864e5 = 24 * 60 * 60 * 1000 (ms in a day)
          : options.expires;
      cookieStr += '; Expires=' + expires.toUTCString();
    }

    cookieStr += '; Path=' + (options.path ?? '/');

    if (options.domain) {
      cookieStr += '; Domain=' + options.domain;
    }

    if (options.secure) {
      cookieStr += '; Secure';
    }

    if (options.sameSite) {
      cookieStr += '; SameSite=' + options.sameSite;
    }

    document.cookie = cookieStr;
  }

  /**
   * Retrieves a cookie value by name.
   *
   * Searches all cookies for a matching name and returns the decoded value.
   * Handles cookies that contain `=` characters in their values.
   *
   * @param name - The cookie name to look up (will be matched against decoded names).
   * @returns The decoded cookie value if found, or `null` if the cookie does not exist.
   *
   * @example
   * ```typescript
   * // Get a simple cookie
   * const token = this.cookie.getCookie('authToken');
   * if (token) {
   *   console.log('Authenticated with token:', token);
   * } else {
   *   console.log('No auth token found');
   * }
   *
   * // Get and parse a JSON cookie
   * const prefsString = this.cookie.getCookie('preferences');
   * if (prefsString) {
   *   const prefs = JSON.parse(prefsString);
   *   console.log('Theme:', prefs.theme);
   * }
   * ```
   */
  getCookie(name: string): string | null {
    const cookies: string[] = document.cookie ? document.cookie.split('; ') : [];

    for (const c of cookies) {
      const [k, ...v] = c.split('=');
      if (decodeURIComponent(k) === name) {
        // Rejoin with '=' to handle values that contain '=' characters
        return decodeURIComponent(v.join('='));
      }
    }

    return null;
  }

  /**
   * Removes a cookie by setting its expiration to a past date.
   *
   * Deletes a cookie by setting its `Expires` attribute to January 1, 1970 (Unix epoch).
   * The same `path` and `domain` options used when setting the cookie must be provided
   * to ensure the correct cookie is removed.
   *
   * @param name - The cookie name to remove.
   * @param options - Optional cookie options (path, domain) that must match the original cookie.
   *
   * @remarks
   * - If the cookie was set with a specific `path` or `domain`, you must provide
   *   the same values in `options` for the removal to work.
   * - The `expires` option in `options` is ignored; the method always sets expiration to the past.
   *
   * @example
   * ```typescript
   * // Remove a cookie (default path '/')
   * this.cookie.removeCookie('authToken');
   *
   * // Remove a cookie with a specific path
   * this.cookie.removeCookie('sessionData', { path: '/app' });
   *
   * // Remove a cookie with domain specification
   * this.cookie.removeCookie('tracking', { path: '/', domain: '.example.com' });
   * ```
   */
  removeCookie(name: string, options: CookieOptions = {}): void {
    this.setCookie(name, '', {
      ...options,
      expires: new Date(0), // January 1, 1970 - effectively deletes the cookie
    });
  }
}
