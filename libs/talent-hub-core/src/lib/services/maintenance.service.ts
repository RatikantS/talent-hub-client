/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { computed, inject, Injectable, Signal } from '@angular/core';

import { AppStore } from '../store';

/**
 * MaintenanceService - Provides access and control over the application's maintenance mode state.
 *
 * This service uses Angular signals and the NgRx Signal Store (AppStore) to expose
 * the maintenance mode state as a computed signal and provides methods to get and set
 * the maintenance mode flag. It is designed for use in guards, components, and services
 * that need to check or toggle maintenance mode globally.
 *
 * Usage:
 *   const maintenanceService = inject(MaintenanceService);
 *   if (maintenanceService.getMaintenanceMode()) { ... }
 *   maintenanceService.setMaintenanceMode(true);
 *
 * - Uses strict typing and avoids any.
 * - Returns false if the maintenance mode state is not set.
 * - Designed for global state management and reactivity.
 * - Provided in root (singleton).
 */
@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  /**
   * Reference to the global AppStore (NgRx Signal Store).
   * Used to access and update the maintenance mode state.
   */
  private readonly appStore: typeof AppStore = inject(AppStore);

  /**
   * Computed signal for maintenance mode.
   * Returns true if the application is in maintenance mode, false otherwise.
   *
   * Example:
   *   maintenanceService.isInMaintenance(); // true or false
   */
  readonly isInMaintenance: Signal<boolean> = computed(
    (): boolean => !!this.appStore.isMaintenanceModeEnabled?.(),
  );

  /**
   * Returns the current maintenance mode state as a boolean.
   *
   * Example:
   *   maintenanceService.getMaintenanceMode(); // true or false
   *
   * @returns {boolean} True if maintenance mode is enabled, false otherwise.
   */
  getMaintenanceMode(): boolean {
    return this.isInMaintenance();
  }

  /**
   * Sets the maintenance mode state in the global store.
   *
   * Example:
   *   maintenanceService.setMaintenanceMode(true);
   *
   * @param enabled - true to enable maintenance mode, false to disable
   */
  setMaintenanceMode(enabled: boolean): void {
    this.appStore.setMaintenanceModeEnabled(enabled);
  }
}
