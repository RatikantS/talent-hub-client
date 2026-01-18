/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { computed, inject, Injectable, Signal } from '@angular/core';

import { AppStore } from '../store';

/**
 * FeatureFlagService - Provides access to feature flag state from the global AppStore.
 *
 * This service uses Angular signals and the NgRx Signal Store (AppStore) to expose
 * feature flags as a computed signal and provides a method to check if a specific
 * feature flag is enabled. Designed for use in guards, components, and services
 * that require feature toggling logic.
 *
 * Usage:
 *   const featureFlagService = inject(FeatureFlagService);
 *   if (featureFlagService.isEnabled('myFeature')) { ... }
 *
 * - Uses strict typing and avoids any.
 * - Returns false if the feature flag or config is not set.
 * - Designed for global state management and reactivity.
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  /**
   * Reference to the global AppStore (NgRx Signal Store).
   * Used to access the current feature flag state.
   */
  private readonly appStore: typeof AppStore = inject(AppStore);

  /**
   * Computed signal for all feature flags.
   *
   * Returns the features object from AppConfig, or an empty object if not set.
   * This allows for reactive access to feature flags in components and services.
   *
   * Example:
   *   featureFlagService.features(); // { myFeature: true, otherFeature: false }
   */
  readonly features: Signal<Record<string, boolean>> = computed(
    (): Record<string, boolean> => this.appStore.getConfig()?.features ?? {},
  );

  /**
   * Returns true if the given feature flag is enabled.
   *
   * This method checks the features object for the specified flag and returns its boolean value.
   * If the features object or the flag is not set, returns false.
   *
   * Example:
   *   featureFlagService.isEnabled('myFeature'); // true or false
   *
   * @param flag - The feature flag key to check
   * @returns {boolean} True if the feature is enabled, false otherwise.
   */
  isEnabled(flag: string): boolean {
    // Returns false if features object is missing or the flag is not set.
    return !!this.features()[flag];
  }
}
