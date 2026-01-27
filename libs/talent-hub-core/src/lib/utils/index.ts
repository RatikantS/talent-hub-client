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
 * @fileoverview Utilities Module - Barrel Export
 *
 * This file serves as the public API for all utility functions in the talent-hub-core library.
 * Import utilities from this module for consistent access across all micro-frontends.
 *
 * @remarks
 * **Available Utilities:**
 * | Utility | Description |
 * |---------|-------------|
 * | `AppUtil` | Application-level utilities (dev mode detection) |
 * | `PlatformUtil` | Platform detection (browser, server, mobile, desktop) |
 *
 * **Usage:**
 * Import utilities using the barrel export path:
 * ```typescript
 * import { AppUtil, PlatformUtil } from '@talent-hub/core';
 * ```
 *
 * @example
 * ```typescript
 * import { PlatformUtil, AppUtil } from '@talent-hub/core';
 *
 * // Check if running in browser
 * if (PlatformUtil.isBrowser()) {
 *   localStorage.setItem('key', 'value');
 * }
 *
 * // Check if in development mode
 * if (AppUtil.isDevMode()) {
 *   console.log('Development mode active');
 * }
 *
 * // Device-specific behavior
 * if (PlatformUtil.isMobile()) {
 *   loadMobileStyles();
 * }
 * ```
 *
 * @publicApi
 */

/** Application-level utility functions (dev mode detection, etc.) */
export * from './app.util';

/** Platform detection utilities (browser, server, mobile, desktop) */
export * from './platform.util';
