/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { describe, expect, it } from 'vitest';
import { InjectionToken } from '@angular/core';

import { TranslateConfig } from '../interfaces';
import { provideTranslateConfig, TRANSLATE_CONFIG } from '../tokens';

describe('translate.token', () => {
  const mockConfig: TranslateConfig = {
    defaultLocale: 'en',
    translations: {
      en: {
        locale: 'en',
        translations: {
          welcome: 'Welcome',
          nav: { dashboard: 'Dashboard' },
        },
      },
      de: {
        locale: 'de',
        translations: {
          welcome: 'Willkommen',
          nav: { dashboard: 'Armaturenbrett' },
        },
      },
    },
  };

  describe('TRANSLATE_CONFIG', () => {
    it('should be an InjectionToken', () => {
      expect(TRANSLATE_CONFIG).toBeInstanceOf(InjectionToken);
    });

    it('should have correct token name', () => {
      expect(TRANSLATE_CONFIG.toString()).toBe('InjectionToken TRANSLATE_CONFIG');
    });
  });

  describe('provideTranslateConfig', () => {
    it('should return a provider object', () => {
      const provider = provideTranslateConfig(mockConfig);

      expect(provider).toBeDefined();
      expect(provider).toHaveProperty('provide');
      expect(provider).toHaveProperty('useValue');
    });

    it('should use TRANSLATE_CONFIG as the provide token', () => {
      const provider = provideTranslateConfig(mockConfig);

      expect(provider.provide).toBe(TRANSLATE_CONFIG);
    });

    it('should pass the config as useValue', () => {
      const provider = provideTranslateConfig(mockConfig);

      expect(provider.useValue).toBe(mockConfig);
    });

    it('should preserve defaultLocale in the config', () => {
      const provider = provideTranslateConfig(mockConfig);

      expect(provider.useValue.defaultLocale).toBe('en');
    });

    it('should preserve translations in the config', () => {
      const provider = provideTranslateConfig(mockConfig);

      expect(provider.useValue.translations).toBe(mockConfig.translations);
      expect(provider.useValue.translations['en']).toBeDefined();
      expect(provider.useValue.translations['de']).toBeDefined();
    });

    it('should handle config with single locale', () => {
      const singleLocaleConfig: TranslateConfig = {
        defaultLocale: 'en',
        translations: {
          en: { locale: 'en', translations: { hello: 'Hello' } },
        },
      };

      const provider = provideTranslateConfig(singleLocaleConfig);

      expect(provider.useValue.defaultLocale).toBe('en');
      expect(Object.keys(provider.useValue.translations)).toHaveLength(1);
    });

    it('should handle config with multiple locales', () => {
      const multiLocaleConfig: TranslateConfig = {
        defaultLocale: 'en',
        translations: {
          en: { locale: 'en', translations: {} },
          de: { locale: 'de', translations: {} },
          fr: { locale: 'fr', translations: {} },
          es: { locale: 'es', translations: {} },
        },
      };

      const provider = provideTranslateConfig(multiLocaleConfig);

      expect(Object.keys(provider.useValue.translations)).toHaveLength(4);
    });

    it('should handle config with empty translations', () => {
      const emptyConfig: TranslateConfig = {
        defaultLocale: 'en',
        translations: {
          en: { locale: 'en', translations: {} },
        },
      };

      const provider = provideTranslateConfig(emptyConfig);

      expect(provider.useValue.translations['en'].translations).toEqual({});
    });

    it('should handle config with nested translations', () => {
      const nestedConfig: TranslateConfig = {
        defaultLocale: 'en',
        translations: {
          en: {
            locale: 'en',
            translations: {
              level1: {
                level2: {
                  level3: {
                    deepKey: 'Deep Value',
                  },
                },
              },
            },
          },
        },
      };

      const provider = provideTranslateConfig(nestedConfig);
      const translations = provider.useValue.translations['en'].translations as Record<
        string,
        unknown
      >;

      expect(translations['level1']).toBeDefined();
    });
  });
});
