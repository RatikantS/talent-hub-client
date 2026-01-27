/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { computed, inject, Injectable, Signal } from '@angular/core';

import { AppStore } from '../store';

/**
 * MaintenanceService - Provides access and control over the application's maintenance mode state.
 *
 * This service acts as a facade over the AppStore's maintenance mode functionality,
 * providing a clean API for checking and toggling maintenance mode. When maintenance
 * mode is enabled, the application should display a maintenance page and restrict
 * user access to normal functionality.
 *
 * @remarks
 * - Uses Angular signals for reactive state management.
 * - Maintenance mode state is stored in the global AppStore (NgRx Signal Store).
 * - Use `isInMaintenance` signal for reactive UI bindings that update automatically.
 * - Use `getMaintenanceMode()` for one-time checks in guards or services.
 * - Use `setMaintenanceMode()` to toggle maintenance mode (e.g., from admin controls).
 * - Returns `false` if the maintenance mode state is not set or undefined.
 * - Designed for use across all micro-frontends (MFEs) for consistent behavior.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly maintenance = inject(MaintenanceService);
 *
 * // Check maintenance mode in a guard
 * canActivate(): boolean {
 *   if (this.maintenance.getMaintenanceMode()) {
 *     this.router.navigate(['/maintenance']);
 *     return false;
 *   }
 *   return true;
 * }
 *
 * // Use reactive signal in a component template
 * // @if (maintenance.isInMaintenance()) {
 * //   <app-maintenance-page />
 * // } @else {
 * //   <router-outlet />
 * // }
 *
 * // Toggle maintenance mode from admin panel
 * toggleMaintenance(enabled: boolean): void {
 *   this.maintenance.setMaintenanceMode(enabled);
 * }
 * ```
 *
 * @see AppStore
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  /**
   * Reference to the global AppStore (NgRx Signal Store).
   * Used to access and update the maintenance mode state.
   * @internal
   */
  private readonly appStore = inject(AppStore);

  /**
   * Computed signal for maintenance mode status.
   *
   * Returns `true` if the application is in maintenance mode, `false` otherwise.
   * This signal updates automatically when the maintenance mode state changes
   * in the AppStore, making it ideal for reactive UI bindings.
   *
   * @example
   * ```typescript
   * // In component class
   * readonly isInMaintenance = this.maintenanceService.isInMaintenance;
   *
   * // In template
   * // @if (isInMaintenance()) {
   * //   <div class="maintenance-banner" role="alert">
   * //     System is under maintenance. Please try again later.
   * //   </div>
   * // }
   * ```
   */
  readonly isInMaintenance: Signal<boolean> = computed(
    (): boolean => !!this.appStore.isMaintenanceModeEnabled?.(),
  );

  /**
   * Returns the current maintenance mode state as a boolean.
   *
   * Performs a one-time lookup of the maintenance mode state. Use this method
   * for imperative checks in guards, services, or lifecycle hooks.
   *
   * @returns `true` if maintenance mode is enabled, `false` otherwise.
   *
   * @example
   * ```typescript
   * // Check in a route guard
   * canActivate(): boolean {
   *   if (this.maintenanceService.getMaintenanceMode()) {
   *     this.router.navigate(['/maintenance']);
   *     return false;
   *   }
   *   return true;
   * }
   *
   * // Check before making API calls
   * fetchData(): Observable<Data> {
   *   if (this.maintenanceService.getMaintenanceMode()) {
   *     return throwError(() => new Error('Service unavailable during maintenance'));
   *   }
   *   return this.http.get<Data>('/api/data');
   * }
   * ```
   */
  getMaintenanceMode(): boolean {
    return this.isInMaintenance();
  }

  /**
   * Sets the maintenance mode state in the global store.
   *
   * Enables or disables maintenance mode application-wide. When enabled,
   * all MFEs should respond by displaying maintenance UI and restricting
   * normal functionality.
   *
   * @param enabled - `true` to enable maintenance mode, `false` to disable.
   *
   * @example
   * ```typescript
   * // Enable maintenance mode
   * this.maintenanceService.setMaintenanceMode(true);
   *
   * // Disable maintenance mode
   * this.maintenanceService.setMaintenanceMode(false);
   *
   * // Toggle from admin controls
   * onMaintenanceToggle(event: Event): void {
   *   const checkbox = event.target as HTMLInputElement;
   *   this.maintenanceService.setMaintenanceMode(checkbox.checked);
   * }
   *
   * // Enable temporarily for scheduled maintenance
   * async performScheduledMaintenance(): Promise<void> {
   *   this.maintenanceService.setMaintenanceMode(true);
   *   try {
   *     await this.runMaintenanceTasks();
   *   } finally {
   *     this.maintenanceService.setMaintenanceMode(false);
   *   }
   * }
   * ```
   */
  setMaintenanceMode(enabled: boolean): void {
    this.appStore.setMaintenanceModeEnabled(enabled);
  }
}
