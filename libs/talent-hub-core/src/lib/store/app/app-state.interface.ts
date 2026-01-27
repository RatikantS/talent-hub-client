/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { AppConfig, UserPreference } from '../../interfaces';

/**
 * Represents the global application state for the Talent Hub platform.
 *
 * This interface defines the structure of the root state object managed by the
 * `AppStore`. It includes configuration, user preferences, feature flags,
 * and maintenance mode. All properties are intended to be serializable,
 * type-safe, and suitable for state management, debugging, and UI logic.
 *
 * @remarks
 * **State Properties:**
 * - `isInitialized` - Whether the app has completed its initialization sequence.
 * - `isMaintenanceModeEnabled` - Whether the app is in maintenance mode.
 * - `config` - The current application configuration (`AppConfig`).
 * - `features` - Feature flags for toggling features at runtime.
 * - `preference` - The user's active preferences (theme, language).
 *
 * **Usage:**
 * This interface is used as the state type for `AppStore` and should not be
 * instantiated directly. Access state through the `AppStore` signals and methods.
 *
 * @example
 * ```typescript
 * // The AppStore uses AppState internally
 * const initialState: AppState = {
 *   isInitialized: false,
 *   isMaintenanceModeEnabled: false,
 *   config: null,
 *   features: null,
 *   preference: null,
 * };
 *
 * // Access state via AppStore
 * const appStore = inject(AppStore);
 * if (appStore.isInitialized()) {
 *   console.log('App is ready');
 * }
 * ```
 *
 * @see AppStore
 * @see AppConfig
 * @see UserPreference
 * @publicApi
 */
export interface AppState {
  /**
   * Indicates whether the application has completed its initialization sequence.
   *
   * This flag is set to `true` after the `AppStore.initialize()` method is called
   * with valid configuration and preferences. Use this to guard UI rendering or
   * defer operations until the app is fully initialized.
   *
   * @example
   * ```typescript
   * if (appStore.isInitialized()) {
   *   renderMainContent();
   * } else {
   *   showLoadingScreen();
   * }
   * ```
   */
  isInitialized: boolean;

  /**
   * Indicates whether the application is in maintenance mode.
   *
   * When `true`, the application should display a maintenance UI and restrict
   * normal user interactions. This flag is typically set based on a remote
   * configuration or manual admin action.
   *
   * @remarks
   * Use this flag in route guards, layout components, or interceptors to
   * block access or show maintenance notifications.
   *
   * @example
   * ```typescript
   * // In a route guard
   * if (appStore.isMaintenanceModeEnabled()) {
   *   router.navigate(['/maintenance']);
   *   return false;
   * }
   *
   * // In a template
   * // @if (appStore.isMaintenanceModeEnabled()) {
   * //   <app-maintenance-banner />
   * // }
   * ```
   */
  isMaintenanceModeEnabled: boolean;

  /**
   * The current application configuration.
   *
   * Contains global settings such as environment, app name, version, and logging
   * configuration. Set via `AppStore.setConfig()` or `AppStore.initialize()`.
   * Returns `null` if the configuration has not been loaded yet.
   *
   * @see AppConfig
   *
   * @example
   * ```typescript
   * const config = appStore.getConfig();
   * if (config) {
   *   console.log(`Running ${config.appName} v${config.appVersion}`);
   *   console.log(`Environment: ${config.environment}`);
   * }
   * ```
   */
  config: AppConfig | null;

  /**
   * Feature flags for toggling application features at runtime.
   *
   * A key-value map where the key is the feature name (string) and the value
   * is `true` (enabled) or `false` (disabled). Use `AppStore.isFeatureEnabled()`
   * to check individual flags. Returns `null` if no feature flags have been set.
   *
   * @remarks
   * Feature flags enable controlled rollout of new features, A/B testing,
   * and environment-specific behavior without code changes.
   *
   * @example
   * ```typescript
   * // Set feature flags
   * appStore.setFeatures({
   *   newDashboard: true,
   *   betaFeatures: false,
   *   darkModeV2: true,
   * });
   *
   * // Check a feature flag
   * if (appStore.isFeatureEnabled('newDashboard')) {
   *   loadNewDashboard();
   * }
   * ```
   */
  features: Record<string, boolean> | null;

  /**
   * The user's active preferences.
   *
   * Contains personalization options such as theme (light/dark) and language.
   * Set via `AppStore.setPreference()` or `AppStore.initialize()`. Returns `null`
   * if preferences have not been set yet.
   *
   * @see UserPreference
   *
   * @example
   * ```typescript
   * const pref = appStore.getPreference();
   * if (pref) {
   *   applyTheme(pref.theme);
   *   setLanguage(pref.language);
   * }
   *
   * // Update preferences
   * appStore.setPreference({ theme: Theme.Dark, language: 'de' });
   * ```
   */
  preference: UserPreference | null;
}
