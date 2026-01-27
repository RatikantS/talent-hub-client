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
 * import { EnvironmentType, ThemeType, StorageType } from '@talent-hub/core/types';
 *
 * function setTheme(theme: ThemeType): void {
 *   document.body.dataset.theme = theme;
 * }
 * ```
 *
 * ## Available Types
 *
 * | Type | Definition | Description |
 * |------|------------|-------------|
 * | `EnvironmentType` | `'development' \| 'staging' \| 'production'` | Environment string literals |
 * | `LogLevelType` | `'debug' \| 'info' \| 'warn' \| 'error'` | Log level string literals |
 * | `StorageType` | `'local' \| 'session'` | Storage mechanism types |
 * | `ThemeType` | `'light' \| 'dark' \| 'system'` | Theme string literals |
 *
 * @module types
 * @publicApi
 */

/** Environment string literal types */
export * from './environment.type';

/** Log level string literal types */
export * from './log-level.type';

/** Storage mechanism types (local, session) */
export * from './storage.type';

/** Theme string literal types */
export * from './theme.type';
