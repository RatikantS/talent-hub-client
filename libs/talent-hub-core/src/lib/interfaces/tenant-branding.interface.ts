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
 * Tenant branding configuration.
 *
 * @remarks
 * Defines the visual branding elements for a tenant's application instance.
 * These settings are applied across all micro-frontends for consistent branding.
 *
 * @example
 * ```typescript
 * import { TenantBranding } from '@talent-hub/core/interfaces';
 *
 * const branding: TenantBranding = {
 *   logoUrl: 'https://cdn.example.com/acme-logo.png',
 *   faviconUrl: 'https://cdn.example.com/acme-favicon.ico',
 *   appTitle: 'Acme Talent Hub',
 * };
 * ```
 *
 * @see TenantPreference
 * @publicApi
 */
export interface TenantBranding {
  /**
   * URL to the tenant's logo image.
   *
   * The logo is displayed in the application header, login pages, and other
   * branded areas. If not provided, the system default logo is used.
   *
   * @remarks
   * - Recommended format: PNG, SVG, or WebP.
   * - Recommended dimensions: 200x50 pixels for header display.
   * - Should be hosted on a CDN for optimal performance.
   * - Transparent backgrounds work best for versatile theming.
   *
   * @example
   * ```typescript
   * const branding: TenantBranding = {
   *   logoUrl: 'https://cdn.example.com/acme-logo.png',
   *   faviconUrl: 'https://cdn.example.com/acme-favicon.ico',
   *   appTitle: 'Acme Talent Hub',
   * };
   * ```
   */
  logoUrl?: string;

  /**
   * URL to the tenant's favicon.
   *
   * The favicon is displayed in browser tabs and bookmarks. If not provided,
   * the system default favicon is used.
   *
   * @remarks
   * - Recommended format: ICO, PNG, or SVG.
   * - Recommended size: 32x32 or 16x16 pixels.
   * - ICO format provides best cross-browser compatibility.
   * - Consider providing multiple sizes for different contexts.
   *
   * @example
   * ```typescript
   * // Set favicon dynamically
   * faviconService.setFavicon(branding.faviconUrl);
   * ```
   */
  faviconUrl?: string;

  /**
   * Custom application title for the tenant.
   *
   * The title is used in browser tabs, page headers, and document titles.
   * If not provided, the system default title ('Talent Hub') is used.
   *
   * @remarks
   * - Maximum recommended length: 60 characters for SEO.
   * - Can be combined with page titles (e.g., 'Dashboard | Acme Talent Hub').
   * - Used in `<title>` element and `document.title`.
   *
   * @example
   * ```typescript
   * // Combine with page title
   * document.title = pageTitle
   *   ? `${pageTitle} | ${branding.appTitle}`
   *   : branding.appTitle;
   * ```
   */
  appTitle?: string;
}
