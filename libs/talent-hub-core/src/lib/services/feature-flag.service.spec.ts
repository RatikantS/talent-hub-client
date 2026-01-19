/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FeatureFlagService } from '../services';

// Use vi.hoisted to declare variables that can be accessed inside vi.mock
const { mockAppStore } = vi.hoisted(() => {
  return {
    mockAppStore: { getConfig: vi.fn() },
  };
});

// Mock @angular/core inject before importing FeatureFlagService
vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    inject: vi.fn((token: any) => {
      const tokenStr = String(token);
      if (
        token?.name === 'AppStore' ||
        tokenStr.includes('AppStore') ||
        token?.name === 'SignalStore' ||
        tokenStr.includes('SignalStore')
      ) {
        return mockAppStore;
      }
      throw new Error(`Unmocked token in test: ${token?.name || tokenStr}`);
    }),
  });
});

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FeatureFlagService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true if the feature flag is enabled', () => {
    mockAppStore.getConfig.mockReturnValue({ features: { test: true } });
    expect(service.isEnabled('test')).toBe(true);
  });

  it('should return false if the feature flag is disabled', () => {
    mockAppStore.getConfig.mockReturnValue({ features: { test: false } });
    expect(service.isEnabled('test')).toBe(false);
  });

  it('should return false if the feature flag is not present', () => {
    mockAppStore.getConfig.mockReturnValue({ features: {} });
    expect(service.isEnabled('missing')).toBe(false);
  });

  it('should return false if config is null', () => {
    mockAppStore.getConfig.mockReturnValue(null);
    expect(service.isEnabled('any')).toBe(false);
  });

  it('features signal should reflect the current features object (a, b)', () => {
    mockAppStore.getConfig.mockReturnValue({ features: { a: true, b: false } });
    expect(service.features()).toEqual({ a: true, b: false });
  });

  it('features signal should reflect the current features object (c)', () => {
    mockAppStore.getConfig.mockReturnValue({ features: { c: true } });
    expect(service.features()).toEqual({ c: true });
  });

  it('features signal should default to empty object if config or features is missing', () => {
    mockAppStore.getConfig.mockReturnValue(null);
    expect(service.features()).toEqual({});
    mockAppStore.getConfig.mockReturnValue({});
    expect(service.features()).toEqual({});
  });
});
