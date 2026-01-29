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
 * import { Environment, Theme, QueryParams, TenantPlan } from '@talent-hub/core/types';
 *
 * function setTheme(theme: Theme): void {
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
 * | `DateFormat` | `'MM/DD/YYYY' \| 'DD/MM/YYYY' \| ...` | Date format patterns |
 * | `DigestFrequency` | `'immediate' \| 'daily' \| 'weekly' \| 'none'` | Email digest frequency |
 * | `Environment` | `'development' \| 'staging' \| 'production'` | Deployment environments |
 * | `LogLevel` | `'fatal' \| 'error' \| 'warn' \| 'info' \| 'debug' \| 'trace'` | Log severity levels |
 * | `QueryParamValue` | `string \| number \| boolean \| undefined \| null` | Single query parameter value |
 * | `QueryParams` | `Record<string, QueryParamValue \| QueryParamValue[]>` | Query parameters object |
 * | `StorageType` | `'local' \| 'session'` | Browser storage mechanism |
 * | `TenantPlan` | `'free' \| 'starter' \| 'professional' \| 'enterprise'` | Subscription plan levels |
 * | `Theme` | `'light' \| 'dark' \| 'system'` | UI theme modes |
 * | `TimeFormat` | `'12h' \| '24h'` | Time display format |
 *
 * @module types
 * @publicApi
 */

/** Environment string literal types for deployment contexts */
export * from './environment.type';

/** Email digest frequency types for notification delivery */
export * from './digest-frequency.type';

/** Date format string literal types */
export * from './date-format.type';

/** Log level string literal types for logging configuration */
export * from './log-level.type';

/** Query parameters type definition */
export * from './query-params.type';

/** Storage mechanism types for StorageService (local, session) */
export * from './storage.type';

/** Tenant subscription plan types (free, starter, professional, enterprise) */
export * from './tenant-plan.type';

/** Theme string literal types for UI theming (light, dark, system) */
export * from './theme.type';

/** Time format string literal types (12hr, 24hr) */
export * from './time-format.type';
