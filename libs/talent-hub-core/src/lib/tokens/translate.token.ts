/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { InjectionToken } from '@angular/core';

import { TranslateConfig } from '../interfaces';

/**
 * Injection token for providing translation configuration to TranslateService.
 *
 * This token is used internally by TranslateService to receive the translation
 * configuration. For most use cases, prefer using `provideTranslateConfig()`
 * which provides a cleaner API for configuration.
 *
 * ## Usage
 *
 * Prefer using the provider function:
 *
 * ```typescript
 * // Recommended: Use provideTranslateConfig()
 * provideTranslateConfig({
 *   defaultLocale: 'en',
 *   translations: { en: messagesEn, de: messagesDe }
 * })
 * ```
 *
 * Direct token usage (advanced/testing scenarios):
 *
 * ```typescript
 * // Direct token usage
 * { provide: TRANSLATE_CONFIG, useValue: config }
 *
 * // In tests - inject to verify configuration
 * const config = TestBed.inject(TRANSLATE_CONFIG);
 * ```
 *
 * @see provideTranslateConfig
 * @see TranslateService
 * @see TranslateConfig
 */
export const TRANSLATE_CONFIG = new InjectionToken<TranslateConfig>('TRANSLATE_CONFIG');

/**
 * Provider function for translation configuration.
 *
 * This is the recommended way to configure the TranslateService.
 * Call this function in your app.config.ts providers array.
 *
 * @param config - Translation configuration containing:
 *   - `defaultLocale`: The initial locale code (e.g., 'en')
 *   - `translations`: Map of locale codes to TranslationMessages
 * @returns Provider object for TRANSLATE_CONFIG token
 *
 * @example
 * ```typescript
 * // app.config.ts
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
 * @see TranslateService
 * @see TranslateConfig
 * @see TranslatePipe
 * @publicApi
 */
export function provideTranslateConfig(config: TranslateConfig) {
  return {
    provide: TRANSLATE_CONFIG,
    useValue: config,
  };
}
