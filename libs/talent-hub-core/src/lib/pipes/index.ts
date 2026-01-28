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
 * @fileoverview Pipes Module - Barrel Export
 *
 * This file serves as the public API for all Angular pipes in the talent-hub-core library.
 *
 * ## Prerequisites
 *
 * Translation pipes require configuration via `provideTranslateConfig()`:
 *
 * ```typescript
 * // app.config.ts
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
 * ```typescript
 * import { TranslatePipe } from '@talent-hub/core/pipes';
 *
 * @Component({
 *   imports: [TranslatePipe],
 *   template: `
 *     <h1>{{ 'nav.dashboard' | translate }}</h1>
 *     <button>{{ 'actions.save' | translate }}</button>
 *   `
 * })
 * export class MyComponent {}
 * ```
 *
 * ## Available Pipes
 *
 * | Pipe | Description |
 * |------|-------------|
 * | `TranslatePipe` | Translates keys to localized strings using TranslateService |
 *
 * @module pipes
 * @publicApi
 */

/** Translation pipe for i18n support in templates */
export * from './translate.pipe';
