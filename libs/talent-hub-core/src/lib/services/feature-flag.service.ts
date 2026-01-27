/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { inject, Injectable, signal, Signal } from '@angular/core';

import { AppStore } from '../store';

/**
 * FeatureFlagService - Provides feature flag checks using the global AppStore.
 *
 * This service acts as a facade over the AppStore's feature flag functionality,
 * providing a clean API for checking whether specific features are enabled.
 * Feature flags allow for controlled rollout of new features, A/B testing,
 * and environment-specific behavior.
 *
 * @remarks
 * - Feature flags are stored in the AppStore as a `Record<string, boolean>`.
 * - Use `isEnabled()` for one-time checks in logic or guards.
 * - Use `featureFlagSignal()` for reactive UI bindings that update when flags change.
 * - Keep feature flag keys as constants or enums for maintainability and refactoring.
 * - Designed for use across all micro-frontends (MFEs) for consistent feature toggling.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly featureFlags = inject(FeatureFlagService);
 *
 * // Check if a feature is enabled (imperative)
 * if (this.featureFlags.isEnabled('newDashboard')) {
 *   this.loadNewDashboard();
 * } else {
 *   this.loadLegacyDashboard();
 * }
 *
 * // Use in a template with a signal (reactive)
 * readonly showBetaFeatures = this.featureFlags.featureFlagSignal('betaFeatures');
 *
 * // In template:
 * // @if (showBetaFeatures()) {
 * //   <app-beta-panel />
 * // }
 * ```
 *
 * @see AppStore
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  /**
   * Reference to the global AppStore (NgRx Signal Store).
   * Used to access feature flags from the application state.
   * @internal
   */
  private readonly appStore = inject(AppStore);

  /**
   * Returns a signal for the feature flag value (reactive).
   *
   * Creates a new signal that reflects the current state of the specified feature flag.
   * Use this method when you need reactive updates in templates or computed values.
   *
   * @param key - The feature flag key to observe (e.g., 'newDashboard', 'darkMode').
   * @returns A `Signal<boolean>` that emits `true` if the feature is enabled, `false` otherwise.
   *
   * @remarks
   * - The returned signal is created at call time with the current flag value.
   * - For truly reactive behavior that updates when flags change, consider using
   *   a computed signal with `this.appStore.isFeatureEnabled(key)` directly.
   *
   * @example
   * ```typescript
   * // Create a reactive signal for template binding
   * readonly isDarkModeEnabled = this.featureFlags.featureFlagSignal('darkMode');
   *
   * // Use in template
   * // @if (isDarkModeEnabled()) {
   * //   <app-dark-theme />
   * // }
   *
   * // Use in computed
   * readonly themeClass = computed(() =>
   *   this.isDarkModeEnabled() ? 'dark-theme' : 'light-theme'
   * );
   * ```
   */
  featureFlagSignal(key: string): Signal<boolean> {
    return signal(this.appStore.isFeatureEnabled(key));
  }

  /**
   * Checks if a feature flag is enabled.
   *
   * Performs a one-time lookup of the feature flag in the AppStore.
   * Use this method for imperative checks in services, guards, or lifecycle hooks.
   *
   * @param key - The feature flag key to check (e.g., 'analyticsV2', 'experimentalApi').
   * @returns `true` if the feature is enabled, `false` if disabled or not defined.
   *
   * @example
   * ```typescript
   * // Check in a service method
   * loadData(): Observable<Data[]> {
   *   if (this.featureFlags.isEnabled('newApiEndpoint')) {
   *     return this.http.get<Data[]>('/api/v2/data');
   *   }
   *   return this.http.get<Data[]>('/api/v1/data');
   * }
   *
   * // Check in a route guard
   * canActivate(): boolean {
   *   return this.featureFlags.isEnabled('premiumFeatures');
   * }
   *
   * // Conditional component initialization
   * ngOnInit(): void {
   *   if (this.featureFlags.isEnabled('advancedAnalytics')) {
   *     this.initializeAnalytics();
   *   }
   * }
   * ```
   */
  isEnabled(key: string): boolean {
    return this.appStore.isFeatureEnabled(key);
  }
}
