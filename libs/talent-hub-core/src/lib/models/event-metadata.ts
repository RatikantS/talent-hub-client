/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { v4 } from 'uuid';

/**
 * EventMetaData encapsulates metadata for events published via the EventBusService.
 *
 * This class wraps event payloads with additional metadata including a unique identifier,
 * event key, timestamp, and the actual data payload. It is used internally by the
 * `EventBusService` to provide consistent event structure across the application.
 *
 * @typeParam T - The type of the event data payload. Can be any serializable type.
 *
 * @remarks
 * **Properties:**
 * - `id` - Unique identifier for the event instance (UUID v4).
 * - `key` - Event key/type identifier used for routing and filtering.
 * - `data` - Optional payload of type `T` associated with the event.
 * - `timestamp` - ISO8601 string indicating when the event was created.
 *
 * **Usage:**
 * This class is typically instantiated by the `EventBusService.publish()` method
 * and consumed by subscribers via `EventBusService.on()`. You generally don't
 * need to create instances manually unless building custom event infrastructure.
 *
 * **Immutability:**
 * All properties are readonly and set at construction time, ensuring that
 * event metadata cannot be modified after creation.
 *
 * @example
 * ```typescript
 * // Publishing an event (EventMetaData is created internally)
 * eventBus.publish('USER_LOGGED_IN', { userId: '123', email: 'user@example.com' });
 *
 * // Subscribing to an event
 * eventBus.on<UserLoginData>('USER_LOGGED_IN').subscribe((meta) => {
 *   console.log(`Event ID: ${meta.id}`);
 *   console.log(`Event Key: ${meta.key}`);
 *   console.log(`Timestamp: ${meta.timestamp}`);
 *   console.log(`User ID: ${meta.data?.userId}`);
 * });
 *
 * // Creating manually (rarely needed)
 * const event = new EventMetaData('CUSTOM_EVENT', { value: 42 });
 * console.log(event.id);        // e.g., '550e8400-e29b-41d4-a716-446655440000'
 * console.log(event.key);       // 'CUSTOM_EVENT'
 * console.log(event.data);      // { value: 42 }
 * console.log(event.timestamp); // e.g., '2026-01-27T10:30:00.000Z'
 * ```
 *
 * @see EventBusService
 * @publicApi
 */
export class EventMetaData<T> {
  /**
   * Unique identifier for this event instance.
   *
   * Generated using UUID v4 to ensure global uniqueness. Useful for
   * event tracking, logging, debugging, and deduplication.
   *
   * @internal
   */
  private readonly _id: string;

  /**
   * Event key (string identifier for the event type).
   *
   * Used to categorize and route events. Subscribers filter events by this key.
   *
   * @internal
   */
  private readonly _key: string;

  /**
   * Optional event payload of type T.
   *
   * Contains the actual data associated with the event. Can be any type
   * including objects, primitives, or arrays.
   *
   * @internal
   */
  private readonly _data?: T;

  /**
   * ISO8601 timestamp of when the event was created.
   *
   * Automatically set at construction time using `new Date().toISOString()`.
   *
   * @internal
   */
  private readonly _timestamp: string;

  /**
   * Constructs a new EventMetaData instance with the specified key and optional data.
   *
   * Automatically generates a UUID v4 for the event ID and captures the current
   * timestamp in ISO8601 format.
   *
   * @param key - The event key/type identifier. Must be a non-empty string.
   *              Use consistent naming conventions (e.g., 'USER_LOGGED_IN', 'DATA_LOADED').
   * @param data - Optional payload of type `T` to include with the event.
   *
   * @example
   * ```typescript
   * // Create event with data
   * const loginEvent = new EventMetaData('USER_LOGIN', {
   *   userId: '123',
   *   loginTime: new Date(),
   * });
   *
   * // Create event without data
   * const logoutEvent = new EventMetaData('USER_LOGOUT');
   * ```
   */
  constructor(key: string, data?: T) {
    this._id = v4();
    this._key = key;
    this._data = data;
    this._timestamp = new Date().toISOString();
  }

  /**
   * Gets the unique identifier for this event instance.
   *
   * The ID is a UUID v4 string generated at construction time. Use this
   * for event tracking, logging, correlation, or deduplication.
   *
   * @returns A UUID v4 string uniquely identifying this event.
   *
   * @example
   * ```typescript
   * const event = new EventMetaData('TEST', { value: 1 });
   * console.log(event.id); // '550e8400-e29b-41d4-a716-446655440000'
   * ```
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the event key (string identifier for the event type).
   *
   * The key is used by the `EventBusService` to route events to the
   * appropriate subscribers. Subscribers use this key to filter which
   * events they receive.
   *
   * @returns The event key string.
   *
   * @example
   * ```typescript
   * const event = new EventMetaData('USER_CREATED', { id: '123' });
   * console.log(event.key); // 'USER_CREATED'
   * ```
   */
  public get key(): string {
    return this._key;
  }

  /**
   * Gets the event payload of type T, if any.
   *
   * Returns the data passed to the constructor, or `undefined` if no
   * data was provided. The type is inferred from the generic parameter `T`.
   *
   * @returns The event payload of type `T`, or `undefined`.
   *
   * @example
   * ```typescript
   * interface UserData {
   *   id: string;
   *   name: string;
   * }
   *
   * const event = new EventMetaData<UserData>('USER_UPDATED', {
   *   id: '123',
   *   name: 'John Doe',
   * });
   *
   * console.log(event.data?.id);   // '123'
   * console.log(event.data?.name); // 'John Doe'
   * ```
   */
  public get data(): T | undefined {
    return this._data;
  }

  /**
   * Gets the ISO8601 timestamp of when the event was created.
   *
   * The timestamp is automatically captured at construction time and
   * formatted as an ISO8601 string (e.g., '2026-01-27T10:30:00.000Z').
   * Use this for event ordering, logging, or time-based filtering.
   *
   * @returns An ISO8601 formatted timestamp string.
   *
   * @example
   * ```typescript
   * const event = new EventMetaData('DATA_SAVED', { recordId: 42 });
   * console.log(event.timestamp); // '2026-01-27T10:30:00.000Z'
   *
   * // Parse as Date if needed
   * const eventDate = new Date(event.timestamp);
   * ```
   */
  public get timestamp(): string {
    return this._timestamp;
  }
}
