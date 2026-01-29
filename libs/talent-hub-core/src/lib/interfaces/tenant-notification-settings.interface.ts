/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { NotificationSettings } from './notification-settings.interface';

/**
 * Tenant-wide notification settings.
 *
 * @remarks
 * Extends the base `NotificationSettings` to define the default notification
 * configuration for all users within a tenant. Individual users can override
 * these settings with their own preferences.
 *
 * @example
 * ```typescript
 * import { TenantNotificationSettings } from '@talent-hub/core/interfaces';
 *
 * const notifications: TenantNotificationSettings = {
 *   email: true,
 *   inApp: true,
 *   push: false,
 *   digestFrequency: 'daily',
 * };
 * ```
 *
 * @see NotificationSettings
 * @see TenantPreference
 * @see UserNotificationPreference
 * @publicApi
 */
export type TenantNotificationSettings = NotificationSettings;
