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
 * @fileoverview Interceptors Module - Barrel Export
 *
 * This file serves as the public API for all HTTP interceptors in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * import {
 *   authInterceptor,
 *   errorHandlingInterceptor,
 *   loadingIndicatorInterceptor
 * } from '@talent-hub/core/interceptors';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([
 *         authInterceptor,
 *         errorHandlingInterceptor,
 *         loadingIndicatorInterceptor
 *       ])
 *     )
 *   ]
 * };
 * ```
 *
 * ## Available Interceptors
 *
 * | Interceptor | Description |
 * |-------------|-------------|
 * | `apiPrefixInterceptor` | Adds API base URL prefix to requests |
 * | `authInterceptor` | Attaches authentication tokens to requests |
 * | `cacheInterceptor` | Caches HTTP responses for performance |
 * | `errorHandlingInterceptor` | Global error handling and transformation |
 * | `loadingIndicatorInterceptor` | Manages loading state during requests |
 *
 * ## Recommended Order
 *
 * 1. `apiPrefixInterceptor` - URL transformation first
 * 2. `authInterceptor` - Add auth headers
 * 3. `cacheInterceptor` - Check cache before request
 * 4. `loadingIndicatorInterceptor` - Track loading state
 * 5. `errorHandlingInterceptor` - Handle errors last
 *
 * @module interceptors
 * @publicApi
 */

/** Adds API base URL prefix to all relative HTTP requests */
export * from './api-prefix.interceptor';

/** Attaches JWT/Bearer tokens to outgoing requests */
export * from './auth.interceptor';

/** Caches HTTP responses based on URL and method */
export * from './cache.interceptor';

/** Global error handling, transforms errors to user-friendly messages */
export * from './error-handling.interceptor';

/** Manages global loading indicator state during HTTP requests */
export * from './loading-indicator.interceptor';
