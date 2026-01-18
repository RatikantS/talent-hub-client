/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { isDevMode } from '@angular/core';

export class AppUtil {
  /**
   * Internal function for dev mode check.
   * Defaults to Angular's isDevMode().
   * Used as the implementation for AppUtil.isDevMode().
   */
  private static _isDevModeFn: () => boolean = isDevMode;

  /**
   * Returns true if the application is running in Angular development mode.
   * Uses Angular's isDevMode() under the hood, but can be mocked in tests.
   *
   * @returns {boolean} True if in dev mode, false otherwise.
   */
  static isDevMode(): boolean {
    return AppUtil._isDevModeFn();
  }
}
