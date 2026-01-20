/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FeatureFlagService } from '../services';

class MockAppStore {
  private flags: Record<string, boolean> = {};
  getFeatureFlag = vi.fn((key: string) => this.flags[key]);
  setFlag(key: string, value: boolean) {
    this.flags[key] = value;
  }
}

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let mockAppStore: MockAppStore;

  beforeEach(() => {
    mockAppStore = new MockAppStore();
    // Subclass FeatureFlagService to inject mock AppStore
    class TestFeatureFlagService extends FeatureFlagService {
      constructor(private store: MockAppStore) {
        super();
      }
      protected override getAppStore() {
        return this.store as any;
      }
    }
    service = new TestFeatureFlagService(mockAppStore) as any;
  });

  it('should return true if feature flag is enabled', () => {
    mockAppStore.setFlag('featureA', true);
    expect(service.isEnabled('featureA')).toBe(true);
  });

  it('should return false if feature flag is disabled', () => {
    mockAppStore.setFlag('featureB', false);
    expect(service.isEnabled('featureB')).toBe(false);
  });

  it('should return false if feature flag is missing', () => {
    expect(service.isEnabled('missingFeature')).toBe(false);
  });

  it('featureFlagSignal should reflect the current flag value', () => {
    mockAppStore.setFlag('featureC', true);
    const signal = service.featureFlagSignal('featureC');
    expect(signal()).toBe(true);
  });

  it('featureFlagSignal should be false for missing flag', () => {
    const signal = service.featureFlagSignal('missingFeature');
    expect(signal()).toBe(false);
  });
});
