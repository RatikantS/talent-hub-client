/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { computed, inject, Injectable, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { APP_CONSTANT } from '../constants';
import { DateFormat, Theme, TimeFormat } from '../types';
import {
  EffectiveBranding,
  EffectiveNotification,
  EffectivePreference,
  NotificationSettings,
  TenantBranding,
  TenantPreference,
  UserNotificationPreference,
  UserPreference,
} from '../interfaces';
import { AuthStore, TenantStore } from '../store';
import { StorageService } from './storage.service';

/**
 * Default system preferences used as fallback values when neither tenant nor user preferences are set.
 *
 * These values represent the lowest priority in the preference hierarchy:
 * - User preferences (highest priority)
 * - Tenant preferences (organization defaults)
 * - System defaults (this object - lowest priority)
 *
 * @internal
 */
const SYSTEM_DEFAULTS = {
  language: APP_CONSTANT.DEFAULT_LANGUAGE,
  theme: APP_CONSTANT.DEFAULT_THEME as Theme,
  dateFormat: APP_CONSTANT.DEFAULT_DATE_FORMAT,
  timeFormat: APP_CONSTANT.DEFAULT_TIME_FORMAT,
  timezone: APP_CONSTANT.DEFAULT_TIME_ZONE,
  notifications: {
    email: true,
    inApp: true,
    push: false,
    digestFrequency: 'daily' as const,
  },
  branding: {
    logoUrl: '',
    faviconUrl: '',
    appTitle: APP_CONSTANT.APP_NAME,
  },
};

/**
 * Storage key prefix for user preferences.
 *
 * The full key format is: `{prefix}_{tenantId}_{userId}`
 * This ensures preferences are isolated per user and tenant combination.
 *
 * @internal
 */
const USER_PREF_STORAGE_KEY = 'th_user_preference';

/**
 * PreferenceService - Manages preference resolution across system, tenant, and user levels.
 *
 * This service implements a hierarchical preference system where:
 * 1. System defaults provide baseline values
 * 2. Tenant preferences override system defaults (organization-wide settings)
 * 3. User preferences override tenant preferences (individual customization)
 *
 * @remarks
 * **Key Responsibilities:**
 * - Resolves final preference values by merging all levels.
 * - Provides reactive signals for resolved preferences.
 * - Persists user preferences to storage and syncs with backend.
 * - Validates user preferences against tenant-allowed values.
 *
 * **Signals:**
 * - `resolvedPreference()` - The fully resolved preference object.
 * - `theme()` - Resolved theme value.
 * - `language()` - Resolved language value.
 * - `dateFormat()` - Resolved date format.
 * - `timezone()` - Resolved timezone.
 *
 * @example
 * ```typescript
 * private readonly prefService = inject(PreferenceService);
 *
 * // Get resolved theme (user → tenant → system)
 * const theme = this.prefService.theme();
 *
 * // Update user preference
 * this.prefService.setUserTheme(Theme.Dark);
 *
 * // Get full effective preferences
 * const allPrefs = this.prefService.effectivePreference();
 * ```
 *
 * @see TenantPreference
 * @see UserPreference
 * @see EffectivePreference
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class PreferenceService {
  /** @internal Store for accessing tenant-level configuration and preferences. */
  private readonly tenantStore = inject(TenantStore);

  /** @internal Store for accessing current authenticated user information. */
  private readonly authStore = inject(AuthStore);

  /** @internal Service for persisting user preferences to local storage. */
  private readonly storageService: StorageService = inject(StorageService);

  /**
   * User preferences signal that loads from local storage.
   *
   * This computed signal automatically retrieves user preferences from storage
   * based on the current user and tenant context. Returns `null` if either
   * the user is not authenticated or the tenant context is not available.
   *
   * @internal
   */
  private readonly _userPreference: Signal<UserPreference | null> = computed(
    (): UserPreference | null => {
      const userId: string | undefined = this.authStore.user()?.id;
      const tenantId: string | null = this.tenantStore.tenantId();

      if (!userId || !tenantId) {
        return null;
      }

      // Try to load from storage
      const stored: UserPreference | null = this.storageService.getItem<UserPreference>(
        this.getUserPrefKey(userId, tenantId),
      );

      return stored ?? null;
    },
  );

  /**
   * Computed signal providing the fully resolved effective preferences.
   *
   * Merges preferences in order of priority: user → tenant → system defaults.
   * This signal automatically recomputes whenever any of the underlying
   * preference sources change.
   *
   * @remarks
   * Use this signal when you need access to the complete preference object.
   * For individual preferences, use the convenience signals like `theme()`,
   * `language()`, etc.
   */
  readonly effectivePreference: Signal<EffectivePreference> = computed((): EffectivePreference => {
    const tenantPref: TenantPreference | null = this.tenantStore.tenantPreference();
    const userPref: UserPreference | null = this._userPreference();
    const userId: string = this.authStore.user()?.id ?? '';
    const tenantId: string = this.tenantStore.tenantId() ?? '';
    return this.computeEffectivePreference(tenantPref, userPref, userId, tenantId);
  });

  /**
   * Observable stream of effective preferences for RxJS-based consumers.
   *
   * Emits the current effective preferences whenever they change.
   * Prefer using the `effectivePreference` signal in signal-based code.
   *
   * @see effectivePreference
   */
  readonly effectivePreference$: Observable<EffectivePreference> = toObservable(
    this.effectivePreference,
  );

  /**
   * The resolved theme preference signal.
   * Returns the effective theme after merging user → tenant → system defaults.
   */
  readonly theme: Signal<Theme> = computed((): Theme => this.effectivePreference().theme);

  /**
   * The resolved language preference signal.
   * Returns the effective language code (e.g., 'en', 'es', 'fr').
   */
  readonly language: Signal<string> = computed((): string => this.effectivePreference().language);

  /**
   * The resolved date format preference signal.
   * Returns the effective date format (e.g., 'MM/DD/YYYY', 'DD/MM/YYYY').
   */
  readonly dateFormat: Signal<string> = computed(
    (): string => this.effectivePreference().dateFormat,
  );

  /**
   * The resolved time format preference signal.
   * Returns either '12h' (12-hour clock) or '24h' (24-hour clock).
   */
  readonly timeFormat: Signal<TimeFormat> = computed(
    (): TimeFormat => this.effectivePreference().timeFormat,
  );

  /**
   * The resolved timezone preference signal.
   * Returns the IANA timezone identifier (e.g., 'America/New_York', 'Europe/London').
   */
  readonly timezone: Signal<string> = computed((): string => this.effectivePreference().timezone);

  /**
   * The resolved notification preferences signal.
   * Contains email, in-app, push notification settings and digest frequency.
   */
  readonly notifications: Signal<EffectiveNotification> = computed(
    (): EffectiveNotification => this.effectivePreference().notifications,
  );

  /**
   * The resolved branding preferences signal.
   * Contains logo URL, favicon URL, and app title from tenant configuration.
   * Users cannot override branding settings.
   */
  readonly branding: Signal<EffectiveBranding> = computed(
    (): EffectiveBranding => this.effectivePreference().branding,
  );

  /**
   * The resolved feature flags signal.
   * Contains a map of feature keys to their enabled/disabled state.
   * Features are managed at tenant level only.
   */
  readonly features: Signal<Record<string, boolean>> = computed(
    (): Record<string, boolean> => this.effectivePreference().features,
  );

  /**
   * Convenience signal that returns `true` when the current theme is 'dark'.
   * Useful for conditionally applying dark mode styles or behaviors.
   */
  readonly isDarkMode: Signal<boolean> = computed((): boolean => this.theme() === 'dark');

  /**
   * Convenience signal that returns `true` when the current theme is 'light'.
   * Useful for conditionally applying light mode styles or behaviors.
   */
  readonly isLightMode: Signal<boolean> = computed((): boolean => this.theme() === 'light');

  /**
   * Gets the current user preference (user-level only, not resolved).
   *
   * @returns The user's stored preferences, or `null` if not set or user is not authenticated.
   *
   * @remarks
   * This returns raw user preferences without merging with tenant or system defaults.
   * Use `effectivePreference()` to get the fully resolved preferences.
   */
  getUserPreference(): UserPreference | null {
    return this._userPreference();
  }

  /**
   * Sets the user's theme preference.
   *
   * @param theme - The theme to set ('light', 'dark', or 'system').
   *
   * @example
   * ```typescript
   * this.preferenceService.setUserTheme('dark');
   * ```
   */
  setUserTheme(theme: Theme): void {
    this.updateUserPreference({ theme });
  }

  /**
   * Sets the user's language preference.
   *
   * Validates against tenant's allowed languages before applying.
   * If the language is not in the tenant's allowed list, the preference is not updated.
   *
   * @param language - The language code to set (e.g., 'en', 'es', 'fr').
   * @returns `true` if the language was set successfully, `false` if not allowed by tenant.
   *
   * @example
   * ```typescript
   * const success = this.preferenceService.setUserLanguage('es');
   * if (!success) {
   *   console.warn('Language not allowed by tenant configuration');
   * }
   * ```
   */
  setUserLanguage(language: string): boolean {
    const allowedLanguages: string[] = this.tenantStore.allowedLanguages();
    if (!allowedLanguages.includes(language)) {
      return false;
    }
    this.updateUserPreference({ language });
    return true;
  }

  /**
   * Sets the user's timezone preference.
   *
   * @param timezone - The IANA timezone identifier (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo').
   *
   * @example
   * ```typescript
   * this.preferenceService.setUserTimezone('America/Los_Angeles');
   * ```
   */
  setUserTimezone(timezone: string): void {
    this.updateUserPreference({ timezone });
  }

  /**
   * Sets the user's date format preference.
   *
   * @param dateFormat - The date format pattern (e.g., 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD').
   *
   * @example
   * ```typescript
   * this.preferenceService.setUserDateFormat('DD/MM/YYYY');
   * ```
   */
  setUserDateFormat(dateFormat: DateFormat): void {
    this.updateUserPreference({ dateFormat });
  }

  /**
   * Sets the user's time format preference.
   *
   * @param timeFormat - The time format ('12h' for 12-hour clock, '24h' for 24-hour clock).
   *
   * @example
   * ```typescript
   * this.preferenceService.setUserTimeFormat('24h');
   * ```
   */
  setUserTimeFormat(timeFormat: TimeFormat): void {
    this.updateUserPreference({ timeFormat });
  }

  /**
   * Updates user notification preferences.
   *
   * Merges the provided notification settings with existing preferences.
   * Only the properties specified in the `notifications` parameter are updated.
   *
   * @param notifications - Partial notification preference updates.
   *
   * @example
   * ```typescript
   * // Enable push notifications and set digest to weekly
   * this.preferenceService.setUserNotifications({
   *   push: true,
   *   digestFrequency: 'weekly'
   * });
   * ```
   */
  setUserNotifications(notifications: Partial<UserPreference['notifications']>): void {
    const current: UserNotificationPreference = this._userPreference()?.notifications ?? {};
    this.updateUserPreference({
      notifications: { ...current, ...notifications } as UserPreference['notifications'],
    });
  }

  /**
   * Checks if a feature is enabled (resolved from tenant level).
   *
   * Features are managed at tenant level and cannot be overridden by users.
   *
   * @param featureKey - The feature key to check (e.g., 'advancedReporting', 'bulkImport').
   * @returns `true` if the feature is enabled, `false` otherwise.
   *
   * @example
   * ```typescript
   * if (this.preferenceService.isFeatureEnabled('advancedReporting')) {
   *   // Show advanced reporting features
   * }
   * ```
   */
  isFeatureEnabled(featureKey: string): boolean {
    return this.features()[featureKey] ?? false;
  }

  /**
   * Resets user preferences to tenant defaults.
   *
   * Removes all user-level preference overrides, causing the effective preferences
   * to fall back to tenant defaults (or system defaults if no tenant preference exists).
   *
   * @remarks
   * This operation is irreversible. All user customizations will be lost.
   *
   * @example
   * ```typescript
   * // Reset all preferences to tenant defaults
   * this.preferenceService.resetToTenantDefaults();
   * ```
   */
  resetToTenantDefaults(): void {
    const userId: string | undefined = this.authStore.user()?.id;
    const tenantId: string | null = this.tenantStore.tenantId();
    if (userId && tenantId) {
      this.storageService.removeItem(this.getUserPrefKey(userId, tenantId));
    }
  }

  /**
   * Loads user preferences from backend API response.
   *
   * Call this after authentication to sync preferences from the server.
   * The preferences will be persisted to local storage for offline access.
   *
   * @param preferences - User preferences object from the API response.
   *
   * @example
   * ```typescript
   * // After successful login
   * this.authService.login().subscribe(response => {
   *   this.preferenceService.loadUserPreference(response.userPreferences);
   * });
   * ```
   */
  loadUserPreference(preferences: UserPreference): void {
    const userId: string | undefined = this.authStore.user()?.id;
    const tenantId: string | null = this.tenantStore.tenantId();
    if (userId && tenantId) {
      this.storageService.setItem(this.getUserPrefKey(userId, tenantId), preferences);
    }
  }

  /**
   * Updates user preferences and persists to local storage.
   *
   * Creates a new preference record if none exists, otherwise merges updates
   * with existing preferences. Automatically sets the `updatedAt` timestamp.
   *
   * @param updates - Partial preference updates to apply.
   * @internal
   */
  private updateUserPreference(updates: Partial<UserPreference>): void {
    const userId: string | undefined = this.authStore.user()?.id;
    const tenantId: string | null = this.tenantStore.tenantId();
    if (!userId || !tenantId) {
      return;
    }

    const current: UserPreference = this._userPreference() ?? {
      userId,
      tenantId,
    };

    const updated: UserPreference = {
      ...current,
      ...updates,
      userId,
      tenantId,
      updatedAt: new Date().toISOString(),
    };

    this.storageService.setItem(this.getUserPrefKey(userId, tenantId), updated);
  }

  /**
   * Computes effective preferences by merging all preference levels.
   *
   * Applies the following priority order for each preference field:
   * 1. User preference (highest priority)
   * 2. Tenant preference (organization default)
   * 3. System default (lowest priority)
   *
   * @param tenantPref - Tenant-level preferences, or `null` if not available.
   * @param userPref - User-level preferences, or `null` if not set.
   * @param userId - Current user's unique identifier.
   * @param tenantId - Current tenant's unique identifier.
   * @returns The fully resolved effective preferences object.
   * @internal
   */
  private computeEffectivePreference(
    tenantPref: TenantPreference | null,
    userPref: UserPreference | null,
    userId: string,
    tenantId: string,
  ): EffectivePreference {
    // Compute each preference field: user → tenant → system default
    return {
      userId,
      tenantId,

      // Basic preferences
      language: userPref?.language ?? tenantPref?.defaultLanguage ?? SYSTEM_DEFAULTS.language,

      theme: userPref?.theme ?? tenantPref?.defaultTheme ?? SYSTEM_DEFAULTS.theme,

      dateFormat: userPref?.dateFormat ?? tenantPref?.dateFormat ?? SYSTEM_DEFAULTS.dateFormat,

      timeFormat: userPref?.timeFormat ?? tenantPref?.timeFormat ?? SYSTEM_DEFAULTS.timeFormat,

      timezone: userPref?.timezone ?? tenantPref?.timezone ?? SYSTEM_DEFAULTS.timezone,

      // Notifications: merge user → tenant → system
      notifications: this.computeEffectiveNotification(tenantPref, userPref),

      // Features: tenant level only
      features: this.computeEffectiveFeatures(tenantPref),

      // Branding: tenant only (users can't override)
      branding: this.computeEffectiveBranding(tenantPref),
    };
  }

  /**
   * Computes effective notification preferences by merging all preference levels.
   *
   * Priority order: user → tenant → system defaults.
   *
   * @param tenantPref - Tenant-level preferences.
   * @param userPref - User-level preferences.
   * @returns Fully resolved notification settings.
   * @internal
   */
  private computeEffectiveNotification(
    tenantPref: TenantPreference | null,
    userPref: UserPreference | null,
  ): EffectiveNotification {
    const tenantNotif: NotificationSettings | undefined = tenantPref?.notifications;
    const userNotif: UserNotificationPreference | undefined = userPref?.notifications;
    return {
      email: userNotif?.email ?? tenantNotif?.email ?? SYSTEM_DEFAULTS.notifications.email,
      inApp: userNotif?.inApp ?? tenantNotif?.inApp ?? SYSTEM_DEFAULTS.notifications.inApp,
      push: userNotif?.push ?? tenantNotif?.push ?? SYSTEM_DEFAULTS.notifications.push,
      digestFrequency:
        userNotif?.digestFrequency ??
        tenantNotif?.digestFrequency ??
        SYSTEM_DEFAULTS.notifications.digestFrequency,
    };
  }

  /**
   * Computes effective features from tenant preferences.
   *
   * Features are managed at tenant level only - users cannot override feature flags.
   *
   * @param tenantPref - Tenant-level preferences containing feature flags.
   * @returns A record of feature keys to their enabled/disabled state.
   * @internal
   */
  private computeEffectiveFeatures(tenantPref: TenantPreference | null): Record<string, boolean> {
    return tenantPref?.features ?? {};
  }

  /**
   * Computes effective branding from tenant preferences.
   *
   * Branding is tenant-level only - users cannot override branding settings.
   *
   * @param tenantPref - Tenant-level preferences containing branding configuration.
   * @returns Fully resolved branding settings.
   * @internal
   */
  private computeEffectiveBranding(tenantPref: TenantPreference | null): EffectiveBranding {
    const tenantBrand: TenantBranding | undefined = tenantPref?.branding;
    return {
      logoUrl: tenantBrand?.logoUrl ?? SYSTEM_DEFAULTS.branding.logoUrl,
      faviconUrl: tenantBrand?.faviconUrl ?? SYSTEM_DEFAULTS.branding.faviconUrl,
      appTitle: tenantBrand?.appTitle ?? SYSTEM_DEFAULTS.branding.appTitle,
    };
  }

  /**
   * Generates the storage key for user preferences.
   *
   * @param userId - The user's unique identifier.
   * @param tenantId - The tenant's unique identifier.
   * @returns The storage key in format `th_user_preference_{tenantId}_{userId}`.
   * @internal
   */
  private getUserPrefKey(userId: string, tenantId: string): string {
    return `${USER_PREF_STORAGE_KEY}_${tenantId}_${userId}`;
  }
}
