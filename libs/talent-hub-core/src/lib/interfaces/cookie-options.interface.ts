/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * CookieOptions defines the available options for setting browser cookies in a type-safe way.
 *
 * This interface is used by CookieService and similar utilities to provide a consistent API for
 * cookie configuration, including expiration, path, domain, security, and SameSite policy.
 *
 * Usage example:
 *   cookieService.setCookie('token', 'abc', { expires: 7, path: '/', secure: true, sameSite: 'Lax' });
 *
 * Notes:
 * - If 'expires' is a number, it is interpreted as days from now. If a Date, it is used as-is.
 * - 'path' defaults to '/'.
 * - 'sameSite' controls cross-site cookie behavior for security (see MDN for details).
 * - All properties are optional; defaults are applied by the service if not provided.
 */
export interface CookieOptions {
  /**
   * Expiration for the cookie. If a number, interpreted as days from now. If a Date, used as the expiration date.
   * If omitted, the cookie becomes a session cookie (expires when the browser closes).
   */
  expires?: number | Date;

  /**
   * The path for which the cookie is valid. Defaults to '/'.
   * Use to restrict the cookie to a specific path within the domain.
   */
  path?: string;

  /**
   * The domain for which the cookie is valid. If omitted, defaults to the current domain.
   * Use to share cookies across subdomains.
   */
  domain?: string;

  /**
   * Whether the cookie should only be transmitted over secure protocols (HTTPS).
   * Recommended for all sensitive cookies.
   */
  secure?: boolean;

  /**
   * Controls the SameSite policy for the cookie. Can be 'Strict', 'Lax', or 'None'.
   * - 'Strict': Cookie only sent for same-site requests.
   * - 'Lax': Cookie sent for top-level navigation and GET requests by default.
   * - 'None': Cookie sent in all contexts, but must be Secure.
   * See: https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite
   */
  sameSite?: 'Strict' | 'Lax' | 'None';
}
