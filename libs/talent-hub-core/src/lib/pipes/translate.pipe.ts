/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { inject, Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '../services';

/**
 * Pipe for translating keys in templates.
 *
 * This pipe uses the TranslateService to translate keys to localized strings.
 * It is marked as impure (`pure: false`) to support dynamic locale changes,
 * ensuring the UI updates when the user switches languages via AppStore.
 *
 * ## Prerequisites
 *
 * Ensure translation configuration is provided in your app.config.ts:
 *
 * ```typescript
 * import { provideTranslateConfig } from '@talent-hub/core';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTranslateConfig({
 *       defaultLocale: 'en',
 *       translations: { en: messagesEn, de: messagesDe }
 *     })
 *   ]
 * };
 * ```
 *
 * ## Usage
 *
 * ```html
 * <!-- Simple translation -->
 * <h1>{{ 'nav.dashboard' | translate }}</h1>
 *
 * <!-- Nested keys -->
 * <button>{{ 'actions.buttons.save' | translate }}</button>
 *
 * <!-- In attributes -->
 * <input [placeholder]="'form.searchPlaceholder' | translate" />
 *
 * <!-- With conditional content -->
 * <span [attr.aria-label]="'accessibility.closeButton' | translate">×</span>
 * ```
 *
 * ## Behavior
 *
 * - Returns the translated string for the current locale
 * - Returns the original key if translation is not found (helps identify missing translations)
 * - Automatically updates when locale changes via AppStore.setLanguage()
 *
 * ## Architecture
 *
 * The pipe delegates all translation logic to TranslateService, which in turn
 * uses AppStore as the single source of truth for the current language:
 *
 * ```
 * Template → TranslatePipe → TranslateService → AppStore (language)
 *                                    ↓
 *                           TRANSLATE_CONFIG (translations)
 * ```
 *
 * @remarks
 * - This is an **impure pipe** and will be re-evaluated on every change detection cycle.
 * - For performance-critical scenarios with many translations, consider using
 *   TranslateService directly in computed signals.
 * - The pipe is standalone and can be imported directly into components.
 *
 * @see TranslateService
 * @see provideTranslateConfig
 * @see AppStore
 * @since 1.0.0
 * @publicApi
 */
@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  /**
   * Translation service instance for key-to-string resolution.
   *
   * Injected via Angular's `inject()` function. The service handles
   * all translation logic and delegates language management to AppStore.
   *
   * @internal
   */
  private readonly translateService: TranslateService = inject(TranslateService);

  /**
   * Transforms a translation key to its localized string value.
   *
   * Delegates to TranslateService.translate() for the actual translation.
   * Supports dot notation for nested keys (e.g., 'nav.dashboard').
   *
   * @param key - The translation key using dot notation (e.g., 'nav.dashboard')
   * @returns The translated string or the key itself if translation is not found
   *
   * @example
   * ```html
   * <!-- Returns 'Dashboard' for English locale -->
   * {{ 'nav.dashboard' | translate }}
   *
   * <!-- Returns 'Armaturenbrett' for German locale -->
   * {{ 'nav.dashboard' | translate }}
   *
   * <!-- Returns 'missing.key' if not found -->
   * {{ 'missing.key' | translate }}
   * ```
   *
   * @since 1.0.0
   */
  transform(key: string): string {
    return this.translateService.translate(key);
  }
}
