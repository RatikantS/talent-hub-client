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
 * @fileoverview Types Module - Barrel Export
 *
 * This file serves as the public API for all TypeScript type definitions in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { EnvironmentType, ThemeType, QueryParams } from '@talent-hub/core/types';
 *
 * function setTheme(theme: ThemeType): void {
 *   document.body.dataset.theme = theme;
 * }
 *
 * function buildApiUrl(params: QueryParams): string {
 *   return ApiUtil.buildQueryParams(params);
 * }
 * ```
 *
 * ## Available Types
 *
 * | Type | Definition | Description |
 * |------|------------|-------------|
 * | `EnvironmentType` | `'development' \| 'staging' \| 'production'` | Environment string literals |
 * | `LogLevelType` | `'debug' \| 'info' \| 'warn' \| 'error'` | Log level string literals |
 * | `QueryParamValue` | `string \| number \| boolean \| undefined \| null` | Single query parameter value |
 * | `QueryParams` | `Record<string, QueryParamValue \| QueryParamValue[]>` | Query parameters object |
 * | `StorageType` | `'local' \| 'session'` | Storage mechanism types |
 * | `ThemeType` | `'light' \| 'dark' \| 'system'` | Theme string literals |
 *
 * @module types
 * @publicApi
 */

/** Environment string literal types for deployment contexts */
export * from './environment.type';

/** Log level string literal types for logging configuration */
export * from './log-level.type';

/** Query parameters type definition */
export * from './query-params.type';

/** Storage mechanism types for StorageService (local, session) */
export * from './storage.type';

/** Theme string literal types for UI theming (light, dark, system) */
export * from './theme.type';
