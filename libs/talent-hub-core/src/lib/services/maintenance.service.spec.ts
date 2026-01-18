/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { MaintenanceService } from '../services';
import { AppStore } from '../store';

describe('MaintenanceService', () => {
  let appStore: {
    isMaintenanceModeEnabled?: () => boolean;
    setMaintenanceModeEnabled: ReturnType<typeof vi.fn>;
  };
  let service: MaintenanceService;

  beforeEach(() => {
    appStore = {
      isMaintenanceModeEnabled: vi.fn(),
      setMaintenanceModeEnabled: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [MaintenanceService, { provide: AppStore, useValue: appStore }],
    });
    service = TestBed.inject(MaintenanceService);
  });

  it('should return true if maintenance mode is enabled', () => {
    appStore.isMaintenanceModeEnabled = vi.fn().mockReturnValue(true);
    expect(service.isInMaintenance()).toBe(true);
    expect(service.getMaintenanceMode()).toBe(true);
  });

  it('should return false if maintenance mode is disabled', () => {
    appStore.isMaintenanceModeEnabled = vi.fn().mockReturnValue(false);
    expect(service.isInMaintenance()).toBe(false);
    expect(service.getMaintenanceMode()).toBe(false);
  });

  it('should return false if isMaintenanceModeEnabled is undefined', () => {
    appStore.isMaintenanceModeEnabled = undefined;
    expect(service.isInMaintenance()).toBe(false);
    expect(service.getMaintenanceMode()).toBe(false);
  });

  it('should call setMaintenanceMode on the store', () => {
    service.setMaintenanceMode(true);
    expect(appStore.setMaintenanceModeEnabled).toHaveBeenCalledWith(true);
    service.setMaintenanceMode(false);
    expect(appStore.setMaintenanceModeEnabled).toHaveBeenCalledWith(false);
  });
});
