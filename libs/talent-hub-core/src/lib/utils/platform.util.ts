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
 * Utility class for environment and platform detection.
 *
 * Provides static helper methods for Server-Side Rendering (SSR) compatibility,
 * browser detection, and basic device type checks. These utilities are essential
 * for writing code that works correctly in both browser and server environments.
 *
 * @remarks
 * **Available Methods:**
 * - `isBrowser()` - Check if running in a browser environment.
 * - `isMobile()` - Check if the user agent indicates a mobile device.
 * - `isDesktop()` - Check if the user agent indicates a desktop device.
 *
 * **SSR Compatibility:**
 * Always use `isBrowser()` before accessing browser-only APIs like `window`,
 * `document`, `localStorage`, etc. This prevents errors during server-side rendering.
 *
 * **Device Detection:**
 * Device detection is based on user agent string matching, which is not 100%
 * reliable. For critical functionality, consider using feature detection instead.
 *
 * @example
 * ```typescript
 * // Safe browser API access
 * if (PlatformUtil.isBrowser()) {
 *   localStorage.setItem('key', 'value');
 *   document.body.classList.add('loaded');
 * }
 *
 * // Responsive behavior based on device
 * if (PlatformUtil.isMobile()) {
 *   loadMobileNavigation();
 * } else {
 *   loadDesktopNavigation();
 * }
 *
 * // Conditional rendering in components
 * @Component({
 *   template: `
 *     @if (isDesktop) {
 *       <app-desktop-sidebar />
 *     } @else {
 *       <app-mobile-menu />
 *     }
 *   `
 * })
 * export class LayoutComponent {
 *   isDesktop = PlatformUtil.isDesktop();
 * }
 * ```
 *
 * @see https://angular.io/guide/universal
 * @publicApi
 */
export class PlatformUtil {
  /**
   * Checks if the code is running in a browser environment.
   *
   * Returns `true` if both `window` and `document` are defined, indicating
   * a browser context. Returns `false` in server-side rendering (SSR) or
   * Node.js environments.
   *
   * @returns `true` if running in a browser, `false` otherwise.
   *
   * @remarks
   * **Use Cases:**
   * - Guard browser-only API calls (localStorage, sessionStorage, navigator).
   * - Prevent SSR errors when accessing DOM APIs.
   * - Conditionally execute client-side only code.
   *
   * @example
   * ```typescript
   * // Safe localStorage access
   * if (PlatformUtil.isBrowser()) {
   *   const token = localStorage.getItem('authToken');
   * }
   *
   * // Safe window access
   * if (PlatformUtil.isBrowser()) {
   *   window.scrollTo(0, 0);
   * }
   *
   * // In a service
   * getStoredValue(key: string): string | null {
   *   if (!PlatformUtil.isBrowser()) return null;
   *   return localStorage.getItem(key);
   * }
   * ```
   */
  static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  /**
   * Checks if the user agent indicates a mobile device.
   *
   * Uses a regex pattern to test the `navigator.userAgent` string for common
   * mobile device identifiers. Returns `false` if not in a browser environment.
   *
   * @returns `true` if the user agent indicates a mobile device, `false` otherwise.
   *
   * @remarks
   * **Detected Devices:**
   * - Android phones and tablets
   * - iPhone, iPad, iPod
   * - BlackBerry devices
   * - Windows Phone (IEMobile)
   * - Opera Mini browser
   *
   * **Limitations:**
   * - User agent detection is not 100% reliable.
   * - Some tablets may be detected as mobile.
   * - Desktop browsers in mobile emulation mode may return `true`.
   * - For critical functionality, prefer feature detection or CSS media queries.
   *
   * @example
   * ```typescript
   * // Load mobile-specific resources
   * if (PlatformUtil.isMobile()) {
   *   loadMobileStyles();
   *   initTouchGestures();
   * }
   *
   * // Adjust UI for mobile
   * const itemsPerPage = PlatformUtil.isMobile() ? 10 : 25;
   * ```
   */
  static isMobile(): boolean {
    if (!PlatformUtil.isBrowser()) return false;
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }

  /**
   * Checks if the user agent indicates a desktop device.
   *
   * Returns `true` if running in a browser environment and the user agent
   * does NOT indicate a mobile device. This is the inverse of `isMobile()`.
   *
   * @returns `true` if the user agent indicates a desktop device, `false` otherwise.
   *
   * @remarks
   * **Logic:**
   * - Returns `false` if not in a browser (SSR environment).
   * - Returns `true` if in browser and `isMobile()` returns `false`.
   *
   * **Limitations:**
   * - Inherits all limitations of `isMobile()` detection.
   * - Tablets may be incorrectly classified as mobile or desktop.
   *
   * @example
   * ```typescript
   * // Load desktop-specific features
   * if (PlatformUtil.isDesktop()) {
   *   enableKeyboardShortcuts();
   *   showTooltipsOnHover();
   * }
   *
   * // Conditional component rendering
   * const showSidebar = PlatformUtil.isDesktop();
   * ```
   */
  static isDesktop(): boolean {
    return PlatformUtil.isBrowser() && !PlatformUtil.isMobile();
  }
}
