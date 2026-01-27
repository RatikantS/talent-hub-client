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

import { MaintenanceService } from '../services';

// Use vi.hoisted to declare mock store that can be accessed inside vi.mock
const { mockAppStore } = vi.hoisted(() => {
  let maintenanceModeEnabled = false;

  return {
    mockAppStore: {
      isMaintenanceModeEnabled: vi.fn(() => maintenanceModeEnabled),
      setMaintenanceModeEnabled: vi.fn((enabled: boolean) => {
        maintenanceModeEnabled = enabled;
      }),
      reset: () => {
        maintenanceModeEnabled = false;
      },
    },
  };
});

// Mock @angular/core inject before importing MaintenanceService
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

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppStore.reset();
    service = new MaintenanceService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true if maintenance mode is enabled', () => {
    mockAppStore.setMaintenanceModeEnabled(true);
    expect(service.isInMaintenance()).toBe(true);
    expect(service.getMaintenanceMode()).toBe(true);
  });

  it('should return false if maintenance mode is disabled', () => {
    mockAppStore.setMaintenanceModeEnabled(false);
    expect(service.isInMaintenance()).toBe(false);
    expect(service.getMaintenanceMode()).toBe(false);
  });

  it('should return false by default', () => {
    // Default state should be false
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
