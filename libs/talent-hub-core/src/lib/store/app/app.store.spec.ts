/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { AppStore } from './app.store';
import { Environment, LogLevel, Theme } from '../../enums';
import { AppConfig, UserPreference } from '../../interfaces';

describe('AppStore', () => {
  let store: typeof AppStore;

  beforeEach(() => {
    store = new AppStore();
    // Reset all state to initial values before each test using only public API
    store.setConfig(null);
    store.setPreference(null);
    store.setMaintenanceModeEnabled(false);
    store.setEnvironment(Environment.Development);
    store.setLogLevel(LogLevel.Info);
    store.setLoading(false);
    store.clearError();
    store.setTheme(Theme.Light);
    store.setLanguage('en');
  });

  it('should initialize with default state', () => {
    expect(store.isInitialized()).toBe(false);
  });

  it('should enable and disable maintenance mode', () => {
    store.setMaintenanceModeEnabled(true);
    expect(store.isMaintenanceModeEnabled()).toBe(true);
    store.setMaintenanceModeEnabled(false);
    expect(store.isMaintenanceModeEnabled()).toBe(false);
  });

  it('should set and get environment', () => {
    store.setEnvironment(Environment.Production);
    expect(store.getEnvironment()).toBe(Environment.Production);
    store.setEnvironment(Environment.Development);
    expect(store.getEnvironment()).toBe(Environment.Development);
  });

  it('should set and get log level', () => {
    store.setLogLevel(LogLevel.Error);
    expect(store.getLogLevel()).toBe(LogLevel.Error);
    store.setLogLevel(LogLevel.Info);
    expect(store.getLogLevel()).toBe(LogLevel.Info);
  });

  it('should set and get config', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      features: { dashboard: true, audit: false },
    };
    store.setConfig(config);
    expect(store.getConfig()).toEqual(config);
  });

  it('should set and get user preference', () => {
    const pref: UserPreference = {
      theme: Theme.Dark,
      language: 'de',
    };
    store.setPreference(pref);
    expect(store.getPreference()).toEqual(pref);
  });

  it('should set loading state', () => {
    store.setLoading(true);
    expect(store.getIsLoading()).toBe(true);
    store.setLoading(false);
    expect(store.getIsLoading()).toBe(false);
  });

  it('should set and clear error', () => {
    store.setError('Test error');
    expect(store.getError()).toBe('Test error');
    store.clearError();
    expect(store.getError()).toBeUndefined();
  });

  it('should return correct theme and language values', () => {
    store.setPreference({ theme: Theme.Dark, language: 'de' });
    expect(store.isDarkMode()).toBe(true);
    expect(store.isLightMode()).toBe(false);
    expect(store.currentTheme()).toBe(Theme.Dark);
    expect(store.currentLanguage()).toBe('de');
  });

  it('should toggle theme', () => {
    store.setPreference({ theme: Theme.Light, language: 'en' });
    store.toggleTheme();
    expect(store.currentTheme()).toBe(Theme.Dark);
    store.toggleTheme();
    expect(store.currentTheme()).toBe(Theme.Light);
  });

  it('should set and get language', () => {
    store.setPreference({ theme: Theme.Light, language: 'en' });
    store.setLanguage('fr');
    expect(store.currentLanguage()).toBe('fr');
  });

  it('should enable feature flags', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      features: { dashboard: true, audit: false },
    };
    store.setConfig(config);
    expect(store.isFeatureEnabled('dashboard')).toBe(true);
    expect(store.isFeatureEnabled('audit')).toBe(false);
  });

  it('should initialize with config and preference', () => {
    const config: AppConfig = { appName: 'Talent Hub', appVersion: '1.0.0', features: {} };
    const pref: UserPreference = { theme: Theme.Dark, language: 'fr' };
    store.initialize(config, pref);
    expect(store.getConfig()).toEqual(config);
    expect(store.getPreference()).toEqual(pref);
    expect(store.isInitialized()).toBe(true);
  });

  it('should initialize with all params', () => {
    const config: AppConfig = { appName: 'Talent Hub', appVersion: '1.0.0', features: {} };
    const pref: UserPreference = { theme: Theme.Light, language: 'en' };
    store.initialize(config, pref, Environment.Production, LogLevel.Error);
    expect(store.getEnvironment()).toBe(Environment.Production);
    expect(store.getLogLevel()).toBe(LogLevel.Error);
    expect(store.isInitialized()).toBe(true);
  });

  it('should return false for missing feature', () => {
    store.setConfig({ appName: 'Talent Hub', appVersion: '1.0.0', features: { dashboard: true } });
    expect(store.isFeatureEnabled('unknown')).toBe(false);
  });

  it('should return correct computed properties', () => {
    store.setPreference({ theme: Theme.Light, language: 'en' });
    expect(store.isLightMode()).toBe(true);
    expect(store.isDarkMode()).toBe(false);
    expect(store.currentTheme()).toBe(Theme.Light);
    expect(store.currentLanguage()).toBe('en');
  });

  it('should handle null/undefined preference for computed properties', () => {
    store.setPreference(null);
    expect(store.isLightMode()).toBe(false);
    expect(store.isDarkMode()).toBe(false);
    expect(store.currentTheme()).toBe(Theme.Light);
    expect(store.currentLanguage()).toBe('en');
  });

  it('should handle setTheme/toggleTheme when preference is null', () => {
    store.setPreference(null);
    store.setTheme(Theme.Dark); // should not throw
    store.toggleTheme(); // should not throw
    expect(store.getPreference()).toBeNull();
  });

  it('should handle setTheme/toggleTheme when preference is not null', () => {
    store.setPreference({ theme: Theme.Light, language: 'en' });
    store.setTheme(Theme.Dark); // should not throw
    store.toggleTheme(); // should not throw
    expect(store.getPreference()).not.toBeNull();
  });

  it('should handle error state with different types', () => {
    store.setError(new Error('err'));
    expect(store.getError()).toBeInstanceOf(Error);
    store.setError('string error');
    expect(store.getError()).toBe('string error');
    store.setError({ code: 500 });
    expect(store.getError()).toEqual({ code: 500 });
  });
});
