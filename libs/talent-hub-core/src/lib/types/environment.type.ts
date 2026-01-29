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
 * Type alias representing the allowed deployment environments for the application.
 *
 * This type provides a string literal union for type-safe environment checks
 * and configuration. It is used throughout the platform to distinguish between
 * different runtime environments such as development, staging, and production.
 *
 * @remarks
 * **Allowed Values:**
 * - `'development'` - Local development environment with debug tools enabled.
 * - `'staging'` - Pre-production environment for testing and QA.
 * - `'production'` - Live production environment serving real users.
 *
 * **Environment Characteristics:**
 * | Environment | Logging | Debug Tools | API Endpoint |
 * |-------------|---------|-------------|--------------|
 * | `'development'` | Verbose | Enabled | Local/Mock |
 * | `'staging'` | Standard | Limited | Staging API |
 * | `'production'` | Minimal | Disabled | Production API |
 *
 * **Usage:**
 * Use this type for:
 * - Function parameters that accept environment values.
 * - Environment configuration in API payloads.
 * - Type-safe environment checks and feature toggling.
 *
 * @example
 * ```typescript
 * // Type-safe environment variable
 * const env: Environment = 'production';
 *
 * // Environment-specific logic
 * function getApiUrl(environment: Environment): string {
 *   switch (environment) {
 *     case 'development':
 *       return 'http://localhost:3000/api';
 *     case 'staging':
 *       return 'https://api-staging.talent-hub.com';
 *     case 'production':
 *       return 'https://api.talent-hub.com';
 *   }
 * }
 *
 * // Feature toggling based on environment
 * const showDebugPanel = env !== 'production';
 *
 * // Configuration object
 * const config = {
 *   environment: 'staging' as Environment,
 *   apiUrl: getApiUrl('staging'),
 * };
 * ```
 *
 * @see AppConfig
 * @see AppStore
 * @publicApi
 */
export type Environment = 'development' | 'staging' | 'production';
