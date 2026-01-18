/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { FeatureFlagService } from '../services';
import { AppStore } from '../store';

describe('FeatureFlagService', () => {
  let appStore: { getConfig: ReturnType<typeof vi.fn> };
  let service: FeatureFlagService;

  beforeEach(() => {
    appStore = { getConfig: vi.fn() };
    TestBed.configureTestingModule({
      providers: [FeatureFlagService, { provide: AppStore, useValue: appStore }],
    });
    service = TestBed.inject(FeatureFlagService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true if the feature flag is enabled', () => {
    appStore.getConfig.mockReturnValue({ features: { test: true } });
    expect(service.isEnabled('test')).toBe(true);
  });

  it('should return false if the feature flag is disabled', () => {
    appStore.getConfig.mockReturnValue({ features: { test: false } });
    expect(service.isEnabled('test')).toBe(false);
  });

  it('should return false if the feature flag is not present', () => {
    appStore.getConfig.mockReturnValue({ features: {} });
    expect(service.isEnabled('missing')).toBe(false);
  });

  it('should return false if config is null', () => {
    appStore.getConfig.mockReturnValue(null);
    expect(service.isEnabled('any')).toBe(false);
  });

  it('features signal should reflect the current features object (a, b)', () => {
    appStore.getConfig.mockReturnValue({ features: { a: true, b: false } });
    service = TestBed.inject(FeatureFlagService);
    expect(service.features()).toEqual({ a: true, b: false });
  });

  it('features signal should reflect the current features object (c)', () => {
    appStore.getConfig.mockReturnValue({ features: { c: true } });
    service = TestBed.inject(FeatureFlagService);
    expect(service.features()).toEqual({ c: true });
  });

  it('features signal should default to empty object if config or features is missing', () => {
    appStore.getConfig.mockReturnValue(null);
    expect(service.features()).toEqual({});
    appStore.getConfig.mockReturnValue({});
    expect(service.features()).toEqual({});
  });
});
