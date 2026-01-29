/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { DateFormat, Theme, TimeFormat } from '../types';
import { TenantBranding, TenantNotificationSettings } from '../interfaces';

/**
 * Represents tenant-level (organization-wide) preference settings.
 *
 * These preferences serve as defaults for all users within a tenant.
 * Individual users can override these settings with their own preferences.
 *
 * @remarks
 * **Hierarchy:**
 * System Defaults → Tenant Preferences → User Preferences
 *
 * **Properties:**
 * - `tenantId` - The tenant this preference belongs to.
 * - `defaultLanguage` - Default language for new users in this tenant.
 * - `defaultTheme` - Default theme for new users in this tenant.
 * - `allowedLanguages` - Languages available for users to choose from.
 * - `dateFormat` - Organization-wide date format.
 * - `timeFormat` - Organization-wide time format (12h/24h).
 * - `timezone` - Default timezone for the organization.
 * - `branding` - Custom branding options for the tenant.
 * - `features` - Tenant-specific feature toggles.
 *
 * @example
 * ```typescript
 * const tenantPref: TenantPreference = {
 *   tenantId: 'tenant_123',
 *   defaultLanguage: 'en',
 *   defaultTheme: Theme.Light,
 *   allowedLanguages: ['en', 'de', 'fr'],
 *   dateFormat: 'MM/DD/YYYY',
 *   timeFormat: '12h',
 *   timezone: 'America/New_York',
 * };
 * ```
 *
 * @see UserPreference
 * @see PreferenceService
 * @publicApi
 */
export interface TenantPreference {
  /**
   * The unique identifier for this tenant.
   *
   * Used to associate these preferences with the correct tenant context.
   * Should match the `Tenant.id` value.
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   // ...other properties
   * };
   * ```
   */
  tenantId: string;

  /**
   * Default language code for new users in this tenant.
   *
   * Sets the initial language preference for users who haven't specified their own.
   * Must be an ISO 639-1 language code (e.g., 'en', 'de', 'fr').
   *
   * @remarks
   * - Should be one of the `allowedLanguages` for this tenant.
   * - Users can override this in their personal preferences.
   * - Used by `TranslateService` for initial localization.
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   defaultLanguage: 'en',
   *   allowedLanguages: ['en', 'de', 'fr'],
   *   // ...other properties
   * };
   * ```
   */
  defaultLanguage: string;

  /**
   * Default UI theme for new users in this tenant.
   *
   * Sets the initial theme preference for users who haven't specified their own.
   * Users can override this in their personal preferences.
   *
   * @remarks
   * - Common values: 'light', 'dark', 'system'.
   * - Applied via CSS classes or custom properties.
   *
   * @see Theme
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   defaultTheme: 'light',
   *   // ...other properties
   * };
   * ```
   */
  defaultTheme: Theme;

  /**
   * Languages available for users to choose from within this tenant.
   *
   * Restricts the language options shown in the language selector.
   * Must be an array of ISO 639-1 language codes.
   *
   * @remarks
   * - Should include `defaultLanguage` in the list.
   * - Users can only select languages from this list.
   * - Ensure translations exist for all allowed languages.
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   defaultLanguage: 'en',
   *   allowedLanguages: ['en', 'de', 'fr', 'es'],
   *   // ...other properties
   * };
   * ```
   */
  allowedLanguages: string[];

  /**
   * Organization-wide date format preference.
   *
   * Sets the default date display format for all users in this tenant.
   * Users can override this in their personal preferences.
   *
   * @remarks
   * Common formats:
   * - `'MM/DD/YYYY'` - US format (01/31/2026)
   * - `'DD/MM/YYYY'` - European format (31/01/2026)
   * - `'YYYY-MM-DD'` - ISO format (2026-01-31)
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   dateFormat: 'DD/MM/YYYY',
   *   // ...other properties
   * };
   * ```
   */
  dateFormat: DateFormat;

  /**
   * Organization-wide time format preference.
   *
   * Determines whether times are displayed in 12-hour or 24-hour format.
   * Users can override this in their personal preferences.
   *
   * @remarks
   * - `'12h'` - 12-hour format with AM/PM (e.g., 2:30 PM)
   * - `'24h'` - 24-hour format (e.g., 14:30)
   *
   * @see TimeFormat
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   timeFormat: '24h',
   *   // ...other properties
   * };
   * ```
   */
  timeFormat: TimeFormat;

  /**
   * Default timezone for the organization.
   *
   * Sets the default timezone for date/time calculations and display.
   * Must be a valid IANA timezone identifier.
   * Users can override this in their personal preferences.
   *
   * @remarks
   * Examples of IANA timezone identifiers:
   * - `'America/New_York'` - Eastern Time
   * - `'Europe/London'` - British Time
   * - `'Europe/Berlin'` - Central European Time
   * - `'Asia/Tokyo'` - Japan Standard Time
   * - `'UTC'` - Coordinated Universal Time
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   timezone: 'America/New_York',
   *   // ...other properties
   * };
   * ```
   */
  timezone: string;

  /**
   * Optional custom branding configuration for the tenant.
   *
   * Allows tenants to customize the application's visual identity
   * including logo, favicon, and application title.
   *
   * @remarks
   * - If not provided, system default branding is used.
   * - Branding is applied across all micro-frontends.
   *
   * @see TenantBranding
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   branding: {
   *     logoUrl: 'https://cdn.example.com/logo.png',
   *     appTitle: 'Acme Talent Hub',
   *   },
   *   // ...other properties
   * };
   * ```
   */
  branding?: TenantBranding;

  /**
   * Tenant-level feature toggles.
   *
   * Enables or disables features for the entire tenant.
   * These override system defaults but can be further refined by user preferences.
   *
   * @remarks
   * - Keys are feature identifiers (e.g., 'newDashboard', 'advancedSearch').
   * - Values are boolean flags (`true` = enabled, `false` = disabled).
   * - Used for gradual rollouts, A/B testing, and feature gating.
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   features: {
   *     newDashboard: true,
   *     advancedSearch: false,
   *     betaFeatures: true,
   *   },
   *   // ...other properties
   * };
   * ```
   */
  features?: Record<string, boolean>;

  /**
   * Notification settings for the entire tenant.
   *
   * Sets default notification preferences for all users in this tenant.
   * Individual users can override these settings.
   *
   * @see TenantNotificationSettings
   *
   * @example
   * ```typescript
   * const pref: TenantPreference = {
   *   tenantId: 'tenant_123',
   *   notifications: {
   *     email: true,
   *     inApp: true,
   *     push: false,
   *     digestFrequency: 'daily',
   *   },
   *   // ...other properties
   * };
   * ```
   */
  notifications?: TenantNotificationSettings;

  /**
   * Timestamp when these preferences were last updated.
   *
   * ISO 8601 formatted date string indicating the last modification time.
   * Useful for cache invalidation and audit logging.
   *
   * @example
   * ```typescript
   * console.log(`Last updated: ${pref.updatedAt}`);
   * // Output: Last updated: 2026-01-29T10:30:00.000Z
   * ```
   */
  updatedAt?: string;

  /**
   * User ID of the person who last updated these preferences.
   *
   * Used for audit logging and tracking changes.
   *
   * @example
   * ```typescript
   * console.log(`Updated by user: ${pref.updatedBy}`);
   * ```
   */
  updatedBy?: string;
}
