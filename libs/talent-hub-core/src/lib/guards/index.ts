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
 * @fileoverview Guards Module - Barrel Export
 *
 * This file serves as the public API for all route guards in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { authGuard, rbacGuard, unsavedChangesGuard } from '@talent-hub/core/guards';
 *
 * export const routes: Routes = [
 *   {
 *     path: 'admin',
 *     canActivate: [authGuard, rbacGuard],
 *     data: { roles: ['admin'] },
 *     loadComponent: () => import('./admin.component')
 *   }
 * ];
 * ```
 *
 * ## Available Guards
 *
 * | Guard | Type | Description |
 * |-------|------|-------------|
 * | `authGuard` | CanActivate | Protects routes requiring authentication |
 * | `featureFlagGuard` | CanActivate | Controls access based on feature flags |
 * | `maintenanceGuard` | CanActivate | Redirects during maintenance mode |
 * | `rbacGuard` | CanActivate | Role-based access control |
 * | `unsavedChangesGuard` | CanDeactivate | Prevents navigation with unsaved changes |
 *
 * @module guards
 * @publicApi
 */

/** Protects routes requiring authentication, redirects to login if unauthenticated */
export * from './auth.guard';

/** Controls access based on feature flags for gradual feature rollouts */
export * from './feature-flag.guard';

/** Redirects to maintenance page when system is under maintenance */
export * from './maintenance.guard';

/** Role-based access control - checks user roles against route requirements */
export * from './rbac.guard';

/** Prevents navigation when form has unsaved changes, shows confirmation dialog */
export * from './unsaved-changes.guard';
