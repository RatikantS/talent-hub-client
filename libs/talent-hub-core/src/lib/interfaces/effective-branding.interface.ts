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
 * Effective branding settings from tenant preferences.
 *
 * @remarks
 * Contains the final branding values from tenant preferences.
 * All fields are guaranteed to have values (from tenant or system defaults).
 *
 * @example
 * ```typescript
 * import { EffectiveBranding } from '@talent-hub/core/interfaces';
 *
 * const branding: EffectiveBranding = {
 *   logoUrl: 'https://cdn.example.com/logo.png',
 *   faviconUrl: 'https://cdn.example.com/favicon.ico',
 *   appTitle: 'Acme Talent Hub',
 * };
 * ```
 *
 * @see TenantBranding
 * @see EffectivePreference
 * @publicApi
 */
export interface EffectiveBranding {
  /**
   * URL to the tenant's logo image.
   *
   * This is the resolved logo URL that should be displayed in the application header,
   * login pages, and other branded areas. Guaranteed to have a value (either from
   * tenant configuration or system defaults).
   *
   * @remarks
   * - Typically a CDN URL for performance.
   * - Should support common image formats (PNG, SVG, WebP).
   * - Recommended dimensions: 200x50 pixels for header display.
   *
   * @example
   * ```typescript
   * // Use in component template
   * <img [src]="branding.logoUrl" alt="Company Logo" />
   * ```
   */
  logoUrl: string;

  /**
   * URL to the tenant's favicon.
   *
   * This is the resolved favicon URL used in browser tabs and bookmarks.
   * Guaranteed to have a value (either from tenant configuration or system defaults).
   *
   * @remarks
   * - Should be an ICO, PNG, or SVG file.
   * - Recommended size: 32x32 or 16x16 pixels.
   * - Applied dynamically via the `FaviconService`.
   *
   * @example
   * ```typescript
   * // Dynamic favicon update
   * faviconService.setFavicon(branding.faviconUrl);
   * ```
   */
  faviconUrl: string;

  /**
   * Application title for the tenant.
   *
   * This is the resolved application title displayed in browser tabs, page headers,
   * and document titles. Guaranteed to have a value (either from tenant configuration
   * or system defaults like 'Talent Hub').
   *
   * @remarks
   * - Used in `<title>` element and `document.title`.
   * - Can be combined with page-specific titles (e.g., 'Dashboard | Acme Talent Hub').
   * - Maximum recommended length: 60 characters for SEO.
   *
   * @example
   * ```typescript
   * // Set document title
   * document.title = `${pageTitle} | ${branding.appTitle}`;
   * ```
   */
  appTitle: string;
}
