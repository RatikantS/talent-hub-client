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
import { UserNotificationPreference } from '../interfaces';

/**
 * User preference interface that supports multi-tenant architecture.
 *
 * This interface defines user-level preference settings that can be customized
 * per user within a tenant, overriding tenant defaults.
 *
 * @remarks
 * **Preference Resolution Order:**
 * 1. User Preference (highest priority)
 * 2. Tenant Preference (organization default)
 * 3. System Default (lowest priority)
 *
 * **Properties:**
 * - `userId` - The user this preference belongs to.
 * - `tenantId` - The tenant context for this preference.
 * - `language` - User's preferred language.
 * - `theme` - User's preferred theme.
 * - `dateFormat` - User's date format override.
 * - `timeFormat` - User's time format override.
 * - `timezone` - User's timezone override.
 * - `notifications` - User's notification preferences.
 *
 * @example
 * ```typescript
 * const userPref: UserPreference = {
 *   userId: 'user_123',
 *   tenantId: 'tenant_456',
 *   language: 'de',
 *   theme: 'dark',
 *   timezone: 'Europe/Berlin',
 *   notifications: {
 *     email: true,
 *     inApp: true,
 *     push: false,
 *   },
 * };
 * ```
 *
 * @see TenantPreference
 * @see PreferenceService
 * @see AppPreference
 * @publicApi
 */
export interface UserPreference {
  /**
   * The unique identifier for the user.
   *
   * Associates these preferences with a specific user.
   * Should match the `User.id` value.
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'tenant_456',
   * };
   * ```
   */
  userId: string;

  /**
   * The tenant context for this preference.
   *
   * A user may belong to multiple tenants and have different preferences
   * for each tenant context. This field identifies which tenant context
   * these preferences apply to.
   *
   * @remarks
   * - Preferences are scoped per tenant.
   * - Switching tenants may load different user preferences.
   *
   * @example
   * ```typescript
   * // User has different preferences per tenant
   * const acmePref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'acme_tenant',
   *   language: 'en',
   * };
   *
   * const europePref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'europe_tenant',
   *   language: 'de',
   * };
   * ```
   */
  tenantId: string;

  /**
   * User's preferred language code.
   *
   * Overrides the tenant's default language for this user.
   * Must be one of the tenant's `allowedLanguages`.
   * If not set, uses the tenant's `defaultLanguage`.
   *
   * @remarks
   * - ISO 639-1 language code (e.g., 'en', 'de', 'fr').
   * - Used by `TranslateService` for UI localization.
   * - Affects date/number formatting locale.
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'tenant_456',
   *   language: 'de', // Override tenant default
   * };
   * ```
   */
  language?: string;

  /**
   * User's preferred UI theme.
   *
   * Overrides the tenant's default theme for this user.
   * If not set, uses the tenant's `defaultTheme`.
   *
   * @remarks
   * - Common values: 'light', 'dark', 'system'.
   * - 'system' follows the OS theme preference.
   * - Applied via CSS classes or custom properties.
   *
   * @see Theme
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'tenant_456',
   *   theme: 'dark',
   * };
   * ```
   */
  theme?: Theme;

  /**
   * User's preferred date format.
   *
   * Overrides the tenant's default date format for this user.
   * If not set, uses the tenant's `dateFormat`.
   *
   * @remarks
   * Common formats from `DateFormat`:
   * - `'MM/DD/YYYY'` - US format (01/31/2026)
   * - `'DD/MM/YYYY'` - European format (31/01/2026)
   * - `'YYYY-MM-DD'` - ISO format (2026-01-31)
   *
   * @see DateFormat
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'tenant_456',
   *   dateFormat: 'YYYY-MM-DD',
   * };
   * ```
   */
  dateFormat?: DateFormat;

  /**
   * User's preferred time format.
   *
   * Overrides the tenant's default time format for this user.
   * If not set, uses the tenant's `timeFormat`.
   *
   * @remarks
   * - `'12h'` - 12-hour format with AM/PM (e.g., 2:30 PM)
   * - `'24h'` - 24-hour format (e.g., 14:30)
   *
   * @see TimeFormat
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'tenant_456',
   *   timeFormat: '24h',
   * };
   * ```
   */
  timeFormat?: TimeFormat;

  /**
   * User's preferred timezone.
   *
   * Overrides the tenant's default timezone for this user.
   * If not set, uses the tenant's `timezone`.
   * Must be a valid IANA timezone identifier.
   *
   * @remarks
   * Examples of IANA timezone identifiers:
   * - `'America/New_York'` - Eastern Time
   * - `'Europe/London'` - British Time
   * - `'Europe/Berlin'` - Central European Time
   * - `'Asia/Tokyo'` - Japan Standard Time
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'tenant_456',
   *   timezone: 'Europe/Berlin',
   * };
   * ```
   */
  timezone?: string;

  /**
   * User's notification preferences.
   *
   * Overrides the tenant's default notification settings for this user.
   * Supports partial overrides - only specified properties are overridden.
   *
   * @remarks
   * - Includes email, in-app, and push notification settings.
   * - Supports quiet hours and category-level preferences.
   * - Unspecified properties inherit from tenant defaults.
   *
   * @see UserNotificationPreference
   *
   * @example
   * ```typescript
   * const pref: UserPreference = {
   *   userId: 'user_123',
   *   tenantId: 'tenant_456',
   *   notifications: {
   *     email: true,
   *     push: false,
   *     quietHours: {
   *       enabled: true,
   *       startTime: '22:00',
   *       endTime: '08:00',
   *     },
   *   },
   * };
   * ```
   */
  notifications?: UserNotificationPreference;

  /**
   * Timestamp when these preferences were last updated.
   *
   * ISO 8601 formatted date string indicating the last modification time.
   * Useful for cache invalidation and sync conflict resolution.
   *
   * @example
   * ```typescript
   * console.log(`Preferences last updated: ${pref.updatedAt}`);
   * // Output: Preferences last updated: 2026-01-29T10:30:00.000Z
   * ```
   */
  updatedAt?: string;
}
