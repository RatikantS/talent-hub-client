/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { isDevMode } from '@angular/core';

/**
 * Utility class for application-level helper functions.
 *
 * Provides static methods for common application utilities such as development
 * mode detection. The class is designed to be testable by allowing internal
 * implementations to be mocked.
 *
 * @remarks
 * **Available Methods:**
 * - `isDevMode()` - Check if the application is running in Angular development mode.
 *
 * **Testability:**
 * The internal implementation can be overridden for testing purposes, allowing
 * unit tests to simulate both development and production modes.
 *
 * **Angular Integration:**
 * Uses Angular's `isDevMode()` function under the hood, which checks if the
 * application was built with the development configuration.
 *
 * @example
 * ```typescript
 * // Check if running in development mode
 * if (AppUtil.isDevMode()) {
 *   console.log('Running in development mode');
 *   enableDebugTools();
 * }
 *
 * // Conditional logging
 * if (AppUtil.isDevMode()) {
 *   console.debug('Debug info:', data);
 * }
 *
 * // Environment-specific configuration
 * const apiUrl = AppUtil.isDevMode()
 *   ? 'http://localhost:3000/api'
 *   : 'https://api.talent-hub.com';
 * ```
 *
 * @see https://angular.io/api/core/isDevMode
 * @publicApi
 */
export class AppUtil {
  /**
   * Internal function reference for development mode detection.
   *
   * Defaults to Angular's `isDevMode()` function. This private reference
   * allows the implementation to be swapped for testing purposes.
   *
   * @internal
   */
  private static _isDevModeFn: () => boolean = isDevMode;

  /**
   * Checks if the application is running in Angular development mode.
   *
   * Returns `true` if the application was built with the development configuration
   * (e.g., `ng serve` or `ng build` without `--configuration production`).
   * Returns `false` for production builds.
   *
   * @returns `true` if in development mode, `false` if in production mode.
   *
   * @remarks
   * **Use Cases:**
   * - Enable/disable debugging features based on environment.
   * - Show development-only UI elements (debug panels, performance metrics).
   * - Use different API endpoints for development vs. production.
   * - Enable verbose logging in development.
   *
   * **How It Works:**
   * Uses Angular's `isDevMode()` function, which is set based on the build
   * configuration. Production builds call `enableProdMode()` which causes
   * this to return `false`.
   *
   * **Testing:**
   * The internal implementation can be mocked for testing by accessing
   * the private `_isDevModeFn` property (use with caution in tests only).
   *
   * @example
   * ```typescript
   * // Enable debug tools in development
   * if (AppUtil.isDevMode()) {
   *   enableAngularDevTools();
   *   console.log('Development mode active');
   * }
   *
   * // Show debug panel only in development
   * @Component({
   *   template: `
   *     @if (isDevMode) {
   *       <app-debug-panel />
   *     }
   *   `
   * })
   * export class AppComponent {
   *   isDevMode = AppUtil.isDevMode();
   * }
   *
   * // Development-only logging
   * if (AppUtil.isDevMode()) {
   *   console.table(debugData);
   * }
   * ```
   */
  static isDevMode(): boolean {
    return AppUtil._isDevModeFn();
  }
}
