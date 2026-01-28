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
 * Type for individual query parameter values.
 *
 * Represents the allowed primitive types for a single query parameter value.
 * Includes `undefined` and `null` which are excluded when building query strings.
 *
 * | Type | Example | Serialized As |
 * |------|---------|---------------|
 * | `string` | `'hello'` | `param=hello` |
 * | `number` | `42` | `param=42` |
 * | `boolean` | `true` | `param=true` |
 * | `undefined` | `undefined` | *(excluded)* |
 * | `null` | `null` | *(excluded)* |
 *
 * @example
 * ```typescript
 * const value1: QueryParamValue = 'search term';
 * const value2: QueryParamValue = 42;
 * const value3: QueryParamValue = true;
 * const value4: QueryParamValue = undefined; // Will be excluded
 * ```
 *
 * @see QueryParams
 * @see ApiUtil.buildQueryParams
 */
export type QueryParamValue = string | number | boolean | undefined | null;

/**
 * Type for query parameters object.
 *
 * Represents a collection of query parameters as key-value pairs.
 * Values can be single primitives or arrays of primitives for multi-value parameters.
 *
 * ## Single Value Parameters
 *
 * ```typescript
 * const params: QueryParams = {
 *   page: 1,
 *   search: 'angular',
 *   active: true
 * };
 * // Builds: '?page=1&search=angular&active=true'
 * ```
 *
 * ## Array Value Parameters
 *
 * Arrays are serialized as multiple parameters with the same key:
 *
 * ```typescript
 * const params: QueryParams = {
 *   tags: ['angular', 'typescript', 'signals']
 * };
 * // Builds: '?tags=angular&tags=typescript&tags=signals'
 * ```
 *
 * ## Mixed Parameters
 *
 * ```typescript
 * const params: QueryParams = {
 *   page: 1,
 *   limit: 10,
 *   tags: ['frontend', 'backend'],
 *   includeArchived: false,
 *   search: undefined // Will be excluded
 * };
 * // Builds: '?page=1&limit=10&tags=frontend&tags=backend&includeArchived=false'
 * ```
 *
 * @see QueryParamValue
 * @see ApiUtil.buildQueryParams
 * @see ApiUtil.parseQueryParams
 */
export type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;
