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
 * @fileoverview Services Module - Barrel Export
 *
 * This file serves as the public API for all Angular services in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { AuthService, LoggerService, ApiService } from '@talent-hub/core/services';
 *
 * @Component({...})
 * export class MyComponent {
 *   private authService = inject(AuthService);
 *   private logger = inject(LoggerService);
 * }
 * ```
 *
 * ## Available Services
 *
 * | Service | Description |
 * |---------|-------------|
 * | `ApiService` | Base HTTP client with typed requests |
 * | `AuthService` | Authentication and session management |
 * | `CookieService` | Cookie storage operations |
 * | `EventBusService` | Cross-component event communication |
 * | `FeatureFlagService` | Feature toggle management |
 * | `LoadingIndicatorService` | Global loading state management |
 * | `LoggerService` | Structured logging with levels |
 * | `MaintenanceService` | Maintenance mode detection |
 * | `StorageService` | LocalStorage/SessionStorage abstraction |
 * | `UserService` | User data and preferences management |
 *
 * @module services
 * @publicApi
 */

/** Base HTTP client with typed request/response handling */
export * from './api.service';

/** Authentication and session management service */
export * from './auth.service';

/** Cookie storage operations with configurable options */
export * from './cookie.service';

/** Cross-component event communication bus */
export * from './event-bus.service';

/** Feature toggle management for gradual rollouts */
export * from './feature-flag.service';

/** Global loading state management */
export * from './loading-indicator.service';

/** Structured logging with configurable levels */
export * from './logger.service';

/** Maintenance mode detection and handling */
export * from './maintenance.service';

/** LocalStorage/SessionStorage abstraction with type safety */
export * from './storage.service';

/** Internationalization and translation service */
export * from './translate.service';

/** User data and preferences management */
export * from './user.service';
