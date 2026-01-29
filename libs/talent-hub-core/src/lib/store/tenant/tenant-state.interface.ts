/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Tenant, TenantPreference } from '../../interfaces';

/**
 * Represents the tenant-related state for the Talent Hub platform.
 *
 * This interface defines the structure of the tenant state object managed by the
 * `TenantStore`. It includes the current tenant information and tenant-level preferences.
 *
 * @remarks
 * **State Properties:**
 * - `currentTenant` - The currently active tenant context.
 * - `tenantPreference` - The tenant-level preference settings.
 * - `availableTenants` - List of tenants the user has access to (for multi-tenant users).
 *
 * @example
 * ```typescript
 * const tenantState: TenantState = {
 *   currentTenant: { id: 'tenant_123', name: 'Acme Corp', ... },
 *   tenantPreference: { tenantId: 'tenant_123', defaultLanguage: 'en', ... },
 *   availableTenants: [{ id: 'tenant_123', ... }, { id: 'tenant_456', ... }],
 * };
 * ```
 *
 * @see TenantStore
 * @see Tenant
 * @see TenantPreference
 * @publicApi
 */
export interface TenantState {
  /**
   * The currently active tenant context.
   * Null if no tenant is selected or user is not authenticated.
   */
  currentTenant: Tenant | null;

  /**
   * The tenant-level preference settings.
   * These serve as defaults for all users in the tenant.
   */
  tenantPreference: TenantPreference | null;

  /**
   * List of tenants the current user has access to.
   * Used for tenant switching functionality.
   */
  availableTenants: Tenant[];

  /**
   * Whether the tenant context has been initialized.
   */
  isInitialized: boolean;
}
