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
 * This configuration is provided via `provideTranslateConfig()` in app.config.ts
 * and consumed by the `TranslateService` for internationalization (i18n).
 *
 * @remarks
 * **Configuration Flow:**
 * 1. Define translation JSON files for each supported locale.
 * 2. Import the JSON files in your app configuration.
 * 3. Create a `TranslateConfig` object with the default locale and translations.
 * 4. Provide the configuration using `provideTranslateConfig()`.
 *
 * **Best Practices:**
 * - Keep translation files organized by feature or module.
 * - Use consistent key naming conventions across locales.
 * - Ensure all locales have the same translation keys.
 *
 * @example
 * ```typescript
 * import messagesEn from './i18n/en.json';
 * import messagesDe from './i18n/de.json';
 * import messagesFr from './i18n/fr.json';
 *
 * const translateConfig: TranslateConfig = {
 *   defaultLocale: 'en',
 *   translations: {
 *     en: { locale: 'en', translations: messagesEn },
 *     de: { locale: 'de', translations: messagesDe },
 *     fr: { locale: 'fr', translations: messagesFr },
 *   },
 * };
 *
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTranslateConfig(translateConfig),
 *   ],
 * };
 * ```
 *
 * @see provideTranslateConfig
 * @see TranslateService
 * @see TranslationMessages
 * @publicApi
 */
export interface TranslateConfig {
  /**
   * The default locale to use when the application starts.
   *
   * ISO 639-1 language code (e.g., 'en', 'de', 'fr'). This locale is used
   * when no user preference is set or when the preferred locale is unavailable.
   *
   * @remarks
   * - Should be a key in the `translations` map.
   * - Typically matches the development language or primary user base.
   * - The `TranslateService` falls back to this locale if a translation is missing.
   *
   * @example
   * ```typescript
   * const config: TranslateConfig = {
   *   defaultLocale: 'en', // English as default
   *   translations: { ... },
   * };
   * ```
   */
  defaultLocale: string;

  /**
   * Map of locale codes to their translation message sets.
   *
   * Keys are ISO 639-1 language codes, and values are `TranslationMessages`
   * objects containing the translations for that locale.
   *
   * @remarks
   * - Each locale should have a complete set of translations.
   * - The `defaultLocale` must be present in this map.
   * - Add new locales by importing and adding their translation files.
   *
   * @example
   * ```typescript
   * const config: TranslateConfig = {
   *   defaultLocale: 'en',
   *   translations: {
   *     en: { locale: 'en', translations: enMessages },
   *     de: { locale: 'de', translations: deMessages },
   *     fr: { locale: 'fr', translations: frMessages },
   *   },
   * };
   * ```
   */
  translations: Record<string, TranslationMessages>;
}
