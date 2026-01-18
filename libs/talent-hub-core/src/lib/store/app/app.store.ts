/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { AppConfig, UserPreference } from '../../interfaces';
import { AppState } from './app-state.interface';
import { AsyncState } from '../async-state.interface';
import { APP_CONSTANT } from '../../constants';
import { Environment, LogLevel, Theme } from '../../enums';

/**
 * The initial application state for AppStore.
 *
 * Properties:
 * - isInitialized: Indicates if the app has completed initialization.
 * - isMaintenanceModeEnabled: If true, the app is in maintenance mode and should show a maintenance UI or restrict user actions.
 * - config: Application configuration (AppConfig) or null if not loaded.
 * - features: Feature flags for the application (Record<string, boolean> | null).
 * - preference: User preferences (theme, language, etc.) or null if not set.
 * - isLoading: Indicates if an async operation is in progress.
 * - error: Holds the current error object, if any.
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
 * This store manages application-wide configuration, user preferences, environment, logging,
 * feature toggles, and maintenance mode. It uses Angular signals and NgRx SignalStore for
 * reactive, type-safe state management. All state is kept immutable and updated via pure methods.
 *
 * Key responsibilities:
 * - Holds the root application state (AppState) and async state (AsyncState)
 * - Manages user preferences (theme, language) as a single source of truth
 * - Provides computed properties for UI (e.g., isDarkMode, isLightMode, maintenanceMode)
 * - Exposes methods to update state (initialize, setTheme, setLanguage, setMaintenanceMode, etc.)
 * - Supports feature toggling and version/build info for the host shell
 * - Handles optional logConfig in AppConfig gracefully throughout all state and method logic
 *
 * Usage:
 *   const appStore = inject(AppStore);
 *   appStore.setTheme(Theme.Dark);
 *   appStore.setLanguage('de');
 *   if (appStore.isFeatureEnabled('Dashboard')) { ... }
 *   if (appStore.isMaintenanceModeEnabled()) { ... }
 *
 * All updates are performed via signals and patchState, ensuring reactivity and
 * strict type safety. This store is intended to be used across all MFEs for
 * consistent application state and user experience.
 *
 * Note: AppConfig.logConfig is optional. All computed properties and methods that access logConfig
 * use optional chaining and provide safe defaults where necessary.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppStore: any = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ preference, config }) => ({
    /**
     * isLightMode - Returns true if the user's theme is set to light mode.
     * @returns {boolean} True if theme is Theme.Light, false otherwise.
     */
    isLightMode: computed((): boolean => preference()?.theme === Theme.Light),
    /**
     * isDarkMode - Returns true if the user's theme is set to dark mode.
     * @returns {boolean} True if theme is Theme.Dark, false otherwise.
     */
    isDarkMode: computed((): boolean => preference()?.theme === Theme.Dark),
    /**
     * currentTheme - Returns the current theme (light/dark) for the user, falling back to default.
     * @returns {Theme} The user's theme, or the default theme if not set.
     */
    currentTheme: computed((): Theme => preference()?.theme ?? APP_CONSTANT.DEFAULT_THEME),
    /**
     * currentLanguage - Returns the current language for the user, falling back to default.
     * @returns {string} The user's language, or the default language if not set.
     */
    currentLanguage: computed(
      (): string => preference()?.language ?? APP_CONSTANT.DEFAULT_LANGUAGE,
    ),
    /**
     * currentEnvironment - Returns the current environment for the user, falling back to default.
     * @returns {Environment} The current environment, or the default if not set.
     */
    currentEnvironment: computed(() => config()?.environment ?? APP_CONSTANT.DEFAULT_ENVIRONMENT),
    /**
     * currentLogLevel - Returns the current log level from the config.
     *
     * If logConfig is not set in AppConfig, returns undefined.
     * @returns {LogLevel | undefined} The current log level, or undefined if not set.
     */
    currentLogLevel: computed(() => config()?.logConfig?.level),
  })),
  withMethods((store) => ({
    /**
     * initialize - Initializes the application with config and user preference.
     *
     * @param config The application configuration (AppConfig)
     * @param preference The user preference object (UserPreference)
     * @returns {void}
     */
    initialize(config: AppConfig, preference: UserPreference): void {
      patchState(store, {
        config,
        preference,
        isInitialized: true,
      });
    },
    /**
     * getEnvironment - Returns the current environment value from config.
     *
     * @returns {Environment} The current environment (e.g., dev, prod)
     */
    getEnvironment(): Environment {
      return store.config()?.environment ?? APP_CONSTANT.DEFAULT_ENVIRONMENT;
    },
    /**
     * setEnvironment - Sets the current environment in config.
     *
     * @param environment The new environment value
     * @returns {void}
     */
    setEnvironment(environment: Environment): void {
      const config = store.config();
      if (!config) return;
      patchState(store, { config: { ...config, environment } });
    },
    /**
     * getLogLevel - Returns the current log level value from config.logConfig.
     *
     * If logConfig is not set in AppConfig, returns undefined.
     *
     * @returns {LogLevel | undefined} The current log level
     */
    getLogLevel(): LogLevel | undefined {
      return store.config()?.logConfig?.level;
    },
    /**
     * getConfig - Returns the current application configuration.
     *
     * @returns {AppConfig | null} The current app config
     */
    getConfig(): AppConfig | null {
      return store.config();
    },
    /**
     * getPreference - Returns the current user preference object.
     *
     * @returns {UserPreference | null} The current user preference
     */
    getPreference(): UserPreference | null {
      return store.preference();
    },
    /**
     * getIsLoading - Returns true if an async operation is in progress.
     *
     * @returns {boolean | undefined} True if loading, otherwise false/undefined
     */
    getIsLoading(): boolean | undefined {
      return store.isLoading?.();
    },
    /**
     * getError - Returns the current error object, if any.
     *
     * @returns {unknown} The current error object
     */
    getError(): unknown {
      return store.error?.();
    },
    /**
     * setMaintenanceModeEnabled - Enables or disables maintenance mode for the application.
     *
     * @param enabled True to enable maintenance mode, false to disable
     * @returns {void}
     */
    setMaintenanceModeEnabled(enabled: boolean): void {
      patchState(store, { isMaintenanceModeEnabled: enabled });
    },
    /**
     * setLogLevel - Sets the current log level in config.logConfig.
     *
     * If logConfig is not set, it will be initialized with default values except for level.
     *
     * @param logLevel The new log level
     * @returns {void}
     */
    setLogLevel(logLevel: LogLevel): void {
      const config = store.config();
      if (!config) return;
      // If logConfig is missing, initialize with logToServer: false
      const prev = config.logConfig ?? { logToServer: false };
      patchState(store, {
        config: { ...config, logConfig: { ...prev, level: logLevel } },
      });
    },
    /**
     * setConfig - Sets the application configuration.
     *
     * @param config The new application config
     * @returns {void}
     */
    setConfig(config: AppConfig): void {
      patchState(store, { config });
    },
    /**
     * setPreference - Sets the user preference object.
     *
     * @param preference The new user preference
     * @returns {void}
     */
    setPreference(preference: UserPreference): void {
      patchState(store, { preference });
    },
    /**
     * setTheme - Sets the user's theme preference.
     *
     * @param theme The new theme (Theme.Light or Theme.Dark)
     * @returns {void}
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
     * toggleTheme - Toggles the user's theme between light and dark.
     * @returns {void}
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
     * setLanguage - Sets the user's language preference.
     *
     * @param language The new language code (e.g., 'en', 'de')
     * @returns {void}
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
     * isFeatureEnabled - Returns true if the given feature flag is enabled in AppState.features.
     *
     * @param feature The feature flag key
     * @returns {boolean} True if enabled, false otherwise
     */
    isFeatureEnabled(feature: string): boolean {
      const features: Record<string, boolean> | null = store.features();
      return Boolean(features && features[feature]);
    },
    /**
     * setFeatures - Sets the feature flags for the application.
     *
     * @param features The new features object (Record<string, boolean> | null)
     * @returns {void}
     */
    setFeatures(features: Record<string, boolean> | null): void {
      patchState(store, { features });
    },
    /**
     * setLoading - Sets the loading state for async operations.
     *
     * @param isLoading True if loading, false otherwise
     * @returns {void}
     */
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    /**
     * setError - Sets the error state for async operations.
     *
     * @param error The error object (Error, string, or unknown)
     * @returns {void}
     */
    setError(error: Error | string | unknown): void {
      patchState(store, { error });
    },
    /**
     * clearError - Clears the error state.
     * @returns {void}
     */
    clearError(): void {
      patchState(store, { error: undefined });
    },
  })),
);
