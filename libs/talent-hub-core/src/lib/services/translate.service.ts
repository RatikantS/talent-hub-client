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

import { AppConfig, TranslateConfig, TranslationMessages } from '../interfaces';
import { AppStore } from '../store';
import { TRANSLATE_CONFIG } from '../tokens';

/**
 * Service for internationalization (i18n) and translation management.
 *
 * Provides methods for translating keys to localized strings and managing
 * the current locale. Uses `AppStore` as the single source of truth for
 * the current language, ensuring consistency across the application.
 *
 * ## Features
 * - Dot notation key resolution (e.g., 'nav.dashboard')
 * - Reactive locale switching via AppStore
 * - Fallback to key when translation not found
 * - Integration with AppStore for language and supported languages
 *
 * ## Setup
 *
 * Provide translation configuration in your app.config.ts:
 *
 * ```typescript
 * import { provideTranslateConfig } from '@talent-hub/core';
 * import messagesEn from './i18n/en.json';
 * import messagesDe from './i18n/de.json';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTranslateConfig({
 *       defaultLocale: 'en',
 *       translations: {
 *         en: { locale: 'en', translations: messagesEn },
 *         de: { locale: 'de', translations: messagesDe }
 *       }
 *     })
 *   ]
 * };
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { TranslateService } from '@talent-hub/core/services';
 *
 * @Component({...})
 * export class MyComponent {
 *   private translateService = inject(TranslateService);
 *   private appStore = inject(AppStore);
 *
 *   // Get translated string
 *   title = this.translateService.translate('nav.dashboard');
 *
 *   // Switch locale via AppStore (recommended)
 *   switchToGerman() {
 *     this.appStore.setLanguage('de');
 *   }
 *
 *   // Or via TranslateService (delegates to AppStore)
 *   switchToFrench() {
 *     this.translateService.setLocale('fr');
 *   }
 *
 *   // Reactive locale tracking
 *   currentLocale = this.translateService.localeSignal;
 * }
 * ```
 *
 * ## Template Usage
 *
 * Use with the `translate` pipe for template translations:
 *
 * ```html
 * <h1>{{ 'nav.dashboard' | translate }}</h1>
 * ```
 *
 * ## Architecture
 *
 * This service follows a delegation pattern where language state is managed
 * by `AppStore` (single source of truth). The service provides:
 *
 * - **Read operations**: `locale`, `localeSignal`, `availableLocales`
 * - **Write operations**: `setLocale()` (validates and delegates to AppStore)
 * - **Translation**: `translate()` method for key-to-string resolution
 *
 * ```
 * ┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
 * │  Component/Pipe │ ──▶ │ TranslateService │ ──▶ │  AppStore   │
 * └─────────────────┘     └──────────────────┘     └─────────────┘
 *        │                         │                      │
 *        │ translate()             │ locale               │ currentLanguage()
 *        │ setLocale()             │ setLocale()          │ setLanguage()
 *        ▼                         ▼                      ▼
 * ```
 *
 * @remarks
 * - The service is provided in root, making it a singleton across the application.
 * - Translation configuration is optional; without it, keys are returned as-is.
 * - Language changes via `AppStore.setLanguage()` are automatically reflected.
 * - The `TranslatePipe` uses this service for template-based translations.
 *
 * @see TranslatePipe
 * @see provideTranslateConfig
 * @see AppStore
 * @since 1.0.0
 * @publicApi
 */
@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  /**
   * Translation configuration injected via TRANSLATE_CONFIG token.
   *
   * Contains the default locale and all available translations.
   * Injected as optional to allow the service to function without
   * translations (keys are returned as-is).
   *
   * @internal
   */
  private readonly config: TranslateConfig | null = inject(TRANSLATE_CONFIG, { optional: true });

  /**
   * Application store - single source of truth for language preference.
   *
   * All language state is managed by AppStore to ensure consistency
   * across the application. This service delegates language operations
   * to AppStore rather than maintaining its own state.
   *
   * @internal
   */
  private readonly appStore = inject(AppStore);

  /**
   * Gets the current locale code from AppStore.
   *
   * This delegates to `AppStore.currentLanguage()` to ensure a single
   * source of truth for the current language across the application.
   *
   * @returns The current locale code (e.g., 'en', 'de')
   *
   * @example
   * ```typescript
   * const locale = this.translateService.locale; // 'en'
   * ```
   */
  get locale(): string {
    return this.appStore.currentLanguage();
  }

  /**
   * Gets the current locale as a readonly signal for reactive updates.
   *
   * This is a computed signal that derives from `AppStore.currentLanguage()`,
   * ensuring reactive updates when the language changes via AppStore.
   *
   * @returns A readonly signal containing the current locale code
   *
   * @example
   * ```typescript
   * // In a component
   * locale = this.translateService.localeSignal;
   *
   * // In template
   * <span>Current: {{ locale() }}</span>
   * ```
   */
  readonly localeSignal: Signal<string> = computed((): string => this.appStore.currentLanguage());

  /**
   * Gets all available locales as a computed signal.
   *
   * Returns supported languages from AppStore configuration if available,
   * otherwise falls back to the keys from the translation configuration.
   *
   * @returns A signal containing an array of available locale codes
   *
   * @example
   * ```typescript
   * // Get available locales
   * locales = this.translateService.availableLocales;
   *
   * // In template - language selector
   * @for (locale of locales(); track locale) {
   *   <button (click)="switchLocale(locale)">{{ locale }}</button>
   * }
   * ```
   */
  readonly availableLocales: Signal<string[]> = computed((): string[] => {
    const appConfig: AppConfig | null = this.appStore.config();

    // Prefer AppStore's supported languages if configured
    if (appConfig?.supportedLanguages?.length) {
      return appConfig.supportedLanguages;
    }

    // Fallback to translation config keys
    return this.config ? Object.keys(this.config.translations) : [];
  });

  /**
   * Sets the current locale for translations.
   *
   * Delegates to `AppStore.setLanguage()` to maintain a single source of truth.
   * Only sets the locale if translations exist for the specified locale code.
   *
   * @param locale - The locale code to set (e.g., 'en', 'de', 'es')
   * @returns `true` if the locale was set successfully, `false` if locale is not available
   *
   * @example
   * ```typescript
   * // Switch to German
   * const success = this.translateService.setLocale('de');
   * if (!success) {
   *   console.warn('German translations not available');
   * }
   *
   * // Alternatively, use AppStore directly
   * this.appStore.setLanguage('de');
   * ```
   */
  setLocale(locale: string): boolean {
    if (this.config?.translations[locale]) {
      this.appStore.setLanguage(locale);
      return true;
    }
    return false;
  }

  /**
   * Translates a key to its localized string value.
   *
   * Supports dot notation for nested translation keys. Returns the original
   * key if no translation is found, making it easy to identify missing translations.
   *
   * @param key - The translation key using dot notation (e.g., 'nav.dashboard', 'errors.notFound')
   * @returns The translated string, or the key itself if translation is not found
   *
   * @example
   * ```typescript
   * // Simple key
   * this.translateService.translate('welcome'); // 'Welcome'
   *
   * // Nested key
   * this.translateService.translate('nav.dashboard'); // 'Dashboard'
   *
   * // Missing key returns the key itself
   * this.translateService.translate('missing.key'); // 'missing.key'
   * ```
   */
  translate(key: string): string {
    // Return key if no config is provided
    if (!this.config) {
      return key;
    }

    // Get translations for current locale from AppStore
    const currentLocale: string = this.appStore.currentLanguage();
    const translations: TranslationMessages = this.config.translations[currentLocale];
    if (!translations) {
      return key;
    }

    // Navigate through nested keys using dot notation
    const keys: string[] = key.split('.');
    let result: unknown = translations.translations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        // Key not found, return original key
        return key;
      }
    }

    // Return translated string or key if result is not a string
    return typeof result === 'string' ? result : key;
  }
}
