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
 * Interface for URL path and query parameters.
 *
 * Used to define key-value pairs for replacing placeholders in URL templates
 * or building query strings. Supports primitive types and string arrays.
 *
 * ## Supported Value Types
 *
 * | Type | Example | Use Case |
 * |------|---------|----------|
 * | `string` | `'abc123'` | User IDs, slugs, names |
 * | `number` | `123` | Numeric IDs, page numbers |
 * | `boolean` | `true` | Flags, toggles |
 * | `string[]` | `['a', 'b']` | Multi-value query params |
 *
 * ## Usage with Path Parameters
 *
 * ```typescript
 * import { ApiUtil } from '@talent-hub/core/utils';
 * import { UrlParams } from '@talent-hub/core/interfaces';
 *
 * const params: UrlParams = {
 *   userId: 123,
 *   postId: 'abc-456'
 * };
 *
 * const url = ApiUtil.constructURL('/users/{userId}/posts/{postId}', params);
 * // Result: '/users/123/posts/abc-456'
 * ```
 *
 * ## Usage with Query Parameters
 *
 * ```typescript
 * const queryParams: UrlParams = {
 *   page: 1,
 *   limit: 10,
 *   active: true,
 *   tags: ['angular', 'typescript']
 * };
 *
 * const query = ApiUtil.buildQueryParams(queryParams);
 * // Result: '?page=1&limit=10&active=true&tags=angular&tags=typescript'
 * ```
 *
 * @see ApiUtil.constructURL
 * @see ApiUtil.buildQueryParams
 */
export type UrlParams = Record<string, string | number | boolean | string[]>;
