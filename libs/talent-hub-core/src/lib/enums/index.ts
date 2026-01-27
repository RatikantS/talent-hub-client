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
 * @fileoverview Enums Module - Barrel Export
 *
 * This file serves as the public API for all enumerations in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { Environment, LogLevel, Theme } from '@talent-hub/core/enums';
 *
 * if (environment === Environment.Production) {
 *   logger.setLevel(LogLevel.Error);
 * }
 * ```
 *
 * ## Available Enums
 *
 * | Enum | Values | Description |
 * |------|--------|-------------|
 * | `Environment` | Development, Staging, Production | Application environment |
 * | `LogLevel` | Debug, Info, Warn, Error | Logging severity levels |
 * | `Theme` | Light, Dark, System | UI theme options |
 *
 * @module enums
 * @publicApi
 */

/** Application environment types (Development, Staging, Production) */
export * from './environment.enum';

/** Logging severity levels (Debug, Info, Warn, Error) */
export * from './log-level.enum';

/** UI theme options (Light, Dark, System) */
export * from './theme.enum';
