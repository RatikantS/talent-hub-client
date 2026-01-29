/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Theme, TimeFormat } from '../types';
import { EffectiveBranding, EffectiveNotification } from '../interfaces';

/**
 * Effective preferences after merging system defaults, tenant, and user preferences.
 *
 * This interface represents the final, computed preference values that should be
 * used throughout the application. All optional fields are resolved to concrete values.
 *
 * @remarks
 * **Resolution Order:**
 * 1. Start with system defaults
 * 2. Apply tenant preferences (override defaults)
 * 3. Apply user preferences (override tenant)
 *
 * @example
 * ```typescript
 * // PreferenceService computes effective preferences
 * const prefs = preferenceService.effectivePreference();
 *
 * // Use values - all fields are guaranteed to have values
 * const theme = prefs.theme;
 * const language = prefs.language;
 * const dateFormat = prefs.dateFormat;
 * ```
 *
 * @see PreferenceService
 * @see TenantPreference
 * @see UserPreference
 * @publicApi
 */
export interface EffectivePreference {
  /**
   * The current tenant context identifier.
   *
   * Identifies which tenant's preferences are being applied.
   * Used for logging, analytics, and multi-tenant data isolation.
   *
   * @example
   * ```typescript
   * console.log(`Loading preferences for tenant: ${prefs.tenantId}`);
   * ```
   */
  tenantId: string;

  /**
   * The current user identifier.
   *
   * Identifies which user's preferences are being applied.
   * Used for personalization and preference persistence.
   *
   * @example
   * ```typescript
   * console.log(`User ${prefs.userId} prefers ${prefs.theme} theme`);
   * ```
   */
  userId: string;

  /**
   * The resolved language code for localization.
   *
   * Final language after merging system defaults, tenant settings, and user preferences.
   * ISO 639-1 code (e.g., 'en', 'de', 'fr', 'es').
   *
   * @remarks
   * - Used by `TranslateService` for UI translations.
   * - Affects date/number formatting locale.
   * - Guaranteed to be a valid, supported language code.
   *
   * @example
   * ```typescript
   * translateService.use(prefs.language);
   * ```
   */
  language: string;

  /**
   * The resolved UI theme preference.
   *
   * Final theme after merging defaults with user preference.
   * Determines the application's visual appearance.
   *
   * @remarks
   * - Common values: 'light', 'dark', 'system'.
   * - Applied via CSS classes or CSS custom properties.
   *
   * @see Theme
   *
   * @example
   * ```typescript
   * document.body.setAttribute('data-theme', prefs.theme);
   * ```
   */
  theme: Theme;

  /**
   * The resolved date format pattern.
   *
   * Final date format after merging tenant and user preferences.
   * Used for displaying dates throughout the application.
   *
   * @remarks
   * - Common formats: 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'.
   * - Applied to date pipes and formatters.
   *
   * @example
   * ```typescript
   * const formatted = datePipe.transform(date, prefs.dateFormat);
   * ```
   */
  dateFormat: string;

  /**
   * The resolved time format preference.
   *
   * Final time format after merging tenant and user preferences.
   * Determines 12-hour vs 24-hour time display.
   *
   * @see TimeFormat
   *
   * @example
   * ```typescript
   * const timePattern = prefs.timeFormat === '12h' ? 'hh:mm a' : 'HH:mm';
   * ```
   */
  timeFormat: TimeFormat;

  /**
   * The resolved timezone identifier.
   *
   * Final timezone after merging tenant and user preferences.
   * IANA timezone identifier (e.g., 'America/New_York', 'Europe/Berlin').
   *
   * @remarks
   * - Used for date/time calculations and display.
   * - Affects scheduling and deadline displays.
   *
   * @example
   * ```typescript
   * const localTime = date.toLocaleString('en-US', { timeZone: prefs.timezone });
   * ```
   */
  timezone: string;

  /**
   * Merged feature flags from all preference levels.
   *
   * Combined feature toggles from system defaults, tenant settings, and user preferences.
   * Used to enable/disable features throughout the application.
   *
   * @remarks
   * - Higher-level preferences override lower-level defaults.
   * - Use for A/B testing, gradual rollouts, and feature gating.
   *
   * @example
   * ```typescript
   * if (prefs.features['newDashboard']) {
   *   showNewDashboard();
   * }
   * ```
   */
  features: Record<string, boolean>;

  /**
   * Resolved notification preferences.
   *
   * Final notification settings after merging tenant defaults with user overrides.
   * All properties are guaranteed to have values.
   *
   * @see EffectiveNotification
   *
   * @example
   * ```typescript
   * if (prefs.notifications.email) {
   *   sendEmailNotification(user.email, message);
   * }
   * ```
   */
  notifications: EffectiveNotification;

  /**
   * Resolved tenant branding configuration.
   *
   * Final branding settings from tenant preferences.
   * All properties are guaranteed to have values.
   *
   * @see EffectiveBranding
   *
   * @example
   * ```typescript
   * document.title = prefs.branding.appTitle;
   * ```
   */
  branding: EffectiveBranding;
}
