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
 * @fileoverview Tokens Module - Barrel Export
 *
 * This file serves as the public API for all injection tokens in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { provideApiBaseUrl, provideTranslateConfig } from '@talent-hub/core/tokens';
 *
 * // Provide in app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideApiBaseUrl('https://api.talent-hub.com'),
 *     provideTranslateConfig({ defaultLocale: 'en', translations: {...} })
 *   ]
 * };
 * ```
 *
 * ## Available Tokens
 *
 * | Token | Type | Description |
 * |-------|------|-------------|
 * | `API_BASE_URL` | `string` | Base URL for API requests |
 * | `TRANSLATE_CONFIG` | `TranslateConfig` | Translation configuration |
 *
 * @module tokens
 * @publicApi
 */

/** Injection token for API base URL configuration */
export * from './api-base-url.token';

/** Injection token and provider for translation configuration */
export * from './translate.token';
