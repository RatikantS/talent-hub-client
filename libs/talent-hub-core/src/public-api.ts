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
 * @fileoverview Public API Surface of talent-hub-core
 *
 * This is the main entry point for the `@talent-hub/core` library.
 * It provides shared functionality, services, guards, interceptors,
 * and utilities used across all Talent Hub micro-frontends.
 *
 * ## Entry Points
 *
 * | Entry Point                  | Description                           |
 * |------------------------------|---------------------------------------|
 * | `@talent-hub/core`           | All exports (main entry)              |
 * | `@talent-hub/core/services`  | Angular services                      |
 * | `@talent-hub/core/guards`    | Route guards                          |
 * | `@talent-hub/core/interceptors` | HTTP interceptors                  |
 * | `@talent-hub/core/store`     | NgRx Signal stores                    |
 * | `@talent-hub/core/interfaces`| TypeScript interfaces                 |
 * | `@talent-hub/core/types`     | Type definitions                      |
 * | `@talent-hub/core/constants` | Application constants                 |
 * | `@talent-hub/core/tokens`    | Injection tokens                      |
 * | `@talent-hub/core/models`    | Data models                           |
 * | `@talent-hub/core/utils`     | Utility functions                     |
 *
 * ## Usage Examples
 *
 * ```typescript
 * // Services
 * import { AuthService, LoggerService, ApiService } from '@talent-hub/core/services';
 *
 * // Guards
 * import { authGuard, rbacGuard } from '@talent-hub/core/guards';
 *
 * // Interceptors
 * import { authInterceptor, errorHandlingInterceptor } from '@talent-hub/core/interceptors';
 *
 * // Stores
 * import { AuthStore, AppStore, TenantStore } from '@talent-hub/core/store';
 *
 * // Interfaces
 * import { User, AppConfig, Tenant, TenantPreference } from '@talent-hub/core/interfaces';
 *
 * // Or import from main entry point
 * import { AuthService, authGuard, User } from '@talent-hub/core';
 * ```
 *
 * @module talent-hub-core
 * @author Talent Hub Team
 * @version 1.0.0
 *
 * @publicApi
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Application-wide constants.
 *
 * Available constants:
 * - `APP_CONSTANTS` - Core application configuration constants
 *
 * @see {@link ./lib/constants} for constant definitions
 */
export * from './lib/constants';

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * TypeScript interfaces for data structures.
 *
 * Available interfaces:
 * - `User` - User identity and authorization properties
 * - `AppConfig` - Application configuration settings
 * - `CookieOptions` - Cookie storage options
 * - `EventBusMessage` - Inter-component messaging format
 * - `HttpOptions` - HTTP request configuration
 * - `LogConfig` - Logging configuration
 * - `UserPreference` - User preference settings
 * - `AppPreference` - Application-level preference settings for AppStore
 *
 * @see {@link ./lib/interfaces} for interface definitions
 */
export * from './lib/interfaces';

// =============================================================================
// MODELS
// =============================================================================

/**
 * Data models and classes.
 *
 * Available models:
 * - `EventMetadata` - Metadata for event tracking and auditing
 *
 * @see {@link ./lib/models} for model definitions
 */
export * from './lib/models';

// =============================================================================
// TYPES
// =============================================================================

/**
 * TypeScript type definitions and aliases.
 *
 * Available types:
 * - `Environment` - Environment string literal types
 * - `LogLevel` - Log level string literal types
 * - `StorageType` - Storage mechanism types (local, session)
 * - `Theme` - Theme string literal types
 *
 * @see {@link ./lib/types} for type definitions
 */
export * from './lib/types';

// =============================================================================
// INTERCEPTORS
// =============================================================================

/**
 * HTTP interceptors for request/response handling.
 *
 * Available interceptors:
 * - `apiPrefixInterceptor` - Adds API base URL prefix to requests
 * - `authInterceptor` - Attaches authentication tokens to requests
 * - `cacheInterceptor` - Caches HTTP responses for performance
 * - `errorHandlingInterceptor` - Global error handling and transformation
 * - `loadingIndicatorInterceptor` - Manages loading state during requests
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * import {
 *   authInterceptor,
 *   errorHandlingInterceptor,
 *   loadingIndicatorInterceptor
 * } from '@talent-hub/core/interceptors';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([
 *         authInterceptor,
 *         errorHandlingInterceptor,
 *         loadingIndicatorInterceptor
 *       ])
 *     )
 *   ]
 * };
 * ```
 *
 * @see {@link ./lib/interceptors} for interceptor implementations
 */
export * from './lib/interceptors';

// =============================================================================
// GUARDS
// =============================================================================

/**
 * Route guards for navigation protection.
 *
 * Available guards:
 * - `authGuard` - Protects routes requiring authentication
 * - `featureFlagGuard` - Controls access based on feature flags
 * - `maintenanceGuard` - Redirects during maintenance mode
 * - `rbacGuard` - Role-based access control
 * - `unsavedChangesGuard` - Prevents navigation with unsaved changes
 *
 * @example
 * ```typescript
 * // app.routes.ts
 * import { authGuard, rbacGuard } from '@talent-hub/core/guards';
 *
 * export const routes: Routes = [
 *   {
 *     path: 'admin',
 *     canActivate: [authGuard, rbacGuard],
 *     data: { roles: ['admin'] },
 *     loadComponent: () => import('./admin/admin.component')
 *   }
 * ];
 * ```
 *
 * @see {@link ./lib/guards} for guard implementations
 */
export * from './lib/guards';

// =============================================================================
// SERVICES
// =============================================================================

/**
 * Angular services for shared functionality.
 *
 * Available services:
 * - `ApiService` - Base HTTP client with typed requests
 * - `AuthService` - Authentication and session management
 * - `CookieService` - Cookie storage operations
 * - `EventBusService` - Cross-component event communication
 * - `FeatureFlagService` - Feature toggle management
 * - `LoadingIndicatorService` - Global loading state management
 * - `LoggerService` - Structured logging with levels
 * - `MaintenanceService` - Maintenance mode detection
 * - `StorageService` - LocalStorage/SessionStorage abstraction
 * - `UserService` - User data and preferences management
 *
 * @example
 * ```typescript
 * import { AuthService, LoggerService } from '@talent-hub/core/services';
 *
 * @Component({...})
 * export class MyComponent {
 *   private authService = inject(AuthService);
 *   private logger = inject(LoggerService);
 *
 *   login() {
 *     this.logger.info('Attempting login...');
 *     this.authService.login(credentials);
 *   }
 * }
 * ```
 *
 * @see {@link ./lib/services} for service implementations
 */
export * from './lib/services';

// =============================================================================
// STORES
// =============================================================================

/**
 * NgRx Signal stores for state management.
 *
 * Available stores:
 * - `AuthStore` - Authentication state (user, tokens, login status)
 * - `AppStore` - Application state (theme, language, loading)
 * - `TenantStore` - Tenant state (current tenant, preferences, features)
 *
 * @example
 * ```typescript
 * import { AuthStore, AppStore, TenantStore } from '@talent-hub/core/store';
 *
 * @Component({...})
 * export class MyComponent {
 *   private authStore = inject(AuthStore);
 *   private appStore = inject(AppStore);
 *   private tenantStore = inject(TenantStore);
 *
 *   user = this.authStore.user;
 *   isLoading = this.appStore.isLoading;
 *   tenantName = this.tenantStore.tenantName;
 * }
 * ```
 *
 * @see {@link ./lib/store} for store implementations
 */
export * from './lib/store';

// =============================================================================
// TOKENS
// =============================================================================

/**
 * Injection tokens for dependency injection.
 *
 * Available tokens:
 * - `API_BASE_URL` - Base URL for API requests
 * - `TRANSLATE_CONFIG` - Translation configuration with locales and messages
 *
 * @example
 * ```typescript
 * import { API_BASE_URL } from '@talent-hub/core/tokens';
 *
 * // Provide in app.config.ts
 * { provide: API_BASE_URL, useValue: 'https://api.talent-hub.com' }
 *
 * // Inject in service
 * private apiBaseUrl = inject(API_BASE_URL);
 * ```
 *
 * @see {@link ./lib/tokens} for token definitions
 */
export * from './lib/tokens';

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Utility functions and helpers.
 *
 * Available utilities:
 * - `AppUtil` - Application-level utility functions
 * - `PlatformUtil` - Platform detection utilities (browser, mobile, etc.)
 *
 * @example
 * ```typescript
 * import { PlatformUtil } from '@talent-hub/core/utils';
 *
 * if (PlatformUtil.isBrowser()) {
 *   // Browser-specific code
 * }
 * ```
 *
 * @see {@link ./lib/utils} for utility implementations
 */
export * from './lib/utils';
