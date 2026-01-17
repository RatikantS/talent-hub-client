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
 * - Exposes methods to update state (initialize, setTheme, setLanguage, setMaintenanceMode)
 * - Supports feature toggling and version/build info for the host shell
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
 */

/**
 * Initial application state for AppStore.
 *
 * - isInitialized: Indicates if the app has completed initialization.
 * - isMaintenanceModeEnabled: If true, the app is in maintenance mode and should show a maintenance UI or restrict user actions.
 * - environment: Current environment (e.g., dev, prod).
 * - logLevel: Current logging level.
 * - config: Application configuration (AppConfig).
 * - preference: User preferences (theme, language, etc.).
 */
const initialState: AppState & AsyncState = {
  isInitialized: false,
  isMaintenanceModeEnabled: false,
  environment: APP_CONSTANT.DEFAULT_ENVIRONMENT,
  logLevel: APP_CONSTANT.DEFAULT_LOG_LEVEL,
  config: null,
  preference: null,
  isLoading: false,
  error: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppStore: any = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ preference }) => ({
    /**
     * isLightMode - Returns true if the user's theme is set to light mode.
     */
    isLightMode: computed((): boolean => preference()?.theme === Theme.Light),
    /**
     * isDarkMode - Returns true if the user's theme is set to dark mode.
     */
    isDarkMode: computed((): boolean => preference()?.theme === Theme.Dark),
    /**
     * currentTheme - Returns the current theme (light/dark) for the user.
     */
    currentTheme: computed((): Theme => preference()?.theme ?? APP_CONSTANT.DEFAULT_THEME),
    /**
     * currentLanguage - Returns the current language for the user.
     */
    currentLanguage: computed(
      (): string => preference()?.language ?? APP_CONSTANT.DEFAULT_LANGUAGE,
    ),
  })),
  withMethods((store) => ({
    /**
     * initialize - Initializes the application with config and user preference.
     * Optionally sets environment and log level.
     */
    initialize(
      config: AppConfig,
      preference: UserPreference,
      environment?: Environment,
      logLevel?: LogLevel,
    ): void {
      patchState(store, {
        config,
        preference,
        isInitialized: true,
        ...(environment && { environment }),
        ...(logLevel && { logLevel }),
      });
    },
    /**
     * getEnvironment - Returns the current environment value.
     */
    getEnvironment(): Environment {
      return store.environment();
    },
    /**
     * getLogLevel - Returns the current log level value.
     */
    getLogLevel(): LogLevel {
      return store.logLevel();
    },
    /**
     * getConfig - Returns the current application configuration.
     */
    getConfig(): AppConfig | null {
      return store.config();
    },
    /**
     * getPreference - Returns the current user preference object.
     */
    getPreference(): UserPreference | null {
      return store.preference();
    },
    /**
     * getIsLoading - Returns true if an async operation is in progress.
     */
    getIsLoading(): boolean | undefined {
      return store.isLoading?.();
    },
    /**
     * getError - Returns the current error object, if any.
     */
    getError(): unknown {
      return store.error?.();
    },
    /**
     * setMaintenanceModeEnabled - Enables or disables maintenance mode for the application.
     */
    setMaintenanceModeEnabled(enabled: boolean): void {
      patchState(store, { isMaintenanceModeEnabled: enabled });
    },
    /**
     * setEnvironment - Sets the current environment.
     */
    setEnvironment(environment: Environment): void {
      patchState(store, { environment });
    },
    /**
     * setLogLevel - Sets the current log level.
     */
    setLogLevel(logLevel: LogLevel): void {
      patchState(store, { logLevel });
    },
    /**
     * setConfig - Sets the application configuration.
     */
    setConfig(config: AppConfig): void {
      patchState(store, { config });
    },
    /**
     * setPreference - Sets the user preference object.
     */
    setPreference(preference: UserPreference): void {
      patchState(store, { preference });
    },
    /**
     * setTheme - Sets the user's theme preference.
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
     * isFeatureEnabled - Returns true if the given feature flag is enabled in config.
     */
    isFeatureEnabled(feature: string): boolean {
      const features: Record<string, boolean> | undefined = store.config()?.features;
      return Boolean(features && features[feature]);
    },
    /**
     * setLoading - Sets the loading state for async operations.
     */
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    /**
     * setError - Sets the error state for async operations.
     */
    setError(error: Error | string | unknown): void {
      patchState(store, { error });
    },
    /**
     * clearError - Clears the error state.
     */
    clearError(): void {
      patchState(store, { error: undefined });
    },
  })),
);
