/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { UrlParams } from '../interfaces';
import { QueryParams, QueryParamValue } from '../types';

/**
 * Utility class for API URL operations.
 *
 * Provides static methods for building, parsing, and manipulating URLs
 * commonly used in API requests. All methods are stateless and can be
 * called directly on the class.
 *
 * ## Features
 *
 * - **Path Parameter Replacement**: Replace `{param}` placeholders in URL templates
 * - **Query String Building**: Convert objects to URL-encoded query strings
 * - **Query String Parsing**: Parse query strings back to objects
 *
 * ## Usage
 *
 * ```typescript
 * import { ApiUtil } from '@talent-hub/core/utils';
 *
 * // Replace path parameters
 * const userUrl = ApiUtil.replacePathParams('/users/{id}', { id: 123 });
 * // Result: '/users/123'
 *
 * // Build query params
 * const query = ApiUtil.buildQueryParams({ page: 1, search: 'test' });
 * // Result: '?page=1&search=test'
 *
 * // Parse query params
 * const params = ApiUtil.parseQueryParams('?page=1&search=test');
 * // Result: { page: '1', search: 'test' }
 *
 * // Combine for full URL construction
 * const baseUrl = '/api/users/{userId}/posts';
 * const fullUrl = ApiUtil.replacePathParams(baseUrl, { userId: 42 })
 *   + ApiUtil.buildQueryParams({ page: 1, limit: 10 });
 * // Result: '/api/users/42/posts?page=1&limit=10'
 * ```
 *
 * @see UrlParams
 * @see QueryParams
 */
export class ApiUtil {
  /**
   * Replaces path parameters in a URL template with provided values.
   *
   * Substitutes `{param}` placeholders in the URL template with corresponding
   * values from the params object. Values are converted to strings.
   *
   * @param url - URL template with `{param}` placeholders
   * @param params - Object containing parameter values to substitute
   * @returns URL with parameters replaced
   *
   * @example
   * ```typescript
   * ApiUtil.replacePathParams('/users/{userId}/posts/{postId}', { userId: 1, postId: 42 });
   * // Returns: '/users/1/posts/42'
   *
   * ApiUtil.replacePathParams('/api/v1/items/{id}', { id: 'abc123' });
   * // Returns: '/api/v1/items/abc123'
   *
   * ApiUtil.replacePathParams('/users/{id}', {});
   * // Returns: '/users/{id}' (unreplaced placeholder)
   * ```
   */
  static replacePathParams(url: string, params?: UrlParams): string {
    if (!params) {
      return url;
    }

    let result: string = url;
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        result = result.replace(`{${key}}`, encodeURIComponent(String(value)));
      }
    }
    return result;
  }

  /**
   * Builds a query string from an object of parameters.
   *
   * Handles string, number, boolean, and array values. Undefined and null
   * values are excluded from the output. Array values are serialized as
   * multiple parameters with the same key.
   *
   * @param params - Object containing query parameter key-value pairs
   * @returns Query string starting with '?' or empty string if no valid params
   *
   * @example
   * ```typescript
   * ApiUtil.buildQueryParams({ page: 1, search: 'test', active: true });
   * // Returns: '?page=1&search=test&active=true'
   *
   * ApiUtil.buildQueryParams({ tags: ['angular', 'typescript'] });
   * // Returns: '?tags=angular&tags=typescript'
   *
   * ApiUtil.buildQueryParams({ value: undefined, name: null });
   * // Returns: ''
   *
   * ApiUtil.buildQueryParams({ search: 'hello world' });
   * // Returns: '?search=hello%20world'
   * ```
   */
  static buildQueryParams(params: QueryParams): string {
    const queryParts: string[] = [];

    for (const key in params) {
      const value: QueryParamValue | QueryParamValue[] = params[key];

      // Skip undefined and null values
      if (value === undefined || value === null) {
        continue;
      }

      // Handle array values - serialize as multiple params with same key
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null) {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
          }
        }
      } else {
        // Handle primitive values (string, number, boolean)
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }

    return queryParts.length ? `?${queryParts.join('&')}` : '';
  }

  /**
   * Parses a query string into an object.
   *
   * Handles URL-encoded values and converts them back to their original form.
   * Does not attempt type conversion (all values remain strings).
   * For duplicate keys, the last value wins.
   *
   * @param queryString - Query string to parse (with or without leading '?')
   * @returns Object with parsed key-value pairs
   *
   * @example
   * ```typescript
   * ApiUtil.parseQueryParams('?page=1&search=test');
   * // Returns: { page: '1', search: 'test' }
   *
   * ApiUtil.parseQueryParams('name=John%20Doe&active=true');
   * // Returns: { name: 'John Doe', active: 'true' }
   *
   * ApiUtil.parseQueryParams('');
   * // Returns: {}
   *
   * ApiUtil.parseQueryParams('?key=');
   * // Returns: { key: '' }
   * ```
   */
  static parseQueryParams(queryString: string): Record<string, string> {
    const result: Record<string, string> = {};

    // Remove leading '?' if present
    const normalized: string = queryString.startsWith('?') ? queryString.slice(1) : queryString;

    // Return empty object for empty string
    if (!normalized) {
      return result;
    }

    // Split by '&' and parse each key=value pair
    const pairs: string[] = normalized.split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        // Decode both key and value, handle missing value as empty string
        result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    }

    return result;
  }
}
