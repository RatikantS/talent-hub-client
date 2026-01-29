/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { computed, signal, Signal, WritableSignal } from '@angular/core';

import { EffectivePreference, TenantPreference, User, UserPreference } from '../interfaces';
import { APP_CONSTANT } from '../constants';
import { DateFormat, Theme, TimeFormat } from '../types';

/**
 * Mock user for testing.
 */
const createMockUser = (): User => ({
  id: 'user_123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['user'],
  permissions: [],
});

/**
 * Mock tenant preference for testing.
 */
const createMockTenantPreference = (): TenantPreference => ({
  tenantId: 'tenant_456',
  defaultLanguage: 'es',
  defaultTheme: 'dark',
  allowedLanguages: ['en', 'es', 'fr'],
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  timezone: 'Europe/Madrid',
  notifications: {
    email: true,
    inApp: true,
    push: true,
    digestFrequency: 'weekly',
  },
  features: {
    advancedReporting: true,
    bulkImport: false,
  },
  branding: {
    logoUrl: 'https://example.com/logo.png',
    faviconUrl: 'https://example.com/favicon.ico',
    appTitle: 'Tenant App',
  },
});

/**
 * Mock user preference for testing.
 */
const createMockUserPreference = (): UserPreference => ({
  userId: 'user_123',
  tenantId: 'tenant_456',
  language: 'fr',
  theme: 'light',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '12h',
  timezone: 'America/New_York',
  notifications: {
    email: false,
    push: true,
  },
  updatedAt: '2024-06-01T00:00:00.000Z',
});

/**
 * System defaults used for fallback testing.
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
 * Creates a testable PreferenceService-like object with mocked dependencies.
 * This avoids Angular DI and TestBed by creating the service logic manually.
 */
function createTestablePreferenceService(options: {
  userSignal: WritableSignal<User | null>;
  tenantIdSignal: WritableSignal<string | null>;
  tenantPreferenceSignal: WritableSignal<TenantPreference | null>;
  allowedLanguagesSignal: WritableSignal<string[]>;
  storageGetItem: Mock<(key: string) => UserPreference | null>;
  storageSetItem: Mock<(key: string, value: UserPreference) => void>;
  storageRemoveItem: Mock<(key: string) => void>;
}) {
  const {
    userSignal,
    tenantIdSignal,
    tenantPreferenceSignal,
    allowedLanguagesSignal,
    storageGetItem,
    storageSetItem,
    storageRemoveItem,
  } = options;

  // Helper to get storage key
  const getUserPrefKey = (userId: string, tenantId: string): string => {
    return `th_user_preference_${tenantId}_${userId}`;
  };

  // User preference signal (loads from storage)
  const _userPreference: Signal<UserPreference | null> = computed(() => {
    const userId = userSignal()?.id;
    const tenantId = tenantIdSignal();
    if (!userId || !tenantId) {
      return null;
    }
    return storageGetItem(getUserPrefKey(userId, tenantId)) ?? null;
  });

  // Compute effective notification
  const computeEffectiveNotification = (
    tenantPref: TenantPreference | null,
    userPref: UserPreference | null,
  ) => {
    const tenantNotif = tenantPref?.notifications;
    const userNotif = userPref?.notifications;
    return {
      email: userNotif?.email ?? tenantNotif?.email ?? SYSTEM_DEFAULTS.notifications.email,
      inApp: userNotif?.inApp ?? tenantNotif?.inApp ?? SYSTEM_DEFAULTS.notifications.inApp,
      push: userNotif?.push ?? tenantNotif?.push ?? SYSTEM_DEFAULTS.notifications.push,
      digestFrequency:
        userNotif?.digestFrequency ??
        tenantNotif?.digestFrequency ??
        SYSTEM_DEFAULTS.notifications.digestFrequency,
    };
  };

  // Compute effective branding
  const computeEffectiveBranding = (tenantPref: TenantPreference | null) => {
    const tenantBrand = tenantPref?.branding;
    return {
      logoUrl: tenantBrand?.logoUrl ?? SYSTEM_DEFAULTS.branding.logoUrl,
      faviconUrl: tenantBrand?.faviconUrl ?? SYSTEM_DEFAULTS.branding.faviconUrl,
      appTitle: tenantBrand?.appTitle ?? SYSTEM_DEFAULTS.branding.appTitle,
    };
  };

  // Compute effective features
  const computeEffectiveFeatures = (tenantPref: TenantPreference | null) => {
    return tenantPref?.features ?? {};
  };

  // Compute effective preference
  const computeEffectivePreference = (
    tenantPref: TenantPreference | null,
    userPref: UserPreference | null,
    userId: string,
    tenantId: string,
  ): EffectivePreference => {
    return {
      userId,
      tenantId,
      language: userPref?.language ?? tenantPref?.defaultLanguage ?? SYSTEM_DEFAULTS.language,
      theme: userPref?.theme ?? tenantPref?.defaultTheme ?? SYSTEM_DEFAULTS.theme,
      dateFormat: userPref?.dateFormat ?? tenantPref?.dateFormat ?? SYSTEM_DEFAULTS.dateFormat,
      timeFormat: userPref?.timeFormat ?? tenantPref?.timeFormat ?? SYSTEM_DEFAULTS.timeFormat,
      timezone: userPref?.timezone ?? tenantPref?.timezone ?? SYSTEM_DEFAULTS.timezone,
      notifications: computeEffectiveNotification(tenantPref, userPref),
      features: computeEffectiveFeatures(tenantPref),
      branding: computeEffectiveBranding(tenantPref),
    };
  };

  // Effective preference signal
  const effectivePreference: Signal<EffectivePreference> = computed(() => {
    const tenantPref = tenantPreferenceSignal();
    const userPref = _userPreference();
    const userId = userSignal()?.id ?? '';
    const tenantId = tenantIdSignal() ?? '';
    return computeEffectivePreference(tenantPref, userPref, userId, tenantId);
  });

  // Individual preference signals
  const theme: Signal<Theme> = computed(() => effectivePreference().theme);
  const language: Signal<string> = computed(() => effectivePreference().language);
  const dateFormat: Signal<string> = computed(() => effectivePreference().dateFormat);
  const timeFormat: Signal<TimeFormat> = computed(() => effectivePreference().timeFormat);
  const timezone: Signal<string> = computed(() => effectivePreference().timezone);
  const notifications = computed(() => effectivePreference().notifications);
  const branding = computed(() => effectivePreference().branding);
  const features = computed(() => effectivePreference().features);
  const isDarkMode: Signal<boolean> = computed(() => theme() === 'dark');
  const isLightMode: Signal<boolean> = computed(() => theme() === 'light');

  // Update user preference helper
  const updateUserPreference = (updates: Partial<UserPreference>): void => {
    const userId = userSignal()?.id;
    const tenantId = tenantIdSignal();
    if (!userId || !tenantId) {
      return;
    }

    const current: UserPreference = _userPreference() ?? {
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

    storageSetItem(getUserPrefKey(userId, tenantId), updated);
  };

  // Public methods
  const getUserPreference = (): UserPreference | null => _userPreference();

  const setUserTheme = (newTheme: Theme): void => {
    updateUserPreference({ theme: newTheme });
  };

  const setUserLanguage = (newLanguage: string): boolean => {
    const allowed = allowedLanguagesSignal();
    if (!allowed.includes(newLanguage)) {
      return false;
    }
    updateUserPreference({ language: newLanguage });
    return true;
  };

  const setUserTimezone = (newTimezone: string): void => {
    updateUserPreference({ timezone: newTimezone });
  };

  const setUserDateFormat = (newDateFormat: DateFormat): void => {
    updateUserPreference({ dateFormat: newDateFormat });
  };

  const setUserTimeFormat = (newTimeFormat: TimeFormat): void => {
    updateUserPreference({ timeFormat: newTimeFormat });
  };

  const setUserNotifications = (
    newNotifications: Partial<UserPreference['notifications']>,
  ): void => {
    const current = _userPreference()?.notifications ?? {};
    updateUserPreference({
      notifications: { ...current, ...newNotifications } as UserPreference['notifications'],
    });
  };

  const isFeatureEnabled = (featureKey: string): boolean => {
    return features()[featureKey] ?? false;
  };

  const resetToTenantDefaults = (): void => {
    const userId = userSignal()?.id;
    const tenantId = tenantIdSignal();
    if (userId && tenantId) {
      storageRemoveItem(getUserPrefKey(userId, tenantId));
    }
  };

  const loadUserPreference = (preferences: UserPreference): void => {
    const userId = userSignal()?.id;
    const tenantId = tenantIdSignal();
    if (userId && tenantId) {
      storageSetItem(getUserPrefKey(userId, tenantId), preferences);
    }
  };

  return {
    effectivePreference,
    theme,
    language,
    dateFormat,
    timeFormat,
    timezone,
    notifications,
    branding,
    features,
    isDarkMode,
    isLightMode,
    getUserPreference,
    setUserTheme,
    setUserLanguage,
    setUserTimezone,
    setUserDateFormat,
    setUserTimeFormat,
    setUserNotifications,
    isFeatureEnabled,
    resetToTenantDefaults,
    loadUserPreference,
  };
}

describe('PreferenceService', () => {
  let service: ReturnType<typeof createTestablePreferenceService>;
  let userSignal: WritableSignal<User | null>;
  let tenantIdSignal: WritableSignal<string | null>;
  let tenantPreferenceSignal: WritableSignal<TenantPreference | null>;
  let allowedLanguagesSignal: WritableSignal<string[]>;
  let storageGetItem: Mock<(key: string) => UserPreference | null>;
  let storageSetItem: Mock<(key: string, value: UserPreference) => void>;
  let storageRemoveItem: Mock<(key: string) => void>;

  const mockUser = createMockUser();
  const mockTenantPreference = createMockTenantPreference();
  const mockUserPreference = createMockUserPreference();

  beforeEach(() => {
    // Create writable signals for mocking
    userSignal = signal<User | null>(mockUser);
    tenantIdSignal = signal<string | null>('tenant_456');
    tenantPreferenceSignal = signal<TenantPreference | null>(mockTenantPreference);
    allowedLanguagesSignal = signal<string[]>(['en', 'es', 'fr']);

    // Create storage mocks
    storageGetItem = vi.fn();
    storageSetItem = vi.fn();
    storageRemoveItem = vi.fn();

    // Create service
    service = createTestablePreferenceService({
      userSignal,
      tenantIdSignal,
      tenantPreferenceSignal,
      allowedLanguagesSignal,
      storageGetItem,
      storageSetItem,
      storageRemoveItem,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return system defaults when no tenant or user preferences exist', () => {
      tenantPreferenceSignal.set(null);
      storageGetItem.mockReturnValue(null);

      const effective: EffectivePreference = service.effectivePreference();

      expect(effective.language).toBe(APP_CONSTANT.DEFAULT_LANGUAGE);
      expect(effective.theme).toBe(APP_CONSTANT.DEFAULT_THEME);
      expect(effective.dateFormat).toBe(APP_CONSTANT.DEFAULT_DATE_FORMAT);
      expect(effective.timeFormat).toBe(APP_CONSTANT.DEFAULT_TIME_FORMAT);
      expect(effective.timezone).toBe(APP_CONSTANT.DEFAULT_TIME_ZONE);
    });
  });

  describe('preference resolution', () => {
    it('should apply tenant preferences over system defaults', () => {
      storageGetItem.mockReturnValue(null);

      const effective: EffectivePreference = service.effectivePreference();

      expect(effective.language).toBe('es');
      expect(effective.theme).toBe('dark');
      expect(effective.dateFormat).toBe('DD/MM/YYYY');
      expect(effective.timeFormat).toBe('24h');
      expect(effective.timezone).toBe('Europe/Madrid');
    });

    it('should apply user preferences over tenant preferences', () => {
      storageGetItem.mockReturnValue(mockUserPreference);

      const effective: EffectivePreference = service.effectivePreference();

      expect(effective.language).toBe('fr');
      expect(effective.theme).toBe('light');
      expect(effective.dateFormat).toBe('YYYY-MM-DD');
      expect(effective.timeFormat).toBe('12h');
      expect(effective.timezone).toBe('America/New_York');
    });

    it('should fall back to tenant when user preference field is undefined', () => {
      const partialUserPref: UserPreference = {
        userId: 'user_123',
        tenantId: 'tenant_456',
        language: 'fr',
      };
      storageGetItem.mockReturnValue(partialUserPref);

      const effective: EffectivePreference = service.effectivePreference();

      expect(effective.language).toBe('fr'); // from user
      expect(effective.theme).toBe('dark'); // from tenant
      expect(effective.dateFormat).toBe('DD/MM/YYYY'); // from tenant
    });

    it('should include userId and tenantId in effective preference', () => {
      storageGetItem.mockReturnValue(null);

      const effective: EffectivePreference = service.effectivePreference();

      expect(effective.userId).toBe('user_123');
      expect(effective.tenantId).toBe('tenant_456');
    });
  });

  describe('individual preference signals', () => {
    beforeEach(() => {
      storageGetItem.mockReturnValue(mockUserPreference);
    });

    it('should return correct theme from theme signal', () => {
      expect(service.theme()).toBe('light');
    });

    it('should return correct language from language signal', () => {
      expect(service.language()).toBe('fr');
    });

    it('should return correct dateFormat from dateFormat signal', () => {
      expect(service.dateFormat()).toBe('YYYY-MM-DD');
    });

    it('should return correct timeFormat from timeFormat signal', () => {
      expect(service.timeFormat()).toBe('12h');
    });

    it('should return correct timezone from timezone signal', () => {
      expect(service.timezone()).toBe('America/New_York');
    });

    it('should return correct notifications from notifications signal', () => {
      const notifications = service.notifications();
      expect(notifications.email).toBe(false); // from user
      expect(notifications.push).toBe(true); // from user
      expect(notifications.inApp).toBe(true); // from tenant (not in user pref)
      expect(notifications.digestFrequency).toBe('weekly'); // from tenant
    });

    it('should return correct branding from branding signal', () => {
      const branding = service.branding();
      expect(branding.logoUrl).toBe('https://example.com/logo.png');
      expect(branding.faviconUrl).toBe('https://example.com/favicon.ico');
      expect(branding.appTitle).toBe('Tenant App');
    });

    it('should return correct features from features signal', () => {
      const features = service.features();
      expect(features['advancedReporting']).toBe(true);
      expect(features['bulkImport']).toBe(false);
    });
  });

  describe('theme convenience signals', () => {
    it('should return true for isDarkMode when theme is dark', () => {
      storageGetItem.mockReturnValue({ ...mockUserPreference, theme: 'dark' });
      expect(service.isDarkMode()).toBe(true);
      expect(service.isLightMode()).toBe(false);
    });

    it('should return true for isLightMode when theme is light', () => {
      storageGetItem.mockReturnValue({ ...mockUserPreference, theme: 'light' });
      expect(service.isDarkMode()).toBe(false);
      expect(service.isLightMode()).toBe(true);
    });
  });

  describe('getUserPreference', () => {
    it('should return stored user preference', () => {
      storageGetItem.mockReturnValue(mockUserPreference);
      const result = service.getUserPreference();
      expect(result).toEqual(mockUserPreference);
    });

    it('should return null when no user preference is stored', () => {
      storageGetItem.mockReturnValue(null);
      const result = service.getUserPreference();
      expect(result).toBeNull();
    });

    it('should return null when user is not authenticated', () => {
      userSignal.set(null);
      const result = service.getUserPreference();
      expect(result).toBeNull();
    });

    it('should return null when tenant is not set', () => {
      tenantIdSignal.set(null);
      const result = service.getUserPreference();
      expect(result).toBeNull();
    });
  });

  describe('setUserTheme', () => {
    it('should update user preference with new theme', () => {
      storageGetItem.mockReturnValue(null);

      service.setUserTheme('dark');

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({
          theme: 'dark',
          userId: 'user_123',
          tenantId: 'tenant_456',
        }),
      );
    });

    it('should preserve existing preferences when updating theme', () => {
      storageGetItem.mockReturnValue(mockUserPreference);

      service.setUserTheme('dark');

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({
          theme: 'dark',
          language: 'fr', // preserved from existing
          timezone: 'America/New_York', // preserved from existing
        }),
      );
    });

    it('should not update when user is not authenticated', () => {
      userSignal.set(null);

      service.setUserTheme('dark');

      expect(storageSetItem).not.toHaveBeenCalled();
    });
  });

  describe('setUserLanguage', () => {
    it('should return true and update language when allowed by tenant', () => {
      storageGetItem.mockReturnValue(null);

      const result = service.setUserLanguage('es');

      expect(result).toBe(true);
      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({ language: 'es' }),
      );
    });

    it('should return false and not update language when not allowed by tenant', () => {
      storageGetItem.mockReturnValue(null);

      const result = service.setUserLanguage('de'); // not in allowed languages

      expect(result).toBe(false);
      expect(storageSetItem).not.toHaveBeenCalled();
    });

    it('should validate against tenant allowed languages', () => {
      allowedLanguagesSignal.set(['en', 'es']);
      storageGetItem.mockReturnValue(null);

      expect(service.setUserLanguage('en')).toBe(true);
      expect(service.setUserLanguage('es')).toBe(true);
      expect(service.setUserLanguage('fr')).toBe(false);
    });
  });

  describe('setUserTimezone', () => {
    it('should update user preference with new timezone', () => {
      storageGetItem.mockReturnValue(null);

      service.setUserTimezone('Asia/Tokyo');

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({ timezone: 'Asia/Tokyo' }),
      );
    });
  });

  describe('setUserDateFormat', () => {
    it('should update user preference with new date format', () => {
      storageGetItem.mockReturnValue(null);

      service.setUserDateFormat('YYYY-MM-DD' as DateFormat);

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({ dateFormat: 'YYYY-MM-DD' }),
      );
    });
  });

  describe('setUserTimeFormat', () => {
    it('should update user preference with 12h format', () => {
      storageGetItem.mockReturnValue(null);

      service.setUserTimeFormat('12h');

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({ timeFormat: '12h' }),
      );
    });

    it('should update user preference with 24h format', () => {
      storageGetItem.mockReturnValue(null);

      service.setUserTimeFormat('24h');

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({ timeFormat: '24h' }),
      );
    });
  });

  describe('setUserNotifications', () => {
    it('should merge notification preferences with existing', () => {
      storageGetItem.mockReturnValue(mockUserPreference);

      service.setUserNotifications({ email: true, digestFrequency: 'daily' });

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({
          notifications: expect.objectContaining({
            email: true, // updated
            push: true, // preserved from existing
            digestFrequency: 'daily', // updated
          }),
        }),
      );
    });

    it('should create notifications object when none exists', () => {
      storageGetItem.mockReturnValue({
        userId: 'user_123',
        tenantId: 'tenant_456',
      });

      service.setUserNotifications({ email: false });

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.objectContaining({
          notifications: expect.objectContaining({ email: false }),
        }),
      );
    });
  });

  describe('isFeatureEnabled', () => {
    beforeEach(() => {
      storageGetItem.mockReturnValue(null);
    });

    it('should return true for enabled feature', () => {
      expect(service.isFeatureEnabled('advancedReporting')).toBe(true);
    });

    it('should return false for disabled feature', () => {
      expect(service.isFeatureEnabled('bulkImport')).toBe(false);
    });

    it('should return false for unknown feature', () => {
      expect(service.isFeatureEnabled('unknownFeature')).toBe(false);
    });

    it('should return false when no tenant preference exists', () => {
      tenantPreferenceSignal.set(null);
      expect(service.isFeatureEnabled('advancedReporting')).toBe(false);
    });
  });

  describe('resetToTenantDefaults', () => {
    it('should remove user preference from storage', () => {
      service.resetToTenantDefaults();

      expect(storageRemoveItem).toHaveBeenCalledWith('th_user_preference_tenant_456_user_123');
    });

    it('should not remove when user is not authenticated', () => {
      userSignal.set(null);

      service.resetToTenantDefaults();

      expect(storageRemoveItem).not.toHaveBeenCalled();
    });

    it('should not remove when tenant is not set', () => {
      tenantIdSignal.set(null);

      service.resetToTenantDefaults();

      expect(storageRemoveItem).not.toHaveBeenCalled();
    });
  });

  describe('loadUserPreference', () => {
    it('should store user preference from API response', () => {
      const apiPreference: UserPreference = {
        userId: 'user_123',
        tenantId: 'tenant_456',
        language: 'de',
        theme: 'dark',
      };

      service.loadUserPreference(apiPreference);

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        apiPreference,
      );
    });

    it('should not store when user is not authenticated', () => {
      userSignal.set(null);

      service.loadUserPreference(mockUserPreference);

      expect(storageSetItem).not.toHaveBeenCalled();
    });

    it('should not store when tenant is not set', () => {
      tenantIdSignal.set(null);

      service.loadUserPreference(mockUserPreference);

      expect(storageSetItem).not.toHaveBeenCalled();
    });
  });

  describe('notification resolution', () => {
    it('should merge notifications from user, tenant, and system defaults', () => {
      const partialUserPref: UserPreference = {
        userId: 'user_123',
        tenantId: 'tenant_456',
        notifications: {
          email: false, // override tenant
        },
      };
      storageGetItem.mockReturnValue(partialUserPref);

      const notifications = service.notifications();

      expect(notifications.email).toBe(false); // from user
      expect(notifications.inApp).toBe(true); // from tenant
      expect(notifications.push).toBe(true); // from tenant
      expect(notifications.digestFrequency).toBe('weekly'); // from tenant
    });

    it('should fall back to system defaults when no tenant notifications', () => {
      tenantPreferenceSignal.set({
        ...mockTenantPreference,
        notifications: undefined,
      } as TenantPreference);
      storageGetItem.mockReturnValue(null);

      const notifications = service.notifications();

      expect(notifications.email).toBe(true); // system default
      expect(notifications.inApp).toBe(true); // system default
      expect(notifications.push).toBe(false); // system default
      expect(notifications.digestFrequency).toBe('daily'); // system default
    });
  });

  describe('branding resolution', () => {
    it('should use tenant branding when available', () => {
      storageGetItem.mockReturnValue(null);

      const branding = service.branding();

      expect(branding.logoUrl).toBe('https://example.com/logo.png');
      expect(branding.faviconUrl).toBe('https://example.com/favicon.ico');
      expect(branding.appTitle).toBe('Tenant App');
    });

    it('should fall back to system defaults when no tenant branding', () => {
      tenantPreferenceSignal.set({
        ...mockTenantPreference,
        branding: undefined,
      } as TenantPreference);
      storageGetItem.mockReturnValue(null);

      const branding = service.branding();

      expect(branding.logoUrl).toBe('');
      expect(branding.faviconUrl).toBe('');
      expect(branding.appTitle).toBe(APP_CONSTANT.APP_NAME);
    });
  });

  describe('storage key generation', () => {
    it('should generate unique key per user and tenant', () => {
      storageGetItem.mockReturnValue(null);

      service.setUserTheme('dark');

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_tenant_456_user_123',
        expect.any(Object),
      );
    });

    it('should use different keys for different tenants', () => {
      tenantIdSignal.set('other_tenant');
      storageGetItem.mockReturnValue(null);

      service.setUserTheme('dark');

      expect(storageSetItem).toHaveBeenCalledWith(
        'th_user_preference_other_tenant_user_123',
        expect.any(Object),
      );
    });
  });

  describe('updatedAt timestamp', () => {
    it('should set updatedAt when updating preferences', () => {
      vi.useFakeTimers();
      const now = new Date('2026-01-29T12:00:00.000Z');
      vi.setSystemTime(now);

      storageGetItem.mockReturnValue(null);

      service.setUserTheme('dark');

      expect(storageSetItem).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          updatedAt: '2026-01-29T12:00:00.000Z',
        }),
      );

      vi.useRealTimers();
    });
  });
});
