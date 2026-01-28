/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EnvironmentInjector,
  Injector,
  runInInjectionContext,
  signal,
  StaticProvider,
} from '@angular/core';

import { TranslateConfig } from '../interfaces';
import { AppStore } from '../store';
import { TRANSLATE_CONFIG } from '../tokens';
import { TranslateService } from '../services';

describe('TranslateService', () => {
  const mockTranslations: TranslateConfig = {
    defaultLocale: 'en',
    translations: {
      en: {
        locale: 'en',
        translations: {
          welcome: 'Welcome',
          nav: {
            dashboard: 'Dashboard',
            settings: 'Settings',
            profile: {
              view: 'View Profile',
              edit: 'Edit Profile',
            },
          },
          actions: {
            save: 'Save',
            cancel: 'Cancel',
          },
        },
      },
      de: {
        locale: 'de',
        translations: {
          welcome: 'Willkommen',
          nav: {
            dashboard: 'Armaturenbrett',
            settings: 'Einstellungen',
            profile: {
              view: 'Profil anzeigen',
              edit: 'Profil bearbeiten',
            },
          },
          actions: {
            save: 'Speichern',
            cancel: 'Abbrechen',
          },
        },
      },
    },
  };

  let service: TranslateService;
  let currentLanguageSignal: ReturnType<typeof signal<string>>;
  let appStoreMock: {
    config: ReturnType<typeof signal<{ supportedLanguages?: string[] } | null>>;
    currentLanguage: () => string;
    setLanguage: ReturnType<typeof vi.fn>;
  };

  /**
   * Creates an injector with the provided config and initializes the service.
   */
  function createService(config: TranslateConfig | null = mockTranslations): TranslateService {
    currentLanguageSignal = signal(config?.defaultLocale ?? 'en');

    appStoreMock = {
      config: signal(null),
      currentLanguage: () => currentLanguageSignal(),
      setLanguage: vi.fn((locale: string) => currentLanguageSignal.set(locale)),
    };

    const providers: StaticProvider[] = [{ provide: AppStore, useValue: appStoreMock }];

    if (config) {
      providers.push({ provide: TRANSLATE_CONFIG, useValue: config });
    }

    const injector = Injector.create({ providers });

    let svc: TranslateService;
    runInInjectionContext(injector as EnvironmentInjector, () => {
      svc = new TranslateService();
    });

    return svc!;
  }

  beforeEach(() => {
    service = createService();
  });

  describe('creation', () => {
    it('should create an instance', () => {
      expect(service).toBeTruthy();
    });

    it('should use default locale from AppStore', () => {
      expect(service.locale).toBe('en');
    });

    it('should fallback to default language when no config is provided', () => {
      const serviceWithoutConfig = createService(null);
      expect(serviceWithoutConfig.locale).toBe('en');
    });
  });

  describe('locale', () => {
    it('should return current locale code from AppStore', () => {
      expect(service.locale).toBe('en');
    });

    it('should reflect AppStore language changes', () => {
      expect(service.locale).toBe('en');

      currentLanguageSignal.set('de');
      expect(service.locale).toBe('de');
    });
  });

  describe('localeSignal', () => {
    it('should return a signal with current locale from AppStore', () => {
      const localeSignal = service.localeSignal;
      expect(localeSignal()).toBe('en');
    });

    it('should update when AppStore language changes', () => {
      const localeSignal = service.localeSignal;
      expect(localeSignal()).toBe('en');

      currentLanguageSignal.set('de');
      expect(localeSignal()).toBe('de');
    });
  });

  describe('availableLocales', () => {
    it('should return locale codes from translation config', () => {
      const locales = service.availableLocales();
      expect(locales).toContain('en');
      expect(locales).toContain('de');
    });

    it('should prefer AppStore supported languages when available', () => {
      appStoreMock.config.set({ supportedLanguages: ['en', 'de', 'fr', 'es'] });

      const locales = service.availableLocales();
      expect(locales).toEqual(['en', 'de', 'fr', 'es']);
    });

    it('should fallback to config keys when AppStore has no supported languages', () => {
      appStoreMock.config.set({ supportedLanguages: [] });

      const locales = service.availableLocales();
      expect(locales).toContain('en');
      expect(locales).toContain('de');
    });

    it('should return empty array when no config is provided', () => {
      const serviceWithoutConfig = createService(null);
      const locales = serviceWithoutConfig.availableLocales();
      expect(locales).toEqual([]);
    });
  });

  describe('setLocale', () => {
    it('should delegate to AppStore.setLanguage when translations exist', () => {
      const result = service.setLocale('de');

      expect(result).toBe(true);
      expect(appStoreMock.setLanguage).toHaveBeenCalledWith('de');
    });

    it('should return false when locale does not exist in translations', () => {
      const result = service.setLocale('fr');

      expect(result).toBe(false);
      expect(appStoreMock.setLanguage).not.toHaveBeenCalled();
    });

    it('should not call AppStore.setLanguage when invalid locale is provided', () => {
      const result = service.setLocale('invalid');

      expect(result).toBe(false);
      expect(appStoreMock.setLanguage).not.toHaveBeenCalled();
    });

    it('should return false when no config is provided', () => {
      const serviceWithoutConfig = createService(null);
      const result = serviceWithoutConfig.setLocale('de');

      expect(result).toBe(false);
    });

    it('should update locale via AppStore when valid', () => {
      service.setLocale('de');

      expect(service.locale).toBe('de');
    });
  });

  describe('translate', () => {
    describe('basic translations', () => {
      it('should translate a simple key', () => {
        const result = service.translate('welcome');
        expect(result).toBe('Welcome');
      });

      it('should translate a nested key with dot notation', () => {
        const result = service.translate('nav.dashboard');
        expect(result).toBe('Dashboard');
      });

      it('should translate deeply nested keys', () => {
        const result = service.translate('nav.profile.view');
        expect(result).toBe('View Profile');
      });
    });

    describe('locale switching', () => {
      it('should return translated value for current locale', () => {
        expect(service.translate('welcome')).toBe('Welcome');

        currentLanguageSignal.set('de');
        expect(service.translate('welcome')).toBe('Willkommen');
      });

      it('should translate nested keys after locale change', () => {
        currentLanguageSignal.set('de');

        expect(service.translate('nav.dashboard')).toBe('Armaturenbrett');
        expect(service.translate('nav.profile.edit')).toBe('Profil bearbeiten');
      });
    });

    describe('missing translations', () => {
      it('should return key when translation is not found', () => {
        const result = service.translate('missing.key');
        expect(result).toBe('missing.key');
      });

      it('should return key when partial path exists but final key is missing', () => {
        const result = service.translate('nav.missing');
        expect(result).toBe('nav.missing');
      });

      it('should return key when no config is provided', () => {
        const serviceWithoutConfig = createService(null);
        const result = serviceWithoutConfig.translate('welcome');
        expect(result).toBe('welcome');
      });

      it('should return key when locale translations do not exist', () => {
        // Set to a locale that doesn't exist in translations
        currentLanguageSignal.set('fr');

        const result = service.translate('welcome');
        expect(result).toBe('welcome');
      });
    });

    describe('edge cases', () => {
      it('should return key for empty string', () => {
        const result = service.translate('');
        expect(result).toBe('');
      });

      it('should handle keys with special characters', () => {
        const result = service.translate('special_key.with-dash');
        expect(result).toBe('special_key.with-dash');
      });

      it('should return key when result is not a string', () => {
        // When key points to an object instead of string
        const result = service.translate('nav');
        expect(result).toBe('nav');
      });

      it('should return key when result is an object (nested namespace)', () => {
        const result = service.translate('nav.profile');
        expect(result).toBe('nav.profile');
      });
    });
  });

  describe('reactive behavior with AppStore', () => {
    it('should update translations when AppStore language changes', () => {
      expect(service.translate('actions.save')).toBe('Save');

      currentLanguageSignal.set('de');
      expect(service.translate('actions.save')).toBe('Speichern');

      currentLanguageSignal.set('en');
      expect(service.translate('actions.save')).toBe('Save');
    });

    it('should maintain locale consistency with AppStore', () => {
      currentLanguageSignal.set('de');

      expect(service.locale).toBe('de');
      expect(service.localeSignal()).toBe('de');
      expect(service.translate('welcome')).toBe('Willkommen');
    });

    it('should reflect changes made via setLocale in AppStore', () => {
      service.setLocale('de');

      expect(appStoreMock.setLanguage).toHaveBeenCalledWith('de');
      expect(service.locale).toBe('de');
    });
  });
});
