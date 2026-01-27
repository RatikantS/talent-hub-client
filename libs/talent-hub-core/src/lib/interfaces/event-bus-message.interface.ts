/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { EventMetaData } from '../models';

/**
 * Represents a message published or received via the EventBusService.
 *
 * This interface defines the structure of event messages that flow through
 * the application's event bus. It wraps the event key with its associated
 * metadata, providing a consistent format for all event-based communication.
 *
 * @typeParam T - The type of the event data payload. Defaults to `unknown`.
 *
 * @remarks
 * **Properties:**
 * - `key` - String identifier for the event type (used for routing/filtering).
 * - `metadata` - `EventMetaData<T>` containing event details and payload.
 *
 * **Usage:**
 * This interface is used internally by the `EventBusService` to structure
 * event messages. You typically don't create these manually; instead, use
 * `EventBusService.publish()` and `EventBusService.on()`.
 *
 * **Event Flow:**
 * 1. Publisher calls `eventBus.publish(key, data)`
 * 2. EventBusService creates `EventMetaData` and wraps it in `EventBusMessage`
 * 3. Subscribers receive `EventMetaData` via `eventBus.on(key).subscribe()`
 *
 * @example
 * ```typescript
 * // Define event data type
 * interface UserCreatedData {
 *   userId: string;
 *   email: string;
 *   createdAt: Date;
 * }
 *
 * // Publishing an event (message created internally)
 * eventBus.publish<UserCreatedData>('USER_CREATED', {
 *   userId: 'usr_123',
 *   email: 'user@example.com',
 *   createdAt: new Date(),
 * });
 *
 * // Subscribing to an event
 * eventBus.on<UserCreatedData>('USER_CREATED').subscribe((meta) => {
 *   console.log(`Event key: ${meta.key}`);
 *   console.log(`User ID: ${meta.data?.userId}`);
 *   console.log(`Timestamp: ${meta.timestamp}`);
 * });
 *
 * // Internal message structure (for reference)
 * const message: EventBusMessage<UserCreatedData> = {
 *   key: 'USER_CREATED',
 *   metadata: new EventMetaData('USER_CREATED', {
 *     userId: 'usr_123',
 *     email: 'user@example.com',
 *     createdAt: new Date(),
 *   }),
 * };
 * ```
 *
 * @see EventBusService
 * @see EventMetaData
 * @publicApi
 */
export interface EventBusMessage<T = unknown> {
  /**
   * Event key (string identifier for the event type).
   *
   * Used to categorize, route, and filter events. Subscribers listen for
   * specific keys to receive only relevant events.
   *
   * @remarks
   * - Use consistent, descriptive naming conventions (e.g., 'USER_CREATED', 'ORDER_COMPLETED').
   * - Consider using constants or enums for event keys to avoid typos.
   * - Keys are case-sensitive.
   *
   * @example
   * ```typescript
   * // Common event key patterns
   * 'USER_LOGGED_IN'
   * 'USER_LOGGED_OUT'
   * 'CART_ITEM_ADDED'
   * 'NOTIFICATION_RECEIVED'
   * 'THEME_CHANGED'
   * ```
   */
  key: string;

  /**
   * Event metadata containing details and payload.
   *
   * Encapsulates the event's unique ID, timestamp, key, and data payload.
   * The generic type `T` defines the shape of the data payload.
   *
   * @remarks
   * The metadata provides:
   * - `id` - Unique event identifier (UUID v4).
   * - `key` - Event key (same as the outer `key` property).
   * - `data` - The event payload of type `T`.
   * - `timestamp` - ISO8601 timestamp of when the event was created.
   *
   * @see EventMetaData
   *
   * @example
   * ```typescript
   * // Access metadata properties
   * eventBus.on<UserData>('USER_UPDATED').subscribe((meta) => {
   *   console.log(`Event ID: ${meta.id}`);
   *   console.log(`Event Key: ${meta.key}`);
   *   console.log(`Data: ${JSON.stringify(meta.data)}`);
   *   console.log(`Timestamp: ${meta.timestamp}`);
   * });
   * ```
   */
  metadata: EventMetaData<T>;
}
