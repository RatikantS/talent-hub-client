/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { v4 } from 'uuid';

/**
 * EventMetaData encapsulates metadata for events published via the EventBusService.
 *
 * @template T - The type of the event data payload
 *
 * Properties:
 * - id: Unique identifier for the event (UUID v4)
 * - key: Event key (string identifier for the event type)
 * - data: Optional event payload of type T
 * - timestamp: ISO8601 string of when the event was created
 */
export class EventMetaData<T> {
  /** Unique identifier for this event instance (UUID v4) */
  private readonly _id: string;
  /** Event key (string identifier for the event type) */
  private readonly _key: string;
  /** Optional event payload of type T */
  private readonly _data?: T;
  /** ISO8601 string of when the event was created */
  private readonly _timestamp: string;

  /**
   * Constructs a new EventMetaData instance.
   * @param key - Event key (required, non-empty string)
   * @param data - Optional event payload of type T
   */
  constructor(key: string, data?: T) {
    this._id = v4();
    this._key = key;
    this._data = data;
    this._timestamp = new Date().toISOString();
  }

  /**
   * Gets the unique identifier for this event instance.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the event key (string identifier for the event type).
   */
  public get key(): string {
    return this._key;
  }

  /**
   * Gets the event payload of type T, if any.
   */
  public get data(): T | undefined {
    return this._data;
  }

  /**
   * Gets the ISO8601 timestamp of when the event was created.
   */
  public get timestamp(): string {
    return this._timestamp;
  }
}
