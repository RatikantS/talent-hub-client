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
 * User notification preferences.
 *
 * @remarks
 * Extends the base `NotificationSettings` with all properties optional (user overrides)
 * plus user-specific settings like quiet hours and category preferences.
 *
 * @example
 * ```typescript
 * import { UserNotificationPreference } from '@talent-hub/core/interfaces';
 *
 * const notifications: UserNotificationPreference = {
 *   email: true,
 *   inApp: true,
 *   push: false,
 *   digestFrequency: 'daily',
 *   quietHours: {
 *     enabled: true,
 *     startTime: '22:00',
 *     endTime: '08:00',
 *   },
 * };
 * ```
 *
 * @see NotificationSettings
 * @see TenantNotificationSettings
 * @see UserPreference
 * @publicApi
 */
export interface UserNotificationPreference extends Partial<NotificationSettings> {
  /**
   * Quiet hours configuration for notification delivery.
   *
   * When enabled, notifications are suppressed during the specified time window.
   * Useful for preventing notifications during sleep hours or focus time.
   *
   * @remarks
   * - Notifications received during quiet hours may be queued for later.
   * - Time values use HH:mm format in the user's local timezone.
   * - Can span midnight (e.g., 22:00 to 08:00).
   *
   * @example
   * ```typescript
   * const notifications: UserNotificationPreference = {
   *   quietHours: {
   *     enabled: true,
   *     startTime: '22:00',
   *     endTime: '08:00',
   *   },
   * };
   * ```
   */
  quietHours?: {
    /**
     * Whether quiet hours are enabled.
     *
     * When `true`, notifications are suppressed during the specified time window.
     */
    enabled: boolean;

    /**
     * Start time for quiet hours in HH:mm format.
     *
     * Notifications will be suppressed starting at this time.
     *
     * @example '22:00' for 10 PM
     */
    startTime: string;

    /**
     * End time for quiet hours in HH:mm format.
     *
     * Notifications will resume at this time.
     *
     * @example '08:00' for 8 AM
     */
    endTime: string;
  };

  /**
   * Notification category preferences.
   *
   * Allows users to selectively enable or disable notifications for specific
   * categories or event types (e.g., comments, mentions, assignments).
   *
   * @remarks
   * - Keys are category identifiers (e.g., 'comments', 'mentions', 'deadlines').
   * - Values are boolean flags (`true` = receive, `false` = suppress).
   * - Categories not specified use the tenant's default behavior.
   *
   * @example
   * ```typescript
   * const notifications: UserNotificationPreference = {
   *   categories: {
   *     comments: true,
   *     mentions: true,
   *     marketing: false,
   *     systemUpdates: false,
   *   },
   * };
   * ```
   */
  categories?: Record<string, boolean>;
}
