/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * Enum representing the deployment environment for the Talent Hub application.
 *
 * Use this to distinguish between different runtime environments and to enable
 * environment-specific configuration, logging, and feature toggling.
 */
export enum Environment {
  Development = 'development', // Local or development environment
  Staging = 'staging', // Pre-production or staging environment
  Production = 'production', // Live/production environment
}
