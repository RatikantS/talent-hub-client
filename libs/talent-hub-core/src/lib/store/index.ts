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
 * @fileoverview Stores Module - Barrel Export
 *
 * This file serves as the public API for all NgRx Signal stores in the talent-hub-core library.
 * These stores are shared across all micro-frontends and provide centralized state management
 * for cross-cutting concerns.
 *
 * ## Usage
 *
 * ```typescript
 * import { AuthStore, AppStore } from '@talent-hub/core/store';
 *
 * @Component({
 *   template: `
 *     @if (authStore.isAuthenticated()) {
 *       <span>Welcome, {{ authStore.user()?.firstName }}</span>
 *     }
 *   `
 * })
 * export class HeaderComponent {
 *   protected authStore = inject(AuthStore);
 *   protected appStore = inject(AppStore);
 * }
 * ```
 *
 * ## Available Stores
 *
 * | Store | State | Description |
 * |-------|-------|-------------|
 * | `AuthStore` | User, tokens, login status | Authentication state management |
 * | `AppStore` | Theme, language, loading | Application-wide state management |
 * | `TenantStore` | Tenant, preferences, features | Multi-tenant state management |
 *
 * ## Available Interfaces
 *
 * | Interface | Description |
 * |-----------|-------------|
 * | `TenantState` | Tenant state interface (currentTenant, tenantPreference, availableTenants) |
 *
 * @module store
 * @publicApi
 */

/** Authentication state store - manages user session, tokens, and login status */
export * from './auth/auth.store';

/** Application state store - manages theme, language, and global loading state */
export * from './app/app.store';

/** Tenant state store - manages tenant context and preferences */
export * from './tenant/tenant.store';

/** Tenant state interface - defines the shape of tenant state */
export * from './tenant/tenant-state.interface';
