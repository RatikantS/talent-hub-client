/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { InjectionToken } from '@angular/core';

/**
 * Injection token for the API base URL used by HTTP interceptors and services.
 *
 * This token should be provided at the application root with the base URL string
 * for all backend API requests. It is used by the ApiPrefixInterceptor to prefix
 * all relative HTTP request URLs, ensuring consistent API endpoint resolution.
 *
 * @example
 *   providers: [
 *     { provide: API_BASE_URL, useValue: 'https://api.example.com/' }
 *   ]
 *
 * @see ApiPrefixInterceptor
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
