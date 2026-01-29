/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { TenantPlan } from '../types';

/**
 * Represents a tenant (organization) in the multi-tenant Talent Hub system.
 *
 * This interface defines the core tenant identity and configuration properties used
 * throughout the platform for tenant isolation, branding, and customization.
 *
 * @remarks
 * **Identity Properties:**
 * - `id` - Unique identifier for the tenant (UUID).
 * - `name` - Display name of the tenant/organization.
 * - `slug` - URL-friendly identifier (e.g., 'acme-corp').
 * - `domain` - Optional custom domain for the tenant.
 *
 * **Status Properties:**
 * - `isActive` - Whether the tenant account is active.
 * - `plan` - Subscription plan level.
 *
 * @example
 * ```typescript
 * const tenant: Tenant = {
 *   id: 'tenant_123456',
 *   name: 'Acme Corporation',
 *   slug: 'acme-corp',
 *   domain: 'talent.acme.com',
 *   isActive: true,
 *   plan: 'enterprise',
 * };
 * ```
 *
 * @see TenantPreference
 * @see TenantStore
 * @see TenantPlan
 * @publicApi
 */
export interface Tenant {
  /**
   * Unique identifier for the tenant.
   *
   * The primary key used to identify the tenant across the system.
   * Typically a UUID or prefixed string ID (e.g., 'tenant_123456').
   *
   * @remarks
   * - Use this ID for API calls, database lookups, and references.
   * - This value is immutable once the tenant is created.
   * - Prefer UUIDs over sequential IDs for security.
   *
   * @example
   * ```typescript
   * const tenantId = tenant.id; // 'tenant_123456'
   * fetchTenantData(tenantId);
   * ```
   */
  id: string;

  /**
   * Display name of the tenant/organization.
   *
   * The human-readable name used in the UI, reports, and communications.
   * Should be the official company or organization name.
   *
   * @remarks
   * - Used in headers, reports, and administrative UIs.
   * - Can be updated by tenant administrators.
   * - Maximum recommended length: 100 characters.
   *
   * @example
   * ```typescript
   * console.log(`Welcome to ${tenant.name}`);
   * // Output: Welcome to Acme Corporation
   * ```
   */
  name: string;

  /**
   * URL-friendly identifier for the tenant.
   *
   * A lowercase, hyphenated string used in URLs for tenant-specific routes.
   * Must be unique across all tenants.
   *
   * @remarks
   * - Used in URLs like `/t/acme-corp/dashboard`.
   * - Should only contain lowercase letters, numbers, and hyphens.
   * - Cannot be changed after creation (or requires careful migration).
   *
   * @example
   * ```typescript
   * const dashboardUrl = `/t/${tenant.slug}/dashboard`;
   * // Result: /t/acme-corp/dashboard
   * ```
   */
  slug: string;

  /**
   * Optional custom domain for the tenant.
   *
   * When set, the tenant can be accessed via this custom domain
   * instead of the standard URL pattern.
   *
   * @remarks
   * - Requires DNS configuration and SSL certificate provisioning.
   * - Example: `talent.acme.com` instead of `app.talenthub.com/t/acme-corp`.
   * - Enterprise feature - may require specific subscription plan.
   *
   * @example
   * ```typescript
   * if (tenant.domain) {
   *   redirectTo(`https://${tenant.domain}`);
   * }
   * ```
   */
  domain?: string;

  /**
   * Whether the tenant account is currently active.
   *
   * Determines if users can access the tenant's resources.
   * Inactive tenants may have restricted or no access.
   *
   * @remarks
   * - Inactive tenants may be due to subscription expiration, suspension, or deletion.
   * - Used by guards and services to restrict access.
   * - Administrators can reactivate inactive tenants.
   *
   * @example
   * ```typescript
   * if (!tenant.isActive) {
   *   showAccountSuspendedMessage();
   *   return;
   * }
   * ```
   */
  isActive: boolean;

  /**
   * Subscription plan level for the tenant.
   *
   * Determines which features and resource limits are available to the tenant.
   * Used for feature gating and usage enforcement.
   *
   * @remarks
   * Common plan values from `TenantPlan`:
   * - `'free'` - Basic features with limited usage.
   * - `'starter'` - Entry-level paid plan.
   * - `'professional'` - Mid-tier with more features.
   * - `'enterprise'` - Full features with premium support.
   *
   * @see TenantPlan
   *
   * @example
   * ```typescript
   * if (tenant.plan === 'enterprise') {
   *   enableAdvancedFeatures();
   * }
   *
   * const userLimit = getPlanUserLimit(tenant.plan);
   * ```
   */
  plan: TenantPlan;
}
