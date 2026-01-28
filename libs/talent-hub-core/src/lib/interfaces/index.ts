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
 * @fileoverview Interfaces Module - Barrel Export
 *
 * This file serves as the public API for all TypeScript interfaces in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { User, AppConfig, HttpOptions, UrlParams } from '@talent-hub/core/interfaces';
 *
 * function loadUser(): User {
 *   return { id: '1', email: 'user@example.com', ... };
 * }
 *
 * function buildApiUrl(params: UrlParams): string {
 *   return ApiUtil.constructURL('/users/{id}', params);
 * }
 * ```
 *
 * ## Available Interfaces
 *
 * | Interface | Description |
 * |-----------|-------------|
 * | `AppConfig` | Application configuration settings |
 * | `CookieOptions` | Cookie storage options |
 * | `EventBusMessage` | Inter-component messaging format |
 * | `HttpOptions` | HTTP request configuration |
 * | `LogConfig` | Logging configuration |
 * | `TranslateConfig` | Translation service configuration |
 * | `TranslationMessages` | Translation messages structure |
 * | `UrlParams` | URL path and query parameter structure |
 * | `User` | User identity and authorization properties |
 * | `UserPreference` | User preference settings |
 *
 * @module interfaces
 * @publicApi
 */

/** Application configuration settings (API URLs, feature flags, etc.) */
export * from './app-config.interface';

/** Cookie storage options (expiry, path, secure, sameSite) */
export * from './cookie-options.interface';

/** Inter-component messaging format for EventBusService */
export * from './event-bus-message.interface';

/** HTTP request configuration options */
export * from './http-options.interface';

/** Logging configuration (levels, output format) */
export * from './log-config.interface';

/** Translation service configuration and messages structure */
export * from './translate.interface';

/** URL path and query parameter structures. */
export * from './url-parameters.interface';

/** User identity and authorization properties (id, email, roles, permissions) */
export * from './user.interface';

/** User preference settings (theme, language, notifications) */
export * from './user-preference.interface';
