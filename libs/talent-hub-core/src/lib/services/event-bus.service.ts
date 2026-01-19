/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

import { EventBusMessage } from '../interfaces';
import { EventMetaData } from '../models';

/**
 * EventBusService provides a simple, type-safe pub-sub mechanism for application-wide events.
 *
 * - Uses RxJS Subject for event publishing and subscribing
 * - Type-safe publish and subscribe methods
 * - Only allows publishing with a valid key
 * - Follows Angular and TypeScript best practices
 */
@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly eventSubject: Subject<EventBusMessage> = new Subject<EventBusMessage>();

  /**
   * Publish an event with a key and optional data.
   * Throws if the key is empty or only whitespace.
   *
   * @template T - Type of the event data
   * @param key - Event key (required, non-empty string)
   * @param data - Event data (optional)
   */
  publish<T>(key: string, data?: T): void {
    if (!key.trim().length) {
      throw new Error('key must not be empty');
    }
    const metadata: EventMetaData<T> = new EventMetaData<T>(key, data);
    this.eventSubject.next({ key, metadata });
  }

  /**
   * Subscribe to events of a specific key.
   * Throws if the key is empty or only whitespace.
   *
   * @template T - Type of the event data
   * @param key - Event key to listen for (required, non-empty string)
   * @returns Observable of EventMetaData<T> for the given key
   */
  on<T>(key: string): Observable<EventMetaData<T>> {
    if (!key.trim().length) {
      throw new Error('key must not be empty');
    }
    return this.eventSubject.asObservable().pipe(
      filter((event: EventBusMessage): event is EventBusMessage<T> => event.key === key),
      map((event: EventBusMessage): EventMetaData<T> => event.metadata as EventMetaData<T>),
    );
  }
}
