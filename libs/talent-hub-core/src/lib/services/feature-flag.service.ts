/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { inject, Injectable, signal, Signal } from '@angular/core';

import { AppStore } from '../store';

/**
 * FeatureFlagService - Provides feature flag checks using the AppStore.
 *
 * Reads feature flags from the AppStore and exposes methods to check if a feature is enabled.
 *
 * Usage:
 *   const featureFlag = inject(FeatureFlagService);
 *   if (featureFlag.isEnabled('newDashboard')) { ... }
 *
 * Best practices:
 * - Keep feature flag keys as constants or enums for maintainability.
 * - Use signals or observables for reactive UI updates if needed.
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  /**
   * Returns the AppStore instance for feature flag checks.
   * Overridable for testing.
   */
  protected getAppStore(): typeof AppStore {
    return inject(AppStore);
  }

  /**
   * Returns a signal for the feature flag value (reactive).
   *
   * @param key - The feature flag key to observe.
   * @returns Signal<boolean> that updates when the flag changes.
   */
  featureFlagSignal(key: string): Signal<boolean> {
    return signal(!!this.getAppStore().getFeatureFlag(key));
  }

  /**
   * Checks if a feature flag is enabled in the AppStore.
   *
   * @param key - The feature flag key to check.
   * @returns True if enabled, false otherwise.
   */
  isEnabled(key: string): boolean {
    return !!this.getAppStore().getFeatureFlag(key);
  }
}
