/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * EnvironmentType - Represents the allowed deployment environments for the application.
 *
 * This type is used throughout the platform to distinguish between different runtime environments
 * such as development, staging, and production. It enables type-safe environment checks and
 * environment-specific configuration.
 *
 * Usage example:
 *   const env: EnvironmentType = 'production';
 *   if (env === 'development') { ... }
 *
 * Notes:
 * - Only the three literal values are allowed: 'development', 'staging', 'production'.
 * - Use this type for environment checks, configuration, and feature toggling.
 */
export type EnvironmentType = 'development' | 'staging' | 'production';
