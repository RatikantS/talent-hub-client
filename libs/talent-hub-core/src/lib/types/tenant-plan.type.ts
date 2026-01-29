/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

/**
 * Type alias representing subscription plan levels available for tenants.
 *
 * This type provides a string literal union for type-safe plan selection
 * and feature gating. It determines which features and resource limits
 * are available to each tenant.
 *
 * @remarks
 * **Allowed Values:**
 * - `'free'` - Basic tier with limited features and usage caps.
 * - `'starter'` - Entry-level paid tier for small teams.
 * - `'professional'` - Mid-tier with advanced features and higher limits.
 * - `'enterprise'` - Full-featured tier for large organizations with premium support.
 *
 * **Plan Features Comparison:**
 * | Plan | Users | Storage | Support | Custom Domain |
 * |------|-------|---------|---------|---------------|
 * | `'free'` | 5 | 1GB | Community | No |
 * | `'starter'` | 25 | 10GB | Email | No |
 * | `'professional'` | 100 | 100GB | Priority | Yes |
 * | `'enterprise'` | Unlimited | Unlimited | Dedicated | Yes |
 *
 * **Usage:**
 * Use this type for:
 * - Feature gating based on subscription level.
 * - Displaying plan information in billing UI.
 * - API payloads for subscription management.
 *
 * @example
 * ```typescript
 * import { TenantPlan } from '@talent-hub/core/types';
 *
 * // Type-safe plan variable
 * const plan: TenantPlan = 'professional';
 *
 * // Feature gating based on plan
 * function hasFeature(plan: TenantPlan, feature: string): boolean {
 *   const features: Record<TenantPlan, string[]> = {
 *     free: ['basic-reports'],
 *     starter: ['basic-reports', 'email-notifications'],
 *     professional: ['basic-reports', 'email-notifications', 'advanced-analytics', 'api-access'],
 *     enterprise: ['basic-reports', 'email-notifications', 'advanced-analytics', 'api-access', 'sso', 'audit-logs'],
 *   };
 *   return features[plan].includes(feature);
 * }
 *
 * // Check user limits
 * function getUserLimit(plan: TenantPlan): number {
 *   const limits: Record<TenantPlan, number> = {
 *     free: 5,
 *     starter: 25,
 *     professional: 100,
 *     enterprise: Infinity,
 *   };
 *   return limits[plan];
 * }
 *
 * // Usage in component
 * if (hasFeature(tenant.plan, 'advanced-analytics')) {
 *   showAnalyticsDashboard();
 * }
 * ```
 *
 * @see Tenant
 * @see TenantStore
 * @publicApi
 */
export type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise';
