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
 * @fileoverview Constants Module - Barrel Export
 *
 * This file serves as the public API for all application constants in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { APP_CONSTANTS } from '@talent-hub/core/constants';
 *
 * const timeout = APP_CONSTANTS.API_TIMEOUT;
 * ```
 *
 * @module constants
 * @publicApi
 */

/** Application-wide constants (timeouts, defaults, limits) */
export * from './app.constant';
