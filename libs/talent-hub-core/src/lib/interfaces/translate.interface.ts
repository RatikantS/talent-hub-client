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
 * Structure for translation messages for a single locale.
 *
 * Each locale has its own TranslationMessages object containing
 * the locale code and a nested object of translation key-value pairs.
 *
 * @example
 * ```typescript
 * const englishMessages: TranslationMessages = {
 *   locale: 'en',
 *   translations: {
 *     nav: {
 *       dashboard: 'Dashboard',
 *       settings: 'Settings'
 *     },
 *     actions: {
 *       save: 'Save',
 *       cancel: 'Cancel'
 *     }
 *   }
 * };
 * ```
 */
export interface TranslationMessages {
  /** The locale code (e.g., 'en', 'de', 'fr') */
  locale: string;

  /** Nested object containing translation key-value pairs */
  translations: Record<string, unknown>;
}

/**
 * Configuration for the TranslateService.
 *
 * Provides the default locale and all available translation message sets.
 * This configuration is provided via `provideTranslateConfig()` in app.config.ts.
 *
 * @example
 * ```typescript
 * import messagesEn from './i18n/en.json';
 * import messagesDe from './i18n/de.json';
 *
 * const translateConfig: TranslateConfig = {
 *   defaultLocale: 'en',
 *   translations: {
 *     en: { locale: 'en', translations: messagesEn },
 *     de: { locale: 'de', translations: messagesDe }
 *   }
 * };
 * ```
 *
 * @see provideTranslateConfig
 * @see TranslateService
 */
export interface TranslateConfig {
  /** The default locale to use when the app starts (e.g., 'en') */
  defaultLocale: string;

  /** Map of locale codes to their translation messages */
  translations: Record<string, TranslationMessages>;
}
