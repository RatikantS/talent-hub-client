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
 * Base notification settings shared between tenant and user levels.
 *
 * @remarks
 * This interface defines the common notification properties that exist
 * at both the tenant level (defaults) and user level (overrides).
 *
 * @example
 * ```typescript
 * import { NotificationSettings } from '@talent-hub/core/interfaces';
 *
 * const settings: NotificationSettings = {
 *   email: true,
 *   inApp: true,
 *   push: false,
 *   digestFrequency: 'daily',
 * };
 * ```
 *
 * @see TenantNotificationSettings
 * @see UserNotificationPreference
 * @see DigestFrequency
 * @publicApi
 */
export interface NotificationSettings {
  /**
   * Whether email notifications are enabled.
   *
   * When `true`, the system will send email notifications for relevant events
   * to the user's registered email address.
   *
   * @remarks
   * - Requires a valid, verified email address.
   * - Subject to `digestFrequency` for batching behavior.
   * - Can be overridden at the user level.
   *
   * @example
   * ```typescript
   * const settings: NotificationSettings = {
   *   email: true,
   *   inApp: true,
   *   push: false,
   *   digestFrequency: 'daily',
   * };
   * ```
   */
  email: boolean;

  /**
   * Whether in-app notifications are enabled.
   *
   * When `true`, the system will display notifications within the application UI,
   * including the notification center, toast messages, and notification badges.
   *
   * @remarks
   * - Real-time delivery via WebSocket or polling.
   * - Notifications are persisted for later viewing.
   * - Users can mark notifications as read/unread.
   *
   * @example
   * ```typescript
   * if (settings.inApp) {
   *   notificationCenter.add(notification);
   * }
   * ```
   */
  inApp: boolean;

  /**
   * Whether push notifications are enabled.
   *
   * When `true`, the system will send browser push notifications or mobile
   * push notifications for relevant events.
   *
   * @remarks
   * - Requires user permission for browser push notifications.
   * - May require service worker registration for web push.
   * - Mobile push requires device token registration.
   *
   * @example
   * ```typescript
   * if (settings.push) {
   *   pushService.send(notification);
   * }
   * ```
   */
  push: boolean;

  /**
   * Frequency at which email digests are sent.
   *
   * Determines how often aggregated notification summaries are delivered via email.
   * This helps reduce email volume while keeping users informed.
   *
   * @remarks
   * Common values from `DigestFrequency`:
   * - `'immediately'` - Send emails as events occur.
   * - `'daily'` - Send a daily summary email.
   * - `'weekly'` - Send a weekly summary email.
   * - `'never'` - Never send digest emails.
   *
   * @see DigestFrequency
   *
   * @example
   * ```typescript
   * const settings: NotificationSettings = {
   *   email: true,
   *   inApp: true,
   *   push: false,
   *   digestFrequency: 'weekly',
   * };
   * ```
   */
  digestFrequency: DigestFrequency;
}
