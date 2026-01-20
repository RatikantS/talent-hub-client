/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * PlatformUtil - Utilities for environment and platform detection.
 *
 * Provides helpers for SSR/browser detection and basic device checks.
 *
 * Usage:
 *   PlatformUtil.isBrowser(); // true if running in browser
 *   PlatformUtil.isMobile(); // true if user agent is mobile
 *   PlatformUtil.isDesktop(); // true if user agent is desktop
 */
export class PlatformUtil {
  /**
   * Returns true if running in a browser environment.
   */
  static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  /**
   * Returns true if the user agent is a mobile device.
   * Uses a regex test on navigator.userAgent for common mobile platforms.
   */
  static isMobile(): boolean {
    if (!PlatformUtil.isBrowser()) return false;
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }

  /**
   * Returns true if the user agent is a desktop device.
   * Assumes desktop if browser and not mobile.
   */
  static isDesktop(): boolean {
    return PlatformUtil.isBrowser() && !PlatformUtil.isMobile();
  }
}
