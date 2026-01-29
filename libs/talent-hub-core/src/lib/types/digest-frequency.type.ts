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
 * Email digest frequency options for notification delivery.
 *
 * @remarks
 * Controls how often notification summaries are sent via email:
 * - `immediate` - Notifications are sent in real-time as they occur.
 * - `daily` - Notifications are bundled and sent once per day.
 * - `weekly` - Notifications are bundled and sent once per week.
 * - `none` - No email digests are sent (in-app notifications only).
 *
 * @example
 * ```typescript
 * import { DigestFrequency } from '@talent-hub/core/types';
 *
 * // Set tenant default
 * const tenantDigest: DigestFrequency = 'daily';
 *
 * // User override
 * const userDigest: DigestFrequency = 'immediate';
 * ```
 *
 * @see TenantNotificationSettings
 * @see UserNotificationPreference
 * @publicApi
 */
export type DigestFrequency = 'immediate' | 'daily' | 'weekly' | 'none';
