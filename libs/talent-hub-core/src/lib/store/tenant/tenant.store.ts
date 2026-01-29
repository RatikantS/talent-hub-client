/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Tenant, TenantBranding, TenantPreference } from '../../interfaces';
import { TenantState } from './tenant-state.interface';
import { AsyncState } from '../async-state.interface';
import { TenantPlan, Theme, TimeFormat } from '../../types';
import { APP_CONSTANT } from '../../constants';

/**
 * Initial tenant state for TenantStore.
 * @internal
 */
const initialState: TenantState & AsyncState = {
  currentTenant: null,
  tenantPreference: null,
  availableTenants: [],
  isInitialized: false,
  isLoading: false,
  error: undefined,
};

/**
 * TenantStore - Global signal-based state store for tenant management.
 *
 * This store manages the current tenant context, tenant preferences, and
 * available tenants for multi-tenant users. It provides the tenant-level
 * defaults that can be overridden by user preferences.
 *
 * @remarks
 * **Key Responsibilities:**
 * - Holds the current tenant context for the authenticated user.
 * - Manages tenant-level preferences (organization defaults).
 * - Supports tenant switching for users with access to multiple tenants.
 * - Provides computed properties for easy access to tenant settings.
 *
 * **State Signals (Readable):**
 * - `currentTenant()` - The active tenant or `null`.
 * - `tenantPreference()` - The tenant's preference settings or `null`.
 * - `availableTenants()` - List of tenants user can access.
 * - `isInitialized()` - Whether tenant context is loaded.
 * - `isLoading()` - Whether an async operation is in progress.
 * - `error()` - Current error object, if any.
 *
 * **Computed Signals:**
 * - `tenantId()` - Current tenant's ID or `null`.
 * - `tenantName()` - Current tenant's display name.
 * - `tenantSlug()` - Current tenant's URL slug.
 * - `tenantPlan()` - Current tenant's subscription plan.
 * - `isTenantActive()` - Whether the tenant account is active.
 * - `hasMultipleTenants()` - Whether user has access to multiple tenants.
 * - `defaultLanguage()` - Tenant's default language.
 * - `defaultTheme()` - Tenant's default theme.
 * - `allowedLanguages()` - Languages available in this tenant.
 * - `defaultDateFormat()` - Tenant's default date format.
 * - `defaultTimeFormat()` - Tenant's default time format.
 * - `defaultTimezone()` - Tenant's default timezone.
 * - `branding()` - Tenant's branding configuration.
 * - `tenantFeatures()` - Tenant's feature flags.
 *
 * @example
 * ```typescript
 * private readonly tenantStore = inject(TenantStore);
 *
 * // Initialize with tenant data
 * this.tenantStore.initialize(tenant, tenantPreference, availableTenants);
 *
 * // Access tenant info
 * const tenantName = this.tenantStore.tenantName();
 *
 * // Switch tenant
 * this.tenantStore.switchTenant(newTenantId);
 *
 * // Check tenant plan
 * if (this.tenantStore.tenantPlan() === 'enterprise') {
 *   this.enableEnterpriseFeatures();
 * }
 * ```
 *
 * @see TenantState
 * @see Tenant
 * @see TenantPreference
 * @publicApi
 */
export const TenantStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ currentTenant, tenantPreference, availableTenants }) => ({
    /**
     * Current tenant's ID or null if not set.
     */
    tenantId: computed((): string | null => currentTenant()?.id ?? null),

    /**
     * Current tenant's display name or empty string.
     */
    tenantName: computed((): string => currentTenant()?.name ?? ''),

    /**
     * Current tenant's URL slug or empty string.
     */
    tenantSlug: computed((): string => currentTenant()?.slug ?? ''),

    /**
     * Current tenant's subscription plan or null.
     */
    tenantPlan: computed((): TenantPlan | null => currentTenant()?.plan ?? null),

    /**
     * Whether the tenant is active.
     */
    isTenantActive: computed((): boolean => currentTenant()?.isActive ?? false),

    /**
     * Whether user has access to multiple tenants.
     */
    hasMultipleTenants: computed((): boolean => availableTenants().length > 1),

    /**
     * Tenant's default language setting.
     */
    defaultLanguage: computed(
      (): string => tenantPreference()?.defaultLanguage ?? APP_CONSTANT.DEFAULT_LANGUAGE,
    ),

    /**
     * Tenant's default Theme setting.
     */
    defaultTheme: computed((): Theme | null => tenantPreference()?.defaultTheme ?? null),

    /**
     * Languages allowed in this tenant.
     */
    allowedLanguages: computed((): string[] => tenantPreference()?.allowedLanguages ?? ['en']),

    /**
     * Tenant's default date format.
     */
    defaultDateFormat: computed(
      (): string => tenantPreference()?.dateFormat ?? APP_CONSTANT.DEFAULT_DATE_FORMAT,
    ),

    /**
     * Tenant's default time format.
     */
    defaultTimeFormat: computed(
      (): TimeFormat => tenantPreference()?.timeFormat ?? APP_CONSTANT.DEFAULT_TIME_FORMAT,
    ),

    /**
     * Tenant's default timezone.
     */
    defaultTimezone: computed(
      (): string => tenantPreference()?.timezone ?? APP_CONSTANT.DEFAULT_TIME_ZONE,
    ),

    /**
     * Tenant branding configuration.
     */
    branding: computed((): TenantBranding | null => tenantPreference()?.branding ?? null),

    /**
     * Tenant feature flags.
     */
    tenantFeatures: computed((): Record<string, boolean> => tenantPreference()?.features ?? {}),
  })),

  withMethods((store) => ({
    /**
     * Initializes the tenant store with tenant data.
     *
     * @param tenant - The current tenant.
     * @param preference - The tenant's preference settings.
     * @param availableTenants - List of all tenants user can access.
     */
    initialize(
      tenant: Tenant,
      preference: TenantPreference,
      availableTenants: Tenant[] = [],
    ): void {
      patchState(store, {
        currentTenant: tenant,
        tenantPreference: preference,
        availableTenants: availableTenants.length > 0 ? availableTenants : [tenant],
        isInitialized: true,
        isLoading: false,
        error: undefined,
      });
    },

    /**
     * Sets the current tenant.
     *
     * @param tenant - The tenant to set as current.
     */
    setCurrentTenant(tenant: Tenant): void {
      patchState(store, { currentTenant: tenant });
    },

    /**
     * Sets the tenant preference.
     *
     * @param preference - The tenant preference to set.
     */
    setTenantPreference(preference: TenantPreference): void {
      patchState(store, { tenantPreference: preference });
    },

    /**
     * Updates a specific tenant preference field.
     *
     * @param updates - Partial preference updates.
     */
    updateTenantPreference(updates: Partial<TenantPreference>): void {
      const current: TenantPreference | null = store.tenantPreference();
      if (current) {
        patchState(store, {
          tenantPreference: { ...current, ...updates },
        });
      }
    },

    /**
     * Sets the list of available tenants.
     *
     * @param tenants - List of tenants.
     */
    setAvailableTenants(tenants: Tenant[]): void {
      patchState(store, { availableTenants: tenants });
    },

    /**
     * Switches to a different tenant context.
     *
     * @param tenantId - The ID of the tenant to switch to.
     * @returns Whether the switch was successful.
     */
    switchTenant(tenantId: string): boolean {
      const targetTenant: Tenant | undefined = store
        .availableTenants()
        .find((t: Tenant): boolean => t.id === tenantId);
      if (targetTenant) {
        patchState(store, {
          currentTenant: targetTenant,
          // Preference will be loaded separately via API
          tenantPreference: null,
        });
        return true;
      }
      return false;
    },

    /**
     * Checks if a feature is enabled at the tenant level.
     *
     * @param featureKey - The feature key to check.
     * @returns Whether the feature is enabled.
     */
    isFeatureEnabled(featureKey: string): boolean {
      return store.tenantPreference()?.features?.[featureKey] ?? false;
    },

    /**
     * Sets the loading state.
     *
     * @param isLoading - Whether loading is in progress.
     */
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    /**
     * Sets an error state.
     *
     * @param error - The error to set.
     */
    setError(error: Error | undefined): void {
      patchState(store, { error, isLoading: false });
    },

    /**
     * Clears the error state.
     */
    clearError(): void {
      patchState(store, { error: undefined });
    },

    /**
     * Resets the store to initial state.
     */
    reset(): void {
      patchState(store, initialState);
    },
  })),
);
