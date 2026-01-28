/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { AppConfig, UserPreference } from '../../interfaces';
import { AppState } from './app-state.interface';
import { AsyncState } from '../async-state.interface';
import { APP_CONSTANT } from '../../constants';
import { Environment, LogLevel, Theme } from '../../enums';

/**
 * Initial application state for AppStore.
 *
 * This object defines the default values for all state properties managed by the store.
 * The state is reset to these values when the application first loads or when explicitly reset.
 *
 * @remarks
 * - `isInitialized` - Indicates whether the app has completed its initialization sequence.
 * - `isMaintenanceModeEnabled` - When `true`, the app displays a maintenance UI and restricts user actions.
 * - `config` - Holds the application configuration (`AppConfig`) or `null` if not yet loaded.
 * - `features` - Feature flags as a key-value map (`Record<string, boolean>`) or `null`.
 * - `preference` - User preferences (theme, language) or `null` if not set.
 * - `isLoading` - Indicates if an async operation is currently in progress.
 * - `error` - Holds the current error object (if any) from failed operations.
 *
 * @internal
 */
const initialState: AppState & AsyncState = {
  isInitialized: false,
  isMaintenanceModeEnabled: false,
  config: null,
  features: null,
  preference: null,
  isLoading: false,
  error: undefined,
};

/**
 * AppStore - Global signal-based state store for the Talent Hub application.
 *
 * This store manages application-wide configuration, user preferences, environment settings,
 * logging configuration, feature toggles, and maintenance mode. It leverages Angular signals
 * and NgRx SignalStore for reactive, type-safe, and immutable state management.
 *
 * @remarks
 * **Key Responsibilities:**
 * - Holds the root application state (`AppState`) and async state (`AsyncState`).
 * - Manages user preferences (theme, language) as a single source of truth.
 * - Provides computed properties for UI bindings (e.g., `isDarkMode`, `isLightMode`, `currentTheme`).
 * - Exposes methods to update state (`initialize`, `setTheme`, `setLanguage`, `setMaintenanceMode`, etc.).
 * - Supports feature toggling via `isFeatureEnabled()` and `setFeatures()`.
 * - Gracefully handles optional `logConfig` in `AppConfig` with safe defaults.
 *
 * **State Signals (Readable):**
 * - `isInitialized()` - Whether the app has been initialized.
 * - `isMaintenanceModeEnabled()` - Whether maintenance mode is active.
 * - `config()` - The current `AppConfig` or `null`.
 * - `features()` - The current feature flags or `null`.
 * - `preference()` - The current `UserPreference` or `null`.
 * - `isLoading()` - Whether an async operation is in progress.
 * - `error()` - The current error object, if any.
 *
 * **Computed Signals:**
 * - `isLightMode()` - `true` if user's theme is light.
 * - `isDarkMode()` - `true` if user's theme is dark.
 * - `currentTheme()` - The active theme (falls back to default).
 * - `currentLanguage()` - The active language (falls back to default).
 * - `currentEnvironment()` - The active environment (falls back to default).
 * - `currentLogLevel()` - The active log level or `undefined`.
 *
 * @example
 * ```typescript
 * // Inject the store in a component or service
 * private readonly appStore = inject(AppStore);
 *
 * // Initialize the app with config and preferences
 * this.appStore.initialize(appConfig, userPreference);
 *
 * // Check and toggle theme
 * if (this.appStore.isDarkMode()) {
 *   this.appStore.setTheme(Theme.Light);
 * }
 *
 * // Check feature flags
 * if (this.appStore.isFeatureEnabled('newDashboard')) {
 *   this.loadNewDashboard();
 * }
 *
 * // Enable maintenance mode
 * this.appStore.setMaintenanceModeEnabled(true);
 *
 * // Use computed signals in templates
 * // @if (appStore.isMaintenanceModeEnabled()) {
 * //   <app-maintenance-page />
 * // }
 * ```
 *
 * @see AppState
 * @see AppConfig
 * @see UserPreference
 * @see AsyncState
 * @publicApi
 */
export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // COMPUTED SIGNALS
  withComputed(({ preference, config }) => ({
    /**
     * Computed signal that returns `true` if the user's theme is set to light mode.
     *
     * @returns `true` if `preference.theme === Theme.Light`, otherwise `false`.
     *
     * @example
     * ```typescript
     * if (appStore.isLightMode()) {
     *   document.body.classList.add('light-theme');
     * }
     * ```
     */
    isLightMode: computed((): boolean => preference()?.theme === Theme.Light),

    /**
     * Computed signal that returns `true` if the user's theme is set to dark mode.
     *
     * @returns `true` if `preference.theme === Theme.Dark`, otherwise `false`.
     *
     * @example
     * ```typescript
     * if (appStore.isDarkMode()) {
     *   document.body.classList.add('dark-theme');
     * }
     * ```
     */
    isDarkMode: computed((): boolean => preference()?.theme === Theme.Dark),

    /**
     * Computed signal that returns the current theme for the user.
     *
     * Falls back to `APP_CONSTANT.DEFAULT_THEME` if the preference is not set.
     *
     * @returns The user's theme (`Theme.Light` or `Theme.Dark`), or the default theme.
     *
     * @example
     * ```typescript
     * const theme = appStore.currentTheme();
     * applyTheme(theme);
     * ```
     */
    currentTheme: computed((): Theme => preference()?.theme ?? APP_CONSTANT.DEFAULT_THEME),

    /**
     * Computed signal that returns the current language for the user.
     *
     * Falls back to `APP_CONSTANT.DEFAULT_LANGUAGE` if the preference is not set.
     *
     * @returns The user's language code (e.g., 'en', 'de', 'fr'), or the default language.
     *
     * @example
     * ```typescript
     * const lang = appStore.currentLanguage();
     * translateService.use(lang);
     * ```
     */
    currentLanguage: computed(
      (): string => preference()?.language ?? APP_CONSTANT.DEFAULT_LANGUAGE,
    ),

    /**
     * Computed signal that returns the current environment from config.
     *
     * Falls back to `APP_CONSTANT.DEFAULT_ENVIRONMENT` if config is not set.
     *
     * @returns The current environment (`Environment.Development`, `Environment.Production`, etc.).
     *
     * @example
     * ```typescript
     * if (appStore.currentEnvironment() === Environment.Production) {
     *   enableProductionOptimizations();
     * }
     * ```
     */
    currentEnvironment: computed(() => config()?.environment ?? APP_CONSTANT.DEFAULT_ENVIRONMENT),

    /**
     * Computed signal that returns the current log level from config.
     *
     * Returns `undefined` if `logConfig` is not set in `AppConfig`.
     *
     * @returns The current log level (`LogLevel`), or `undefined` if not configured.
     *
     * @example
     * ```typescript
     * const level = appStore.currentLogLevel();
     * if (level === LogLevel.Debug) {
     *   enableVerboseLogging();
     * }
     * ```
     */
    currentLogLevel: computed(() => config()?.logConfig?.level),
  })),

  // METHODS
  withMethods((store) => ({
    /**
     * Initializes the application with configuration and user preferences.
     *
     * This method should be called once during application bootstrap to set up
     * the initial state. It sets `isInitialized` to `true` after applying the config
     * and preferences.
     *
     * @param config - The application configuration object.
     * @param preference - The user preference object (theme, language, etc.).
     *
     * @example
     * ```typescript
     * // In app initializer or bootstrap
     * appStore.initialize(
     *   { appName: 'Talent Hub', appVersion: '1.0.0', environment: Environment.Production },
     *   { theme: Theme.Dark, language: 'en' }
     * );
     * ```
     */
    initialize(config: AppConfig, preference: UserPreference): void {
      patchState(store, {
        config,
        preference,
        isInitialized: true,
      });
    },

    /**
     * Returns the current environment value from config.
     *
     * Falls back to `APP_CONSTANT.DEFAULT_ENVIRONMENT` if config is not set.
     *
     * @returns The current environment (e.g., `Environment.Development`, `Environment.Production`).
     *
     * @example
     * ```typescript
     * const env = appStore.getEnvironment();
     * console.log(`Running in ${env} mode`);
     * ```
     */
    getEnvironment(): Environment {
      return store.config()?.environment ?? APP_CONSTANT.DEFAULT_ENVIRONMENT;
    },

    /**
     * Sets the current environment in config.
     *
     * Does nothing if config is `null`. Use `setConfig()` first to initialize config.
     *
     * @param environment - The new environment value to set.
     *
     * @example
     * ```typescript
     * appStore.setEnvironment(Environment.Production);
     * ```
     */
    setEnvironment(environment: Environment): void {
      const config: AppConfig | null = store.config();
      if (!config) return;
      patchState(store, { config: { ...config, environment } });
    },

    /**
     * Returns the current log level from `config.logConfig`.
     *
     * Returns `undefined` if `logConfig` is not set in `AppConfig`.
     *
     * @returns The current log level, or `undefined` if not configured.
     *
     * @example
     * ```typescript
     * const level = appStore.getLogLevel();
     * if (level === LogLevel.Error) {
     *   // Only log errors
     * }
     * ```
     */
    getLogLevel(): LogLevel | undefined {
      return store.config()?.logConfig?.level;
    },

    /**
     * Returns the current application configuration.
     *
     * @returns The current `AppConfig` object, or `null` if not set.
     *
     * @example
     * ```typescript
     * const config = appStore.getConfig();
     * console.log(`App: ${config?.appName} v${config?.appVersion}`);
     * ```
     */
    getConfig(): AppConfig | null {
      return store.config();
    },

    /**
     * Returns the current user preference object.
     *
     * @returns The current `UserPreference` object, or `null` if not set.
     *
     * @example
     * ```typescript
     * const pref = appStore.getPreference();
     * console.log(`Theme: ${pref?.theme}, Language: ${pref?.language}`);
     * ```
     */
    getPreference(): UserPreference | null {
      return store.preference();
    },

    /**
     * Returns `true` if an async operation is currently in progress.
     *
     * @returns `true` if loading, otherwise `false` or `undefined`.
     *
     * @example
     * ```typescript
     * if (appStore.getIsLoading()) {
     *   showSpinner();
     * }
     * ```
     */
    getIsLoading(): boolean | undefined {
      return store.isLoading?.();
    },

    /**
     * Returns the current error object, if any.
     *
     * @returns The current error object (`Error`, `string`, or `unknown`), or `undefined`.
     *
     * @example
     * ```typescript
     * const error = appStore.getError();
     * if (error) {
     *   showErrorToast(error);
     * }
     * ```
     */
    getError(): unknown {
      return store.error?.();
    },

    /**
     * Enables or disables maintenance mode for the application.
     *
     * When maintenance mode is enabled, the application should display a maintenance
     * page and restrict normal user interactions.
     *
     * @param enabled - `true` to enable maintenance mode, `false` to disable.
     *
     * @example
     * ```typescript
     * // Enable maintenance mode
     * appStore.setMaintenanceModeEnabled(true);
     *
     * // Disable maintenance mode
     * appStore.setMaintenanceModeEnabled(false);
     * ```
     */
    setMaintenanceModeEnabled(enabled: boolean): void {
      patchState(store, { isMaintenanceModeEnabled: enabled });
    },

    /**
     * Sets the current log level in `config.logConfig`.
     *
     * If `logConfig` is not set, it will be initialized with `logToServer: false`.
     * Does nothing if config is `null`.
     *
     * @param logLevel - The new log level to set.
     *
     * @example
     * ```typescript
     * appStore.setLogLevel(LogLevel.Debug);
     * ```
     */
    setLogLevel(logLevel: LogLevel): void {
      const config: AppConfig | null = store.config();
      if (!config) return;
      // If logConfig is missing, initialize with logToServer: false
      const prev = config.logConfig ?? { logToServer: false };
      patchState(store, {
        config: { ...config, logConfig: { ...prev, level: logLevel } },
      });
    },

    /**
     * Sets the application configuration.
     *
     * Pass `null` to reset the configuration to its initial state.
     *
     * @param config - The new application config, or `null` to reset.
     *
     * @example
     * ```typescript
     * appStore.setConfig({
     *   appName: 'Talent Hub',
     *   appVersion: '2.0.0',
     *   environment: Environment.Production,
     *   logConfig: { level: LogLevel.Warn, logToServer: true },
     * });
     * ```
     */
    setConfig(config: AppConfig | null): void {
      patchState(store, { config });
    },

    /**
     * Sets the user preference object.
     *
     * Pass `null` to reset preferences to their initial state.
     *
     * @param preference - The new user preference, or `null` to reset.
     *
     * @example
     * ```typescript
     * appStore.setPreference({ theme: Theme.Dark, language: 'de' });
     * ```
     */
    setPreference(preference: UserPreference | null): void {
      patchState(store, { preference });
    },

    /**
     * Sets the user's theme preference.
     *
     * Does nothing if preference is `null`. Use `setPreference()` first to initialize.
     *
     * @param theme - The new theme (`Theme.Light` or `Theme.Dark`).
     *
     * @example
     * ```typescript
     * appStore.setTheme(Theme.Dark);
     * ```
     */
    setTheme(theme: Theme): void {
      const pref: UserPreference | null = store.preference();
      if (!pref) return;
      patchState(store, {
        preference: {
          ...pref,
          theme,
        },
      });
    },

    /**
     * Toggles the user's theme between light and dark.
     *
     * If the current theme is light, it switches to dark, and vice versa.
     * Does nothing if preference is `null`.
     *
     * @example
     * ```typescript
     * // Toggle theme on button click
     * appStore.toggleTheme();
     * ```
     */
    toggleTheme(): void {
      const pref: UserPreference | null = store.preference();
      if (!pref) return;
      patchState(store, {
        preference: {
          ...pref,
          theme: pref.theme === Theme.Light ? Theme.Dark : Theme.Light,
        },
      });
    },

    /**
     * Sets the user's language preference.
     *
     * Does nothing if preference is `null`. Use `setPreference()` first to initialize.
     *
     * @param language - The new language code (e.g., 'en', 'de', 'fr').
     *
     * @example
     * ```typescript
     * appStore.setLanguage('de');
     * ```
     */
    setLanguage(language: string): void {
      const pref: UserPreference | null = store.preference();
      if (!pref) return;
      patchState(store, {
        preference: {
          ...pref,
          language,
        },
      });
    },

    /**
     * Checks if a specific feature flag is enabled.
     *
     * Returns `false` if the features map is `null` or the feature key is not found.
     *
     * @param feature - The feature flag key to check.
     * @returns `true` if the feature is enabled, `false` otherwise.
     *
     * @example
     * ```typescript
     * if (appStore.isFeatureEnabled('newDashboard')) {
     *   loadNewDashboard();
     * } else {
     *   loadLegacyDashboard();
     * }
     * ```
     */
    isFeatureEnabled(feature: string): boolean {
      const features: Record<string, boolean> | null = store.features();
      return Boolean(features && features[feature]);
    },

    /**
     * Sets the feature flags for the application.
     *
     * Pass `null` to clear all feature flags.
     *
     * @param features - The new features map, or `null` to clear.
     *
     * @example
     * ```typescript
     * appStore.setFeatures({
     *   newDashboard: true,
     *   betaFeatures: false,
     *   darkModeV2: true,
     * });
     * ```
     */
    setFeatures(features: Record<string, boolean> | null): void {
      patchState(store, { features });
    },

    /**
     * Sets the loading state for async operations.
     *
     * Use this to indicate when the application is performing background operations
     * such as fetching data or saving changes.
     *
     * @param isLoading - `true` if loading, `false` otherwise.
     *
     * @example
     * ```typescript
     * appStore.setLoading(true);
     * try {
     *   await fetchData();
     * } finally {
     *   appStore.setLoading(false);
     * }
     * ```
     */
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    /**
     * Sets the error state for async operations.
     *
     * Use this to store error information when an operation fails.
     * The error can be an `Error` object, a string message, or any unknown type.
     *
     * @param error - The error object, string, or unknown value.
     *
     * @example
     * ```typescript
     * try {
     *   await saveData();
     * } catch (err) {
     *   appStore.setError(err);
     * }
     * ```
     */
    setError(error: Error | string | unknown): void {
      patchState(store, { error });
    },

    /**
     * Clears the error state.
     *
     * Call this method after handling or dismissing an error to reset the state.
     *
     * @example
     * ```typescript
     * // After user dismisses error dialog
     * appStore.clearError();
     * ```
     */
    clearError(): void {
      patchState(store, { error: undefined });
    },
  })),
);
