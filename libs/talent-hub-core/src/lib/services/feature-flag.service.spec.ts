/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FeatureFlagService } from '../services';

// Use vi.hoisted to declare mock store that can be accessed inside vi.mock
const { mockAppStore } = vi.hoisted(() => {
  let features: Record<string, boolean> | null = {};

  return {
    mockAppStore: {
      isFeatureEnabled: vi.fn((key: string) => features?.[key] ?? false),
      setFeatures: (newFeatures: Record<string, boolean> | null) => {
        features = newFeatures;
      },
      reset: () => {
        features = {};
      },
    },
  };
});

// Mock @angular/core inject before importing FeatureFlagService
vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    inject: vi.fn((token: unknown) => {
      // SignalStore tokens have name 'SignalStore', so check the string representation
      const tokenStr = String(token);
      if (tokenStr.includes('SignalStore') || tokenStr.includes('AppStore')) {
        return mockAppStore;
      }
      throw new Error(`Unmocked token in test: ${tokenStr}`);
    }),
  });
});

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppStore.reset();
    service = new FeatureFlagService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true if feature flag is enabled', () => {
    mockAppStore.setFeatures({ featureA: true });
    expect(service.isEnabled('featureA')).toBe(true);
  });

  it('should return false if feature flag is disabled', () => {
    mockAppStore.setFeatures({ featureB: false });
    expect(service.isEnabled('featureB')).toBe(false);
  });

  it('should return false if feature flag is missing', () => {
    mockAppStore.setFeatures({});
    expect(service.isEnabled('missingFeature')).toBe(false);
  });

  it('should return false if features is null', () => {
    mockAppStore.setFeatures(null);
    expect(service.isEnabled('anyFeature')).toBe(false);
  });

  it('featureFlagSignal should reflect the current flag value', () => {
    mockAppStore.setFeatures({ featureC: true });
    const signal = service.featureFlagSignal('featureC');
    expect(signal()).toBe(true);
  });

  it('featureFlagSignal should be false for missing flag', () => {
    mockAppStore.setFeatures({});
    const signal = service.featureFlagSignal('missingFeature');
    expect(signal()).toBe(false);
  });

  it('featureFlagSignal should be false when features is null', () => {
    mockAppStore.setFeatures(null);
    const signal = service.featureFlagSignal('anyFeature');
    expect(signal()).toBe(false);
  });
});
