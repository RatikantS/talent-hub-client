/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';

import { AppStore } from './app.store';
import { AppConfig, AppPreference } from '../../interfaces';

describe('AppStore', () => {
  let store: InstanceType<typeof AppStore>;
  let injector: Injector;

  beforeEach(() => {
    injector = Injector.create({ providers: [{ provide: AppStore, useClass: AppStore }] });
    store = runInInjectionContext(injector, () => injector.get(AppStore));
    // Reset all state to initial values before each test using only public API
    store.setConfig(null);
    store.setPreference(null);
    store.setMaintenanceModeEnabled(false);
    store.setLogLevel('info');
    store.setLoading(false);
    store.clearError();
    store.setTheme('light');
    store.setLanguage('en');
    store.setFeatures(null);
  });

  it('should initialize with default state', () => {
    expect(store.isInitialized()).toBe(false);
  });

  it('should initialize with config and preference', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'development',
    };
    const pref: AppPreference = { theme: 'dark', language: 'fr' };
    store.initialize(config, pref);
    expect(store.getConfig()).toEqual(config);
    expect(store.getPreference()).toEqual(pref);
    expect(store.isInitialized()).toBe(true);
  });

  it('should initialize with all params', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'production',
      logConfig: { level: 'error', logToServer: false, logEndpoint: '/api/logs' },
    };
    const pref: AppPreference = { theme: 'light', language: 'en' };
    store.initialize(config, pref);
    expect(store.getEnvironment()).toBe('production');
    expect(store.getLogLevel()).toBe('error');
    expect(store.isInitialized()).toBe(true);
  });

  it('should get environment from config', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'production',
    };
    store.setConfig(config);
    expect(store.getEnvironment()).toBe('production');
  });

  it('should set environment in config', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'production',
    };
    store.setConfig(config);
    store.setEnvironment('development');
    expect(store.getEnvironment()).toBe('development');
  });

  it('should not update environment if config is null', () => {
    store.setConfig(null);
    expect(() => store.setEnvironment('production')).not.toThrow();
    expect(store.getEnvironment()).toBeDefined(); // Should fallback to default
  });

  it('should get log level from config.logConfig', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'development',
      logConfig: { level: 'info', logToServer: false, logEndpoint: '/api/logs' },
    };
    store.setConfig(config);
    expect(store.getLogLevel()).toBe('info');
  });

  it('should set log level in config.logConfig', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'development',
      logConfig: { level: 'info', logToServer: false, logEndpoint: '/api/logs' },
    };
    store.setConfig(config);
    store.setLogLevel('error');
    expect(store.getLogLevel()).toBe('error');
    store.setLogLevel('info');
    expect(store.getLogLevel()).toBe('info');
  });

  it('should get log level as undefined if logConfig is missing', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'development',
    };
    store.setConfig(config);
    expect(store.getLogLevel()).toBeUndefined();
  });

  it('should not update log level if config is null', () => {
    store.setConfig(null);
    expect(() => store.setLogLevel('error')).not.toThrow();
    expect(store.getLogLevel()).toBeUndefined();
  });

  it('should initialize logConfig if missing when setting log level', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'development',
    };
    store.setConfig(config);
    store.setLogLevel('fatal');
    expect(store.getLogLevel()).toBe('fatal');
  });

  it('should set and get config', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'development',
    };
    store.setConfig(config);
    expect(store.getConfig()).toEqual(config);
  });

  it('should set and get user preference', () => {
    const pref: AppPreference = {
      theme: 'dark',
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

  it('should handle error state with different types', () => {
    store.setError(new Error('err'));
    expect(store.getError()).toBeInstanceOf(Error);
    store.setError('string error');
    expect(store.getError()).toBe('string error');
    store.setError({ code: 500 });
    expect(store.getError()).toEqual({ code: 500 });
  });

  it('should return undefined for getError after clearing', () => {
    store.setError('some error');
    store.clearError();
    expect(store.getError()).toBeUndefined();
  });

  it('should enable and disable maintenance mode', () => {
    store.setMaintenanceModeEnabled(true);
    expect(store.isMaintenanceModeEnabled()).toBe(true);
    store.setMaintenanceModeEnabled(false);
    expect(store.isMaintenanceModeEnabled()).toBe(false);
  });

  it('should handle setTheme/toggleTheme when preference is null', () => {
    store.setPreference(null);
    store.setTheme('dark'); // should not throw
    store.toggleTheme(); // should not throw
    expect(store.getPreference()).toBeNull();
  });

  it('should handle setTheme/toggleTheme when preference is not null', () => {
    store.setPreference({ theme: 'light', language: 'en' });
    store.setTheme('dark'); // should not throw
    store.toggleTheme(); // should not throw
    expect(store.getPreference()).not.toBeNull();
  });

  it('should toggle theme', () => {
    store.setPreference({ theme: 'light', language: 'en' });
    store.toggleTheme();
    expect(store.currentTheme()).toBe('dark');
    store.toggleTheme();
    expect(store.currentTheme()).toBe('light');
  });

  it('should not update language if preference is null', () => {
    store.setPreference(null);
    expect(() => store.setLanguage('fr')).not.toThrow();
    expect(store.getPreference()).toBeNull();
  });

  it('should set and get language', () => {
    store.setPreference({ theme: 'light', language: 'en' });
    store.setLanguage('fr');
    expect(store.currentLanguage()).toBe('fr');
  });

  it('should enable feature flags', () => {
    store.setFeatures({ dashboard: true, audit: false });
    expect(store.isFeatureEnabled('dashboard')).toBe(true);
    expect(store.isFeatureEnabled('audit')).toBe(false);
  });

  it('should handle setFeatures with null and empty object', () => {
    store.setFeatures(null);
    expect(store.isFeatureEnabled('any')).toBe(false);
    store.setFeatures({});
    expect(store.isFeatureEnabled('any')).toBe(false);
  });

  it('should return false for isFeatureEnabled if features is null', () => {
    store.setFeatures(null);
    expect(store.isFeatureEnabled('foo')).toBe(false);
  });

  it('should return false for missing feature', () => {
    store.setFeatures({ dashboard: true });
    expect(store.isFeatureEnabled('unknown')).toBe(false);
  });

  it('should return correct computed properties', () => {
    store.setPreference({ theme: 'light', language: 'en' });
    expect(store.isLightMode()).toBe(true);
    expect(store.isDarkMode()).toBe(false);
    expect(store.currentTheme()).toBe('light');
    expect(store.currentLanguage()).toBe('en');
  });

  it('should return correct theme and language values', () => {
    store.setPreference({ theme: 'dark', language: 'de' });
    expect(store.isDarkMode()).toBe(true);
    expect(store.isLightMode()).toBe(false);
    expect(store.currentTheme()).toBe('dark');
    expect(store.currentLanguage()).toBe('de');
  });

  it('should handle null/undefined preference for computed properties', () => {
    store.setPreference(null);
    expect(store.isLightMode()).toBe(false);
    expect(store.isDarkMode()).toBe(false);
    expect(store.currentTheme()).toBe('light');
    expect(store.currentLanguage()).toBe('en');
  });

  it('should return currentEnvironment from config', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'production',
    };
    store.setConfig(config);
    expect(store.currentEnvironment()).toBe('production');
  });

  it('should return default environment if config is null', () => {
    store.setConfig(null);
    expect(store.currentEnvironment()).toBe('development'); // Assuming DEFAULT_ENVIRONMENT is Development
  });

  it('should return currentLogLevel from config.logConfig', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'production',
      logConfig: { level: 'warn', logToServer: false },
    };
    store.setConfig(config);
    expect(store.currentLogLevel()).toBe('warn');
  });

  it('should return undefined for currentLogLevel if logConfig is missing', () => {
    const config: AppConfig = {
      appName: 'Talent Hub',
      appVersion: '1.0.0',
      environment: 'production',
    };
    store.setConfig(config);
    expect(store.currentLogLevel()).toBeUndefined();
  });

  it('should return undefined for currentLogLevel if config is null', () => {
    store.setConfig(null);
    expect(store.currentLogLevel()).toBeUndefined();
  });
});
