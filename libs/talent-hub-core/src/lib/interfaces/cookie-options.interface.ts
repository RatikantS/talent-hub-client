/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

/**
 * Configuration options for setting browser cookies in a type-safe manner.
 *
 * This interface is used by `CookieService` and similar utilities to provide a
 * consistent API for cookie configuration, including expiration, path, domain,
 * security settings, and SameSite policy.
 *
 * @remarks
 * **Properties:**
 * - `expires` - When the cookie expires (days or Date object).
 * - `path` - URL path scope for the cookie.
 * - `domain` - Domain scope for the cookie.
 * - `secure` - Whether to require HTTPS.
 * - `sameSite` - Cross-site request policy.
 *
 * **Default Behavior:**
 * - If `expires` is omitted, the cookie is a session cookie (deleted on browser close).
 * - If `path` is omitted, defaults to `'/'`.
 * - If `domain` is omitted, defaults to the current domain.
 * - If `secure` is omitted, defaults to `false` (but should be `true` for sensitive data).
 * - If `sameSite` is omitted, browser defaults apply (usually `'Lax'`).
 *
 * @example
 * ```typescript
 * // Set a secure cookie that expires in 7 days
 * cookieService.setCookie('authToken', 'abc123', {
 *   expires: 7,
 *   path: '/',
 *   secure: true,
 *   sameSite: 'Strict',
 * });
 *
 * // Set a cookie with a specific expiration date
 * cookieService.setCookie('promo', 'summer2026', {
 *   expires: new Date('2026-12-31'),
 *   path: '/promotions',
 * });
 *
 * // Set a session cookie (expires when browser closes)
 * cookieService.setCookie('sessionId', 'xyz789');
 *
 * // Share cookie across subdomains
 * cookieService.setCookie('tracking', 'id123', {
 *   domain: '.example.com',
 *   sameSite: 'Lax',
 * });
 * ```
 *
 * @see CookieService
 * @see https://developer.mozilla.org/docs/Web/HTTP/Cookies
 * @publicApi
 */
export interface CookieOptions {
  /**
   * Expiration time for the cookie.
   *
   * - If a `number`, interpreted as days from now (e.g., `7` = 7 days).
   * - If a `Date`, used as the exact expiration date/time.
   * - If omitted, the cookie becomes a session cookie (expires when browser closes).
   *
   * @remarks
   * For security-sensitive cookies, prefer short expiration times and consider
   * implementing token refresh mechanisms.
   *
   * @example
   * ```typescript
   * // Expires in 30 days
   * { expires: 30 }
   *
   * // Expires on a specific date
   * { expires: new Date('2026-06-30T23:59:59Z') }
   *
   * // Session cookie (no expires)
   * {}
   * ```
   */
  expires?: number | Date;

  /**
   * The URL path for which the cookie is valid.
   *
   * Restricts the cookie to requests matching this path prefix. Defaults to `'/'`
   * if not specified, making the cookie available for all paths on the domain.
   *
   * @remarks
   * Use specific paths to limit cookie scope and reduce unnecessary cookie
   * transmission. For example, set `/api` for API-only cookies.
   *
   * @example
   * ```typescript
   * // Available on all paths
   * { path: '/' }
   *
   * // Only available under /admin
   * { path: '/admin' }
   *
   * // Only available for API requests
   * { path: '/api' }
   * ```
   */
  path?: string;

  /**
   * The domain for which the cookie is valid.
   *
   * If omitted, defaults to the current domain (not including subdomains).
   * To share cookies across subdomains, prefix with a dot (e.g., `.example.com`).
   *
   * @remarks
   * - Setting `domain` to `.example.com` allows `www.example.com`, `api.example.com`, etc.
   * - Be cautious when sharing cookies across subdomains for security reasons.
   * - Cannot set cookies for domains you don't control.
   *
   * @example
   * ```typescript
   * // Current domain only
   * {}
   *
   * // Share across all subdomains
   * { domain: '.example.com' }
   *
   * // Specific subdomain
   * { domain: 'api.example.com' }
   * ```
   */
  domain?: string;

  /**
   * Whether the cookie should only be transmitted over secure protocols (HTTPS).
   *
   * When `true`, the cookie is only sent with requests over HTTPS connections.
   * Strongly recommended for all cookies containing sensitive data (tokens, session IDs).
   *
   * @remarks
   * - Required when `sameSite: 'None'` is used.
   * - In development, you may need to disable this for local HTTP testing.
   * - Always enable in production for security-critical cookies.
   *
   * @example
   * ```typescript
   * // Secure cookie (HTTPS only)
   * { secure: true }
   *
   * // Allow HTTP (development only)
   * { secure: false }
   * ```
   */
  secure?: boolean;

  /**
   * Controls the SameSite policy for cross-site request behavior.
   *
   * - `'Strict'` - Cookie only sent for same-site requests. Maximum security.
   * - `'Lax'` - Cookie sent for top-level navigations and GET requests. Default in modern browsers.
   * - `'None'` - Cookie sent in all contexts (cross-site). Requires `secure: true`.
   *
   * @remarks
   * - Use `'Strict'` for sensitive operations (e.g., authentication, payments).
   * - Use `'Lax'` for general-purpose cookies that need to work with external links.
   * - Use `'None'` only when cross-site cookie access is explicitly required (e.g., embedded iframes).
   *
   * @see https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite
   *
   * @example
   * ```typescript
   * // Maximum security - same-site only
   * { sameSite: 'Strict' }
   *
   * // Balanced security - allows top-level navigation
   * { sameSite: 'Lax' }
   *
   * // Cross-site allowed (must be secure)
   * { sameSite: 'None', secure: true }
   * ```
   */
  sameSite?: 'Strict' | 'Lax' | 'None';
}
