/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { DigestFrequency } from '../types';

/**
 * Effective notification preferences after merging tenant and user settings.
 *
 * @remarks
 * Contains the final notification values after merging tenant defaults
 * with user overrides. All fields are guaranteed to have values.
 *
 * @example
 * ```typescript
 * import { EffectiveNotification } from '@talent-hub/core/interfaces';
 *
 * const notifications: EffectiveNotification = {
 *   email: true,
 *   inApp: true,
 *   push: false,
 *   digestFrequency: 'daily',
 * };
 * ```
 *
 * @see NotificationSettings
 * @see TenantNotificationSettings
 * @see UserNotificationPreference
 * @see EffectivePreference
 * @publicApi
 */
export interface EffectiveNotification {
  /**
   * Whether email notifications are enabled.
   *
   * When `true`, the system sends email notifications for relevant events.
   * This is the final resolved value after merging tenant defaults with user preferences.
   *
   * @remarks
   * - Respects user's quiet hours settings.
   * - Subject to category-level overrides.
   * - Requires verified email address to function.
   *
   * @example
   * ```typescript
   * if (notifications.email) {
   *   sendEmailNotification(user.email, message);
   * }
   * ```
   */
  email: boolean;

  /**
   * Whether in-app notifications are enabled.
   *
   * When `true`, the system displays notifications within the application UI
   * (e.g., notification bell, toast messages, notification center).
   *
   * @remarks
   * - Real-time delivery via WebSocket or polling.
   * - Stored in notification history for later viewing.
   * - Can be marked as read/unread by the user.
   *
   * @example
   * ```typescript
   * if (notifications.inApp) {
   *   notificationService.showToast(message);
   * }
   * ```
   */
  inApp: boolean;

  /**
   * Whether push notifications are enabled.
   *
   * When `true`, the system sends browser push notifications or mobile push
   * notifications for relevant events.
   *
   * @remarks
   * - Requires user permission for browser push.
   * - May require service worker registration.
   * - Respects quiet hours and category settings.
   *
   * @example
   * ```typescript
   * if (notifications.push && Notification.permission === 'granted') {
   *   new Notification(message.title, { body: message.body });
   * }
   * ```
   */
  push: boolean;

  /**
   * Frequency at which email digests are sent.
   *
   * Determines how often aggregated notification summaries are emailed to the user.
   * This is the final resolved value from the `DigestFrequency` type.
   *
   * @remarks
   * - Common values: 'immediately', 'daily', 'weekly', 'never'.
   * - 'immediately' sends emails as events occur.
   * - Digests reduce email volume while keeping users informed.
   *
   * @see DigestFrequency
   *
   * @example
   * ```typescript
   * if (notifications.digestFrequency === 'daily') {
   *   scheduleDigestEmail(user.email, '08:00');
   * }
   * ```
   */
  digestFrequency: DigestFrequency;
}
