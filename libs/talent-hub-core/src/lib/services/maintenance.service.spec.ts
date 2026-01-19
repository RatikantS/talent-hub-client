/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MaintenanceService } from '../services';

// Use vi.hoisted to declare variables that can be accessed inside vi.mock
const { mockAppStore } = vi.hoisted(() => {
  return {
    mockAppStore: {
      isMaintenanceModeEnabled: vi.fn(),
      setMaintenanceModeEnabled: vi.fn(),
    },
  };
});

// Mock @angular/core inject before importing MaintenanceService
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

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MaintenanceService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true if maintenance mode is enabled', () => {
    mockAppStore.isMaintenanceModeEnabled.mockReturnValue(true);
    expect(service.isInMaintenance()).toBe(true);
    expect(service.getMaintenanceMode()).toBe(true);
  });

  it('should return false if maintenance mode is disabled', () => {
    mockAppStore.isMaintenanceModeEnabled.mockReturnValue(false);
    expect(service.isInMaintenance()).toBe(false);
    expect(service.getMaintenanceMode()).toBe(false);
  });

  it('should return false if isMaintenanceModeEnabled is undefined', () => {
    (mockAppStore as any).isMaintenanceModeEnabled = undefined;
    expect(service.isInMaintenance()).toBe(false);
    expect(service.getMaintenanceMode()).toBe(false);
  });

  it('should call setMaintenanceMode on the store', () => {
    service.setMaintenanceMode(true);
    expect(mockAppStore.setMaintenanceModeEnabled).toHaveBeenCalledWith(true);
    service.setMaintenanceMode(false);
    expect(mockAppStore.setMaintenanceModeEnabled).toHaveBeenCalledWith(false);
  });
});
